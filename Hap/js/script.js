
$().ready(function(){
    
    //handling the searchSwitch change event
    $("#searchSwitch").change(function(e,aObj){
        var searchType=aObj.hash,
            toHide=(searchType=="#advSearch")?"#stdSearch":"#advSearch",
            title=$("#searchPanel").find("h3");
    
        $(searchType).show(300);
        $(toHide).hide(300);
        
        searchType=="#advSearch"?(title.show(300)):(title.hide(300));
        
    })

});


////// widgets ////////

    //Switch
    (function(){   
        //setting the widget custom event
        var ul=$("ul.switch")
            .bind("change",function(e,currentA){
                var $A=$(currentA);
                $A.closest("ul")
                    .data("value",$A.attr("hash").replace("#",""))
                    .find("li").removeClass("current");
                $A.closest("li").addClass("current")
            });
            
        //widget init.
        ul.trigger("change",ul.find(".current a"))
        
        //defining the click event delegation
        $("ul.switch a").live("click",function(e){
            e.preventDefault();
            
            var $this=$(this);
            $this.closest("ul").trigger("change",$this)
        })
            
    })();