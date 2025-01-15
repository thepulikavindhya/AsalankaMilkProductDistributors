<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$searchTerm = $conn->real_escape_string($data['searchTerm']);

// Fetch Top Selling Products based on invoice ID
$topSellingSql = "SELECT ci.product,p.product_id,p.product_name, SUM(ci.qty) AS quantity, SUM(ci.amount) AS total_amount
            FROM cash_invoice_items ci
              LEFT JOIN products p ON ci.product = p.product_name
              LEFT JOIN invoices i ON ci.invoice_id = i.id
            WHERE i.invoice_no = '$searchTerm'
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

// Fetch Stock Alert Data based on product id
$stockAlertSql = "SELECT p.product_id, p.product_name, p.stock, COALESCE(SUM(cri.qty), 0) as customer_returns, p.stock - COALESCE(SUM(cri.qty), 0) as final_stock
FROM products p
LEFT JOIN customer_return_items cri ON p.id = cri.product
 WHERE p.product_id = '$searchTerm'
 GROUP BY p.id";
$stockAlertResult = $conn->query($stockAlertSql);
$stockAlerts = [];
if ($stockAlertResult) {
       while($row = $stockAlertResult->fetch_assoc()){
           $stockAlerts[] = $row;
      }
}

echo json_encode([
    'success' => true,
      'topSellingProducts' => $topSellingProducts,
    'stockAlerts' => $stockAlerts,
]);
$conn->close();
?>