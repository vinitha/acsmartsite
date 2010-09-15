/* Author: 
	Alessio Carnevale
*/

//http://gdata.youtube.com/feeds/base/users/clubenergize/uploads?orderby=updated&alt=json&v=2&client=ytapi-youtube-rss-redirect



var videosLibrary={         
	play_01:'<object id="vp1YsKQy" width="432" height="240" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param name="movie" value="http://static.animoto.com/swf/w.swf?w=swf/vp1&e=1284551291&f=YsKQyMSkmj3ezdfk5NRMoQ&d=63&m=b&r=w&i=m&options=autostart"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed id="vp1YsKQy" src="http://static.animoto.com/swf/w.swf?w=swf/vp1&e=1284551291&f=YsKQyMSkmj3ezdfk5NRMoQ&d=63&m=b&r=w&i=m&options=autostart" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="432" height="240"></embed></object>'
}


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
	
	// the vertical menu items
	$("#videos ul.videosList a").click(function(ev){
		ev.preventDefault();
		var index=parseInt(this.className.replace("btn_",""));
		
		var $this=$(this);
		
		$this.closest("ul").find("li").removeClass("current")
		$this.closest("li").addClass("current")
		
		sections.goTo(index);
		players.currentPanel.find("img")
			.show(0)
			.siblings().remove();
			
		players.goTo(index)
		
		return false;	
	});
	
	// video player placeholders
	$("#videoPlayer a").click(function(ev){
		ev.preventDefault();
		
		var $this=$(this);
		$this.find("img").hide(0);
		var playerCode=this.hash.replace("#","");
		
		$(videosLibrary[playerCode]).appendTo(this);
		
		return false;
	})
})