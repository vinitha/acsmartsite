/*  Author: 
    Alessio Carnevale
*/


//sortableTree drag&drop
(function(){
    var highlighter=null;
    var draggHandler=null;
    
    $().ready(function(){
        
        //defining the base style for the highlighter.
        var rules=[];
        rules.push("._highlighter {position:absolute;border-bottom:2px dotted #069;display:none}");
        rules.push("._multi {border:2px dotted #069}");
        
        $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");        
        
        highlighter=$("<div />").addClass("_highlighter").appendTo(document.body);
        
        $(".sortableTree a")
	.live("mouseenter",function(){
	    var $this=$(this);
	    if ($this.hasClass("folder")){
		$(this).addClass("hover");
	    }
	    
	})
	.live("mouseleave",function(){
	    $(this).removeClass("hover");
	})
        .click(function(){
	    clearTimeout(draggHandler);
           $this.closest("div.sortableTree").removeClass("draggedItem");
        })
        .mousedown(function(ev){
            var $this=$(this);
            
            //enabling the drag&drop for this element. It returns the ghostDiv by default
            var ghostDiv=dragIt({
                dragItem:$this.closest("li"),
                mouseEvent:ev,
                onMove:onItemMove,
                onDrop:onDrop,
                constrain:null      // hor|ver
            });
            
            //hiding it to allow the click event
            ghostDiv.hide(0);
            
            //displaying it after 2/10 of a sec
            draggHandler=setTimeout(function(){
		//setting the style for the item to be dragged
		$this.addClass("draggedItem");

                ghostDiv.css({left:(ev.pageX) + 15});
                ghostDiv.show(0);
                $this.closest("div.sortableTree").addClass("dragging")
                }
            ,200)
	    
            //customising the ghostDiv content
            $this.closest("li").clone().appendTo(ghostDiv);
            
            ev.preventDefault();
        })
    })
    
    
    function onItemMove(ev){
        
       //var pos=ev.data.clickPos;
       //ev.data.ghostDiv.css({left:(ev.pageX)+pos.elemLeft})
       
        var elem=$(document.elementFromPoint(ev.pageX, ev.pageY));
	
	//checking if we have to drop the item before or after the hovered one
	var after=(ev.pageY>elem.offset().top+elem.innerHeight()/2);
	
        var li=elem.closest("li");
        
        if (li.length>0){
            var liPos=li.offset();
            if(li.find("ol").length>0){
                //has children
                //highlighter.css({left:liPos.left,top:liPos.top-1,width:li.innerWidth(),height:li.innerHeight()}).addClass("_multi").show(0);
		highlighter.hide(0);
            }else{
		if (after){
		    highlighter.css({left:liPos.left,top:liPos.top+li.innerHeight()-1,width:li.innerWidth(),height:1}).removeClass("_multi").show(0);            
		}else{
		    highlighter.css({left:liPos.left,top:liPos.top-1,width:li.innerWidth(),height:1}).removeClass("_multi").show(0);            
		}
                
            }            
        }else{
	    if(!elem.hasClass("_highlighter")){
		highlighter.hide(0);
	    }
            
        }
       
       return {left:ev.pageX+15};
    }
    
    function onDrop(ev){
        var elem=$(document.elementFromPoint(ev.pageX, ev.pageY));
        var li=elem.closest("li");
	
	ev.data.target.children("a").removeClass("draggedItem")
        
        var div=ev.data.target.closest("div.sortableTree").removeClass("dragging");
        highlighter.hide(0);
        
	//
	//checking if we have to drop the item before or after the hovered one
	var after=(ev.pageY>elem.offset().top+elem.innerHeight()/2);
	if (div){
	    var added=(after&&ev.data.target.insertAfter(li))?"":ev.data.target.insertBefore(li);
	}
	
        
    }

})();









//utilities
var realTypeOf=function(v) {
        if (typeof(v) == "object") {
        if (v === null) return "null";
        if (v.constructor == (new Array).constructor) return "array";
        if (v.constructor == (new Date).constructor) return "date";
        if (v.constructor == (new RegExp).constructor) return "regex";
                return "object";
        }
        return typeof(v);
};


// drag & drop function.
// No need to customise beyond this line
(function(){
	var dragging=false;
    //defining the base style for the ghostDiv.
    var rules=[];
    rules.push("._ghostDiv {position:absolute;background-color:#444;color:#fff;border:1px solid #ccc;}");
    rules.push("._ghostDiv li a{color:#fff;text-decoration:none}");
    rules.push("._ghostDiv {border-radius:10px;-moz-border-radius:10px;border-top-left-radius:0px;-moz-border-radius-topleft:0px;padding:10px;-moz-box-shadow:0px 2px 2px rgba(0,0,0,0.5);-webkit-box-shadow:0px 2px 2px rgba(0,0,0,0.5)}");
    rules.push("._ghostDiv li{list-style-type:none}");
    
    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");
    
    //encapsulating all the functions but this one.
    window.dragIt=function (options){
        var dragItem=options.dragItem;
            
        var $this=$(options.dragItem)
        
        var clickPos={};
        
        clickPos.left=options.mouseEvent.pageX;
        clickPos.top=options.mouseEvent.pageY;
        clickPos.elemLeft=$this.offset().left;
        clickPos.elemTop=$this.offset().top;
        
        //creating and returning the ghostDiv
        var ghostDiv=$("<div />")
                    .addClass("_ghostDiv")
                    .css({left:$this.offset().left,top:$this.offset().top,width:$this.innerWidth(),height:$this.innerHeight()})
                    .fadeTo(0,0.9)
                    .appendTo(document.body);
                    
        $(document).bind("mousemove",{target:$this,clickPos:clickPos,onMove:options.onMove,ghostDiv:ghostDiv,constrain:options.constrain},_dragging);										
        $(document).bind("mouseup",{target:$this,clickPos:clickPos,onDrop:options.onDrop,ghostDiv:ghostDiv},_dragStop);
        
        return ghostDiv
    }
    
    
    function _dragging(ev){
        ev.preventDefault();
        
        var pos=ev.data.clickPos;
        
        var newPos={
            left:(ev.pageX-pos.left)+pos.elemLeft,
            top:(ev.pageY-pos.top)+pos.elemTop
        };
        
        ev.data.newPos=newPos;
        
        //if the callback function returns false then don't move the item
        var callBackReturn=ev.data.onMove(ev);
        
        if (!callBackReturn){return false};
	dragging=true;
        
        if (realTypeOf(callBackReturn)=="object"){
            $.extend(newPos,callBackReturn)
        }
        
        switch(ev.data.constrain){
            case "hor":
                ev.data.ghostDiv.css({left:newPos.left})
            break;
            
            case "ver":
                ev.data.ghostDiv.css({top:newPos.top})
            break;
            
            default:
                ev.data.ghostDiv.css({left:newPos.left,top:newPos.top})
            break;
        }        
           
    };
    
    function _dragStop(ev){
	
        $(document).unbind("mousemove",_dragging);
        $(document).unbind("mouseup",_dragStop);
	ev.data.ghostDiv.remove();
        if(dragging){
		ev.data.onDrop(ev);
	}
	dragging=false;
    }

    
})();









