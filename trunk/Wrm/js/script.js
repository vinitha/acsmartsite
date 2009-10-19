
$().ready(function(){
	Wrm.init();
	$("#addRoom").click(function(){
		Wrm.registry.addRoom({container:$(".rooms")}).show({container:$(".rooms")})
	})
})


$().load(window.applicationCache.update)

var Wrm={
	name:"Da Gigino!",
	registry:null,	
	init:function(){		
		
		if (!navigator.onLine){
			$("body").addClass("offLine");			
			Wrm.registry=eval(localStorage.registry);
			if(Wrm.registry && Wrm.registry.menu){
				Wrm.registry.menu.show($("#menu"));								
			}		
		}else{
			$.ajax({
				url:"registry.txt",
				type:"get",
				success:function(data){
					Wrm.registry=data;
					if(Wrm.registry && Wrm.registry.menu){
						Wrm.registry.menu.show($("#menu"));								
					}else{
						Wrm.registry=new registry({name:"Da Alessio!",rooms:[]})
						Wrm.registry.menu.show($("#menu"));
					}
				},
				error:function(e){
					$("body").addClass("offLine");			
					Wrm.registry=eval(localStorage.registry);
					if(Wrm.registry && Wrm.registry.menu){
						Wrm.registry.menu.show($("#menu"));								
					}
				}
			})
		};
		
		
	},
}
