document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('#certificates .slider-container');
    const slides = document.querySelectorAll('#certificates .slide');
    const prevBtn = document.querySelector('#certificates .cert-prev-btn');
    const nextBtn = document.querySelector('#certificates .cert-next-btn');
    const currentSlideEl = document.querySelector('#certificates .current-slide');
    const totalSlidesEl = document.querySelector('#certificates .total-slides');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slidesToShow = 4; // Показываем 4 слайда
    let slideWidth = slides[0].offsetWidth + 10; // Ширина слайда + gap 10px

    // Инициализация
    function initSlider() {
        // Устанавливаем общее количество слайдов
        totalSlidesEl.textContent = `/${totalSlides < 10 ? '0' + totalSlides : totalSlides}`;

        // Показываем первые слайды
        updateSlider();
    }

    // Обновление слайдера
    function updateSlider() {
        // Перемещаем контейнер
        sliderContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Обновляем счетчик
        currentSlideEl.textContent = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1;

        // Блокируем кнопки в крайних положениях
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
    }

    // Кнопки навигации
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - slidesToShow) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Ресайз
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + 10;
        updateSlider();
    });

    // Инициализируем слайдер
    initSlider();
});