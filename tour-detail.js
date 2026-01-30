// Смена основного изображения
function changeImage(thumbnail, newSrc) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Убираем активный класс у всех миниатюр
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Добавляем активный класс выбранной миниатюре
    thumbnail.classList.add('active');
    
    // Меняем основное изображение с плавным переходом
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
    }, 200);
}

// Обработка кнопки избранного
document.addEventListener('DOMContentLoaded', function() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    let isFavorite = false;
    
    favoriteBtn.addEventListener('click', function() {
        isFavorite = !isFavorite;
        
        if (isFavorite) {
            this.classList.add('active');
            this.querySelector('.heart-icon').textContent = '♥';
            
            // Показываем уведомление
            showNotification('Добавлено в избранное');
            
            // Сохраняем в localStorage
            saveToFavorites();
        } else {
            this.classList.remove('active');
            this.querySelector('.heart-icon').textContent = '♡';
            
            showNotification('Удалено из избранного');
            
            // Удаляем из localStorage
            removeFromFavorites();
        }
    });
    
    // Проверяем, находится ли тур в избранном при загрузке
    checkFavoriteStatus();
});

// Функция сохранения в избранное
function saveToFavorites() {
    const tourData = {
        id: 'italy-romantic',
        title: 'Романтическая Италия',
        location: 'Рим, Флоренция, Венеция',
        price: '89 900 ₽',
        duration: '7 дней / 6 ночей',
        image: 'media/italia.jpg',
        url: 'tour-detail.html'
    };
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Проверяем, нет ли уже этого тура в избранном
    const existingIndex = favorites.findIndex(tour => tour.id === tourData.id);
    
    if (existingIndex === -1) {
        favorites.push(tourData);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Функция удаления из избранного
function removeFromFavorites() {
    const tourId = 'italy-romantic';
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    favorites = favorites.filter(tour => tour.id !== tourId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Проверка статуса избранного
function checkFavoriteStatus() {
    const tourId = 'italy-romantic';
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    const isFavorite = favorites.some(tour => tour.id === tourId);
    
    if (isFavorite) {
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('.heart-icon').textContent = '♥';
    }
}

// Показ уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Стили уведомления
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
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обработка кнопок бронирования
document.addEventListener('DOMContentLoaded', function() {
    const bookBtn = document.querySelector('.book-btn');
    const mobileBookBtn = document.querySelector('.mobile-book-btn');
    
    function handleBooking() {
        // Показываем модальное окно бронирования
        showBookingModal();
    }
    
    if (bookBtn) {
        bookBtn.addEventListener('click', handleBooking);
    }
    
    if (mobileBookBtn) {
        mobileBookBtn.addEventListener('click', handleBooking);
    }
});

// Модальное окно бронирования
function showBookingModal() {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Бронирование тура</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="booking-form">
                    <div class="form-group">
                        <label>Имя и фамилия</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="tel" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label>Количество человек</label>
                        <select>
                            <option value="1">1 человек</option>
                            <option value="2">2 человека</option>
                            <option value="3">3 человека</option>
                            <option value="4">4 человека</option>
                            <option value="5+">5+ человек</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Дата начала тура</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Комментарий</label>
                        <textarea rows="3" placeholder="Дополнительная информация"></textarea>
                    </div>
                    <button type="submit" class="submit-booking-btn">Отправить заявку</button>
                </form>
            </div>
        </div>
    `;
    
    // Стили модального окна
    const style = document.createElement('style');
    style.textContent = `
        .booking-modal {
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
        
        .booking-form {
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
        .form-group select,
        .form-group textarea {
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #FF385C;
        }
        
        .submit-booking-btn {
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
        
        .submit-booking-btn:hover {
            background: #E31C5F;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Обработка закрытия модального окна
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.remove();
        style.remove();
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Обработка формы бронирования
    const bookingForm = modal.querySelector('.booking-form');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-booking-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Отправлено!';
            submitBtn.style.background = '#00C851';
            
            setTimeout(() => {
                closeModal();
                showNotification('Заявка на бронирование отправлена! Мы свяжемся с вами в ближайшее время.');
            }, 1500);
        }, 2000);
    });
    
    // Установка минимальной даты
    const dateInput = modal.querySelector('input[type="date"]');
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
}

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.day-card, .include-item, .review-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Инициализация анимаций
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Установка начальных стилей для анимации
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.day-card, .include-item, .review-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});
