<%

'variabili di configurazione
Dim folder
folder = session("path")			'directory sul server con accesso in scrittura

if session("logLevel")<2 then
	response.write("{error:true,message:'user not logged!',sender:'upload.asp'}")
	response.end
end if

Function AlmostUniqueID()

  Randomize 
  for iCtr = 1 to 10
	sChar = Chr(Int((90 - 65 + 1) * Rnd) + 65)
  	sID = sID & sChar
  Next
  
  sID = Year(Now) & Month(Now) & Day(Now) & Hour(Now) _
    & Minute(Now) & Second(Now) & sID

  AlmostUniqueID = sID
End Function

on error resume next

'fine variabili di configurazione

Response.Expires=0
Response.Buffer = true
Response.Clear

Sub BuildUploadRequest(RequestBin)
	PosBeg = 1
	PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(13)))
	boundary = MidB(RequestBin,PosBeg,PosEnd-PosBeg)
	boundaryPos = InstrB(1,RequestBin,boundary)
		Do until (boundaryPos=InstrB(RequestBin,boundary & getByteString("--")))
		Dim UploadControl
		Set UploadControl = CreateObject("Scripting.Dictionary")
		'Get an object name
		Pos = InstrB(BoundaryPos,RequestBin,getByteString("Content-Disposition"))
		Pos = InstrB(Pos,RequestBin,getByteString("name="))
		PosBeg = Pos+6
		PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(34)))
		Name = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
		PosFile = InstrB(BoundaryPos,RequestBin,getByteString("filename="))
		PosBound = InstrB(PosEnd,RequestBin,boundary)
			If  PosFile<>0 AND (PosFile<PosBound) Then
			PosBeg = PosFile + 10
			PosEnd =  InstrB(PosBeg,RequestBin,getByteString(chr(34)))
			FileName = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
			UploadControl.Add "FileName", FileName
			Pos = InstrB(PosEnd,RequestBin,getByteString("Content-Type:"))
			PosBeg = Pos+14
			PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(13)))
			ContentType = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
			UploadControl.Add "ContentType",ContentType
			PosBeg = PosEnd+4
			PosEnd = InstrB(PosBeg,RequestBin,boundary)-2
			Value = MidB(RequestBin,PosBeg,PosEnd-PosBeg)
			Else
			Pos = InstrB(Pos,RequestBin,getByteString(chr(13)))
			PosBeg = Pos+4
			PosEnd = InstrB(PosBeg,RequestBin,boundary)-2
			Value = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
		End If
		UploadControl.Add "Value" , Value	
		UploadRequest.Add name, UploadControl	
		BoundaryPos=InstrB(BoundaryPos+LenB(boundary),RequestBin,boundary)
	Loop
End Sub
Function getByteString(StringStr)
 For i = 1 to Len(StringStr)
 	char = Mid(StringStr,i,1)
	getByteString = getByteString & chrB(AscB(char))
 Next
End Function
Function getString(StringBin)
 getString =""
 For intCount = 1 to LenB(StringBin)
	getString = getString & chr(AscB(MidB(StringBin,intCount,1))) 
 Next
End Function

byteCount = Request.TotalBytes


RequestBin = Request.BinaryRead(byteCount)
Dim UploadRequest
Set UploadRequest = CreateObject("Scripting.Dictionary")

BuildUploadRequest  RequestBin

contentType = UploadRequest.Item("photoName").Item("ContentType")
filepathname = UploadRequest.Item("photoName").Item("FileName")
filename = Right(filepathname,Len(filepathname)-InstrRev(filepathname,"\"))
filename=AlmostUniqueID & "." & Right(filepathname,Len(filepathname)-InstrRev(filepathname,"."))

value = UploadRequest.Item("photoName").Item("Value")

'Create FileSytemObject Component
Set ScriptObject = Server.CreateObject("Scripting.FileSystemObject")


'Create and Write to a File
if len(filename)>0 then
	Set MyFile = ScriptObject.CreateTextFile(Server.mappath(folder) & "\"&filename) 'filename
	 
	For i = 1 to LenB(value)
		MyFile.Write chr(AscB(MidB(value,i,1)))
	Next
	 
	MyFile.Close
end if


If Err.Number <> 0 then
	response.write("{error:true,message:'" & Err.Description & "',sender:'upload.asp'}")
	Error.Clear
else
	response.write("{error:false,message:'File uploaded!',sender:'upload.asp',fileName:'" & folder & "/" & filename & "'}")
End If



%>