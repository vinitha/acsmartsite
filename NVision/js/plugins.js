
//extending the Date Object
Date.prototype.add=function(obj){
    for(var prop in obj){
        switch (prop){
            case "days":
                this.setDate(this.getDate()+obj[prop])
            break;
            case "months":
                this.setMonth(this.getMonth()+obj[prop])
            break;      
            case "years":
                this.setFullYear(this.getFullYear()+obj[prop])
            break;                  
        }
    }
    return this;
}

var weekday=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var yearmonth=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

Date.prototype.shortMonth=function(){           //i.e.  Jan
    return yearmonth[this.getMonth()];
}

Date.prototype.shortDayMonth=function(sep){     //i.e.  02 Jan
    return this.getDate() + (sep||" ") + yearmonth[this.getMonth()];
}

Date.prototype.day=function(){                  //i.e.  Mon
    return weekday[this.getDay()];
}

Date.prototype.longDayMonth=function(){         //i.e.  Mon, 02 Jan
    return weekday[this.getDay()] + ", " + this.getDate() + " " + yearmonth[this.getMonth()];
}

Date.prototype.shortMonthYear=function(sep){    //i.e.  12/2010 
    var year=this.getFullYear().toString(),
        month=utils.twoDigits(this.getMonth()+1);
    sep=sep||"/";
    return month + sep + year.substring(2,4);
}

Date.prototype.shortTime=function(){
    return utils.twoDigits(this.getHours())+":" + utils.twoDigits(this.getMinutes());
}

Date.prototype.shortDate=function(sep){         //i.e. 22/11/1989
    sep=sep||"/";
   return utils.twoDigits(this.getDate()) + sep + utils.twoDigits(this.getMonth()+1) + sep + this.getFullYear();

}

//uself function
var utils={
    twoDigits:function(int){
        if (int<10) return "0" + int;
        if (int>99) {
            var str=int.toString();
            return str.substring(str.length-2);
        }
        return int.toString();
    },
    
    dateDiff:function(date1,date2){
        var baseDate=new Date(1970,01,01);
        date1=date1||baseDate;
        date2=date2||baseDate;
        
        return Math.abs(date1.getTime()-date2.getTime())
    },  

    RealTypeOf:function(v) {
        if (typeof(v) == "object") {
            if (v === null) return "null";
            if (v.constructor == (new Array).constructor) return "array";
            if (v.constructor == (new Date).constructor) return "date";
            if (v.constructor == (new RegExp).constructor) return "regex";
            return "object";
        }
        return typeof(v);
    },
	
	getUmlFor:function(){
		var objName=prompt("Object name:"),
			level=prompt("Level: "),
			code=utils.doUml(eval(objName),objName,level||1);
		
		var f=$("<form />")
				.attr({
					action:"http://yuml.me/diagram/class/"+code,
					method:"get",
					target:"_blank"				
				})
				.appendTo(document.body);

			f.submit();
			f.remove();
		
		/*
		$.ajax({
					url:"http://yuml.me/diagram/class/ ",
					type:"post",
					data:{"dsl_text":code},
					success:function(data){
						console.log(data)
					},
					error:function(x,h,r){
						console.log(x,h,r)
					}
				})*/
	},
	
	doUml:function(obj,name,levels){
		var str="[" + name + "|",
			fns=[],
			objs=[],
			attributes=[];
		
		for(var o in obj){
			switch (utils.RealTypeOf(obj[o])){
				
				case "object":
					objs.push({name:o,obj:obj[o]});
				break;
				
				case "function":
					fns.push({name:o,obj:obj[o]});
				break;
			
				default:
					attributes.push({name:o,obj:obj[o]});
				break;			
			}
		}
		
		if(attributes.length){
			for (var x=0;x<attributes.length;x++){
				str+="+ " + attributes[x].name + ";";
			}
			str+="|";
		}	
		
		if(fns.length){
			for (var x=0;x<fns.length;x++){
				str+="+ " + fns[x].name + "();";
			}	
			str+="|";
		}
		
		if(levels==0){
			if(objs.length){
				for (var x=0;x<objs.length;x++){
					str+="+ " + objs[x].name + ";";
				}
			}
		}
		
		str+=" {bg:lightblue}]";
		
		
		objs=objs.reverse();
		//children
	
		if(levels>0){
			for (var x=0;x<objs.length;x++){
				str+=", " + utils.doUml(objs[x].obj,objs[x].name,levels-1);
			}
			
			for (var x=0;x<objs.length;x++){
				str+=", ["+name+"]++-["  + objs[x].name + "]";
			}
		}
		return str;
	}	
}








function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


//adding the parseTime function to the string object
String.prototype.parseTime=function() {
	var timeString=$.trim(this);
    if (timeString == '') return null;

    var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i); 
    if (time == null) return null;

    var hours = parseInt(time[1],10);    
    if (hours == 12 && !time[4]) {
          hours = 12;
    }
    else {
        hours += (hours < 12 && time[4])? 12 : 0;
    }   
    var d = new Date();             
    d.setHours(hours);
    d.setMinutes(parseInt(time[3],10) || 0);
    d.setSeconds(0, 0);  
    return d;
};


//implementing the reverse function in jQuery
$.fn.reverse = [].reverse;



