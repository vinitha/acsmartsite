

/* This part defines the sIFR stuff */
$().ready(function(){
								if(typeof sIFR == "function"){
																		
									
									bodyh1=named({
													sSelector:"body h1",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#756C63",
													sLinkColor:"#000000",
													sBgColor:"#FFFFFF",
													sHoverColor:"#CCCCCC",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});
									sIFR.replaceElement(bodyh1);
									
									homePageH2=named({
													sSelector:".homePage .hero h2",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#756C63",
													sLinkColor:"#000000",
													sBgColor:"#FFFFFF",
													sHoverColor:"#CCCCCC",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});
									sIFR.replaceElement(homePageH2);									
									
									landingSubHeading=named({
													sSelector:".textContainer h3, .countriesPage h3",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#756C63",
													sLinkColor:"#000000",
													sBgColor:"#FFFFFF",
													sHoverColor:"#CCCCCC",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});
									sIFR.replaceElement(landingSubHeading);
									
									
									
									
									searchFormH3=named({
													sSelector:"#searchPage h3",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#ffffff",
													sLinkColor:"#ffffff",
													sBgColor:"",
													sHoverColor:"#ff2222",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});	
									sIFR.replaceElement(searchFormH3);									
									
									roundedPanel=named({
													sSelector:".roundedPanel p",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#ffffff",
													sLinkColor:"#ffffff",
													sBgColor:"",
													sHoverColor:"#ff2222",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});										
									sIFR.replaceElement(roundedPanel);						
									
									faqH4=named({
													sSelector:".faqPage h4",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#756C63",
													sLinkColor:"#ffffff",
													sBgColor:"",
													sHoverColor:"#ff2222",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});	
									sIFR.replaceElement(faqH4);				
									
									miniPanelsH3=named({
													sSelector:".miniPanels h3",
													sFlashSrc:"asset/js/vagRounded.swf",
													sColor:"#756C63",
													sLinkColor:"#ffffff",
													sBgColor:"",
													sHoverColor:"#ff2222",
													sFlashVars:"textalign=left",
													sWmode: "transparent",
													nPaddingTop:0, 
													nPaddingBottom:0
												});	
									sIFR.replaceElement(miniPanelsH3);													
								};	
															
							});


/* improving accessibility adding hover/focus capabilities to IE6 buttons */
$().ready(function(){				
						if($.browser.msie){	
							$("button").focus(function(){$(this).addClass("hover")}).blur(
																						  	function(){$(this).removeClass("hover")}
																						  ).hover(	
																						  			function(){
																											$(this).addClass("hover")},
																									function(){
																											$(this).removeClass("hover")}
																								 )																
						}						
				   })


$(window).load(function(){
							/* IE6 fix */
						  		$(".countriesPage .languages").each(function(){this.style.zoom=1})
							})

/* initialize the Ajax handler */
$().ready(function(){
				   		Adecco.init();
						Adecco.dynamicInputText();
						Adecco.footerDropDownLinks();
						Adecco.faqPanelsInit();
						Adecco.miniPanelsInit();
						Adecco.countryPanelInit();
						Adecco.countryNavInit();
						
						try {	/* IE6 images caching bug fixe */
						  document.execCommand("BackgroundImageCache", false, true);
						} catch(err) {}					
						
					})




