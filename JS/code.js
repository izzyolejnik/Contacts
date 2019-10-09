var urlBase = 'http://kissmethruthephone.com';

var userId = 0;
var username = "";
var password = "";
var temp = 0;
var globalid = "";

var editfirst = "";
var editlast = "";
var editphone = "";
var editemail = "";

function doLogin()
{
	userId = 0;
	username = "";
	password = "";

	// Take in the username and password from the user
	username = document.getElementById("loginUsername").value;
	password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + username + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login2.php';

	// send the json
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=utf8");
	
	try
	{
		// send the json information to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;

				// if return 0, login was unsuccessful
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
					return;
				}

				// assign username & password to global vars
				username = jsonObject.username;
				password = jsonObject.password;

				document.getElementById("loginUsername").value = "";
				document.getElementById("loginPassword").value = "";
				document.getElementById("contactAddResult").innerHTML = "";

				hideOrShow("loggedInDiv", true);
				hideOrShow("accessUIDiv", true);
				hideOrShow("loginDiv", false);
				getContacts();
			}
		};
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function toRegister()
{
	hideOrShow("registerDiv", true);
	hideOrShow("loginDiv", false);
}

function doRegister()
{
	// get information from user
	var username = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;
	var verifyp = document.getElementById("verifyPassword").value;

	var jsonPayload = '{"username" : "' + username + '", "password" : "' + password + '", "verifyp" : "' + verifyp + '"}';
	var url = urlBase + '/Register2.php';

	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=utf8");

	try
	{
		// send the json information to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				// will return 0 if username is already taken
				if( userId == -1)
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				// go back to login page
				hideOrShow("loginDiv", true);
				hideOrShow("registerDiv", false);
			}
		};
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	hideOrShow("loggedInDiv", false);
	hideOrShow("accessUIDiv", false);
	hideOrShow("editDiv", false);
	hideOrShow("loginDiv", true);
}

function toMain()
{
	// reset some of the elements
	document.getElementById("fname").value = "";
	document.getElementById("lname").value = "";
	document.getElementById("pnum").value = "";
	document.getElementById("emum").value = "";

	hideOrShow("editDiv", false);
	hideOrShow("addDiv", false);
	hideOrShow("accessUIDiv", true);
	getContacts();
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

function showAdd()
{
	hideOrShow("addDiv", true);
	hideOrShow("accessUIDiv", false);
}

function addContact()
{
   // Get the contact info from the HTML that was entered into the text boxes
   var cFName = document.getElementById("addFName").value;
   var cLName = document.getElementById("addLName").value;
   var cPhoneNum = document.getElementById("addPhone").value;
   var addEmail = document.getElementById("addEmail").value;

   document.getElementById("contactAddResult").innerHTML = "";

   // Prepare to send the contact info to the server
   var jsonPayload = '{"addFName" : "' + cFName + '", "addLName" : "' + cLName + '", "cPhoneNum" : "' + cPhoneNum + '", "addEmail" : "' + addEmail + '", "userId" : "' + userId + '"}';
   var url = urlBase + '/addContact.php';

   var xhr = createCORSRequest('GET', url);
   xhr.open("POST", url, true);
   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

   try
   {
	   // Send the json info to php
	   xhr.send(jsonPayload);
	   
	   xhr.onreadystatechange = function()
	   {
		   if (this.readyState == 4 && this.status == 200)
		   {
			   // clear the table
			   for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
			   {
				   document.getElementById("conTable").deleteRow(i -1);
			   }
			   
			   // refill the table
			   getContacts();
			   
			   document.getElementById("addEmail").value = "";
			   document.getElementById("addFName").value = "";
			   document.getElementById("addLName").value = "";
			   document.getElementById("addPhone").value = "";
			   document.getElementById("contactAddResult").innerHTML = "Contact(s) have been added!";
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function getContacts()
{
	// In order to grab the correct contacts we need to send the database the userid so we only
	// receive contacts associated with that user
	var jsonPayload = '{"userid" : "' + userId + '"}';
	var url = urlBase + '/getContacts.php';

    var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		// Send the json info to php
      	xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				temp = 0;

				// clear the table
				for (var i = document.getElementById("conTable").rows.length; i > 1;i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				while (temp < jsonObject.phone.length)
				{
					var table = document.getElementById('conTable');

					// add a new row to the bottom of the table, then fill with information
					var row = table.insertRow(-1);

					var cell1 =row.insertCell(0);
					var cell2 =row.insertCell(1);
					var cell3 =row.insertCell(2);
					var cell4 =row.insertCell(3);
					var cell5 =row.insertCell(4);
					var cell6 =row.insertCell(5);

					cell1.innerHTML = jsonObject.firstname[temp];
					cell2.innerHTML = jsonObject.lastname[temp];
					cell3.innerHTML = jsonObject.phone[temp];
					cell4.innerHTML = jsonObject.email[temp];
					cell5.innerHTML = '<td><button type="button" class="button" id="editbut" onclick="editContact(' + (jsonObject.id[temp]) + ');">Edit</button></td>';
					cell6.innerHTML = '<td><button type="button" class="button" id ="deletebut" onclick="deleteContact(' + (jsonObject.id[temp]) + ');">Delete</button></td>';
					temp++;
				}
			}
		};
	}
	catch(err)
	{
		document.getElementById("getContacts").innerHTML = err.msg;
	}
}

function deleteContact(id)
{
	// Only need the contact's id in order to delete them from the database
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/deleteContact.php';
	document.getElementById("contactAddResult").innerHTML = "";
 
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
	try
	{
		// send the json info to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// clear the table so it can be reprinted
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				getContacts();
			}
		};
	}
	catch(err)
	{
		 document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function editContact(id)
{
	globalid = id;
	document.getElementById("contactAddResult").innerHTML = "";
	hideOrShow("editDiv", true);
	hideOrShow("accessUIDiv", false);
	editAutofill(id);
}

function editAutofill(id)
{
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/editContactHelper.php';

	// Create and open a connection to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				document.getElementById("fname").placeholder = jsonObject.firstname;
				document.getElementById("lname").placeholder = jsonObject.lastname;
				document.getElementById("pnum").placeholder = jsonObject.phone;
				document.getElementById("emum").placeholder = jsonObject.email;

				editfirst = jsonObject.firstname;
				editlast = jsonObject.lastname;
				editphone = jsonObject.phone;
				editemail = jsonObject.email;
				
			}
		};
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}

}

