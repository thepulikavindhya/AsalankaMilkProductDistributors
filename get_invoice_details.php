<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$invoiceNo = $conn->real_escape_string($data['invoiceNo']);


$sql_invoice = "SELECT total_amount FROM invoices WHERE invoice_no = '$invoiceNo'";
$result_invoice = $conn->query($sql_invoice);

$totalAmount = 0;
if ($result_invoice && $result_invoice->num_rows > 0) {
   $row_invoice = $result_invoice->fetch_assoc();
    $totalAmount = floatval($row_invoice['total_amount']);
}
  $sql_payment = "SELECT COALESCE(SUM(amount_paid),0) as total_paid FROM payments WHERE invoice_no = '$invoiceNo'";
         $result_payment = $conn->query($sql_payment);
         $totalPaid = 0;
         if($result_payment && $result_payment->num_rows>0){
              $row_payment = $result_payment->fetch_assoc();
               $totalPaid =  floatval($row_payment['total_paid']);
         }

   echo json_encode(['success' => true,'total_amount' => $totalAmount,'total_paid'=>$totalPaid]);

$conn->close();
?>