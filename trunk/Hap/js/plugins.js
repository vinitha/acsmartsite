
//uself function
var utils={
    twoDigits:function(int){
        if (int<10) return "0" + int;
        if (int>99) {
            var str=int.toString();
            return str.substring(str.length-2);
        }
        return int.toString();
    },
    
    dateDiff:function(date1,date2){
        var baseDate=new Date(1970,01,01);
        date1=date1||baseDate;
        date2=date2||baseDate;
        
        return Math.abs(date1.getTime()-date2.getTime())
    },  

    RealTypeOf:function(v) {
        if (typeof(v) == "object") {
            if (v === null) return "null";
            if (v.constructor == (new Array).constructor) return "array";
            if (v.constructor == (new Date).constructor) return "date";
            if (v.constructor == (new RegExp).constructor) return "regex";
            return "object";
        }
        return typeof(v);
    },
	
	createCookie:function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	
	readCookie:function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	
	eraseCookie:function(name) {
		createCookie(name,"",-1);
	}
	
}


//adding the parseTime function to the string object
String.prototype.parseTime=function() {
	var timeString=$.trim(this);
    if (timeString == '') return null;

    var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i); 
    if (time == null) return null;

    var hours = parseInt(time[1],10);    
    if (hours == 12 && !time[4]) {
          hours = 12;
    }
    else {
        hours += (hours < 12 && time[4])? 12 : 0;
    }   
    var d = new Date();             
    d.setHours(hours);
    d.setMinutes(parseInt(time[3],10) || 0);
    d.setSeconds(0, 0);  
    return d;
};


//implementing the reverse function in jQuery
$.fn.reverse = [].reverse;


/* --- tooltip object definition --- */
    var toolTip=(function(){
	    
	    //private variables and functions
	    var divObj=null,
		show=function(content,hoveredElem){
			
			if (!divObj){
				divObj=$("<div></div>")
					.attr("id","toolTip")				 
					.css({
						position:"absolute",
						display:"none",
						zIndex:999
					})
					.appendTo(document.body)
			}
			
			divObj.empty();		
			divObj.append(content);
			
			hoveredElem=$(hoveredElem);
			var pos=hoveredElem.offset();
			
			divObj.css({
					left:(pos.left+hoveredElem.outerWidth()/2)-divObj.outerWidth()/2,			
					top:pos.top-divObj.outerHeight(true)
				})		
			
			divObj.show(0);		
			
		},
		hide=function(){
			divObj.hide(0);
		}
	    
	    //public API
	    return {
		    show:show,
		    hide:hide
	    }
    })();
/* ---------------------------------- */



