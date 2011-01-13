// remap jQuery to $
(function($){
    $.fn.aleCarousel=function(options){
	var el=this;
	
	var defaults={
		transitionFx:"fade",
		duration:2000,
		speed:1200,
		autostart:false,
                ieFix:($.browser.msie && parseInt($.browser.version)<7)?3:0,
		events:{
		    start:function(){},
		    stop:function(){},
		    beforeChange:function(){},
		    change:function(){},
		    pause:function(){}
		}
	};
	//extending the default options
	$.extend(defaults,options);
	defaults.transitionFx=eval(defaults.transitionFx);
	
	var intervalHnd=null,
	    defaultIndex=0,	
	    ul=el
		.css({
		    position:"relative",
		    overflow:"hidden"
		}),
	    LIs=ul.children()
		.css({
			position:"absolute",
			width:"100%",
			display:"none"
		});
                
	//making a note of the panel index
	LIs.each(function(i){$(this).data("index",i);});
		
	var pluginObj={
	    $objects:el,
	    currentPanel:null,
	    nextPanel:null,
	    start:function(){
                        if(LIs.length<2){return false;}
			if (!intervalHnd){										
				intervalHnd=setInterval(function(){defaults.transitionFx.call(pluginObj)},defaults.duration);								
			}
			
			defaults.events.start.call(pluginObj);		
			return pluginObj;
	    },
	    pause:function(){
			clearInterval(intervalHnd);	
			intervalHnd=null;
			
			defaults.events.pause.call(pluginObj);
			return pluginObj;
	    },
	    goTo:function(panelIndex,trFx){
		
			if (pluginObj.currentPanel.data("index")==panelIndex){return pluginObj;}			
			
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);
			ul.stop(true,true);
			
			
			if (typeof panelIndex=="object"){
			    pluginObj.nextPanel=panelIndex;
			}else{
			    pluginObj.nextPanel=LIs.eq(panelIndex);   
			}
			if(trFx){
				trFx=eval(trFx);
				trFx.call(pluginObj);
			}else{
				defaults.transitionFx.call(pluginObj);
			}
			return pluginObj;
	    },
	    next:function(){
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);							
			ul.stop(true,true);
			
			defaults.transitionFx.call(pluginObj);
			return pluginObj;
	    },
	    previous:function(){
			pluginObj.nextPanel=this.currentPanel.prev().length>0?this.currentPanel.prev():this.currentPanel.nextAll(":last");
			
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);	
			ul.stop(true,true);
			
			defaults.transitionFx.call(pluginObj);			
			return pluginObj;
	    }
	};
	
	pluginObj.currentPanel=LIs.eq(defaultIndex).css("z-index",2).css({display:"block",position:"static"});
	pluginObj.nextPanel=pluginObj.currentPanel.next().length>0?pluginObj.currentPanel.next():pluginObj.currentPanel.prevAll(":last");
	
	ul.css("height","auto");

	if(defaults.autostart && LIs.length>1){pluginObj.start();}
	
	return pluginObj;
    
    
    
    
	//transitionFx definitions
	function slide(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel
		    .css("z-index",2)
		    .show(0);
							    
	    var viewportHeight=ul.height();
	    var nextPHeight=this.nextPanel.height();
            
	    ul.animate({"height":this.nextPanel.innerHeight(true)+defaults.ieFix},defaults.speed);            
    
	    
	    this.currentPanel.css("position","absolute");
		
		if(this.nextPanel.data("index")<this.currentPanel.data("index")){
			this.nextPanel.css("top",-nextPHeight);
			
			this.currentPanel.animate({"top":nextPHeight},defaults.speed,function(){$(this).css("z-index",0).hide(0);});
			this.nextPanel.animate({"top":0},defaults.speed,function(){
				defaults.events.change.call(thisObj);
				thisObj.currentPanel.css("position","static");
				ul.css("height","auto");
			});										
		}else{
			this.nextPanel.css("top",ul.height());
			
			this.currentPanel.animate({"top":-viewportHeight},defaults.speed,function(){$(this).css("z-index",0).hide(0);});
			this.nextPanel.animate({"top":0},defaults.speed,function(){
				defaults.events.change.call(thisObj);
				thisObj.currentPanel.css("position","static");
				ul.css("height","auto");
			});
		}
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last");
																    
	}
						
	function fade(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel.css("z-index",2);
            
	    ul.animate({"height":this.nextPanel.innerHeight(true)+defaults.ieFix},defaults.speed);
	    
	    this.currentPanel.css("position","absolute");
	    this.currentPanel.fadeOut(600,function(){$(this).css("z-index",0);});
	    this.nextPanel.fadeIn(defaults.speed,function(){
			defaults.events.change.call(thisObj);
			thisObj.currentPanel.css("position","static");
			ul.css("height","auto");
	    });
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last");
	}
        
	function swap(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel
		    .css("z-index",2)
		    .show(0);
							    
	    var viewportWidth=this.nextPanel.height();
	    
	    ul.animate({"height":this.nextPanel.innerHeight(true)+defaults.ieFix},defaults.speed);
	    
	    this.nextPanel.css("top",-viewportWidth);
	    this.currentPanel.css("position","absolute");
	    this.currentPanel.animate({"top":-viewportWidth},defaults.speed,function(){$(this).css("z-index",0).hide(0)});
	    this.nextPanel.animate({"top":0},defaults.speed,function(){
			defaults.events.change.call(thisObj);
			thisObj.currentPanel.css("position","static");
			ul.css("height","auto");
	    });						
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last");

	}
	
	function snap(){	    
	    defaults.events.beforeChange.call(this);
	    
	    ul.css("height","auto");
	    
	    this.currentPanel.css("z-index",1);
	    this.nextPanel.css("z-index",2);
	    
	    this.currentPanel.css("position","absolute");
	    var viewportWidth=this.nextPanel.height();
	    
	    this.currentPanel.hide(0);
	    this.currentPanel.css("z-index",0);
	    this.nextPanel.show(0);
	    
	    
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;		
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last");
	    
	    this.currentPanel.css("position","static");
	    defaults.events.change.call(this);
	}	    
    };
})(window.jQuery);




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
		scrollUp:scrollUp,
		scrollDown:scrollDown
	}
};


