<%@LANGUAGE="VBSCRIPT" CODEPAGE="1252"%>


<%
	dim mailBody

	'creo la mail
	Set myMail=CreateObject("CDO.Message")
		myMail.Subject="A message from: " & request("sender")
		myMail.From="info@vincenzorigogliuso.com"
		myMail.To="vincenzorigogliuso@gmail.com"
		myMail.Bcc="alessio.carnevale@gmail.com"
	if len(request("message"))=0 then
		response.write("{error:true,message:'No message to send!'}")
	else
		myMail.HTMLBody="<p>" & request("message") & "</p><p>Sender: " & request("sender") & "</p>"
		myMail.Send
		response.write("{error:false,message:'Email sent!'}")
	end if
	
	set myMail=nothing
	
	
%>