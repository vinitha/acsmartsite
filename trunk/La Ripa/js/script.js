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
    
    
    
    
//send us a message
	var modulo=$("#infoReq").click(function(){
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
				status.text('Please correct the e-mail address');
				status.addClass("error");
				sender.focus()
				return false;
			}
			
			
			if (textArea.attr("value")==textArea.get(0).baseValue) {
				status.text('Please double-check the message');
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