//timePicker plugin
(function($){
	$.fn.timePicker=function(options){	    
		var widget=window.x_timePicker
		if(!widget){
		    //defining the base style for this object. Style customisation can be done by assigning a className to the <input> element
		    //and then defining its rules in your CSS
		    var rules=[
			       ".x_timePicker {position:absolute; z-index:99; text-align:center;font-size:1.3em;}",
				   ".x_timePicker ul{background-color:#eee;border:1px solid #e0e0e0;box-shadow:0px 1px 4px}",
				   '.x_timePicker ul:hover{opacity:1}',
				   ".x_timePicker a{display:block;padding:2px 4px;cursor:pointer; background-color:#fff;}",
				   ".x_timePicker .hover a{background-color:#977;color:#fff;}",
				   ".x_timePicker a.btn{background-color:#999;color:#fff; font-weight:bold}",
				   ".x_timePicker a.btn.on{background-color:#755;color:#fff; font-weight:bold}",
				   "#x_amPm{position:absolute; top:1px; left:0px;}",
				   "#x_tpM1,#x_tpM2 {position:absolute;display:none}"
			       ];
    
		    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");
		    widget=window.x_timePicker=$("<div class='x_timePicker' />")										
			
			var amPm=$("<div id='x_amPm'>").appendTo(widget)
			var hUl=$("<ul id='_tpH' />").appendTo(widget)
			var m1Ul=$("<ul id='x_tpM1' />").appendTo(widget)
			var m2Ul=$("<ul id='x_tpM2' />").appendTo(widget)
			
			
			$("<a class='btn' href='#pm' />").text("PM")
				.click(function(e){
					e.preventDefault();
					
					clearTimeout(widget.data("data-hnd"))
					
					$(this).addClass("on").siblings().removeClass("on")
					hUl.find("li").css("display","none").slice(12,24).css("display","block")
					
					widget.data("data-input").focus();
					return false;
				})
				.prependTo(amPm)
			$("<a class='btn on' href='#am' />").text("AM")
				.click(function(e){
					e.preventDefault();
					
					clearTimeout(widget.data("data-hnd"))
					
					$(this).addClass("on").siblings().removeClass("on")
					hUl.find("li").css("display","none").slice(0,12).css("display","block")
					
					widget.data("data-input").focus();
					
					return false;
				})
				.prependTo(amPm)
						
			
			
			for(var t=0;t<24;t++){
				$("<li/>").append(
						$("<a />")
							.text(utils.twoDigits(t))
							.data("data-value",utils.twoDigits(t))
							.click(function(e){e.preventDefault(); return false;})
							.mouseenter(function(){
								
								var thisObj=widget.data("data-input")
								
								thisObj.attr("value",($(this).data("data-value").parseTime().shortTime()))
								
								$(this)
									.closest("li")
									.addClass("hover")
									.siblings().removeClass("hover")
									
								var pos=$(this).position();
																
								m1Ul.show(0)
									.css({left:pos.left+$(this).outerWidth(),top:pos.top-m1Ul.outerHeight()/2})
									.find("li").removeClass("hover")
									
								m2Ul.hide()
							})
					)
				.appendTo(hUl)
				.css("display",t>12?"none":"block")
			}
			
			
			for(var t=0;t<6;t++){
				$("<li/>").append(
						$("<a />")
							.text(utils.twoDigits(t*10))
							.data("data-value",utils.twoDigits(t*10))
							.click(function(e){e.preventDefault(); return false;})
							.mouseenter(function(){
								
								var thisObj=widget.data("data-input"),
									aVal=parseInt($(this).data("data-value"));
									
								var timeVal=hUl.find("li.hover").find("a").data("data-value") + ":" + aVal;
								
								thisObj.attr("value",(timeVal.parseTime().shortTime()))
								
								$(this)
									.closest("li")
									.addClass("hover")
									.siblings().removeClass("hover")
									
									
								var ulPos=m1Ul.position(),
									aPos=$(this).position();
									
								m2Ul.show(0)
								
								m2Ul.find("li").hide(0).slice(aVal+1,aVal+10).show()
																
								m2Ul.css({left:ulPos.left+$(this).outerWidth(),top:ulPos.top+aPos.top-m2Ul.outerHeight()/2})
									.find("li").removeClass("hover")
									
							})

					).appendTo(m1Ul)
			}			
			
			
			for(var t=0;t<60;t++){
				$("<li/>").append(
						$("<a />")
							.text(utils.twoDigits(t))
							.data("data-value",utils.twoDigits(t))
							.click(function(e){e.preventDefault(); return false;})
							.mouseenter(function(){
								
								var thisObj=widget.data("data-input"),
									aVal=$(this).data("data-value");
									
								var timeVal=hUl.find("li.hover").find("a").data("data-value") + ":" + aVal;

								thisObj.attr("value",(timeVal.parseTime().shortTime()))
								
								$(this)
									.closest("li")
									.addClass("hover")
									.siblings().removeClass("hover")																	
							})
					).appendTo(m2Ul)
			}							
		}
		
		

		return this.each(function(){

			var thisObj=$(this);

			thisObj
				.focus(function(){
					widget.data("data-input",thisObj);
					widget.appendTo(document.body);
					
					var amPm=$("#x_amPm"),
						hUl=$("#_tpH");
				
					
					clearTimeout(widget.data("data-hnd"))
					
					var pos=$(this).offset();					
					
					widget.css({left:pos.left+2,top:pos.top+thisObj.outerHeight()});
					hUl.find("li").removeClass("hover")
					amPm.css("left",-amPm.outerWidth())
					
				})
				.blur(function (e) {
					var val = $(this).val().parseTime(),
						thisObj=$(this),
						m1Ul=$("#x_tpM1"),
						m2Ul=$("#x_tpM2");						
					
					var hnd=setTimeout(function(){
						thisObj.val(val?val.shortTime():thisObj.attr("title"));
						widget.detach();
						
						m2Ul.hide();
						m1Ul.hide();
					},400)
										
					widget.data("data-hnd",hnd);
				})
				.keypress(function(e){
					if(e.keyCode==13){
						$(this).blur()
					}
				})
		});
	}
})(jQuery);







