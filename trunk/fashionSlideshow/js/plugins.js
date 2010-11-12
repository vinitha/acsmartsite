// jQuery extension to read and use jSon Comments (by A.C.)
jQuery.fn.extend({
    getJsonComment: function(){
        var code=this.children("code.jsonComment");    	
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


//lightBox widget
(function($){

	var defaults=null
	    bg=null,
	    lb=null;
            
            
        //defining the base style for this object.
        var rules=[
		"#lightBoxBg{position:fixed;height:100%;width:100%;background-color:#000000;opacity:0.5;filter:alpha(opacity=50);top:0px;left:0px;z-index:9;display:none;}",
		"#lightBoxPanel{position:fixed;top:50%;margin-top:-100px;left:50%;background-color:#FFFFFF;border:1px solid #000;z-index:9;display:none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;-webkit-box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);-moz-box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);}",
                "#lightBoxPanel .mainContent{padding:10px;outline:none;}"
            ];
        
        $("<style type='text/css'>" + rules.join("\n") + "</style>").appendTo("head");	    
	
	$.fn.lightBox = function(options) {		
		$this=$(this);
		
		defaults={
				title:false,
				onClose:function(){},
				width:400,
				parent:null,
				rtl:false,
				modal:false
			};		
		
		//extending the default options
		$.extend(defaults,$.fn.lightBox.defaults,options)		
		
		defaults.parent=defaults.parent||this.parent();
		
		this.closeIt=function(){
		    return closing.call(this)
		};
		this.show=function(){return showing.call(this)};
		
		return this;
	};	
	
	
	// defining the plugin custom methods
	var closing=function(){
			bg.hide(0);
			lb.hide(200);			

                        if(defaults.parent.length){
                            this.appendTo(defaults.parent);
                        }else{
                            lb.children("div.mainContent").empty();
                        }
			
			//firing the close event
			defaults.onClose.call(this);
			
			return this;
	};
	
	var showing=function(){
		
		var thisObj=this;
		
		//get the background DIV (or create it)						
		bg=document.getElementById("lightBoxBg");
		if(bg){
			bg=$(bg);
			bg.unbind("click")
		}else{
			bg=$("<div id='lightBoxBg'></div>")
				.appendTo("body")			
		}

		
		bg	.fadeTo(0,0.5)
			.show();
		
		var mainContent=null;
		var lbTitle=null;
		
		// get the fore DIV (or create it)
		lb=document.getElementById("lightBoxPanel");
		var closeBtn=null;
		
		if (lb){
			lb=jQuery(lb);
			mainContent=jQuery("div.mainContent",lb);
			lbTitle=jQuery("p.lbTitle",lb);
			closeBtn=lb.find("a.closeBtn");
			
			lb.unbind("keydown")
			closeBtn.unbind("click")			
		}else{
			lb=jQuery("<div id='lightBoxPanel'></div>")
				.appendTo("body");						
						
			lbTitle=jQuery("<p class='lbTitle'></p>").appendTo(lb);
			mainContent=jQuery("<div class='mainContent'></div>")
							.attr("tabIndex",0)
							.appendTo(lb);
			
			var closeBtn=jQuery("<a href='#' class='closeBtn' title='close'>close</a>")
				.appendTo(lb)
				.keydown(function(e){
					if (e.which==9){
						lb.find("a").eq(0).focus();                                        
						return false;
					}
				})					    
		}
		
		
		
	    //binding the close event
		closeBtn.bind("click",function(){		
		    thisObj.closeIt();
		    return false;
		});
		
		
		closeBtn.css("display","none");					    
		
		if(defaults.modal==false){
		    closeBtn.css("display","block");
		    
		    bg.bind("click",function(){		
			thisObj.closeIt();
			return false;
		    });
		    
		    //handling the ESC button
		    lb.bind("keydown",function(e){
			if (e.keyCode==27){
			    thisObj.closeIt();
			    return false;
			}
		    })
		}
		
		
		// handling the LB width and position
		lb.css({
		    marginLeft:-defaults.width/2-10 //10= mainContent padding
		});
                
                
		
		// setting the reading direction class Name
		if (defaults.rtl){
		    lb.addClass("rtl");
		}else{
		    lb.removeClass("rtl");
		}
		
		
		lbTitle.text(defaults.title);
		lbTitle.css("display",defaults.title?"block":"none");		
		
		
		this.appendTo(mainContent)
		
		
		lb.css("visibility","hidden");
		
		lb.fadeIn(300,function(){
			
			lb.css(
			       {"visibility":"visible"}
			);
			
			//moving the focus to the first input, anchor or to the close button
			lb.find("input:visible, a:visible").eq(0).focus()
			//closeBtn.focus()			
		});		
		
		if(mainContent.outerHeight()/2>10){
		    lb.css({"margin-top":-mainContent.outerHeight()/2});
		}
		
		
		var checkPos=function(){		
		    if(mainContent.outerHeight()/2>10 && lb.css("margin-top")!=(-mainContent.outerHeight()/2)){
			lb.animate({"margin-top":-mainContent.outerHeight()/2},200);
		    }
		}			
		
		setTimeout(checkPos,700);		
							
		return thisObj;	    
	};
			
})(jQuery);