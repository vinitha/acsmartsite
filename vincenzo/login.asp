<%
dim userName
dim password

userName=request("username")
password=request("password")

if username="vincenzo" and password="zniv" then 
	session("logLevel")=2
	response.write("{error:false,message:'User authenticated!',sender:'login.asp'}")
else
	response.write("{error:true,message:'Username or password wrong!',sender:'login.asp'}")
end if
%>