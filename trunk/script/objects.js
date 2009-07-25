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
				this.jsonData=null;
				
				if (params){
					this.id=params.tagId;
					this.parentObj=params.parentObj;
					this.isLogged=params.isLogged||false;
					this.userParams=$("#" + this.id).getJsonComment();
				}
			}
			
			ac_baseComponent.prototype.render=function(jsonData){
				//making a note of the data Object
				this.jsonData=jsonData[this.id]||null;
				
				//calling the custom function
				this._Render(this.jsonData)
			};
			
			ac_baseComponent.prototype._Render=function(jsonData){
				//custom function
				alert("Please define the _Render function: " + this.id )
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
			};	
			
			ac_baseComponent.prototype._onUserLogged=function(isLogged){
				this.isLogged=isLogged;
				this._Render(this.jsonData)
			}
		/* ---------- */
		
		
		
	/* components */
		/* photoGallery */
			ac_photoGallery.inherits(ac_baseComponent);			
			function ac_photoGallery(params){			
				myInherits.call(this,ac_baseComponent,params)
			}						
			
			ac_photoGallery.prototype.toJsonString=function(){
				return "photoGallery json string: " + this.id;	
			}
						
			ac_photoGallery.prototype._Render=function(jsonData){
				var thisObj=this;
				var div=$("#" + this.id).empty();
				
				if(!jsonData) return false;
				
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
		
		
		/* ac_text */
			ac_text.inherits(ac_baseComponent);		
			function ac_text (params){
				myInherits.call(this,ac_baseComponent,params)							
			}
			
			ac_text.prototype.toJsonString=function(){
				var strObj=new Array();
				
				var div=$("#" + this.id)
				strObj.push("title:" + escape(div.find(".title").attr("value")));
				strObj.push("textBody:" + escape(div.find(".textBody").attr("value")));				
				
				return this.id + ":{" + strObj.join(",") +"}";	
			}
			
			ac_text.prototype._Render=function(jsonData){
				var thisObj=this;
				var div=$("#" + this.id).empty()				
			
				var textTitle=unescape(jsonData.title);
				var textBody=unescape(jsonData.textBody);
								
				if (this.isLogged){
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
			
			
			//custom events definition
			ac_text.prototype._onChangeFolder=function(jsonData){
				this.render(jsonData)
			}
			
		/* ---------- */
	
		/* ac_traverser */
			ac_traverser.inherits(ac_baseComponent);			
			function ac_traverser(params){
				myInherits.call(this,ac_baseComponent,params)
				
				//module initialization
				var pageObj=this.parentObj;				
				pageObj.IO.readFile(	this.userParams.path,
										function(jsonData){
											//define here the "event" to fire
											pageObj.fireEvent("render",jsonData)
										}
				)									
			}						
			
			ac_traverser.prototype.toJsonString=function(){
				return "ac_traverser json string: " + this.id;	
			}
			
			ac_traverser.prototype._Render=function(jsonData){
				var thisObj=this;
				var exists=false;
				
				var pathSeparator="/"
				
				var div=$(document.getElementById(this.id))
				
				
				var container=div.find(".container");
				if (container.length==0){	
					container=$("<div />")
						.addClass("container")
						.appendTo(div)				
				}
				
				// check the folder existence
				var tmpObj=document.getElementById(jsonData.path)
				exists=tmpObj?true:false;				
				
				var folder=exists?$(tmpObj):$("<ul />").appendTo(container);				
				
				//if there's no data for that node, then set an internal property
				if(jsonData.subItems.length==0){
					folder.find("a")
						.attr("empty",true)
				   return false;
				}				

				folder.empty();
				
				
				
				var li=$("<li />")
					.attr("id",jsonData.path)
					.appendTo(folder)					
				
				var a=$("<a />")
						.attr("href","#" + jsonData.itemName)
						.text(decodeURIComponent(jsonData.itemName))
						.attr("rel",jsonData.path)
						.click(function(){
							if (!$(this).attr("empty")){
								thisObj.parentObj.IO
									.readFile(	
										"",//jsonData.path,		<-----------------  ToDo,
										function(jsonData){
											thisObj.parentObj.fireEvent("render",jsonData)
										}
									);
							}
							return false;
						})										
						.appendTo(li)
				
				
				if (this.isLogged){
					$("<p />")
						.text("please define the ac_traverser isLogged code!!!")
						.appendTo(div);		
					
				}
								
				var subFolders=$("<ul />")					
					.appendTo(li)		
				
				//handling transition fx
				if(!exists) subFolders.hide(0)						
				
				
				var newPath=encodeURIComponent(jsonData.path);				
				$.each(jsonData.subItems,function(i, value){
											  
					var li=$("<li />")
						.attr("id",newPath +encodeURIComponent(pathSeparator + value))
						.appendTo(subFolders)					
					var a=$("<a />")
							.attr("href","#" + jsonData.itemName)
							.text(decodeURIComponent(value))
							.attr("rel",newPath)	
							.appendTo(li)
							.click(function(){
								if (!$(this).attr("empty")){
									thisObj.parentObj.IO
										.readFile(	
											"",//jsonData.path,		<-----------------  ToDo
											function(jsonData){
												thisObj.parentObj.fireEvent("_onChangeFolder",jsonData)
											}
										);
								}
								
								return false;
							})
					
				})
				
				if(!exists) subFolders.slideDown(600)
			
			}
			
			
			
			//custom events definition
			ac_traverser.prototype._onChangeFolder=function(jsonData){
				this.render(jsonData)
			}			
		/* ---------- */	
