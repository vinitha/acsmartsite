<%@LANGUAGE="JavaScript"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Untitled Document</title>
   	<script type="text/javascript" src="script/json.js"></script>
    <script type="text/javascript">
		var mySelf={
			name:"alessio",
			surname:"carnevale"
		}
		
		window.onload=function(){
			document.write(JSON.decode(mySelf))
		}
	</script>
</head>

<body>
	<%
		var a=eval("(" + Request.QueryString("json") + ")");
		Response.Write(Request.QueryString("json"))
		Response.Write(a.name + "." + a.surname)
	
	%>
</body>
</html>
