<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['all_data'])) {
    $all_data = $data['all_data'];
     $conn->begin_transaction();
    try{
         foreach($all_data as $item){
            $productId = $conn->real_escape_string($item['productId']);
            $productName = $conn->real_escape_string($item['productName']);
            $stock = intval($item['stock']);

            $sql = "INSERT INTO products (product_id, product_name, stock) VALUES ('$productId', '$productName', $stock) ON DUPLICATE KEY UPDATE product_name = '$productName',stock = $stock";

               if ($conn->query($sql) !== TRUE) {
                   $conn->rollback();
                    echo json_encode(['success' => false, 'message' => 'Error saving product data: ' . $conn->error]);
                     $conn->close();
                      exit;
                }
          }

          $conn->commit();
         echo json_encode(['success' => true, 'message' => 'Product data saved successfully!']);

        }catch (Exception $e){
                $conn->rollback();
              echo json_encode(['success' => false, 'message' => "An error occurred: " . $e->getMessage()]);
        }

} else {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
}

$conn->close();
?>