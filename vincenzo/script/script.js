// JavaScript Document

$(document).ready(function(){
	
	$("body").addClass("hasJs")

	myConsole.init();
	
	// main object initialisation
	main.init();		
	
})


myConsole={
	init:function(){
		myConsole.div=$("<div class='myConsole'></div>")
				.appendTo($("body"))
				.hide();
		myConsole.output=$("<p></p>").appendTo(myConsole.div);
	},
	
	output:null,
	div:null,
	timerHnd:null,
	
	json:function(obj){
		if(obj.error){
			myConsole.error(obj.message);
		}else{
			myConsole.log(obj.message);
		}
	},
	
	error:function(msg){
		myConsole.log(msg,"error")
	},
	status:function(msg){
			$("<span></span>")
			.appendTo(myConsole.output)
			.text(msg);
		myConsole.div.stop(true,true);
		clearTimeout(myConsole.timerHnd);
		
		myConsole.div.fadeIn(300);		
	},
	log:function(msg,classes){
			$("<span></span>")
			.addClass(classes)
			.appendTo(myConsole.output)
			.text(msg);
		myConsole.div.stop(true,true);
		clearTimeout(myConsole.timerHnd);
		
		myConsole.div.fadeIn(300);
				
		myConsole.timerHnd=setTimeout(function(){
					myConsole.div.fadeOut(100,function(){myConsole.output.empty()});				
				},5000)
	}
}

window.prompt=function(msg,callback,container){
	$("#prompt").remove();
	
	var div=$("<div id='prompt' />")
		.hide(0)
		.insertAfter(container)
	$('<h3 />').text(msg).appendTo(div)
    var text=$('<input type="text" />').appendTo(div)
		
    $('<button class="button" value="Cancel" type="button">Cancel</button>')
		.appendTo(div)
		.click(function(){
			div.slideUp(300,function(){div.remove()});
		})

    $('<button class="button" value="Ok" type="button">Ok</button>')
		.appendTo(div)
		.click(function(){
			if(text.attr("value").length>0){
				callback(text.attr("value"));
			}
			div.slideUp(300,function(){div.remove()});
		})
		
	div.slideDown(500)
		
	return false;
}