//ixDropDown plugin
(function($){
	$.fn.ixDropDown=function(options){
	    
		if(!window._ixDropDown){
		    //defining the base style for this object. Style customisation can be done by assigning a className to the <select> element
		    //and then defining its rules in your CSS
		    var rules=[
			       ".ixDropDown_A span{display:block}",
			       ".ixDropDown_A {color:#069; padding-right:15px; display:inline-block; text-align:left; zoom: 1; *display: inline;vertical-align:bottom;outline:none}",
			       ".ixDropDown_DIV {position:absolute; display:none; z-index:20}",
			       ".ixDropDown_Cont {zoom:1}",
			       ".ixDropDown_UL {list-style-type:none; padding:0; margin:0px; outline:none}"
			       ];
    
		    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");
		    window._ixDropDown=true;
		}
		


		return this.each(function(){

			var thisObj=$(this).hide(0),
				timerHnd=null;

			//binding the onChange event to the <select>
			thisObj.change(function(){
				$(this).siblings("a.ixDropDown_A").find("span").text(this.options[this.selectedIndex].text);
			});

			var curOption=$.map(thisObj.find("option"),function(item, index){
				return item.selected?item:null;
			});
			

			curOption=curOption.length>0?curOption[0]:thisObj.children().eq(0).get(0);
			

			var anchor=$("<a href='#show' />")
			.insertAfter(thisObj)
			.addClass("ixDropDown_A " + this.className)
			.addClass(this.disabled?" disabled":(curOption?"":"disabled"))
			.append(
			    $("<span />").text(curOption?(curOption.label||$(curOption).text()):"- empty -")
				.focus(function(e){
				    e.preventDefault();
				    
				    clearTimeout(timerHnd);
				    
				    return false;
				})
			)
			.focus(function(){
				clearTimeout(timerHnd);
			})
			.blur(function(){
				var $this=$(this);
				timerHnd=setTimeout(function(){
					close($this);
				    },100
				);
			})
			.click(function(e){
				e.preventDefault();
				var $anchor=$(this);

				if ($anchor.hasClass("disabled")){return false;};

				var select=$anchor.prev("select").get(0),
					externalDiv=$("<div />")
						.keydown(function(e){
							switch(e.which){
							case 40: //down
								$(document.activeElement).closest("li").nextAll().find("a").eq(0).focus();
								return false;
								break;
		
							case 38: //up
								$(document.activeElement).closest("li").prevAll().find("a").eq(0).focus();
								return false;
								break;
							}
						})
						.addClass("ixDropDown_DIV " + select.className),
						
					contDiv=$("<div />").addClass("ixDropDown_Cont").appendTo(externalDiv),
					ul=$("<ul />")
						.attr("tabIndex",-1)
						.focus(function(){
							clearTimeout(timerHnd);
						})
						.blur(function(){
							timerHnd=setTimeout(function(){
								close($anchor);
								},100
							);
						})
						.addClass("ixDropDown_UL")
						.appendTo(contDiv);

				var options=$(select).children();

				if($anchor.data("externalDiv")){
					close($anchor);
					return false;
				}

				//adding the "open" className
				$anchor.addClass("open");

				$anchor.data("externalDiv",externalDiv);

				doHTML(options);

				function doHTML(items){
					$.each(items,function(index,item){

						if(item.disabled){
							$("<span />")
							.text(item.text)
							.addClass("disabled")
							.appendTo(
									$("<li />").appendTo(ul)
							);
							return true;
						}

						switch(item.tagName.toLowerCase()){
						case "optgroup":
							$("<strong />")
							.text(item.label)
							.appendTo(
									$("<li />").appendTo(ul)
							);

							doHTML($(item).children());
							break;

						case "option":
							$("<a />")
							.text(item.text)
							.attr("href","#" + item.text)
							.attr("data_index",index)
							.click(function(e){
								e.preventDefault();

								var $this=$(this);
								var index=$this.attr("data_index");
								var option=items[index];

								option.selected="selected";

								close($anchor);

								$anchor.siblings("select").change();
							})
							.focus(function(){
								clearTimeout(timerHnd);
							})
							.blur(function(){
								timerHnd=setTimeout(function(){
									close($anchor);
								},100
								);
							})
							.appendTo(
									$("<li />").appendTo(ul)
							);
							break;
						}
					});
				}

				var pos=$anchor.offset();

				externalDiv.appendTo(document.body)
				.css({
					left:pos.left,
					top:pos.top+$anchor.outerHeight(true),
					minWidth:$anchor.innerWidth()
				})
				.slideDown(120,function(){ul.find("a:first").focus();});

				return false;
			});
		});

		function close(anchor){
			//return false;
			var externalDiv=anchor.data("externalDiv");

			anchor.removeClass("open");

			if(externalDiv){
				anchor.data("externalDiv",null).focus();
				externalDiv.slideUp(120,function(){externalDiv.remove();});
			}
		}
	};

	$.fn.disabled=function(status){
		var select=this.prev("select");
		
		if(select.length>0){
			select.attr("disabled",status?"disabled":"")
				.find("option").get(0).selected="selected";
	
			select.change();	
		}
		
		return status?this.addClass("disabled"):this.removeClass("disabled");
	};
})(jQuery);



function confirm(options){
    var defaults={
	title:"Confirm",
	yesCaption:"Ok",
	noCaption:"Cancel",
	onYes:function(){},
	onNo:function(){},
	msg:"Confirm message!",
	msgClass:"",
	onClose:null
    }
    
    $.extend(defaults,options)
        
    var $msg=$("<div/>")
	.attr("id","confirmBox")
	.addClass(defaults.msgClass)
	.append(
		$("<p />")
			.addClass("confirmMsg")
			.text(defaults.msg)
	)
	.append(
	    $("<div/>")
	    .addClass("buttonsBar")
	    .append(
		$("<a/>")
		.addClass("button")
		.text(defaults.yesCaption)
		.click(function(){
			$("#confirmBox").addClass("wait")
		    defaults.onYes(lb);
			//lb.closeIt();
		})
	    )
	    .append(
		$("<a/>")
		.addClass("button")
		.text(defaults.noCaption)
		.click(function(){		    
		    defaults.onNo?defaults.onNo(lb):null;			
			//lb.closeIt();
		})		
	    )	    
	)
	.append("<div class='loadingData'><p>sending the request...</p></div>")
	
    var lb=$msg.lightBox({
					modal:true,
					title:defaults.title,
					width:270,
					onClose:defaults.onClose
				}).show();
}

