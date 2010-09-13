/* Author: 
	Alessio Carnevale
*/

//http://gdata.youtube.com/feeds/base/users/clubenergize/uploads?orderby=updated&alt=json&v=2&client=ytapi-youtube-rss-redirect


//document ready
$().ready(function(){
	
	var sections=$("#details").aleCarousel({
		transitionFx:"slide",
		speed:800
	})
	
	var players=$("div.players").aleCarousel({
		transitionFx:"swap",
		speed:800		
	})	
	
	$("#videos ul.videosList a").click(function(ev){
		ev.preventDefault();
		var index=parseInt(this.className.replace("btn_",""));
		
		var $this=$(this);
		
		$this.closest("ul").find("li").removeClass("current")
		$this.closest("li").addClass("current")
		
		sections.goTo(index)
		players.goTo(index)
		
		return false;	
	})
})