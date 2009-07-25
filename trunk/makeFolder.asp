<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%
	dim folderName
	dim fname
	fname=request("folderName")
	folderName=server.MapPath(fname)
	
	if session("logLevel")<2 then
		response.write("{error:true,message:'user not logged!',sender:'makeFolder.asp'}")
		response.end()
	end if
	
	Dim myFSO 
	SET myFSO = Server.CreateObject("Scripting.FileSystemObject") 
	If NOT myFSO.FolderExists(folderName) Then 
		myFSO.CreateFolder(folderName) 
	Else 
		response.write("{error:true,message:'This folder already exists! [ " & fname & " ]',sender:'makeFolder.asp'}")
		response.End()
	End If 
	
	response.write("{error:false,message:'Folder created! [ " & fname & " ]',sender:'makeFolder.asp'}")
	SET myFSO = NOTHING 	
%>