//lightBox widget
(function($){

	var bg=null,
	    lb=null;	    
	
	$.fn.lightBox = function(options) {		
		var $this=$(this),
			p=$this.parent();
			
			$this
				.css("visibility","hidden")
				.appendTo(document.body);
				
		var	defaults={
				title:false,
				onClose:function(){},
				width:this.outerWidth(true)+20,
				parent:null,
				rtl:false,
				modal:false
			};
			
		$this
			.css("visibility","visible")
			.detach();
		
		if (p.length>0){
			$this.appendTo(p)
		}
		
		//extending the default options
		$.extend(defaults,$.fn.lightBox.defaults,options)

		defaults.parent=defaults.parent||$this.parent();
		
		$(this).data("data-lightBox",defaults);
		
		this.closeIt=function(){
		    return closing.call(this)
		};
		this.show=function(){return showing.call(this)};
		
		return this;
	};	
	
	
	// defining the plugin custom methods
	var closing=function(){

			var defaults=$(this).data("data-lightBox")
			bg.hide(0);
			lb.hide(200);
			
			$(this).detach();
			if(defaults.parent){
			    this.appendTo(defaults.parent);
			}
			
			//firing the close event
			if(defaults.onClose){
			    defaults.onClose.call(this);
			}
			return this;
	};
	
	var showing=function(){

		var defaults=$(this).data("data-lightBox"),
		    thisObj=this;
			
		//get the background DIV (or create it)						
		bg=document.getElementById("lightBoxBg");
		if(bg){
		    bg=$(bg);
		    bg.unbind("click")
		}else{
		    bg=$("<div id='lightBoxBg'></div>")
			.appendTo("body");
		    
		    //setting the basic CSS rules		    
		    var rules=[
			    "#lightBoxBg{position:fixed;height:100%;width:100%;background-color:#000;opacity:0.5;filter:alpha(opacity=50);top:0;left:0;z-index:90;display:none}",
			    "#lightBoxPanel{position:fixed;top:50%;margin-top:-100px;left:50%;background-color:#FFF;border:1px solid #000;z-index:91;display:none;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;-webkit-box-shadow:0 3px 10px rgba(0,0,0,0.6);-moz-box-shadow:0 3px 10px rgba(0,0,0,0.6);box-shadow:0 3px 10px rgba(0,0,0,0.6)}",
			    "#lightBoxPanel .mainContent{outline:none;padding:10px;overflow:hidden;position:relative}",
			    "#lightBoxPanel .closeBtn{outline:none;background-position:0 0;height:16px;position:absolute;right:-8px;top:-9px;width:16px}",
			    "#lightBoxPanel .closeBtn:hover,#lightBoxPanel .closeBtn:focus,#lightBoxPanel .closeBtn:active{background-position:0 bottom}",
			    "#lightBoxPanel .lbTitle{background-color:#bbb;background-image:color:#FFF;font-size:1.2em;border-top-right-radius:4px;border-top-left-radius:4px;-webkit-border-top-right-radius:4px;-webkit-border-top-left-radius:4px;-moz-border-radius-topleft:4px;-moz-border-radius-topright:4px;margin:0;padding:5px 5px 4px}"				
			];
    
		    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");		    
		}

		
		bg	.fadeTo(0,0.5)
			.show();
		
		var mainContent=null;
		var lbTitle=null;
		
		// get the fore DIV (or create it)
		lb=document.getElementById("lightBoxPanel");
		var closeBtn=null;
		
		if (lb){
			lb=jQuery(lb);
			mainContent=jQuery("div.mainContent",lb);
			lbTitle=jQuery("p.lbTitle",lb);
			closeBtn=lb.find("a.closeBtn");
			
			lb.unbind("keydown")
			closeBtn.unbind("click")
						
		}else{
			lb=jQuery("<div id='lightBoxPanel'></div>")
				.appendTo("body");						
						
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
		}
		
		lb.stop(false);
		lb.css("height","auto")
		lb.fadeTo(0,1,function(){this.style.filter=""})
		
		
	    //binding the close event
		closeBtn.bind("click",function(){		
		    thisObj.closeIt();
		    return false;
		});
		
		
		closeBtn.css("display","none");					    
		
		if(defaults.modal==false){
		    closeBtn.css("display","block");
		    
		    bg.bind("click",function(){		
			thisObj.closeIt();
			return false;
		    });
		    
		    //handling the ESC button
		    lb.bind("keydown",function(e){
			if (e.keyCode==27){
			    thisObj.closeIt();
			    return false;
			}
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
		
		
		this.appendTo(mainContent.empty())
		
		
		lb.css("visibility","hidden");
		
		lb.fadeIn(300,function(){
			
			lb.css(
			       {"visibility":"visible"}
			);
			
			//moving the focus to the first input, anchor or to the close button
			lb.find("input:visible, a:visible").eq(0).focus()
			//closeBtn.focus()			
		});		
		
		if(mainContent.outerHeight()/2>10){
		    lb.css({"margin-top":-mainContent.outerHeight()/2});
		}
		
		
		var checkPos=function(){		
		    if(mainContent.outerHeight()/2>10 && lb.css("margin-top")!=(-mainContent.outerHeight()/2)){
			lb.animate({"margin-top":-mainContent.outerHeight()/2},200);
		    }
		}
		
		checkPos();

			
		return thisObj;	    
	};
	

	
	
		
})(jQuery);



// object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element)
	
		var scrollRight=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>width*scrollSize+pageOffset?width*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}
		
		var scrollRightPx=function(scrollSize,duration){
			myDiv.stop(true,true);
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),				
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>scrollSize?scrollSize:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)				
		}		
		
		var scrollLeft=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>width*scrollSize+pageOffset?-width*scrollSize+pageOffset:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}
		
		var scrollLeftPx=function(scrollSize,duration){
			myDiv.stop(true,true);
			if (scrollSize<1) return false;
			    
			var width=myDiv.innerWidth(),
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>scrollSize?-scrollSize:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500)
		}		
		
		var scrollUp=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=scrollHeight-myDiv.scrollTop()-height;					
			availableScroll=availableScroll>height*scrollSize+pageOffset?height*scrollSize+pageOffset:availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)				
		}
		
		var scrollDown=function(scrollSize,duration,pageOffset){
			myDiv.stop(true,true);
			var scrollSize=scrollSize||1,
			    pageOffset=pageOffset||0;
			    
			var height=myDiv.innerHeight(),
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=myDiv.scrollTop();
			availableScroll=availableScroll>height*scrollSize+pageOffset?-height*scrollSize+pageOffset:-availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500)
		}	
	
	return {
		scrollLeft:scrollLeft,
		scrollRight:scrollRight,
		scrollLeftPx:scrollLeftPx,
		scrollRightPx:scrollRightPx,		
		scrollUp:scrollUp,
		scrollDown:scrollDown
	}
};


