// Глобальные переменные
let searchResults = [];
let currentPage = 1;
let resultsPerPage = 9;
let currentView = 'grid';
let searchFilters = {};

// База данных туров (имитация)
const toursDatabase = [
    {
        id: 'italy-romantic',
        title: 'Романтическая Италия',
        location: 'Рим, Флоренция, Венеция',
        country: 'Италия',
        region: 'europe',
        price: 89900,
        duration: 7,
        type: 'romantic',
        rating: 4.8,
        reviews: 234,
        image: 'media/italia.jpg',
        season: ['spring', 'summer', 'autumn'],
        activities: ['shopping', 'hiking'],
        hotelRating: 4,
        meal: 'bb',
        amenities: ['wifi', 'spa'],
        badge: 'Популярное'
    },
    {
        id: 'thailand-tropical',
        title: 'Тропический Таиланд',
        location: 'Бангкок, Пхукет, Паттайя',
        country: 'Таиланд',
        region: 'asia',
        price: 65000,
        duration: 10,
        type: 'beach',
        rating: 4.6,
        reviews: 189,
        image: 'media/tailand.jpg',
        season: ['winter', 'summer'],
        activities: ['diving', 'surfing'],
        hotelRating: 5,
        meal: 'fb',
        amenities: ['wifi', 'pool', 'beach', 'spa'],
        badge: 'Хит продаж'
    },
    {
        id: 'turkey-all-inclusive',
        title: 'Все включено в Турции',
        location: 'Анталия, Белек, Кемер',
        country: 'Турция',
        region: 'asia',
        price: 45000,
        duration: 7,
        type: 'beach',
        rating: 4.5,
        reviews: 412,
        image: 'media/turcia.jpg',
        season: ['summer', 'autumn'],
        activities: ['diving', 'shopping'],
        hotelRating: 5,
        meal: 'fb',
        amenities: ['wifi', 'pool', 'beach', 'spa', 'gym'],
        badge: 'Выгодно'
    },
    {
        id: 'france-adventure',
        title: 'Приключения во Франции',
        location: 'Париж, Лион, Ницца',
        country: 'Франция',
        region: 'europe',
        price: 120000,
        duration: 12,
        type: 'adventure',
        rating: 4.9,
        reviews: 156,
        image: 'media/paris.jpg',
        season: ['spring', 'summer', 'autumn'],
        activities: ['hiking', 'shopping'],
        hotelRating: 4,
        meal: 'hb',
        amenities: ['wifi', 'spa', 'gym'],
        badge: 'Эксклюзив'
    },
    {
        id: 'egypt-pyramids',
        title: 'Пирамиды Египта',
        location: 'Каир, Луксор, Хургада',
        country: 'Египет',
        region: 'africa',
        price: 55000,
        duration: 8,
        type: 'excursion',
        rating: 4.4,
        reviews: 278,
        image: 'media/bali.jpg',
        season: ['autumn', 'winter', 'spring'],
        activities: ['diving', 'shopping'],
        hotelRating: 4,
        meal: 'bb',
        amenities: ['wifi', 'pool', 'beach'],
        badge: null
    },
    {
        id: 'maldives-paradise',
        title: 'Рай Мальдив',
        location: 'Мале, атолл Ари',
        country: 'Мальдивы',
        region: 'asia',
        price: 180000,
        duration: 7,
        type: 'beach',
        rating: 4.9,
        reviews: 312,
        image: 'media/bali.jpg',
        season: ['winter', 'summer'],
        activities: ['diving', 'surfing'],
        hotelRating: 5,
        meal: 'fb',
        amenities: ['wifi', 'pool', 'beach', 'spa'],
        badge: 'Премиум'
    },
    {
        id: 'japan-culture',
        title: 'Культура Японии',
        location: 'Токио, Киото, Осака',
        country: 'Япония',
        region: 'asia',
        price: 150000,
        duration: 14,
        type: 'excursion',
        rating: 4.8,
        reviews: 198,
        image: 'media/tokio.jpg',
        season: ['spring', 'autumn'],
        activities: ['shopping', 'hiking'],
        hotelRating: 4,
        meal: 'bb',
        amenities: ['wifi', 'spa', 'gym'],
        badge: 'Популярное'
    },
    {
        id: 'greece-islands',
        title: 'Острова Греции',
        location: 'Афины, Санторини, Миконос',
        country: 'Греция',
        region: 'europe',
        price: 75000,
        duration: 10,
        type: 'beach',
        rating: 4.7,
        reviews: 245,
        image: 'media/bali.jpg',
        season: ['summer', 'autumn'],
        activities: ['diving', 'shopping'],
        hotelRating: 4,
        meal: 'hb',
        amenities: ['wifi', 'pool', 'beach'],
        badge: null
    },
    {
        id: 'usa-road-trip',
        title: 'Road Trip по США',
        location: 'Нью-Йорк, Лос-Анджелес, Лас-Вегас',
        country: 'США',
        region: 'america',
        price: 200000,
        duration: 21,
        type: 'adventure',
        rating: 4.6,
        reviews: 167,
        image: 'media/New-Yourk.jpg',
        season: ['summer', 'autumn'],
        activities: ['shopping', 'hiking'],
        hotelRating: 4,
        meal: 'ro',
        amenities: ['wifi', 'gym'],
        badge: 'Приключение'
    }
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeDates();
    loadInitialResults();
    setupDestinationSuggestions();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Форма поиска
    document.getElementById('advancedSearchForm').addEventListener('submit', handleSearch);
    
    // Переключение дополнительных фильтров
    document.getElementById('toggleFilters').addEventListener('click', toggleAdditionalFilters);
    
    // Сброс фильтров
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Сортировка
    document.getElementById('sortResults').addEventListener('change', handleSort);
    
    // Переключение вида
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            toggleView();
        });
    });
    
    // Популярные направления
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const destination = this.getAttribute('data-destination');
            document.getElementById('destination').value = destination;
            handleSearch();
        });
    });
    
    // Боковые фильтры
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Инициализация дат
function initializeDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    checkinInput.min = today.toISOString().split('T')[0];
    checkoutInput.min = tomorrow.toISOString().split('T')[0];
    
    checkinInput.value = today.toISOString().split('T')[0];
    checkoutInput.value = tomorrow.toISOString().split('T')[0];
    
    checkinInput.addEventListener('change', function() {
        const newCheckout = new Date(this.value);
        newCheckout.setDate(newCheckout.getDate() + 1);
        checkoutInput.min = newCheckout.toISOString().split('T')[0];
        
        if (new Date(checkoutInput.value) <= new Date(this.value)) {
            checkoutInput.value = newCheckout.toISOString().split('T')[0];
        }
    });
}