// scrollBar function definition 
    /*
	usage: addScrollBar({
	   elemToScroll:xx,
	   horizontal:true,
	   className:blueTheme,
	   barContainer:null
       })	
    */
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
	    
	    //defining the base style for this object.
	    var rules=[];
	    
	    //common rules
	    rules.push("." + options.className + " .bar {position:relative;height:100%;overflow:hidden}");
	    rules.push("." + options.className + " .cursor {display:block;position:absolute;left:0;top:0;width:" + containerSize/contentSize*100 + "%;height:100%;background-color:#069}");
	    rules.push("." + options.className + " .cursorBody {display:block}");
	    rules.push("." + options.className + " {height:10px;width:100%;background-color:#eee;overflow:hidden}");
	    
	    if(options.horizontal){
		rules.push("." + options.className + " .left {float:left;display:block;width:10px;height:100%;background-color:#999}")
		rules.push("." + options.className + " .right {float:right;display:block;width:10px;height:100%;background-color:#999}")
		rules.push("." + options.className + " .barLeftEnd {float:left;display:block}")
		rules.push("." + options.className + " .barRightEnd {float:right;display:block}")
		rules.push("." + options.className + " .cursor {cursor: col-resize}");
		rules.push("." + options.className + " .cursorLeftEnd {float:left;display:block}")
		rules.push("." + options.className + " .cursorRightEnd {float:right;display:block}")
		
	    }else{
		rules.push("." + options.className + " .top {display:block;width:10px;background-color:#999;position:absolute;top:0px;min-height:10px;width:100%;height:auto}")
		rules.push("." + options.className + " .bottom {display:block;width:10px;height:100%;background-color:#999;position:absolute;bottom:0px;min-height:10px;width:100%;height:auto}")		    
		rules.push("." + options.className + " .barTopEnd {display:block}")
		rules.push("." + options.className + " .barBottomEnd {display:block;position:absolute;bottom:0;left:0}")
		rules.push("." + options.className + " .cursorTopEnd {display:block}")
		rules.push("." + options.className + " .cursorBottomEnd {display:block;width:100%}")
		rules.push("." + options.className + " .cursor {cursor: row-resize}");
			
		rules.push("." + options.className + "{width:auto;height:" + containerSize + "px;position:relative}")
		  
	    }

	    
	    
	    
	    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");    		
	    
	    
	    
	    //check the positioning property
	    if(myDiv.css("position")=="static") myDiv.css("position","relative")
	    
	    //handling the mouseWheel
	    myDiv.mousewheel(function(event, delta) {
		    event.preventDefault();
		    
		    if(delta<0){
			    if(horiz){
				    scroller(myDiv).scrollRight(0.25)
			    }else{
				    scroller(myDiv).scrollUp(0.25)
			    }
		    }else{
			    if(horiz){
				    scroller(myDiv).scrollLeft(0.25)
			    }else{
				    scroller(myDiv).scrollDown(0.25)
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
		    )						
		    .append(
			    $("<div class='bar'></div>")
				    .append(
					    $("<div></div>")
						    .addClass(horiz?"barLeftEnd":"barTopEnd")
				    )
				    .append(
					    $("<div></div>")
						    .addClass(horiz?"barRightEnd":"barBottomEnd")
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
						    .append(
								    $("<span></span>")
									    .addClass(horiz?"cursorLeftEnd":"cursorTopEnd")
							    )
						    .append(
								    $("<span></span>")
									    .addClass(horiz?"cursorRightEnd":"cursorBottomEnd")
							    )
						    .append(
							    $("<span class='cursorBody'></span>")
						    )										
				    )
		    )

	    
	    //finalizing the vertical style
	    if(!horiz){			
		    
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
			    height:cur.innerHeight()-myScrollBar.find("span.cursorTopEnd").outerHeight()-myScrollBar.find("span.cursorBottomEnd").outerHeight()
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
		    
		    ev.preventDefault();
		    return false;
		    
	    }
	    
	    function _scrollBarMouseUp(ev){
		    moving=false;
		    $(document).unbind("mousemove",_scrollBarMousemove);
		    $(document).unbind("mouseup",_scrollBarMouseUp);
		    
	    }
	
	return true;
    }					
/* ---------------------------------- */


// draggable plugin
(function($){	

	$.fn.draggable=function(options){
		var thisObj=$(this);
		
		var moving=false,
			clickPos={};
		
		
		var defaults={
			draggingClass:"",
			container:null,
			elementToDrag:thisObj,
			onStart:function(){},
			onMove:function(){},
			onStop:function(){}
		}		
		  
		$.extend(defaults,options)		
			
		thisObj.mousedown(function(ev){
			var $this=$(this),
				pos=defaults.elementToDrag.position();
			
			moving=true;
			
			clickPos.left=ev.pageX;
			clickPos.top=ev.pageY;
			clickPos.elementLeft=pos.left;
			clickPos.elementTop=pos.top;
	
			
			$(document).bind("mousemove",_Mousemove);										
			$(document).bind("mouseup",_MouseUp);
			
			defaults.onStart(defaults.elementToDrag);
			
		})
		
		//event function
		function _Mousemove(ev){
			ev.preventDefault();
			
			var $obj=defaults.elementToDrag,
				newLeft=(ev.pageX-clickPos.left)+clickPos.elementLeft,
				newTop=(ev.pageY-clickPos.top)+clickPos.elementTop;				
	
				if(defaults.container){
					//checking the top/left corners
					newLeft=newLeft>0?newLeft:0;
					newTop=newTop>0?newTop:0;
					
					//checking the bottom/right ones. Uncomment this to constrain the movements within the container
					/*
					newLeft=newLeft+defaults.elementToDrag.outerWidth()<defaults.container.innerWidth()?newLeft:defaults.container.innerWidth()-defaults.elementToDrag.outerWidth();
					newTop=newTop+defaults.elementToDrag.outerHeight()<defaults.container.innerHeight()?newTop:defaults.container.innerHeight()-defaults.elementToDrag.outerHeight();
					*/
				}
				
				
			$obj.css({"left":newLeft,"top":newTop});					
			
			defaults.onMove(defaults.elementToDrag)
			return false;			
		}
		
		function _MouseUp(ev){
			moving=false;
			$(document).unbind("mousemove",_Mousemove);
			$(document).unbind("mouseup",_MouseUp);
			
			defaults.onStop(defaults.elementToDrag);
		}
		
		return thisObj;
	}
	

})(jQuery);


/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);


// object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element)
	
		var scrollRight=function(scrollSize,duration,pageOffset){
			myDiv.stop();
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>width*scrollSize+pageOffset?width*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}
		
		var scrollRightPx=function(scrollSize,duration){
			myDiv.stop();
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>scrollSize?scrollSize:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}		
		
		var scrollLeft=function(scrollSize,duration,pageOffset){
			myDiv.stop();
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>width*scrollSize+pageOffset?-width*scrollSize+pageOffset:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}
		
		var scrollLeftPx=function(scrollSize,duration){
			myDiv.stop();
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>scrollSize?-scrollSize:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}		
		
		var scrollUp=function(scrollSize,duration,pageOffset){
			myDiv.stop();
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=scrollHeight-myDiv.scrollTop()-height;					
			availableScroll=availableScroll>height*scrollSize+pageOffset?height*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)				
		}
		
		var scrollDown=function(scrollSize,duration,pageOffset){
			myDiv.stop();
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=myDiv.scrollTop();
			availableScroll=availableScroll>height*scrollSize+pageOffset?-height*scrollSize+pageOffset:-availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)
		}	
	
	return {
		scrollLeft:scrollLeft,
		scrollRight:scrollRight,
		scrollLeftPx:scrollLeftPx,
		scrollRightPx:scrollRightPx,		
		scrollUp:scrollUp,
		scrollDown:scrollDown
	}
};


