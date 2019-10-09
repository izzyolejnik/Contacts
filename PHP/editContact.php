<?php

    $inData = getRequestInfo();
    $id = $inData["id"];
    $email = $inData["email"];
    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
	$phone = $inData["phone"];

    $conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
    }
    
    $query = "UPDATE `contacts` SET `firstname`= '$firstname',`lastname` = '$lastname', `phone`= '$phone',`email`= '$email' WHERE id=$id";
    $conn->query($query);
    
    $conn->close();

    // Decode json file received
    function getRequestInfo($firstname, $lastname, $phone, $email, $id)
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
        $retVal = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retVal);
    }
    
    // Format return information in json
    function returnWithInfo($firstname, $lastname, $email, $phone, $id)
    {
        $retVal = '{"firstname":[' . $firstname . '], "lastname":[' . $lastname . '], "email":[' . $email . '], "phone":[' . $phone . '], "id":[' . $id . '],"error":""}';
        sendResultInfoAsJson($retVal);
    }

?>



