document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('#certificates .slider-container');
    const slides = document.querySelectorAll('#certificates .slide');
    const prevBtn = document.querySelector('#certificates .cert-prev-btn');
    const nextBtn = document.querySelector('#certificates .cert-next-btn');
    const currentSlideEl = document.querySelector('#certificates .current-slide');
    const totalSlidesEl = document.querySelector('#certificates .total-slides');

    let currentIndex = 0;
    const totalSlides = slides.length; // 8
    const slidesToShow = 4;
    const totalSteps = totalSlides - slidesToShow + 1; // 5 переходов (8-4+1)
    let slideWidth = slides[0].offsetWidth + 10;
    let autoplayInterval;
    const autoplayDelay = 5000;

    // Инициализация
    function initSlider() {
        totalSlidesEl.textContent = `/${totalSteps < 10 ? '0' + totalSteps : totalSteps}`;
        updateSlider();
        startAutoplay();
    }

    // Автопрокрутка
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            if (currentIndex < totalSteps - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    // Обновление слайдера
    function updateSlider() {
        sliderContainer.style.transition = 'transform 0.5s ease';
        sliderContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Обновляем счетчик
        currentSlideEl.textContent = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1;

        // Никогда не блокируем кнопки полностью
        prevBtn.disabled = false;
        nextBtn.disabled = false;

        // Визуально выделяем, если достигнут конец/начало
        if (currentIndex === 0) {
            prevBtn.classList.add('end-reached');
        } else {
            prevBtn.classList.remove('end-reached');
        }

        if (currentIndex >= totalSteps - 1) {
            nextBtn.classList.add('end-reached');
        } else {
            nextBtn.classList.remove('end-reached');
        }
    }

    // Кнопка "Вперед"
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex < totalSteps - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
        startAutoplay();
    });

    // Кнопка "Назад"
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSteps - 1;
        }
        updateSlider();
        startAutoplay();
    });

    // Остановка при наведении
    const slider = document.querySelector('#certificates .certificates-slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Ресайз
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + 10;
        updateSlider();
    });

    initSlider();
});

document.addEventListener('DOMContentLoaded', function() {
    const certSlides = document.querySelectorAll('.certificates .slide');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');

    certSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');

            // Настройки для сертификатов
            modalImage.setAttribute('src', imgSrc);
            modalImage.style.width = 'auto';
            modalImage.style.height = 'auto';
            modalImage.style.maxWidth = '90vw';
            modalImage.style.maxHeight = '90vh';
            modalImage.style.objectFit = 'contain';

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Общие функции закрытия
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Функции закрытия не дублируем, они уже есть в projects-modal.js
});