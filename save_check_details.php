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
     $issueDate = $conn->real_escape_string($data['issueDate']);
    $expiryDate = $conn->real_escape_string($data['expiryDate']);
     $checkAmount = floatval($data['checkAmount']);


       $sql = "INSERT INTO check_details (invoice_no, issue_date, expiry_date, check_amount) VALUES ('$invoiceNo', '$issueDate', '$expiryDate', '$checkAmount') ON DUPLICATE KEY UPDATE issue_date = '$issueDate', expiry_date='$expiryDate',check_amount = '$checkAmount'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'check data saved successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving check data: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>