<%@LANGUAGE="JavaScript"%>

<%


Response.Buffer = true;

var fs,
	f,
	url=Request.QueryString("url"),
	xml,
	str,
	cache={},
	cached=false;
	

  
  


		// Create an xmlhttp object:
		xml = Server.CreateObject("Microsoft.XMLHTTP")
		// Or, for version 3.0 of XMLHTTP, use:
		// Set xml = Server.CreateObject("MSXML2.ServerXMLHTTP")
		
		// Opens the connection to the remote server.
		xml.Open("GET", url, false)
		
		// Actually Sends the request and returns the data:
		xml.Send();

		

  
	Response.Write(xml.responseText)

f=null;
fs=null;
  
  xml = null;

%>