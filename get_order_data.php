<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
$data = json_decode(file_get_contents("php://input"), true);
$paymentType = $conn->real_escape_string($data['paymentType']);

$sql = "SELECT p.product_id,p.product_name, ci.qty, ci.amount
         FROM cash_invoice_items ci
        LEFT JOIN products p ON ci.product = p.product_name";

        if($paymentType == 'credit'){
             $sql = "SELECT p.product_id,p.product_name, cri.qty, cri.amount
                  FROM credit_invoice_items cri
                   LEFT JOIN products p ON cri.product = p.product_name";

        }else if($paymentType =='cheque'){
                $sql = "SELECT p.product_id,p.product_name, chei.qty, chei.amount
                   FROM cheque_invoice_items chei
                    LEFT JOIN products p ON chei.product = p.product_name";
        }
$result = $conn->query($sql);
$orders = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
     echo json_encode(['success' => true, 'orders' => $orders]);
} else {
     echo json_encode(['success' => false, 'message' => 'Failed to fetch orders: ' . $conn->error]);
}

$conn->close();
?>