<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>


<%
	dim folderName, fileType
	folderName=request("folderName")
	fileType=ucase(request("fileType"))
	if len(fileType)>0 then
		fileType=split(fileType,",")
	end if
	
	session("path")=folderName
		
	dim fs,folders,folderObj,files,fileObj,path,folderPath
	set fs=Server.CreateObject("Scripting.FileSystemObject")
	
	folderPath=folderName
	set folders=fs.GetFolder(server.MapPath(folderName)).subFolders
	set files=fs.GetFolder(server.MapPath(folderName)).files
	
	'creating the json object
	response.Write("{")
		response.write("folderName:'" & folderName & "',")
		response.write("files:[")
		dim filesStr		
		for each fileObj in files
			for each ft in fileType
				if(instr(ucase(fileObj.name),"." & ft)>0) then
					filesStr=filesStr & "{ name:'" & fileObj.name & "',"			
					filesStr=filesStr & "path:'" & folderPath & "/" & fileObj.name & "',"
					filesStr=filesStr & "dateLastModified:'" & fileObj.DateLastModified & "'},"	
				end if																	
			next
		next
		if(len(filesStr)>0) then
			response.write(left(filesStr,len(filesStr)-1))
		end if
		
		response.write("],")
		
		response.write("folders:[")
		dim dirStr
		for each folderObj in folders
			dirStr=dirStr & "{ name:'" & folderObj.name & "',"			
			dirStr=dirStr & "path:'" & folderPath & "/" & folderObj.name & "',"
			dirStr=dirStr & "dateLastModified:'" & folderObj.DateLastModified & "'},"			
		next
		if len(dirStr)>1 then
			response.write(left(dirStr,len(dirStr)-1))
		end if
		response.write("]")
			
	response.Write("}")
	
	
	set folders=nothing
	set folderObj=nothing
	set files=nothing
	set fileObj=nothing
	set fs=nothing
	
%>
