// Глобальные переменные
let favorites = [];
let compareList = [];
let currentView = 'grid';

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
    setupEventListeners();
    updateCompareSection();
});

// Загрузка избранных туров
function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    renderFavorites();
    updateFavoritesCount();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение вида
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            toggleView();
        });
    });
    
    // Фильтры и сортировка
    document.getElementById('sortSelect').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('durationFilter').addEventListener('change', applyFilters);
    
    // Очистка фильтров
    document.querySelector('.clear-filters-btn').addEventListener('click', clearFilters);
    
    // Кнопки сравнения
    document.getElementById('compareBtn').addEventListener('click', showCompareModal);
    document.getElementById('clearCompareBtn').addEventListener('click', clearCompareList);
    
    // Закрытие модального окна
    document.querySelector('.modal-close').addEventListener('click', closeCompareModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeCompareModal);
}

// Отрисовка избранных туров
function renderFavorites() {
    const gridContainer = document.getElementById('favoritesGrid');
    const listContainer = document.getElementById('favoritesList');
    const emptyState = document.getElementById('emptyFavorites');
    
    if (favorites.length === 0) {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    gridContainer.style.display = 'grid';
    listContainer.style.display = 'none';
    emptyState.style.display = 'none';
    
    // Очищаем контейнеры
    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';
    
    // Добавляем туры
    favorites.forEach(tour => {
        const gridCard = createGridCard(tour);
        const listItem = createListItem(tour);
        
        gridContainer.appendChild(gridCard);
        listContainer.appendChild(listItem);
    });
    
    // Применяем текущий вид
    toggleView();
}

// Создание карточки для сетки
function createGridCard(tour) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML = `
        <div class="favorite-card-image">
            <img src="${tour.image}" alt="${tour.title}">
            <div class="favorite-card-actions">
                <button class="favorite-card-btn remove" data-tour-id="${tour.id}" title="Удалить">🗑️</button>
                <button class="favorite-card-btn compare ${compareList.includes(tour.id) ? 'selected' : ''}" 
                        data-tour-id="${tour.id}" title="Добавить к сравнению">⚖️</button>
            </div>
        </div>
        <div class="favorite-card-content">
            <h3 class="favorite-card-title">${tour.title}</h3>
            <p class="favorite-card-location">📍 ${tour.location}</p>
            <p class="favorite-card-duration">⏱️ ${tour.duration}</p>
            <div class="favorite-card-footer">
                <span class="favorite-card-price">${tour.price}</span>
                <a href="${tour.url}" class="favorite-card-link">Смотреть</a>
            </div>
        </div>
    `;
    
    setupCardEventListeners(card);
    return card;
}

// Создание элемента для списка
function createListItem(tour) {
    const item = document.createElement('div');
    item.className = 'favorite-list-item';
    item.innerHTML = `
        <div class="favorite-list-image">
            <img src="${tour.image}" alt="${tour.title}">
        </div>
        <div class="favorite-list-content">
            <h3 class="favorite-list-title">${tour.title}</h3>
            <div class="favorite-list-info">
                <span>📍 ${tour.location}</span>
                <span>⏱️ ${tour.duration}</span>
            </div>
            <div class="favorite-list-footer">
                <span class="favorite-list-price">${tour.price}</span>
                <div class="favorite-list-actions">
                    <button class="favorite-card-btn remove" data-tour-id="${tour.id}" title="Удалить">🗑️</button>
                    <button class="favorite-card-btn compare ${compareList.includes(tour.id) ? 'selected' : ''}" 
                            data-tour-id="${tour.id}" title="Добавить к сравнению">⚖️</button>
                    <a href="${tour.url}" class="favorite-card-link">Смотреть</a>
                </div>
            </div>
        </div>
    `;
    
    setupCardEventListeners(item);
    return item;
}

// Настройка обработчиков для карточек
function setupCardEventListeners(container) {
    // Удаление из избранного
    container.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.getAttribute('data-tour-id');
            removeFromFavorites(tourId);
        });
    });
    
    // Добавление к сравнению
    container.querySelectorAll('.compare').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.getAttribute('data-tour-id');
            toggleCompare(tourId, this);
        });
    });
}

