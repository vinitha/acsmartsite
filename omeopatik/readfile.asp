<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%

'if session("logLevel")<2 then
'	response.write("{error:true,message:'User not logged!',sender:'readFile.asp'}")
'	Response.End()
'end if

on error resume next
dim fileName, textFile
fileName=Request("fileName")

'Create the FileSystemObject
Dim objFSO
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")

' open the stream
set textFile=objFSO.openTextFile(server.MapPath(fileName),1,true)

If Err.Number <> 0 then
	response.write("{error:true,message:'" & Err.Description & "',sender:'readFile.asp'}")
	Error.Clear
else
	response.write(textFile.readAll)
	textFile.close
end if

set textFile=nothing
set objFSO=nothing

%>