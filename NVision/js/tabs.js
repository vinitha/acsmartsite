


$().ready(function(){
	
	//setting the main tabMenus custom events
    var tabMenu=$("#mainMenu");
    tabMenu.bind("showTab",function(e,tabId){
		console.log(tabId)
            var $a=tabMenu.find("a[href='#" + tabId + "']"),
                oldTab=$a.closest("li").siblings(".current"),
                oldId=oldTab.find("a").attr("hash");
            
            oldTab.removeClass("current");            
            $(oldId).removeClass("current");
            $a.closest("li").addClass("current");
            $("#" + tabId).addClass("current");
        })
    
    
    //setting the other tabMenus
    $("ul.tabMenu").find("a").live("click",function(e){
        e.preventDefault();
        
        var $a=$(this),
            oldTab=$a.closest("li").siblings(".current"),
            oldId=oldTab.find("a").attr("hash");
        
        oldTab.removeClass("current");            
        $(oldId).removeClass("current");
        $a.closest("li").addClass("current");
        $(this.hash).addClass("current");        
    })
		
	
	//checking the mainMenu tabs for iFrames
	$("#mainMenu").find("a.iframe").each(function(index,item){

		$('<div class="tabContent">')
			.attr("id",this.hash.replace("#",""))
			.append(
				$("<iframe />")
					.attr("src",$(item).data("url"))
			)
			.appendTo("#main")
	})
	.end()
	.find(".current a").trigger("click")

})
