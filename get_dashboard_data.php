<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
// Calculate total income
$totalIncomeSql = "SELECT SUM(total_amount) AS total_income FROM invoices";
$totalIncomeResult = $conn->query($totalIncomeSql);
$totalIncome = $totalIncomeResult && $totalIncomeResult->num_rows > 0 ? $totalIncomeResult->fetch_assoc()['total_income'] : 0;

// Calculate total cash income
$totalCashSql = "SELECT SUM(total_amount) AS total_cash FROM invoices WHERE payment_method = 'cash'";
$totalCashResult = $conn->query($totalCashSql);
$totalCash = $totalCashResult && $totalCashResult->num_rows > 0 ? $totalCashResult->fetch_assoc()['total_cash'] : 0;


// Calculate total credit income
$totalCreditSql = "SELECT SUM(total_amount) AS total_credit FROM invoices WHERE payment_method = 'credit'";
$totalCreditResult = $conn->query($totalCreditSql);
$totalCredit = $totalCreditResult && $totalCreditResult->num_rows > 0 ? $totalCreditResult->fetch_assoc()['total_credit'] : 0;

// Calculate total cheque income
$totalChequeSql = "SELECT SUM(total_amount) AS total_cheque FROM invoices WHERE payment_method = 'cheque'";
$totalChequeResult = $conn->query($totalChequeSql);
$totalCheque = $totalChequeResult && $totalChequeResult->num_rows > 0 ? $totalChequeResult->fetch_assoc()['total_cheque'] : 0;

 // Fetch Top Selling Products
$topSellingSql = "SELECT ci.product,p.product_id,p.product_name, SUM(ci.qty) AS quantity, SUM(ci.amount) AS total_amount
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
 // Fetch Stock Alert Data
$stockAlertSql = "SELECT p.product_id, p.product_name, p.stock, COALESCE(SUM(cri.qty), 0) as customer_returns, p.stock - COALESCE(SUM(cri.qty), 0) as final_stock
FROM products p
LEFT JOIN customer_return_items cri ON p.id = cri.product
WHERE p.stock < 20
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
    'total_income' => number_format($totalIncome, 0),
      'total_cash' => number_format($totalCash, 0),
      'total_credit' => number_format($totalCredit, 0),
      'total_cheque' => number_format($totalCheque, 0),
     'topSellingProducts' => $topSellingProducts,
      'stockAlerts' => $stockAlerts,
]);
$conn->close();
?>