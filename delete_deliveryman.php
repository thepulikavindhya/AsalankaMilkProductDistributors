<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $deliverId = $conn->real_escape_string($data['deliverId']);

    $sql = "DELETE FROM deliverymen WHERE deliver_id = '$deliverId'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Deliveryman deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting deliveryman: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>
