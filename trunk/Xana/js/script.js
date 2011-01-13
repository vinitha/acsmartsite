/* Author: 
    Alessio Carnevale
*/

$().ready(function(){
    //init. the Xana object
    Xana.init();
})


//here I initialise the widgets that need to wait for the images to be available in order to work properly
$(window).load(function(){

    //genericList
    (function(){
    
            //setting the generic lists behaviours
            var lists=$("div.genericList")

            //adding the custom scrollbars
            lists.each(function(){
                var $this=$(this);				    
                addScrollBar({
                        elemToScroll:$this.find("ul"),
                        horizontal:true,
                        className:"xanaBars",
                        barContainer:$this
                    })
            })
            
            //adding the "+ view" tooltip
            Xana.clickToView(lists.find("ul"),"+ view");    
            
            //init. the altViews widget
            $(".altViews a").click(function(e){
                e.preventDefault();
                
                var $this=$(this),
                    thisImg=$this.find("img"),
                    targetImg=$("#" + $this.attr("data-targetImg")).find("img"),
                    oldSrc=targetImg.attr("src");
                
                targetImg
                    .css("position","static")
                    .attr("src",thisImg.attr("src"));
                
                thisImg.attr("src",oldSrc);
            });    
    })();
    
    
    //setting the collection carousel up
    (function(){        
        var defaults={
            onScroll:function(){},
            className:"",
            scrollDuration:1000,
            scrollSize:1,
            pageOffset:20,
            showButtons:true,
            showPag:true,
            autoStart:false,
            slideDuration:7000
        }
        
        var collDiv=$("div.collectionCarousel"),
            collUl=collDiv.find("ul"),
            collLi=collUl.find("li");
                
            var width=0;
            collLi.each(function(){
                width+=$(this).outerWidth(true);
            })
            if(($.browser.msie && parseInt($.browser.version)<8)){
                width+=20;
            }
        
            collUl.css("width",width);
        
            collDiv.ixCarousel(defaults)
            
            //adding the "+ click to view" tooltip
            Xana.clickToView(collUl,"+ click to view");
                
    })();

})


