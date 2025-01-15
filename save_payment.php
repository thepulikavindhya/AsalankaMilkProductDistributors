<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);
$amountPaid = floatval($data['amountPaid']);
$creditBalance = floatval($data['creditBalance']);

   $sql = "INSERT INTO payments (invoice_no, amount_paid,credit_balance) VALUES ('$invoiceNo', '$amountPaid', '$creditBalance')";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'Payment recorded successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error recording payment: ' . $conn->error]);
            }

$conn->close();
?>