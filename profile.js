// Переключение вкладок
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс выбранной кнопке и контенту
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Загружаем избранные туры при переключении на вкладку
            if (targetTab === 'favorites') {
                loadFavorites();
            }
        });
    });
    
    // Загружаем избранные туры при первой загрузке страницы
    loadFavorites();
});

// Загрузка избранных туров
function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const emptyFavorites = document.getElementById('emptyFavorites');
    
    // Получаем избранные туры из localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        favoritesList.style.display = 'none';
        emptyFavorites.style.display = 'block';
    } else {
        favoritesList.style.display = 'grid';
        emptyFavorites.style.display = 'none';
        
        // Очищаем список
        favoritesList.innerHTML = '';
        
        // Добавляем избранные туры
        favorites.forEach(tour => {
            const tourCard = createFavoriteTourCard(tour);
            favoritesList.appendChild(tourCard);
        });
    }
}

// Создание карточки избранного тура
function createFavoriteTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'favorite-tour-card';
    card.innerHTML = `
        <div class="favorite-tour-image">
            <img src="${tour.image}" alt="${tour.title}">
            <button class="remove-favorite-btn" data-tour-id="${tour.id}">×</button>
        </div>
        <div class="favorite-tour-content">
            <h3>${tour.title}</h3>
            <p class="favorite-tour-location">📍 ${tour.location}</p>
            <p class="favorite-tour-duration">⏱️ ${tour.duration}</p>
            <div class="favorite-tour-footer">
                <span class="favorite-tour-price">${tour.price}</span>
                <a href="${tour.url}" class="view-tour-btn">Смотреть</a>
            </div>
        </div>
    `;
    
    // Добавляем стили для карточки
    const style = document.createElement('style');
    if (!document.querySelector('#favorite-tour-styles')) {
        style.id = 'favorite-tour-styles';
        style.textContent = `
            .favorite-tour-card {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .favorite-tour-card:hover {
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }
            
            .favorite-tour-image {
                position: relative;
                height: 200px;
            }
            
            .favorite-tour-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .remove-favorite-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                color: #222;
                transition: all 0.3s ease;
            }
            
            .remove-favorite-btn:hover {
                background: #dc3545;
                color: white;
                transform: scale(1.1);
            }
            
            .favorite-tour-content {
                padding: 20px;
            }
            
            .favorite-tour-content h3 {
                font-size: 16px;
                margin-bottom: 10px;
                color: #222;
            }
            
            .favorite-tour-location,
            .favorite-tour-duration {
                font-size: 14px;
                color: #717171;
                margin-bottom: 5px;
            }
            
            .favorite-tour-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
            }
            
            .favorite-tour-price {
                font-size: 16px;
                font-weight: 700;
                color: #FF385C;
            }
            
            .view-tour-btn {
                background: #FF385C;
                color: white;
                text-decoration: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .view-tour-btn:hover {
                background: #E31C5F;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Обработка удаления из избранного
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', function() {
        removeFromFavorites(tour.id);
        card.remove();
        
        // Проверяем, остались ли еще туры
        const remainingCards = favoritesList.querySelectorAll('.favorite-tour-card');
        if (remainingCards.length === 0) {
            favoritesList.style.display = 'none';
            emptyFavorites.style.display = 'block';
        }
        
        showNotification('Тур удален из избранного');
    });
    
    return card;
}

// Удаление из избранного
function removeFromFavorites(tourId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(tour => tour.id !== tourId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
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

// Обработка формы настроек
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.save-settings-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Сохранение...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Сохранено!';
                submitBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '#FF385C';
                    submitBtn.disabled = false;
                }, 2000);
                
                showNotification('Настройки успешно сохранены');
            }, 1500);
        });
    }
});

// Обработка кнопок бронирования
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка "Подробнее"
    document.querySelectorAll('.view-booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Открываем детальную информацию о бронировании');
        });
    });
    
    // Кнопка "Скачать билет"
    document.querySelectorAll('.download-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Загрузка билета начата');
        });
    });
    
    // Кнопка "Оплатить"
    document.querySelectorAll('.pay-booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Переход к оплате...');
        });
    });
    
    // Кнопка "Отменить"
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите отменить бронирование?')) {
                showNotification('Бронирование отменено');
            }
        });
    });
    
    // Кнопка "Оставить отзыв"
    document.querySelectorAll('.review-booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showReviewModal();
        });
    });
    
    // Кнопка "Забронировать снова"
    document.querySelectorAll('.book-again-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Переход к бронированию...');
        });
    });
});

// Модальное окно отзыва
function showReviewModal() {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Оставить отзыв</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="review-form">
                    <div class="form-group">
                        <label>Оценка</label>
                        <div class="rating-stars">
                            <span class="star" data-rating="1">⭐</span>
                            <span class="star" data-rating="2">⭐</span>
                            <span class="star" data-rating="3">⭐</span>
                            <span class="star" data-rating="4">⭐</span>
                            <span class="star" data-rating="5">⭐</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Заголовок отзыва</label>
                        <input type="text" placeholder="Краткое впечатление" required>
                    </div>
                    <div class="form-group">
                        <label>Текст отзыва</label>
                        <textarea rows="4" placeholder="Расскажите о вашем путешествии" required></textarea>
                    </div>
                    <button type="submit" class="submit-review-btn">Отправить отзыв</button>
                </form>
            </div>
        </div>
    `;
    
    // Стили модального окна
    const style = document.createElement('style');
    style.textContent = `
        .review-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            max-width: 500px;
            margin: 50px auto;
            border-radius: 20px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 25px 0;
        }
        
        .modal-header h3 {
            font-size: 24px;
            color: #222;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 30px;
            cursor: pointer;
            color: #717171;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #222;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .review-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            margin-bottom: 8px;
            font-weight: 500;
            color: #222;
        }
        
        .form-group input,
        .form-group textarea {
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #FF385C;
        }
        
        .rating-stars {
            display: flex;
            gap: 10px;
        }
        
        .star {
            font-size: 24px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .star:hover {
            transform: scale(1.2);
        }
        
        .star.active {
            color: #FFD700;
        }
        
        .submit-review-btn {
            background: #FF385C;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-review-btn:hover {
            background: #E31C5F;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Обработка рейтинга
    let selectedRating = 0;
    const stars = modal.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStars(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating);
        });
    });
    
    modal.querySelector('.rating-stars').addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });
    
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Обработка закрытия модального окна
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.remove();
        style.remove();
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Обработка формы отзыва
    const reviewForm = modal.querySelector('.review-form');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedRating === 0) {
            showNotification('Пожалуйста, поставьте оценку');
            return;
        }
        
        const submitBtn = this.querySelector('.submit-review-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Отправлено!';
            submitBtn.style.background = '#28a745';
            
            setTimeout(() => {
                closeModal();
                showNotification('Спасибо за ваш отзыв!');
            }, 1500);
        }, 2000);
    });
}

// Обработка загрузки документов
document.addEventListener('DOMContentLoaded', function() {
    const documentUpload = document.getElementById('documentUpload');
    if (documentUpload) {
        documentUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    showNotification(`Файл ${file.name} слишком большой. Максимальный размер 5MB`);
                    return;
                }
                
                // Имитация загрузки файла
                showNotification(`Файл ${file.name} загружен`);
                
                // Добавляем файл в список
                addDocumentToList(file);
            });
            
            // Очищаем input
            this.value = '';
        });
    }
});

// Добавление документа в список
function addDocumentToList(file) {
    const documentsList = document.querySelector('.documents-list');
    if (!documentsList) return;
    
    const documentItem = document.createElement('div');
    documentItem.className = 'document-item';
    documentItem.innerHTML = `
        <div class="document-file">
            <span class="file-icon">📄</span>
            <div class="file-info">
                <h5>${file.name}</h5>
                <p>${(file.size / 1024 / 1024).toFixed(1)} MB • Загружен ${new Date().toLocaleDateString('ru-RU')}</p>
            </div>
        </div>
        <div class="document-actions">
            <button class="download-btn">Скачать</button>
            <button class="delete-btn">Удалить</button>
        </div>
    `;
    
    // Обработка кнопок
    documentItem.querySelector('.download-btn').addEventListener('click', function() {
        showNotification('Скачивание файла...');
    });
    
    documentItem.querySelector('.delete-btn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить этот документ?')) {
            documentItem.remove();
            showNotification('Документ удален');
        }
    });
    
    documentsList.appendChild(documentItem);
}

// Обработка кнопок безопасности
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.security-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            
            if (text.includes('Удалить аккаунт')) {
                if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                    showNotification('Запрос на удаление аккаунта отправлен');
                }
            } else {
                showNotification(`Переход к ${text.toLowerCase()}...`);
            }
        });
    });
});
