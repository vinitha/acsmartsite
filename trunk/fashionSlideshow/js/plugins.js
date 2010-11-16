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

// object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element)
	
		var scrollRight=function(scrollSize,duration){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>width*scrollSize?width*scrollSize:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}
		
		var scrollLeft=function(scrollSize,duration){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>width*scrollSize?-width*scrollSize:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}
		
		var scrollUp=function(scrollSize,duration){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=scrollHeight-myDiv.scrollTop()-height;					
			availableScroll=availableScroll>height*scrollSize?height*scrollSize:availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)				
		}
		
		var scrollDown=function(scrollSize,duration){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=myDiv.scrollTop();
			availableScroll=availableScroll>height*scrollSize?-height*scrollSize:-availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)
		}	
	
	return {
		scrollLeft:scrollLeft,
		scrollRight:scrollRight,
		scrollUp:scrollUp,
		scrollDown:scrollDown
	}
};


/* scrollBar function definition */
	function addScrollBar(options){
		var clickPos={},
			myDiv=options.elemToScroll.css("overflow","hidden"),
			horiz=options.horizontal,
			moving=false;
		
		//size check
		var containerSize=horiz?myDiv.innerWidth():myDiv.innerHeight(),
			contentSize=horiz?myDiv.get(0).scrollWidth:myDiv.get(0).scrollHeight;
		
		var delta=contentSize-containerSize;
		
		
		
		if(delta<1) return false;
		
		//check the positioning property
		if(myDiv.css("position")=="static") myDiv.css("position","relative")
		
		//handling the mouseWheel
		myDiv.mousewheel(function(event, delta) {
			event.preventDefault();
			
			if(delta<0){
				if(horiz){
					scroller(myDiv).scrollRight(0.5)
				}else{
					scroller(myDiv).scrollUp(0.5)
				}
			}else{
				if(horiz){
					scroller(myDiv).scrollLeft(0.5)
				}else{
					scroller(myDiv).scrollDown(0.5)
				}				
			}			
			return false;
		});

		
		var myScrollBar=$("<div></div>")
			.addClass(options.className)
			.append(
				$("<a href='#left'></a>")
					.addClass(horiz?"left":"top")
					.click(function(ev){
						ev.preventDefault();																		
						if(horiz){
							scroller(myDiv).scrollLeft();
						}else{
							scroller(myDiv).scrollDown();
						}
						return false;
					})	
				.css({
					float:horiz?"left":"none",
					display:"block",
					"min-width":10,
					height:"100%",
					"background-color":"#999"
				})							
			)
			.append(
				$("<a href='#right'></a>")
					.addClass(horiz?"right":"bottom")
					.click(function(ev){
						ev.preventDefault();																			
						if(horiz){
							scroller(myDiv).scrollRight();
						}else{
							scroller(myDiv).scrollUp()
						}
						return false;
					})
					.css({float:horiz?"right":"none",display:"block","min-width":10,height:"100%","background-color":"#999"})
			)						
			.append(
				$("<div class='bar'></div>")
					.css({
						position:"relative",
						height:"100%",
						overflow:"hidden"
					})
					.append(
						$("<div></div>")
							.addClass(horiz?"barLeftEnd":"barTopEnd")
							.css({float:horiz?"left":"none",display:"block"})
					)
					.append(
						$("<div></div>")
							.addClass(horiz?"barRightEnd":"barBottomEnd")
							.css({float:horiz?"right":"none",display:"block"})
					)								
					.append(
						$("<a class='cursor'></a>")
							.mousedown(function(ev){
								var $this=$(this)
								
								moving=true;
								
								clickPos.left=ev.pageX;
								clickPos.top=ev.pageY;
								clickPos.cursorLeft=$this.position().left
								clickPos.cursorTop=$this.position().top

								
								$(document).bind("mousemove",{target:$this,clickPos:clickPos,horizontal:options.horizontal},_scrollBarMousemove);										
								$(document).bind("mouseup",_scrollBarMouseUp);							
								
							})
							.css({display:"block",position:"absolute",left:0,top:0,width:containerSize/contentSize*100 + "%",height:"100%","background-color":"#069"})
							.append(
									$("<span></span>")
										.addClass(horiz?"cursorLeftEnd":"cursorTopEnd")
										.css({float:horiz?"left":"none",display:"block"})
								)
							.append(
									$("<span></span>")
										.addClass(horiz?"cursorRightEnd":"cursorBottomEnd")
										.css({float:horiz?"right":"none",display:"block"})
								)
							.append(
								$("<span class='cursorBody'></span>")
								.css({display:"block"})
							)										
					)
			)
			.css({
				"min-height":10,
				width:"100%",
				"background-color":"#eee",
				overflow:"hidden"
			})
		
		//finalizing the vertical style
		if(!horiz){
			myScrollBar.css({
				width:"auto",height:containerSize,position:"relative"
			})
			myScrollBar.children("a.top").css({position:"absolute",top:"0px","min-height":"10px",width:"100%",height:"auto"})
			myScrollBar.children("a.bottom").css({position:"absolute",bottom:"0px","min-height":"10px",width:"100%",height:"auto"})
			myScrollBar.find("div.barBottomEnd").css({position:"absolute",bottom:0,left:0})			
			
			var cBottom=myScrollBar.find("span.cursorBottomEnd").css({
				position:"absolute",bottom:0,left:0
			})			
			
			var cur=myScrollBar.find("a.cursor").css({
				width:"100%",height:containerSize/contentSize*100 + "%"
			})
				
		}
		
		// attach the scrollBar to the Dom
		if (options.barContainer){
			myScrollBar.appendTo(options.barContainer)
		}else{
			myScrollBar.insertAfter(myDiv)
		}
		

		//rechecking the bar size and position after the user css has been applyed
		if(!horiz){
			var top=myScrollBar.children("a.top").outerHeight(),
				bottom=myScrollBar.children("a.bottom").outerHeight(),
				len=myScrollBar.innerHeight()-top-bottom;
				
			myScrollBar.children("div.bar").css({position:"absolute",top:top,width:"100%",height:len})
			
			myScrollBar.find("span.cursorBody").css({
				height:cur.innerHeight()-myScrollBar.find("span.cursorTopEnd").outerHeight()-cBottom.outerHeight()
			})				
		}
		
		//setting the event handler
		myDiv.scroll(function(){
			if (!moving){
				if (horiz){
					myScrollBar.find(".cursor").css("left",(myDiv.scrollLeft()/contentSize*100 + "%"))
				}else{
					myScrollBar.find(".cursor").css("top",(myDiv.scrollTop()/contentSize*100 + "%"))
				}
				
			}
		})						
	
		
		//event function
		function _scrollBarMousemove(ev){
			
			var clickPos=ev.data.clickPos,
				horiz=ev.data.horizontal;
				
			var $this=ev.data.target,
				newPos=horiz?(ev.pageX-clickPos.left)+clickPos.cursorLeft:(ev.pageY-clickPos.top)+clickPos.cursorTop,						
				cursor=myScrollBar.find(".cursor"),
				bar=myScrollBar.find(".bar");
			
			var barSize=horiz?bar.innerWidth():bar.innerHeight(),
				cursorSize=horiz?$this.outerWidth():$this.outerHeight(),
				
			
			newPos=(newPos<0)?0:newPos;
			newPos=(newPos+cursorSize<barSize)?newPos:barSize-cursorSize;
								
			$this.css(horiz?"left":"top",newPos);					
			
			if (horiz){
				myDiv.scrollLeft(newPos*(contentSize-containerSize)/(barSize-cursorSize))
			}else{
				myDiv.scrollTop(newPos*(contentSize-containerSize)/(barSize-cursorSize))
			}
			
		}
		
		function _scrollBarMouseUp(ev){
			moving=false;
			$(document).unbind("mousemove",_scrollBarMousemove);
			$(document).unbind("mouseup",_scrollBarMouseUp);
			
			//needed to avoid selecting text!
			if(window.getSelection){
				var selection = window.getSelection();
				selection.collapse (selection.anchorNode, selection.anchorOffset);
			}
		}
		
	}					
/* ---------------------------------- */

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
                                onShow:function(){},
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
		    width:defaults.width+20,
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
			lb.find("input:visible, a:visible").eq(0).focus();
                        
                        defaults.onShow();
                        
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


/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4265 $
 *
 * Version: 3.0
 * 
 * Requires: $ 1.2.2+
 */

(function($) {

$.event.special.mousewheel = {
	setup: function() {
		var handler = $.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( $.browser.mozilla )
			$(this).bind('mousemove.mousewheel', function(event) {
				$.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = $.event.special.mousewheel.handler;
		
		$(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		$.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = $.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		$.extend( event, $.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
//		if ( $.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return $.event.handle.apply(this, args);
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);