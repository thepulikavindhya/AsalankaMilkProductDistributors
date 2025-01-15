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
   $name = $conn->real_escape_string($data['name']);
    $contactNo = $conn->real_escape_string($data['contactNo']);
     $age = intval($data['age']);
     $noOfInvoice = $conn->real_escape_string($data['noOfInvoice']);


    $sql = "INSERT INTO deliverymen (deliver_id, name, contact_no, age, no_of_invoice) VALUES ('$deliverId', '$name', '$contactNo', $age, '$noOfInvoice')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Deliveryman data saved successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving deliveryman data: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>