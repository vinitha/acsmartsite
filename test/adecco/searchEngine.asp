<%
	'do your DB queries here.... 		
	
	

	'analysing the request type
	reqType=Request.QueryString("requestType")
	
	if(reqType="json") then
	
		'Creating the JSON object. In this example we got 20 pages, displaying just 2 records.
		'************************************************************'
		'* remember to ESCAPE the strings passed back to the client *'
		'************************************************************'		
		
		'Résultats pour "Infirmière", "Paris"'
		
		%>
		{
			"searchDetails":{
				"title":'<%=Server.URLEncode("Résultats pour " + chr(34) + "Infirmière" + chr(34) + ", Paris")%>',
				"sortBy":	{
								current:"<%=Request.QueryString("sortBy")%>",
								options:["Pertinance","Date de publication"]
							},
				"recordsCount":54,
				"from":41,
				"to":50,
				"pagesCount":20,
				"currentPage":<%=Request.QueryString("currentPage")%>
			},
			
			"records":[
				{
					"jobtitle":"Analyste",
					"specs":{
						"location":"Paris (7500)",
						"salary":"2500 Euros bruts (base mens)",
						"type":"CDI",
						"published":"Julliet 2008",
						"start":"Julliet 2008",
						"reference":"101187-TJ-ARC"
					},
					"link":"www.thisIsMyLink.fr",
					"description":'<%=Server.URLEncode("A partir du concept book, etablir des propositions d" + chr(39) + "agencements, de realisations des plans de boutiques, et de corners pour les nouveaux points de vente...")%>',
					"details":"Consultez les détails de cette offre"					
				},
				{
					"jobtitle":"Docteur",
					"specs":{
						"location":"Nice (2300)",
						"salary":"3500 Euros bruts (base mens)",
						"type":"CDI",
						"published":"Julliet 2008",
						"start":"Julliet 2008",
						"reference":"101187-TJ-ARC"
					},
					"link":"www.thisIsMyLink2.fr",
					"description":'<%=Server.URLEncode("A partir du concept book, etablir des propositions d" + chr(39) + "agencements, de realisations des plans de boutiques, et de corners pour les nouveaux points de vente...")%>',
					"details":"Consultez les détails de cette offre"
				}			
			]
		}	
		<%	
		
	else
		'this part is used in a non Js environment.
		'please define here a normal HTML response
		'in this case we just redirect the client to an HTML template
		Response.Redirect("searchResultsExample.htm")

	end if

%>

