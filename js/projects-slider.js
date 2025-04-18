document.addEventListener('DOMContentLoaded', () => {
    const projectsSlider = document.querySelector('.projects-slider');
    const slides = projectsSlider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.projects-pagination .prev-btn');
    const nextBtn = document.querySelector('.projects-pagination .next-btn');
    const currentSlideEl = document.querySelector('.projects-nav .current-slide');
    const totalSlidesEl = document.querySelector('.projects-nav .total-slides');
    const sliderContainer = projectsSlider.querySelector('.slider-container');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isMobile = window.innerWidth < 768;
    let autoplayInterval;

    // Устанавливаем общее количество слайдов
    totalSlidesEl.textContent = `/${totalSlides < 10 ? '0' + totalSlides : totalSlides}`;

    // Автопрокрутка
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToNextSlide();
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function goToNextSlide() {
        goToSlide((currentIndex + 1) % totalSlides);
    }

    function goToPrevSlide() {
        goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
    }

    // Инициализация слайдов
    function initSlides() {
        // Для мобильной версии сразу скрываем все слайды кроме первого
        if (isMobile) {
            slides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'block' : 'none';
            });
        }

        updateSlides();
        updateCounter();
        startAutoplay();
    }

    // Обновление счетчика
    function updateCounter() {
        const displayIndex = currentIndex + 1;
        currentSlideEl.textContent = displayIndex < 10 ? `0${displayIndex}` : displayIndex;
    }

    // Обновление видимых слайдов
    function updateSlides() {
        if (isMobile) {
            // Для мобильной версии - показываем только текущий слайд
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'block' : 'none';
                slide.style.width = '360px';
                slide.style.height = '250px';
                slide.style.position = 'relative';
                slide.style.left = 'auto';
            });
            return;
        }

        // Для десктопа - показываем 3 слайда разных размеров
        slides.forEach(slide => {
            slide.style.display = 'block';
            slide.style.opacity = '0';
            slide.classList.remove('active');
            slide.style.zIndex = '0';
            slide.removeAttribute('data-size');
        });

        for (let i = 0; i < 3; i++) {
            const slideIndex = (currentIndex + i) % totalSlides;
            const slide = slides[slideIndex];

            slide.style.opacity = '1';
            slide.style.zIndex = 3 - i;

            if (i === 0) {
                slide.dataset.size = 'large';
                slide.classList.add('active');
            } else if (i === 1) {
                slide.dataset.size = 'medium';
            } else {
                slide.dataset.size = 'small';
            }
        }
    }

    // Переключение слайдов
    function goToSlide(newIndex) {
        currentIndex = newIndex;
        updateSlides();
        updateCounter();
    }

    // Кнопки навигации
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        goToNextSlide();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        goToPrevSlide();
        startAutoplay();
    });

    // Остановка автопрокрутки при наведении
    projectsSlider.addEventListener('mouseenter', stopAutoplay);
    projectsSlider.addEventListener('mouseleave', startAutoplay);

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            updateSlides();
        }
    });

    initSlides();
});