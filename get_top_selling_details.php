<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
// Get Top selling products
$topSellingDetailsSql = "SELECT p.product_id,p.product_name,
                        COALESCE(SUM(ci.qty), 0)+ COALESCE(SUM(cii.qty), 0) + COALESCE(SUM(chei.qty), 0) as total_quantity,
                         COALESCE(SUM(ci.amount), 0)+ COALESCE(SUM(cii.amount), 0)+ COALESCE(SUM(chei.amount), 0) as total_amount
                     FROM products p
                     LEFT JOIN cash_invoice_items ci ON p.product_name = ci.product
                       LEFT JOIN credit_invoice_items cii ON p.product_name = cii.product
                     LEFT JOIN cheque_invoice_items chei ON p.product_name = chei.product
                     GROUP BY p.product_name
                     ORDER BY total_quantity DESC";

$topSellingDetailsResult = $conn->query($topSellingDetailsSql);
$topSellingDetails = [];
if ($topSellingDetailsResult) {
    while ($row = $topSellingDetailsResult->fetch_assoc()) {
        $topSellingDetails[] = $row;
    }
}
  if($topSellingDetails){
         echo json_encode(['success' => true, 'topSellingDetails' => $topSellingDetails]);
     }else{
         echo json_encode(['success' => false, 'message' => 'Failed to fetch top selling details: ' . $conn->error]);
     }


$conn->close();
?>