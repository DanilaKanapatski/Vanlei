<?php

require_once 'phpmailer/PHPMailerAutoload.php';

$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = $_POST['fullname'];
$phone = $_POST['phone'];

// $mail->SMTPDebug = 2; // Включаем отладку
$mail->isSMTP();
$mail->Host = 'smtp.mail.ru'; // Уберите "ssl://"
$mail->SMTPAuth = true;
$mail->Username = 'Lilia1592@mail.ru'; // Ваш логин
$mail->Password = 'ugdHHtrgbLh0P4bcibtR'; // Ваш пароль
$mail->SMTPSecure = 'ssl'; // Используйте 'ssl' или 'tls'
$mail->Port = 465; // Порт для SSL

$mail->setFrom('Lilia1592@mail.ru', 'splitcomfort-mos.ru');
$mail->addAddress('splitcomfortmos@yandex.ru'); // Кому будет уходить письмо
$mail->isHTML(true);

$mail->Subject = 'Заявка с splitcomfort-mos.ru';
$mail->Body = '' . $name . ' оставил заявку, его телефон ' . $phone . '.';

try {
    if ($mail->send()) {
        header('Location: pages/send.html');
        exit();
    } else {
        echo "Ошибка отправки письма.";
        echo $mail->ErrorInfo;
    }
} catch (phpmailerException $e) {
    echo "Произошла ошибка: " . $e->getMessage();
}

$mail->smtpClose();