<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Логирование для отладки
file_put_contents('form_log.txt', date('[Y-m-d H:i:s]') . PHP_EOL . file_get_contents('php://input') . PHP_EOL . PHP_EOL, FILE_APPEND);

// Проверка на бота
if (!empty($_POST['antibot'])) {
    echo json_encode(['success' => false, 'message' => 'Ошибка отправки']);
    exit;
}

// Локальная разработка - эмуляция
if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
    echo json_encode(['success' => true, 'message' => 'Локальная разработка - письмо не отправлено']);
    exit;
}

require_once 'phpmailer/PHPMailerAutoload.php';

$data = json_decode(file_get_contents('php://input'), true);

// Валидация данных
$errors = [];

// Общие проверки для всех форм
if (empty($data['fullname']) || !preg_match('/^[A-Za-zА-Яа-яЁё\s]{2,30}$/u', $data['fullname'])) {
    $errors[] = 'Некорректное имя';
}

if (empty($data['phone']) || !preg_match('/^\+?[0-9]{10,15}$/', $data['phone'])) {
    $errors[] = 'Некорректный телефон';
}

if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный email';
}

// Специфичные проверки для формы расчета
if ($data['formType'] === 'costForm') {
    if (empty($data['coating'])) {
        $errors[] = 'Не выбрано покрытие';
    }
    if (empty($data['area']) || !preg_match('/^\d+\sм²$/', $data['area'])) {
        $errors[] = 'Некорректная площадь';
    }
    if (!empty($data['article']) && strlen($data['article']) > 20) {
        $errors[] = 'Артикул слишком длинный';
    }
}

// Проверка сообщения для всех форм
if (!empty($data['message']) && strlen($data['message']) > 300) {
    $errors[] = 'Сообщение слишком длинное';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Настройка PHPMailer
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';
$mail->isSMTP();
$mail->Host = 'smtp.mail.ru';
$mail->SMTPAuth = true;
$mail->Username = 'danila_konopatskiy@mail.ru';
$mail->Password = 'JKSg7gKrb5KnyLLq5L1f';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;
$mail->setFrom('danila_konopatskiy@mail.ru', 'Vanlei.ru');
$mail->addAddress('danilakonv@gmail.com');

$mail->isHTML(true);

// Формирование письма в зависимости от типа формы
if ($data['formType'] === 'costForm') {
    $mail->Subject = 'Расчет стоимости: ' . htmlspecialchars($data['coating']);

    $body = "<h2>Запрос расчета стоимости</h2>";
    $body .= "<p><strong>Покрытие:</strong> " . htmlspecialchars($data['coating']) . "</p>";
    $body .= "<p><strong>Артикул:</strong> " . (empty($data['article']) ? 'Не указан' : htmlspecialchars($data['article'])) . "</p>";
    $body .= "<p><strong>Площадь:</strong> " . htmlspecialchars($data['area']) . "</p>";
} else {
    $mail->Subject = $data['formType'] === 'colorForm'
        ? 'Запрос подбора цвета'
        : 'Контактная форма с сайта';

    $body = "<h2>" . ($data['formType'] === 'colorForm' ? 'Запрос подбора цвета' : 'Новая заявка') . "</h2>";
}

$body .= "<p><strong>Имя:</strong> " . htmlspecialchars($data['fullname']) . "</p>";
$body .= "<p><strong>Телефон:</strong> " . htmlspecialchars($data['phone']) . "</p>";
$body .= "<p><strong>Email:</strong> " . (empty($data['email']) ? 'Не указан' : htmlspecialchars($data['email'])) . "</p>";

if (!empty($data['message'])) {
    $body .= "<p><strong>Сообщение:</strong> " . nl2br(htmlspecialchars($data['message'])) . "</p>";
}

$body .= "<p><strong>Страница:</strong> " . htmlspecialchars($data['pageUrl']) . "</p>";
$body .= "<p><strong>Тип формы:</strong> " . htmlspecialchars($data['formType']) . "</p>";

$mail->Body = $body;

// Отправка письма
try {
    if ($mail->send()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка отправки письма: ' . $mail->ErrorInfo]);
    }
} catch (phpmailerException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка: ' . $e->getMessage()]);
}

$mail->smtpClose();
?>