// messages displaying tool
(function($){		  
	window.myConsole={
		prog:0,
		timers:{},
		init:function(){
			myConsole.div=$("<div class='myConsole' />").appendTo(document.body);
			myConsole.alDiv=$("<div class='alertBox myConsole' />").appendTo(document.body);
		},
	
		error:function(msg,id){
			if (id){
				myConsole.status(msg,id,true);
			}else{
				var Msg=myConsole.showMsg(msg,"error");
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},5000)		
			}
		},
		
		log:function(msg,duration){
			var Msg=myConsole.showMsg(msg);
			setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||2000)		
		},
			
		alert:function(msg,duration){
			var Msg=$("<p />")
				.click(function(){$(this).remove()})		
				.addClass("alert")
				.appendTo(myConsole.alDiv)
				.text(msg && msg.length>0?msg:"(no message)");
			if (duration!=0){
			    setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||5000)
			}					
		},
		
		info:function(msg,duration){
			var Msg=$("<p />")
				.click(function(){$(this).remove()})		
				.addClass("info")
				.appendTo(myConsole.alDiv)
				.text(msg && msg.length>0?msg:"(no message)");
			if (duration!=0){
			    setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||5000)
			}					
		},		
			
		chkSpeed:function(msg,id){
			
			if (id){
				
				var Msg=$("#_console_" + id)							
				
				Msg.text(Msg.text().replace("***",(new Date()).getTime()- myConsole.timers["_console_" + id]));
				
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},10000);
				
				delete myConsole.timers["_console_" + id];
				return false;
			}
			
			id=myConsole.status(msg + "***");
			
			myConsole.timers["_console_" + id]=(new Date()).getTime();
			return id;
		},	
		
		status:function(msg,id,isError){	
			
			if (id){
				var Msg=$("#_console_" + id)							
				Msg.append	($("<span />")								
								  .text(msg.length>0?msg:"error")
								  .addClass(isError?"error":"ok")
							)
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},isError?5000:2000)
				return false;
			}
			var Msg=myConsole.showMsg(msg);
			
			myConsole.prog++;
			
			var now=new Date();
			now=now.getTime()+ "" + myConsole.prog;
			Msg.attr("id","_console_" + now );
			
			return now;
		},
		
		json:function(obj,id){
			if(obj.code==1){
				if(obj.messages.length==0){
					myConsole.status("",id,true);				
				}
				$.each(obj.messages,function(i,msg){
					myConsole.status(msg,id,true);											  
				})			
				
				return false;
			}else{
				myConsole.status("Ok!",id,false);
				return false;
			}		
	
		},
		
		showMsg:function(msg,classes){
			return $("<p />")
				.click(function(){$(this).remove()})		
				.addClass(classes)
				.appendTo(myConsole.div)
				.text(msg && msg.length>0?msg:"(no message)");				
		}
	}
	
	//$(document).ready(myConsole.init);
	myConsole.init()
	
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



