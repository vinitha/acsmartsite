

$().ready(function(){
    //initialising the widget
    $(".fashionSlideShow a").click(function(e){
        e.preventDefault();
        
        var imgURLs=$(this).getJsonComment();
        
        //preloading the first image
        var tmpImg=new Image();
        tmpImg.onload=function(){
            var container=$("<div />")
                .addClass("slideContainer")
                
            var main=$("<img />")
                .addClass("main")
                .appendTo(container)
                .attr("src",tmpImg.src)
                
            var ul=$("<ul/>").appendTo(container)
            
            $.each(imgURLs,function(){
                $("<li/>").append(
                    $("<a href='#show' />")
                        .click(function(e){
                            e.preventDefault();
                            var $this=$(this)
                            var main=$this.closest("div.slideContainer").children("img.main");
                            main.attr("src",$this.children("img").attr("src"))
                        })
                        .append(
                            $("<img/>").attr("src",this)
                        )                        
                ).appendTo(ul)
            })
            
            container.lightBox({
                width:600,
                onShow:function(){
                    addScrollBar({
                        elemToScroll:ul,
                        horizontal:true,
                        className:"fashionBar"
                    })
                }
            })
            .show();
            
            
        };
        tmpImg.src=imgURLs[0];
        

    })
})