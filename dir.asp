<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<% Response.ContentType="application/json" %>

<script src="/smartSite/script/myJson.js" language="JavaScript" runat="server"></script>



<SCRIPT LANGUAGE="VBScript" RUNAT="Server">
	dim folderName, fileType, objId
	
	folderName=request("folderName")
	objId=request("objId")
	fileType=ucase(request("fileType"))
	if len(fileType)>0 then
		fileType=split(fileType,",")
	end if
	
'on error resume next


' reading the config file	***	***	***	***	***
	dim configFile
	dim configTxt
	configTxt="{}"
	configFile=folderName & "/config.txt"
	
	'Create the FileSystemObject
	Dim fs
	Set fs = Server.CreateObject("Scripting.FileSystemObject")
	
	' open the stream
	set textFile=fs.openTextFile(server.MapPath(configFile),1,true)
	
	If Err.Number <> 0 then
		response.write("{error:true,message:'" & Err.Description & "',sender:'dir.asp'}")
		Error.Clear
	else
		if(textFile.AtEndOfStream=false) then
			configTxt=textFile.readAll
		end if
		textFile.close
	end if
	
	set textFile=nothing



' reading the folder structure	***	***	***	***	***
	dim folders,folderObj,files,fileObj,path,folderPath,dirTxt
	
	folderPath=folderName
	set folders=fs.GetFolder(server.MapPath(folderName)).subFolders
	set files=fs.GetFolder(server.MapPath(folderName)).files
	
	'creating the json object
	dirTxt="{"
		dirTxt=dirTxt & ("path:'" & folderName & "',")
		dirTxt=dirTxt & "files:["
		dim filesStr		
		for each fileObj in files
			if(fileType(0)="*") then
				filesStr=filesStr & "{ name:'" & fileObj.name & "',"			
				filesStr=filesStr & "path:'" & folderPath & "/" & fileObj.name & "',"
				filesStr=filesStr & "dateLastModified:'" & fileObj.DateLastModified & "'},"																	
			else
				for each ft in fileType
					if(instr(ucase(fileObj.name),"." & ft)>0) then
						filesStr=filesStr & "{ name:'" & fileObj.name & "',"			
						filesStr=filesStr & "path:'" & folderPath & "/" & fileObj.name & "',"
						filesStr=filesStr & "dateLastModified:'" & fileObj.DateLastModified & "'},"	
					end if																	
				next
			end if
		next
		if(len(filesStr)>0) then
			dirTxt=dirTxt & left(filesStr,len(filesStr)-1)
		end if
		
		dirTxt=dirTxt & "],"
		
		dirTxt=dirTxt & "folders:["
		dim dirStr
		for each folderObj in folders
			dirStr=dirStr & "{ name:'" & folderObj.name & "',"			
			dirStr=dirStr & "path:'" & folderPath & "/" & folderObj.name & "',"
			dirStr=dirStr & "dateLastModified:'" & folderObj.DateLastModified & "'},"			
		next
		if len(dirStr)>1 then
			dirTxt=dirTxt & left(dirStr,len(dirStr)-1)
		end if
		dirTxt=dirTxt & "]"
			
	dirTxt=dirTxt & "}"
</script>
	
<script type="text/javascript" language="JavaScript" runat="server">
		
	function parseObj(configTxt,dirTxt,objId){
		var configObj=eval("(" + configTxt + ")");
		configObj[objId]=eval("(" + dirTxt + ")");
		
		response.write(toJsonString(configObj));
	}
</script>	

<SCRIPT LANGUAGE="VBScript" RUNAT="Server">

	parseObj configTxt,dirTxt,objId
	
	set folders=nothing
	set folderObj=nothing
	set files=nothing
	set fileObj=nothing
	set fs=nothing
	
</script>