// Подсказки направлений
function setupDestinationSuggestions() {
    const destinationInput = document.getElementById('destination');
    const suggestionsContainer = document.getElementById('destinationSuggestions');
    
    const destinations = [
        'Турция', 'Египет', 'Италия', 'Испания', 'Греция',
        'Таиланд', 'Мальдивы', 'ОАЭ', 'Кипр', 'Вьетнам',
        'Франция', 'Германия', 'Япония', 'Китай', 'Индия',
        'США', 'Мексика', 'Бразилия', 'Аргентина', 'Чили'
    ];
    
    destinationInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        if (value.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const matches = destinations.filter(dest => 
            dest.toLowerCase().includes(value)
        );
        
        if (matches.length > 0) {
            suggestionsContainer.innerHTML = matches.map(dest => 
                `<div class="suggestion-item">${dest}</div>`
            ).join('');
            
            suggestionsContainer.style.display = 'block';
            
            // Обработка клика на подсказку
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    destinationInput.value = this.textContent;
                    suggestionsContainer.style.display = 'none';
                });
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Скрытие подсказок при клике вне
    document.addEventListener('click', function(e) {
        if (!destinationInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Загрузка начальных результатов
function loadInitialResults() {
    searchResults = [...toursDatabase];
    renderResults();
    updateResultsCount();
}

// Обработка поиска
function handleSearch(e) {
    if (e) {
        e.preventDefault();
    }
    
    const destination = document.getElementById('destination').value.toLowerCase();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const duration = document.getElementById('duration').value;
    const tourType = document.getElementById('tourType').value;
    
    // Сохраняем фильтры
    searchFilters = {
        destination,
        checkin,
        checkout,
        guests,
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        duration,
        tourType
    };
    
    // Фильтрация результатов
    searchResults = toursDatabase.filter(tour => {
        // Фильтр по направлению
        if (destination && !tour.title.toLowerCase().includes(destination) && 
            !tour.location.toLowerCase().includes(destination) &&
            !tour.country.toLowerCase().includes(destination)) {
            return false;
        }
        
        // Фильтр по цене
        if (searchFilters.minPrice && tour.price < searchFilters.minPrice) {
            return false;
        }
        if (searchFilters.maxPrice && tour.price > searchFilters.maxPrice) {
            return false;
        }
        
        // Фильтр по длительности
        if (duration) {
            const [min, max] = duration.split('-').map(d => d === '+' ? 999 : parseInt(d));
            if (max) {
                if (tour.duration < min || tour.duration > max) return false;
            } else {
                if (tour.duration < min) return false;
            }
        }
        
        // Фильтр по типу
        if (tourType && tour.type !== tourType) {
            return false;
        }
        
        return true;
    });
    
    // Применяем дополнительные фильтры
    applyAdditionalFilters();
    
    currentPage = 1;
    renderResults();
    updateResultsCount();
    updateSearchQuery();
    
    // Прокрутка к результатам
    document.querySelector('.search-results').scrollIntoView({
        behavior: 'smooth'
    });
}

// Применение дополнительных фильтров
function applyAdditionalFilters() {
    const checkedRatings = Array.from(document.querySelectorAll('.rating-options input:checked'))
        .map(cb => parseInt(cb.value));
    const checkedMeals = Array.from(document.querySelectorAll('.meal-options input:checked'))
        .map(cb => cb.value);
    const checkedAmenities = Array.from(document.querySelectorAll('.amenity-options input:checked'))
        .map(cb => cb.value);
    
    // Фильтры из боковой панели
    const checkedRegions = Array.from(document.querySelectorAll('.filters-sidebar input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    searchResults = searchResults.filter(tour => {
        // Фильтр по рейтингу отеля
        if (checkedRatings.length > 0 && !checkedRatings.includes(tour.hotelRating)) {
            return false;
        }
        
        // Фильтр по питанию
        if (checkedMeals.length > 0 && !checkedMeals.includes(tour.meal)) {
            return false;
        }
        
        // Фильтр по удобствам
        if (checkedAmenities.length > 0) {
            const hasAllAmenities = checkedAmenities.every(amenity => 
                tour.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }
        
        // Фильтр по региону
        if (checkedRegions.length > 0 && !checkedRegions.includes(tour.region)) {
            return false;
        }
        
        return true;
    });
}

// Применение фильтров
function applyFilters() {
    handleSearch();
}

// Переключение дополнительных фильтров
function toggleAdditionalFilters() {
    const filters = document.getElementById('additionalFilters');
    const button = document.getElementById('toggleFilters');
    const span = button.querySelector('span');
    
    if (filters.style.display === 'none') {
        filters.style.display = 'block';
        span.textContent = '▲';
        button.innerHTML = '<span>▲</span> Меньше фильтров';
    } else {
        filters.style.display = 'none';
        span.textContent = '▼';
        button.innerHTML = '<span>▼</span> Больше фильтров';
    }
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('advancedSearchForm').reset();
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    initializeDates();
    searchFilters = {};
    loadInitialResults();
    
    showNotification('Фильтры сброшены');
}

// Обработка сортировки
function handleSort() {
    const sortBy = document.getElementById('sortResults').value;
    
    switch (sortBy) {
        case 'price-asc':
            searchResults.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            searchResults.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            searchResults.sort((a, b) => b.rating - a.rating);
            break;
        case 'duration':
            searchResults.sort((a, b) => a.duration - b.duration);
            break;
        case 'relevance':
        default:
            // Возвращаем исходный порядок
            searchResults.sort((a, b) => toursDatabase.indexOf(a) - toursDatabase.indexOf(b));
            break;
    }
    
    renderResults();
}

// Отрисовка результатов
function renderResults() {
    const gridContainer = document.getElementById('resultsGrid');
    const listContainer = document.getElementById('resultsList');
    const noResults = document.getElementById('noResults');
    
    if (searchResults.length === 0) {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    gridContainer.style.display = 'grid';
    listContainer.style.display = 'none';
    noResults.style.display = 'none';
    
    // Пагинация
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    
    // Очищаем контейнеры
    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';
    
    // Добавляем результаты
    paginatedResults.forEach(tour => {
        const gridCard = createResultCard(tour);
        const listItem = createResultListItem(tour);
        
        gridContainer.appendChild(gridCard);
        listContainer.appendChild(listItem);
    });
    
    // Обновляем пагинацию
    renderPagination();
    
    // Применяем текущий вид
    toggleView();
}

// Создание карточки результата
function createResultCard(tour) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const isFavorite = checkIfFavorite(tour.id);
    
    card.innerHTML = `
        <div class="result-card-image">
            <img src="${tour.image}" alt="${tour.title}">
            ${tour.badge ? `<div class="result-card-badge">${tour.badge}</div>` : ''}
            <button class="result-card-favorite ${isFavorite ? 'active' : ''}" data-tour-id="${tour.id}">
                ${isFavorite ? '♥' : '♡'}
            </button>
        </div>
        <div class="result-card-content">
            <h3 class="result-card-title">${tour.title}</h3>
            <p class="result-card-location">📍 ${tour.location}</p>
            <p class="result-card-duration">⏱️ ${tour.duration} дней</p>
            <div class="result-card-rating">
                <span class="stars">${'★'.repeat(Math.floor(tour.rating))}</span>
                <span>${tour.rating} (${tour.reviews} отзывов)</span>
            </div>
            <div class="result-card-footer">
                <span class="result-card-price">${tour.price.toLocaleString('ru-RU')} ₽</span>
                <a href="tour-detail.html" class="result-card-link">Подробнее</a>
            </div>
        </div>
    `;
    
    setupResultCardEventListeners(card);
    return card;
}

// Создание элемента списка
function createResultListItem(tour) {
    const item = document.createElement('div');
    item.className = 'result-list-item';
    
    const isFavorite = checkIfFavorite(tour.id);
    
    item.innerHTML = `
        <div class="result-list-image">
            <img src="${tour.image}" alt="${tour.title}">
        </div>
        <div class="result-list-content">
            <h3 class="result-list-title">${tour.title}</h3>
            <div class="result-list-info">
                <span>📍 ${tour.location}</span>
                <span>⏱️ ${tour.duration} дней</span>
                <span class="stars">${'★'.repeat(Math.floor(tour.rating))} ${tour.rating}</span>
            </div>
            <div class="result-list-footer">
                <span class="result-list-price">${tour.price.toLocaleString('ru-RU')} ₽</span>
                <div class="result-list-actions">
                    <button class="result-card-favorite ${isFavorite ? 'active' : ''}" data-tour-id="${tour.id}">
                        ${isFavorite ? '♥' : '♡'}
                    </button>
                    <a href="tour-detail.html" class="result-card-link">Подробнее</a>
                </div>
            </div>
        </div>
    `;
    
    setupResultCardEventListeners(item);
    return item;
}

// Настройка обработчиков для карточек результатов
function setupResultCardEventListeners(container) {
    // Избранное
    container.querySelectorAll('.result-card-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.getAttribute('data-tour-id');
            toggleFavorite(tourId, this);
        });
    });
}

// Проверка, находится ли тур в избранном
function checkIfFavorite(tourId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(tour => tour.id === tourId);
}

// Переключение избранного
function toggleFavorite(tourId, button) {
    const tour = toursDatabase.find(t => t.id === tourId);
    if (!tour) return;
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(t => t.id === tourId);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push({
            id: tour.id,
            title: tour.title,
            location: tour.location,
            price: `${tour.price.toLocaleString('ru-RU')} ₽`,
            duration: `${tour.duration} дней`,
            image: tour.image,
            url: 'tour-detail.html'
        });
        
        button.classList.add('active');
        button.textContent = '♥';
        showNotification('Добавлено в избранное');
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        
        button.classList.remove('active');
        button.textContent = '♡';
        showNotification('Удалено из избранного');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Отрисовка пагинации
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Кнопка "Предыдущая"
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderResults();
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.toggle('active', i === currentPage);
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderResults();
            });
            paginationContainer.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    }
    
    // Кнопка "Следующая"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderResults();
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Переключение вида
function toggleView() {
    const gridContainer = document.getElementById('resultsGrid');
    const listContainer = document.getElementById('resultsList');
    
    if (currentView === 'grid') {
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    } else {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'flex';
    }
}

