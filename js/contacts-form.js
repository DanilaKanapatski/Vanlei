document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('costForm');
    if (!form) return;

    // Элементы первой страницы
    const coatingSelect = form.querySelector('.coating-select');
    const coatingError = form.querySelector('.coating-error');
    const areaInput = form.querySelector('input[name="area"]');
    const areaError = form.querySelector('.area-error');
    const nextBtn = form.querySelector('.next-btn');
    const steps = [form.querySelector('.form-step-1'), form.querySelector('.form-step-2')];

    // Элементы второй страницы
    const fullnameInput = form.querySelector('input[name="fullname"]');
    const fullnameError = form.querySelector('.fullname-error');
    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneError = form.querySelector('.phone-error');
    const emailInput = form.querySelector('input[name="email"]');
    const emailError = form.querySelector('.email-error');

    // Обработчик для выбора покрытия
    const selectWrapper = form.querySelector('.select-wrapper');
    const selectOptions = form.querySelectorAll('.option');

    coatingSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        selectWrapper.classList.toggle('active');
    });

    selectOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            coatingSelect.value = this.textContent;
            coatingSelect.dataset.value = this.dataset.value || this.textContent;
            selectWrapper.classList.remove('active');
            coatingSelect.classList.remove('invalid');
            coatingError.classList.remove('invalid');
        });
    });

    document.addEventListener('click', function(e) {
        if (!selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('active');
        }
    });

    // Валидация площади (только цифры)
    if (areaInput) {
        areaInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Обработчик для кнопки "Далее"
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Сбрасываем предыдущие ошибки
        resetErrors();

        let isValid = true;

        // Проверка покрытия
        if (!coatingSelect.value.trim()) {
            coatingSelect.classList.add('invalid');
            coatingError.classList.add('invalid');
            isValid = false;
        }

        // Проверка площади
        if (!areaInput.value.trim()) {
            areaInput.classList.add('invalid');
            areaError.textContent = 'Укажите площадь';
            areaError.classList.add('invalid');
            isValid = false;
        } else if (!/^\d+$/.test(areaInput.value)) {
            areaInput.classList.add('invalid');
            areaError.textContent = 'Только цифры';
            areaError.classList.add('invalid');
            isValid = false;
        }

        if (isValid) {
            // Переход к следующему шагу
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            steps[1].scrollIntoView({ behavior: 'smooth' });
        } else {
            // Прокрутка к первой ошибке
            scrollToFirstError();
        }
    });

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Сбрасываем предыдущие ошибки
        resetErrors();

        let isValid = true;

        // Проверка имени
        if (!fullnameInput.value.trim()) {
            fullnameInput.classList.add('invalid');
            fullnameError.textContent = 'Укажите ваше имя';
            fullnameError.classList.add('invalid');
            isValid = false;
        } else if (!/^[A-Za-zА-Яа-яЁё\s]{2,30}$/u.test(fullnameInput.value)) {
            fullnameInput.classList.add('invalid');
            fullnameError.textContent = 'Только буквы (2-30 символов)';
            fullnameError.classList.add('invalid');
            isValid = false;
        }

        // Проверка телефона
        if (!phoneInput.value.trim()) {
            phoneInput.classList.add('invalid');
            phoneError.textContent = 'Укажите номер телефона';
            phoneError.classList.add('invalid');
            isValid = false;
        } else if (!/^\+?[0-9]{10,15}$/.test(phoneInput.value)) {
            phoneInput.classList.add('invalid');
            phoneError.textContent = 'Неверный формат телефона';
            phoneError.classList.add('invalid');
            isValid = false;
        }

        // Проверка email (если заполнен)
        if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailInput.classList.add('invalid');
            emailError.textContent = 'Неверный формат email';
            emailError.classList.add('invalid');
            isValid = false;
        }

        if (!isValid) {
            scrollToFirstError();
            return;
        }

        // Подготовка данных формы
        const formData = {
            formType: 'costForm',
            coating: coatingSelect.value,
            coatingValue: coatingSelect.dataset.value,
            article: form.querySelector('[name="article"]')?.value.trim() || '',
            area: areaInput.value + ' м²',
            fullname: fullnameInput.value.trim(),
            phone: formatPhone(phoneInput.value.trim()),
            email: emailInput.value.trim() || '',
            message: form.querySelector('[name="message"]')?.value.trim() || '',
            antibot: form.querySelector('[name="antibot"]').value,
            pageUrl: window.location.href
        };

        // Отправка формы
        processFormSubmission(formData, form);
    });

    // Сброс ошибок
    function resetErrors() {
        coatingSelect.classList.remove('invalid');
        coatingError.classList.remove('invalid');
        areaInput.classList.remove('invalid');
        areaError.classList.remove('invalid');
        fullnameInput.classList.remove('invalid');
        fullnameError.classList.remove('invalid');
        phoneInput.classList.remove('invalid');
        phoneError.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        emailError.classList.remove('invalid');
    }

    // Прокрутка к первой ошибке
    function scrollToFirstError() {
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Форматирование телефона
    function formatPhone(phone) {
        phone = phone.replace(/\D/g, '');
        return phone.startsWith('8') ? '+7' + phone.slice(1) : phone;
    }

    // Обработчик отправки формы на сервер
    function processFormSubmission(formData, form) {
        if (isLocal()) {
            console.log('Form data:', formData);
            alert('Локальная отправка:\n' + JSON.stringify(formData, null, 2));
            form.reset();
            steps[0].classList.add('active');
            steps[1].classList.remove('active');
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
                    alert('Спасибо! Ваша заявка отправлена.');
                    form.reset();
                    steps[0].classList.add('active');
                    steps[1].classList.remove('active');
                } else {
                    alert(data.message || 'Ошибка отправки');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ошибка соединения');
            });
    }

    // Проверка локального окружения
    function isLocal() {
        return ['localhost', '127.0.0.1'].includes(window.location.hostname);
    }

    // Обработчики для сброса ошибок при взаимодействии
    coatingSelect.addEventListener('focus', function() {
        this.classList.remove('invalid');
        coatingError.classList.remove('invalid');
    });

    areaInput.addEventListener('focus', function() {
        this.classList.remove('invalid');
        areaError.classList.remove('invalid');
    });

    fullnameInput.addEventListener('focus', function() {
        this.classList.remove('invalid');
        fullnameError.classList.remove('invalid');
    });

    phoneInput.addEventListener('focus', function() {
        this.classList.remove('invalid');
        phoneError.classList.remove('invalid');
    });

    emailInput.addEventListener('focus', function() {
        this.classList.remove('invalid');
        emailError.classList.remove('invalid');
    });
});