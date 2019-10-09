<?php

	$inData = getRequestInfo();
	
	$username = $inData["username"];
    $password = $inData["password"];
    $verifyp = $inData["verifyp"];
	
	$conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
	if ($conn->connect_error) 
	{
        returnWithError( $conn->connect_error );
    }
    
    // Validate username
    if (empty($username) || empty($password) || empty($verifyp))
    {
       returnWithError("Please fill out all fields.");
       $conn->close();
       exit();
    }
    else if ($password != $verifyp)
    {
       returnWithError("The passwords do not match!");
       $conn->close();
       exit();
    }
    else
    {
        // Prepare sql statement to prevent SQL Injection attacks
        $sql = $conn->prepare("SELECT * FROM users WHERE username=?");
        $sql->bind_param("s", $username);

        //Execute the query
        $sql->execute();
        $result = $sql->get_result();
        $sql->close();

        if($result->num_rows == 1)
        {
            returnWithError("This username already exists!");
            $conn->close();
            exit();
        }
    }

    $paramPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare an insert statement
    $sql = "INSERT INTO users (username, password) VALUES ('$username','$paramPassword')";
    $conn->query($sql);

    // Now check if the information is in the database!
    $sql = "SELECT 'id' FROM 'users' WHERE username =". $username;
    $result = $conn->query($sql);

    $rowNumber = $result->num_rows;

    if ($rowNumber >= 0)
    {
        returnWithInfo("New user added!");
        $conn->close();
        exit();
    }

   
   // Decode json file received
   function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
    // Send off json
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Return error in json file
	function returnWithError($err)
	{
		$retVal = '{"id" : -1, "error":"' . $err . '"}';
		sendResultInfoAsJson($retVal);
	}
	
	// Format user's unique id into json file
	function returnWithInfo($id)
	{
		$retVal = '{"result" :"' . $id . '"}';
		sendResultInfoAsJson($retVal);
    }
    
?>