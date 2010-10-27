
// ixDropDown plugin
(function($){
    $.fn.ixDropDown=function(options){
        
        var defaults={
            className:""
        }               
        
        $.extend(defaults,options);
              
        //defining the base style for this object. Style customisation can be done by assigning a className in the options
        //and then defining its rules in your CSS
        var rules=[
                ".ixDropDown{ background-color:#eee; color:#069; padding-right:15px}",
                ".ixDropDown_DIV {position:absolute; display:none;}",
                ".ixDropDown_UL {list-style-type:none; padding:0; margin:0px}"
            ]
        
        $("<style type='text/css'>" + rules.join("\n") + "</style>").appendTo("head");     
        
        return this.each(function(){
            var thisObj=$(this).hide(0),
                timerHnd=null;
            
            var anchor=$("<a href='#show' />")
                .insertAfter(thisObj)
                .addClass("ixDropDown " + defaults.className)
                .append($("<span />").text($(this.options).filter("[selected=true]").text()))                
                .focus(function(){
                    clearTimeout(timerHnd);
                })
                .blur(function(){
                    var $this=$(this);
                    timerHnd=setTimeout(function(){                            
                            var ulDiv=$this.data("ulDiv");
                            
                            $this.data("ulDiv",null);
                            if(ulDiv) ulDiv.slideUp(120,function(){ulDiv.remove()});
                        },100
                    )
                })                
                .click(function(e){
                    e.preventDefault();
                    var $anchor=$(this);                    
                    var select=$anchor.prev("select").get(0),
                        ulDiv=$("<div />").addClass("ixDropDown_DIV " + defaults.className),                        
                        ul=$("<ul />").addClass("ixDropDown_UL").appendTo(ulDiv);
                        
                    var options=select.options;
                    
                    if($anchor.data("ulDiv")){
                        var ulDiv=$anchor.data("ulDiv")
                        ulDiv.slideUp(120,function(){ulDiv.remove()})
                        
                        $anchor.data("ulDiv",null);
                        return false;
                    }                    
                
                    $anchor.data("ulDiv",ulDiv);
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
                                                                                               
                                option.selected=true;                                                            
                                
                                $anchor.children().text(option.text);
                                
                                $anchor.data("ulDiv",null).focus();                                
                                ulDiv.slideUp(120,function(){ulDiv.remove()})
                            })
                            .focus(function(){
                                clearTimeout(timerHnd);
                            })
                            .blur(function(){
                                timerHnd=setTimeout(function(){
                                        var ulDiv=$anchor.data("ulDiv");
                                        
                                        $anchor.data("ulDiv",null);  
                                        ulDiv.slideUp(120,function(){ulDiv.remove()})                                
                                    },100
                                )
                            })
                            .appendTo(
                                $("<li />").appendTo(ul)
                            )                        
                    })
                    
                    var pos=$anchor.offset();
				
                    ulDiv.appendTo(document.body)
                        .css({
                            left:pos.left,			
                            top:pos.top+$anchor.outerHeight(true)
                        })	
                        .slideDown(120);
                    
                    return false;
                })
            
        })
    }
})(jQuery);
        

//on document ready...
$().ready(function(){
    //transforming all the select.ixDropDown elements into ixDropDown widgets (adding also GSstyle class name)
    $("select.ixDropDown").ixDropDown({"className":"GSstyle"});
})



