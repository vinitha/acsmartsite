//getting an object keys array
objKeys=function(obj){
    var prop=[];
    for(var p in obj){
	if(obj.hasOwnProperty(p)){
	    prop.push(p)
	}
    }
    return prop;
};


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


//extending the Date Object
Date.prototype.add=function(obj){
	for(var prop in obj){
		switch (prop){
			case "days":
				this.setDate(this.getDate()+obj[prop])
			break;
			case "months":
				this.setMonth(this.getMonth()+obj[prop])
			break;		
			case "years":
				this.setFullYear(this.getFullYear()+obj[prop])
			break;					
		}
	}
	return this;
}

var _calWeekday={
	en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
	ar:["xxM","xxT","xxW","xxT","xxF","xxS","xxS"]
};
var _calYearmonth={
	en:["January","February","March","April","May","Jun","July","August","September","October","November","December"],
	ar:["xxJan","xxFeb","xxMar","xxApr","xxMay","xxJun","xxJul","xxAug","xxSep","xxOct","xxNov","xxDec"]
};

Date.prototype.getEuropeanDay=function(){
	var day=this.getDay()-1;
	return day<0?6:day;
}

Date.prototype.shortMonth=function(){			//i.e.	Jan
	return _calYearmonth[Iol.docLanguage][this.getMonth()];
}

Date.prototype.shortDayMonth=function(sep){		//i.e.	02 Jan
	return this.getDate() + (sep||" ") + _calYearmonth[Iol.docLanguage][this.getMonth()];
}

Date.prototype.day=function(){					//i.e. 	Mon
	return _calWeekday[Iol.docLanguage][this.getEuropeanDay()];
}

Date.prototype.longDayMonth=function(){			//i.e. 	Mon, 02 Jan
	return _calWeekday[Iol.docLanguage][this.getEuropeanDay()] + ", " + this.getDate() + " " + _calYearmonth[Iol.docLanguage][this.getMonth()];
}

Date.prototype.shortMonthYear=function(sep){	//i.e. 	12/2010	
	var year=this.getFullYear().toString(),
		month=utils.twoDigits(this.getMonth()+1);
	sep=sep||"/";
	return month + sep + year;
}

Date.prototype.litteralMonthYear=function(sep){	//i.e. 	December/2010	
	var year=this.getFullYear().toString(),
		month=_calYearmonth[Iol.docLanguage][this.getMonth()];
	sep=sep||"/";
	return month + sep + year;
}


Date.prototype.shortTime=function(){
	return utils.twoDigits(this.getHours())+":" + utils.twoDigits(this.getMinutes());
}

Date.prototype.shortDate=function(sep){			//i.e. 22/11/1989
	sep=sep||"/";
	return utils.twoDigits(this.getDate()) + sep + utils.twoDigits(this.getMonth()+1) + sep + this.getFullYear();
}

