<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}


$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['items'])) {
    $items = $data['items'];
    $conn->begin_transaction();
    try {
        foreach ($items as $item) {
            $product = $conn->real_escape_string($item['product']);
            $qty = intval($item['qty']);

            // Find the product with name
            $product_sql ="SELECT id , stock FROM products WHERE product_name = '$product'";
              $result = $conn->query($product_sql);
               if ($result && $result->num_rows > 0) {
                 $row = $result->fetch_assoc();
                 $product_id = $row['id'];
                  $currentStock = $row['stock'];
                  $newStock = $currentStock - $qty;
                 if($newStock<0){
                        $conn->rollback();
                       echo json_encode(['success' => false, 'message' => "Stock cannot be negative for {$product}."]);
                       $conn->close();
                       exit;
                  }

                    $updateSql = "UPDATE products SET stock = '$newStock' WHERE id = '$product_id'";
                       if ($conn->query($updateSql) !== TRUE) {
                         $conn->rollback();
                         echo json_encode(['success' => false, 'message' => 'Error updating stock: ' . $conn->error]);
                        $conn->close();
                         exit;
                       }
                }else{
                    $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Product not found : '.$product ]);
                      $conn->close();
                      exit;
                }

        }
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Stock updated successfully!']);

    }catch (Exception $e) {
          $conn->rollback();
        echo json_encode(['success' => false, 'message' => "An error occurred: " . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No data received or invalid items.']);
}

$conn->close();
?>