<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);
$totalCredit = floatval($data['totalCredit']);
$remainingCredit = floatval($data['remainingCredit']);


 $sql = "INSERT INTO shop_credit (invoice_no, total_credit,remaining_credit) VALUES ('$invoiceNo', '$totalCredit', '$remainingCredit') ON DUPLICATE KEY UPDATE total_credit = '$totalCredit', remaining_credit = '$remainingCredit'";


if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Credit recorded successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error recording credit: ' . $conn->error]);
}

$conn->close();
?>