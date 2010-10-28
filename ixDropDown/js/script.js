
//on document ready...
$().ready(function(){
    //transforming all the select.ixDropDown elements into ixDropDown widgets
    $("select.myDropDown")
	.change(function(){alert(this.value)})
	.ixDropDown();
});


// ixDropDown plugin
(function($){
    $.fn.ixDropDown=function(options){
         
        
        //defining the base style for this object. Style customisation can be done by assigning a className in the options
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
	    
	    var curOption=$.map(this.options,function(item, index){
		    return item.selected?item:null;
		})
	    
            var anchor=$("<a href='#show' />")
                .insertAfter(thisObj)
                .addClass("ixDropDown_A " + thisObj.attr("className"))
                .append($("<span />").text($(curOption).text()))              
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
                        
                    var options=select.options;
                    
                    if($anchor.data("externalDiv")){
                        close($anchor);
                        return false;
                    }                    
		    
		    //adding the "open" className
		    $anchor.addClass("open");
		    
                    $anchor.data("externalDiv",externalDiv);
                    $.each(options,function(index,item){
                        
                        $("<a />")
                            .text(item.text)
                            .attr("href","#" + item.text)
                            .attr("data_index",index)
                            .click(function(e){
                                e.preventDefault();                                
                                
                                var $this=$(this);
                                var index=$this.attr("data_index");
                                var option=options[index];
                                                                                               
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
                    })
                    
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
    }
})(jQuery);
        
