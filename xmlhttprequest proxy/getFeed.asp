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
	
fs=Server.CreateObject("Scripting.FileSystemObject");
f=fs.OpenTextFile(Server.MapPath("/public/feedCache.txt"),1,true,-1);


var tmpStr=f.ReadAll().split(":::");
for(var x=0;x<tmpStr.length;)
cache[tmpStr[0]]=tmpStr[1];


  
  
  
	if(!cache.url){
		f.Close();
		f=fs.OpenTextFile(Server.MapPath("/public/feedCache.txt"),8,true,-1);
		// Create an xmlhttp object:
		xml = Server.CreateObject("Microsoft.XMLHTTP")
		// Or, for version 3.0 of XMLHTTP, use:
		// Set xml = Server.CreateObject("MSXML2.ServerXMLHTTP")
		
		// Opens the connection to the remote server.
		xml.Open("GET", url, false)
		
		// Actually Sends the request and returns the data:
		xml.Send();
		cache.url=xml.responseText;
		
		f.WriteLine(url+":::"+cache.url);		
		
	}else{
		cached=true;
	}
  
	Response.Write(Request.QueryString("callback") + '({"ver":1,"cached":' + cached + ',"text":')
		str=Server.URLEncode(xml.responseText)
	Response.Write("'" + str + "'")
	Response.Write("})")


f.Close()
f=null;
fs=null;
  
  xml = null;

%>