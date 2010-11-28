<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%

if session("logLevel")<2 then
	response.write("{error:true,message:'User not logged!',sender:'writeFile.asp'}")
	Response.End()
end if

on error resume next
dim fileName, title, descr, fileStream
fileName=Request("fileName")
content=Request("content")

'Create the FileSystemObject
Dim objFSO
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")


'Update the file
set fileStream = objFSO.OpenTextFile(server.MapPath(fileName),2,true)

fileStream.write(content)
fileStream.close

set objFSO=nothing


If Err.Number <> 0 then
	response.write("{error:true,message:'" & Err.Description & "',sender:'writeFile.asp'}")
	Error.Clear
else
	response.write("{error:false,message:'Text updated!',sender:'writeFile.asp'}")
end if
%>