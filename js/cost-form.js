document.addEventListener('DOMContentLoaded', function() {
    // Инициализация многошаговой формы расчета стоимости
    const costForm = document.getElementById('costForm');
    if (costForm) {
        initCostForm(costForm);
    }

    // Инициализация формы подбора цвета
    const colorForm = document.getElementById('colorForm');
    if (colorForm) {
        initSimpleForm(colorForm);
    }

    // Инициализация контактной формы
    const contactsForm = document.getElementById('contactsForm');
    if (contactsForm) {
        initSimpleForm(contactsForm);
    }

    // Функция инициализации многошаговой формы
    function initCostForm(form) {
        const selectWrapper = form.querySelector('.select-wrapper');
        const coatingSelect = form.querySelector('.coating-select');
        const selectOptions = form.querySelectorAll('.option');
        const nextBtn = form.querySelector('.next-btn');
        const step1 = form.querySelector('.form-step-1');
        const step2 = form.querySelector('.form-step-2');

        if (selectWrapper) {
            selectWrapper.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
            });

            selectOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    coatingSelect.value = this.textContent;
                    coatingSelect.classList.remove('invalid');
                    selectWrapper.classList.remove('active');
                    removeError(coatingSelect);
                });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();

                let isValid = true;

                // Проверка поля выбора покрытия
                const coatingValue = coatingSelect.value.trim();
                if (!coatingValue) {
                    coatingSelect.classList.add('invalid');
                    showError(coatingSelect, 'Пожалуйста, выберите покрытие');
                    isValid = false;
                } else {
                    coatingSelect.classList.remove('invalid');
                    removeError(coatingSelect);
                }

                // Проверка поля площади
                const areaInput = form.querySelector('.form-step-1 input[placeholder*="Площадь объекта"]');
                const areaValue = areaInput.value.trim();
                if (!areaValue) {
                    areaInput.classList.add('invalid');
                    showError(areaInput, 'Пожалуйста, укажите площадь');
                    isValid = false;
                } else {
                    areaInput.classList.remove('invalid');
                    removeError(areaInput);
                }

                if (isValid) {
                    step1.classList.remove('active');
                    step2.classList.add('active');
                    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    scrollToFirstError(form);
                }
            });
        }
    }

    // Функция инициализации простой формы (цвета и контакты)
    function initSimpleForm(form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredInputs = form.querySelectorAll('input[required]');

            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    showError(input, 'Это поле обязательно для заполнения');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                    removeError(input);
                }
            });

            if (!isValid) {
                e.preventDefault();
                scrollToFirstError(form);
            }
        });
    }

    // Вспомогательные функции
    function showError(input, message) {
        let errorMsg = input.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function removeError(input) {
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.style.display = 'none';
        }
    }

    function scrollToFirstError(form) {
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Закрытие select при клике вне его
    document.addEventListener('click', function() {
        const activeSelects = document.querySelectorAll('.select-wrapper.active');
        activeSelects.forEach(select => {
            select.classList.remove('active');
        });
    });
});