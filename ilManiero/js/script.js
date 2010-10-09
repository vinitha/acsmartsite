//myLightBox widget
(function($){

	var defaults={
		title:false,
		onClose:function(){},
		width:400,
		parent:null,
		rtl:false
	};
	
	var bg=null,
		lb=null,
		$this=null;
	
	$.fn.myLightBox = function(options) {		
		
		$this=this;
		
		//extending the default options
		$.extend(defaults,$.fn.myLightBox.defaults,options)
		
		defaults.parent=defaults.parent||this.parent();
		
		this.closeIt=function(){
		    return closing.call($this)
		};
		this.show=function(){return showing.call($this)};
		
		return this;
	};	
	
	
	// defining the plugin custom methods
	var closing=function(){
			bg.hide(0);
			lb.hide();			

			$this.appendTo(defaults.parent);
			//firing the close event
			defaults.onClose.call($this);
			
			return this;
	};
	
	var showing=function(){

		var thisObj=this;
		
		//get the background DIV (or create it)						
		bg=document.getElementById("myLightBoxBg");
		if(bg){
			bg=$(bg);
		}else{
			bg=$("<div id='myLightBoxBg'></div>")
				.appendTo("body")

			bg.click(function(){						
				thisObj.closeIt();
				return false;
			})				
		}

		
		bg	.fadeTo(0,0.5)
			.show();
		
		var mainContent=null;
		var lbTitle=null;
		
		// get the fore DIV (or create it)
		lb=document.getElementById("myLightBoxPanel");
		var closeBtn=null;
		
		if (lb){
			lb=jQuery(lb);
			mainContent=jQuery("div.mainContent",lb);
			lbTitle=jQuery("p.lbTitle",lb);
			closeBtn=lb.find("a.closeBtn");
		}else{
			lb=jQuery("<div id='myLightBoxPanel'></div>")
				.appendTo("body");						
			
			//handling the ESC button
			lb.keydown(function(e){
				if (e.keyCode==27){
					thisObj.closeIt();
					return false;
				}
			})				
			
			lbTitle=jQuery("<p class='lbTitle'></p>").appendTo(lb);
			mainContent=jQuery("<div class='mainContent'></div>")
							.attr("tabIndex",0)
							.appendTo(lb);
			
			var closeBtn=jQuery("<a href='#' class='closeBtn' title='close'></a>")
				.appendTo(lb)
				.keydown(function(e){
					if (e.which==9 && !e.shiftKey){
						lb.find("input:visible,a").not(".readonly").eq(0).focus()	
						return false;
					}
				})		
				.click(function(){						
					thisObj.closeIt.call(thisObj);
					return false;
				})
		}

		

		
		// handling the LB width and position
		lb.css({
		    width:defaults.width,
		    marginLeft:-defaults.width/2		    
		});
		
		// setting the reading direction class Name
		if (defaults.rtl){
		    lb.addClass("rtl");
		}else{
		    lb.removeClass("rtl");
		}
		
		
		lbTitle.text(defaults.title);
		lbTitle.css("display",defaults.title?"block":"none");
		//closeBtn.css("display",defaults.title?"block":"none");
		
		
		this.appendTo(mainContent)
		
		lb.css("visibility","hidden");
		
		lb.fadeIn(300,function(){
			lb.css({"margin-top":-mainContent.outerHeight()/2});
			lb.css("visibility","visible");
			//moving the focus to the close button
			closeBtn.focus();
			//lb.find("input, a").not(":hidden").eq(0).focus()

		});	
				
			

		return thisObj;
	}
		
})(jQuery);




$().ready(function(){
				   
	//auto default behaviour
	$("input[type='text'], textarea")
	.each(function(){
		this.baseValue=this.title;
		if(this.value=="") this.value=this.title;
	})
	.focus(function(){
				if (this.value==this.baseValue){
					this.value=""
				}
			})
	.blur(function(){
				if (this.value==""){
					this.value=this.baseValue;
				}				
			})
	
	
	// init
	$("div.home").fadeIn(1600);
	
	$("a.menu").click(function(){
		var sectionName=this.hash.replace("#","")
		
		var toOpen=$("." + sectionName);

		$(".section").not(toOpen).slideUp(600);
		toOpen.slideDown(600);
		
		var mTop=(sectionName=="home")?270:45;
		var mBot=(sectionName=="home")?50:33;
		$("#logo").animate(	{
								"margin-top":mTop,
								"margin-bottom":mBot
							},600)
		
		return false;
	})
	
	
	//lightBox
	$("ul.gallery").each(function(){
		$(this).find("a").lightBox();
	})
	
	//send us a message
	var modulo=$("#footer a.message").click(function(){
		$("#msg").myLightBox({
			width:290,
			onClose:function(){
				this.get(0).reset();
				
				//auto default behaviour
				$("#msg")
					.find("p.status").empty().end()
					.find("button").attr("disabled",false).end()
					.find("input[type='text'], textarea")
					.each(function(){
						this.baseValue=this.title;
						if(this.baseValue) this.value=this.baseValue;
					})	
					
			}
		}).show()
		return false;
	})
	
	$("#msg").submit(function(){
			
			var form=$(this);
			var status=form.find("p.status").removeClass("error"),
				sender=form.find(".sender"),
				nome=form.find(".nome"),
				textArea=form.find("textarea")
			
			
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test(sender.attr("value"))) {
				status.text('Indirizzo email non valido');
				status.addClass("error");
				sender.focus()
				return false;
			}
			
			
			if (textArea.attr("value")==textArea.get(0).baseValue) {
				status.text('Messaggio non valido');
				status.addClass("error");
				textArea.focus()
				return false;
			}			
			
			var myDate=new Date();
			var msg={
						message:textArea.attr("value"),
						sender:sender.attr("value"),
						nome:nome.attr("value"),
						dummy:myDate.getTime()
					}
			
			$.ajax({
				url:this.action,
				data:msg,
				dataType:"json",
				error:function(xhr,err){
					alert(xhr.statusText||err)
				},
				success:function(data){
					if (data.error){
						status.addClass("error")
					}
					
					status.text(data.message);		
					form.find("button").attr("disabled",true)
				}			
			})
			
			return false;
	
	})
	
})


var _gaq = _gaq || [];

$(window).load(function(){

		_gaq.push(['_setAccount', 'UA-18245819-1']);
		_gaq.push(['_trackPageview']);

		(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
		
	setTimeout(function(){
			$("img").each(function(){
				var $img=$(this)
				if ($img.attr("longdesc")){
					this.src=$img.attr("longdesc")	
				}
			})
		},500);		
})