//ixCarousel
(function($){
    
	var windowLoaded=false;	//needed to handle a webkit issue
	$(window).load(function(){
	    windowLoaded=true;
	})
	
	$.fn.ixCarousel=function(options){
		var defaults={
			onScroll:function(){},
			className:"",
			scrollDuration:600,
			scrollSize:1,
			pageOffset:0,		//used when the items to scroll have a margin you need to complensate
			showButtons:true,
			showPag:true,
			autoStart:false,
			slideDuration:5000
		}
				
		
		$.extend(defaults,options)
		
        return this.each(function(){
			
			var timerHnd=null;
			
			var carousel=$(this).addClass("carouselContainer");
			
			var scrollWidth=this.scrollWidth;
			
			if (!carousel.parent("div").hasClass("ixCarousel")){
				
				carousel.wrap($("<div class='ixCarousel'></div>").addClass(defaults.className))
				
				if (defaults.showButtons){
					$("<a href='#left' class='left'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller(carousel).scrollLeft(defaults.scrollSize,defaults.scrollDuration,defaults.pageOffset);
							return false;
						})		
						.insertBefore(carousel)
						
					$("<a href='#right' class='right'></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.click(function(){
							if (timerHnd) clearInterval(timerHnd);
							
							scroller(carousel).scrollRight(defaults.scrollSize,defaults.scrollDuration,defaults.pageOffset);
							return false;
						})
						.insertAfter(carousel)
				}
				
				carousel.scroll(function(ev){
					
					var $this=$(this);					
					
					
					if ($this.scrollLeft()==0){
						$this.siblings("a.left").addClass("off")
					}else{
						$this.siblings("a.left").removeClass("off")
					}					
					
					if ($this.scrollLeft()==scrollWidth-$this.innerWidth()){
						$this.siblings("a.right").addClass("off")
					}else{
						$this.siblings("a.right").removeClass("off")
					}
					
					
					
					if(defaults.showPag){
						//checking the pagination
						var pagination=$this.siblings("div.paginationContainer")
						var li=pagination.find("li");
						var curPage=Math.ceil($this.scrollLeft()/($this.innerWidth()+defaults.pageOffset))										
					
						var curLi=li.eq(curPage)
						if(!curLi.hasClass("selected")){
							li.removeClass("selected");
							curLi.addClass("selected");
						}	
					}
					
					//event callBack
					defaults.onScroll.call(this,ev);
					
				})
				
				if(defaults.showPag){					
					if ($.browser.webkit && !windowLoaded){
						//chrome needs this to calculate the width correctly
						$(window).load(function(){ 
						    makePagination.call(carousel.get(0))									
						})
					}else{
						makePagination.call(this)
					}
				}
				
				if(defaults.autoStart){
					timerHnd=setInterval(function(){doSlide.call(carousel.get(0),defaults)},defaults.slideDuration)
					carousel.data("timerHnd",timerHnd)
				}
				
			    //quick refresh		
			    carousel.scroll(0);				
			}			
        });
		
		function doSlide(defaults){
			var $this=$(this);
			
			if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
				$this.animate({scrollLeft:0},defaults.scrollDuration)
			}else{
				scroller(this).scrollRight(defaults.scrollSize,defaults.scrollDuration);
			}
			
		}
		
		function makePagination(){
			var carousel=$(this);
			
			if (carousel.find("li").length>0){			
				//creating the pagination code
				var pagDiv=$("<div class='paginationContainer'></div>").insertAfter(carousel)
				var ul=$("<ul></ul>").appendTo(pagDiv)
				var pageCount=Math.ceil((this.scrollWidth-defaults.pageOffset)/carousel.innerWidth());									
												
				for( var x=0;x<pageCount;x++){
					$("<a></a>")
						.focus(function(){$(this).addClass("focus")})
						.blur(function(){$(this).removeClass("focus")})
						.mouseup(function(){$(this).removeClass("focus")})
						.attr("href","#"+x)
						.data("index",x)
						.click(function(){					
							var $this=$(this);
							var ul=carousel.stop();
							var curPage=carousel.scrollLeft()/(carousel.innerWidth()+defaults.pageOffset)   //$this.closest("div").find("li.selected a").data("index")

							var thisPage=$this.data("index")
							var jumpSize=carousel.scrollLeft()-thisPage*(carousel.innerWidth()+defaults.pageOffset)//curPage-thisPage;
														
							
							if(defaults.autoStart){
								clearInterval(carousel.data("timerHnd"))
							}
							
							if (jumpSize==0){
								return false;
							}
							
							if (jumpSize<0){
								scroller(ul).scrollRightPx(Math.abs(jumpSize),defaults.duration)
							}else{
								scroller(ul).scrollLeftPx(Math.abs(jumpSize),defaults.duration)
							}
														
							
							return false;
						})
						.append($("<span/>").text(x+1))
						.appendTo(
							$("<li></li>").appendTo(ul)	
						);
				}
			}
		}
	}
})(jQuery);


/* --- tooltip object definition --- */
    var toolTip=(function(){
	    
	    //private variables and functions
	    var divObj=null,
		show=function(content,hoveredElem){
			
			if (!divObj){
				divObj=$("<div></div>")
					.attr("id","toolTip")				 
					.css({
						position:"absolute",
						display:"none",
						zIndex:999
					})
					.appendTo(document.body)
			}
			
			divObj.empty();		
			divObj.append(content);
			
			hoveredElem=$(hoveredElem);
			var pos=hoveredElem.offset();
			
			divObj.css({
					left:(pos.left+hoveredElem.outerWidth()/2)-divObj.outerWidth()/2,			
					top:pos.top-divObj.outerHeight(true)
				})		
			
			divObj.show(0);		
			
		},
		hide=function(){
			divObj.hide(0);
		}
	    
	    //public API
	    return {
		    show:show,
		    hide:hide
	    }
    })();
/* ---------------------------------- */



