document.addEventListener('DOMContentLoaded', function() {
    // Элементы слайдера цветов
    const colorSliderTrack = document.querySelector('.color-slider__track');
    const colorUpBtn = document.querySelector('.color-slider__up');
    const colorDownBtn = document.querySelector('.color-slider__down');
    const colorOptions = document.querySelectorAll('.color-option');

    // Элементы основного слайдера
    const mainImage = document.querySelector('.head-slider__image img');
    const mainPrevBtn = document.querySelector('.head-slider button:first-child');
    const mainNextBtn = document.querySelector('.head-slider button:last-child');

    let currentSelectedIndex = 0;
    let scrollPosition = 0;
    const itemHeight = 143 + 10; // Высота элемента + gap
    const containerHeight = 832;
    const visibleItems = Math.floor(containerHeight / itemHeight);

    // Инициализация
    updateColorSliderButtons();
    colorOptions[0].classList.add('active');

    // Обработчики для слайдера цветов
    colorUpBtn.addEventListener('click', function() {
        scrollPosition = Math.max(0, scrollPosition - 1);
        updateColorSlider();
    });

    colorDownBtn.addEventListener('click', function() {
        scrollPosition = Math.min(colorOptions.length - visibleItems, scrollPosition + 1);
        updateColorSlider();
    });

    // Обработчики для основного слайдера
    mainPrevBtn.addEventListener('click', function() {
        currentSelectedIndex = (currentSelectedIndex - 1 + colorOptions.length) % colorOptions.length;
        updateMainSlider();
        ensureSelectedItemVisible();
    });

    mainNextBtn.addEventListener('click', function() {
        currentSelectedIndex = (currentSelectedIndex + 1) % colorOptions.length;
        updateMainSlider();
        ensureSelectedItemVisible();
    });

    // Обработчики для выбора цвета
    colorOptions.forEach((option, index) => {
        option.addEventListener('click', function() {
            currentSelectedIndex = index;
            updateMainSlider();
            ensureSelectedItemVisible();
        });
    });

    function updateColorSliderButtons() {
        colorUpBtn.style.display = scrollPosition === 0 ? 'none' : 'flex';
        colorDownBtn.style.display = scrollPosition >= colorOptions.length - visibleItems ? 'none' : 'flex';
    }

    function updateColorSlider() {
        colorSliderTrack.style.transform = `translateY(-${scrollPosition * itemHeight}px)`;
        updateColorSliderButtons();
    }

    function updateMainSlider() {
        const selectedOption = colorOptions[currentSelectedIndex];
        mainImage.src = selectedOption.dataset.full || selectedOption.src;

        colorOptions.forEach(opt => opt.classList.remove('active'));
        selectedOption.classList.add('active');
    }

    function ensureSelectedItemVisible() {
        if (currentSelectedIndex < scrollPosition) {
            scrollPosition = currentSelectedIndex;
        }
        else if (currentSelectedIndex >= scrollPosition + visibleItems) {
            scrollPosition = currentSelectedIndex - visibleItems + 1;
        }

        updateColorSlider();
    }
});