// Обновление счетчика результатов
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    countElement.textContent = searchResults.length;
}

// Обновление поискового запроса
function updateSearchQuery() {
    const queryElement = document.getElementById('searchQuery');
    const parts = [];
    
    if (searchFilters.destination) {
        parts.push(`"${searchFilters.destination}"`);
    }
    if (searchFilters.minPrice || searchFilters.maxPrice) {
        const priceRange = [];
        if (searchFilters.minPrice) priceRange.push(`от ${searchFilters.minPrice.toLocaleString('ru-RU')} ₽`);
        if (searchFilters.maxPrice) priceRange.push(`до ${searchFilters.maxPrice.toLocaleString('ru-RU')} ₽`);
        parts.push(priceRange.join(' '));
    }
    if (searchFilters.duration) {
        const durationText = searchFilters.duration.replace('-', '-').replace('+', '+');
        parts.push(`${durationText} дней`);
    }
    if (searchFilters.tourType) {
        const typeMap = {
            'beach': 'Пляжный отдых',
            'excursion': 'Экскурсионный',
            'adventure': 'Приключения',
            'romantic': 'Романтический',
            'family': 'Семейный'
        };
        parts.push(typeMap[searchFilters.tourType]);
    }
    
    if (parts.length > 0) {
        queryElement.textContent = `Поиск: ${parts.join(', ')}`;
    } else {
        queryElement.textContent = '';
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
