// page object definition


window.onload=function(){
	myPage.init();	
	//myPage.load("");
}

var myPage={
	modules:new Array(),
	currentPath:"",
	init:function(){
				
		//creating a list of the available modules
		var modulesToLoad=	[	//   <--  please add your customised modules here!
								".ac_photoGallery",	
								".ac_text",
								".ac_cover",
								".ac_traverser"
							]

		
		//jQuery elements selection syntax
		var modSelector = modulesToLoad.join(",")
		
		$(modSelector).each(function(i, value){
			
			// modules initialisation params
			var params=	{	tagId:this.id,
							parentObj:myPage
						};
						
			//creating istances of the page objects
			myPage.modules.push(eval("new " + this.className + "(params)"))
		})
	},

	
	fireEvent:function(eventName,params){
		
		//loop through the modules and fires the event, if defined.
		$.each(myPage.modules,function(i,module){
			if(module[eventName]){
				module[eventName](params)
			}
		})
	},
					
	saveModule:function(module){
		myPage.IO.writeFile(myPage.currentPath,module);					
	},
	
	IO:{
		readFile:function(filePath,callBack){
			myPage.currentPath=filePath
			$.getJSON(filePath+"config.json",callBack)				
		},
		
		writeFile:function(filePath,module){
			console.log("saving: " + module.toJsonString())
			setTimeout(function(){module.onSave("Done!")},1000)
		}
	}
}