function doEdit()
{
	// Get the contact info from the HTML
	var fname = document.getElementById("fname").value;
	var lname = document.getElementById("lname").value;
	var pnum = document.getElementById("pnum").value;
	var email = document.getElementById("emum").value;

	if(fname == "")
	{
		fname = editfirst;
	}
	if(lname == "")
	{
		lname = editlast;
	}
	if(pnum == "")
	{
		pnum = editphone;
	}
	if(email == "")
	{
		email = editemail;
	}
	var jsonPayload = '{"firstname" : "' + fname + '", "lastname" : "' + lname + '", "phone" : "' + pnum + '", "email" : "' + email + '", "id" : "' + globalid + '"}';
	var url = urlBase + '/editContact.php';
	
	// Create and open a connection to the server
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// clear the table so it can reprint
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				toMain();
			}
		};
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function searchContact()
{
	// Get info from the html
	var search = document.getElementById("searchText").value;

	document.getElementById("contactAddResult").innerHTML = "";
	document.getElementById("contactSearchResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + search + '", "id" : "' + userId + '"}';
	var url = urlBase + '/searchContacts.php';
	
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				temp = 0;
				
				// clear the table
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				while (temp < jsonObject.phone.length)
				{
					var table = document.getElementById('conTable');

					// insert row at the bottom of the table and then fill with the found contact information
					var row = table.insertRow(-1);

					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					var cell5 = row.insertCell(4);
					var cell6 = row.insertCell(5);


					cell1.innerHTML = jsonObject.firstname[temp];
					cell2.innerHTML = jsonObject.lastname[temp];
					cell3.innerHTML = jsonObject.phone[temp];
					cell4.innerHTML = jsonObject.email[temp];
					cell5.innerHTML = '<td><button type="button" class="button" onclick="editContact(' + (jsonObject.id[temp]) + ');">Edit</button></td>';
					cell6.innerHTML = '<td><button type="button" class="button" id ="deletebut" onclick="deleteContact(' + (jsonObject.id[temp]) + ');">Delete</button></td>';

					temp++;
				}
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
  
	  // Check if the XMLHttpRequest object has a "withCredentials" property.
	  // "withCredentials" only exists on XMLHTTPRequest2 objects.
	  xhr.open(method, url, true);
  
	} else if (typeof XDomainRequest != "undefined") {
  
	  // Otherwise, check if XDomainRequest.
	  // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	  xhr = new XDomainRequest();
	  xhr.open(method, url);
  
	} else {
  
	  // Otherwise, CORS is not supported by the browser.
	  xhr = null;
  
	}
	return xhr;
  }
  