<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$sql = "SELECT invoice_no, amount FROM invoice_list ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result) {
    $invoices = [];
    while ($row = $result->fetch_assoc()) {
        $invoices[] = $row;
    }
    echo json_encode(['success' => true, 'invoices' => $invoices]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch invoices: ' . $conn->error]);
}

$conn->close();
?>