/* Author: 
    Alessio Carnevale
*/


//enabling the browser history buttons
$(function(){
    // Bind the event.
    $(window).bind("hashchange",function(){
		//console.log("hashchange")		
        var newStatus=$.deparam($.param.fragment())

        //setting the business market (it's the Id used to identify the business market whose data the user is seeing)
        if(!newStatus.BM && NVision.appStatus.BM==undefined){
            
			/*myConsole.alert("Business Market undefined!")
	        return false;*/
			NVision.appStatus.BM="noBM"
		
        }
        NVision.appStatus.BM=newStatus.BM||NVision.appStatus.BM;
        	
				
		if(!newStatus.tabId){			
			$("#mainMenu").find("a:first").click()
			return false;
		}
		

		//updating the current appStatus	
		NVision.appStatus.currentTab=newStatus.tabId;
		NVision.appStatus[NVision.appStatus.currentTab]=newStatus;


		//console.log("showTab")
		
        //updating the tabMenu
        if(NVision.appStatus.tabId!=newStatus.tabId){            
            $("#mainMenu").trigger("showTab",newStatus.tabId);
        }        
              
        $("#main").css("zoom",1)  //this is needed to fix an IE7 layout issue

    })
	
});

		
$().ready(function(){
	
	//console.log("ready")
    
	if(NVision.appStatus.BM==undefined){
		NVision.appStatus={
			BM:location.search.split("=")[1]
		}
	}
	
	if(NVision.appStatus.BM==undefined){
		//myConsole.alert("Business Market undefined!")
		//return false;
		NVision.appStatus.BM="noBM";
	}	
    
    
    //setting the main tabMenus custom events
    var tabMenu=$("#mainMenu");
    tabMenu.bind("showTab",function(e,tabId){
			
            var $a=tabMenu.find("a[href='#tabId=" + tabId + "']"),
                oldTab=$a.closest("li").siblings(".current"),
                oldId=oldTab.find("a").attr("hash"),
				newTabContent=$("#" + tabId);							
			
            oldTab.removeClass("current");            
            $(oldId).removeClass("current");
            
            $a.closest("li").addClass("current");
            newTabContent.addClass("current");
			
			//re-setting the #main content className
			document.getElementById("main").className="";
			
			//creating the iFrame if necessary
			if(newTabContent.length==0){
				if ($a.hasClass("iframe")){
					newTabContent=$('<div class="tabContent">')
					.attr("id",$a.attr("hash").split("=")[1])
					.append(
						$("<iframe />")
							.attr("src",$a.data("url"))
					)
					.appendTo("#main")
					.addClass("current");
					
					//resizing the iframe;
					$(window).resize()
				}
			}			
			
			//running the tabMenu callbacks
			if(NVision.tabMenuCallback[tabId]){
				NVision.tabMenuCallback[tabId]();
			}else{
				NVision.tabMenuCallback.defaultFn();
			}			
			
        })
    
    tabMenu.find("a").live("click",function(e){
        e.preventDefault();           
		
        NVision.appStatus.currentTab=this.hash.replace("#tabId=","");
        
        if(!NVision.appStatus[NVision.appStatus.currentTab]){
            NVision.appStatus[NVision.appStatus.currentTab]={tabId:NVision.appStatus.currentTab,BM:NVision.appStatus.BM}
        }
        
        $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);           
    })
    
    
    //setting the other tabMenus
    $("ul.tabMenu").find("a").live("click",function(e){
        e.preventDefault();
        
        var $a=$(this),
            oldTab=$a.closest("li").siblings(".current"),
			oldA=oldTab.find("a"),
			oldHash=oldA.length>0?oldA.get(0).hash:null,
			newHash=this.hash.indexOf("=")>0?"#" + this.hash.split("=")[1]:this.hash,
			oldId="";
			
			
			if(oldHash){				
				oldId=oldHash.indexOf("=")>0?"#" + oldHash.split("=")[1]:oldHash;
			}
			
		
        oldTab.removeClass("current");            
        $(oldId).removeClass("current");
		
        $a.closest("li").addClass("current");
        $(newHash).addClass("current");
		
    })
    
    //setting the datePicker up
    $("input.datePicker").datepicker({
        inline: true
    });
    
    //setting the timePicker up
    $("input.timePicker").timePicker()
    
    //auto-labels
    $("input[type='text']").each(function(){
        var $this=$(this);
        
        $this
            .blur(function(){
                if($this.val()==""){
                    $this.val($this.attr("title"))
                }
            })
            .focus(function(){
                if($this.val()==$this.attr("title")){
                    $this.val("")
                }            
            })
    })
    
    
    
    // advanced/basic search switcher
        var advBtn=$("#searchForm").find("a.advPanel");
        
        advBtn.bind("showAdv",function(){                
                $(this.hash).show()
                $(this)
                    .addClass("bas")
                    .closest("fieldset").addClass("disabled")
            })
        
        advBtn.bind("hideAdv",function(){
                $(this.hash).hide()
                $(this)
                    .removeClass("bas")
                    .closest("fieldset").removeClass("disabled")
            })
        
        advBtn.click(
            function(e){
                if(advBtn.hasClass("bas")){
                    advBtn.trigger("hideAdv")
                }else{
                    advBtn.trigger("showAdv") 
                }
                
                e.preventDefault();
                return false;
            })
        

        $(document.body).click(function(e){
            var $el=$(e.target)
            if($el.closest("#searchForm").length==0 &&
                $el.closest("#ui-datepicker-div").length==0 &&
                //$el.closest("div.ixDropDown_DIV").length==0 &&
                $el.closest("div.ui-datepicker-header").length==0){
                advBtn.trigger("hideAdv")
            }
        })
		
		
    //init. the NVision object (passing a function to be executed when the system is ready)
    NVision.init(function(){
		//console.log("init")
		$(window).trigger("hashchange")       
        $(window).resize()
		
		
		if(document.documentElement.className=="ie7"){
			setTimeout(function(){
				if(!NVision._dbReady){
					$(window).trigger("hashchange")
				}
				
			},1000)
		}
    });		

})