main={	
	picturePath:"/public/Galeria",
	userLogged:false,
	currentFolder:this.picturePath,
	init: function(){
		// check is the user is still loggedin
		$.getJSON("isLogged.asp",function(data){
			main.userLogged=(!data.error);		
			main.setup();
			
			//auto default behaviour
			$("input[type='text'], textarea")
			.each(function(){
				this.baseValue=this.title;
				if(this.value=="") this.value=this.title;
			})
			.focus(function(){
						if (this.value==this.baseValue){
							this.value=""
						}
					})
			.blur(function(){
						if (this.value==""){
							this.value=this.baseValue;
						}				
					})			
		})
	},
	
	setup:function(){
				
		// defining the auto hide behaviour
		$(".PE_panels a").click(function(){
			//displaying just this panel
			$(this.hash)
			.show(0)
			.siblings(".PE_exclusivePanels").hide()
			return false;
		})		
		
		
		//email module
		$("#emailModule a").click(function(){
			var thisObj=$(this)
			var url="sendMail.asp"
			var textArea=thisObj.closest("#emailModule").find("textarea")
			var input=thisObj.closest("#emailModule").find("input")
			
			if(textArea.attr("value")==textArea.attr("title")){
				myConsole.error("Please type in a message!")
				textArea.focus();
				return false;
			}
			
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test(input.attr("value"))) {
				myConsole.error('Please provide a valid email address');
				input.focus();
				return false;
			}
			
			var myDate=new Date();
			var msg={
						message:textArea.attr("value"),
						sender:input.attr("value"),
						dummy:myDate.getTime()
					}
			$.getJSON(url,msg,function(jSon){
				myConsole.json(jSon)
				textArea.focus();
				textArea.attr("value","")
			})	
		})
		
		//enabling the login button
		$("#login")
			.each(function(){
				var div=$("<form class='loginPanel'></form>");
				div.appendTo("#left")
				div.hide();
				
				var username=$("<input type='text' title='user name' name='username' id='username' />").appendTo(div);
				
				var password=$("<input type='password' name='password' id='password' />").appendTo(div);
				
				var button=$("<button type='submit' value='Ok' class='button' >Ok</button>").appendTo(div);

				div.submit(function(){
					$.getJSON(
						"login.asp",
						{"username":username.attr("value"),"password":password.attr("value")},
						function(data){
							myConsole.json(data);
							if (!data.error) {
								//eveything's fine
															
								main.userLogged=true;
								$("body").addClass("loggedIn")
								
								//refreshing the page
								main.updateMenu(main.currentFolder);
								
								// update the logIn/out buttons
								$("#login").css("display","none")
								$("#logout").css("display","inline")
								
								$(".loginPanel").hide(300);																
							}
						}
					)
					return false;
				})						   
			})
			.click(function(){
				$(".loginPanel").slideToggle();				
				return false;				
			})
	
		//setting the logout function
		$("#logout").click(function(){
			$.getJSON(

					  	"logout.asp",
						function(data){
							myConsole.json(data);
							
							main.userLogged=false;
							$("body").removeClass("loggedIn")
							
							//refreshing the page
							main.updateMenu(main.currentFolder);	
							
							// update the logIn/out buttons
							$("#login").css("display","inline")
							$("#logout").css("display","none")
							
						}
					  )
			return false;
		})
		
		//displaying just the images panel
		$("#images")
			.show(0)
			.siblings(".PE_exclusivePanels").hide(0)				


		$("#cover .addCover")
			.click(function(){

					var code=$(main.fileUploadCode(main.currentFolder,false,function(msg){

					var pageNotes=$("#toolsPanel .textEditor textarea").attr("value")
					var title=$("#toolsPanel .textEditor input").attr("value")	
					var info='{title:' + "'" + title + "',description:'" + pageNotes + "',cover:'" + msg.fileName + "'}"							
					if(!msg.error)														
						$.getJSON(	"writeFile.asp",
									{fileName:main.currentFolder + "/info.json", content:info},
									function(jsonData){
										myConsole.json(jsonData);
										main.updateMenu(main.currentFolder);
									}
						)
					return false;
				}))
				code.insertAfter(this);		
				$(this).fadeOut(300);
				return false;
			})		
			
			
		$("#cover a.image")
			.click(function(){
				if(main.userLogged){
					if (!confirm("Remove the cover image?")) return false;
					
					var pageNotes=$("#toolsPanel .textEditor textarea").attr("value")
					var title=$("#toolsPanel .textEditor input").attr("value")	
					var info='{title:' + "'" + title + "',description:'" + pageNotes + "',cover:''}"							
					
					$(this).blur();
					
					$.getJSON(	"writeFile.asp",
								{fileName:main.currentFolder + "/info.json", content:info},
								function(jsonData){
									myConsole.json(jsonData);	
									main.updateMenu(main.currentFolder);
								}
					)
				}
				return false
							
			})			
		
		// getting the cover image
		$("#cover .image img").load(function(){$(this).fadeIn(2000)})
			
		//retrieving the menu items		
		main.updateMenu(main.picturePath);
	},
	
	clearAll:function(){
		$("#cover .image img").attr("src","").hide(0);
		$("#toolsPanel").empty();
		$("#thumbnails ul").hide(0).empty();		
		$(".notes h2").empty().hide(0);
		$(".notes .notesBody").empty().hide(0);
		$(".galleryMenu ul").empty();	
	},
	
	updateMenu:function(currentFolder){	
		main.currentFolder=currentFolder;
		
		main.clearAll();
		
		if(main.userLogged){
			$("body").addClass("loggedIn")				
			
			// update the logIn/out buttons
			$("#login").css("display","none")
			$("#logout").css("display","inline")
			
			$(".loginPanel").hide(300);					
		}			
		
		function changeFolder(currentFolder){
				
			if(main.userLogged){
				// add cover button
				$("#cover .addCover").show();
				$("#cover .fileInput").remove();
			}else{
				$("#cover .addCover").hide();
			}
				
			main.currentFolder=currentFolder;
			
			main.clearAll();
			
			var menuUl=$(".galleryMenu ul");
			
			if (main.userLogged){	
				
				// add editing buttons to the main menu
				
				// NEW SECTION button
				var newLi=$("<li />")
					.addClass("btnContainer")
					.prependTo(menuUl)
				$("<strong />")
					.text("+")
					.prependTo(
						$("<a />")
							.attr("href","#newSection")
							.addClass("newSection button")
							.text("new section")
							.appendTo(newLi)
							.click(function(){
								prompt(
										"New section name:",
										function(folderName){
											folderName=encodeURIComponent(folderName);
											$.getJSON(
												"makeFolder.asp",
												{folderName:currentFolder + "/" + folderName},
												function(data){
													myConsole.json(data)
													if(!data.error){
														changeFolder(currentFolder);
													}else{
														main.userLogged=false;
														$("body").removeClass("loggedIn")
														main.updateMenu(main.currentFolder)
													}
												}
											)
										},
										this.parentNode
								);								
								
								return false;										
							})
					)							
					

				// DELETE SECTION button
				if(main.picturePath!=currentFolder){
					var newLi=$("<li />")
						.addClass("btnContainer")						
						.prependTo(menuUl)
					$("<strong />")
						.text("x")
						.prependTo(
							$("<a />")
								.attr("href","#delSection")								
								.addClass("delSection button")
								.text("delete this section")
								.appendTo(newLi)
								.click(function(){
									if(confirm("Remove this section and its images?")){
										$.getJSON(
											"killFolder.asp",
											{folderName:currentFolder},
											function(data){
												myConsole.json(data)
												if(!data.error){
													changeFolder(main.picturePath);
												}else{
													main.userLogged=false;
													$("body").removeClass("loggedIn")
													main.updateMenu(main.currentFolder)
												}
											}
											
										)
									}
									return false;										
								})									
						)						
				}
				
				//adding the admin tools
				var p=$("<p />")
						.addClass("buttons")
						.appendTo($("#toolsPanel"))
						
				$("<strong />")
					.text("+")
					.prependTo(
						$("<a />")
							.attr("href","#addPicture")
							.addClass("addPicture button")
							.text("add picture")
							.appendTo(p)
							.click(function(){
								var code=$(main.fileUploadCode(currentFolder,true))
								code.insertAfter(this);
								return false;
							})
					)
					
					
				var tE=$("<div />")
					.addClass("textEditor")
					.appendTo("#toolsPanel")
					
				$("<input />")
					.appendTo(tE)
					//.attr("value",info.title);
					

				$("<textarea />")
					//.attr("value",info.description?unescape(info.description):"")
					.appendTo(tE)
					
				$("<strong />")
					.text("T")
					.prependTo(
						$("<a />")
							.attr("href","#updateText")								
							.addClass("updateText button")
							.text("update text")
							.appendTo($("<div class='buttons' />").appendTo(tE))
							.click(function(){
											
								var folderDescr=escape(tE.find("textarea").attr("value"))
								var folderTitle=escape(tE.find("input").attr("value"))
								var cover=$("#cover img").attr("src")
								$.getJSON(
									"writeFile.asp",
									{fileName:currentFolder + "/info.json",content:"{title:'" + folderTitle+"'," + "description:'" + folderDescr + "',cover:'" + cover + "'}"},
									function(data){
										myConsole.json(data)
										if(!data.error){
											changeFolder(currentFolder);
										}else{
											main.userLogged=false;
											$("body").removeClass("loggedIn")
											main.updateMenu(main.currentFolder)
										}
										
									}
									
								)
								return false;
							})
					)							

			}					
			
			var now=new Date();
			// getting the page text
			$.getJSON(
				"readFile.asp",
				{	
					fileName:currentFolder + "/info.json",
					dummy:now.getTime()
				},
				function(info){				
					$(".notes h2").text(unescape(info.title)).fadeIn(300)
					var note=info.description;
					var noteBody=$(".notes .notesBody").fadeIn(300);
					
					if (note){
						note=unescape(note).split("\n");
						for(var x=0;x<note.length;x++){
							$("<p />")
								.appendTo(noteBody)
								.text(note[x])
						}
					}	
					
					$("#toolsPanel .textEditor textarea").attr("value",info.description?unescape(info.description):"")
					$("#toolsPanel .textEditor input").attr("value",unescape(info.title))
					
					// getting the cover image
					$("#cover .image img").attr("src",escape(info.cover))
				})
			
			$.getJSON(
				"dir2.asp",
				{
					folderName: currentFolder,fileType:"jpg",
					dummy:now.getTime()
				},
				function(obj){							
	
					var UrlArray=obj.folderName.split("/")
					var id=UrlArray.pop();		
					var backPath=UrlArray.join("/")																				
				
					//updating the menu
					var menuUl=$(".galleryMenu ul");
									
					// this is the current folder
					$("<a />")
					.addClass("menuItem")
					
					.attr("href","#" + currentFolder)
					.click(function(){																					
						main.updateMenu(currentFolder);				
						//displaying just the images panel
						$("#images")
							.show(0)
							.siblings(".PE_exclusivePanels").hide(0)	
							
						return false;
					})
					.attr("title","Click to open")
					
					.appendTo(
						$("<li />")
						.addClass("selected")
						.appendTo(menuUl)
						
					)
					
					.text(decodeURIComponent(id))
					
					// creates the menu items
					$.each(obj.folders,function(i,folder){
						$("<a />")
						.addClass("menuItem")						
						.appendTo(
							$("<li />").appendTo(menuUl)
						)
						.attr("title","Click to open")
						.attr("href","#" + folder.path)
						.text(decodeURIComponent(folder.name))
						.click(function(){
							main.updateMenu(folder.path);
							//displaying just the images panel
							$("#images")
								.show(0)
								.siblings(".PE_exclusivePanels").hide(0)				
							return false;
						})										
					})
					
					
					if(main.picturePath!=currentFolder){
						//adding the back link
						
						var newLi=$("<li />")
							.addClass("btnContainer")
							.appendTo(menuUl)
						$("<strong />")
							.text("<")
							.prependTo(
								$("<a />")
								.addClass("back button")
								.attr("title","Click to open")
								.attr("href",backPath)
								.text("back")
								.appendTo(newLi)
								.click(function(){			
									main.updateMenu(backPath);
									//displaying just the images panel
									$("#images")
										.show(0)
										.siblings(".PE_exclusivePanels").hide(0)										
									return false;
								})	
							)														
					}		
					
					
					
					menuUl.fadeIn(600);				
					
					
					var thumbUl=$("#thumbnails ul");
					
					//creating the thumbnails
					$.each(obj.files,function(i,img){
						img.path=encodeURIComponent(img.path)
						if(img.path.indexOf("_th_")>-1 ){
							var href = img.path.split("%2F").join("/").replace("_th_","")
							var a=$("<a />")
								.attr("rel","gallery")
								.attr("href",href)								
								.appendTo($("<li />").appendTo(thumbUl))							
								.click(function(e){
									if (main.userLogged){
										if (confirm("Delete this picture?")){
											myConsole.log("Deleting picture")
											$.getJSON("killFile.asp",{fileName:decodeURIComponent(img.path)},function(data){
												myConsole.json(data)
												if(!data.error){
													myConsole.log("Deleting thumbnail")
													$.getJSON("killFile.asp",{fileName:decodeURIComponent(img.path).replace("_th_","")},function(data){
														myConsole.json(data)
														if(!data.error){
															a.parents("li").remove()
														}else{
															main.userLogged=false;
															$("body").removeClass("loggedIn")
															main.updateMenu(main.currentFolder)
														}											
													})
												}else{
													main.userLogged=false;
													$("body").removeClass("loggedIn")
													main.updateMenu(main.currentFolder)
												}											
											})
										}										
									}
									return false;
								})												   
							$("<img />")						
								.attr("src",img.path)
								.appendTo(a)
							$("<span />")						
								.addClass("delete")
								.attr("title","Delete this picture")
								.appendTo(a)							
						}
					})
					
					if(obj.files.length>0) thumbUl.fadeIn(800);
					if(!main.userLogged){
						$("a",thumbUl).lightbox()
					}

				}
			)						
		}
		
		// hide the previous menu items and gets the new folder details
		$(".galleryMenu ul").fadeOut(300,function(){changeFolder(currentFolder)});			
	},
	
	
	
	fileUploadCode: function(filePath,makeThumb,callBack){
		var now=new Date;
		now=now.getTime();
		
		var formCode = '<form class="imgUpload" method="POST" enctype="multipart/form-data" action="upload.asp" target="' + now +'_upload"></form>';		
		var inputCode = '<input type="file" name="photoName" />';
		var pathCode = '<input type="hidden" name="path" value="' + filePath + '" />';
		var iFrameCode = '<iframe style="display:none" name="' + now +'_upload" id="' + now +'_upload" src="about:blank"></iframe>';
	
		var mainDiv=$("<div class='fileInput'></div>");
		
		//creo l'html
		var form = $(formCode).appendTo(mainDiv);	
		
		var iFrame = $(iFrameCode).appendTo(mainDiv);
		var path = $(pathCode).appendTo(form);
		
		$(inputCode).appendTo(form)		//quando l'utente seleziona un file...
		.change(function(){
			
			mainDiv.addClass("uploading");
			
			$("<img />")
				.attr("src","images/ajax-loader.gif")
				.appendTo(mainDiv)
				
			//setto il path prendendolo da pathCode
			$.getJSON(
				"makePath.asp",
				{"path": path.attr("value").replace("thumbnails","photo")},
				function(data){
					myConsole.json(data)
					iFrame.unbind("load");
					myConsole.status("Uploading...")
					iFrame.empty().load(function(){
						var statusMsg=eval("(" + this.contentWindow.document.body.innerHTML + ")")
						myConsole.json(statusMsg)
						if(statusMsg.error){
							main.userLogged=false;
							$("body").removeClass("loggedIn")
							main.updateMenu(main.currentFolder)							
							return false
						}
																		
						
						if(makeThumb){
							if(!statusMsg.error){
								myConsole.status("Creating the thumbnail...")
								var fileName=statusMsg.fileName.replace("/public/","")
								var thPathArray=fileName.replace("png","jpg").split("/")
								var thPath="_th_" + thPathArray.pop();
								thPath=thPathArray.join("/") + "/" + thPath
																
								$.get(
										"/public/imgsize.php",
										{
											"img": fileName,
											"h":100,
											"constrain":1,
											"w":100,
											"path":thPath
										},
										function(data){
											myConsole.log("Done!");
											
											if(callBack){
												alert("before callback")
												callBack(statusMsg);
												myConsole.log("Done! CallBack!!");
											}else{
												if(mainDiv.siblings(".fileInput").length==0){
													$(".updateText").click();
													myConsole.log("Refreshing...");
												}
											}
											mainDiv.remove();										
											
											//main.updateMenu(filePath)
										},
										"text"
								)
							}
						}else{
							myConsole.log("Done!")	
							
							if(callBack){
								callBack(statusMsg);
								myConsole.log("Done! CallBack!!");
							}else{
								if(mainDiv.siblings(".fileInput").length==0){
									$(".updateText").click();
									myConsole.log("Refreshing...");
								}
							}
							mainDiv.remove();							
						}
						
						
					});
				form.submit();
					
				}
			)
			
			
		})
		
		return mainDiv;			

	}	
}
