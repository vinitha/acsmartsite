<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%

'if session("logLevel")<2 then
'	response.write("{error:true,message:'User not logged!',sender:'killFolder.asp'}")
'	Response.End()
'end if

on error resume next
dim fileName
folderName=Request("folderName")

'Create the FileSystemObject
Dim objFSO
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")


'Delete the folder
objFSO.DeleteFolder server.MapPath(folderName), False

set objFSO=nothing

If Err.Number <> 0 then
	response.write("{error:true,message:'" & replace(Err.Description,"'","#") & "',sender:'killFolder.asp'}")
	Error.Clear
else
	response.write("{error:false,message:'Folder deleted!',sender:'killFolder.asp'}")
end if
%>