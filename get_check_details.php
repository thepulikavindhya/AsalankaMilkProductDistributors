<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);


$sql = "SELECT invoice_no, issue_date, expiry_date, check_amount FROM check_details WHERE invoice_no = '$invoiceNo' ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result) {
    $checkDetails = [];
    while ($row = $result->fetch_assoc()) {
        $checkDetails[] = $row;
    }
    echo json_encode(['success' => true, 'checkDetails' => $checkDetails]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch check details: ' . $conn->error]);
}

$conn->close();
?>