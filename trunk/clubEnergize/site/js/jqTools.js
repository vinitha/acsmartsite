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
    $.fn.aleCarousel=function(options){
	var el=this;
	
	var defaults={
		transitionFx:"fade",
		duration:2000,
		speed:1200,
		autostart:false,
		events:{
		    start:function(){},
		    stop:function(){},
		    beforeChange:function(){},
		    change:function(){},
		    pause:function(){}
		}
	};
	//extending the default options
	$.extend(defaults,options)
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
		})
	    	 
	//making a note of the panel index
	LIs.each(function(i){$(this).data("index",i)})
		
	var pluginObj={
	    $objects:el,
	    currentPanel:null,
	    nextPanel:null,
	    start:function(){
			if (!intervalHnd){										
				intervalHnd=setInterval(function(){defaults.transitionFx.call(pluginObj)},defaults.duration);								
			}
			
			defaults.events.start.call(pluginObj);		
			return pluginObj
	    },
	    pause:function(){
			clearInterval(intervalHnd);	
			intervalHnd=null;
			
			defaults.events.pause.call(pluginObj);
			return pluginObj
	    },
	    goTo:function(panelIndex,trFx){
		
			if (pluginObj.currentPanel.data("index")==panelIndex) return pluginObj;
			
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);
			ul.stop(true,true);
			
			pluginObj.nextPanel=LIs.eq(panelIndex);
			if(trFx){
				trFx=eval(trFx);
				trFx.call(pluginObj);
			}else{
				defaults.transitionFx.call(pluginObj);
			}
			return pluginObj
	    },
	    next:function(){
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);							
			ul.stop(true,true);
			
			defaults.events.transitionFx.call(pluginObj);
			return pluginObj
	    },
	    previous:function(){
			pluginObj.nextPanel=this.currentPanel.prev().length>0?this.currentPanel.prev():this.currentPanel.nextAll(":last");
			
			pluginObj.currentPanel.stop(true,true);
			pluginObj.nextPanel.stop(true,true);	
			ul.stop(true,true);
			
			defaults.transitionFx.call(pluginObj);
			
			return pluginObj
	    }
	};
	
	pluginObj.currentPanel=LIs.eq(defaultIndex).css("z-index",2).css({display:"block",position:"static"});
	pluginObj.nextPanel=pluginObj.currentPanel.next().length>0?pluginObj.currentPanel.next():pluginObj.currentPanel.prevAll(":last");
	
	ul.css("height","auto");
	
	if(defaults.autostart){pluginObj.start()}
	
	return pluginObj
    
    
    
    
	//transitionFx definitions
	function slide(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel
		    .css("z-index",2)
		    .show(0);
							    
	    var viewportWidth=this.nextPanel.height();
	    ul.animate({"height":this.nextPanel.height()},defaults.speed);	    	    
	    
	    this.currentPanel.css("position","absolute")
		
		if(this.nextPanel.data("index")<this.currentPanel.data("index")){
			this.nextPanel.css("top",-ul.height());
			
			this.currentPanel.animate({"top":viewportWidth},defaults.speed,function(){$(this).css("z-index",0).hide(0)})
			this.nextPanel.animate({"top":0},defaults.speed,function(){
				defaults.events.change.call(thisObj);
				thisObj.currentPanel.css("position","static")
				ul.css("height","auto")
			})										
		}else{
			this.nextPanel.css("top",ul.height());
			
			this.currentPanel.animate({"top":-viewportWidth},defaults.speed,function(){$(this).css("z-index",0).hide(0)})
			this.nextPanel.animate({"top":0},defaults.speed,function(){
				defaults.events.change.call(thisObj);
				thisObj.currentPanel.css("position","static")
				ul.css("height","auto")
			})										
		}
		
					
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last")
																    
	}
						
	function fade(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel.css("z-index",2);
	    
	    var viewportWidth=this.nextPanel.height();
	    ul.animate({"height":this.nextPanel.height()},defaults.speed);
	    
	    this.currentPanel.css("position","absolute");
	    this.currentPanel.fadeOut(600,function(){$(this).css("z-index",0)})
	    this.nextPanel.fadeIn(defaults.speed,function(){
			defaults.events.change.call(thisObj);
			thisObj.currentPanel.css("position","static")
			ul.css("height","auto")
	    })						
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last")

	}					
	
	function swap(){
	    var thisObj=this;
	    
	    defaults.events.beforeChange.call(this);
	    this.currentPanel.css("z-index",1);
	    this.nextPanel
		    .css("z-index",2)
		    .show(0);
							    
	    var viewportWidth=this.nextPanel.height();
	    
	    ul.animate({"height":this.nextPanel.height()},defaults.speed);
	    
	    this.nextPanel.css("top",-viewportWidth);
	    this.currentPanel.css("position","absolute");
	    this.currentPanel.animate({"top":-viewportWidth},defaults.speed,function(){$(this).css("z-index",0).hide(0)})
	    this.nextPanel.animate({"top":0},defaults.speed,function(){
			defaults.events.change.call(thisObj);
			thisObj.currentPanel.css("position","static")
			ul.css("height","auto")
	    })						
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;			
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last")

	}
	
	function snap(){	    
	    defaults.events.beforeChange.call(this);
	    
	    ul.css("height","auto")
	    
	    this.currentPanel.css("z-index",1);
	    this.nextPanel.css("z-index",2);
	    
	    this.currentPanel.css("position","absolute");
	    var viewportWidth=this.nextPanel.height();
	   	    
	    
	    this.currentPanel.hide(0)
	    this.currentPanel.css("z-index",0)
	    this.nextPanel.show(0)
	    
	    
	    
	    //setting the new current and next panel
	    this.currentPanel=this.nextPanel;		
	    this.nextPanel=this.currentPanel.next().length>0?this.currentPanel.next():this.currentPanel.prevAll(":last")
	    
	    this.currentPanel.css("position","static")
	    defaults.events.change.call(this);
	}	    
    }
    
})(jQuery);
