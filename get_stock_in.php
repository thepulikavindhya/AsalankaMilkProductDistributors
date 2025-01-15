<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

$page = isset($data['page']) ? intval($data['page']) : 1;
$itemsPerPage = isset($data['itemsPerPage']) ? intval($data['itemsPerPage']) : 10;
$searchTerm = isset($data['searchTerm']) ? $conn->real_escape_string($data['searchTerm']) : '';

$offset = ($page - 1) * $itemsPerPage;

$sql = "SELECT p.product_id, p.product_name, p.stock, 
                COALESCE(SUM(cri.qty), 0) as customer_returns
                FROM products p
                LEFT JOIN customer_return_items cri ON p.product = cri.product";
if ($searchTerm) {
    $sql .= " WHERE p.product_id LIKE '%$searchTerm%'";
}

$sql .=" GROUP BY p.id LIMIT $itemsPerPage OFFSET $offset";

$result = $conn->query($sql);
$stockData = [];
if ($result) {
        while ($row = $result->fetch_assoc()) {
            $stockData[] = $row;
        }
}


$totalItemsSql = "SELECT COUNT(*) AS total FROM products";
if ($searchTerm) {
   $totalItemsSql .= " WHERE product_id LIKE '%$searchTerm%'";
}
$totalItemsResult = $conn->query($totalItemsSql);
$totalItems = $totalItemsResult && $totalItemsResult->num_rows > 0 ? $totalItemsResult->fetch_assoc()['total'] : 0;


if($stockData){
     echo json_encode(['success' => true, 'stockData' => $stockData, 'totalItems' => $totalItems]);
}else{
  echo json_encode(['success' => false, 'message' => 'Failed to fetch stock in data: ' . $conn->error]);
}
$conn->close();
?>