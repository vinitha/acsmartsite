


$().ready(function(){
    
	
	var $tip=$(".tip").addClass("loading").text("Loading the Business Markets definition...")
	
    //getting the bmMatrix
    $.ajax({
        url:sysConfig.bmMatrix,
        type:"GET",
        dataType:"json",
        success:function(data){
            bmMatrix.setData(data);
            
            $("#marketPicker label").css("zoom",1)  //this is needed to fix an IE7 layout issue (WTF!)
			
			$(".tip")
				.removeClass("loading")
				.addClass("on")
				.fadeOut(0)
				.html("Please use the above map to show the B.M. list")
				.fadeIn(1000);
			
	
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(textStatus||errorThrown);            
        }
    })
	
	var worldMap=$("#worldMap");
	
	//defining the custom event handler
	worldMap.bind("change",function(ev,anchor){
			//updating the layout
			var world=document.getElementById("worldMap"),
				areaName=anchor.parentNode.className;
				
			world.className=areaName + "CL";			
			$(world).find("a").removeClass("current")			
			$(anchor).addClass("current");

		})
		.find("a")
			.hover(
				function(){							
					 $("#worldMap").addClass(this.parentNode.className + "BG");
				 },
				 function(){
					var world=document.getElementById("worldMap");
					 world.className=world.className.replace(this.parentNode.className + "BG","")
				 }
			)
			//triggering the custom event
			.click(function(){
				$("#worldMap").trigger("change",this)
			})
	
		
	//handling the change event
	worldMap.bind("change",function(ev,anchor){
		
		if(!$tip.data("init")){
			$tip.fadeOut(600,
					function(){
						$(this)
							.fadeIn(1000)									
							.html("<strong>Ctrl + click</strong> on the Business Market to open it in a new Tab.");
				})
			$tip.data("init",true)
		}
		
		//filtering the data
		var bmTable=bmMatrix.getBMs({region:anchor.hash.replace("#","")}),
			assets=bmMatrix.getHashAtLevel(bmTable,1),
			bmsContainer=$("#availableBMs").empty();
            
            var bms=bmMatrix.getHashAtLevel(bmTable,1);
			
			$.each(bms,function(i,elem){
				
				var markets=bmMatrix.getListAtLevel(elem,3)
				
				
				var ul=$("<ul />").appendTo($("<div class='bmList' />").appendTo(bmsContainer))
				$("<h3 />").text(i).insertBefore(ul);
				
				$.each(markets,function(i,elem){
					
					$("<a />")
						.text(elem.name)
						.attr("href",sysConfig.bmUrl+ "?BM=" + elem.id)
						.appendTo(
							$("<li/>").appendTo(ul)
						)
				})
				
				
				
			});
			
		
	})
	

    
});



var bmMatrix=(function(){
    var _matrix=null,
    
    _getBMs=function (filters){

        var obj=_getObjsByName(_matrix,1,filters.asset);
        obj=_getObjsByName(obj,3,filters.region);
        obj=_getObjsByName(obj,5,filters.exchange);
        
        return obj    
    },
	
    _getObjsByName=function(obj,level,name){
        //traverses an object and returns an hashtable of that object filtered by "name".
        
        var newObj={};
        
        if (level==0){
            newObj[name]=obj[name];
            return name?(newObj[name]?newObj:null):obj
        }
        
        level--;
        
        var hasChildren=false;
        for (var o in obj){
            
            var child=_getObjsByName(obj[o],level,name)
            if(child){
                newObj[o]=child;
                hasChildren=true;
            }            
            
        }
        return hasChildren?newObj:null;
    },  
    
    _getHashAtLevel=function(obj,level){
        //traverses an object and returns an hashtable of that object Nth-level children.
        
        var newObj={};
        
        if (level==0){
            return obj
        }
        
        level--;
        
        for (var o in obj){
            
            var child=_getHashAtLevel(obj[o],level)
            
            for (var c in child){
                newObj[c]=child[c]
            }            
        }
        return newObj;

    },     
    
    
    _getListAtLevel=function(obj,level){
        //traverses an object and returns a list of that object Nth-level children.
        
        var newObj=[];
        
        if (level==0){
            return obj
        }
        
        level--;
        
        for (var o in obj){
            
            var child=_getListAtLevel(obj[o],level)
            
            for (var c in child){
                newObj.push(child[c])
            }            
        }
        return newObj;

    };      
    
    return   {
       setData:function(data){_matrix=data},
	   getBMs:_getBMs,
	   getListAtLevel:_getListAtLevel,
	   getHashAtLevel:_getHashAtLevel,
	   getObjsByName:_getObjsByName
    };
    
    })();








//Switch widget   
function doSwitch(ulElem){
    //setting the widget custom event
    ulElem.bind("change",function(e,currentA){
            if(!currentA){return false};
            
            var $A=$(currentA);
            $A.closest("ul")
                .data("value",$A.attr("hash").replace("#",""))
                .find("li").removeClass("current");
            $A.closest("li").addClass("current")
        });
        
    //widget init.
    ulElem.trigger("change",ulElem.find(".current a"))
    
    //defining the click event
    ulElem.find("a").click(function(e){
        e.preventDefault();
        
        var $this=$(this);
        $this.closest("ul").trigger("change",$this)
    })        
}
