
//on document ready...
$().ready(function(){
    //transforming all the select.ixDropDown elements into ixDropDown widgets
    $("select")
	.ixDropDown();
    
    //if you want to disable a dropdown using JS please use the following
    //$("a.myDropDown").disabled(true);
});




// ixDropDown plugin
(function($){
    $.fn.ixDropDown=function(options){
         
        
        //defining the base style for this object. Style customisation can be done by assigning a className to the <select> element
        //and then defining its rules in your CSS
        var rules=[
		".ixDropDown_A span{display:block}",
		".ixDropDown_A {display:inline-block; zoom: 1; *display: inline;vertical-align:bottom;outline:none}",
                ".ixDropDown_A{ color:#069; padding-right:15px}",
                ".ixDropDown_DIV {position:absolute; display:none;}",
                ".ixDropDown_UL {list-style-type:none; padding:0; margin:0px; outline:none}"
            ]
        
        $("<style type='text/css'>" + rules.join("\n") + "</style>").appendTo("head");     
       

        return this.each(function(){
	    
            var thisObj=$(this).hide(0),
                timerHnd=null;
	    
	    var curOption=$.map(thisObj.find("option"),function(item, index){
		    return item.selected?item:null;
		})
	    
	    curOption=curOption.length>0?curOption[0]:thisObj.children().eq(0).get(0);
	    
	    
             var anchor=$("<a href='#show' />")
                .insertAfter(thisObj)
                .addClass("ixDropDown_A " + thisObj.attr("className"))
		.addClass(this.disabled?" disabled":"")
                .append($("<span />").text(curOption.label||$(curOption).text()))              
                .focus(function(){
                    clearTimeout(timerHnd);
                })
                .blur(function(){
                    var $this=$(this);
                    timerHnd=setTimeout(function(){                            
                            close($this);
                        },100
                    )
                })                
                .click(function(e){
                    e.preventDefault();
                    var $anchor=$(this);
		    
		    if ($anchor.hasClass("disabled")){return false};
		    
                    var select=$anchor.prev("select").get(0),
                        externalDiv=$("<div />").addClass("ixDropDown_DIV " + thisObj.attr("className")),
			contDiv=$("<div />").addClass("ixDropDown_Cont").appendTo(externalDiv),
                        ul=$("<ul />")
			    .attr("tabIndex",-1)
			    .focus(function(){
                                clearTimeout(timerHnd);
                            })
                            .blur(function(){
                                timerHnd=setTimeout(function(){
                                        close($anchor);                               
                                    },100
                                )
                            })
			    .addClass("ixDropDown_UL")
			    .appendTo(contDiv);
                        
                    var options=$(select).children();
                    
                    if($anchor.data("externalDiv")){
                        close($anchor);
                        return false;
                    }                     
		    
		    //adding the "open" className
		    $anchor.addClass("open");
		    
                    $anchor.data("externalDiv",externalDiv);
		    
		    doHTML(options);

		    
		    function doHTML(items){
			$.each(items,function(index,item){
				
				if(item.disabled){
					$("<span />")
					    .text(item.text)
					    .addClass("disabled")
					    .appendTo(
						$("<li />").appendTo(ul)
					    )
					    return true;				    
				}
				switch(item.tagName.toLowerCase()){
				    
				    case "optgroup":
					$("<strong />")
					    .text(item.label)				   
					    .appendTo(
						$("<li />").appendTo(ul)
					    )
					    
					    doHTML($(item).children())
				    break;
				
				    case "option":
					$("<a />")
					    .text(item.text)
					    .attr("href","#" + item.text)
					    .attr("data_index",index)
					    .click(function(e){
						e.preventDefault();                                
						
						var $this=$(this);
						var index=$this.attr("data_index");
						var option=items[index];
													       
						option.selected="selected";                                                            
						
						$anchor.children().text(option.text);
						
						close($anchor);
						
						$anchor.siblings("select").change();
					    })
					    .focus(function(){
						clearTimeout(timerHnd);
					    })
					    .blur(function(){
						timerHnd=setTimeout(function(){
							close($anchor);                               
						    },100
						)
					    })
					    .appendTo(
						$("<li />").appendTo(ul)
					    )    
				    break;
				}
									    
			    })			
		    }
                    
                    var pos=$anchor.offset();
				
                    externalDiv.appendTo(document.body)
                        .css({
                            left:pos.left,			
                            top:pos.top+$anchor.outerHeight(true)
                        })	
                        .slideDown(120,function(){ul.find("a:first").focus()});
			
                    return false;
                })            
        })
	
	function close(anchor){
	    var externalDiv=anchor.data("externalDiv");
            
	    anchor.removeClass("open");
	    
	    if(externalDiv){
		anchor.data("externalDiv",null).focus();  
		externalDiv.slideUp(120,function(){externalDiv.remove()})
	    }
	}
    };
    
    $.fn.disabled=function(status){
	return status?this.addClass("disabled"):this.removeClass("disabled")
    };
    
})(jQuery);
        
