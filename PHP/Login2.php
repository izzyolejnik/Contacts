<?php

	$inData = getRequestInfo();
	
	$username = $inData["username"];
	$password = $inData["password"];
	
	$conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    
    // If either field is empty, return error
   if (empty($username) || empty($password))
   {
      returnWithError("Enter username and password.");
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
      
      // If no rows exist with entered username, account does not exist
      if($result->num_rows > 0)
      {
         // Store row result from query into $row variable
         $row = $result->fetch_assoc();
         
         $pwdCheck = password_verify($password, $row["password"]);
         
         // If hashed passwords dont match, return error
         if ($pwdCheck == false)
         {
            returnWithError("Incorrect password.");
            $conn->close();
            exit();
         }
         // If hashed passwords match, send user's unique id off in json
         else if($pwdCheck == true)
         {
            returnWithInfo($row["id"]);
            $conn->close();
            exit();
         }
         else  // Just incase
         {
            returnWithError("Incorrect password.");
            $conn->close();
            exit();
         }
     }
     else
     {
        // Entered username does not exist in database
        $conn->close();
        returnWithError("No user found");
        exit();
     }
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
		$retVal = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retVal);
	}
	
	// Format user's unique id into json file
	function returnWithInfo($id)
	{
		$retVal = '{"id":"' . $id . '"}';
		sendResultInfoAsJson($retVal);
	}
?>