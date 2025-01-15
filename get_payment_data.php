<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);


$sql = "SELECT total_amount FROM invoices WHERE invoice_no = '$invoiceNo'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $amountDue = $row['total_amount'];
    echo json_encode(['success' => true, 'amount_due' => $amountDue]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invoice not found']);
}

$conn->close();
?>