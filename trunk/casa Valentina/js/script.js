$().ready(function(){
    
    $(".carousel").each(function(){
        var $this=$(this);
        if($this.hasClass("fast")){
            $this.find("ul").aleCarousel({
                duration:6000,
                speed:1200,
                transitionFx:"fade"
            });
        }else{
            $this.find("ul").aleCarousel();    
        }
        
    }) 

})