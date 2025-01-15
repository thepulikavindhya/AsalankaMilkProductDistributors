<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

 // Fetch products data
   $productSql = "SELECT product_name, stock FROM products";
    $productResult = $conn->query($productSql);
   $productData = [];
   if ($productResult) {
         while ($row = $productResult->fetch_assoc()) {
             $productData[] = $row;
        }
    }

   // Fetch invoice data
  $invoiceSql = "SELECT payment_method, total_amount FROM invoices";
  $invoiceResult = $conn->query($invoiceSql);
   $invoiceData = [];
    if ($invoiceResult) {
       while ($row = $invoiceResult->fetch_assoc()) {
           $invoiceData[] = $row;
        }
   }
  // Fetch  return amounts
 $returnSql = "SELECT return_type, SUM(total_amount) as total_amount FROM returns GROUP BY return_type";
    $returnResult = $conn->query($returnSql);
    $returnAmounts = [];
    if ($returnResult) {
        while ($row = $returnResult->fetch_assoc()) {
            $returnAmounts[] = $row;
        }
    }
  // Fetch payment data
 $paymentSql = "SELECT payment_method, SUM(amount_paid) as total_paid FROM payments GROUP BY payment_method";
    $paymentResult = $conn->query($paymentSql);
    $paymentAmounts = [];
    if ($paymentResult) {
         while ($row = $paymentResult->fetch_assoc()) {
            $paymentAmounts[] = $row;
        }
     }

echo json_encode([
   'success' => true,
   'productData' => $productData,
    'invoiceData' => $invoiceData,
    'returnAmounts' => $returnAmounts,
     'paymentAmounts' => $paymentAmounts,
]);
$conn->close();
?>