// Autoscroll plugin
(function($){
	$.fn.autoScroll=function(options){
		var thisObj=$(this);
		
		thisObj.parent().css({"overflow":"hidden","position":"relative"});
		thisObj
		    .mouseenter(function(e){
			var cont=$(this.parentNode),
			contHeight=cont.innerHeight(true),
			contWidth=cont.innerWidth(true);
			
			cont.css({width:contWidth,height:contHeight})
			$(this).css({position:"absolute",top:0,left:0})
		    })
		    .mouseleave(function(){
			if(options && options.onLeave){
			    options.onLeave.call(this);
			}else{
			    $(this).css({position:"static"})
			}
			
		    })
		    .mousemove(function(e){
			
			var cont=$(this.parentNode),
			contHeight=cont.innerHeight(true),
			contWidth=cont.innerWidth(true);
								
			
			var deltaH=thisObj.get(0).clientHeight-contHeight,
			    deltaW=thisObj.get(0).clientWidth-contWidth,
			    top=e.clientY-cont.offset().top+$(window).scrollTop(),
			    left=e.clientX-cont.offset().left+$(window).scrollLeft();			    
			
			var y=top*100/contHeight;
			var x=left*100/contWidth;
	
			
			//cont.scrollTop((deltaH*y/100));
			//cont.scrollLeft((deltaW*x/100));
			$(this).stop().css({top:-(deltaH*y/100),left:-(deltaW*x/100)})
/*			
			cont.stop(true);
			cont.animate({scrollLeft:(deltaW*x/100),scrollTop:(deltaH*y/100)},400)
*/
			
		})
		
		return thisObj;
	}
})(jQuery);




// scrollBar function definition 
    /*
	usage: addScrollBar({
	   elemToScroll:xx,
	   horizontal:true,
	   className:blueTheme,
	   barContainer:null
       })	
    */
    function addScrollBar(options){
	    var clickPos={},
		    myDiv=options.elemToScroll.css("overflow","hidden"),
		    horiz=options.horizontal,
		    moving=false;
	    
	    //size check
	    var containerSize=horiz?myDiv.innerWidth():myDiv.innerHeight(),
		contentSize=horiz?myDiv.get(0).scrollWidth:myDiv.get(0).scrollHeight;
	    
	    var delta=contentSize-containerSize;
	    
	    if(delta<1) return false;
	    
	    //defining the base style for this object.
	    var rules=[];
	    
	    //common rules
	    rules.push("." + options.className + " .bar {position:relative;height:100%;overflow:hidden}");
	    rules.push("." + options.className + " .cursor {display:block;position:absolute;left:0;top:0;width:" + containerSize/contentSize*100 + "%;height:100%;background-color:#069}");
	    rules.push("." + options.className + " .cursorBody {display:block}");
	    rules.push("." + options.className + " {height:10px;width:100%;background-color:#eee;overflow:hidden}");
	    
	    if(options.horizontal){
		rules.push("." + options.className + " .left {float:left;display:block;width:10px;height:100%;background-color:#999}")
		rules.push("." + options.className + " .right {float:right;display:block;width:10px;height:100%;background-color:#999}")
		rules.push("." + options.className + " .barLeftEnd {float:left;display:block}")
		rules.push("." + options.className + " .barRightEnd {float:right;display:block}")
		rules.push("." + options.className + " .cursor {cursor: col-resize}");
		rules.push("." + options.className + " .cursorLeftEnd {float:left;display:block}")
		rules.push("." + options.className + " .cursorRightEnd {float:right;display:block}")
		
	    }else{
		rules.push("." + options.className + " .top {display:block;width:10px;background-color:#999;position:absolute;top:0px;min-height:10px;width:100%;height:auto}")
		rules.push("." + options.className + " .bottom {display:block;width:10px;height:100%;background-color:#999;position:absolute;bottom:0px;min-height:10px;width:100%;height:auto}")		    
		rules.push("." + options.className + " .barTopEnd {display:block}")
		rules.push("." + options.className + " .barBottomEnd {display:block;position:absolute;bottom:0;left:0}")
		rules.push("." + options.className + " .cursorTopEnd {display:block}")
		rules.push("." + options.className + " .cursorBottomEnd {display:block;width:100%}")
		rules.push("." + options.className + " .cursor {cursor: row-resize}");
			
		rules.push("." + options.className + "{width:auto;height:" + containerSize + "px;position:relative}")
		  
	    }

	    
	    
	    
	    $("<style type='text/css'>" + rules.join("\n") + "</style>").prependTo("head");    		
	    
	    
	    
	    //check the positioning property
	    if(myDiv.css("position")=="static") myDiv.css("position","relative")
	    
	    //handling the mouseWheel
	    myDiv.mousewheel(function(event, delta) {
		    event.preventDefault();
		    
		    if(delta<0){
			    if(horiz){
				    scroller(myDiv).scrollRight(0.25)
			    }else{
				    scroller(myDiv).scrollUp(0.25)
			    }
		    }else{
			    if(horiz){
				    scroller(myDiv).scrollLeft(0.25)
			    }else{
				    scroller(myDiv).scrollDown(0.25)
			    }				
		    }			
		    return false;
	    });

	    
	    var myScrollBar=$("<div></div>")
		    .addClass(options.className)
		    .append(
			    $("<a href='#left'></a>")
				    .addClass(horiz?"left":"top")
				    .click(function(ev){
					    ev.preventDefault();																		
					    if(horiz){
						    scroller(myDiv).scrollLeft();
					    }else{
						    scroller(myDiv).scrollDown();
					    }
					    return false;
				    })								
		    )
		    .append(
			    $("<a href='#right'></a>")
				    .addClass(horiz?"right":"bottom")
				    .click(function(ev){
					    ev.preventDefault();																			
					    if(horiz){
						    scroller(myDiv).scrollRight();
					    }else{
						    scroller(myDiv).scrollUp()
					    }
					    return false;
				    })
		    )						
		    .append(
			    $("<div class='bar'></div>")
				    .append(
					    $("<div></div>")
						    .addClass(horiz?"barLeftEnd":"barTopEnd")
				    )
				    .append(
					    $("<div></div>")
						    .addClass(horiz?"barRightEnd":"barBottomEnd")
				    )								
				    .append(
					    $("<a class='cursor'></a>")
						    .mousedown(function(ev){
							    var $this=$(this)
							    
							    moving=true;
							    
							    clickPos.left=ev.pageX;
							    clickPos.top=ev.pageY;
							    clickPos.cursorLeft=$this.position().left
							    clickPos.cursorTop=$this.position().top

							    
							    $(document).bind("mousemove",{target:$this,clickPos:clickPos,horizontal:options.horizontal},_scrollBarMousemove);										
							    $(document).bind("mouseup",_scrollBarMouseUp);							
							    
						    })
						    .append(
								    $("<span></span>")
									    .addClass(horiz?"cursorLeftEnd":"cursorTopEnd")
							    )
						    .append(
								    $("<span></span>")
									    .addClass(horiz?"cursorRightEnd":"cursorBottomEnd")
							    )
						    .append(
							    $("<span class='cursorBody'></span>")
						    )										
				    )
		    )

	    
	    //finalizing the vertical style
	    if(!horiz){			
		    
		    var cBottom=myScrollBar.find("span.cursorBottomEnd").css({
			    position:"absolute",bottom:0,left:0
		    })			
		    
		    var cur=myScrollBar.find("a.cursor").css({
			    width:"100%",height:containerSize/contentSize*100 + "%"
		    })
		    
			    
	    }
	    
	    // attach the scrollBar to the Dom
	    if (options.barContainer){
		    myScrollBar.appendTo(options.barContainer)
	    }else{
		    myScrollBar.insertAfter(myDiv)
	    }
	    

	    //rechecking the bar size and position after the user css has been applyed
	    if(!horiz){
		    var top=myScrollBar.children("a.top").outerHeight(),
			    bottom=myScrollBar.children("a.bottom").outerHeight(),
			    len=myScrollBar.innerHeight()-top-bottom;
			    
			    
		    myScrollBar.children("div.bar").css({position:"absolute",top:top,width:"100%",height:len})
		    
		    myScrollBar.find("span.cursorBody").css({
			    height:cur.innerHeight()-myScrollBar.find("span.cursorTopEnd").outerHeight()-myScrollBar.find("span.cursorBottomEnd").outerHeight()
		    })				
	    }
	    
	    //setting the event handler
	    myDiv.scroll(function(){
		    if (!moving){
			    if (horiz){
				    myScrollBar.find(".cursor").css("left",(myDiv.scrollLeft()/contentSize*100 + "%"))
			    }else{
				    myScrollBar.find(".cursor").css("top",(myDiv.scrollTop()/contentSize*100 + "%"))
			    }
			    
		    }
	    })						
    
	    
	    //event function
	    function _scrollBarMousemove(ev){
		    
		    var clickPos=ev.data.clickPos,
			    horiz=ev.data.horizontal;
			    
		    var $this=ev.data.target,
			    newPos=horiz?(ev.pageX-clickPos.left)+clickPos.cursorLeft:(ev.pageY-clickPos.top)+clickPos.cursorTop,						
			    cursor=myScrollBar.find(".cursor"),
			    bar=myScrollBar.find(".bar");
		    
		    var barSize=horiz?bar.innerWidth():bar.innerHeight(),
			    cursorSize=horiz?$this.outerWidth():$this.outerHeight(),
			    
		    
		    newPos=(newPos<0)?0:newPos;
		    newPos=(newPos+cursorSize<barSize)?newPos:barSize-cursorSize;
							    
		    $this.css(horiz?"left":"top",newPos);					
		    
		    if (horiz){
			    myDiv.scrollLeft(newPos*(contentSize-containerSize)/(barSize-cursorSize))
		    }else{
			    myDiv.scrollTop(newPos*(contentSize-containerSize)/(barSize-cursorSize))
		    }
		    
		    ev.preventDefault();
		    return false;
		    
	    }
	    
	    function _scrollBarMouseUp(ev){
		    moving=false;
		    $(document).unbind("mousemove",_scrollBarMousemove);
		    $(document).unbind("mouseup",_scrollBarMouseUp);
		    
	    }
	
	return true;
    }					
