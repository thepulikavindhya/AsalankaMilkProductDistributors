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
   $creditLimit = floatval($data['creditLimit']);
   $joinedDate = $conn->real_escape_string($data['joinedDate']);


    $sql = "INSERT INTO vendors (deliver_id, name, contact_no, credit_limit, joined_date) VALUES ('$deliverId', '$name', '$contactNo', $creditLimit, '$joinedDate')";


    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Vendor data saved successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving vendor data: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>