// this object holds the logic of the entire app.
var NVision={
    ver:320,                //testers will log this number in the bugs report
    zoomLevel:0,            //ranges between -1 (125%) and 3 (25%)
    zoomFactor:1,           //the dashBoard elements size/position is multiplied by this value
    appStatus:{},           //this object holds the app status and is used to optimise the browser history navigation
    systems:null,           //hashtable containing the subSystems
    currentSys:null,        //placeholder updated by showTradesTable function
    lightBoxes:{},          //hashtable of premade lightboxes      
    adapters:null,
    links:null,
    //layout:null,
    dashBoardReady:null,          //this function gets exectuted after the json data has been processed by the client
    tabMenuCallback:{       //this Object defines the tabMenu callbacks to get executed when the user clicks on it
        tab_1:function(){
			
			NVision.appStatus.tab_1.view=NVision.appStatus.tab_1.view||{type:"dashBoard"};
			
			var newStatus=NVision.appStatus.tab_1;
			
			//updating the view
            switch(NVision.appStatus.tab_1.view.type){
                case "dashBoard":
					
					
					if(!NVision._sysInitialised){
						NVision._sysInitialised=true;
						NVision.getSysComposition(function(){
							//firing the ready event!
							NVision.dashBoardReady();
													
							//setting the zoom level to 100%
							NVision.zoom(0);					
						})
						return false;
					}
					
                    NVision.showDashboard();
					
					//redrawing the links
					NVision.redrawLinks()
					
					NVision.updateEngine.forceStart();					
                break;
                
                case "adapter":
					
					if(!NVision._sysInitialised){
						NVision._sysInitialised=true;
						NVision.getSysComposition(function(){
							$(window).trigger("hashchange");
						})
						return false;
					}					
					
                    //if(!NVision.appStatus.view || NVision.appStatus.view.sysName!=newStatus.view.sysName){
                        var sysName=newStatus.view.sysName,
                            sysObj=NVision.adapters[sysName],
							btn=$("#resubmitted a");
							
							NVision.currentSys=sysObj;
							
                        if(sysObj){
							if(newStatus.view.resubmitted=="true"){
								NVision.showResubmitted();
								btn.text("< Back to the breaks view");
								btn.data("resubmitted",true)								
							}else{
								NVision.showTradesTable(sysObj)
								btn.text("View resubmitted Trades");
								btn.data("resubmitted",false)							
							}							
                        }else{
                            myConsole.alert("Unknown adapter [" + sysName +"]; ignored!")
                        }
                    //}
                break;
            
                case "search":
                    
                    if(!NVision.appStatus.view || NVision.appStatus.view.query!=newStatus.view.query){
                        var fields=$("#searchForm").find("input,select");
                
                        for (var q in newStatus.view.query){
                            var param=newStatus.view.query[q];
                            var f=fields.filter("[name='"+ param.name +"']");
                                if(f.attr("type")=="radio"){
                                    f.filter("[value='" + param.value + "']").attr("checked",true)
                                }else{
                                    f.attr("value",param.value)
                                }
                                
                        };
                        NVision.doSearch(newStatus.view.query);
                    }
                break;
			
			
				case "safestore":
					
					if(!NVision._sysInitialised){
						NVision._sysInitialised=true;
						NVision.getSysComposition(function(){
							$(window).trigger("hashchange");
						})
						return false;
					}
					
					var sysName=newStatus.view.sysName,
						sysObj=NVision.safestores[sysName];
						
						NVision.currentSys=sysObj;						
						NVision.showSafeStoreData(sysObj);
							
				break;
			
					
            
                default:
                    myConsole.alert("Unknown bookmark ignored!")                        
                break;
            }        			
            				
        },
        
        tab_2:function(){
            NVision.showKpi();
        },
        
		
		tab_5:function(){
			
            NVision.showETL();
		},
		
		tab_6:function(){
			
			if (!NVision.safestoreEvents){
				
				//styling the .systemName label
				$("#sysMsgView").find(".systemName span")
					.addClass("loading")
					.text("loading SafeStore's events...");
					
				myAjax({
					error:null,
					success:function(data){
						NVision.safestoreEvents=data.events;
						
						//creating the comboBox
						$("<label for='ssEventsSel'>Events source: </label>").appendTo($("#ssEvents"));
						var sel= $("<select/>");						
						$.each(data.events,function(i,elem){
							$("<option/>")
								.text(elem.label)
								.attr({
									"value":elem.id
								})								
								.appendTo(sel);
						})
						sel.find("option:first").attr({"selected":"selected"});
						
						sel.change(function(ev){
							NVision.currentSys.ssEventsId=this.value;
							NVision.updateEngine.updateNow();
						})
						
						sel.appendTo($("#ssEvents"));
						
						NVision.showSysMessages();
					},
					data:{"BM":NVision.appStatus.BM},
					url:sysConfig.safeStoreEventsUrl
				})
			}else{
				NVision.showSysMessages();
			}
            
		},		
		
		defaultFn:function(){
			//myConsole.alert("No default action defined!")
			NVision.updateEngine.stop();
		}
    },
    init:function(dashBoardReady){
        
        NVision.dashBoardReady=dashBoardReady;
        
        //showing the version number
        $("#sysVer .frontEnd").text(NVision.ver + " - ");
		
        
        // adding the panning function to the dashBoard        
        $("#dashBoardView").draggable({
            elementToDrag:$("#dbContent"),
            onStart:function(){$("#dashBoardView").addClass("dragging")},
            onStop:function(){$("#dashBoardView").removeClass("dragging")}
            });
        
        //zooming on dblclick
        $("#dbContent").dblclick(function(ev){
            var ePos=getBBox($(this));
            var cPos={
                width:Math.abs(ev.pageX-ePos.x),
                height:Math.abs(ev.pageY-ePos.y)
            }
            NVision.zoom(0,cPos);
        });
        
        //creating the zoomWidget
        (function(){
            var zWidget=$("<ul id='zoomWidget' />")
            $("<li class='In' ><a href='#in' title='Zoom In'>+</a></li>").appendTo(zWidget);
                
            for(var x=-1;x<4;x++){
                $("<li class='step' ><a href='#" + x + "' class='z" + x + "' title='" + (4-x)/4*100 + "%'><span>" + ((4-x)/4*100) + "%</span></a></li>").appendTo(zWidget);
            }
            
            $("<li class='Out' ><a href='#out' title='Zoom Out'>-</a></li>").appendTo(zWidget);
            
            zWidget.appendTo("#dashBoardView");
            
            $("#dashBoardView a").live("click",function(e){

                e.preventDefault();
                var $this=$(this),
                    type=$this.parent().get(0).className,
                    ul=$this.closest("ul");
                    
                
                
                switch(type){
                    case "In":
                        NVision.zoom(NVision.zoomLevel-1)
                    break;
                    case "Out":
                        NVision.zoom(NVision.zoomLevel+1)
                    break;
                    case "step":
                        NVision.zoom(parseInt(this.hash.replace("#","")))                        
                    break;                
                }                
                
            })
        })();

        
        
        //handling the search form
        $("#searchForm").submit(function(e){
            e.preventDefault();
            var missingField=null,
                theForm=$(this);
            
            var fields=theForm.find(".mandatory:visible").each(function(){
                var $this=$(this);
                
                if ($this.attr("value")==""){
                    $this.addClass("validError")
                    
                    missingField=missingField?missingField:$this;
                }else{
                    $this.removeClass("validError")
                }                                
            })
            
            var fields=theForm.find(".currency:visible").each(function(){
                var $this=$(this),
                    cur=$this.attr("value")
                    
                    if(cur=="") {
                        $this.removeClass("validError")
                        return false;
                    }
                
                if (parseFloat(cur)!=cur){
                    $this.addClass("validError")
                    
                    missingField=missingField?missingField:$this;
                }else{
                    $this.removeClass("validError")
                }
            })            
            
            var fields=theForm.find(".integer:visible").each(function(){
                var $this=$(this),
                    cur=$this.attr("value")
                    
                    if(cur=="") {
                        $this.removeClass("validError")
                        return false;
                    }
                if (parseInt(cur)!=cur){
                    $this.addClass("validError")
                    
                    missingField=missingField?missingField:$this;
                }else{
                    $this.removeClass("validError")
                }
                                
            })
            
            if(missingField){
                missingField.focus();
                return false;
            }

            var qs=theForm.find("input:visible, select:visible").serializeArray();
            //putting the query into the browser history
            
			NVision.appStatus[NVision.appStatus.currentTab]._timeStamp=(new Date()).getTime();
			
            NVision.appStatus[NVision.appStatus.currentTab].view={type:"search",query:qs}
            
            $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);         
            
            //collapsing the advanced search
            $(theForm).find("a.advPanel").trigger("hideAdv");
        })
        
        
        //handling the resizing event
        $(window).resize(function(){
            
            var h=$("html").innerHeight()-$("#shadedBar").innerHeight()-$("#header").innerHeight()-11;   //11 is the #main margin bottom + 1px border
        
            //$("div.tabContent").css("height",h);
			$("#dashBoardView").css("height",h);
			$(".tabContent iframe").css("height",h+35);
			
			
			//adding scrollbars to the tab menus			
			$(".menuContainer").each(function(){
				var div=$(this),
					ul=div.children("ul");
				
				if(ul.innerWidth()<ul.get(0).scrollWidth){

					if(!div.data("data-hasScrolls")){
						//adding the scrolling buttons
						$("<a class='button scrlLeft' href='#scroll left' title='Scroll left' />")
							.text("<")
							.prependTo(div)
							.click(function(e){
								e.preventDefault();
								scroller($(this).siblings("ul")).scrollLeft(0.5)				
							})
						
						$("<a class='button scrlRight' href='#scroll right' title='Scroll right' />")
							.text(">")
							.appendTo(div)
							.click(function(e){
								e.preventDefault();
								scroller($(this).siblings("ul")).scrollRight(0.5)				
							})
							
						div.data("data-hasScrolls",true)
					}
				}else{
					div.data("data-hasScrolls",false)
					div.find("a.button").remove();
				}
			})
					
            
        })
        
        //delegating the table row click event handler
        $("tbody tr").live("click",function(e){
            
            if($(e.target).hasClass("header")){
                return false;
            };
            
            if(!$(this).hasClass("detailsContainer")&& (e.target.tagName.toLowerCase()=="td"||e.target.className=="cellSpan")){
                var fnId=$(this).closest("table").data("fnId");
                if(fnId && NVision.fnObj[fnId]){
                    NVision.fnObj[fnId](this);
                }                
            }
        });
        
        
        //delegating the mouseenter event
        $("#dbContent .system, #dbContent .adapter, #dbContent .exchange,#dbContent .route")
            .live("mouseenter",function(){
                $(this).addClass("hover")
            })
            .live("mouseleave",function(){
                $(this).removeClass("hover")
            })            
        
        //adding the handle to resize the DashBoard
        $("#dashBoardView").append(
            $("<div class='resizer' />")
                /*.append($("<span/>"))
                .draggable({
                    container:$("#dashBoardView")                            
                })*/
        )
        
        //creating the hidden div to store the lightBoxes
        var hiddenBox=$("<div />").attr("id","hiddenBox").appendTo(document.body);
        
		
		//creating the alert lightBox
		(function(){
			var $msg=$("<div id='alertBox' />").appendTo(hiddenBox);
                
				
				$("<h3 />").appendTo($msg)				
				$("<p />").addClass("shortDesc").appendTo($msg)
				$("<p />").addClass("longDesc").append($("<pre />")).appendTo($msg)
		
		
			    NVision.lightBoxes["alertBox"]=$msg.lightBox({
						modal:false,
						title:"An error occurred:",
						parent:hiddenBox,
						onClose:null
					});
		})();
		
        //creating the overwrite lightBox
        (function(){
            var $msg=$("<div id='overwriteBox' />")
                .appendTo(hiddenBox);
            
            var form=   $("<form />").attr({
                            "action":sysConfig.overwriteRequest,
                            "id":"overwriteForm"
                        })
                        .append("<input type='hidden' id='_id' name='id' />")
                        .append("<label><span class='caption'>Account</span><input type='text' id='_account' name='account' value='nothing' /></label>")
                        .append("<label><span class='caption'>Trader</span><input type='text' id='_trader' name='trader' value='nothing' /></label>")
                        .append("<label><span class='caption'>Give In Msg</span><input type='text' id='_giveInMsg' name='giveInMsg' value='nothing' /></label>")
						.append("<div class='loadingData'><p>sending the request...</p></div>")
						.append("<div class='buttonsBar'><input type='submit' class='button submit' href='#overwrite' value='Overwrite' /> <input type='button' class='button cancel' href='#close' value='Cancel' /></div>")
                        .appendTo($msg)
                
            form.find("input.cancel").click(function(){NVision.lightBoxes["overwrite"].closeIt()})
            form.submit(function(e){
                e.preventDefault();
                
                NVision.lightBoxes["overwrite"].addClass("wait")        
                
                //generating the ajax request
                myAjax({
                    logMsg:null, 
                    success:function(data){
                       NVision.lightBoxes["overwrite"].removeClass("wait").closeIt();  
                        
						
						var confBox={
							title:"Overwrite confirmation",
							yesCaption:data._code=="nok"?"Retry":"Resubmit",
							noCaption:"Close",                    
							onYes:function(lightBox){
								lightBox.closeIt();
								
								if(data._code=="nok"){
									$("#overwriteBtn a").click();
								}else{
									$("#resubmitBtn a").click();
								}
							},
							onNo:function(lightBox){
								lightBox.closeIt();
								if(data._code!="nok"){
									myConsole.log("Refreshing the view...")
									
									//refreshing the tableView
									NVision.updateEngine.updateNow();
									NVision.updateEngine.start();
								}							
							},
							msg:data.msg||data._errObj.shortDesc,
							msgClass:data._code=="nok"?"error":"ok", // [ok||error]
							onClose:null
						}
						
						confirm(confBox);
						
                    
                    },
                    error:function(a,b,c){
                        myConsole.log(a,b,c)
                    },
					delegateErrorHandling:false,
                    url:sysConfig.overwriteRequest,
                    data:form.serialize()
                })                
                
                return false;
            })
            
            NVision.lightBoxes["overwrite"]=$msg.lightBox({
                                        modal:true,
                                        title:"Overwrite",
                                        parent:hiddenBox,
                                        onClose:null
                                    });        
        })();
        
        
        
        //creating the resubmit lightBox
        (function(){
            var $msg=$("<div id='resubmitBox' />")
                .appendTo(hiddenBox);
            
            var form=   $("<form />").attr({
                            "action":sysConfig.resubmitRequest,
                            "id":"resubmitForm"
                        })
                        .append("<input type='hidden' id='_id' name='id' />")
                        .append("<input type='hidden' id='_adapter' name='adapter' />")
                        .append("<label><span class='caption'>Select a reason</span><select id='_reason' name='reason' ><option value='staticData'>Static data</option><option value='jobFailing'>Job failing</option><option value='other'>Other</option></selet></label>")
                        .append("<label><span class='caption'>Add comment</span><textarea id='_comment' name='comment' ></textarea></label>")
                        .append("<div class='loadingData'><p>sending the request...</p></div>")
						.append("<div class='buttonsBar'><input class='button submit' type='submit' href='#resubmit' value='Resubmit' /> <input type='button' class='button cancel' href='#close' value='Cancel' /></div>")
                        .appendTo($msg)
                
            form.find("input.cancel").click(function(){NVision.lightBoxes["resubmit"].closeIt()})
            form.submit(function(e){
                e.preventDefault();

                NVision.lightBoxes["resubmit"].addClass("wait");
                
                //generating the ajax request
                myAjax({
                    logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
                    success:function(data){                        
                        
						NVision.lightBoxes["resubmit"].removeClass("wait").closeIt();
						
						
						var confBox={
							title:"Resubmit confirmation",
							yesCaption:"View submitted trades",
							noCaption:"Close",                    
							onYes:function(lightBox){
								lightBox.closeIt();
								
								NVision.appStatus[NVision.appStatus.currentTab].view.resubmitted=true;
								$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);
									
							},
							onNo:function(lightBox){
								
								lightBox.closeIt();
								
								myConsole.log("Refreshing the view...")
								
								//refreshing the tableView
								NVision.updateEngine.updateNow();
								NVision.updateEngine.start();								
							},
							msg:data.msg||data._errObj.shortDesc,
							msgClass:data._code=="nok"?"error":"ok", // [ok||error]
							onClose:null
						}
						
						confirm(confBox);
						
                    
                    },
                    error:function(a,b,c){
                        myConsole.log(a,b,c)
                    },
					delegateErrorHandling:false,
                    url:sysConfig.resubmitRequest,
                    data:form.serialize()
                })
                
                return false;
            })
            
            NVision.lightBoxes["resubmit"]=$msg.lightBox({
                                        modal:true,
                                        title:"Resubmit",
                                        parent:hiddenBox,
                                        onClose:null
                                    });        
        })();
        
        
        //creating the CSV lightBox
        (function(){        
            var $msg=$("<div />").attr("id","CSVbox").appendTo(hiddenBox);
            
                $("<textarea />").appendTo($msg)
				var btnBar=$("<div class='buttonsBar' />").appendTo($msg);
                
                if($.browser.msie && $.browser.version<9){
                    $("<a class='copy button' ><span>Copy to clipboard</span></a>").appendTo(btnBar);
                    
                    $msg.find("a.copy").click(function(){
                        var txt=$(this).closest("#CSVbox").find("textarea").get(0);
                        
                        txt.focus();                    
                        txt.select();
                        var r=txt.createTextRange();
                        r.execCommand("Copy");
                        
                        myConsole.info("Data copied to the ClipBoard!");
                        this.focus();
                        
                    })
                }else{
                    $("<a class='select button' ><span>Select all</span></a>").appendTo(btnBar);
                    
                    $msg.find("a.select").click(function(){
                        $(this).closest("#CSVbox").find("textarea").get(0).setSelectionRange(0,999999999)                        
                    })                    
                

					var btnDownload=$("<span class='download' />").appendTo(btnBar);
					
					/* generating a file download request */
					Downloadify.create(btnDownload.get(0),{
						filename: function(){
						  return NVision.currentSys.name + ".csv"
						},
						data: function(){ 
						  return $msg.find("textarea").text();
						},
						onComplete: function(){ 
						  myConsole.info('Your file has been Saved!'); 
						},
						onCancel: function(){ 
						  myConsole.alert('You have cancelled the saving of this file.');
						},
						onError: function(e){
						  alert('You must put something in the File Contents or there will be nothing to save!'); 
						},
						swf: 'js/downloadify.swf',
						downloadImage: 'images/download.png',
						width: 84,
						height: 20,
						transparent: true,
						append: false
					});
				}
            NVision.lightBoxes["csv"]=$msg.lightBox({
                                        modal:false,
                                        title:"Table CSV:",
                                        onClose:null
                                    })            
        })();
                
        
        
        // setting the buttons function up
            $("#loadBtn a").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                //getting the trade objects from the selected row
                var checked=$.map($("#etlView .tableData").find("input:checked"),function(item,index){
                            return $(item).closest("tr").attr("data-id")
                        }),
                    tradeObjs=[];
                

				var confBox={
					title:"Load trades",
					yesCaption:"Load",
					noCaption:"Cancel",                    
					onYes:function(lightBox){
						
						//getting the trade objects from the selected row
						var checked=$.map($("#etlView .tableData").find("input:checked"),function(item,index){
									return $(item).closest("tr").attr("data-id")
								}),
							tradeObjs=[];
						
						$.each(checked,function(){
							tradeObjs.push(NVision.currentSys.trades[this])
						})
							
						var ids=$.map(tradeObjs,function(item,index){
										return item["id"];
									}).join(",")						
						
						//generating the ajax request
						myAjax({
							logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
							success:function(data){                        
								
								lightBox.closeIt();
								
								if(data["_code"]=="ok"){
									myConsole.info("Trades loaded - Refreshing the view...")
								
									//refreshing the tableView
									NVision.updateEngine.updateNow();
									NVision.updateEngine.start();	
																		
								}else{
									myConsole.alert(data["_errObj"].shortDesc)
								}
								
							},
							error:function(a,b,c){
								myConsole.log(a,b,c);
								lightBox.closeIt();
							},
							delegateErrorHandling:false,
							url:sysConfig.loadTrades,
							data:{id:ids}
						})						
						
						
						
					},
					onNo:function(lightBox){
						lightBox.closeIt();
					},
					msg:"Do you really want to re-load the selected trades?",
					msgClass:"confirm", 
					onClose:null
				}
				
				confirm(confBox);		
            });		
		
            $("#clearBtn a").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }		
		
				var confBox={
					title:"Clear breaks",
					yesCaption:"Clear",
					noCaption:"Cancel",                    
					onYes:function(lightBox){
						
						//getting the trade objects from the selected row
						var checked=$.map($("#tableView .tableData").find("input:checked"),function(item,index){
									return $(item).closest("tr").attr("data-id")
								}),
							tradeObjs=[];
						
						$.each(checked,function(){
							tradeObjs.push(NVision.currentSys.trades[this])
						})
							
						var ids=$.map(tradeObjs,function(item,index){
										return item["id"];
									}).join(",")						
						
						//generating the ajax request
						myAjax({
							logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
							success:function(data){                        
								
								lightBox.closeIt();
								
								if(data["_code"]=="ok"){
									myConsole.info("Trades cleared - Refreshing the view...")
								
									//refreshing the tableView
									NVision.updateEngine.updateNow();
									NVision.updateEngine.start();	
																		
								}else{
									myConsole.alert(data["_errObj"].shortDesc)
								}
								
							},
							error:function(a,b,c){
								myConsole.log(a,b,c);
								lightBox.closeIt();
							},
							delegateErrorHandling:false,
							url:sysConfig.clearTrades,
							data:{id:ids}
						})						
						
						
						
					},
					onNo:function(lightBox){
						lightBox.closeIt();
					},
					msg:"Do you really want to remove the selected trades from the list?",
					msgClass:"confirm", 
					onClose:null
				}
				
				confirm(confBox);		
			});
		
            $("#replayBtn a").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
				var confBox={
					title:"Replay trades",
					yesCaption:"Replay",
					noCaption:"Cancel",                    
					onYes:function(lightBox){
						
						//getting the trade objects from the selected row
						var checked=$.map($("#tableView .tableData").find("input:checked"),function(item,index){
									return $(item).closest("tr").attr("data-id")
								}),
							tradeObjs=[];
						
						$.each(checked,function(){
							tradeObjs.push(NVision.currentSys.trades[this])
						})
							
						var ids=$.map(tradeObjs,function(item,index){
										return item["id"];
									}).join(",")						
						
						//generating the ajax request
						myAjax({
							logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
							success:function(data){                        
								
								lightBox.closeIt();
								
								
								if(data["_code"]=="ok"){
									myConsole.info("Trades replayed - Refreshing the view...")
								
									//refreshing the tableView
									NVision.updateEngine.updateNow();
									NVision.updateEngine.start();	
																		
								}else{
									myConsole.alert(data["_errObj"].shortDesc)
								}																
							
							},
							error:function(a,b,c){
								myConsole.log(a,b,c);
								lightBox.closeIt();
							},
							delegateErrorHandling:false,
							url:sysConfig.replayTrades,
							data:{id:ids,"sysId":NVision.currentSys.id}
						})						
						
						
						
					},
					onNo:function(lightBox){
						lightBox.closeIt();
					},
					msg:"Do you really want to replay the selected trades?",
					msgClass:"confirm", 
					onClose:null
				}
				
				confirm(confBox);	               
            });		
		
		
            $("#overwriteBtn a").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                //getting the trade object from the selected row
                var tradeObj=NVision.currentSys.trades[($("#tableView .tableData").find("input:checked").closest("tr").attr("data-id"))]
				
                //showing the Overwrite Overlay
                NVision.lightBoxes["overwrite"]                    
                .show()
                .find("#_id").attr("value",tradeObj["id"]).end()
                .find("#_trader").attr("value",tradeObj["Trader"]).end()
				.find("#_giveInMsg").attr("value",tradeObj["Give In Msg"]).end()
                .find("#_account").attr("value",tradeObj["Account"]);                
            });
            
            $("#resubmitBtn a").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                //getting the trade objects from the selected row
                var checked=$.map($("#tableView .tableData").find("input:checked"),function(item,index){
                            return $(item).closest("tr").attr("data-id")
                        }),
                    tradeObjs=[];
                
                $.each(checked,function(){
                    tradeObjs.push(NVision.currentSys.trades[this])
                })
                    
                var ids=$.map(tradeObjs,function(item,index){
                            return item["id"];
                        }).join(",")

                //showing the resubmit Overlay
                NVision.lightBoxes["resubmit"]                    
                    .show()
                    .find("#_id").attr("value",ids).end()
                    .find("#_adapter").attr("value",NVision.currentSys.id).end()
                    .find("#_comment").attr("value","").end()
                    .find("#_reason").find("option").eq(0).attr("selected",true);
            });
			
			//View Resubmitted trades
			$("#resubmitted a").live("click",function(e){
				e.preventDefault();
				
				var $this=$(this);
				
				if($this.closest(".view").hasClass("off")){
					return false;								
				}
				
				NVision.currentSys.currentPage=1;
				
				NVision.appStatus[NVision.appStatus.currentTab].view.resubmitted=$this.data("resubmitted")?false:true;
				$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2); 				
			})
			
            $("#etlView .tableData input[type='checkbox']").live("change",function(){
                var chkBox=$("#etlView .tableData").find("tbody input[type='checkbox']"),
                    checkedCount=chkBox.filter("input:checked").length;                
                                
                //setting the updateEngine
                if(this.checked){
                    if(checkedCount==1){NVision.updateEngine.stop()}
                }else{
                    if(checkedCount==0){NVision.updateEngine.start()}
                };                
                
                //select all checkbox
                (checkedCount==0)?$("#etlView .selectBtn").attr("checked",false):null;
                (checkedCount==chkBox.length)?$("#etlView .selectBtn").attr("checked",true):null;
                
                
                //Load button
                (checkedCount>0) ?                    
                    $("#loadBtn a").removeClass("off")
                :
                    $("#loadBtn a").addClass("off");                    				
					
            })			
            
            $("#tableView .tableData input[type='checkbox']").live("change",function(){
                var chkBox=$("#tableView .tableData").find("tbody input[type='checkbox']"),
                    checkedCount=chkBox.filter("input:checked").length;                
                                
                //setting the updateEngine
                if(this.checked){
                    if(checkedCount==1){NVision.updateEngine.stop()}
                }else{
                    if(checkedCount==0){NVision.updateEngine.start()}
                };                
                
                //select all checkbox
                (checkedCount==0)?$("#tableView .selectBtn").attr("checked",false):null;
                (checkedCount==chkBox.length)?$("#tableView .selectBtn").attr("checked",true):null;
                
                
                //overwrite button
                (checkedCount==1) ?
                    
                    $("#overwriteBtn a").removeClass("off")
                :
                    $("#overwriteBtn a").addClass("off");
                    
                //resubmit button
                (checkedCount==0) ?
                    $("#resubmitBtn a").addClass("off")                                      
                :
                    $("#resubmitBtn a").removeClass("off");
					
                //clear button
                (checkedCount==0) ?
                    $("#clearBtn a").addClass("off")                                      
                :
                    $("#clearBtn a").removeClass("off");
					
                //replay button
                (checkedCount==0) ?
                    $("#replayBtn a").addClass("off")                                      
                :
                    $("#replayBtn a").removeClass("off");						
					
            })
            
        //setting the back button
        $("#backToDB").click(function(e){
            e.preventDefault();
            
			if($(this).closest(".view").hasClass("off")){
				return false;
			}
			
//			NVision.appStatus.currentTab="tab_1";
//            NVision.appStatus[NVision.appStatus.currentTab]={
//				view:{type:"dashBoard"},
//				tabId:"tab_1"
//			};
			
            NVision.appStatus[NVision.appStatus.currentTab].view={type:"dashBoard"};			
			
            $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);
            
        })
        
        //setting the export button
        $(".tools .export").click(function(e){
            e.preventDefault();
			if ($(this).closest(".view").hasClass("off")){
				return false;
			}
            NVision.utils.exportToCSV(NVision.currentSys.trades)
        })
        
        //setting the print button
        $(".tools .print").click(function(e){
            e.preventDefault();
			if ($(this).closest(".view").hasClass("off")){
				return false;
			}
            window.print();
        })
		
        // setting the updateBtn function
        $(".view li.updatesBtn").find("a").click(            
            function(e){				
				
                e.preventDefault();
                if($(this).hasClass("pause")){
                    NVision.updateEngine.updateNow();
                    NVision.updateEngine.forceStart();
                }else{
                    NVision.updateEngine.stop();
                }
            }
        )
		
		
		dashBoardReady();
    },
    
    
	getSysComposition:function(callBack){
		$("#businessMarket strong").addClass("loading").text("loading...")
        
        //getting the system definition
        myAjax({
            logMsg:"Loading the system composition...",
            url:sysConfig.sysComposition,
            error:function(XMLHttpRequest, textStatus, errorThrown){
                myConsole.error(textStatus || errorThrown);
            },
            success:function(dataObj){
                
                $("#businessMarket strong").removeClass("loading").text(dataObj.bm||"Error");
				
				if(dataObj._code=="ok"){
					//showing the version number
					$("#sysVer .backEnd").text(dataObj.ver);
			
					var data=dataObj.composition;
					
					$("#sysVer")
					//add the objects to NVision
					$(data).each(function(){
						switch(this.type){
							case "system":
								if(!NVision.systems){NVision.systems={}};
	
								//adding the system to the NVision obj
								NVision.systems[this.id]=new system(this);
							break;
												
							case "adapter":
								if(!NVision.adapters){NVision.adapters={}};
								
								//base settings
								this.itemsPerPage=sysConfig.tableView.itemsPerPage;                            
								this.currentPage=1;
								
								//adding the adapter to the NVision obj
								NVision.adapters[this.id]=new adapter(this);
							break;
							
							case "link":
								if(!NVision.links){NVision.links={}};
								//adding the link to the NVision obj
								NVision.links[this.id]=this;
							break;
							

							
							case "exchange":
							  if(!NVision.otherObjects){NVision.otherObjects={}};
								//adding the exchange to the NVision obj
								NVision.otherObjects[this.id]=new exchange(this);
							break;
						
							case "safestore":
								if(!NVision.safestores){NVision.safestores={}};
								
								//base settings
								this.itemsPerPage=sysConfig.tableView.itemsPerPage;                            
								this.currentPage=1;								
								
								//adding the safestore to the NVision obj
								NVision.safestores[this.id]=new safestore(this);
							break;
							
							default :
							  if(!NVision.otherObjects){NVision.otherObjects={}};
								//adding the otherObjects to the NVision obj
								NVision.otherObjects[this.id]=new baseObj(this);                            
							break;
	
						}
					})
					
					if(callBack){
						callBack();
					}
				}
            }
        });		
	},
	
	doSearch:function(qs){
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="doSearch";
		
        //clearing the filters
		$("#tableView .tradesFilters").empty();
		
        // clearing the update engine
        NVision.updateEngine.empty();
        
        NVision.utils.deleteTable($("#tableView .tableData").find("table"));
        
        //setting the table title....
        $(".current .systemName span")
            .addClass("loading")
            .text("searching...")
        
        var search=new tradeHolder({
            name:"Search results:",
            id:"searchResults",
            currentPage:1,
            itemsPerPage:sysConfig.tableView.itemsPerPage,
            updateInterval:99999,
            type:"searchResults",
            queryString:qs
        });
        
        NVision.currentSys=search;
                
		
        
        //adding the searchObj to the updates queue
        var reqObj=NVision.createSearchRequest(search);
                
        $(".view li.updatesBtn").hide(0);
        
         NVision.updateEngine.forceStart();
         
        
        NVision.updateEngine.onNewData(function(){
            $("#tableView .systemName span").removeClass("loading")
            NVision.updateEngine.stop();
        })
		
		//$("#mainMenu").trigger("showTab","tab_1");
    },
	
	
	showKpi:function(){
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showKPI";		
		
		//creating the tabmenu for the KPI tables
		if(!NVision.kpiInitialised){
			
			NVision.kpiInitialised=true;
			NVision.kpi={};
			
			var view=$("#kpiView"),
				menuContainer=$("<div class='menuContainer simpleMenu' />"),
				ul=$("<ul class='tabMenu' />"),
				contentDiv=$("<div class='simpleMenuContent'>"),
				idx=0;
						
			
			for (var group in sysConfig.kpi){			  
				idx++;
				for (var tabs in sysConfig.kpi[group]){	
					var tabObj=sysConfig.kpi[group][tabs],
						tabDiv=$("<div class='tabContent' />").attr("id",tabObj.id).appendTo(contentDiv);
					
					//creating the pagination,table and filters placeholders
					$('<form class="tradesFilters" method="post" action="#" />').appendTo(tabDiv)
					$('<div class="toolBar"><div class="pagination" /></div>').appendTo(tabDiv)				
					$('<div class="tableData" />').appendTo(tabDiv)					
					
										
					//creating the <li>s
					$("<li/>")
						.append(
							$("<a/>")
								.attr("href","#tabId=" + tabObj.id)
								.data("dataObj",tabObj)
								.append($("<span/>").text(tabObj.name))
						)
						.addClass("kpi_" + idx)
						.appendTo(ul);
				}
			}
			
			ul.appendTo(menuContainer.appendTo(view));
			contentDiv.appendTo(view);
			
			ul.find("li:first").addClass("current");
			contentDiv.children("div:first").addClass("current");
			
			//handling the tabMenu clicks
			ul.find("a").bind("click",function(data){
				var dataObj=($(this).data("dataObj")),
					kpiReqObj=NVision.kpi[dataObj["name"]];
					
				// clearing the update engine
				NVision.updateEngine.empty();
				
				//avoiding creating unnecessary objects
				if(!kpiReqObj){
					var kpiObj=new kpiObject({
						name:"kpi report",
						id:dataObj.id,
						currentPage:1,
						itemsPerPage:sysConfig.tableView.itemsPerPage,
						url:dataObj.url,
						updateInterval:dataObj.updateInterval,
						type:"kpiObject",
						queryString:[]
					})
					
					NVision.currentSys=kpiObj;
										
					//adding the system to the updates queue
					kpiReqObj=NVision.createKpiRequest(kpiObj);
					
					NVision.kpi[dataObj["name"]]=kpiReqObj;					
					
				}else{
					NVision.currentSys=kpiReqObj.callerObj;
					NVision.updateEngine.add(kpiReqObj);
				}

      
				//setting the callback to update the updatesBtn!
				NVision.updateEngine.setCallback(function(){
		
					var now=(new Date()).getTime(),
						timer=Math.round((kpiReqObj.updateInterval-(now-kpiReqObj.timeStamp))/1000),
						span=$("#kpiView li.updatesBtn").find("span"),
						value=parseInt(span.text());
						
					if(value<timer){
						span.parent().addClass("on")
					}else{
						span.parent().removeClass("on")
					}
					
					span.text(timer);            
				});
				
				
				NVision.updateEngine.forceStart();	
								
			})
			
		}
		
		//activating the first tab
		$("#kpiView .tabMenu").find("li:first a").click();		
		
		//checking whether the scroll buttons are required
		$(window).resize();
	},
	
	
	showETL:function(){
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showETL";
		
		//setting the table title....
        $(".current .systemName span")
            .addClass("loading")
			.removeClass("resub")
            .text("loading data...");
			
		$("#etlView").addClass("off");
        
        NVision.utils.deleteTable($("#etlView .tableData").find("table"));
        
        
        // clearing the update engine
        NVision.updateEngine.empty();    		
		
        var etlReq=new tradeHolder({
            name:"Emergency Trade Load",
            id:"etlObj",
            currentPage:1,
            itemsPerPage:sysConfig.tableView.itemsPerPage,
            updateInterval:20000,
            type:"emergencyTradeList"
        });
        
        NVision.currentSys=etlReq;				
    
        //adding the system to the updates queue
        var reqObj=NVision.createEtlRequest(etlReq);
      
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((reqObj.updateInterval-(now-reqObj.timeStamp))/1000),
                span=$("#etlView li.updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.onNewData(function(){
            $("#etlView .systemName span")                
                .removeClass("loading");
			
			$("#etlView").removeClass("off");
        })
        
        NVision.updateEngine.forceStart();		
		
	},
	
	
	showSysMessages:function(){
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showSysMsg";
		
		//setting the table title....
        $(".current .systemName span")
            .addClass("loading")
			.removeClass("resub")
            .text("loading data...");
			
		$("#sysMsgView").addClass("off");
        
        NVision.utils.deleteTable($("#sysMsgView .tableData").find("table"));
        
        
        // clearing the update engine
        NVision.updateEngine.empty();    		
		
        var sysMsgReq=new sysMessage({
            name:"System messages",
            id:"sysMsgObj",
            currentPage:1,
            itemsPerPage:sysConfig.tableView.itemsPerPage,
            updateInterval:20000,
            type:"systemMessage"
        });
        
        NVision.currentSys=sysMsgReq;
		
		//setting the safeStore events id
		sysMsgReq.ssEventsId=NVision.safestoreEvents[0].id;
		
    
        //adding the system to the updates queue
        var reqObj=NVision.createSysMsgRequest(sysMsgReq);
      
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((reqObj.updateInterval-(now-reqObj.timeStamp))/1000),
                span=$("#sysMsgView li.updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.onNewData(function(){
            $("#sysMsgView .systemName span")                
                .removeClass("loading");
			
			$("#sysMsgView").removeClass("off");
        })
        
        NVision.updateEngine.forceStart();		
		
	},		
	
	
	showSafeStoreData:function(ssObject){
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showSafeStoreData";
		
		//setting the table title....
        $(".current .systemName span")
            .addClass("loading")
			.removeClass("resub")
            .text("loading data...");
			
		$("#tableView").addClass("off");
        
        NVision.utils.deleteTable($("#tableView .tableData").find("table"));
        
        NVision.currentSys=ssObject;
		ssObject.currentPage=1;		
        
        //clearing the filters
        //delete(ssObject.filters);
        delete(ssObject.filteredData)
        
        // clearing the update engine
        NVision.updateEngine.empty();        
        
        //adding the system to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(ssObject);
		reqObj.url=sysConfig.safeStoreUrl;
		
		
        
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((ssObject.updateInterval-(now-reqObj.timeStamp))/1000),
                span=$("#tableView li.updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.onNewData(function(){
            $("#tableView .systemName span")                
                .removeClass("loading");
			
			$("#tableView").removeClass("off");
        })
        
        NVision.updateEngine.forceStart();		
		
	},
    
    showTradesTable:function(sysObj){
		
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showTradesTable";
		
		
        //setting the table title....
        $(".current .systemName span")
            .addClass("loading")
			.removeClass("resub")
            .text("loading data...");
			
		$("#tableView").addClass("off");
        
        NVision.utils.deleteTable($("#tableView").find(".tableData table"));
        
        NVision.currentSys=sysObj;
		sysObj.currentPage=1;
        
        //clearing the filters
        //delete(sysObj.filters);
        delete(sysObj.filteredData)
        
        // clearing the update engine
        NVision.updateEngine.empty();        
        
        //adding the systems to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(sysObj);
        
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((sysObj.updateInterval-(now-reqObj.timeStamp))/1000),
                span=$("#tableView li.updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.onNewData(function(){
            $("#tableView .systemName span")                
                .removeClass("loading");
			
			$("#tableView").removeClass("off");
        })
        
        NVision.updateEngine.forceStart();
    },
    
    showDashboard:function(){
		
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showDashboard";
		
		
        //making sure the window and the SVG have the same size
        $("svg").css({
            "width":$("#dbContent").innerWidth(),
            "height":$("#dbContent").innerHeight()
        })        
        
        // clearing the update engine
        NVision.updateEngine.empty();
        
        
        //drawing the subSystem panels
        if(!NVision.drawSystems()){
            myConsole.alert("Unable to proceed...",10000)
            NVision.updateEngine.stop();
            return false;
        }
        
        
        //adding the systems to the updates queue
        NVision.createSystemsUpdateRequests();
        
        NVision.updateEngine.forceStart();
        
        //setting the function to highlight allerted systems
        NVision.updateEngine.setCallback(function(){

            for(var sysObj in NVision.adapters){                
                sysObj=NVision.adapters[sysObj];
                                
                if(!sysObj) {
                    myConsole.alert("Missing system definition for: " + sysObj,10000 )
                    return false;
                }
                var className=sysObj.canvasBox.className,
                    $div=$(sysObj.canvasBox);                
                
                if(className.indexOf("alert")>-1){
                    $div.removeClass("alert1 alert2")
                }else{
                    if(sysObj.displayLevel>0){
                        $div.addClass("alert" + sysObj.displayLevel)
                    }
                }
            }
        })        
    },
	
	showResubmitted:function(){
		
		//assigning the class name to switch on/off the components visibility
		document.getElementById("main").className="showResubmitted";
		
		
		NVision.updateEngine.empty();
		
		//styling the #systemName
		$(".current .systemName span")
            .addClass("loading")
            .text("loading data...");
		
		//disabling the button during the asyncronous phase
		$("#tableView").addClass("off");
		
		var reqObj=NVision.createResubmittedRequest(NVision.currentSys);
		
		//setting the callback to update the updatesBtn!
		NVision.updateEngine.setCallback(function(){
			var sysObj=NVision.currentSys,
				now=(new Date()).getTime(),
				timer=Math.round((sysObj.updateInterval-(now-reqObj.timeStamp))/1000),
				span=$("#tableView li.updatesBtn").find("span"),
				value=parseInt(span.text());
				
			if(value<timer){
				span.parent().addClass("on")
			}else{
				span.parent().removeClass("on")
			}

			span.text(timer);            
		});
		
        NVision.updateEngine.onNewData(function(){
            $(".current .systemName span")
				.addClass("resub")
				.removeClass("loading");
				
			$("#tableView").removeClass("off");
        })		
		
		NVision.updateEngine.forceStart();		
	},
    
    
    //handles all the updates requests
    updateEngine:(function(){
        var tasks={},               //hash table
		xhrs={},					//hash table of the on-going ajax request (used to abort requests when .empty method is invoked)
        engineTimer=1000,           //checks the tasks list every x millisec.
        intervalHnd=null,
        loopCallback=[],            //functions array to be executed every second
        newDataCallback=[],         //functions array to be executed whenever new data is available
        stopLevel=1,                
        
        add=function(obj){
            tasks[obj.id]=obj;            
        },
        remove=function(obj){
            delete tasks[obj.id];
        },        
        start=function(){
            stopLevel--;
            
            //starting the updates timer            
            if(stopLevel>1){
                
                //console.log("leaving start" , stopLevel);
                return false;
            }
            
            stopLevel=1;
            //console.log("start" , stopLevel);
            
			
            if(!intervalHnd){
                intervalHnd=setInterval(update,engineTimer);            
                
                myConsole.log("Update engine running...",3000);
                $(".current li.updatesBtn").find("a").removeClass("pause");
                
                //running the first update
                update();
            }
        },
        forceStart=function(){
            stopLevel=1;
            start();
        },        
        stop=function(){
            stopLevel++;
            if(intervalHnd){                
                myConsole.log("Update engine paused",3000)
                $(".current li.updatesBtn").find("a").addClass("pause")
                clearInterval(intervalHnd);
                intervalHnd=null;
            }
            //console.log("stop" , stopLevel);
        },
        update=function(){
            var now=new Date();
            now=now.getTime();                    
                        
            //going through the tasks list to see what to update
            for(var reqObj in tasks){
                reqObj=tasks[reqObj];
                                
				if(reqObj.updateInterval<1){
					continue;
				}
				
                if(!reqObj.timeStamp || (reqObj.timeStamp+reqObj.updateInterval<now)){
                    
                    var cb=$(reqObj.callerObj.canvasBox);
                    
                    cb.addClass("updating");
                    
                    reqObj.timeStamp=now;
					
					var data=reqObj.data;
					
					
					
					if(utils.RealTypeOf(data)=="array"){
						
						//converting the array into an hashtable obj.
						var hash={};				
						$.each(data,function(i,item){							
							hash[item.name]=item.value;
						})
						
						reqObj.data=hash;
						
					}
					
					//updating the query params
					if(data.itemsPerPage){					
						
						//pagination stuff
						data["currentPage"]=reqObj.callerObj.currentPage;
						data["itemsPerPage"]=reqObj.callerObj.itemsPerPage;
						
						
						//ssEventsId stuff
						if(reqObj.callerObj.ssEventsId){
							data["ssEventsId"]=reqObj.callerObj.ssEventsId;
						}
						
						
						//filters stuff
						if (reqObj.callerObj.filters){
							for (f in reqObj.callerObj.filters){
								data[f]=reqObj.callerObj.filters[f];
							}
						}
						
						//sortBy
						if(reqObj.callerObj.sortBy && reqObj.callerObj.sortBy.length>0){
							var sortStr=[]
							for (s in reqObj.callerObj.sortBy){
								var sortObj=reqObj.callerObj.sortBy[s]
								sortStr.push(sortObj.name + "," + (sortObj.ascending?"d":"a"));
							}
							
							data["orderBy"]=sortStr.join("|")
						}else{
							delete(reqObj.callerObj.sortBy);
							delete(data["orderBy"]);
						}
					}
											

                    //generating the ajax request
                    var xhr=myAjax({
                        logMsg:null,//"Updating sys.: " + reqObj.callerObj.name,
                        success:function(data){
                            
							if(data._code=="ok"){
								
								//executing the newDataCallbacks
								for (var f in newDataCallback){
									//executing and removing it
									newDataCallback[f]();
									newDataCallback.splice(f,1);                                
								}
	
								var reqObj=tasks[data.id]
								
								//removing the pending req.
								delete(xhrs[data.id]);
								
								if(!reqObj){
									myConsole.alert("Unexpected data received: " + data.id);
				
									//going back to the first tab
									//$("#mainMenu").find("a:first").click();

									return false;
								}
								reqObj.callBack(data);
							
							
								var cb=$(reqObj.callerObj.canvasBox);
								
								setTimeout(function(){
									cb.removeClass("updating");
								},1000)
                            }
                        }
                        ,
                        error:function(a,b,c){
							if(reqObj.error){
								reqObj.error(a,b,c)
							}
                        },
						type:"jsonp",
                        url:reqObj.url,
                        data:data
                    })
					
					//making a note of the ongoing request
					xhrs[reqObj.id]=xhr;
                }                
            }
            
            //executing the callbacks
            for(var f in loopCallback){
                loopCallback[f]();
            }            
                        
        },
        updateNow=function(){
			
			discardPending();
			
            //reseting the timeStamp values
            for(var reqObj in tasks){
                tasks[reqObj].timeStamp=null;
            }
            
            //calling the update function
            update();
        },
		
		discardPending=function(){
			//aborting the on-going requests
			for(var r in xhrs){
				xhrs[r].abort();
				delete(xhrs[r])
			}		
		},
		
        empty=function(){
			
			discardPending();
			
            tasks={};
            loopCallback=[];
			stop();
        },
        
        setCallback=function(fn){
            //this function is executed every second
            loopCallback.push(fn);
        },
        
        onNewData=function(opt){
            
            //this functions are executed whenever new data is available
            newDataCallback.push(opt)
        },
		
		getTasks=function(){
			return tasks;
		};
		
		
        
        //public functions
        return {
            add:add,
            remove:remove,
            start:start,
            stop:stop,
            update:update,
            empty:empty,
            setCallback:setCallback,
            updateNow:updateNow,
            forceStart:forceStart,
            onNewData:onNewData,
			tasks:getTasks,
			discardPending:discardPending
        }
        
    })(),
    
    zoom:function(zFactor,center){
        
        if (zFactor>3 || zFactor<-1 || NVision.zooming){
            return false;
        }
        
        //updating the zoomWidget        
        var ul=$("#zoomWidget")
        ul.find("a").removeClass("current");
        ul.find("a.z" + zFactor).addClass("current");
        
        if (zFactor==NVision.zoomLevel){
            return false;
        }
        
        NVision.zooming=true;
        
        var objects={},
            f=(4-zFactor)/4;        //formula to zoom the dashboard by 1/4 every step ()
  
        var dBoard=$("#dbContent");
        
        dBoard.addClass("zooming");
        
        //hidding the links            
        var svg=$("svg");
        svg=svg.length==0?dBoard.find("div:first"):svg;
        svg.css({display:"none"})
        
        var dbPos=getBBox(dBoard),
            deltaFactor=(NVision.zoomFactor-f);
        
        //if center==null we assume the zoom center is in the center of the dashboard
        dbPos.width/=2;
        dbPos.height/=2;
        
        var cPoint=center||dbPos;
        
        dBoard.stop(true,true);
        
        //avoiding logging the status
        myConsole.enabled=false;
        NVision.updateEngine.stop();
        
        
        dBoard.animate({
                "font-size":f + "em",
                "left":dbPos.x+deltaFactor*cPoint.width,
                "top":dbPos.y+deltaFactor*cPoint.height
            },700,function(){
        
            //updating the zoomFactor
            NVision.zoomFactor=f;
                        
            //redrawing the links
            NVision.redrawLinks();
            
            svg.css({display:"block"})
            
            NVision.updateEngine.start()
            myConsole.enabled=true;
            
            
            NVision.zooming=false;
            
            dBoard.removeClass("zooming");
        })
        
        //setting the dashBoardView className according to the zoom level
        $("#dashBoardView")
            .removeClass("zoom" + NVision.zoomLevel)
            .addClass("zoom" + zFactor)
        
        NVision.zoomLevel=zFactor;        
		
		objects=NVision.utils.getDBobjects();
        
        for(var obj in objects){
            var $obj=$(objects[obj].canvasBox),
                pos=objects[obj].getZoomedPosition();

            $obj.stop(true,true).animate({left:pos.left*f,top:pos.top*f},400)
        }      
        
    },
    
    drawSystems:function(){
        
        // I am using NVision._dbReady to avoid drawing the dashBoard more than one time
        if(!NVision._dbReady){
            
            var db=$("#dbContent"),
                paper = Raphael("dbContent", db.innerWidth(), db.innerHeight());
                NVision.paper=paper;
                
            //getting the user defined adapters positions
            var pos=NVision.utils.getPositions(),
                positions=null;
            
            if(pos){
                positions=eval("(" + pos + ")");
            }
            
            var objects=NVision.utils.getDBobjects();

            for(var i in objects){
                var obj=objects[i],
                    layout={left:obj.left||0,top:obj.top||0},                
                    objPos=positions?positions[i]:layout;
                               
                if(pos && !objPos){
                    
                    myConsole.info("Custom configuration data corrupted! Reverting to default",10000);
                    eraseCookie("positions");
                    positions=null;
                    objPos=layout;
                }                
                obj.draw(objPos,db)
            }
            
            //resizing the dashboard to contain all the objects
            NVision.utils.checkDbSize();
            
            //drawing all the links
            NVision.drawLinks();
                        
            NVision._dbReady=true;
        }
        
        return true;
    },
    
    drawLinks:function(){
		var objs=NVision.utils.getDBobjects();
		
        //drawing all the links
        for (var link in NVision.links){
            
            var link=NVision.links[link],                
                fromSys=objs[link.from],					
                toSys=objs[link.to];                
                
                var canvasLink=NVision.paper.connection(fromSys.canvasBox,toSys.canvasBox,"#fff", "#a5bfcb|4");
                
                fromSys.canvasLink=fromSys.canvasLink?fromSys.canvasLink:[];
                fromSys.canvasLink.push(canvasLink);
                toSys.canvasLink=toSys.canvasLink?toSys.canvasLink:[];
                toSys.canvasLink.push(canvasLink);                    
        }
    },
    
    redrawLinks:function(objects){
        //redrawing all the links
                
        if(!objects){			
            objects=NVision.utils.getDBobjects();
        }
        		
        //if the passed obj is a single object (i.e. is not an hashTable)
        if(objects instanceof  baseObj){
            //redrawing the links
            for(var link in objects.canvasLink){
                link=objects.canvasLink[link];
                NVision.paper.connection(link)
            }            
        }else{
            for(var obj in objects){
                var sysObj=objects[obj];
                //redrawing the links
                for(var link in sysObj.canvasLink){
                    link=sysObj.canvasLink[link];
                    NVision.paper.connection(link)
                }
            }            
        }
              
    },

    
    createSystemsUpdateRequests:function(){
        // looping through the adapters list and generating updatesRequest for each adapter       
        for (var sysName in NVision.adapters){    
            var sysObj= NVision.adapters[sysName];
			
				//augmenting the data object with the server side pagination details
			var data=[
					{name:"sysId",value:sysObj.id}
				];
				
				
			
            
            //generating and adding updatesRequest
            //to the updating queue.
            var updateReq= new updateRequest({
                callerObj:sysObj,
                updateInterval:sysObj.updateInterval,
                id:sysObj.id,
                url:sysConfig.sysUpdates,
                data:data,
                callBack:function(data){
                    var sysObj=NVision.adapters[data.id];
                    
                    if(!sysObj){
                        myConsole.alert("Adapter not found: " + data.id,10000);
                        return false;
                    }
										
					sysObj.displayLevel=NVision.utils.getLevel(data.alertLevel);
                    
                    //updating the rest of the object                    
                    sysObj.data=data;                    
                    sysObj.refresh();
                    
                    //redrawing the links
                    NVision.redrawLinks(sysObj)
                    
                }
            })
            NVision.updateEngine.add(updateReq);          
        }
      
    },
    
    createSearchRequest:function(searchObj){
		var data=searchObj.queryString;
				
		//augmenting the data object with the server side pagination details
		data.push({name:"currentPage",value:searchObj.currentPage})
		data.push({name:"itemsPerPage",value:searchObj.itemsPerPage})
			
        var updateReq= new updateRequest({
            callerObj:searchObj,
            updateInterval:searchObj.updateInterval,
            id:searchObj.id,
            url:sysConfig.searchUrl,
            data:data,
            callBack:function(data){
                
                searchObj.currentPage=1;
                NVision.utils.showObjTrades(data,$("#tableView .tableData"),$("#tableView .pagination"),$("#tableView .tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;    
    },
	
	createKpiRequest:function(kpiObj){
		
		var data={
			"sysId":kpiObj.id,
			"currentPage":kpiObj.currentPage,
			"itemsPerPage":kpiObj.itemsPerPage
		};

        var updateReq= new updateRequest({
            callerObj:kpiObj,
            updateInterval:kpiObj.updateInterval,
            id:kpiObj.id,
            url:kpiObj.url,
			data:data,
            callBack:function(data){
				$("#businessMarket strong").text(data.bm);
				
				//showing the tableView
				NVision.utils.showObjTrades(data,$("#"+ kpiObj.id + " .tableData"),$("#"+ kpiObj.id + " .pagination"),$("#"+ kpiObj.id + " .tradesFilters"))								
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;    
    },
	
	createSysMsgRequest:function(sysMsgObj){

		var data={
			"sysId":sysMsgObj.id,
			"currentPage":sysMsgObj.currentPage,
			"itemsPerPage":sysMsgObj.itemsPerPage
		};
		
        var updateReq= new updateRequest({
            callerObj:sysMsgObj,
            updateInterval:sysMsgObj.updateInterval,
            id:sysMsgObj.id,
            url:sysConfig.systemMessages,
			data:data,
            callBack:function(data){
				//renaming the attribute for consistency
				data.trades=data.messages;
                NVision.utils.showObjTrades(data,$("#sysMsgView .tableData"),$("#sysMsgView .pagination"),$("#sysMsgView .tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;    
    },
    
    createEtlRequest:function(etlObj){
		
		//augmenting the data object with the server side pagination details
		var data={
			"sysId":etlObj.id,
			"currentPage":etlObj.currentPage,
			"itemsPerPage":etlObj.itemsPerPage
		};	
		
        var updateReq= new updateRequest({
            callerObj:etlObj,
            updateInterval:etlObj.updateInterval,
            id:etlObj.id,
            url:sysConfig.emergencyTradeLoad,
			data:data,
            callBack:function(data){
				$("#businessMarket strong").text(data.bm)
                NVision.utils.showObjTrades(data,$("#etlView .tableData"),$("#etlView .pagination"),$("#etlView .tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;    
    },
	
    createBreaksUpdateRequests:function(sysObj){        
		//augmenting the data object with the server side pagination details
		var data={
			"sysId":sysObj.id,
			"currentPage":sysObj.currentPage,
			"itemsPerPage":sysObj.itemsPerPage
		};		

		// generating breaks updatesRequest for the passed system	
        var updateReq= new updateRequest({
            callerObj:sysObj,
            updateInterval:sysObj.updateInterval,
            id:sysObj.id,
            url:sysConfig.sysTrades,
			error:function(a,b,c){
				myConsole.alert("Error getting the adapter breaks!");
				NVision.appStatus[NVision.appStatus.currentTab].view={type:"dashBoard"};						
				$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);
			},
            data:data,
            callBack:function(data){				
                NVision.utils.showObjTrades(data,$("#tableView .tableData"),$("#tableView .pagination"),$("#tableView .tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;
    
    },
	
	createResubmittedRequest:function(sysObj){
		//augmenting the data object with the server side pagination details
		var data={
			"sysId":sysObj.id,
			"currentPage":sysObj.currentPage,
			"itemsPerPage":sysObj.itemsPerPage
		};		

        // generating breaks updatesRequest for the passed system

        var updateReq= new updateRequest({
            callerObj:sysObj,
            updateInterval:sysObj.updateInterval,
            id:sysObj.id,
            url:sysConfig.resubmittedTrades,
            data:data,
            callBack:function(data){
                NVision.utils.showObjResubmitted(data,$("#tableView .tableData"),$("#tableView .pagination"),$("#tableView .tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;		
	},
    
    utils:{
		getDBobjects:function(){
			var objects={}
			
			//putting all the dashboard objects together
			objects=$.extend(objects,NVision.adapters);
			objects=$.extend(objects,NVision.systems);
			objects=$.extend(objects,NVision.safestores);
			objects=$.extend(objects,NVision.otherObjects);
			
			return objects;
		},
        
		checkDbSize:function(){
            
            var objects=NVision.utils.getDBobjects();
            
            var w=null,
                h=null;
                
            for(var obj in objects){
                var pos=getBBox(objects[obj].canvasBox);
                
                if(!w || w<pos.x+pos.width){
                    w=pos.x+pos.width
                }

                if(!h || h<pos.y+pos.height){
                    h=pos.y+pos.height
                }                                
            }
            
            //adding a padding to minimize the link croppings
            w+=200;
            h+=200;
                
            $("#dbContent").css({
                    "width":w,
                    "height":h})
            
            var ver=parseInt(document.documentElement.className.replace("ie",""));
            
            if ($.browser.msie && ver<9){
                  
                $("#dbContent").find("div:first").css({
                    "width":w,
                    "height":h,
                    "clip":"rect(0px " + w + "px " + h + "px 0px"
                })      
                
            }else{
                $("svg").css({
                    "width":w,
                    "height":h
                })                
            }
            
        },
		
		//this function fetches and displays the passed trade details
        showTradeDetails:function(tr){
			
            var $tr=$(tr),
                tradeId=NVision.currentSys.trades[tr.getAttribute("data-Id")].id;
                        
            //removing the details table 
            if($tr.next().hasClass("detailsContainer")){
                $tr.removeClass("open");
                
                //removing the old table and clearing the NVision.fnObj
                NVision.utils.deleteTable($tr.next().find("table"))
                
                $tr.next().remove();
                
                NVision.updateEngine.start();
            }else{
				//checking whether the previous request is still pending
				if($tr.hasClass("opening")){
					myConsole.log("waiting for data...");
					return false;
				}				
				
                NVision.updateEngine.stop();
                
                //generating the ajax request
                $tr.addClass("opening");
                myAjax({
                    data:{"tradeId":tradeId},
                    //logMsg:"Getting the breaks details for trade: " + tradeId,
					error:function(){
						$tr.removeClass("opening");
						$tr.removeClass("open");						
					},
                    success:function(data){
                        var messageData=data;
						
						if (data._code=="nok"){
							$tr.removeClass("opening");
							return false;
						}
						
						$tr.removeClass("opening");
						$tr.addClass("open");
                        
                        //generating the table to display the trade details
                        var newTr=$("<tr class='detailsContainer'><td class='detailsContainer' colspan='" + $tr.children().length + "'></td></tr>").insertAfter(tr),
                            tableHeadings=[];
                            
                        // passing the default table headers
                        for (var h in data.details[0]){
                            tableHeadings.push(h);
                        }                        
                          
                        var table=NVision.utils.createTable({
                            container:newTr.find("td"),
                            tableHeadings:tableHeadings,
                            data:data.details,
                            itemsPerPage:0,     //-> all
                            currentPage:1,
                            rowClick:function(tr){
								
								var $th=$(tr).closest("table").find("thead tr");
								
								//checking whether the previous request is still pending
								if($th.hasClass("opening")){
									myConsole.log("waiting for data...");
									return false;
								};
								
								$th.addClass("opening");
								
								
                                var msgId=$(tr).attr("data-id");

                                myAjax({
                                    data:{"msgId":messageData.details[msgId].id},
                                    success:function(msgDetails){
                                        $th.removeClass("opening");
										
                                        var msg=$("<div />")
                                            .addClass("popup")
                                            .append("<h1>Message details:</h1>")
                                            .append(
                                                    $("<p class='details' />")
                                                    .addClass(msgDetails.Status=="nok"?"error":"")
                                                    .append($("<strong>Id: </strong>"))
                                                    .append($("<span/>").text(msgDetails["id"]))
                                                    
                                                    .append($("<strong>Route: </strong>"))
                                                    .append($("<span/>").text(msgDetails["Route"]))
                                                    
                                                    .append($("<strong>Rabbit Exch: </strong>"))
                                                    .append($("<span/>").text(msgDetails["Rabbit Exch"]))
                                            
                                                    .append($("<strong>Routing Key: </strong>"))
                                                    .append($("<span/>").text(msgDetails["Routing Key"]))
                                                )
                                            
                                            .append(
												$("<div class='menuContainer' />")
													.append(
														$("<ul/>").addClass("tabMenu")
															//.append($("<li><a href='#_msg_raw'><span>Raw message:</span></a></li>"))                                            
															.append($("<li class='current'><a href='#_msg_in'><span>Incoming:</span></a></li>"))
															.append($("<li><a href='#_msg_out'><span>Outgoing:</span></a></li>"))                                            
															.append($("<li><a href='#_msg_steps'><span>Steps:</span></a></li>"))
													)
                                            )
                                            
                                            
                                            //.append($("<p class='tabContent current' id='_msg_raw'/>").text(msgDetails["Raw message"]))
                                            .append($("<p class='tabContent current' id='_msg_in'/>").append($("<pre />").text(msgDetails["Incoming"])))
                                            .append($("<p class='tabContent' id='_msg_out'/>").append($("<pre />").text(msgDetails["Outgoing"])))
                                            
                                            var div=$("<div class='tabContent' id='_msg_steps' />").appendTo(msg)
                                            
                                            for (var x in msgDetails["Steps"]){
                                                var det=msgDetails["Steps"][x]
                                                $("<p/>")
                                                    .text(det)
                                                    .appendTo(div)
                                            }                                            
                                            
                                        var lb=msg
                                            .lightBox({
                                                title:"Break details:",
                                                width:820
                                            })
                                            .show();
                                    },
                                    error:function(){
                                        myConsole.log("Error!")
										$th.removeClass("opening");
                                    },
                                    url:sysConfig.msgDetails
                                })                                
                                
                            },
                            headClick:null                        
                        },function(table){
						
							//replacing ok/nok with icons
							$.each(table.find("tbody tr"),function(){
									var td=$(this).children().eq(0),
										text=td.text();
										
									td.empty().addClass("status");                                
									$(this).addClass(text);                                
								})						
						
						})
                        
                    },
                    url:sysConfig.tradeDetails
                })    
            }                           
        },		
        
        showObjTrades:function(data,tableContainer,paginationContainer,filtersContainer){

            //showing the adapter name
            var nameSpan=$(".current h2.systemName").find("span").text(data.name),
                sysObj=NVision.currentSys;

            //updating the system trades object
            sysObj.trades=data.trades;
			sysObj.currentPage=data.currentPage;
			sysObj.pageCount=data.pageCount;
			sysObj.recordCount=data.recordCount;
			
			//in case we want to display totals in the table footer
			sysObj.showTotalOn=data.showTotalOn;
            
            //clearing the filters
            //delete(sysObj.filters)
            delete(sysObj.filteredData)
            
            
            //disabling the buttons
            $(".view .toolBar .buttons .button").addClass("off")            
            
            
            //clearing and recreating the table
            NVision.utils.deleteTable(tableContainer.find("table"))
            sysObj.showTrades(tableContainer,paginationContainer,NVision.utils.showTradeDetails )
                        
            //creating the filters html
            var html=NVision.utils.createFilters(data.filters),                
                filtersDiv=filtersContainer.empty();
								
            
            for(var filter in html){
                filtersDiv.append(html[filter])
				
                html[filter].find("select").change(function(){
                    var selectObj=$(this);                        
					
					if(tableContainer.closest(".view").hasClass("off")){
						return false;
					}
					
                    sysObj.filters=sysObj.filters?sysObj.filters:{};
                    if(selectObj.val()==""){
                        delete(sysObj.filters[selectObj.attr("name")]);
                    }else{
                        sysObj.filters[selectObj.attr("name")]=selectObj.val();
                    }
                    
                    //moving to page 1
                    sysObj.currentPage=1;
                                            
                    
					NVision.updateEngine.updateNow();
					if(selectObj.val()!=""){
						NVision.updateEngine.stop()
					}else{
						NVision.updateEngine.start()
					}
					
					//sysObj.showTrades(tableContainer,paginationContainer,NVision.utils.showTradeDetails )
                })
            }
            
        },
		
		showObjResubmitted:function(data,tableContainer,paginationContainer,filtersContainer){

            //showing the adapter name
            var nameSpan=$(".current h2.systemName").find("span").text(data.name),
                sysObj=NVision.currentSys;

            //updating the system resubmitted object
            sysObj.resubmitted=data.trades;
			sysObj.currentPage=data.currentPage;
			sysObj.pageCount=data.pageCount;
			sysObj.recordCount=data.recordCount;			
            
            //clearing the filters
            //delete(sysObj.filters)
            delete(sysObj.filteredData)
            
            
            //disabling the buttons
            $("#tableView .toolBar .buttons .button").addClass("off") 
            
            
            //clearing and recreating the table
            NVision.utils.deleteTable(tableContainer.find("table"))
            sysObj.showResubmitted(tableContainer,paginationContainer)
            
            
            //creating the filters html
            var html=NVision.utils.createFilters(data.filters),                
                filtersDiv=filtersContainer.empty();
            
            for(var filter in html){
                filtersDiv.append(html[filter])
                html[filter].find("select").change(function(){
                    var selectObj=$(this);                        
                    
					if(tableContainer.closest(".view").hasClass("off")){
					//if($("#tableView").hasClass("off")){
						return false;
					}
					                        
                    sysObj.filters=sysObj.filters?sysObj.filters:{};
                    if(selectObj.val()==""){
                        delete(sysObj.filters[selectObj.attr("name")]);
                    }else{
                        sysObj.filters[selectObj.attr("name")]=selectObj.val();
                    }
                    
                    //moving to page 1
                    sysObj.currentPage=1;
                                            
					NVision.updateEngine.updateNow();
					if(selectObj.val()!=""){
						NVision.updateEngine.stop()
					}else{
						NVision.updateEngine.start()
					}
					//sysObj.showResubmitted(tableContainer,paginationContainer)
                })
            }
            
        },
        
        getLevel:function(lev){
            var thr=100;
            //function to map the percentage with the error level
            return lev<thr*0.6?0:lev<thr?1:2;        
        },
        
        savePositions:function(){
            var coords=[],
                objects=NVision.utils.getDBobjects();          
            
            
            for (var obj in objects){                
                var pos=objects[obj].getZoomedPosition();                
                coords.push(
                    '"' + obj + '":{' + '"left":' + pos.left + ',"top":' + pos.top +"}"
                )
                
                //updating the object itself
                objects[obj].left=pos.left;
                objects[obj].top=pos.top;
            }

                       
            createCookie("positions","{" + coords.join(",") + "}",999);
        },
        
        getPositions:function(){
            var pos=readCookie("positions");
            
            return pos;
        },
        
        exportToCSV:function(data){
            var strArr=[],
                header=[],
                headOk=false;
                
            for(var obj in data){
                var tmpArr=[]
                for(var d in data[obj]){
                    tmpArr.push(data[obj][d]);
                    if (!headOk){
                        header.push(d);
                    }
                }
                headOk=true;
                strArr.push(tmpArr.join(","))
            }
            
            NVision.lightBoxes["csv"]
                .find("textarea")
                    .text(header.join(",") + "\n" + strArr.join("\n"));         
                
                NVision.lightBoxes["csv"].show()                  
                
                                          
            
        },
        createPagination:function(options){
            /*
            system
            container
            pageClick
            */            
            options.container.empty();
            
            var legend=$("<span class='legend' />")
                    .text("Showing: 0/0")
                    .appendTo(options.container);
                    
			//consistency check
            //options.system.itemsPerPage==0?(options.system.displayAll=true):(options.system.displayAll=false);
            
			/*
            //adding the "displayAll" button
            var all=$("<a />")
                    .addClass("showAll button")
                    .text(options.system.displayAll?"Paginate":"Display all")
                    .click(function(e){
                        e.preventDefault();
                        var $this=$(this);
						
						if(tableContainer.closest(".view").hasClass("off")){
							return false;
						}
                        
						options.system.displayAll=options.system.displayAll?false:true;
                        
                        $this.text(options.system.displayAll?"Paginate":"Display all")
                        options.pageClick(1);                    
                    })
                    .appendTo(options.container)
              
			*/
			
			//adding the "page size" drop down
			var ps=$("<select/>")
				$("<option />").attr("value",10).text(10).appendTo(ps)
				$("<option />").attr("value",25).text(25).appendTo(ps)
				$("<option />").attr("value",50).text(50).appendTo(ps)
				$("<option />").attr("value",100).text(100).appendTo(ps)
				$("<option />").attr("value",250).text(250).appendTo(ps)
			
			ps.change(function(e){
				if(options.container.closest(".view").hasClass("off")){
					return false;
				}
				
				options.system.itemsPerPage=parseInt($(this).val());
								
				options.pageClick(1);			
			})
			
			ps.appendTo(
				$("<label class='pageSize' />")
					.text("Items per page: ")
					.appendTo(options.container)
			);
			ps.val(options.system.itemsPerPage)
			
			
			
            if(options.system.filteredData.length==0){
                return false;
            }
            
         
            
            var from=options.system.itemsPerPage*(options.system.currentPage-1),
                to=from + options.system.filteredData.length;//Math.min(options.system.filteredData.length,options.system.itemsPerPage*options.system.currentPage);
                
                //to=options.system.displayAll?options.system.filteredData.length:to;
            
            legend.text("Showing: " + from + "-" + to +  " / " + options.system.recordCount);
            
			/*
            if(options.system.displayAll){
                return false;
            }               
			*/
			
            var pageCount=options.system.pageCount, //Math.ceil(options.system.filteredData.length/options.system.itemsPerPage),
                ul=$("<ul/>");
				
            for(var x=0;x<pageCount;x++){
                var page=x+1;
				$("<li />")
                    .append(
                        $("<a href='#" + page + "'/>")
                            .text(page)
                            .click(function(e){
                                e.preventDefault();
								
								if(options.container.hasClass("off")){
									return false;
								}
								
                                var li=$(this).closest("li");
                                
                                if (!li.hasClass("current")){
                                    li.addClass("current").siblings().removeClass("current");
                                    options.pageClick(parseInt($(this).text()))
                                }
                            })
                    )
                    .appendTo(ul);
            }            
            ul.appendTo(options.container);
            ul.find("li").eq(options.system.currentPage-1).addClass("current").find("a").focus();
			
			
			if(ul.innerWidth()<ul.get(0).scrollWidth){
				ul.css("width",350);		//IE8 fix!
				
				//adding the scrolling buttons
				$("<a class='button scrlLeft' href='#scroll left' title='Scroll left' />")
					.text("<")
					.insertBefore(ul)
					.click(function(e){
						e.preventDefault();
						scroller($(this).siblings("ul")).scrollLeft(0.5)				
					})
				
				$("<a class='button scrlRight' href='#scroll right' title='Scroll right' />")
					.text(">")
					.insertAfter(ul)
					.click(function(e){
						e.preventDefault();
						scroller($(this).siblings("ul")).scrollRight(0.5)				
					})
			}
        },
        
        createFilters:function(filters){
            // html template
            /*
            <label>
              <span>Market:</span>
              <select name="exchange">
                <option value="01">Eurex</option>
                <option value="02">Option 2</option>
                <option value="03">Option 3</option>
              </select>
            </label>
            */
            
			
			
//			var filterObj={};
//            
//            // getting only the unique values
//            for (var f in filters){
//                filterObj[filters[f]]=[];
//                var tmpObj={};  //dummy obj used to filter out dups
//                
//                for (var d in data){
//                    if(!tmpObj[data[d][filters[f]]]){
//                        filterObj[filters[f]].push(data[d][filters[f]]);
//                    }
//                    tmpObj[data[d][filters[f]]]=data[d][filters[f]];
//                }
//            }

            
            var html=[];

            
			try{
				for (var f in filters){
					var fObj=filters[f];
					
					//sorting the dropDown items                
					//fObj.sort();
					
					for (var fName in fObj){
						var wrapper=$("<label />")
							.append(
								$("<span />").text(fName + ":")
							)
							
						var dropDown=$("<select />")
										.attr("name",fName)
										.appendTo(wrapper)
						
							$("<option />")
								.attr("value","")
								.text("-- --")
								.attr("selected","selected")
								.appendTo(dropDown)                
						
						for (var opt in fObj[fName]){
							$("<option />")
								.attr({
									"value":fObj[fName][opt],
									"selected":NVision.currentSys.filters?NVision.currentSys.filters[fName]?NVision.currentSys.filters[fName]==fObj[fName][opt]:false:false
								})
								.text(fObj[fName][opt])
								.appendTo(dropDown)								
						}
									
						html.push(wrapper)						
					}
					

				}
			}catch(er){
				myConsole.alert("An error occurred while creating the filter objects!")
				console.error(er)
			}
			
			
            return html;
            
        },
        
        deleteTable:function(table){
            if(table.length==0) return false;
            
            table=table.reverse();
            
            table.each(function(){
                var tmpTable=$(this);
                var tabId=tmpTable.data("fnId");          
                
				if (tabId){
					delete(NVision.fnObj[tabId]);	
				}
                
                tmpTable.remove();                        
            }) 
        },
		  
        
        createTable:function(options,onComplete){
            /*
				container
				data
				itemsPerPage
				tableHeadings
				currentPage
				pageCount
				headClick
				rowClick
				selectRow
				showTotalOn
            */            
            var stTime=(new Date()).getTime();
			
			//console.time("table")
        
            var table=$("<table cellspacing='0'><thead></thead><tbody></tbody></table>").appendTo(options.container),
                thead=table.find("thead"),
                tbody=table.find("tbody"),                    
                hTr=[],
                bTr=[],
                head=false;
                        
                    
            if(options.rowClick){
                //if the table has a rowClick function then 
                table.data("fnId","fn_" + stTime);
				table.addClass("rowClick")
                NVision.fnObj=NVision.fnObj?NVision.fnObj:{};                
                NVision.fnObj["fn_" + stTime]=options.rowClick;
            }
        
            options.itemsPerPage=options.itemsPerPage||9999999;
			
			//displaying the trades list
			var firstItem=0,//options.itemsPerPage*(options.currentPage-1),
				itemsCount=0;
			
			doStep(firstItem,options.itemsPerPage);
			
			function doStep(first,ipp){
				
				for(var tradeIdx=0;tradeIdx<ipp && tradeIdx<options.data.length-first ;tradeIdx++){            
					
					if(tradeIdx>49){
						break;
					}
					
					itemsCount++;
					
					var trade=options.data[first+tradeIdx];
			
					if(!head){			    
						hTr.push("<tr>") 
					}
					
					bTr.push("<tr data-id='" + (first+tradeIdx) +"'>");		     //-1 to take the th in account
									
					
							
					if(options.selectRow){
								//adding the checkBox to the first cell
						if(!head){	
							hTr.push('<th><p><input title="Select/deselect all" type="checkbox" class="selectBtn" value="selectAll" /></p></th>')
						}
						bTr.push("<td class='chkbox'><input type='checkbox'/></td>");			    
					}
					
					  
					for (var cell in options.tableHeadings){
						
						var cellCaption=options.tableHeadings[cell];
						
						// skiping the ID cell
						if(cellCaption!="id"){
							//creating the table headers
							if (tradeIdx==0){
								hTr.push("<th>")
								if(options.headClick){
									hTr.push("<a href='#sort' title='sort'>")
									hTr.push("<span class='header'>" + cellCaption+"</span>")
									hTr.push("</a>")					
								}else{
									hTr.push("<span class='header'>" + cellCaption+"</span>")	
								}
								hTr.push("</th>");
							}
							
							var str=trade[cellCaption].toString().replace(/</g,"&lt;").replace(/</g,"&lt;")
							var format=utils.RealTypeOf(trade[cellCaption]);
														
							bTr.push("<td class='cell "+format+"'><span class='cellSpan'>" + str +"</span></td>")                        
						}
					}
			
					if(!head){
						hTr.push("</tr>")
					}
					
					bTr.push("</tr>");
					
					if(!head){
						$(hTr.join("")).appendTo(thead);
					}
					
					head=true;
				}
				
				if(itemsCount>=ipp || tradeIdx+first>=options.data.length ){
					//calling the callback
					finish();
				}else{					
					$(bTr.join("")).appendTo(tbody);
					
					bTr=[];
					setTimeout(function(){
						doStep(tradeIdx+first,options.itemsPerPage);
					},1)
				}
				
			}  
            
            
			function finish(){

				$(bTr.join("")).appendTo(tbody);
				   
			
				//adding the selectAll function
				thead.find("input").change(function(){
					tbody.children("tr").not(".detailsContainer").find("input:visible").attr("checked",$(this).attr("checked"))                    
					this.checked?NVision.updateEngine.stop():NVision.updateEngine.start();
				})
				
				  
				//sort
				options.headClick?
					thead.find("a")
							.click(function(e){
								e.preventDefault();
								options.headClick(this);
							})
						:
						null;
				
				//console.timeEnd("table")
				
				
				if(options.data.length>0 && options.showTotalOn){				
					var totals={};
					
					$.each(options.data,function(index,dataItem){				
						$.each(options.showTotalOn,function(index,totalItem){
							var value=dataItem[totalItem];
							value=parseInt(value*100);
							
							totals[totalItem]=totals[totalItem]?totals[totalItem]+value:value;
						})				
					})
										
					
					//creating the tableFooter
					var tr=$("<tr />")
					$.each(options.tableHeadings,function(index,dataItem){
						
						if(dataItem!="id"){
							var td=$("<td />").appendTo(tr)
		
							if(totals[dataItem]){
								td.addClass("data")
								//this is to avoid the floating numbers sum issue
								td.text(totals[dataItem]/100)
							}
						}
					})
					
					tr.appendTo($("<tfoot />").appendTo(table))
				}					
				
				if(onComplete){
					onComplete(table);
				}
			}
			
        }
    }	

}


