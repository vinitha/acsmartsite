/**
 * @author pust
 */

// extending the array object
Array.prototype.each=function(fun){
	for(var x=0;x<this.length;x++){
		if (fun(this[x],x)=="stop") return this;
	}
	
	return this;
}

 
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

main={	
	imageFolders:new Array(),
	init: function(){
		
		var logInBtn=$(".logIn");
		
		//
		$(".horMenu a").each(function(){
				var anchor=this;
				
				if (this.rel){
					$.getJSON(
						"dir.asp",
						{folderName: this.title},
						function(obj){									
							
							//if (obj.files.length > 0) {
								var id=new Date();
								id=obj.folderName.split("/").pop();	//id.getTime()								
								anchor.divId=id;
								
								var div=$("<div class='thumbnails'></div>").appendTo($(".mainContent")).attr("id",id).attr("path",obj.folderName);
								
								var ul=$("<ul></ul>")
								
								.appendTo(div);
								
								obj.files.each(function(image, i){
									$("<img></img>")
									.attr("src",obj.folderName.replace("photo","thumbnails") + "/" + image.name.replace("png","jpg"))
									
									.appendTo($("<a></a>")
											.attr("href",anchor.rel + "/" + image.name)	
											.attr("class","lightbox" )			
											.attr("rel",id)							
											.appendTo($("<li class='file'></li>").appendTo(ul)))								
								})																
								//slideShow init
								$(".lightbox",ul).lightbox();																																
								if (logInBtn.length == 0) {
									main.fileUploadCode(obj.folderName).appendTo(div);
									main.activateDelete();
								}
							//}							
						
							main.imageFolders.push(obj.folderName);	
							
						}
					)
					$(this).click(function(){						
						var current=$(".thumbnails.selected",".mainContent");
						var toActive=$("#" + this.divId)
						
						// is the current link == the clicked one?
						if (current.get(0) == toActive.get(0)) {							
							return false;
						}
						
						current.slideUp(300);
						current.removeClass("selected");
						
						current=toActive;
						current.addClass("selected");
						current.slideDown(600);
						
						return false;
					})															
				}												
			}
		);
				
		
		logInBtn.each(function(){
				var div=$("<form class='loginPanel'></form>");					
				$(this.parentNode).after(div)			
				div.hide();
				
				$("<p></p>").text("Login as:").appendTo(div);
				
				var username=$("<input type='text' value='user name' name='username' id='username' />").appendTo(div);
				username.attr("baseValue",username.attr("value"))
				username.focus(function(){
					var obj=$(this)
					if (obj.attr("value")==obj.attr("baseValue")){
						this.value=""
					}
				});
				username.blur(function(){
					var obj=$(this)
					if (this.value==""){
						this.value=obj.attr("baseValue");
					}				
				})
				
				var password=$("<input type='password' name='password' id='password' />").appendTo(div);
				
				var button=$("<button type='submit' value='Go' >Go</button>").appendTo(div);

				div.submit(function(){
					$.getJSON(
						"login.asp",
						{"username":username.attr("value"),"password":password.attr("value")},
						function(data){
							myConsole.json(data);
							if (!data.error) {
								//eveything's fine
								
								// add the newFolder button
								var newFolder=$('<li class="newFolder"><a href="#" title="new folder"><span>Create a new folder</span></li>')
									.appendTo(".horMenu ul");
								$("a",newFolder).click(function(){
															myConsole.log("new folder")
														});									
									
								// update the logIn button
								var logInBtn=$("a.logIn",button.get(0).parentNode.parentNode)
									.text("LogOut")
									.attr("href","logout.asp")
									.attr("className","logOut")
									.unbind("click");
									
									div.hide(300);
								main.activateUpload();
								main.activateDelete();
							}
						}
					)
					return false;
				})
				
			})
			.click(function(){
				var div=$(".loginPanel",this.parentNode.parentNode.parentNode);
				if(div.attr("closed")=="false"){
					div.slideUp();
					div.attr("closed","true")
				}else{
					div.slideDown();
					div.attr("closed","false")				
				}
				return false;
			});
			
		$(".newFolder a").click(function(){
			var folderName=prompt("New folder name:");
			var completed=false;
			if(folderName){
				$.getJSON(
					"makeFolder.asp",
					{"folderName":"/public/thumbnails/" + folderName},
					function(data){
						myConsole.json(data);
						if(data.error) return false;
						if (completed) location.reload(true);
						completed=true;
					}
				)
				$.getJSON(
					"makeFolder.asp",
					{"folderName":"/public/photo/" + folderName},
					function(data){
						myConsole.json(data);
						if(data.error) return false;						
						if (completed) location.reload(true);
						completed=true;						
					}
				)				
			}
		})

	},
	
	activateUpload:function(){
		$(".thumbnails").each(function(i){		
			main.fileUploadCode(main.imageFolders[i].replace("thumbnails","photo")).appendTo(this);									
		})		
	},
	
	activateDelete:function(){
		$(".thumbnails").each(function(i){		
			$("<button class='deleteFolder' title='delete this folder'><span>delete</span></button>")
			.appendTo(this)
			.attr("value",$(this).attr("path"))
			.click(function(){
								var folderName=this.value;
								if (confirm("Are you sure you want to delete this folder and the pictures in it?")){
									myConsole.status("removing the folder...");
									$.getJSON(
											"killFolder.asp",
											{"folderName":folderName},
											function(data){
												myConsole.json(data);
												if(!data.error) location.reload(true);
											}
										)
								}
							})
										
		})			
	},
	
	fileUploadCode: function(filePath){
		var now=new Date;
		now=now.getTime();
		
		var formCode = '<form class="imgUpload" method="POST" enctype="multipart/form-data" action="upload.asp" target="' + now +'_upload"></form>';		
		var inputCode = '<input type="file" name="photoName" />';
		var pathCode = '<input type="hidden" name="path" value="' + filePath + '" />';
		var iFrameCode = '<iframe style="display:none" name="' + now +'_upload" id="' + now +'_upload" src="about:blank"></iframe>';
	
		var mainDiv=$("<div class='fileInput'></div>");
		
		//creo l'html
		var form = $(formCode).appendTo(mainDiv);
		form.css("display","none")
		
		var add=$("<a href='#'><span>Add</span></a>").toggle(
					function(){
						$(this).addClass("close");
						$(this).attr("title","Cancel");
						form.toggle(400);
						return false;
					},
					function(){
						$(this).removeClass("close");
						$(this).attr("title","Add a picture");
						form.toggle(400);
						return false;
					}
			)
			
		add.attr("title","Add a picture");
		form.before(add);		
		
		
		var iFrame = $(iFrameCode).appendTo(mainDiv);
		var path = $(pathCode).appendTo(form);
		
		$(inputCode).appendTo(form)		//quando l'utente seleziona un file...
		.change(function(){
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
						var div=add.parents("div.thumbnails");

						//public/imgsize.php?img=photo/prova/RQJSXKTUAB1282009234134.png&h=100&constrain=1&w=1000&path=aaa.jpg
						
						//$('<li class="file"><a href="' + statusMsg.fileName + '" class="lightbox" rel="' + div.attr("id") + '"><img src="/public/imgsize.php?thumbnails/prova/QMNDZGEQDZ1282009231726.jpg"/></a></li>').appendTo($("ul",div))
						
						
						if(!statusMsg.error){
							myConsole.status("Creating the thumbnail...")
							var fileName=statusMsg.fileName.replace("/public/","")
							$.get(
									"/public/imgsize.php",
									{
										"img": fileName,
										"h":100,
										"constrain":1,
										"w":100,
										"path":fileName.replace("photo","thumbnails").replace("png","jpg")
									},
									function(data){
										myConsole.log("Done!");
									},
									"text"
							)
						}
						
						
					});
				form.submit();
					
				}
			)
			
			
		})
		
		return mainDiv;
			

	}
		
}

