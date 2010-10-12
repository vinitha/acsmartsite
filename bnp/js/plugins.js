
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
			
			defaults.events.transitionFx.call(pluginObj);
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
	
	if(defaults.autostart){pluginObj.start();}
	
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
    }
})(window.jQuery);


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

function toDate(str){
    return eval("new Date(" + str + ")" ).add({"months":-1});
};