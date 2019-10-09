<?php

    $inData = getRequestInfo();
    $userid = $inData["id"];	
    $search = $inData["search"];

    $conn = new mysqli("localhost", "guest", "guest123", "Contact Manager");
  	if ($conn->connect_error)
	  {
      returnWithError( $conn->connect_error );
    }

    $firstname = "";
    $lastname = "";
    $email = "";
    $phone = "";
    $searchCount = 0;

    $sql = "SELECT * FROM `contacts` WHERE (userid = $userid AND (firstname LIKE '%$search%' OR phone LIKE '%$search%' OR lastname LIKE '%$search%' OR email LIKE '%$search%')) ORDER BY firstname";
    $result = $conn->query($sql);

    $rowNumber = $result->num_rows;
    
    if($rowNumber > 0)
    {
      while($row = $result->fetch_assoc())
      {
        if( $searchCount > 0 )
        {
          $firstname .=",";
          $lastname .=",";
          $email .=",";
          $phone .=",";
          $id .=",";
        }

        $searchCount++;
        $firstname .= '"' . $row["firstname"] . '"';
        $lastname .= '"' . $row["lastname"] . '"';
        $email .= '"' . $row["email"] . '"';
        $phone .= '"' . $row["phone"] . '"';
        $id .= '"' . $row["id"] . '"';
      }
      
      returnWithInfo( $firstname, $lastname, $email, $phone, $id);
      $conn->close();
  }
  else
  {
      returnWithError("No Contacts Added Yet");
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
    $retVal = '{"id":0,"error":"' . $err . '"}';
       sendResultInfoAsJson($retVal);
  }
  
  // Format return into json
  function returnWithInfo($firstname, $lastname, $email, $phone, $id)
  {
    $retVal = '{"firstname":[' . $firstname . '], "lastname":[' . $lastname . '], "email":[' . $email . '], "phone":[' . $phone . '], "id":[' . $id . '],"error":""}';
    sendResultInfoAsJson($retVal);
  }

?>

