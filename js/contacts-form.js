document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех форм
    initCostForm('costForm');
    initContactForm('contactsForm');
    initContactForm('colorForm');

    // Инициализация формы расчета стоимости
    function initCostForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const selectWrapper = form.querySelector('.select-wrapper');
        const coatingSelect = form.querySelector('.coating-select');
        const selectOptions = form.querySelectorAll('.option');
        const nextBtn = form.querySelector('.next-btn');
        const steps = [form.querySelector('.form-step-1'), form.querySelector('.form-step-2')];
        const areaInput = form.querySelector('input[name="area"]');

        // Перенесено в правильное место - после объявления coatingSelect
        coatingSelect.addEventListener('focus', function() {
            this.classList.remove('invalid');
            removeError(this);
        });

        // Остальной код функции остается без изменений
        // Обработчик клика по полю выбора
        coatingSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            selectWrapper.classList.toggle('active');
        });

        // Обработчики для вариантов выбора
        selectOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                coatingSelect.value = this.textContent;
                coatingSelect.dataset.value = this.dataset.value || this.textContent;
                selectWrapper.classList.remove('active');
                removeError(coatingSelect);
            });
        });

        // Закрытие выпадающего списка при клике вне его
        document.addEventListener('click', function(e) {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('active');
            }
        });

        // Остальной код функции остается без изменений
        if (areaInput) {
            areaInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                let isValid = validateStep1(form);
                if (isValid) {
                    steps[0].classList.remove('active');
                    steps[1].classList.add('active');
                    steps[1].scrollIntoView({ behavior: 'smooth' });

                    // Сбрасываем стили ошибок при успешном переходе
                    const inputs = steps[0].querySelectorAll('input');
                    inputs.forEach(input => {
                        input.classList.remove('invalid');
                        removeError(input);
                    });
                }
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateStep1(form) || !validateStep2(form)) return;

            const formData = prepareCostFormData(form);
            processFormSubmission(formData, form);
        });
    }

    // Инициализация контактных форм
    function initContactForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Валидация телефона
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d+]/g, '');
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateContactForm(form)) return;

            const formData = prepareContactFormData(form, formId);
            processFormSubmission(formData, form);
        });
    }

    // Валидация первого шага (расчет стоимости)
    function validateStep1(form) {
        let isValid = true;
        const coatingSelect = form.querySelector('.coating-select');
        const areaInput = form.querySelector('input[name="area"]');

        // Валидация выбора покрытия
        if (!coatingSelect.value) {
            coatingSelect.classList.add('invalid');
            showError(coatingSelect, 'Выберите покрытие');
            isValid = false;
        } else {
            coatingSelect.classList.remove('invalid');
            removeError(coatingSelect);
        }

        // Валидация площади
        if (!areaInput.value) {
            areaInput.classList.add('invalid');
            showError(areaInput, 'Укажите площадь');
            isValid = false;
        } else if (!/^\d+$/.test(areaInput.value)) {
            areaInput.classList.add('invalid');
            showError(areaInput, 'Только цифры');
            isValid = false;
        } else {
            areaInput.classList.remove('invalid');
            removeError(areaInput);
        }

        if (!isValid) {
            scrollToFirstError(form);
        }
        return isValid;
    }

    // Валидация второго шага (расчет стоимости)
    function validateStep2(form) {
        const requiredInputs = form.querySelectorAll('.form-step-2 [required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'Заполните это поле');
                isValid = false;
            } else if (input.name === 'phone' && !/^\+?[0-9]{10,15}$/.test(input.value)) {
                showError(input, 'Неверный формат телефона');
                isValid = false;
            } else if (input.name === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                showError(input, 'Неверный формат email');
                isValid = false;
            }
        });

        if (!isValid) scrollToFirstError(form);
        return isValid;
    }

    // Валидация контактных форм
    function validateContactForm(form) {
        const requiredInputs = form.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'Заполните это поле');
                isValid = false;
            } else if (input.name === 'fullname' && !/^[A-Za-zА-Яа-яЁё\s]{2,30}$/u.test(input.value)) {
                showError(input, 'Только буквы (2-30 символов)');
                isValid = false;
            } else if (input.name === 'phone' && !/^\+?[0-9]{10,15}$/.test(input.value)) {
                showError(input, 'Неверный формат телефона');
                isValid = false;
            }
        });

        if (!isValid) scrollToFirstError(form);
        return isValid;
    }

    // Подготовка данных формы расчета
    function prepareCostFormData(form) {
        return {
            formType: 'costForm',
            coating: form.querySelector('.coating-select').value,
            coatingValue: form.querySelector('.coating-select').dataset.value,
            article: form.querySelector('[name="article"]')?.value.trim() || '',
            area: form.querySelector('[name="area"]').value + ' м²',
            fullname: form.querySelector('[name="fullname"]').value.trim(),
            phone: formatPhone(form.querySelector('[name="phone"]').value.trim()),
            email: form.querySelector('[name="email"]')?.value.trim() || '',
            message: form.querySelector('[name="message"]')?.value.trim() || '',
            antibot: form.querySelector('[name="antibot"]').value,
            pageUrl: window.location.href
        };
    }

    // Подготовка данных контактных форм
    function prepareContactFormData(form, formType) {
        return {
            formType: formType,
            fullname: form.querySelector('[name="fullname"]').value.trim(),
            phone: formatPhone(form.querySelector('[name="phone"]').value.trim()),
            email: form.querySelector('[name="email"]')?.value.trim() || '',
            message: form.querySelector('[name="message"]')?.value.trim() || '',
            antibot: form.querySelector('[name="antibot"]').value,
            pageUrl: window.location.href
        };
    }

    // Общие функции
    function formatPhone(phone) {
        phone = phone.replace(/\D/g, '');
        return phone.startsWith('8') ? '+7' + phone.slice(1) : phone;
    }

    function showError(input, message) {
        removeError(input);
        input.classList.add('invalid');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }

    function removeError(input) {
        input.classList.remove('invalid');
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }

    function scrollToFirstError(form) {
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function isLocal() {
        return ['localhost', '127.0.0.1'].includes(window.location.hostname);
    }

    function processFormSubmission(formData, form) {
        if (isLocal()) {
            console.log('Form data:', formData);
            // Вместо alert вызываем showSuccess
            showSuccess(form, formData.formType);
            form.reset();
            return;
        }

        const submitUrl = window.location.pathname.includes('/pages/')
            ? '../../form-contacts.php'
            : '../form-contacts.php';

        fetch(submitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сети');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showSuccess(form, formData.formType);
                    form.reset();
                    if (formData.formType === 'costForm') {
                        form.querySelector('.form-step-1').classList.add('active');
                        form.querySelector('.form-step-2').classList.remove('active');
                    }
                } else {
                    showError(null, data.message || 'Ошибка отправки');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError(null, 'Ошибка соединения');
            });
    }

    function showSuccess(form, formType) {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        // const modalMessage = document.querySelector('.modal-message');
        //
        // const messages = {
        //     'costForm': 'Ваш расчет стоимости отправлен',
        //     'contactsForm': 'Ваша заявка отправлена',
        //     'colorForm': 'Ваш запрос цвета отправлен'
        // };
        //
        // modalMessage.textContent = messages[formType] || 'Ваши данные отправлены';
        modalBackdrop.classList.add('active');

        // Закрытие по клику на крестик
        document.querySelector('.close-modal').addEventListener('click', () => {
            modalBackdrop.classList.remove('active');
        });

        // Закрытие по клику вне модального окна
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.remove('active');
            }
        });
    }
});