//ixCarousel
(function($){	
	$.fn.ixCarousel=function(options){
		var defaults={
			onScroll:function(){},
			className:"",
			scrollDuration:600,
			scrollSize:1,
			pageOffset:0,		//used when the items to scroll have a margin you need to complensate
			showButtons:true,
			showPag:true,
			autoStart:false,
			slideDuration:5000
		}
				
		
		$.extend(defaults,options)
		
        return this.each(function(){
			
			var timerHnd=null;
			
			var carousel=$(this).addClass("carouselContainer");
			
			var scrollWidth=this.scrollWidth;
			
			if (!carousel.parent("div").hasClass("ixCarousel")){
				
				carousel.wrap($("<div class='ixCarousel'></div>").addClass(defaults.className))
				
				if (defaults.showButtons){
					$("<a href='#left' class='left'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller(carousel).scrollLeft(defaults.scrollSize,defaults.scrollDuration,defaults.pageOffset);
							return false;
						})		
						.insertBefore(carousel)
						
					$("<a href='#right' class='right'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller(carousel).scrollRight(defaults.scrollSize,defaults.scrollDuration,defaults.pageOffset);
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
					
					if ($this.scrollLeft()==scrollWidth-$this.innerWidth()){
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
				
			    //quick refresh		
			    carousel.scroll(0);				
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
				var pageCount=Math.ceil((this.scrollWidth-defaults.pageOffset)/carousel.innerWidth());									
												
				for( var x=0;x<pageCount;x++){
					$("<a></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.attr("href","#"+x)
						.data("index",x)
						.click(function(){					
							var $this=$(this);
							var ul=carousel.stop()		//$this.closest("div").siblings("ul").stop();
							var curPage=$this.closest("div").find("li.selected a").data("index")
							var thisPage=$this.data("index")
							var jumpSize=curPage-thisPage;
							
							if(defaults.autoStart){
								clearInterval(carousel.data("timerHnd"))
							}
							
							if (jumpSize==0){
								return false;
							}
							
							if (jumpSize<0){
								scroller(ul).scrollRight(Math.abs(jumpSize),defaults.duration,defaults.pageOffset)
							}else{
								scroller(ul).scrollLeft(Math.abs(jumpSize),defaults.duration,defaults.pageOffset)
							}
														
							
							return false;
						})
						.appendTo(
							$("<li></li>").appendTo(ul)	
						);
				}
			}
		}
	}
})(jQuery);


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


// Autoscroll plugin
(function($){
	$.fn.autoScroll=function(options){
		var thisObj=$(this);
		
		thisObj.parent().css({"overflow":"hidden","position":"relative"});
		thisObj
		    .mouseenter(function(e){
			var cont=$(this.parentNode),
			contHeight=cont.innerHeight(true),
			contWidth=cont.innerWidth(true);
			
			cont.css({width:contWidth,height:contHeight})
			$(this).css({position:"absolute",top:0,left:0})
		    })
		    .mouseleave(function(){
			if(options && options.onLeave){
			    options.onLeave.call(this);
			}else{
			    $(this).css({position:"static"})
			}
			
		    })
		    .mousemove(function(e){
			
			var cont=$(this.parentNode),
			contHeight=cont.innerHeight(true),
			contWidth=cont.innerWidth(true);
								
			
			var deltaH=thisObj.get(0).clientHeight-contHeight,
			    deltaW=thisObj.get(0).clientWidth-contWidth,
			    top=e.clientY-cont.offset().top+$(window).scrollTop(),
			    left=e.clientX-cont.offset().left+$(window).scrollLeft();			    
			
			var y=top*100/contHeight;
			var x=left*100/contWidth;
	
			
			//cont.scrollTop((deltaH*y/100));
			//cont.scrollLeft((deltaW*x/100));
			$(this).stop().css({top:-(deltaH*y/100),left:-(deltaW*x/100)})
/*			
			cont.stop(true);
			cont.animate({scrollLeft:(deltaW*x/100),scrollTop:(deltaH*y/100)},400)
*/
			
		})
		
		return thisObj;
	}
})(jQuery);




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