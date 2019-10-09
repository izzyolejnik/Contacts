<?php
	$inData = getRequestInfo();
	
	$email = $inData["addEmail"];
    $userid = $inData["userId"];
    $firstname = $inData["addFName"];
    $lastname = $inData["addLName"];
	$phone = $inData["cPhoneNum"];
	
	$conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = $conn->prepare("INSERT INTO contacts (firstname, lastname, phone, email, userid) VALUES (?,?,?,?,?)");
        $sql->bind_param("ssssi", $firstname, $lastname, $phone, $email, $userid);
		$sql->execute();

		$conn->close();
		returnWithInfo("added");
	}
	
	// receive the contact info to be added
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// send result as json
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// format return info as json
	function returnWithInfo($send)
	{
		$retVal = '{"results":"' . $send . '"}';
		sendResultInfoAsJson($retVal);
	}

	// return error as json
	function returnWithError($err)
	{
		$retVal = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retVal);
	}
	
?>