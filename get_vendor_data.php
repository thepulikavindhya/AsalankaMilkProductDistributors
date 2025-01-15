<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$sql = "SELECT deliver_id, name, contact_no, credit_limit, joined_date FROM vendors";
$result = $conn->query($sql);

if ($result) {
    $vendors = [];
    while ($row = $result->fetch_assoc()) {
        $vendors[] = $row;
    }
    echo json_encode(['success' => true, 'vendors' => $vendors]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch vendors: ' . $conn->error]);
}

$conn->close();
?>