<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%

if session("logLevel")<2 then
	response.write("{error:true,message:'User not logged!',sender:'killFile.asp'}")
	Response.End()
end if

on error resume next
dim fileName
fileName=Request("fileName")

'Create the FileSystemObject
Dim objFSO
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")


'Delete the file
objFSO.DeleteFile server.MapPath(fileName), False

set objFSO=nothing

If Err.Number <> 0 then
	response.write("{error:true,message:'" & Err.Description & "',sender:'killFile.asp'}")
	Error.Clear
else
	response.write("{error:false,message:'File deleted!',sender:'killFile.asp'}")
end if
%>