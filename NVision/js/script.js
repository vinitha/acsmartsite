/* Author: 
    Alessio Carnevale
*/


//enabling the browser history buttons
$(function(){
    // Bind the event.
    $(window).bind("hashchange",function(){
		
        var newStatus=$.deparam($.param.fragment())

        //setting the business market (it's the Id used to identify the business market whose data the user is seeing)
        if(!newStatus.BM && NVision.appStatus.BM==undefined){
            myConsole.alert("Business Market undefined!")
            return false;
        }
        NVision.appStatus.BM=newStatus.BM||NVision.appStatus.BM;
        	
		
		//normalising the appStatus
		if(!newStatus.tabId){
			newStatus.tabId="tab_1";
			newStatus.view={type:"dashBoard"};
		}
		
        
        //updating the tabMenu
        if(NVision.appStatus.tabId!=newStatus.tabId){            
            $("#mainMenu").trigger("showTab",newStatus.tabId);
        }
        
        //if there's no view defined than exit
        if(!newStatus.view) {
            
            //running the tabMenu callbacks
            NVision.tabMenuCallback[newStatus.tabId]();
            
            NVision.appStatus.currentTab=newStatus.tabId;
            NVision.appStatus[NVision.appStatus.currentTab]={tabId:NVision.appStatus.currentTab, BM:NVision.appStatus.BM}
                        
            return false;
        }
        
        
        //updating the view
        if(!NVision.appStatus.view || NVision.appStatus.view.type!=newStatus.view.type){
            switch(newStatus.view.type){
                case "dashBoard":
                    NVision.showDashboard();
                break;
                
                case "adapter":
                    if(!NVision.appStatus.view || NVision.appStatus.view.sysName!=newStatus.view.sysName){
                        var sysName=newStatus.view.sysName,
                            sysObj=NVision.adapters[sysName],
							btn=$("#resubmitted");
							
							NVision.currentSys=sysObj;
							
                        if(sysObj){
							if(newStatus.view.resubmitted=="true"){
								NVision.showResubmitted();
								btn.text("< Back to the brakes view");
								btn.data("resubmitted",true)								
							}else{
								NVision.showTable(sysObj)
								btn.text("View resubmitted Trades");
								btn.data("resubmitted",false)							
							}							
                        }else{
                            myConsole.alert("Unknown adapter [" + sysName +"]; ignored!")
                        }
                    }
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
            
                default:
                    myConsole.alert("Unknown bookmark ignored!")                        
                break;
            }        
        }
        
        //updating the current appStatus
        NVision.appStatus[NVision.appStatus.currentTab]=newStatus;        
        $("#main").css("zoom",1)  //this is needed to fix an IE7 layout issue (WTF!)
    })
	
});


        
		
		
$().ready(function(){
    
	if(NVision.appStatus.BM==undefined){
		NVision.appStatus={
			BM:location.search.split("=")[1]
		}
	}
	
	if(NVision.appStatus.BM==undefined){
		myConsole.alert("Business Market undefined!")
		return false;
	}
	
    //init. the NVision object (passing a function to be executed when the system is ready)
    NVision.init(function(){
		$(window).trigger("hashchange")       
        $(window).resize()        
    });
    
    
    //setting the main tabMenus custom events
    var tabMenu=$("#mainMenu");
    tabMenu.bind("showTab",function(e,tabId){
            var $a=tabMenu.find("a[href='#" + tabId + "']"),
                oldTab=$a.closest("li").siblings(".current"),
                oldId=oldTab.find("a").attr("hash");
            
            oldTab.removeClass("current");            
            $(oldId).removeClass("current");
            $a.closest("li").addClass("current");
            $("#" + tabId).addClass("current");
        })
    
    tabMenu.find("a").live("click",function(e){
        e.preventDefault();           
        
        NVision.appStatus.currentTab=this.hash.replace("#","");
        
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
            oldId=oldTab.find("a").attr("hash");
        
        oldTab.removeClass("current");            
        $(oldId).removeClass("current");
        $a.closest("li").addClass("current");
        $(this.hash).addClass("current");        
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
        
    /*
    //pulse BG "animation"
    setTimeout(function(){
        var fx=$("<div/>")
                    .appendTo($("h1"))
                    .addClass("bgFX")            
                    .fadeTo(2000,1,function(){fx.fadeTo(2000,0.2,function(){fx.fadeTo(600,1)})})    
    },1000)
    */

})



// this object holds the logic of the entire app.
var NVision={
    ver:263,                //testers will log this number in the bugs report
    zoomLevel:0,            //ranges between -1 (125%) and 3 (25%)
    zoomFactor:1,           //the dashBoard elements size/position is multiplied by this value
    appStatus:{},           //this object holds the app status and is used to optimise the browser history navigation
    systems:null,           //hashtable containing the subSystems
    currentSys:null,        //placeholder updated by showTable function
    lightBoxes:{},          //hashtable of premade lightboxes      
    adapters:null,
    links:null,
    //layout:null,
    sysReady:null,          //this function gets exectuted after the json data has been processed by the client
    tabMenuCallback:{       //this Object defines the tabMenu callbacks to get executed when the usere clicks on it
        tab_1:function(){
            
            NVision.updateEngine.forceStart();
            
            //checking if the tab content has already been initialised
            if($("#tab_1").children(":visible").length==0){
                //if not then runs its init function
                NVision.showDashboard()
            }            
            
        },
        
        tab_2:function(){
            NVision.updateEngine.stop();
            myConsole.alert("Please define tab_2 default content")
        },
        
        tab_3:function(){
            NVision.updateEngine.stop();
            myConsole.alert("Please define tab_3 default content")
        }
    },
    init:function(sysReady){
        
        NVision.sysReady=sysReady;
        
        //showing the version number
        $("#sysVer .frontEnd").text(NVision.ver);
        
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
            /*
            var newStatus = {
                tabId:"tab_1",
                view:{type:"search",query:qs}
            }
            */
            NVision.appStatus[NVision.appStatus.currentTab].view={type:"search",query:qs}
            
            $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);         
            
            //collapsing the advanced search
            $(theForm).find("a.advPanel").trigger("hideAdv");
        })
        
        
        //handling the resizing event
        $(window).resize(function(){
            
            var h=$("html").innerHeight()-$("#filtersView").innerHeight()-$("#header").innerHeight()-11;   //11 is the #main margin bottom + 1px border
        
            $("div.tabContent").css("height",h);
            
        })
        
        //delegating the table row click event handler
        $("tbody tr").live("click",function(e){
            
            if($(e.target).hasClass("header")){
                return false;
            };
            
            if(!$(this).hasClass("detailsContainer")&& e.target.tagName.toLowerCase()=="td"){
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
        
        //creating the overwrite lightBox
        (function(){
            var $msg=$("<div id='overwriteBox' />")
                .appendTo(hiddenBox);
            
            var form=   $("<form />").attr({
                            "action":sysConfig.overwriteRequest,
                            "id":"overwriteForm"
                        })
                        .append("<input type='hidden' id='_id' name='id' />")
                        .append("<label><span class='caption'>Trading ref</span><input type='text' id='_tradingRef' name='tradingRef' value='nothing' /></label>")
                        .append("<label><span class='caption'>Trader</span><input type='text' id='_trader' name='trader' value='nothing' /></label>")
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
                            yesCaption:data.code=="nok"?"Retry":"Resubmit",
                            noCaption:"Close",                    
                            onYes:function(){
								if(data.code=="nok"){
									$("#overwriteBtn").click();
								}else{
									$("#resubmitBtn").click();
								}
							},
                            onNo:function(){
								if(data.code!="nok"){
									myConsole.log("Refreshing the view...")
									
									//refreshing the tableView
									NVision.updateEngine.updateNow();
									NVision.updateEngine.start();
								}							
							},
                            msg:data.msg,
                            msgClass:data.code=="nok"?"error":"ok", // [ok||error]
							onClose:null
                        }
                        
                        confirm(confBox);
                    
                    },
                    error:function(a,b,c){
                        myConsole.log(a,b,c)
                    },
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
                            onYes:function(){
																
								NVision.appStatus[NVision.appStatus.currentTab].view.resubmitted=true;
								$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);
									
							},
                            onNo:function(){
								myConsole.log("Refreshing the view...")
								
								//refreshing the tableView
								NVision.updateEngine.updateNow();
								NVision.updateEngine.start();								
							},
                            msg:data.msg,
                            msgClass:data.code=="nok"?"error":"ok", // [ok||error]
							onClose:null
                        }
                        
                        confirm(confBox);
                    
                    },
                    error:function(a,b,c){
                        myConsole.log(a,b,c)
                    },
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
                
				
		$("#businessMarket strong").addClass("loading").text("loading...")
        
        //getting the system definition
        myAjax({
            logMsg:null,
            url:sysConfig.sysComposition,
            error:function(XMLHttpRequest, textStatus, errorThrown){
                myConsole.error(textStatus || errorThrown);
            },
            success:function(dataObj){
                
                $("#businessMarket strong").text(dataObj.bm).removeClass("loading");
                //showin the version number
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
                        
                        /*
                        case "layout":
                            //adding the layout to the NVision obj
                            NVision.layout=this;
                        break;
                        */
                        
                        case "exchange":
                          if(!NVision.otherObjects){NVision.otherObjects={}};
                            //adding the exchange to the NVision obj
                            NVision.otherObjects[this.id]=new exchange(this);
                        break;                    
                        
                        default :
                          if(!NVision.otherObjects){NVision.otherObjects={}};
                            //adding the otherObjects to the NVision obj
                            NVision.otherObjects[this.id]=new baseObj(this);                            
                        break;

                    }
                })
                                
                                
                //firing the ready event!
                NVision.sysReady();
                
                
                //setting the zoom level to 100%
                NVision.zoom(0);
            }
        });
        
        
        // setting the buttons function up
            $("#overwriteBtn").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                //getting the trade object from the selected row
                var tradeObj=NVision.currentSys.trades[($("#tableData").find("input:checked").closest("tr").attr("data-id"))]
				
                //showing the Overwrite Overlay
                NVision.lightBoxes["overwrite"]                    
                .show()
                .find("#_id").attr("value",tradeObj["id"]).end()
                .find("#_trader").attr("value",tradeObj["Trader"]).end()
                .find("#_tradingRef").attr("value",tradeObj["Trading Ref"]);                
            });
            
            $("#resubmitBtn").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                //getting the trade objects from the selected row
                var checked=$.map($("#tableData").find("input:checked"),function(item,index){
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
                    .find("#_comment").attr("value","").end()
                    .find("#_reason").find("option").eq(0).attr("selected",true);
            });
			
			//View Resubmitted trades
			$("#resubmitted").live("click",function(e){
				e.preventDefault();
				
				var $this=$(this);
				
				if($("#tableView").hasClass("off")){
					return false;								
				}
				
				NVision.currentSys.currentPage=1;
				
				NVision.appStatus[NVision.appStatus.currentTab].view.resubmitted=$this.data("resubmitted")?false:true;
				$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2); 				
			})
            
            $("#tableData input[type='checkbox']").live("change",function(){
                var chkBox=$("#tableData").find("tbody input[type='checkbox']"),
                    checkedCount=chkBox.filter("input:checked").length;                
                                
                //setting the updateEngine
                if(this.checked){
                    if(checkedCount==1){NVision.updateEngine.stop()}
                }else{
                    if(checkedCount==0){NVision.updateEngine.start()}
                };                
                
                //select all checkbox
                (checkedCount==0)?$("#selectBtn").attr("checked",false):null;
                (checkedCount==chkBox.length)?$("#selectBtn").attr("checked",true):null;
                
                
                //overwrite button
                (checkedCount==1) ?
                    
                    $("#overwriteBtn").removeClass("off")
                :
                    $("#overwriteBtn").addClass("off");
                    
                //resubmit button
                (checkedCount==0) ?
                    $("#resubmitBtn").addClass("off")                                      
                :
                    $("#resubmitBtn").removeClass("off");
            })
            
        //setting the back button
        $("#backToDB").click(function(e){
            e.preventDefault();
            
			if($("#tableView").hasClass("off")){
				return false;
			}
			
            NVision.appStatus[NVision.appStatus.currentTab].view={type:"dashBoard"};            
            $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);
            
        })
        
        //setting the export button
        $("#export").click(function(e){
            e.preventDefault();
			if ($("#tableView").hasClass("off")){
				return false;
			}
            NVision.utils.exportToCSV(NVision.currentSys.trades)
        })
        
        //setting the print button
        $("#bcBar .print").click(function(e){
            e.preventDefault();
			if ($("#tableView").hasClass("off")){
				return false;
			}
            window.print();
        })
		
        // setting the updateBtn function
        $("#updatesBtn").find("a").click(            
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
    },
    
    doSearch:function(qs){
        $("#tableView").show(0);        
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        $("#dbTools").hide(0);       
        
        // clearing the update engine
        NVision.updateEngine.empty();
        
        NVision.utils.deleteTable($("#tableData").find("table"));
        
        //setting the table title....
        $("#systemName span")
            .addClass("loading")
            .text("searching...")
        
        var search=new searchObj({
            name:"Search results:",
            id:"searchResults",
            currentPage:1,
            itemsPerPage:sysConfig.tableView.itemsPerPage,
            updateInterval:10000,
            type:"searchResults",
            queryString:qs
        });
        
        NVision.currentSys=search;
                
        
        //adding the searchObj to the updates queue
        var reqObj=NVision.createSearchRequest(search);
                
        $("#updatesBtn").hide(0);
        
         NVision.updateEngine.forceStart();
         
        
        NVision.updateEngine.onNewData(function(){
            $("#systemName span").removeClass("loading")
            NVision.updateEngine.stop();
        })         
    },
    
    showTable:function(sysObj){
        $("#tableView").show(0);        
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        $("#updatesBtn").show(0);
        $("#dbTools").hide(0);
        
        //setting the table title....
        $("#systemName span")
            .addClass("loading")
			.removeClass("resub")
            .text("loading data...");
			
		$("#tableView").addClass("off");
        
        NVision.utils.deleteTable($("#tableData").find("table"));
        
        NVision.currentSys=sysObj;
		sysObj.currentPage=1;
        
        //clearing the filters
        delete(sysObj.filters);
        delete(sysObj.filteredData)
        
        // clearing the update engine
        NVision.updateEngine.empty();        
        
        //adding the systems to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(sysObj);
        
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((sysObj.updateInterval-(now-reqObj.timeStamp))/1000),
                span=$("#updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.onNewData(function(){
            $("#systemName span")                
                .removeClass("loading");
			
			$("#tableView").removeClass("off");
        })
        
        NVision.updateEngine.forceStart();
    },
    
    showDashboard:function(){
        
        $("#tableView").hide(0);
        $("#toolBar").hide(0);
        $("#dashBoardView").show(0);
        $("#updatesBtn").show(0);
        $("#dbTools").show(0);        
        
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
        $("#tableView").show(0);        
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        $("#updatesBtn").show(0);
        $("#dbTools").hide(0);
		
		NVision.updateEngine.empty();
		
		//styling the #systemName
		$("#systemName span")
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
				span=$("#updatesBtn").find("span"),
				value=parseInt(span.text());
				
			if(value<timer){
				span.parent().addClass("on")
			}else{
				span.parent().removeClass("on")
			}

			span.text(timer);            
		});
		
        NVision.updateEngine.onNewData(function(){
            $("#systemName span")
				.addClass("resub")
				.removeClass("loading");
				
			$("#tableView").removeClass("off");
        })		
		
		NVision.updateEngine.forceStart();		
	},
    
    
    //handles all the updates requests
    updateEngine:(function(){
        var tasks={},               //hash table
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
                $("#updatesBtn").find("a").removeClass("pause");
                
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
                $("#updatesBtn").find("a").addClass("pause")
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
                                
                if(!reqObj.timeStamp || (reqObj.timeStamp+reqObj.updateInterval<now)){                    
                    
                    var cb=$(reqObj.callerObj.canvasBox);
                    
                    cb.addClass("updating");
                    
                    reqObj.timeStamp=now;

                    //generating the ajax request
                    myAjax({
                        logMsg:null,//"Updating sys.: " + reqObj.callerObj.name,
                        success:function(data){
                            
                            //executing the newDataCallbacks
                            for (var f in newDataCallback){
                                //executing and removing it
                                newDataCallback[f]();
                                newDataCallback.splice(f,1);                                
                            }

                            var reqObj=tasks[data.id]

                            if(!reqObj){
                                myConsole.alert("Unexpected data received: " + data.id)
                                return false;
                            }
                            reqObj.callBack(data);
                            
                            var cb=$(reqObj.callerObj.canvasBox);
                            
                            setTimeout(function(){
                                cb.removeClass("updating");
                            },1000)
                            
                        }
                        ,
                        error:function(a,b,c){
                            myConsole.log(a,b,c)
                        },
                        url:reqObj.url,
                        data:reqObj.data
                    })
                }                
            }
            
            //executing the callbacks
            for(var f in loopCallback){
                loopCallback[f]();
            }            
                        
        },
        updateNow=function(){
            //reseting the timeStamp values
            for(var reqObj in tasks){
                tasks[reqObj].timeStamp=null;
            }
            
            //calling the update function
            update();
        },
        empty=function(){
            tasks={};
            loopCallback=[];
        },
        
        setCallback=function(fn){
            //this function is executed every second
            loopCallback.push(fn);
        },
        
        onNewData=function(opt){
            
            //this functions are executed whenever new data is available
            newDataCallback.push(opt)
        };        ;
        
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
            onNewData:onNewData
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
            NVision.redrawLinks(objects);
            
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
        
        //putting all the dashboard objects together
        objects=$.extend(objects,NVision.adapters);
        objects=$.extend(objects,NVision.systems);
        objects=$.extend(objects,NVision.otherObjects);
        
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
            
            var objects={};
                //putting all the dashboard objects together
                objects=$.extend(objects,NVision.adapters);
                objects=$.extend(objects,NVision.systems);
                objects=$.extend(objects,NVision.otherObjects);

            for(var i in objects){
                var obj=objects[i],
                    layout={left:obj.left||0,top:obj.top||0},
                    //objToDraw=NVision.systems[i]||NVision.adapters[i]||NVision.otherObjects[i],               
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
        //drawing all the links
        for (var link in NVision.links){                
            
            var link=NVision.links[link],                
                fromSys=NVision.systems[link.from]||NVision.adapters[link.from]||NVision.otherObjects[link.from],
                toSys=NVision.systems[link.to]||NVision.adapters[link.to]||NVision.otherObjects[link.to];
                
                
                
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
            objects={};
            
            //putting al the dashboard objects together
            objects=$.extend(objects,NVision.adapters);
            objects=$.extend(objects,NVision.systems);
            objects=$.extend(objects,NVision.otherObjects);
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
            
            //generating and adding updatesRequest
            //to the updating queue.
            var updateReq= new updateRequest({
                callerObj:sysObj,
                updateInterval:sysObj.updateInterval,
                id:sysObj.id,
                url:sysConfig.sysUpdates,
                data:{"sysId":sysObj.id},
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

        var updateReq= new updateRequest({
            callerObj:searchObj,
            updateInterval:searchObj.updateInterval,
            id:searchObj.id,
            url:sysConfig.searchUrl,
            data:searchObj.queryString,
            callBack:function(data){
                
                searchObj.currentPage=1;
                NVision.utils.showObjTrades(data,$("#tableData"),$("#pagination"),$("#tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;    
    },
    
    createBreaksUpdateRequests:function(sysObj){
        // generating breaks updatesRequest for the passed system

        var updateReq= new updateRequest({
            callerObj:sysObj,
            updateInterval:sysObj.updateInterval,
            id:sysObj.id,
            url:sysConfig.sysTrades,
            data:{"sysId":sysObj.id},
            callBack:function(data){
                NVision.utils.showObjTrades(data,$("#tableData"),$("#pagination"),$("#tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;
    
    },
	
	createResubmittedRequest:function(sysObj){
        // generating breaks updatesRequest for the passed system

        var updateReq= new updateRequest({
            callerObj:sysObj,
            updateInterval:sysObj.updateInterval,
            id:sysObj.id,
            url:sysConfig.resubmittedTrades,
            data:{"sysId":sysObj.id},
            callBack:function(data){
                NVision.utils.showObjResubmitted(data,$("#tableData"),$("#pagination"),$("#tradesFilters"))
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;		
	},
    
    utils:{
        checkDbSize:function(){
            
            var objects={}
            
            //putting al the dashboard objects together
            objects=$.extend(objects,NVision.adapters);
            objects=$.extend(objects,NVision.systems);
            objects=$.extend(objects,NVision.otherObjects);
            
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
        
        showObjTrades:function(data,tableContainer,paginationContainer,filtersContainer){

            //showing the adapter name
            var nameSpan=$("#systemName").find("span").text(data.name),
                sysObj=NVision.currentSys;

            //updating the system trades object
            sysObj.trades=data.trades;
            
            //clearing the filters
            delete(sysObj.filters)
            delete(sysObj.filteredData)
            
            
            //disabling the buttons
            $("#overwriteBtn").addClass("off")
            $("#resubmitBtn").addClass("off")
            
            
            //clearing and recreating the table
            NVision.utils.deleteTable(tableContainer.find("table"))
            sysObj.showTrades(tableContainer,paginationContainer)
            
            
            //creating the filters html
            var html=NVision.utils.createFilters(data.trades,data.filters),                
                filtersDiv=filtersContainer.empty();
            
            for(var filter in html){
                filtersDiv.append(html[filter])
                html[filter].find("select").change(function(){
                    var selectObj=$(this);                        
					
					if($("#tableView").hasClass("off")){
						return false;
					}              
                    sysObj.filters=sysObj.filters?sysObj.filters:{};
                    if(selectObj.val()==""){
                        delete(sysObj.filters[selectObj.attr("name")]);
                        NVision.updateEngine.start();
                    }else{
                        sysObj.filters[selectObj.attr("name")]=selectObj.val();
                        NVision.updateEngine.stop();
                    }
                    
                    //moving to page 1
                    sysObj.currentPage=1;
                                            
                    sysObj.showTrades(tableContainer,paginationContainer)
                })
            }
            
        },
		
		showObjResubmitted:function(data,tableContainer,paginationContainer,filtersContainer){

            //showing the adapter name
            var nameSpan=$("#systemName").find("span").text(data.name),
                sysObj=NVision.currentSys;

            //updating the system resubmitted object
            sysObj.resubmitted=data.trades;
            
            //clearing the filters
            delete(sysObj.filters)
            delete(sysObj.filteredData)
            
            
            //disabling the buttons
            $("#overwriteBtn").addClass("off")
            $("#resubmitBtn").addClass("off")
            
            
            //clearing and recreating the table
            NVision.utils.deleteTable(tableContainer.find("table"))
            sysObj.showResubmitted(tableContainer,paginationContainer)
            
            
            //creating the filters html
            var html=NVision.utils.createFilters(data.trades,data.filters),                
                filtersDiv=filtersContainer.empty();
            
            for(var filter in html){
                filtersDiv.append(html[filter])
                html[filter].find("select").change(function(){
                    var selectObj=$(this);                        
                    
					if($("#tableView").hasClass("off")){
						return false;
					}
					                        
                    sysObj.filters=sysObj.filters?sysObj.filters:{};
                    if(selectObj.val()==""){
                        delete(sysObj.filters[selectObj.attr("name")]);
                        NVision.updateEngine.start();
                    }else{
                        sysObj.filters[selectObj.attr("name")]=selectObj.val();
                        NVision.updateEngine.stop();
                    }
                    
                    //moving to page 1
                    sysObj.currentPage=1;
                                            
                    sysObj.showResubmitted(tableContainer,paginationContainer)
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
                objects={}
            
            //putting all the dashboard objects together
            objects=$.extend(objects,NVision.adapters);
            objects=$.extend(objects,NVision.systems);
            objects=$.extend(objects,NVision.otherObjects);            
            
            
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
                    

            
            
            //adding the "displayAll" button
            var all=$("<a />")
                    .addClass("showAll button")
                    .text(options.system.displayAll?"Paginate":"Display all")
                    .click(function(e){
                        e.preventDefault();
                        var $this=$(this);
						
						if($("#tableView").hasClass("off")){
							return false;
						}
                        
						options.system.displayAll=options.system.displayAll?false:true;
                        
                        $this.text(options.system.displayAll?"Paginate":"Display all")
                        options.pageClick(1);                    
                    })
                    .appendTo(options.container)
                    
            if(options.system.filteredData.length==0){
                return false;
            }
            
         
            
            var from=options.system.itemsPerPage*(options.system.currentPage-1),
                to=Math.min(options.system.filteredData.length,options.system.itemsPerPage*options.system.currentPage);
                
                to=options.system.displayAll?options.system.filteredData.length:to;
            
            legend.text("Showing: " + (from+1) + "-" + to +  " / " + options.system.filteredData.length)
            
            if(options.system.displayAll){
                return false;
            }               
            
            var pageCount=Math.ceil(options.system.filteredData.length/options.system.itemsPerPage),
                ul=$("<ul/>");
                
            for(var x=0;x<pageCount;x++){
                var page=x+1;                
                $("<li/>")
                    .append(
                        $("<a href='#" + page + "'/>")
                            .text(page)
                            .click(function(e){
                                e.preventDefault();
								
								if($("#tableView").hasClass("off")){
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
            ul.find("li").eq(options.system.currentPage-1).addClass("current")
        },
        
        createFilters:function(data,filters){
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
            var filterObj={};
            
           
            // getting only the unique values
            for (var f in filters){
                filterObj[filters[f]]=[];
                var tmpObj={};  //dummy obj used to filter out dups
                
                for (var d in data){
                    if(!tmpObj[data[d][filters[f]]]){
                        filterObj[filters[f]].push(data[d][filters[f]]);
                    }
                    tmpObj[data[d][filters[f]]]=data[d][filters[f]];
                }
            }

            
            var html=[];
            
            for (var f in filterObj){
                var fObj=filterObj[f];
                
                //sorting the dropDown items                
                fObj.sort();
                
                var wrapper=$("<label />")
                    .append(
                        $("<span />").text(f + ":")
                    )
                    
                var dropDown=$("<select />")
                                .attr("name",f)
                                .appendTo(wrapper)
                
                    $("<option />")
                        .attr("value","")
                        .text("-- --")
                        .attr("selected","selected")
                        .appendTo(dropDown)                
                
                for (var opt in fObj){
                    $("<option />")
                        .attr("value",fObj[opt])
                        .text(fObj[opt])
                        .appendTo(dropDown)
                }
                            
                html.push(wrapper)
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
                
        
        createTable:function(options){
            /*
            container
            data
            itemsPerPage
            tableHeadings
            currentPage
            headClick
            rowClick
            selectRow
            */            
            var stTime=(new Date()).getTime();
			
        
            var table=$("<table cellspacing='0'><thead></thead><tbody></tbody></table>"),
                thead=table.find("thead"),
                tbody=table.find("tbody"),                    
                hTr=[],
                bTr=[],
                head=false;
                        
                    
            if(options.rowClick){
                //if the table has a rowClick function then 
                table.data("fnId","fn_" + stTime);                
                NVision.fnObj=NVision.fnObj?NVision.fnObj:{};                
                NVision.fnObj["fn_" + stTime]=options.rowClick;
            }
        
            options.itemsPerPage=options.itemsPerPage||9999999;
            
            //displaying the trades list
            var first=options.itemsPerPage*(options.currentPage-1);
               
            for(var tradeIdx=0;tradeIdx<options.itemsPerPage && tradeIdx<options.data.length-first ;tradeIdx++){            
                
                var trade=options.data[first+tradeIdx];
        
                if(!head){			    
                    hTr.push("<tr>") 
                }
                
                bTr.push("<tr data-id='" + (first+tradeIdx) +"'>");		     //-1 to take the th in account
                                
                
                        
                if(options.selectRow){
                            //adding the checkBox to the first cell
                    if(!head){	
                        hTr.push('<th><p><input title="Select/deselect all" type="checkbox" id="selectBtn" value="selectAll" /></p></th>')
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
                        
                        bTr.push("<td class='cell'>" +trade[cellCaption] +"</td>")                        
                    }
                }
        
                if(!head){
                    hTr.push("</tr>")
                }
                
                bTr.push("</tr>");
                
                head=true;
            }
                   
            
            
            thead.html(hTr.join(""));
            tbody.html(bTr.join(""));
            
                  
            table.appendTo(options.container);    
        
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
        
            return table;
        }
    }	

}


