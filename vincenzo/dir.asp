<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>


<%
	dim folderName
	folderName=request("folderName")
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
		dim infoStr, thumbsStr
		infoStr="info:{title:null,description:null},"
		thumbsStr=""
		for each fileObj in files
			if(instr(fileObj.name,"_th_")>0) then
				thumbsStr=thumbsStr & "{ name:'" & fileObj.name & "',"			
				thumbsStr=thumbsStr & "path:'" & folderPath & "/" & fileObj.name & "',"
				thumbsStr=thumbsStr & "dateLastModified:'" & fileObj.DateLastModified & "'},"															
			else							
				if(fileObj.name="info.json") then
					infoStr="info:" + fileObj.OpenAsTextStream.readAll  + ","
				else
					filesStr=filesStr & "{ name:'" & fileObj.name & "',"			
					filesStr=filesStr & "path:'" & folderPath & "/" & fileObj.name & "',"
					filesStr=filesStr & "dateLastModified:'" & fileObj.DateLastModified & "'},"											
				end if
			end if
		next
		if(len(filesStr)>0) then
			response.write(left(filesStr,len(filesStr)-1))
		end if
		
		response.write("],")
		response.Write(infoStr)	
		
		response.Write("thumbnails:[")
		if(len(thumbsStr)>0) then
			response.write(left(thumbsStr,len(thumbsStr)-1))
		end if		
		response.Write("],")	
		
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
