<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
// Get stock Alert
$stockDetailsSql = "SELECT product_id, product_name, stock FROM products";
$stockDetailsResult = $conn->query($stockDetailsSql);
$stockDetails = [];
if ($stockDetailsResult) {
    while ($row = $stockDetailsResult->fetch_assoc()) {
        $stockDetails[] = $row;
    }
}
 if($stockDetails){
     echo json_encode(['success' => true, 'stockDetails' => $stockDetails]);
 }else{
      echo json_encode(['success' => false, 'message' => 'Failed to fetch stock details: ' . $conn->error]);
 }


$conn->close();
?>