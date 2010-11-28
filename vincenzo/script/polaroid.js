// JavaScript Document


(function($){
		  
	$.fn.polaroid = function(){
		var anchors=$("a[rel]",this)
			.each(function(i){
				$(this).click(function(){
					$.fn.polaroid.drawPictures(anchors,i)				
				})													   
			})
	};
	
	$.fn.polaroid.drawPictures=function(anchors,index){
		
		//adding the BG
		var bg=$("<div />")
			.attr("id","polaroidGB")
			.css({"background-color":"#900",position:"absolute",top:"0px",left:"0px",width:"100%",height:document.body.scrollHeight,display:"none",opacity:0.6})
			.appendTo("body")
			.fadeIn(300)
			
		var container=$("<div />")
			.attr("id","polaroidContainer")
			.css({position:"absolute",top:"0px",left:"0px",width:"100%",height:$("body").innerHeight()})
			.click(function(){
				$(this).remove();
				bg.fadeOut(300)
			})
			.appendTo("body")
			.fadeIn(300)
		
		anchors.each(function(i){
			var img=new Image

			img.onload=function(){

				var el = $("<canvas height='" +(img.height+200) + "' width='" + (img.width+200) + "' />")
				.click(function(e){
						this.style.zIndex="";
						var next=$(this).next();
						if(next.length==1){
							next.css({"z-index":1000});
						}else{
							container.find("canvas").eq(0).css({"z-index":1000});
						}
						
						e.preventDefault();
						return false;
				})						
				.get(0);
				el.index=i;
				
				if($.browser.msie){
					G_vmlCanvasManager.initElement(el);
				}

				$(el).css({position:"absolute",left:"10px",top:"10px"}).prependTo(container)

				if(i==index) el.style.zIndex=1000;
				
				var ctx = el.getContext('2d');	
				ctx.rotate(0.05-Math.random()/10);
		        ctx.fillStyle = "rgb(250,250,250)";
		        ctx.fillRect (50, 50, img.width+10,img.height+40);
				ctx.drawImage(img, 55, 55);				
			}
			img.src=this.href
			
		})
		
			
	}
})(jQuery)
	
/*
    var ctx = document.getElementById('canvas').getContext('2d');
    var img = new Image();
    img.onload = function(){
      ctx.drawImage(img,0,0);
      ctx.beginPath();
      ctx.moveTo(30,96);
      ctx.lineTo(70,66);
      ctx.lineTo(103,76);
      ctx.lineTo(170,15);
      ctx.stroke();
    }
    img.src = 'images/backdrop.png';
*/