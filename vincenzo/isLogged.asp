<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%

if session("logLevel")<2 then
	response.write("{error:true,message:'User not logged!',sender:'isLogged.asp'}")
else
	response.write("{error:false,message:'User logged!',sender:'isLogged.asp'}")
end if

%>