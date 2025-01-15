<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $returnType = $conn->real_escape_string($data['returnType']);
    $invoiceNo = $conn->real_escape_string($data['invoiceNo']);
    $billDate = $conn->real_escape_string($data['billDate']);
    $returnDate = $conn->real_escape_string($data['returnDate']);
    $deliverymanId = $conn->real_escape_string($data['deliverymanId']);
    $customer = $conn->real_escape_string($data['customer']);
    $reason = $conn->real_escape_string($data['reason']);
    $totalAmount = $conn->real_escape_string($data['totalAmount']);
     $items = $data['items'];


    $conn->begin_transaction();
     $sql = "INSERT INTO returns (return_type, invoice_no, bill_date, return_date, deliveryman_id, customer, reason,total_amount) VALUES ('$returnType', '$invoiceNo', '$billDate', '$returnDate', '$deliverymanId', '$customer', '$reason', '$totalAmount')";

    if ($conn->query($sql) === TRUE) {
        $returnId = $conn->insert_id;
         $table_name = ($returnType == 'customer') ? 'customer_return_items' : 'company_return_items';
           foreach ($items as $item) {
               $product = $conn->real_escape_string($item['product']);
               $qty = (int) $item['qty'];
               $originalPrice = (float) $item['originalPrice'];
               $discountedPrice = (float) $item['discountedPrice'];
               $amount = (float) $item['amount'];

               $item_sql = "INSERT INTO $table_name (return_id, product, qty, original_price, discounted_price, amount) VALUES ('$returnId', '$product', '$qty', '$originalPrice', '$discountedPrice', '$amount')";
                if ($conn->query($item_sql) !== TRUE) {
                     $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Error saving items: ' . $conn->error]);
                    $conn->close();
                    exit;
                 }
           }

           $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Return data saved successfully!']);
    } else {
         $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Error saving return info: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>