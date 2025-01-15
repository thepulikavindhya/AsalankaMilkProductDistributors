<?php
header('Content-Type: application/json');
require_once 'config.php';


if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);

    $sql = "SELECT id, password FROM users WHERE email = '$email'";
     $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Verify the password
       if (password_verify($password, $user['password'])) {
            echo json_encode(['success' => true]);
        } else {
              echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        }
    } else {
         echo json_encode(['success' => false, 'message' => 'User not found.']);
    }
} else {
     echo json_encode(['success' => false, 'message' => 'No data received.']);
}


$conn->close();
?>