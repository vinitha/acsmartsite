/*  Author: 
    Alessio Carnevale
*/


//sortableTree drag&drop
(function(){
    var highlighter=null;
    
    $().ready(function(){
        
        //defining the base style for the highlighter.
        var rules=[];
        rules.push("._highlighter {position:absolute;border-bottom:1px dotted #069;display:none}");
        rules.push("._multi {border:1px dotted #069}");
        
        $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");        
        
        highlighter=$("<div />").addClass("_highlighter").appendTo(document.body);
        
        $(".sortableTree a")
        .click(function(){
            alert("click!")
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
            setTimeout(function(){
                ghostDiv.css({left:(ev.pageX) + 15});
                ghostDiv.show(0);
                $this.closest("div.sortableTree").addClass("dragging")
                }
            ,200)
            
            //customising the ghostDiv content
            $this.find("span").clone().appendTo(ghostDiv);
            
            ev.preventDefault();
        })
    })
    
    
    function onItemMove(ev){
        
       //var pos=ev.data.clickPos;
       //ev.data.ghostDiv.css({left:(ev.pageX)+pos.elemLeft})
       
        var elem=$(document.elementFromPoint(ev.pageX, ev.pageY));
 
        var li=elem.closest("a")
        
        if (li.length>0){
            var liPos=li.offset();
            if(li.find("ol").length>0){
                //has children
                highlighter.css({left:liPos.left,top:liPos.top,width:li.innerWidth(),height:li.innerHeight()}).addClass("_multi").show(0);          
            }else{
                highlighter.css({left:liPos.left,top:liPos.top+li.innerHeight(),width:li.innerWidth(),height:1}).removeClass("_multi").show(0);            
            }            
        }else{
            highlighter.hide(0);
        }
       
       return {left:ev.pageX+15};
    }
    
    function onDrop(ev){
        ev.data.target.closest("div.sortableTree").removeClass("dragging");
        highlighter.hide(0);
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
    //defining the base style for the ghostDiv.
    var rules=[];
    rules.push("._ghostDiv {position:absolute;background-color:#eee}");
    
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
                    .fadeTo(0,0.7)
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
        ev.data.onDrop(ev);
    }

    
})();