var Xana={
    init:function(){
        
        //handling the tabMenu
        (function(){
            var anchorId=0;  //used to generate unique anchors ids
            $("ul.tabMenu").each(function(){
               var $ul=$(this);
               
               //creating the tabs hodler
               var tabsHolder=$("<ul class='tabs' />").insertBefore($ul);
               
               $ul.children().find(".tabCaption").each(function(){
                    anchor=anchorId++;
                    var $this=$(this);
                    
                    var active=$this.parent()
                        .attr("id","tabMenu_" + anchorId)       //setting a unique ID
                        .hasClass("active");
                        
                   
                    $this.find("a")
                        .attr("href","#tabMenu_" + anchorId)    //linking the tab href to the generated id
                        .click(function(e){
                            e.preventDefault();
                            var $li=$(this.hash);
                        
                            $li.siblings(".active").removeClass("active");
                            
                            $li.addClass("active");
                            
                            $(this).closest("li").addClass("active").siblings(".active").removeClass("active");
                        })
                   
                    $("<li/>")
                       .append(this)
                       .appendTo(tabsHolder)
                       .addClass(active?"active":"")
               })
               
               
           })       
        
        })();

        
        //adding the "+ click to view" tooltip to showCase links
        Xana.clickToView($("div.showCase").find("ul"),"+ click to view");
            
            
        //adding the scrollBars to freeText
        $(".freeText .container, .vScroll").each(function(){
            var $this=$(this);

            addScrollBar({
                    elemToScroll:$this,
                    horizontal:false,
                    className:"xanaBarsVer",
                    barContainer:null
                })
        });
        
        //init. the autoZoom widget
        (function(){
            var options={
                onLeave:function(){
                    var $this=$(this);                         
                    $this.animate({width:270,height:480,left:0,top:0},1000,function(){$(this).css({position:"static"})});                
                }
            }
            $(".autoZoom img")
                .mouseenter(function(){
                    var $this=$(this).stop(true);
                    
                    $this.css({width:540,height:960});                        
                })
                .autoScroll(options)
        })();
        

        //altView.sty02 autoscroll
        (function(){
            var options={
                onLeave:function(){
                    /*var $this=$(this);                         
                    $this.animate({left:0,top:0},5000,function(){$(this).css({position:"static"})});                */
                }
            }
        
            $("#bigImage img").autoScroll(options);
        })();
        
        
            
        //initialising the mainCarousel widget
        var settings={
            transitionFx:"fade",
            duration:6000,
            speed:1500,
            autostart:true,
            ieFix:($.browser.msie && parseInt($.browser.version)<7)?3:0,
            events:{
                start:Xana.homeCarousel.onStart,
                stop:Xana.homeCarousel.onStop,
                beforeChange:Xana.homeCarousel.onBeforeChange,
                change:Xana.homeCarousel.onChange,
                pause:Xana.homeCarousel.onPause
            }            
        };
        
        Xana.homeCarousel.element=$("div.mainCarousel ul");
        
        if(Xana.homeCarousel.element.length>0){
                
            //creating the mainCarousel pagination widget
            (function(){
                var nav=$("<ul />")
                    .addClass("navigator");
                
                //setting the pointer to the paginator obj
                Xana.homeCarousel.paginator=nav;
                    
                //adding the "prev" arrow button
                $("<a />")
                    .attr({
                        href:"#back",
                        title:"back",
                        className:"prev"
                    })
                    .click(function(){
                        Xana.homeCarousel.widget.pause();
                        Xana.homeCarousel.widget.previous();
                    })
                    .append(
                        $("<span />").text("<")
                    )
                    .appendTo($("<li />").appendTo(nav));            
                
                //adding all the pages numbers   
                Xana.homeCarousel.element.children().each(function(index,item){
                    $("<a />")
                        .attr({
                            href:"#"+index,
                            title:"Click!"
                        })
                        .click(function(){
                            Xana.homeCarousel.widget.pause();
                            Xana.homeCarousel.widget.goTo(this.hash.replace("#",""));
                        })                    
                        .append(
                            $("<span />").text(index+1)
                        )
                        .appendTo($("<li />").appendTo(nav)); 
                        
                })
                   
                //adding the "next" arrow button
                $("<a />")
                    .attr({
                        href:"#next",
                        title:"forward",
                        className:"next"
                    })
                    .click(function(){
                        Xana.homeCarousel.widget.pause();
                        Xana.homeCarousel.widget.next();
                    })
                    .append(
                        $("<span />").text(">")
                    )
                    .appendTo($("<li />").appendTo(nav));              
                    
                    
                nav.insertAfter(Xana.homeCarousel.element)            
            })();
            
            //setting the pointer to the carousel obj
            Xana.homeCarousel.widget=Xana.homeCarousel.element.aleCarousel(settings);
        }
        
    },
    
    
    //pointer to the carousel Obj
    homeCarousel:{
        element:null,
        widget:null,
        paginator:null,
        
        //carousel events handlers
        onStart:function(){
            var index=this.currentPanel.data("index");
            Xana.homeCarousel.paginator.find("li").eq(index+1).addClass("current");
            
        },
        onStop:function(){},
        onBeforeChange:function(){
            var index=this.nextPanel.data("index");
            Xana.homeCarousel.paginator.find("li").removeClass("current").eq(index+1).addClass("current");
        },
        onChange:function(){},
        onPause:function(){}
    },
    
    //function to add tooltips to anchors
    clickToView:function(obj,message){    
        obj.find("a").each(function(){
            var $this=$(this);
            
            $("<span />")
                .text(message)
                .appendTo(this)
                .hide(0);
                
            $this
                .focus(function(){
                    $(this).find("span").show(0)
                })
                .blur(function(){
                    $(this).find("span").hide(0)
                })
                .mouseenter(function(){
                    $(this).find("span").show(0)
                })
                .mouseleave(function(){
                    $(this).find("span").hide(0)
                })
        })         
    }
}
