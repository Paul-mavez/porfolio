<?php
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

// Database credentials
$servername = "localhost";
$username = "root"; // your MySQL username
$password = "paul12345"; // your MySQL password
$dbname = "portfolio";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['name'], $data['email'], $data['message'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$fullname = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$message = $conn->real_escape_string($data['message']);

// Insert into database
$sql = "INSERT INTO messages (fullname, email, message) VALUES ('$fullname', '$email', '$message')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send message"]);
}

$conn->close();
?>
