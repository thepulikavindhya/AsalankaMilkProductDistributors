

<?php
$servername = "localhost";
$username = "root";
$password = ""; // XAMPP default password is empty
$dbname = "inventory_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>