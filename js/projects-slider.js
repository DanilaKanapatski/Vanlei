document.addEventListener('DOMContentLoaded', () => {
    const projectsSlider = document.querySelector('.projects-slider');
    const slides = projectsSlider.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.projects-pagination .prev-btn');
    const nextBtn = document.querySelector('.projects-pagination .next-btn');
    const currentSlideEl = document.querySelector('.projects-nav .current-slide');
    const totalSlidesEl = document.querySelector('.projects-nav .total-slides');

    let currentIndex = 0;
    const totalSlides = slides.length; // Общее количество слайдов
    const visibleSlides = 3; // Количество видимых слайдов
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
        updateSlides();
        updateCounter();
        startAutoplay();
    }

    // Обновление счетчика
    function updateCounter() {
        const displayIndex = currentIndex + 1; // Показываем 1-based индекс
        currentSlideEl.textContent = displayIndex < 10 ? `0${displayIndex}` : displayIndex;
    }

    // Обновление видимых слайдов
    function updateSlides() {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
            slide.style.zIndex = '0';
        });

        // Показываем нужные слайды (3 или меньше в конце)
        for (let i = 0; i < visibleSlides; i++) {
            const slideIndex = (currentIndex + i) % totalSlides;
            const slide = slides[slideIndex];

            slide.style.opacity = '1';
            slide.style.zIndex = visibleSlides - i;

            // Распределяем размеры
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

    initSlides();
});