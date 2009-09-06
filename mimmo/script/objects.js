// jQuery extension to read and use jSon Comments (by A.C.)
	jQuery.fn.extend({
	  getJsonComment: function(){
		var code=jQuery(this).children("code.jsonComment");
		var par=null;
		if (code.length>0){
			code=code.get(0).innerHTML
				.replace("<!--","")
				.replace("-->","");
			par=eval("(" + code + ")");
		}
		return par||false;
		}
	});
	
	
// page object definition
	window.onload=function(){	
		
		var modGroups=[];
		
		//creating instances of the modules		
		$("div.ac_module").each(function(i, value){
			
			// modules initialisation params
			var params=	$(this).getJsonComment();
			
			//if the Group doesn't exist, then create it!
			var group=modGroups[params.groupName] || new modulesGroup();
			modGroups[params.groupName]=group;

			//the onUserLogged event is cross groups
			group.onUserLogged=function(logLevel){
				for(g in modGroups){
					modGroups[g].fireEvent("_onUserLogged",logLevel)
				}
			}
			
			params.tagId=this.id;
			params.parentObj=group;			
						
			//creating istances of the page objects
			group.modules.push(eval("new " + params.type + "(params)"))			
		})
		
	}
	
	modulesGroup=function(){
		this.modules=new Array();
		this.currentPath="";
		
		this.fireEvent=function(eventName,params){
			
			//loop through the modules and fires the event, if defined.
			$.each(this.modules,function(i,module){
				if(module[eventName]){
					module[eventName](params)
				}
			})
		};
							
		this.saveModule=function(module){
			var path=module.parentObj.currentPath;
			this.IO.writeFile(path+"/config.txt",module);					
		};
		
		this.IO={
			readFile:function(prefix,filePath,data,callBack){								
				$.getJSON(prefix,data,callBack);				
			},
			
			writeFile:function(filePath,module){
				$.getJSON("writeFile.asp",
					{
						fileName:filePath,
						content:module.toJsonString()
					},
					function(data){
						module._onSaveComplete(data)
					}
				)
			}
		}
	}
	


