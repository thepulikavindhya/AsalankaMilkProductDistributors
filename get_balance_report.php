<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$sql = "SELECT i.invoice_no, i.total_amount, 
            COALESCE(SUM(p.amount_paid), 0) as total_paid
            FROM invoices i
            LEFT JOIN payments p ON i.invoice_no = p.invoice_no
            GROUP BY i.invoice_no";

$result = $conn->query($sql);

$balanceData = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $invoice_no = $row['invoice_no'];
        $totalAmount = floatval($row['total_amount']);
        $totalPaid = floatval($row['total_paid']);
       $remainingAmount = $totalAmount-$totalPaid;
        // Calculate remaining amount (you may need additional logic for partial payments)
        $balanceData[] = [
             'invoice_no' => $invoice_no,
            'amount' => $totalAmount,
            'remaining_amount' => $remainingAmount,
        ];
    }
}
    if ($balanceData) {
          echo json_encode(['success' => true, 'balanceData' => $balanceData]);
    }else{
         echo json_encode(['success' => false, 'message' => 'Failed to fetch balance data: ' . $conn->error]);
    }

$conn->close();
?>