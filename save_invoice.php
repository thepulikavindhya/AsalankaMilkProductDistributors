<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $paymentMethod = $conn->real_escape_string($data['paymentMethod']);
    $invoiceNo = $conn->real_escape_string($data['invoiceNo']);
    $billDate = $conn->real_escape_string($data['billDate']);
    $deliverymanId = $conn->real_escape_string($data['deliverymanId']);
     $customer = $conn->real_escape_string($data['customer']);
    $totalAmount = $conn->real_escape_string($data['totalAmount']);
    $items = $data['items'];


     $conn->begin_transaction();
    $sql = "INSERT INTO invoices (payment_method, invoice_no, bill_date, deliveryman_id, customer, total_amount) VALUES ('$paymentMethod', '$invoiceNo', '$billDate', '$deliverymanId','$customer', '$totalAmount')";

    if ($conn->query($sql) === TRUE) {
         $invoiceId = $conn->insert_id;
           $table_name = '';
            switch($paymentMethod){
               case 'cash':
                     $table_name = 'cash_invoice_items';
                     break;
               case 'credit':
                     $table_name = 'credit_invoice_items';
                      break;
                 case 'cheque':
                     $table_name = 'cheque_invoice_items';
                     break;
               default:
                     $conn->rollback();
                      echo json_encode(['success' => false, 'message' => 'Invalid payment method']);
                    $conn->close();
                      exit;

           }

           foreach ($items as $item) {
                $product = $conn->real_escape_string($item['product']);
                $qty = (int) $item['qty'];
                $originalPrice = (float) $item['originalPrice'];
                $discountedPrice = (float) $item['discountedPrice'];
                $amount = (float) $item['amount'];
                $item_sql = "INSERT INTO $table_name (invoice_id, product, qty, original_price, discounted_price, amount) VALUES ('$invoiceId', '$product', '$qty', '$originalPrice', '$discountedPrice', '$amount')";
                if ($conn->query($item_sql) !== TRUE) {
                    $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Error saving items: ' . $conn->error]);
                    $conn->close();
                    exit;
                 }
            }
             $invoice_list_sql = "INSERT INTO invoice_list (invoice_no, amount) VALUES ('$invoiceNo','$totalAmount')";
             if($conn->query($invoice_list_sql) !==TRUE){
               $conn->rollback();
               echo json_encode(['success' => false, 'message' => 'Error saving invoice list: ' . $conn->error]);
                    $conn->close();
                    exit;
            }
         $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Invoice data saved successfully!']);
    } else {
        $conn->rollback();
         echo json_encode(['success' => false, 'message' => 'Error saving invoice info: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>