//ixDropDown plugin
(function($){
	$.fn.ixDropDown=function(options){
	    
		if(!window._ixDropDown){
		    //defining the base style for this object. Style customisation can be done by assigning a className to the <select> element
		    //and then defining its rules in your CSS
		    var rules=[
			       ".ixDropDown_A span{display:block}",
			       ".ixDropDown_A {color:#069; padding-right:15px; display:inline-block; text-align:left; zoom: 1; *display: inline;vertical-align:bottom;outline:none}",
			       ".ixDropDown_DIV {position:absolute; display:none;}",
			       ".ixDropDown_Cont {zoom:1}",
			       ".ixDropDown_UL {list-style-type:none; padding:0; margin:0px; outline:none}"
			       ];
    
		    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");
		    window._ixDropDown=true;
		}
		


		return this.each(function(){

			var thisObj=$(this).hide(0),
			timerHnd=null;

			//binding the onChange event to the <select>
			thisObj.change(function(){
				$(this).siblings("a.ixDropDown_A").find("span").text(this.options[this.selectedIndex].text);
			});

			var curOption=$.map(thisObj.find("option"),function(item, index){
				return item.selected?item:null;
			});
			

			curOption=curOption.length>0?curOption[0]:thisObj.children().eq(0).get(0);
			

			var anchor=$("<a href='#show' />")
			.insertAfter(thisObj)
			.addClass("ixDropDown_A " + this.className)
			.addClass(this.disabled?" disabled":(curOption?"":"disabled"))
			.append($("<span />").text(curOption?(curOption.label||$(curOption).text()):"- empty -"))
			.focus(function(){
				clearTimeout(timerHnd);
			})
			.blur(function(){
				var $this=$(this);
				timerHnd=setTimeout(function(){
					close($this);
				},100
				);
			})
			.click(function(e){
				e.preventDefault();
				var $anchor=$(this);

				if ($anchor.hasClass("disabled")){return false;};

				var select=$anchor.prev("select").get(0),
				externalDiv=$("<div />")
				.keydown(function(e){
					switch(e.which){
					case 40: //down
						$(document.activeElement).closest("li").nextAll().find("a").eq(0).focus();
						return false;
						break;

					case 38: //up
						$(document.activeElement).closest("li").prevAll().find("a").eq(0).focus();
						return false;
						break;
					}
				})
				.addClass("ixDropDown_DIV " + select.className),
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
					);
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
							);
							return true;
						}

						switch(item.tagName.toLowerCase()){
						case "optgroup":
							$("<strong />")
							.text(item.label)
							.appendTo(
									$("<li />").appendTo(ul)
							);

							doHTML($(item).children());
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
								);
							})
							.appendTo(
									$("<li />").appendTo(ul)
							);
							break;
						}
					});
				}

				var pos=$anchor.offset();

				externalDiv.appendTo(document.body)
				.css({
					left:pos.left,
					top:pos.top+$anchor.outerHeight(true)
				})
				.slideDown(120,function(){ul.find("a:first").focus();});

				return false;
			});
		});

		function close(anchor){
			//return false;
			var externalDiv=anchor.data("externalDiv");

			anchor.removeClass("open");

			if(externalDiv){
				anchor.data("externalDiv",null).focus();
				externalDiv.slideUp(120,function(){externalDiv.remove();});
			}
		}
	};

	$.fn.disabled=function(status){
		var select=this.prev("select");
		
		if(select.length>0){
			select.attr("disabled",status?"disabled":"")
				.find("option").get(0).selected="selected";
	
			select.change();	
		}
		
		return status?this.addClass("disabled"):this.removeClass("disabled");
	};
})(jQuery);



function myConfirm(msg,callback){
    /*
    var $msg=$("<div/>")
	.addClass("confirm")
	.append(
	    $("<p />").text(msg)
	    )
	.append(
	    $("<div/>")
	    .addClass("buttonBar")
	    .append(
		$("<a/>")
		.addClass("button")
		.text("ok")
	    )
	)
    $msg.lightBox({
	modal:true,
	onClose:function(){
	    
	}
    }).show();
    */
    if(confirm(msg)){
	callback();
    }
}

