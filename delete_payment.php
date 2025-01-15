<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $invoiceNo = $conn->real_escape_string($data['invoiceNo']);

    $sql = "DELETE FROM payments WHERE invoice_no = '$invoiceNo'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Payment data deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting payment data: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>