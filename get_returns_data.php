<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}
$data = json_decode(file_get_contents("php://input"), true);
$returnType = $conn->real_escape_string($data['returnType']);

$sql = "SELECT r.invoice_no,cri.product,p.product_id,p.product_name,cri.qty, cri.amount
    FROM returns r
    INNER JOIN customer_return_items cri ON r.id = cri.return_id
     LEFT JOIN products p ON cri.product = p.product_name
    WHERE r.return_type = '$returnType'";

    if($returnType == 'company'){
         $sql = "SELECT r.invoice_no,cri.product,p.product_id,p.product_name,cri.qty, cri.amount
            FROM returns r
            INNER JOIN company_return_items cri ON r.id = cri.return_id
            LEFT JOIN products p ON cri.product = p.product_name
           WHERE r.return_type = '$returnType'";
    }

$result = $conn->query($sql);

$returns = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $returns[] = $row;
    }
     echo json_encode(['success' => true, 'returns' => $returns]);
} else {
     echo json_encode(['success' => false, 'message' => 'Failed to fetch returns: ' . $conn->error]);
}

$conn->close();
?>