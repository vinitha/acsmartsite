<%@LANGUAGE="VBSCRIPT" CODEPAGE="1252"%>


<%
	dim mailBody

	'creo la mail
	Set myMail=CreateObject("CDO.Message")
		myMail.Subject="Richiesta informazioni inviata da: " & request("nome")
		myMail.From=request("sender")
		myMail.To="annie54@virgilio.it"
		myMail.Bcc="alessio.carnevale@gmail.com"
	if len(request("message"))=0 then
		response.write("{""error"":true,""message"":""No message to send!""}")
	else
		myMail.HTMLBody="<p>" & request("message") & "</p><p>Inviato da www.ilmanierocassino.eu</p>"
		myMail.Send
		response.write("{""error"":false,""message"":""Messaggio inviato, grazie!""}")
	end if
	
	set myMail=nothing
	
	
%>