/* ---------------------------------- */


// draggable plugin
(function($){	

	
	
	$.fn.draggable=function(options){
		var thisObj=$(this);
		
		var moving=false,
			clickPos={};
		
		
		var defaults={
			draggingClass:"",
			container:null,
			elementToDrag:thisObj,
			onStart:function(){},
			onMove:function(){},
			onStop:function(){}
		}		
		  
		$.extend(defaults,options)		
			
		thisObj.mousedown(function(ev){
			ev.preventDefault();
			if (ev.cancelBubble){
				ev.cancelBubble = true;
			}else{
				ev.stopPropagation();
			}
			
			var $this=$(this),
				pos=defaults.elementToDrag.position();
			
			moving=true;
			
			clickPos.left=ev.pageX;
			clickPos.top=ev.pageY;
			clickPos.elementLeft=pos.left;
			clickPos.elementTop=pos.top;
			
			$(document).bind("mousemove",_Mousemove);										
			$(document).bind("mouseup",_MouseUp);
			
			defaults.onStart(defaults.elementToDrag);
			
		})
		
		//event function
		function _Mousemove(ev){
			ev.preventDefault();
			if (ev.cancelBubble){
				ev.cancelBubble = true;
			}else{
				ev.stopPropagation();
			}
			
			var $obj=defaults.elementToDrag,
				newLeft=(ev.pageX-clickPos.left)+clickPos.elementLeft,
				newTop=(ev.pageY-clickPos.top)+clickPos.elementTop;				
	
				if(defaults.container){
					//checking the top/left corners
					newLeft=newLeft>0?newLeft:0;
					newTop=newTop>0?newTop:0;
					
					//checking the bottom/right ones. Uncomment this to constrain the movements within the container
					/*
					newLeft=newLeft+defaults.elementToDrag.outerWidth()<defaults.container.innerWidth()?newLeft:defaults.container.innerWidth()-defaults.elementToDrag.outerWidth();
					newTop=newTop+defaults.elementToDrag.outerHeight()<defaults.container.innerHeight()?newTop:defaults.container.innerHeight()-defaults.elementToDrag.outerHeight();
					*/
				}
				
				
			$obj.css({"left":newLeft,"top":newTop});					
			
			defaults.onMove(defaults.elementToDrag)
			return false;			
		}
		
		function _MouseUp(ev){
			ev.preventDefault();
			if (ev.cancelBubble){
				ev.cancelBubble = true;
			}else{
				ev.stopPropagation();
			}
			
			moving=false;
			$(document).unbind("mousemove",_Mousemove);
			$(document).unbind("mouseup",_MouseUp);
			
			defaults.onStop(defaults.elementToDrag);
		}
		
		return thisObj;
	}
	

})(jQuery);