/* inheritance definition utility */
	myInherits = function( parent )
	{		
		if( arguments.length > 1 )
		{
			parent.apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else
		{
			try{
				parent.call(this);
			}catch(e){}
		}
	}

	Function.prototype.inherits = function( parent )
	{
		this.prototype = new parent();
		this.prototype.constructor = this;
	}



/* objects definition */
	/* base component class definition */
		function ac_baseComponent(params){
			this.jsonData = null;
			
			if (params) {
			
				this.id = params.tagId;
				this.parentObj = params.parentObj;
				this.logLevel = params.logLevel || 0;
				this.params = params;
				
				//adding the class name
				$("#" + this.id).addClass(params.type)
			}
		}
		
		ac_baseComponent.prototype.refresh = function(){
			//if(!this.jsonData) return false;
			
			this.$$render(this.jsonData)
			//console.log("refresh: " + this.params.type + "(#" + this.params.tagId + ")")
		},
		
		ac_baseComponent.prototype.render=function(jsonData){
			//making a note of the data Object
			this.jsonData=jsonData?jsonData[this.id]||null:null;
			
			//calling the custom function
			if(!this.$$render){
				alert("Please define the $$render function: " + this.id )	
				return false;
			}
			this.$$render(this.jsonData)
		};
					
			
		ac_baseComponent.prototype.toJsonString=function(){
			alert("Please define the toJsonString function")
		};
		
		ac_baseComponent.prototype.save=function(){
			$("<span class='loadingMsg' />")
				.text(" saving...")
				.appendTo($("#" + this.id));
				
			this.parentObj.saveModule(this);
		};					
		
		
		
		//base events definition
		ac_baseComponent.prototype._onSaveComplete=function(responseObj){
			$("#" + this.id + " .loadingMsg").remove()	
			if(this.$$onSaveComplete) this.$$onSaveComplete(responseObj)
		};	
		
		ac_baseComponent.prototype._onUserLogged=function(logLevel){
			//setting the logLevel
			this.logLevel=logLevel;
							
			if(this.$$onUserLogged){
				//if there's an event handler defined then execute it
				this.$$onUserLogged(logLevel)
			}else{
				//otherwise performs a refresh of the module (rendering function using cached jsonData)
				this.refresh()
			}
			
		}
	/* ---------- */
	
	
$('#fileInput').uploadify({
		'uploader'  : 'uploadify.swf',
		'script'    : 'uploadify.php',
		'cancelImg' : 'cancel.png',
		'auto'      : true,
		'folder'    : '/uploads'
	});

	
	
/* components */

	/* fileUpload */
	//ac_fileUpload
	
	

	/* photoGallery */
		ac_photoGallery.inherits(ac_baseComponent);			
		function ac_photoGallery(params){			
			myInherits.call(this,ac_baseComponent,params)
		}						
		
		ac_photoGallery.prototype.toJsonString=function(){
			return "photoGallery json string: " + this.id;	
		}
					
		ac_photoGallery.prototype.$$render=function(jsonData){
			var thisObj=this;
			var div=$("#" + this.id).empty();
			
			if (!jsonData) {
				div.html("vuoto")
				return false;
			}
			
			$("<p />")
				.text("photoGallery place-holder!")
				.click(function(){
					thisObj.save();
				})
				.appendTo(div);				
		}
		
		//custom events definition
		ac_photoGallery.prototype._onChangeFolder=function(jsonData){
			this.render(jsonData)
		}
		
	/* ---------- */		
	
	
	
	
	
	/* logIn module */
		ac_logIn.inherits(ac_baseComponent);			
		function ac_logIn(params){			
			myInherits.call(this,ac_baseComponent,params)
			this._onUserLogged(0);
		}						
		
		ac_logIn.prototype.toJsonString=function(){
			return "ac_logIn json string: " + this.id;	
		}
					
		ac_logIn.prototype.$$render=function(logLevel){
			var thisObj=this;
			var div=$("#" + this.id).empty();
							
			switch(logLevel){
				case 0:
					$("<button />")
						.text("logged as standard user!")
						.click(function(){
							thisObj.parentObj.onUserLogged(1)
						})
						.appendTo(div);						
				break;
				
				case 1:
					$("<button />")
						.text("logged as super user!")
						.click(function(){
							thisObj.parentObj.onUserLogged(2)
						})
						.appendTo(div);												
				break;
				
				case 2:
					$("<button />")
						.text("logged as administrator!")
						.click(function(){
							thisObj.parentObj.onUserLogged(0)
						})
						.appendTo(div);							
				break
				
			}
			$("<p />")
				.text("ac_logIn place-holder!")
				.click(function(){
					thisObj.save();
				})
				.appendTo(div);				
		}
		
		//events overloading
		ac_logIn.prototype.$$onUserLogged=function(logLevel){
			//calling the overloaded function
			this.$$render(logLevel)
		}
		
	/* ---------- */			
	
	
	
	
	
	
	/* ac_text */
		ac_text.inherits(ac_baseComponent);		
		function ac_text (params){
			myInherits.call(this,ac_baseComponent,params)										
		}
		
		ac_text.prototype.toJsonString=function(){
			var strObj=new Array();
			
			var div=$("#" + this.id)
			strObj.push('title:"' + escape(div.find(".title").attr("value")) + '"');
			strObj.push('textBody:"' + escape(div.find(".textBody").attr("value")) + '"');				
			
			return "{" + this.id + ":{" + strObj.join(",") +"}}";	
		}
		
		ac_text.prototype.$$render=function(jsonData){
			var thisObj=this;
			var div=$("#" + this.id).empty()	
		
			var textTitle=unescape(jsonData?jsonData.title||"":"");
			var textBody=unescape(jsonData?jsonData.textBody||"":"");
							
			if (this.logLevel>0){
				//title definition
				$("<input />")
					.attr("type","text")
					.addClass("title")
					.attr("value",textTitle)
					.appendTo(div);				
					
				//Paragraphs definition					
				$("<textarea />")
					.addClass("textBody")
					.attr("value",textBody)
					.appendTo(div);		
									
				// save button
				$("<button />")
					.attr("title","save changes")
					.text("save")
					.appendTo(div)
					.click(function(){
						thisObj.save();
					})
				
			}else{
				//title definition
				$("<h2 />")
					.text(textTitle)
					.addClass("title")
					.appendTo(div);				
					
				//Paragraphs definition										
				$.each(textBody.split("\n"),function(i,value){
					$("<p />")
						.text(value)
						.addClass("textBody")
						.appendTo(div);						
				})					
			}
		}
		
		
		// events overloading
		ac_text.prototype.$$onSaveComplete=function(jsonData){
			if(!jsonData.error){
				this.render(jsonData.message)
			}
		}
		
		//custom events definition
		ac_text.prototype._onChangeFolder=function(jsonData){
			this.render(jsonData)
		}
		
	/* ---------- */
	
	
	
	

	/* ac_traverser */
		ac_traverser.inherits(ac_baseComponent);			
		function ac_traverser(params){
			myInherits.call(this,ac_baseComponent,params)
			var thisObj=this;
			var path=this.params.path;
			
			//module initialization
			var groupObj=this.parentObj;	
			
			
			
			var div=$(document.getElementById(this.id)).replaceWith(
				$("<a />")
					.attr("href",path)
					.attr("id",this.id)
					.text(decodeURIComponent(path).split("/").pop())
					.click(function(){
						if (!$(this).attr("empty")){
							//visual feedback
							var thisTag=this;
							
							$("<span class='loadingMsg' />")
								.appendTo(this);
				
							groupObj.IO.readFile(		
								"dir.asp",
								path,
								{
									folderName:path,
									fileType:"*",
									objId:thisObj.id
								},
								function(jsonData){	
									//removing the Visual feedBack
									$(thisTag).find("span.loadingMsg").remove()	
									
									var ul=$(thisTag).closest("ul")
									
									ul.find("a").removeClass("current")										
									$(thisTag).addClass("current")
																		
									ul.nextAll()
												.hide(500,function(){
													$(this).remove();
												})																															
									
									//define here the "event" to fire
									groupObj.fireEvent("_onChangeFolder",jsonData)						
								}
							)									
														
						}
						return false;
					})									
			)											
		}						
		
		ac_traverser.prototype.toJsonString=function(){
			return "ac_traverser json string: " + this.id;	
		}
		
		ac_traverser.prototype.$$render=function(jsonData){
			var thisObj=this;
			var groupObj=this.parentObj;
			var exists=false;
			
			if (!jsonData) {
				return false;
			}		
				
			var path=jsonData.path.replace(/\//g,"_")
			
			groupObj.currentPath=jsonData.path;
			
			var menuDiv=$("#" + this.id).closest("div.menu")		
			
			

			
			var folderDiv=document.getElementById(path)
			
			if (!folderDiv) {
				folderDiv = $("<div />").addClass("container").attr("id", path).hide(0).appendTo(menuDiv)
			}else {	
				if (folderDiv.removing) {
					folderDiv = $("<div />").addClass("container").attr("id", path).hide(0).appendTo(menuDiv)
				}
				else {
					folderDiv = $(folderDiv).empty();
				}
			}
			
			if (thisObj.logLevel>0){
				menuDiv.find("div.createFolder").remove();
				var cfDiv=$("<div />")
								.appendTo(folderDiv)
								.addClass("createFolder")
				
				$("<p />")
					.text("New section name:")
					.appendTo(cfDiv);		
					
				var fName=$("<input type='text' />").appendTo(cfDiv)
				$("<button />")
					.text("create")
					.click(function(){
						$.getJSON(
							"makeFolder.asp",
							{
								folderName:groupObj.currentPath + "/" + encodeURIComponent(fName.attr("value"))
							},
							function(jsonData){
								folderDiv.prev().find("a.current").click()
							}
						)
					})
					.appendTo(cfDiv)		
			}
			
			if (jsonData.folders.length == 0) {
				folderDiv.show(600);
				return false;
			}
			
			var subFolders=$("<ul />")					
							.prependTo(folderDiv)		
			
			var newPath=encodeURIComponent(jsonData.path);				
			$.each(jsonData.folders,function(i, value){
										  
				var li=$("<li />")
					.appendTo(subFolders)	
					.hover(
						function(){
							if(thisObj.logLevel>0){
								$("<a />")
									.addClass("delete")
									.click(function(){
										var folderAnchor=$(this).siblings("a")
										var folderName=folderAnchor.text()
										var folderPath=folderAnchor.attr("href")
										if(confirm("Delete " + folderName + " section?")){
											$.getJSON(
												"killFolder.asp",
												{
													folderName:folderPath + "/" + encodeURIComponent(folderName)
												},
												function(jsonData){
													folderDiv.prev().find("a.current").click()
												}
											)																						
										}
									})
									.attr("href","#remove")
									.attr("title","Delete")
									.text("x")
									.appendTo(this)
							}							
						},
						function(){
							$(this).find("a.delete").remove()
						}
					)				
				var a=$("<a />")
						.attr("href",jsonData.path)
						.text(decodeURIComponent(value.name))
						.attr("rel",newPath)	
						.appendTo(li)
						.click(function(){
							var thisTag=this;							
							
							//visual feedback
							$("<span class='loadingMsg' />")
								.appendTo(thisTag);							
								groupObj.IO.readFile(		
									"dir.asp",
									value.path,
									{
										folderName:value.path,
										fileType:"*",
										objId:thisObj.id
									},
									function(jsonData){				
										//removing the Visual feedBack
										$(thisTag).find("span.loadingMsg").remove()
											
										var div=$(thisTag).closest("div.container")
																				
										div.find("a").removeClass("current")										
										$(thisTag).addClass("current")
										
										div.nextAll().each(function(){
											this.removing=true;
											
											$(this).hide(500,function(){
												$(this).remove();	
											})											
										})																				
										
										//define here the "event" to fire
										groupObj.fireEvent("_onChangeFolder",jsonData)																																							
									}
								)									
								
								return false;
							}
						)
				
			})
			
			folderDiv.show(600)
		
		}
		
		
		
		//custom events definition
		ac_traverser.prototype._onChangeFolder=function(jsonData){
			this.render(jsonData)
		}			
	/* ---------- */	
