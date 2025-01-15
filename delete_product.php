<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $productId = $conn->real_escape_string($data['productId']);

    $sql = "DELETE FROM products WHERE product_id = '$productId'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting product: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>