// messages displaying tool
(function($){		  
	window.myConsole={
		enabled:true,
		debugMode:true,
		prog:0,
		timers:{},
		init:function(){
			myConsole.div=$("<div class='myConsole' />").appendTo(document.body);
			myConsole.alDiv=$("<div class='alertBox myConsole' />").appendTo(document.body);
		},
	
		error:function(msg,id){
			if (id){
				myConsole.status(msg,id,true);
			}else{
				
				if(!myConsole.enabled) return false;
				
				var Msg=myConsole.showMsg(msg,"error");
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},5000)		
			}
		},
		
		log:function(msg,duration){
			if(!myConsole.debugMode) return false;
			if(!myConsole.enabled) return false;
			var Msg=myConsole.showMsg(msg);
			setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||2000)		
		},
			
		alert:function(msg,duration){
			if(!myConsole.enabled) return false;
			var Msg=$("<p />")
				.click(function(){$(this).remove()})		
				.addClass("alert")
				.appendTo(myConsole.alDiv)
				.text(msg && msg.length>0?msg:"(no message)");
			if (duration!=0){
			    setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||5000)
			}					
		},
		
		info:function(msg,duration){
			if(!myConsole.enabled) return false;
			var Msg=$("<p />")
				.click(function(){$(this).remove()})		
				.addClass("info")
				.appendTo(myConsole.alDiv)
				.text(msg && msg.length>0?msg:"(no message)");
			if (duration!=0){
			    setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},duration||5000)
			}					
		},		
			
		chkSpeed:function(msg,id){
			
			if (id){
				
				var Msg=$("#_console_" + id)							
				
				Msg.text(Msg.text().replace("***",(new Date()).getTime()- myConsole.timers["_console_" + id]));
				
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},10000);
				
				delete myConsole.timers["_console_" + id];
				return false;
			}
			
			id=myConsole.status(msg + "***");
			
			myConsole.timers["_console_" + id]=(new Date()).getTime();
			return id;
		},	
		
		status:function(msg,id,isError){	
			
			if (id){
				var Msg=$("#_console_" + id)							
				Msg.append	($("<span />")								
								  .text(msg.length>0?msg:"error")
								  .addClass(isError?"error":"ok")
							)
				setTimeout(function(){Msg.slideUp("normal",function(){$(this).remove()})},isError?5000:2000)
				return false;
			}
			
			if(!myConsole.enabled) return false;
			
			var Msg=myConsole.showMsg(msg);
			
			myConsole.prog++;
			
			var now=new Date();
			now=now.getTime()+ "" + myConsole.prog;
			Msg.attr("id","_console_" + now );
			
			return now;
		},
		
		json:function(obj,id){
			if(obj.code==1){
				if(obj.messages.length==0){
					myConsole.status("",id,true);				
				}
				$.each(obj.messages,function(i,msg){
					myConsole.status(msg,id,true);											  
				})			
				
				return false;
			}else{
				myConsole.status("Ok!",id,false);
				return false;
			}		
	
		},
		
		showMsg:function(msg,classes){
			return $("<p />")
				.click(function(){$(this).remove()})		
				.addClass(classes)
				.appendTo(myConsole.div)
				.text(msg && msg.length>0?msg:"(no message)");				
		}
	}
	
	//$(document).ready(myConsole.init);
	myConsole.init()
	
})(jQuery);


/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4265 $
 *
 * Version: 3.0
 * 
 * Requires: $ 1.2.2+
 */

(function($) {

$.event.special.mousewheel = {
	setup: function() {
		var handler = $.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( $.browser.mozilla )
			$(this).bind('mousemove.mousewheel', function(event) {
				$.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = $.event.special.mousewheel.handler;
		
		$(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		$.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = $.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		$.extend( event, $.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
//		if ( $.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return $.event.handle.apply(this, args);
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);













/**
 * @author Alexander Farkas
 * v. 1.21
 */

/*
(function($) {
    if(!document.defaultView || !document.defaultView.getComputedStyle){ // IE6-IE8
        var oldCurCSS = jQuery.curCSS;
        jQuery.curCSS = function(elem, name, force){
            if(name === 'background-position'){
                name = 'backgroundPosition';
            }
            if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
                return oldCurCSS.apply(this, arguments);
            }
            var style = elem.style;
            if ( !force && style && style[ name ] ){
                return style[ name ];
            }
            return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
        };
    }
    
    var oldAnim = $.fn.animate;
    $.fn.animate = function(prop){
        if('background-position' in prop){
            prop.backgroundPosition = prop['background-position'];
            delete prop['background-position'];
        }
        if('backgroundPosition' in prop){
            prop.backgroundPosition = '('+ prop.backgroundPosition;
        }
        return oldAnim.apply(this, arguments);
    };
    
    function toArray(strg){
        strg = strg.replace(/left|top/g,'0px');
        strg = strg.replace(/right|bottom/g,'100%');
        strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
        var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
        return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
    }
    
    $.fx.step. backgroundPosition = function(fx) {
        if (!fx.bgPosReady) {
            var start = $.curCSS(fx.elem,'backgroundPosition');
            
            if(!start){//FF2 no inline-style fallback
                start = '0px 0px';
            }
            
            start = toArray(start);
            
            fx.start = [start[0],start[2]];
            
            var end = toArray(fx.options.curAnim.backgroundPosition);
            fx.end = [end[0],end[2]];
            
            fx.unit = [end[1],end[3]];
            fx.bgPosReady = true;
        }
        //return;
        var nowPosX = [];
        nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
        nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];           
        fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];

    };
})(jQuery);
*/
