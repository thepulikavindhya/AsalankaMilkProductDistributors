<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);
$sql = "SELECT total_credit , remaining_credit FROM shop_credit WHERE invoice_no = '$invoiceNo'";
$result = $conn->query($sql);
if($result && $result->num_rows >0){
    $row = $result->fetch_assoc();
    $totalCredit = $row['total_credit'];
      $remainingCredit = $row['remaining_credit'];
    echo json_encode(['success'=>true, 'total_credit'=>$totalCredit, 'remaining_credit'=>$remainingCredit]);
}else{
       echo json_encode(['success' => false, 'message' => 'Credit not found.']);
}
$conn->close();
?>