//lightBox widget
(function($){

	var defaults=null
	    bg=null,
	    lb=null;
	    
	
	$.fn.lightBox = function(options) {		
		$this=$(this);
		defaults={
				title:false,
				onClose:function(){},
				width:this.outerWidth(),
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

			this.appendTo(defaults.parent);
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
			.appendTo("body");
		    
		    //setting the basic CSS rules		    
		    var rules=[
			    "#lightBoxBg{position:fixed;height:100%;width:100%;background-color:#000;opacity:0.5;filter:alpha(opacity=50);top:0;left:0;z-index:9;display:none}",
			    "#lightBoxPanel{position:fixed;top:50%;margin-top:-100px;left:50%;background-color:#FFF;border:1px solid #000;z-index:9;display:none;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-webkit-box-shadow:0 3px 10px rgba(0,0,0,0.6);-moz-box-shadow:0 3px 10px rgba(0,0,0,0.6);box-shadow:0 3px 10px rgba(0,0,0,0.6)}",
			    "#lightBoxPanel .mainContent{outline:none;padding:10px}",
			    "#lightBoxPanel .closeBtn{outline:none;background-position:0 0;height:16px;position:absolute;right:-8px;top:-9px;width:16px}",
			    "#lightBoxPanel .closeBtn:hover,#lightBoxPanel .closeBtn:focus,#lightBoxPanel .closeBtn:active{background-position:0 bottom}",
			    "#lightBoxPanel .lbTitle{background-color:#bbb;background-image:color:#FFF;font-size:1.2em;border-top-right-radius:4px;border-top-left-radius:4px;-webkit-border-top-right-radius:4px;-webkit-border-top-left-radius:4px;-moz-border-radius-topleft:4px;-moz-border-radius-topright:4px;margin:0;padding:5px 5px 4px}"				
			];
    
		    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");		    
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
			
			var closeBtn=jQuery("<a href='#' class='closeBtn' title='close'></a>")
				.appendTo(lb)
				.keydown(function(e){
					if (e.which==9 && !e.shiftKey){
						lb.find("input:visible,a").not(".readonly").eq(0).focus()	
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
		    width:defaults.width,
		    marginLeft:-defaults.width/2
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



// object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element)
	
		var scrollRight=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>width*scrollSize+pageOffset?width*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}
		
		var scrollRightPx=function(scrollSize,duration){
			myDiv.stop(true,true);
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>scrollSize?scrollSize:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}		
		
		var scrollLeft=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>width*scrollSize+pageOffset?-width*scrollSize+pageOffset:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}
		
		var scrollLeftPx=function(scrollSize,duration){
			myDiv.stop(true,true);
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>scrollSize?-scrollSize:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}		
		
		var scrollUp=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=scrollHeight-myDiv.scrollTop()-height;					
			availableScroll=availableScroll>height*scrollSize+pageOffset?height*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)				
		}
		
		var scrollDown=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
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


//ixCarousel
(function($){
    
	var windowLoaded=false;	//needed to handle a webkit issue
	$(window).load(function(){
	    windowLoaded=true;
	})
	
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
						var curPage=Math.ceil($this.scrollLeft()/($this.innerWidth()+defaults.pageOffset))										
					
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
					if ($.browser.webkit && !windowLoaded){
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
							var ul=carousel.stop();
							var curPage=carousel.scrollLeft()/(carousel.innerWidth()+defaults.pageOffset)   //$this.closest("div").find("li.selected a").data("index")

							var thisPage=$this.data("index")
							var jumpSize=carousel.scrollLeft()-thisPage*(carousel.innerWidth()+defaults.pageOffset)//curPage-thisPage;
														
							
							if(defaults.autoStart){
								clearInterval(carousel.data("timerHnd"))
							}
							
							if (jumpSize==0){
								return false;
							}
							
							if (jumpSize<0){
								scroller(ul).scrollRightPx(Math.abs(jumpSize),defaults.duration)
							}else{
								scroller(ul).scrollLeftPx(Math.abs(jumpSize),defaults.duration)
							}
														
							
							return false;
						})
						.append($("<span/>").text(x+1))
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




// messages displaying tool
(function($){		  
	window.myConsole={
		prog:0,
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

