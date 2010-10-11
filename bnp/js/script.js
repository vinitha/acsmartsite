/* Author: 
    Ixxus - Alessio Carnevale
*/

function iframeLoaded(){
    //autoheight behaviour for the iFrame
    this.style.height=$(this).contents().height() + "px";
}
$().ready(function(){
    
    //horMenu
    $("div.horMenu li.root")
        .mouseenter(function(){
            $(this).addClass("hover")
        })
        .mouseleave(function(){
            $(this).removeClass("hover")
        })
    // tabbedContent module //
    $("div.tabbedContent").each(function(){
        var $this=$(this);
        var fx=$this.hasClass("charts")?"swap":"fade";
        
        var carousel=$this.children("div.tabsContent").find("ul.contentUl").aleCarousel({speed:600,transitionFx:fx}),      
            btnsUl=$this.children("ul.tabsUl");
        
        //setting the default classes (first, active) for the li elements
        btnsUl.children("li:first").addClass("first active");
        
        //setting the buttons click handler
        btnsUl.find("a").each(function(index,item){
            //setting the button data
            $(item)
                .data("carousel",{obj:carousel,tabIndex:index})
                .click(function(){
                    var data=$(this).data("carousel");
                    data.obj.goTo(data.tabIndex);
                    
                    $(this).closest("li").addClass("active").siblings().removeClass("active");
                    return false;
                });
        });        
    });
    
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
});