Adecco={
	
	//used by the firstPage / lastPage buttons	
	currentPage:1,		
	pagesCount:0,
	sortBy:null,
	newsCollection:null,
	currentNews:-1,
	rotatorHandler:null,
	
	init:function(){
				

			$(document.body).addClass("hasJs");
			
			// defining the news rotator behaviours			
			Adecco.newsCollection=$(".newsRotator .news");
			$("#stopRotationBtn").click(function(){
												 		clearInterval(Adecco.rotatorHandler);
														$(this).hide(0)
														$("#startRotationBtn").show(0);
													})
			
			$("#startRotationBtn").click(function(){												 		
														$(this).hide(0)
														$("#stopRotationBtn").show(0);
														newsAnimation();
														startNews();
													})
			
			if ($(document.body).hasClass("homePage")){
				newsAnimation();
				startNews();
			}
			
			
			// set up the calendar
			try{
				$(".datePicker").datepicker();
			}
			catch(e){};
			
			
			//defining the searchPage dropDown behaviour
			var dropDownBoxes=$("#searchPage select").not($(".optional select"));
			dropDownBoxes.change(function()	{
												optDiv=$(this.parentNode).children(".optional");
												optSelect=optDiv.children("select")[0];
												
												if(this.options[this.selectedIndex].value.length>0){
													optDiv.animate({opacity:1},500);
													optSelect.disabled=false;													
												}else{
													optSelect.disabled=true;
													optDiv.animate({opacity:0.3},500);
													optSelect.selectedIndex=0;
												}										  
											})
			
			//updating the status
			dropDownBoxes.change();
			
			
			//defining the resultsPage dropDown behaviour
			var dropDownBoxes=$("#jobSearch select").not($(".optional select"));
			dropDownBoxes.change(function()	{
												optDiv=$(this.parentNode).children(".optional");
												optSelect=optDiv.children("select");
												
												if(this.options[this.selectedIndex].value.length>0){
													optDiv.show(500);													
												}else{
													optDiv.hide(500);
													optSelect[0].selectedIndex=0;
												}
										  
											})
			
			//updating the status
			dropDownBoxes.change();			
			
			//defining the resultsPage checkBoxes behaviour
			$('.searchParameters .edit').click(function(){
																   		if ($(this).hasClass("open")){
																			$('.searchParameters .contractType label input[checked=""]').parent("label").hide(500);
																			$(this).removeClass("open");
																		}else{
																			$('.searchParameters .contractType label input[checked=""]').parent("label").show(500);
																			$(this).addClass("open");																			
																		}
																   		
																   
																   })
			$('.searchParameters .contractType label input[checked=""]').parent("label").hide(0);
			
			//traping the pagination button click
			Adecco.Ajax.buttonsInit();
			
			/* traping the submit button click event (searchPage) */
			$("#searchPage button[type='submit']").click(function(){	
																$('<input type="hidden" name="reqType" id="reqType" value="json" />').appendTo($("form"))
														});				
			
			
			/* traping the submit button click event (results page)*/
			$(".searchParameters button[type='submit']").click(function(){	
															//start a new search from the first page
															Adecco.currentPage=1;
														});				
			
			/* trapping the submit event */
			$("#searchForm").submit(function(){
											 	// clear the results container and append the LOADING icon//
											 	$("<img>").attr("src","asset/images/loading.gif").prependTo($('<p class="loading">').text("loading...").appendTo($(".recordsContainer").empty()))
												
												formObj=$(this);
												
												var queryString = formObj.serialize();
												var url = formObj.attr("action");												
												
												queryString="sortBy=" + Adecco.sortBy + "&requestType=json&currentPage=" + Adecco.currentPage + "&" + queryString
																								
												$.getJSON(url,queryString,Adecco.Ajax.onAjaxResponse);	
												
												return false													
											});		
			
			//send the first request;
			if($("#searchForm").length>0) $(".searchParameters #searchForm").submit();
	},
	
	Ajax:{
			countriesXmlObj:null,
			buttonsInit:function(){
				
					var myForm=$(".searchParameters #searchForm");
					
					/* traping the "sortBy" buttons click events */					
					$(".sortBy a").click(function(){
												  
													  Adecco.sortBy=$(this).text();
													  Adecco.currentPage=1;
													  myForm.submit();
													  
												  });
												  
												  
				
					/* traping the "page number" buttons click events */
					$(".pagination .pageNum").click(function(){
																pageBtn=$(this);
																if(pageBtn.parent(1).hasClass("selected")) return false;		
																
																Adecco.currentPage=parseInt(pageBtn.text());
																
																myForm.submit();
														 });
					
					/* traping the first/previous/next/last pagination buttons */
					$(".pagination li a").not(".pageNum").click(function(){
																		
																			var btnClass=this.className;
																			switch (btnClass){
																				case "firstPage":
																					Adecco.currentPage=1;
																				break;
																				
																				case "previousPage":
																					Adecco.currentPage--;
																				break;
																				
																				case "nextPage":
																					Adecco.currentPage++;
																				break;
																				
																				case "lastPage":
																					Adecco.currentPage=Adecco.pagesCount;
																				break;																		
																			}
																			
																			myForm.submit();
																		
																		})
				
				},
				
				
				
			onAjaxResponse:function (jsonObj){
								
				var recordsList=$("<ul></ul>").appendTo($(".searchResultsPanel .recordsContainer").empty());
				var paginationDivs=$(".searchResultsPanel .pagination");
				var header=$(".searchResultsPanel .header");
				
				//updating some variables
				Adecco.pagesCount=jsonObj.searchDetails.pagesCount;
				Adecco.currentPage=jsonObj.searchDetails.currentPage
				Adecco.sortBy=myUnescape(jsonObj.searchDetails.sortBy.current);



				// rendering the header html
				header.empty();
				$("<h3></h3>").text(myUnescape(jsonObj.searchDetails.title)).appendTo(header);
				$('<span class="subTitle"></span>').text(jsonObj.searchDetails.to + " offres d’emploi correspondent à votre recherche").appendTo(header);
				var sortBy=$('<div class="sortBy"></div>').appendTo(header);
				$("<h3>Trier vos résultants par</h3>").appendTo(sortBy);
				
				var ul=$("<ul>").appendTo(sortBy);
				for (var x=0;x<jsonObj.searchDetails.sortBy.options.length;x++){					
					var newLi=$('<li><a href="#' + myUnescape(jsonObj.searchDetails.sortBy.options[x]) + '">' + myUnescape(jsonObj.searchDetails.sortBy.options[x]) + '</a></li>').appendTo(ul);
					if(myUnescape(jsonObj.searchDetails.sortBy.options[x])==Adecco.sortBy){
						newLi.addClass("selected");
					}
				}
				


				// rendering the pagination html
				paginationDivs.empty();
				$('<span class="results"></span>').text("Résultats " + jsonObj.searchDetails.from + " - " + jsonObj.searchDetails.to + " sur" + jsonObj.searchDetails.recordsCount).appendTo(paginationDivs);				
				
				paginationDivs.each(function(){



													var ul=$("<ul>").appendTo(this); 
													
													if(Adecco.currentPage>1){
														$('<li><a class="firstPage" title="première page" href="#first"><span class="hidden">première page</span></a></li>').appendTo(ul);
														$('<li><a class="previousPage" title="pr&eacute;c&eacute;dent page" href="#previous">Pr&eacute;c&eacute;dent</a></li>').appendTo(ul);
													}
																  
													
													var firstPage=(Adecco.currentPage-3)>0?Adecco.currentPage-3:1
													var lastPage=(firstPage+4<Adecco.pagesCount)?firstPage+4:Adecco.pagesCount;
													for (var x=firstPage;x<lastPage+1;x++){
																			
														var newLi=$('<li></li>').appendTo(ul);
														$("<a></a>").addClass("pageNum").attr("title","page " + x ).attr("href","#" + x).text(x).appendTo(newLi)
														if(Adecco.currentPage==x){
															newLi.addClass("selected");
														}
									
													}
									
													if(Adecco.currentPage<Adecco.pagesCount){
														$('<li><a class="nextPage" title="suivant page" href="#next">Suivant</a></li>').appendTo(ul);
														$('<li><a class="lastPage" title="dernier page" href="#last"><span class="hidden">dernier page</span></a></li>').appendTo(ul);				
													}

											 })

				//redifining the buttons events
				Adecco.Ajax.buttonsInit();



				//rendering the records html
				$.each(jsonObj.records,function(i,item){
													var newLi=$("<li></li>").appendTo(recordsList);
													//creating the record header
													$("<a></a>").attr("href",item.link).text(item.jobtitle).appendTo($('<p class="jobTitle">').appendTo(newLi));
													
													//creating the table with the job specs
													var jobTable=$("<table></table>").attr("summary","job description").appendTo(newLi);
													for (prop in item.specs){
														var newTr=$("<tr></tr>").appendTo(jobTable);
														$("<span></span>").text(prop).appendTo($("<th>").appendTo(newTr));
														$("<span></span>").text(item.specs[prop]).appendTo($("<td>").appendTo(newTr));														
													}
													
													$('<p class="description"></p>').text(myUnescape(item.description)).appendTo(newLi);
													$('<a class="details"></a>').attr("href",item.link).text(myUnescape(item.details)).appendTo(newLi);

												})				
			},
			
			// creating the html for the countries websites list
			countriesXmlRender:function(){
					
					var xml=Adecco.Ajax.countriesXmlObj;
					var cDiv=$("<div class='countriesContainer'></div>");
					$(".extLinks").before(cDiv);
					var countryUl=$('<ul class="mainNavigation"></ul>').appendTo($('<div class="N2"></div>').appendTo(cDiv));
					
					var countriesList=$('<div class="countriesList"></div>').appendTo(cDiv);
					
					
					xml.find("group").each(function(){
														var group=$(this);
														var li=$('<li><span><a href="#' + group.attr("groupId") + '" title="' + group.attr("tooltip") + '">' + group.attr("name") + '</a></span></li>').appendTo(countryUl);													
														
														gBody=$('<div class="body"><h2 class="hidden"><a id="' + group.attr("groupId") + '" name="' + group.attr("groupId") + '">' + group.attr("name") + '</a></h2></div>').appendTo(countriesList)
														
														if(group.attr("selected")){
															li.addClass("selected");
															gBody.addClass("selected");
														}
														
														var groupUl=$("<ul></ul>").appendTo(gBody)
														
														group.find("country").each(function(i){
																								var country=$(this)
																								if (i>0 && (parseInt(i/9)*9==i)){
																									groupUl=$("<ul></ul>").appendTo(gBody);
																								}
																								var countryLink=$('<a class="link" title="' + country.attr("abbr") + '" href="#' + country.attr("abbr") + '">' + country.attr("name") + '</a>').appendTo($('<li></li>').appendTo(groupUl))
																								countryLink.click(function(){
																														   		$(".webSites").hide(0);
																														   		webSites=$("#" + this.title);
																																if (webSites.length==0){
																																	webSites=Adecco.Ajax.websitesXmlRender($(this));
																																}
																														   		webSites.show("slow");
																														   		return false;
																														   	 })
																						 	})	
													})
							
				return cDiv;
			},
			
			websitesXmlRender:function(linkObj){
				var ws=$("<div class='webSites' id='" + linkObj.attr("title") + "'></div>").appendTo($(".countriesContainer"));
				$("<h3>" + linkObj.text() + "</h3>").appendTo(ws);
				var ul=$("<ul></ul>").appendTo(ws);
				
				var wsXml=Adecco.Ajax.countriesXmlObj.find("country[abbr='" + linkObj.attr("title") + "'] website");
				wsXml.each(function(i){
										var site=$(this);		
										if(i>0 && (parseInt(i/3)*3==i)) {
											ul=$("<ul></ul>").appendTo(ws);											
										}
								 		var li=$('<li class="site"><h4>' + site.attr("name") + '<a class="edit" href="#edit" title="show/hide content"><span class="hidden">+/-</span></a></h4></li>').appendTo(ul);
										//defining the click event										
										$(li).find("a").click(function(){
																var editBtn=$(this);
																editBtn.toggleClass("open");
																
																
																if (editBtn.hasClass("open")){																				
																	editBtn.parents("li.site").find(".details").show(300);						 			
																}else{
																	editBtn.parents("li.site").find(".details").hide(300);
																}
																
														   })										
										
										
										var wsBody=$('<div class="siteBody"></div>').appendTo(li);
										$('<img class="thumbnail" alt="home page thumbnail" src="' + site.attr("thumbnail") + '" />').appendTo(wsBody);
										$('<a class="link" href="' + site.attr("url") + '">' + site.attr("url") + '</a></a>').appendTo(wsBody);
										site.find("details").each(function(){																		   		
																		   		var details=$('<div class="details"></div>').appendTo(wsBody);
																				$(this).find("description").each(function(){
																														  		$("<p></p>").text($(this).text()).appendTo(details);
																														  	})
																				$(this).find("extraLinks").each(function(){
																														  		$("<p class='strong'></p>").text($(this).attr("label")).appendTo(details);
																																var ul=$("<ul class='clients'></ul>").appendTo(details);
																																$(this).find("link").each(function(){
																																								   		$("<li><a href='#" + $(this).attr("url") + "'>" + $(this).text() + "</a></li>").appendTo(ul);																																								   
																																								   	})
																																
																														  	})
																		   
																		   	})
								 
								  })
				
				return ws
			}
			
	},
	
	/* Input field text population
	 * Takes current value of form INPUTS and handles clearing and repopulating on focus
	-------------------------------------------------------------------------------------*/
	dynamicInputText: function() {
		$('input[type="text"]').not($(".hasDatepicker")).each(function(){
											  		target=this;
													target.savedText = target.value; // keep track of the original input value
													target.onfocus=function(){
														this.value = $.trim(this.value);
														if (this.value == this.savedText) {
															this.value = "";
														}
													}
													target.onblur=function(){
														this.value = $.trim(this.value);
														if (this.value == "") {
															this.value = this.savedText;
														}
													}											  
											  
											  })
	},
	
	footerDropDownLinks:function(){
		$(".footer fieldset").each(function(){
												var btnGo=$(this).children(".btnGo");
												var selectTag=$(this).find("select")[0];												
												
												btnGo.click(function(){												
																	 var url=selectTag.options[selectTag.selectedIndex].value;
																	 if (url.length>1){
																		 //location.href=url;
																		 window.open(url);
																	 }
																	 })
										  
										  
										  
										  
										  })
	},
	
	faqPanelsInit:function(){
		var panelsHead=$(".faqContainer .faqHeader");
		panelsHead.each(function()	{
										var thisObj=$(this);	
										var li=thisObj.parent("li");								 		
								 		if (!li.hasClass("opened")){
																		li.find(".faqBody").hide(0);
																	}
								 	});
		
		panelsHead.click(function()	{
										var thisObj=$(this);
										var li=thisObj.parent("li");
										if (li.hasClass("opened")){
											li.removeClass("opened");
											li.find(".faqBody").slideUp(200);
											//thisObj.next().slideUp(200);
										}else{
											li.addClass("opened");
											li.find(".faqBody").slideDown(200);
											//thisObj.next().slideDown(200);																
										}
										
										return false;
									})

	},
	
	miniPanelsInit:function(){
		var panelsHead=$(".miniPanels .panHeader");
		panelsHead.each(function()	{
										var thisObj=$(this);	
										var li=thisObj.parent("li");								 		
								 		if (!li.hasClass("opened")){
																		li.find(".panBody").hide(0);
																	}
								 	});
		
		panelsHead.click(function()	{
										var thisObj=$(this);
										var li=thisObj.parent("li");
										if (li.hasClass("opened")){
											li.removeClass("opened");
											li.find(".panBody").slideUp(200);
											//thisObj.next().slideUp(200);
										}else{
											li.addClass("opened");
											li.find(".panBody").slideDown(200);
											//thisObj.next().slideDown(200);																
										}
										
										return false;
									})

	},
	
	countryNavInit:function(){
		// this function read the xml countries file 
			var AjaxPar={
							 type: "GET",
							 url: "areas.xml",
							 dataType: "xml",
							 success: function(xml){
														Adecco.Ajax.countriesXmlObj=$(xml);
														Adecco.Ajax.countriesXmlRender();
														// handling the countries tab menu
														$(".countriesContainer .mainNavigation a").each(function(){
																														var aTag=$(this);
																														aTag.click(function(){
																																				$(".countriesContainer .mainNavigation .selected").removeClass("selected");
																																				aTag.parents("li").addClass("selected");
																																				$(".countriesContainer .countriesList .selected").removeClass("selected");
																																				var id=aTag.attr("href").split("#")[1];
																																				$("#" + id).parents(".body").addClass("selected");
																																				return false;
																																			  })
																													 })																
													}
						};
			
			$.ajax(AjaxPar);
			
			// handling the country website selector
			$(".extLinks a.adeccoWorld").click(function(){
													   		var cDiv=$(".countriesContainer")
															wLink=$(this);																														
															
															if(cDiv.css("display")!="block"){
																if(cDiv.find(".webSites").length==0){
																	//opend the country selected by default
																	var cId=Adecco.Ajax.countriesXmlObj.find("country[selected]").attr("abbr")
																	var cLink=$("a[title='" + cId + "']");
																	
																	cLink.click();
																	
																}
																
																cDiv.slideDown("slow",function(){
																							   		$("#contentArea").css("display","none");
																									if(cLink) cLink.focus();
																								});
																$("select").css("visibility","hidden")
																wLink.addClass("close");
																wLink.attr("title","close")
															}else{
																$("#contentArea").css("display","block")
																cDiv.slideUp("slow",function(){
																									$("select").css("visibility","visible")
																									wLink.removeClass("close")
																									wLink.attr("title",wLink.text());
																								});
															}

															
															return false;
													   	})
			
	},
	
	countryPanelInit:function(){
			// adding the expand/collapse buttons to the contry portal websites panels
			var ws=$(".webSites");
			if(ws.length>0){
				ws.find($("h4")).each(function(){
												
													var btn=$('<a title="show/hide content" href="#edit" class="edit"><span class="hidden">+/-</span></a>');
													btn.click(function(){
																	   		var editBtn=$(this);
																	   		editBtn.toggleClass("open");
																			
																			
																			if (editBtn.hasClass("open")){																				
																				editBtn.parents("li.site").find(".details").show(300);						 			
																			}else{
																				editBtn.parents("li.site").find(".details").hide(300);
																			}
																	   		
																	   })
													btn.appendTo(this)
												
												})
			}
	}
}

