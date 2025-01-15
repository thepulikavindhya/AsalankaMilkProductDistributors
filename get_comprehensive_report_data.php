<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
// Fetch payment data
$paymentSql = "SELECT payment_method, SUM(total_amount) AS total_amount FROM invoices GROUP BY payment_method";
$paymentResult = $conn->query($paymentSql);
$paymentData = [];
if ($paymentResult) {
    while ($row = $paymentResult->fetch_assoc()) {
          $paymentData[] = $row;
    }
}


 // Fetch total cost for each product
$productSql = "SELECT product_name,stock  FROM products";
  $productResult = $conn->query($productSql);
  $productData = [];
    if ($productResult) {
        while ($row = $productResult->fetch_assoc()) {
            $productData[] = $row;
       }
    }


// Fetch Top Selling Products
$topSellingSql = "SELECT ci.product,p.product_name, SUM(ci.qty) AS quantity
            FROM cash_invoice_items ci
              LEFT JOIN products p ON ci.product = p.product_name
            GROUP BY ci.product
           ORDER BY quantity DESC
            LIMIT 5";
$topSellingResult = $conn->query($topSellingSql);
$topSellingProducts = [];
if($topSellingResult){
       while($row = $topSellingResult->fetch_assoc()){
        $topSellingProducts[] = $row;
       }
}
 echo json_encode([
   'success' => true,
     'paymentData' => $paymentData,
      'productData' => $productData,
     'topSellingProducts' => $topSellingProducts
]);

$conn->close();
?>