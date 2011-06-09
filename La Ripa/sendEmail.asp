<%@LANGUAGE="VBSCRIPT" CODEPAGE="utf-8"%>

<%
	'creo la mail
	Set myMail=CreateObject("CDO.Message")
		myMail.Subject="Info requested by: " & request("nome")
		myMail.From=request("sender")
		myMail.To="louise.la.ripa@gmail.com"
		myMail.Bcc="alessio.carnevale@gmail.com"
	if len(request("message"))=0 then
		response.write("{""error"":true,""message"":""No message to send!""}")
	else
		myMail.HTMLBody="<p>" & request("message") & "</p><p>Sent from The Old Watermill web site</p>"
		myMail.Send
		response.write("{""error"":false,""message"":""Message sent, thank you!""}")
	end if
	
	set myMail=nothing
	
%>