Date.prototype.shortAmericanDate=function(sep){			//i.e. 11/22/1989
	sep=sep||"/";
	return utils.twoDigits(this.getMonth()+1) + sep + utils.twoDigits(this.getDate()) + sep + this.getFullYear();
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
     usage: $(".myDiv").addScrollBar({
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
		rules.push("." + options.className + " a.cursor {cursor: row-resize;display:block;position:absolute;left:0;top:0;width:" + containerSize/contentSize*100 + "%;height:100%;background-color:#069}");
		rules.push("." + options.className + " .cursorBody {display:block}");
		rules.push("." + options.className + " {min-height:10px;width:100%;background-color:#eee;overflow:hidden}");
		
		if(options.horizontal){
		    rules.push("." + options.className + " .left {float:left;display:block;min-width:10;height:100%;background-color:#999}")
		    rules.push("." + options.className + " .right {float:right;display:block;min-width:10;height:100%;background-color:#999}")
		    rules.push("." + options.className + " .barLeftEnd {float:left;display:block}")
		    rules.push("." + options.className + " .barRightEnd {float:right;display:block}")
		    rules.push("." + options.className + " .cursorLeftEnd {float:left;display:block}")
		    rules.push("." + options.className + " .cursorRightEnd {float:right;display:block}")
		    
		}else{
		    rules.push("." + options.className + " .top {display:block;min-width:10;background-color:#999;position:absolute;top:0px;min-height:10px;width:100%;height:auto}")
		    rules.push("." + options.className + " .bottom {display:block;min-width:10;height:100%;background-color:#999;position:absolute;bottom:0px;min-height:10px;width:100%;height:auto}")		    
		    rules.push("." + options.className + " .barTopEnd {display:block}")
		    rules.push("." + options.className + " .barBottomEnd {display:block;position:absolute;bottom:0;left:0}")
		    rules.push("." + options.className + " .cursorTopEnd {display:block}")
		    rules.push("." + options.className + " .cursorBottomEnd {display:block;width:100%}")
			    
		    rules.push("." + options.className + "{width:auto;min-width:10px;height:" + containerSize + "px;position:relative}")
		      
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


// Autoscroll plugin
(function($){
	$.fn.autoScroll=function(){
		var thisObj=$(this);	    		
		
		thisObj.parent().css({"overflow":"hidden"});
		thisObj.mousemove(function(e){
			
			var cont=$(this.parentNode),
			contHeight=cont.innerHeight(true),
			contWidth=cont.innerWidth(true);
			
			var rtl=thisObj.parents("div.rtl").length>0;					
			
			var deltaH=thisObj.outerHeight(true)-contHeight,
			    //deltaW=thisObj.outerWidth(true)-contWidth,
				deltaW=thisObj.get(0).clientWidth-contWidth,
			    top=e.clientY-cont.offset().top,
			    left=e.clientX-cont.offset().left;
			
			var y=top*100/contHeight;
			var x=left*100/contWidth//-(rtl?contWidth:0);
						
			var rtlDelta=rtl?($.browser.webkit?0:deltaW):0
			
			cont.scrollTop((deltaH*y/100));
			
			if($.browser.msie){
				if(rtl){
					cont.scrollLeft(deltaW-(deltaW*x/100));
				}else{
					cont.scrollLeft((deltaW*x/100));
				}
			}else{
				cont.scrollLeft((deltaW*x/100)-rtlDelta);
			}

			
		})
		
		return thisObj;
	}
})(jQuery);


// gently scrolls the container to ensure the object is visible
(function($){
    $.fn.ensureVisibility=function(parent){
    parent.stop(true,true);
    
    var left=this.position().left-10,
    right=left+this.width()+20,
    top=this.position().top-10,
    bottom=top+this.height()+20;
    
    if (left<0){
	parent.animate({
	scrollLeft:parent.scrollLeft()+left
	},400)
    }
    
    if (right>parent.width()){
	parent.animate({
	scrollLeft:parent.scrollLeft()+(right-parent.width())
	},400)
    }
    
    if (top<0){
	parent.animate({
	scrollTop:parent.scrollTop()+top
	},400)
    }
    
    if (bottom>parent.height()){
	parent.animate({
	scrollTop:parent.scrollTop()+(bottom-parent.height())
	},400)
    }
}
})(jQuery);


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


(function($){
	$.fn.aleCalendar=function(options){
	
		var cal=$(this);
		
		defaults={
			date:new Date(),
			events:[],
			calEvents:[]
		};		
		
		//extending the default options
		$.extend(defaults,$.fn.aleCalendar.defaults,options)		
	
		cal.each(function(){
			var container=$(this);						
			var month=$("<div class='aleCalendarToolBar'></div>").appendTo(container);
			var content=$("<div class='aleCalendar'></div>").appendTo(container);
			
			// creating the	calendar toolBar
			drawToolBar()
			
			//creating the days view
			drawMonth()
			
		})
		
		var pluginObj={
			$objects:cal,
			setEvents:function(events){
				defaults.events=events;
				drawEvents();
			},
			calEvents:{
				dayClick:function(){}				
			}
			
		}
		
		return pluginObj;
		
				
		//tools		
		function drawToolBar(date){
			cal.each(function(){
				var container=$(this).children("div.aleCalendarToolBar");
				
				$("<a></a>")
					.addClass("prev")
					.attr({
						"href":"#prev",
						title:"previous"
					})
					.appendTo(container)
					.click(function(ev){
						ev.preventDefault()
						defaults.date.add({months:-1});
						$(this).siblings("p").text(defaults.date.litteralMonthYear("-"));
						drawMonth()
					})
					.append("<span>previous month</span>")
				
				$("<a></a>")
					.addClass("next")
					.appendTo(container)
					.attr({
						"href":"#next",
						title:"next"
					})
					.click(function(ev){
						ev.preventDefault();
						defaults.date.add({months:1});
						$(this).siblings("p").text(defaults.date.litteralMonthYear("-"));
						drawMonth()
					})					
					.append("<span>next month</span>")
					
				$("<p></p>")
					.text(defaults.date.litteralMonthYear("-"))
					.appendTo(container)
					

			})
		}
		
		function drawMonth(){
			var container=cal.children("div.aleCalendar");
			container.empty();
			
			var events=defaults.events,
				date=defaults.date;
						
			
			var startDate=new Date(date.shortAmericanDate()).add({days:(-date.getDate()+1)})
			var endDate=new Date(startDate).add({months:1});
			
			//making a note of the current displaying date, to be checked by drawEvents
			container.data("startDate",startDate)
			
			var daysUl=$("<ul class='daysNames'></ul>").appendTo(container)
			
			var ul=$("<ul class='days'></ul>").appendTo(container)
			
			//adding the days names
			for(var x=0;x<7; x++){
				$("<li><span>" + _calWeekday[Iol.docLanguage][x] + "</span></li>").appendTo(daysUl);
			}
			
			//creating some "empty" days coming from the previous month
			var daysToAdd=startDate.getEuropeanDay()||7;
			
			var daysHtml="<li><span>...</span></li>";
			var str="";
			for(var x=0;x<daysToAdd;x++){
				str+=daysHtml;
			}
			
			$(str).appendTo(ul)
										
			var todayId=(new Date()).shortDate("_");
			
			//creating the days list
			var day=new Date(startDate);
			var count=0;
			var dayId=null;
			while(day<endDate){
				count++;
				dayId=day.shortDate("_");
				var li=$("<li></li>")
					.attr({className:(dayId==todayId)?"today":""})
					.data("dayId",dayId)
					.appendTo(ul);
				$("<a href='#showEvent'>" + day.getDate() + "</a>")
					.hover(function(){
						var evNum=$(this).closest("li").data("events").length;
						this.title=evNum + (evNum==1?" event":" events");
					})
					.click(function(ev){
						ev.preventDefault();
						var li=$(this).closest("li");
						
						//firing the dayCick event!
						defaults.calEvents.dayClick({						
							date:li.data("dayId").replace(/_/g,"/"),
							events:li.data("events")||[]
						})						
					}).appendTo(li);
				day.add({days:1})
			}				
			
			//calculating the remaining "empty" days to draw
			var daysLeft=(7-(daysToAdd+count)%7);
			daysLeft=daysLeft<7?daysLeft:0;
			var daysHtml="<li><span>...</span></li>";
			var str="";
			for(var x=0;x<daysLeft;x++){
				str+=daysHtml;
			}
			
			$(str).appendTo(ul)
								
			return drawEvents(events);
		}
		
		function drawEvents(){
			
			var events=defaults.events;
			if(events.length==0) return pluginObj;			
			
			cal.each(function(){
				var container=$(this).children("div.aleCalendar");
				
				//getting the first day of the displaying month
				var startDate=container.data("startDate");
				//getting the first day of the next month
				var endDate=new Date(startDate).add({months:1});
				
				
				var lis=container.find("ul.days li");
				
				$.each(events,function(index,item){
					var itemDate=item.when;
					var event=item;
					
					if (itemDate>=startDate && itemDate<=endDate){
						var dayId=itemDate.shortDate("_");
						lis.each(function(index,item){
							var $this=$(this)
							if($this.data("dayId")==dayId){
							    var evArray=$this.data("events")||[];
							    //adding the event to the day events list
							    evArray.push(event);
							    $this.data("events",evArray);
							    $this.addClass("hasEvent");							
							}
						})
					}
				})			
			})
			
			return pluginObj;
			
		}		
	}
})(jQuery);



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
							
							if (jumpSize==0){
								return false;
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