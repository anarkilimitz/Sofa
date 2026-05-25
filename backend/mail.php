<?php
// Очищаем буфер, если что-то случайно вывелось ранее (пробелы, ошибки)
ob_start();

require_once 'config.php';
require_once 'mailer/PHPMailer.php';
require_once 'mailer/SMTP.php';
require_once 'mailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Очищаем всё, что накопилось в буфере (мусор), чтобы JSON был чистым
ob_end_clean();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Неверный метод запроса']);
    exit;
}

 $name = htmlspecialchars(trim($_POST['firstName'] ?? ''));
 $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
 $messageText = htmlspecialchars(trim($_POST['message'] ?? ''));

if (empty($name) || empty($phone) || empty($messageText)) {
    echo json_encode(['status' => 'error', 'message' => 'Заполните все поля']);
    exit;
}

 $mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;

    $mail->setFrom(SMTP_USER, 'Первый Мягкий');
    $mail->addAddress(MAIL_TO, MAIL_TO_NAME);
    
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->Subject = 'Заявка с сайта Первый Мягкий от ' . $name;
    
    $mail->Body = "
        <h2>Новая заявка</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
        <p><strong>Сообщение:</strong><br>$messageText</p>
    ";

    $mail->send();
    
    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "Ошибка отправки: {$mail->ErrorInfo}"]);
}