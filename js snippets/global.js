/* requires jQuery */

//useful function
var utils={
	twoDigits:function(inte){
		if (inte<10) return "0" + inte;
		if (inte>99) {
			var str=inte.toString();
			return str.substring(str.length-2);
		}
			return inte.toString();
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
	}
};         

Date.prototype.shortDate=function(sep){			//i.e. 22/11/1989
	sep=sep||"/";	
	return utils.twoDigits(this.getDate()) + sep + utils.twoDigits(this.getMonth()+1) + sep + this.getFullYear();
}

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
}


$(document).ready(function() {

   	
/* binding toolTips events*/
	$(".carouselContainer a img").live("mouseenter",function(){
		
		//creating the html for the toolTip content
		var ttContainer=$("<div></div>").addClass("container");
		var ttContent=$("<div></div>").addClass("content").appendTo(ttContainer);
		
		var $this=$(this);
		var	title=$this.parent().siblings(".title").text()||"--",
			author=$this.parent().siblings(".author").text()?$this.parent().siblings(".author").html().split("<br>"):"--",			
			date=$this.parent().siblings(".date").text()?new Date($this.parent().siblings(".date").text().split(" ")[0]).shortDate():"--";

		$("<p></p>")
			.text(title)
			.addClass("title")
			.appendTo(ttContent);
		
		var dl=$("<dl></dl>").appendTo(ttContent);
			
		$("<dt>Author(s):</dt>").appendTo(dl);
		$.each(author,function(index,item){
			$("<dd></dd>")
				.text(item.replace(/&nbsp;/g," "))	
				.appendTo(dl);		
		})
		
			
		$("<dt>Pub Date:</dt>").appendTo(dl);
		$("<dd></dd>")
			.addClass("date")
			.text(date)
			.appendTo(dl);
			
		//showing the toolTip
		toolTip.show(ttContainer,this);
		
	})

	$(".carouselContainer a img").live("mouseleave",function(){
		toolTip.hide();
	});
	
	
	/* customScrollBars */
	$("#tab-1 .carousel-outer")			
		.each(function(index,item){
			var myDiv=$(item)
			var params={
					horizontal:true,
					elemToScroll:myDiv,
					className:"myHorScrollBar",
					barContainer:null//myDiv.siblings(".horBar")				//if null then scrollBar html will be inserted after the elemToScroll element.
				}
			//adding the horizontal scrollBar
			
			if ($.browser.webkit){
				$(window).load(function(){
					addScrollBar(params)							
				})				
			}else{
				addScrollBar(params)							
			}
			
		});
	

		
   	
});


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




function initializeJqueryUiStuff($elt) {


    /* Carousels */
    $('.carouselContent, #carousel-1, #carousel-2, #carousel-3').ixCarousel({
		scrollDuration:600,		//the scrolling duration in ms.
		scrollSize:0.5			//the scroll width (50% of the viewport)
	});
	
	/* autoScroller */
	$(".autoCarouselContent").ixCarousel({
		scrollDuration:1000,		//the scrolling duration in ms.
		scrollSize:1,				//the scroll width (100% of the viewport)
		autoStart:true,
		showButtons:false,
		showPag:true
	});
	
	
   
}




//ixCarousel
(function($){	
	$.fn.ixCarousel=function(options){
		var defaults={
			onScroll:function(){},
			className:"",
			scrollDuration:600,
			scrollSize:1,
			showButtons:true,
			showPag:true,
			autoStart:false,
			slideDuration:5000
		}
				
		
		$.extend(defaults,options)
		
        return this.each(function(){
			
			var timerHnd=null;
			
			var carousel=$(this).addClass("carouselContainer");
			
			if (!carousel.parent("div").hasClass("ixCarousel")){
				
				carousel.wrap($("<div class='ixCarousel'></div>").addClass(defaults.className))
				
				if (defaults.showButtons){
					$("<a href='#left' class='left'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller($(this).siblings("ul")).scrollLeft(defaults.scrollSize,defaults.scrollDuration);
							return false;
						})		
						.insertBefore(carousel)
						
					$("<a href='#right' class='right'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller($(this).siblings("ul")).scrollRight(defaults.scrollSize,defaults.scrollDuration);
							return false;
						})
						.insertAfter(carousel)
				}
				
				carousel.scroll(function(ev){
					var $this=$(this);
					if ($this.scrollLeft()==0){
						$this.siblings("a.left").addClass("off")
					}else{
						$this.siblings("a.left").removeClass("off")
					}					
					
					if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
						$this.siblings("a.right").addClass("off")
					}else{
						$this.siblings("a.right").removeClass("off")
					}
					
					if(defaults.showPag){
						//checking the pagination
						var pagination=$this.siblings("div.paginationContainer")
						var li=pagination.find("li");
						var curPage=Math.round($this.scrollLeft()/$this.innerWidth())										
					
						var curLi=li.eq(curPage)
						if(!curLi.hasClass("selected")){
							li.removeClass("selected");
							curLi.addClass("selected");
						}	
					}
					
					//event callBack
					defaults.onScroll.call(this,ev);
					
				})
				
				if(defaults.showPag){
					if ($.browser.webkit){
						//chrome needs this to calculate the width correctly
						$(window).load(function(){																			
							makePagination.call(carousel.get(0))									
						})
					}else{
						makePagination.call(this)
					}
				}
				
				if(defaults.autoStart){
					timerHnd=setInterval(function(){doSlide.call(carousel.get(0),defaults)},defaults.slideDuration)
					carousel.data("timerHnd",timerHnd)
				}
			}			
        });
		
		function doSlide(defaults){
			var $this=$(this);
			
			if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
				$this.animate({scrollLeft:0},defaults.scrollDuration)
			}else{
				scroller(this).scrollRight(defaults.scrollSize,defaults.scrollDuration);
			}
			
		}
		
		function makePagination(){
			var carousel=$(this);
			
			if (carousel.find("li").length>0){			
				//creating the pagination code
				var pagDiv=$("<div class='paginationContainer'></div>").insertAfter(carousel)
				var ul=$("<ul></ul>").appendTo(pagDiv)
				var pageCount=Math.ceil(this.scrollWidth/carousel.innerWidth());									
												
				for( var x=0;x<pageCount;x++){
					$("<a></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.attr("href","#"+x)
						.data("index",x)
						.click(function(){					
							var $this=$(this);
							var ul=$this.closest("div").siblings("ul").stop();
							var curPage=$this.closest("div").find("li.selected a").data("index")
							var thisPage=$this.data("index")
							var jumpSize=curPage-thisPage;
							
							if(defaults.autoStart){
								clearInterval(carousel.data("timerHnd"))
							}
							
							if (jumpSize<0){
								scroller(ul).scrollRight(Math.abs(jumpSize),defaults.duration)
							}else{
								scroller(ul).scrollLeft(Math.abs(jumpSize),defaults.duration)
							}
														
							
							return false;
						})
						.appendTo(
							$("<li></li>").appendTo(ul)	
						);
											
				}
			}
			
			//quick refresh		
			carousel.scroll(0);
		}
		
	}
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