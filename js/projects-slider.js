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

    // Переменные для обработки свайпа
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Минимальное расстояние свайпа для срабатывания

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

        // Добавляем обработчики свайпа для мобильных устройств
        if (isMobile) {
            sliderContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
            sliderContainer.addEventListener('touchend', handleTouchEnd, {passive: true});
        }
    }

    // Обработчики свайпа
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }

    function handleSwipe() {
        const difference = touchStartX - touchEndX;

        // Свайп вправо (переход к следующему слайду)
        if (difference > swipeThreshold) {
            goToNextSlide();
        }
        // Свайп влево (переход к предыдущему слайду)
        else if (difference < -swipeThreshold) {
            goToPrevSlide();
        }
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

            // Добавляем/удаляем обработчики свайпа при изменении размера
            if (isMobile) {
                sliderContainer.addEventListener('touchstart', handleTouchStart, {passive: true});
                sliderContainer.addEventListener('touchend', handleTouchEnd, {passive: true});
            } else {
                sliderContainer.removeEventListener('touchstart', handleTouchStart);
                sliderContainer.removeEventListener('touchend', handleTouchEnd);
            }

            updateSlides();
        }
    });

    initSlides();
});

// Код модального окна остается без изменений
document.addEventListener('DOMContentLoaded', function() {
    const projectSlides = document.querySelectorAll('.projects .slide');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');

    const largeProjectSlide = document.querySelector('.projects .slide[data-size="large"]');
    const largeSlideWidth = largeProjectSlide.offsetWidth;
    const largeSlideHeight = largeProjectSlide.offsetHeight;

    projectSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');

            modalImage.setAttribute('src', imgSrc);
            modalImage.style.width = `${largeSlideWidth}px`;
            modalImage.style.height = `${largeSlideHeight}px`;
            modalImage.style.maxWidth = 'none';
            modalImage.style.maxHeight = 'none';
            modalImage.style.objectFit = 'cover';

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

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
});