/* Author: 
Alessio Carnevale
*/


//sortableTree drag&drop
(function(){
    $().ready(function(){
        $(".sortableTree a")
        .click(function(){
            alert("click!")
        })
        .mousedown(function(ev){
            var $this=$(this);
            
            //enabling the drag&drop for this element. It returns the ghostDiv by default
            var ghostDiv=_dragStart.call(this,ev,onItemMove, onDrop);
            
            //hiding it to allow the click event
            ghostDiv.hide(0);
            
            //displaying it after 200/1000 of a sec
            setTimeout(function(){
                //ghostDiv.css({left:(ev.pageX)+$this.offset().left});
                ghostDiv.show(0);
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
    }
    
    function onDrop(ev){
    }

})();






// drag & drop function.
// No need to customise beyond this line
(function(){
    //defining the base style for the ghostDiv.
    var rules=[];
    rules.push("._ghostDiv {position:absolute;background-color:#eee;cursor:move!important;opacity:0.8;filter:alpha(opacity=80);}");
    
    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");
    
    //encapsulating all the functions but this one.
    window._dragStart=function (ev,moveFunc,onDrop){
        var $this=$(this)
        
        var clickPos={};
        
        clickPos.left=ev.pageX;
        clickPos.top=ev.pageY;
        clickPos.elemLeft=$this.offset().left;
        clickPos.elemTop=$this.offset().top;
    
        var ghostDiv=$("<div />")
                    .addClass("_ghostDiv")
                    .css({left:$this.offset().left,top:$this.offset().top,width:$this.innerWidth(),height:$this.innerHeight()})
                    .appendTo(document.body);
                    
        $(document).bind("mousemove",{target:$this,clickPos:clickPos,moveFunc:moveFunc,ghostDiv:ghostDiv},_dragging);										
        $(document).bind("mouseup",{target:$this,clickPos:clickPos,onDrop:onDrop,ghostDiv:ghostDiv},_dragStop);
        
        //creating and returning the ghostDiv
        return ghostDiv
    }
    
    
    function _dragging(ev){
        ev.preventDefault();
        
        var pos=ev.data.clickPos;
        
        var newpos={
            left:(ev.pageX-pos.left)+pos.elemLeft,
            top:(ev.pageY-pos.top)+pos.elemTop
        };
        
        ev.data.ghostDiv.css({left:newpos.left,top:newpos.top})
        
        ev.data.moveFunc(ev);    
    }
    
    function _dragStop(ev){

        $(document).unbind("mousemove",_dragging);
        $(document).unbind("mouseup",_dragStop);
        
        ev.data.ghostDiv.remove();
        ev.data.onDrop(ev);
    }

    
})();









