<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);
$sql = "SELECT invoice_no, amount_paid, credit_balance FROM payments WHERE invoice_no = '$invoiceNo' ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result) {
    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
    echo json_encode(['success' => true, 'payments' => $payments]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch previous payments: ' . $conn->error]);
}

$conn->close();
?>