
/* Table Object definition */
	table=function(params){
		this.id=params.id;
		this.childrenIndex=0;
		this.htmlIds={};		
		
		this.billsHistory=[];
		this.currentBill=null;		
	}
	table.prototype.show=function(params){
		var htmlId=this.id + "_" + this.childrenIndex++;
		this.htmlIds[htmlId]=htmlId;
		
		var htmlContainer=$('<div class="table">').appendTo(container);
		$("<p>" + "Qui ci saranno il tavolo" + "</p>").appendTo(htmlContainer)
				
	}


/* Bill Object definition */
	bill=function(params){
		this.waiter=params.waiter||"";
		this.timeStamp=new Date().now();
		this.seats=params.seats||0;	
		this.dishes=[];
		this.tableId=params.tableId;
		
		this.htmlId=null;
	}
	
	bill.prototype.getTotal=function(){
		var tot=0;
		for(i in this.dishes){
			tot+=i.price;
		}
		return tot;
	}
	bill.prototype.show=function(params){
		$("<p>" + "Qui ci sara' la fattura" + "</p>")
			.attr(id,params.id)
			.appendTo(params.container)	
		this.htmlId=params.id;
	}
	
	
/* Dish object definition */
	dish=function(params){
		this.id=params.id;
		this.name=params.name||"Empty dish";
		this.description=params.description||"Please define this dish";
		this.price=params.price||0;
		
		this.htmlId=null;
	}
	dish.prototype.show=function(params){
		$("<p>" + "Qui ci sara' il piatto" + "</p>")
			.attr(id,params.id)
			.appendTo(params.container)
		this.htmlId=params.id;
	}
	
/* Menu object definition */
	menu=function(params){
		this.id=params.id;
		this.childrenIndex=0;
		this.dishes=params.dishes||[];		
		this.htmlIds={};		
	}
	menu.prototype.show=function(container){		
		var htmlId=this.id + "_" + this.childrenIndex++;
		this.htmlIds[htmlId]=htmlId;
		
		$("<p>" + "Qui ci sara' il menu" + "</p>")
			.attr("id",htmlId)
			.appendTo(container)
	}

/* Room object definition */
	room=function(params){
		this.id=params.id;
		this.childrenIndex=0;
		this.htmlIds={};		
		this.name=params.name;
		this.tables=params.tables||[];				
	}
	room.prototype.show=function(container){
		
		var htmlId=this.id + "_" + this.childrenIndex++;
		this.htmlIds[htmlId]=htmlId;
		
		var htmlContainer=$('<div class="room">')
			.attr("id",htmlId)
			.appendTo(container);
		for(tab in this.tables){
			html+=tab.show(htmlContainer);
		}

	}

/* Registry object definition */
	registry=function(params){
		this.name=params.name||"Ristorante - Da Paolino!";
		params.parent=this;
		this.menu=new menu(params);		
		this.rooms=params.rooms||[];
		this.currentRoom=params.rooms[0]||null;
		
		
		this.statistic={
			// define here some functions
		}
	};
	registry.prototype.addRoom=function(params){		
		params.parent=this;
		return this.rooms.push(new room(params))	
	}


















function cacheTest(){
	var cacheStatusValues = [];
	cacheStatusValues[0] = 'uncached';
	cacheStatusValues[1] = 'idle';
	cacheStatusValues[2] = 'checking';
	cacheStatusValues[3] = 'downloading';
	cacheStatusValues[4] = 'updateready';
	cacheStatusValues[5] = 'obsolete';
	
	var cache = window.applicationCache;
	cache.addEventListener('cached', logEvent, false);
	cache.addEventListener('checking', logEvent, false);
	cache.addEventListener('downloading', logEvent, false);
	cache.addEventListener('error', logEvent, false);
	cache.addEventListener('noupdate', logEvent, false);
	cache.addEventListener('obsolete', logEvent, false);
	cache.addEventListener('progress', logEvent, false);
	cache.addEventListener('updateready', logEvent, false);
	
	function logEvent(e) {
		var online, status, type, message;
		online = (navigator.onLine) ? 'yes' : 'no';
		status = cacheStatusValues[cache.status];
		type = e.type;
		message = 'online: ' + online;
		message+= ', event: ' + type;
		message+= ', status: ' + status;
		if (type == 'error' && navigator.onLine) {
			message+= ' (prolly a syntax error in manifest)';
		}
		console.log(message);
	}
	
	window.applicationCache.addEventListener(
		'updateready',
		function(){
			window.applicationCache.swapCache();
			console.log('swap cache has been called');
		},
		false
	);
	
	setInterval(function(){cache.update()}, 10000);
}