function myUnescape(str){
	return unescape(str).replace(/\+/g," ");
}

function startNews(){
	newsDuration=7000;
	
	if (Adecco.newsCollection.length>0){
		Adecco.rotatorHandler=setInterval(newsAnimation,newsDuration)
	}		
}

function newsAnimation(){
	
	if(Adecco.currentNews>-1){
		$(Adecco.newsCollection[Adecco.currentNews]).animate({																						 
																opacity:0,
																fontSize:"0em",
																height:"0px",
																paddingBottom:"0px"
															 },1000,"swing",function(){this.style.display="none"})
	}
	
	Adecco.currentNews++;
	if (Adecco.currentNews>Adecco.newsCollection.length-1) Adecco.currentNews=0;
	
	$(Adecco.newsCollection[Adecco.currentNews]).css({
															opacity:0,
															fontSize:"0em",
															height:"0px",
															paddingBottom:"0px"																					 
													 })									
	
	Adecco.newsCollection[Adecco.currentNews].style.display="block";
	$(Adecco.newsCollection[Adecco.currentNews]).animate({																						 
															opacity:1,
															fontSize:"1em",
															height:"160px",
															paddingBottom:"10px"
														 },1000,"swing",function(){this.style.filter=""})			
}

/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood@virginbroadband.com.au) and St&eacute;phane Nahmani (sholby@sholby.net). */

	jQuery(function($){
		try{
			$.datepicker.regional['fr'] = {
				clearText: 'Effacer', clearStatus: '',
				closeText: 'Fermer', closeStatus: 'Fermer sans modifier',			
				prevText: '&lt;Pr&eacute;c',
				prevStatus: 'Voir le mois pr&eacute;c&eacute;dent',
				nextText: 'Suiv&gt;',
				nextStatus: 'Voir le mois suivant',
				currentText: 'Courant', currentStatus: 'Voir le mois courant',
				monthNames: ['Janvier','F&eacute;vrier','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','D&eacute;cembre'],
				monthNamesShort: ['Jan','F&eacute;v','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','D&eacute;c'],
				monthStatus: 'Voir un autre mois', yearStatus: 'Voir un autre ann&eacute;e',
				weekHeader: 'Sm', weekStatus: '',
				dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
				dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
				dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
				dayStatus: 'Utiliser DD comme premier jour de la semaine', dateStatus: 'Choisir le DD, MM d',
				dateFormat: 'dd/mm/yy', firstDay: 0, 
				initStatus: 'Choisir la date', isRTL: false
				};
			$.datepicker.setDefaults($.datepicker.regional['fr']);
		}
		catch(e){};
	});
