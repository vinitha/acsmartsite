<%@LANGUAGE="JavaScript"%>



<script src="/smartSite/script/myJson.js" language="JavaScript" runat="server"></script>
<%

/*
if session("logLevel")<2 then
	response.write("{error:true,message:'User not logged!',sender:'writeFile.asp'}")
	Response.End()
end if
*/

try{
	
	var fileName=new String(Request("fileName"))
	var content=new String(Request("content")).toString()
			
	var docObj={};
	
	//Create the FileSystemObject
	var objFSO = Server.CreateObject("Scripting.FileSystemObject")
	
	
	//Update the file
	var fileStream = objFSO.OpenTextFile(Server.MapPath(fileName),1,true)	//open for reading
	try{
		docObj=eval("(" + fileStream.readAll() + ")")
	}catch(e){
		
	}
	
	fileStream.close()
	
	fileStream = objFSO.OpenTextFile(Server.MapPath(fileName),2,true)		//open for writing
	
	var clientObj=eval("(" + content + ")")
	
	for(p in clientObj){
		docObj[p]=clientObj[p]
		Response.Write(clientObj["pg2"])
	}

	
	fileStream.write(toJsonString(docObj))
	fileStream.close()

	objFSO=null;
}catch(e){
		var err=Server.GetLastError();
		Response.write("{error:true,message:'" + err.Line + " - " + e.message + "',sender:'writeFile.asp'}")
		Response.end()
}

	Response.write("{error:false,message:" + toJsonString(docObj) + ",sender:'writeFile.asp'}")
%>