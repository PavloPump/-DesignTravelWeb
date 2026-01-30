// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Анимация бургер-меню
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

    // Закрытие меню при клике на ссылку
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
    const elements = document.querySelectorAll('.destination-card, .tour-card, .feature');
    
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
    const elements = document.querySelectorAll('.destination-card, .tour-card, .feature');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Обработка формы поиска
document.querySelector('.search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    
    if (!destination) {
        alert('Пожалуйста, укажите направление');
        return;
    }
    
    // Имитация поиска
    const searchBtn = document.querySelector('.search-btn');
    const originalText = searchBtn.textContent;
    searchBtn.textContent = 'Поиск...';
    searchBtn.disabled = true;
    
    setTimeout(() => {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
        
        // Прокрутка к турам
        document.getElementById('tours').scrollIntoView({
            behavior: 'smooth'
        });
    }, 1500);
});

// Обработка формы контактов
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Отправлено!';
        submitBtn.style.background = '#00C851';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#FF385C';
            submitBtn.disabled = false;
            this.reset();
        }, 2000);
    }, 1500);
});

// Обработка формы подписки
document.querySelector('.subscribe-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    const submitBtn = this.querySelector('button');
    const originalText = submitBtn.textContent;
    
    if (!email) {
        alert('Пожалуйста, введите email');
        return;
    }
    
    submitBtn.textContent = 'Подписка...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Подписано!';
        submitBtn.style.background = '#00C851';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#FF385C';
            submitBtn.disabled = false;
            this.reset();
        }, 2000);
    }, 1000);
});

// Интерактивность карточек туров
document.querySelectorAll('.tour-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tourCard = this.closest('.tour-card');
        const tourTitle = tourCard.querySelector('h3').textContent;
        
        // Имитация открытия деталей тура
        this.textContent = 'Загрузка...';
        this.disabled = true;
        
        setTimeout(() => {
            alert(`Открываем детальную информацию о туре "${tourTitle}"`);
            this.textContent = 'Подробнее';
            this.disabled = false;
        }, 1000);
    });
});

// Интерактивность карточек направлений
document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', function() {
        const destination = this.querySelector('h3').textContent;
        
        // Подстановка направления в форму поиска
        document.getElementById('destination').value = destination;
        
        // Прокрутка к форме поиска
        document.querySelector('.search-container').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Подсветка поля
        const destinationInput = document.getElementById('destination');
        destinationInput.style.borderColor = '#FF385C';
        destinationInput.focus();
        
        setTimeout(() => {
            destinationInput.style.borderColor = '#e0e0e0';
        }, 2000);
    });
});

// Проверка загрузки изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error('Изображение не найдено:', this.src);
            // Можно установить заглушку
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0xMzcuNSA5My43NUwxNTAgMTA2LjI1TDE2Mi41IDkzLjc1VjEwNi4yNUgxMzcuNVY5My43NVoiIGZpbGw9IiNDQ0MiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNCI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pgo8L3N2Zz4=';
        });
        
        img.addEventListener('load', function() {
            console.log('Изображение загружено:', this.src);
        });
    });
});

// Динамическая дата для формы поиска
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    // Установка минимальных дат
    checkinInput.min = today.toISOString().split('T')[0];
    checkoutInput.min = tomorrow.toISOString().split('T')[0];
    
    // Установка значений по умолчанию
    checkinInput.value = today.toISOString().split('T')[0];
    checkoutInput.value = tomorrow.toISOString().split('T')[0];
    
    // Обработка изменения даты заезда
    checkinInput.addEventListener('change', function() {
        const newCheckout = new Date(this.value);
        newCheckout.setDate(newCheckout.getDate() + 1);
        checkoutInput.min = newCheckout.toISOString().split('T')[0];
        
        if (new Date(checkoutInput.value) <= new Date(this.value)) {
            checkoutInput.value = newCheckout.toISOString().split('T')[0];
        }
    });
});

// Счетчик для статистики (можно добавить в будущем)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