// Удаление из избранного
function removeFromFavorites(tourId) {
    if (confirm('Вы уверены, что хотите удалить этот тур из избранного?')) {
        favorites = favorites.filter(tour => tour.id !== tourId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Удаляем из сравнения, если там был
        compareList = compareList.filter(id => id !== tourId);
        
        loadFavorites();
        updateCompareSection();
        showNotification('Тур удален из избранного');
    }
}

// Переключение режима сравнения
function toggleCompare(tourId, button) {
    const index = compareList.indexOf(tourId);
    
    if (index === -1) {
        if (compareList.length >= 4) {
            showNotification('Можно сравнить максимум 4 тура');
            return;
        }
        compareList.push(tourId);
        button.classList.add('selected');
    } else {
        compareList.splice(index, 1);
        button.classList.remove('selected');
    }
    
    updateCompareSection();
}

// Обновление секции сравнения
function updateCompareSection() {
    const compareSection = document.getElementById('compareSection');
    const compareCount = document.getElementById('compareCount');
    const compareBtn = document.getElementById('compareBtn');
    
    if (compareList.length > 0) {
        compareSection.style.display = 'block';
        compareCount.textContent = `Выбрано туров: ${compareList.length}`;
        compareBtn.disabled = compareList.length < 2;
    } else {
        compareSection.style.display = 'none';
    }
}

// Очистка списка сравнения
function clearCompareList() {
    compareList = [];
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    updateCompareSection();
    showNotification('Список сравнения очищен');
}

// Показ модального окна сравнения
function showCompareModal() {
    const modal = document.getElementById('compareModal');
    const compareTable = document.getElementById('compareTable');
    
    // Получаем туры для сравнения
    const compareTours = favorites.filter(tour => compareList.includes(tour.id));
    
    // Создаем таблицу сравнения
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Характеристика</th>
    `;
    
    compareTours.forEach(tour => {
        tableHTML += `<th>${tour.title}</th>`;
    });
    
    tableHTML += `
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Направление</td>
    `;
    
    compareTours.forEach(tour => {
        tableHTML += `<td>${tour.location}</td>`;
    });
    
    tableHTML += `
                </tr>
                <tr>
                    <td>Длительность</td>
    `;
    
    compareTours.forEach(tour => {
        tableHTML += `<td>${tour.duration}</td>`;
    });
    
    tableHTML += `
                </tr>
                <tr>
                    <td>Цена</td>
    `;
    
    compareTours.forEach(tour => {
        tableHTML += `<td><strong>${tour.price}</strong></td>`;
    });
    
    tableHTML += `
                </tr>
                <tr>
                    <td>Действия</td>
    `;
    
    compareTours.forEach(tour => {
        tableHTML += `
            <td>
                <a href="${tour.url}" class="favorite-card-link" style="display: inline-block; text-align: center;">Смотреть</a>
            </td>
        `;
    });
    
    tableHTML += `
                </tr>
            </tbody>
        </table>
    `;
    
    compareTable.innerHTML = tableHTML;
    modal.style.display = 'block';
}

// Закрытие модального окна сравнения
function closeCompareModal() {
    document.getElementById('compareModal').style.display = 'none';
}

// Переключение вида (сетка/список)
function toggleView() {
    const gridContainer = document.getElementById('favoritesGrid');
    const listContainer = document.getElementById('favoritesList');
    
    if (currentView === 'grid') {
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    } else {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'flex';
    }
}

// Применение фильтров и сортировки
function applyFilters() {
    const sortBy = document.getElementById('sortSelect').value;
    const maxPrice = document.getElementById('priceFilter').value;
    const duration = document.getElementById('durationFilter').value;
    
    let filteredFavorites = [...favorites];
    
    // Фильтр по цене
    if (maxPrice) {
        filteredFavorites = filteredFavorites.filter(tour => {
            const price = parseInt(tour.price.replace(/\D/g, ''));
            return price <= parseInt(maxPrice);
        });
    }
    
    // Фильтр по длительности
    if (duration) {
        filteredFavorites = filteredFavorites.filter(tour => {
            const days = parseInt(tour.duration);
            switch (duration) {
                case '3-5':
                    return days >= 3 && days <= 5;
                case '7-10':
                    return days >= 7 && days <= 10;
                case '11-14':
                    return days >= 11 && days <= 14;
                case '15+':
                    return days >= 15;
                default:
                    return true;
            }
        });
    }
    
    // Сортировка
    switch (sortBy) {
        case 'price-asc':
            filteredFavorites.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/\D/g, ''));
                const priceB = parseInt(b.price.replace(/\D/g, ''));
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            filteredFavorites.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/\D/g, ''));
                const priceB = parseInt(b.price.replace(/\D/g, ''));
                return priceB - priceA;
            });
            break;
        case 'name':
            filteredFavorites.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'date':
        default:
            // Сортировка по дате добавления (если есть поле date)
            filteredFavorites.sort((a, b) => (a.date || 0) - (b.date || 0));
            break;
    }
    
    // Обновляем отображение
    const tempFavorites = favorites;
    favorites = filteredFavorites;
    renderFavorites();
    favorites = tempFavorites;
    
    updateFavoritesCount();
}

// Очистка фильтров
function clearFilters() {
    document.getElementById('sortSelect').value = 'date';
    document.getElementById('priceFilter').value = '';
    document.getElementById('durationFilter').value = '';
    
    loadFavorites();
    showNotification('Фильтры очищены');
}

// Обновление счетчика избранных туров
function updateFavoritesCount() {
    const count = favorites.length;
    const countElement = document.getElementById('favoritesCount');
    
    if (count === 0) {
        countElement.textContent = 'Нет туров в избранном';
    } else if (count === 1) {
        countElement.textContent = '1 тур в избранном';
    } else if (count < 5) {
        countElement.textContent = `${count} тура в избранном`;
    } else {
        countElement.textContent = `${count} туров в избранном`;
    }
}

// Показ уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #222;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обработка мобильного меню
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });
});
