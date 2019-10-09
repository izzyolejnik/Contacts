<?php

    $inData = getRequestInfo();
    $id = $inData["id"];

    $conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }

    $sql = $conn->prepare("SELECT * FROM contacts WHERE id=?");
    $sql->bind_param("s", $id);
    //Execute the query
    $sql->execute();
    $result = $sql->get_result();
    
    // If no rows exist with entered username, account does not exist
    if($result->num_rows > 0)
    {
       // Store row result from query into $row variable
       $row = $result->fetch_assoc();
        $firstname = $row["firstname"];
        $lastname = $row["lastname"];
        $email = $row["email"];
        $phone = $row["phone"];
        
        returnWithInfo($firstname, $lastname, $email, $phone);
        $conn->close();
    }
    else
    {
        $conn->close();
        returnWithError("Problem with the contact id");
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
    
    // Format return into json
    function returnWithInfo($firstname, $lastname, $email, $phone)
    {
      $retVal = '{"firstname": "' . $firstname . '" ,"lastname": "' . $lastname . '", "email": "' . $email . '", "phone": "' . $phone . '","error":""}';
      sendResultInfoAsJson($retVal);
    }

?>
