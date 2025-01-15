<?php
header('Content-Type: application/json');

// Include the database configuration file
require_once 'config.php';

if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

// Fetch company returns
$companyReturnsSql = "SELECT r.invoice_no, r.return_date, cri.product, cri.qty, cri.amount
                    FROM returns r
                    INNER JOIN company_return_items cri ON r.id = cri.return_id
                    WHERE r.return_type = 'company'";

$companyReturnsResult = $conn->query($companyReturnsSql);
$companyReturns = [];
if ($companyReturnsResult) {
    while ($row = $companyReturnsResult->fetch_assoc()) {
        $companyReturns[] = $row;
    }
}

// Fetch customer returns
$customerReturnsSql = "SELECT r.invoice_no,r.return_date, cri.product, cri.qty, cri.amount
                    FROM returns r
                    INNER JOIN customer_return_items cri ON r.id = cri.return_id
                    WHERE r.return_type = 'customer'";

$customerReturnsResult = $conn->query($customerReturnsSql);
$customerReturns = [];
if ($customerReturnsResult) {
    while ($row = $customerReturnsResult->fetch_assoc()) {
        $customerReturns[] = $row;
    }
}


echo json_encode([
    'success' => true,
    'companyReturns' => $companyReturns,
    'customerReturns' => $customerReturns
]);

$conn->close();
?>