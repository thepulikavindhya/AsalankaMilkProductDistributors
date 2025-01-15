<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$reportType = $conn->real_escape_string($data['reportType']);
$reportData = [];
if ($reportType == 'inventory') {
  $sql = "SELECT product_id, product_name, stock FROM products";
  $result = $conn->query($sql);
   if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reportData[] = $row;
        }
    }
} else if ($reportType == 'cash') {
      $sql = "SELECT invoice_no, bill_date, customer, total_amount FROM invoices WHERE payment_method = 'cash'";
       $result = $conn->query($sql);
   if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reportData[] = $row;
        }
    }
} else if ($reportType == 'credit') {
      $sql = "SELECT invoice_no, bill_date, customer, total_amount FROM invoices WHERE payment_method = 'credit'";
     $result = $conn->query($sql);
   if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reportData[] = $row;
        }
    }
}else if ($reportType == 'cheque') {
    $sql = "SELECT invoice_no, bill_date, customer, total_amount FROM invoices WHERE payment_method = 'cheque'";
    $result = $conn->query($sql);
   if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reportData[] = $row;
        }
    }
}else if ($reportType == 'return') {
    $customerReturnsSql = "SELECT invoice_no,return_date,customer,total_amount FROM returns WHERE return_type = 'customer'";
    $customerReturnsResult = $conn->query($customerReturnsSql);
        $customerReturns = [];
        if ($customerReturnsResult) {
            while ($row = $customerReturnsResult->fetch_assoc()) {
                $customerReturns[] = $row;
            }
        }
        $companyReturnsSql = "SELECT invoice_no,return_date,customer,total_amount FROM returns WHERE return_type = 'company'";
        $companyReturnsResult = $conn->query($companyReturnsSql);
        $companyReturns = [];
        if ($companyReturnsResult) {
            while ($row = $companyReturnsResult->fetch_assoc()) {
               $companyReturns[] = $row;
            }
        }


     echo json_encode([
        'success' => true,
        'customerReturns' => $customerReturns,
        'companyReturns' => $companyReturns
    ]);
    $conn->close();
    exit;
}

if($reportData){
     echo json_encode(['success' => true, 'reportData' => $reportData]);
}else{
  echo json_encode(['success' => false, 'message' => 'Failed to fetch report data: ' . $conn->error]);
}
$conn->close();
?>