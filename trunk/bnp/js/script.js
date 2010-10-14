/* Author: 
    Ixxus - Alessio Carnevale
*/


$().ready(function(){
    BNP.init(); 
});

var BNP={
    init:function(){
 
        //horMenu events handler
        $("nav.horMenu").find("li.root.hasChildren")
        .mouseenter(function(){
            $(this).addClass("hover")
        })
        .mouseleave(function(){
            $(this).removeClass("hover")
        })   

            
            
        // removing the expired content
        $(".dateCheck").each(function(){
            var start=new Date(toDate(this.getAttribute("data-start"))),
                end=new Date(toDate(this.getAttribute("data-end"))),
                now=new Date();
                
            if (now<start || now>end){
                $(this).remove();
            }
        });
        
        (function(){
            //checking the maxItems attribute
            var container=$(".maxItems");
            var maxItems=parseInt(container.attr("data-maxItems"))-1;
            container.children(":gt(" + maxItems + ")").remove();
        })();
        
        
        (function(){
            // tabbedContent module //
            $("div.tabbedContent").each(function(){
                var $this=$(this);
                var fx=$this.hasClass("charts")?"swap":"fade";
                
                var carousel=$this.children("div.tabsContent").find("ul.contentUl").aleCarousel({speed:600,transitionFx:fx}),      
                    btnsUl=$this.children("ul.tabsUl");
                
                // making a note of the carousel object; this will be used by the click event handler and
                // to open a panel directly after the page has been loaded.
                var cObj={"carousel":carousel,"showPanel":showPanel};
                $this.data("data-carousel",cObj);                
                
                //setting the default classes (first, active) for the li elements
                btnsUl.children("li:first").addClass("first active");
                
                //setting the buttons click handler
                btnsUl.find("a").each(function(index,item){
                    //setting the button data
                    $(item)
                        .click(function(){
                            carouselObj=$(this).closest("div.tabbedContent").data("data-carousel")
                            showPanel(carouselObj.carousel,this.hash,this);
                            return false;
                        });
                });        
            });
            
            function showPanel(carousel,hash,btn){
                if(btn){
                    $(btn).closest("li").addClass("active").siblings().removeClass("active");
                    carousel.goTo($(hash));
                }else{
                    if(typeof(has)=="string"){
                        var btn=$.map(carousel.$objects.closest("div.tabbedContent").find("ul.tabsUl a"),function(item, index){
                            return (item.hash==hash)?$(item):null;
                        })
                        
                        if(btn.length>0){
                            btn[0].closest("li").addClass("active").siblings().removeClass("active");
                            carousel.goTo($(hash));
                        }                        
                    }else{
                        var btn=carousel.$objects.closest("div.tabbedContent").find("ul.tabsUl a").eq(hash-1)
                        if(btn.length>0){
                            btn.closest("li").addClass("active").siblings().removeClass("active");
                            carousel.goTo(hash-1);
                        }                                                
                    }

                    
                }
                
            }
        })();
        
        
        //cheking the current url to see if we have to open a specific panel of the tabbedContent
        if(location.search){
            var tabIndex=location.search.replace("?","").split("&");
            for(var x=0; x<tabIndex.length;x++){
                
                var arr=tabIndex[x].split("=");
                var varName=arr[0],
                    varVal=arr[1];
                    
                    if (varName=="tabIndex"){
                        tabIndex=varVal;
                        break;
                    }                
            }
            
            var cObj=$("div.bodyContent div.tabbedContent").data("data-carousel");
            cObj.showPanel(cObj.carousel,tabIndex)
        }
        
        // accordionMenu module //
        $("div.accordionMenu").each(function(){
            var $this=$(this);
            var li=$this.find("li.level1");
            
            //hiding the submenus
            $this.find("ul.subUl").hide(0);
            
            //activating the first item of the accordion
            li.eq(0).addClass("active").find(".subUl").show(0);
            
            li.children("a.expBtn").click(function(){
                var $this=$(this);
                
                $this
                    //setting the "active" class name / expanding 
                    .parent("li").addClass("active").siblings(".active").removeClass("active")
                    //expanding/shrinking the subMenu
                    .find("ul.subUl").slideUp(300);
                
                $this.siblings("ul").slideDown(300);
                return false;
            });        
        });
        
        // styiling the table
        $("table tr:odd").addClass("odd");
        
        //imageCarousel
        $(".imgCarousel ul").aleCarousel({duration:7000,speed:2000,autostart:true,transitionFx:"slide"});
        
        //mainCarousel
        $(".mainCarousel ul").aleCarousel({duration:10000,speed:2500,autostart:true,transitionFx:"fade"});
        
        
        //footer-links    
        $("#footer").find("a.footer-link").each(function(){    
            if (this.target=="_blank"){
                $(this).click(function(){            
                    style = 'help=no,status=no,location=no,width=520,height=500,menubar=no,scrollbars=no,toolbar=no,resizable=no,directories=no';
                    var mywin = window.open(this.href, '', style);            
                    mywin.focus();                
                    return false;                
                });
            }else{
                $(this)
                    .click(function(){
                        $(this.hash).toggleClass("click");
                        return false;
                    })
                    .hover(                    
                        function(){                        
                            $(this.hash).addClass("hover");
                        },
                        function(){
                            $(this.hash).removeClass("hover");
                        }
                    );
            }
        });       
    }
}