/*
 * In-Field Label jQuery Plugin
 * http://fuelyourcoding.com/scripts/infield.html
 *
 * Copyright (c) 2009 Doug Neiner
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 0.1
 */
(function($){$.InFieldLabels=function(label,field,options){var base=this;base.$label=$(label);base.$field=$(field);base.$label.data("InFieldLabels",base);base.showing=true;base.init=function(){base.options=$.extend({},$.InFieldLabels.defaultOptions,options);base.$label.css('position','absolute');var fieldPosition=base.$field.position();base.$label.css({'left':fieldPosition.left,'top':fieldPosition.top}).addClass(base.options.labelClass);if(base.$field.val()!=""){base.$label.hide();base.showing=false;};base.$field.focus(function(){base.fadeOnFocus();}).blur(function(){base.checkForEmpty(true);}).bind('keydown.infieldlabel',function(e){base.hideOnChange(e);}).change(function(e){base.checkForEmpty();}).bind('onPropertyChange',function(){base.checkForEmpty();});};base.fadeOnFocus=function(){if(base.showing){base.setOpacity(base.options.fadeOpacity);};};base.setOpacity=function(opacity){base.$label.stop().animate({opacity:opacity},base.options.fadeDuration);base.showing=(opacity>0.0);};base.checkForEmpty=function(blur){if(base.$field.val()==""){base.prepForShow();base.setOpacity(blur?1.0:base.options.fadeOpacity);}else{base.setOpacity(0.0);};};base.prepForShow=function(e){if(!base.showing){base.$label.css({opacity:0.0}).show();base.$field.bind('keydown.infieldlabel',function(e){base.hideOnChange(e);});};};base.hideOnChange=function(e){if((e.keyCode==16)||(e.keyCode==9))return;if(base.showing){base.$label.hide();base.showing=false;};base.$field.unbind('keydown.infieldlabel');};base.init();};$.InFieldLabels.defaultOptions={fadeOpacity:0.5,fadeDuration:300,labelClass:'infield'};$.fn.inFieldLabels=function(options){return this.each(function(){var for_attr=$(this).attr('for');if(!for_attr)return;var $field=$("input#"+for_attr+"[type='text'],"+"input#"+for_attr+"[type='password'],"+"textarea#"+for_attr);if($field.length==0)return;(new $.InFieldLabels(this,$field[0],options));});};})(jQuery);




//JSON plugin
// two methods: JSON.stringify and JSON.parse
// https://github.com/douglascrockford/JSON-js
var JSON;if(!JSON){JSON={}}(function(){"use strict";function f(n){return n<10?'0'+n:n}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key)}if(typeof rep==='function'){value=rep.call(holder,key,value)}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null'}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null'}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' '}}else if(typeof space==='string'){indent=space}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value})}}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j}throw new SyntaxError('JSON.parse');}}}());
