<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$sql = "SELECT deliver_id, name, contact_no, age, no_of_invoice FROM deliverymen";
$result = $conn->query($sql);

if ($result) {
    $deliverymen = [];
    while ($row = $result->fetch_assoc()) {
        $deliverymen[] = $row;
    }
    echo json_encode(['success' => true, 'deliverymen' => $deliverymen]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch deliverymen: ' . $conn->error]);
}

$conn->close();
?>
