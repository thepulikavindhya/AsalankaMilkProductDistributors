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

    $sql = "DELETE FROM check_details WHERE invoice_no = '$invoiceNo' AND issue_date = '$issueDate'";


    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Check detail deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting check detail: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>