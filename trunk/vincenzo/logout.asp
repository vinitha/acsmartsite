<%
	session("logLevel")=0
	response.write("{error:false,message:'User logged out!',sender:'logout.asp'}")
%>