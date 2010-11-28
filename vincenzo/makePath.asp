<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>

<%
	session("path")=request("path")
	response.write("{error:false,message:'Path created!',sender:'makePath.asp'}")
%>
