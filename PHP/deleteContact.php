<?php
    $inData = getRequestInfo();

	$cId = $inData["id"];

	$conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

	$sql = $conn->prepare("DELETE FROM contacts WHERE id = ?");
	$sql->bind_param("i", $cId);

	$result = $sql->execute();

	if($result == false)
	{
		returnWithError("User was not deleted");
	}
	else
	{
		$conn->close();
		returnWithInfo("User was deleted.");
	}
	

	// Receive the information to be deleted and the userId
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'),true);
	}
	
	// return error as json
	function returnWithError($err)
	{
		$retVal = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retVal);
	}

	// return info as json
	function returnWithInfo($send)
	{
		$retVal = '{"results":"' . $send . '"}';
		sendResultInfoAsJson($retVal);
	}
	
	// return data as json
	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
?>