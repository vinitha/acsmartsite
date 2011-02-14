/* Author: 
    Alessio Carnevale
*/

$().ready(function(){
    //init. the NVision object (passing a function to be executed when the system is ready)
    NVision.init(function(){});
    
    $("select").ixDropDown();
    
    
    //setting the tabMenus up
    $("ul.tabMenu a").live("click",function(e){
        e.preventDefault();
        var $this=$(this),
            oldTab=$this.closest("li").siblings(".current"),
            oldId=oldTab.find("a").attr("hash");
        
        oldTab.removeClass("current");            
        $(oldId).removeClass("current");
        $(this).closest("li").addClass("current");
        $(this.hash).addClass("current");
    })
    
    //setting the datePicker up
    $(".datePicker").datepicker({
        inline: true
    }); 
    
})


function getBBox(obj){
    var $obj=$(obj),
        pos=$obj.position();
    return {
        width:$obj.outerWidth(),
        height:$obj.outerHeight(),
        x:pos.left,
        y:pos.top
    }
}



// this object holds the logic of the entire app.
var NVision={
    ver:"1.1",          //Used to version the positioning cookies
    systems:null,       //hashtable containing the subSystems
    currentSys:null,    //placeholder updated by showTable function
    lightBoxes:{},      //hashtable of premade lightboxes      
    adapters:null,
    links:null,
    layout:null,
    sysReady:null,     //this function gets exectuted after the json data has been processed by the client
    init:function(sysReady){
        
        
        //handling the search form
        $("#searchForm").submit(function(e){
            e.preventDefault();
            NVision.doSearch(this);
        })
        
        
        //handling the resizing event
        $(window).resize(function(){
            var w=$("#dbContent").innerWidth(),
                h=$("#dbContent").innerHeight();
            
            if ($.browser.msie){
                    
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

        })
        
        //delegating the table row click event handler
        $("tbody tr").live("click",function(e){
            
            if($(e.target).hasClass("header")){
                return false;
            };
            
            if(!$(this).hasClass("detailsContainer")&& e.target.tagName.toLowerCase()=="td"){
                var fnId=$(this).closest("table").data("fnId");
                if(NVision.fnObj[fnId]){
                    NVision.fnObj[fnId](this);
                }                
            }
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
        
        //creating the overwite lightBox
        (function(){
            var $msg=$("<div id='overwriteBox' />")
                .appendTo(hiddenBox);
            
            var form=   $("<form />").attr({
                            "action":sysConfig.overwriteRequest,
                            "id":"overwriteForm"
                        })
                        .append("<input type='hidden' id='_id' name='id' />")
                        .append("<label><span class='caption'>Trading ref.</span><input type='text' id='_tradingRef' name='Trading Ref.' value='nothing' /></label>")
                        .append("<label><span class='caption'>Trader</span><input type='text' id='_trader' name='Trader' value='nothing' /></label>")
                        .append("<div class='buttonsBar'><input type='submit' class='button submit' href='#overwrite' value='Overwrite' /> <input type='button' class='button cancel' href='#close' value='Cancel' /></div>")
                        .appendTo($msg)
                
            form.find("input.cancel").click(function(){NVision.lightBoxes["overwrite"].closeIt()})
            form.submit(function(e){
                e.preventDefault();
                
                NVision.lightBoxes["overwrite"].closeIt();                
                
                //generating the ajax request
                myAjax({
                    logMsg:null, 
                    success:function(data){
                        
                        myConsole.log("Refreshing the view...")
                        
                        //refreshing the tableView
                        NVision.updateEngine.updateNow();
                        NVision.updateEngine.start();
                        
                        var confBox={
                            title:"Overwrite confirmation",
                            yesCaption:data.code=="nok"?"Retry":"Resubmit",
                            noCaption:"Close",                    
                            onYes:function(){myConsole.log("yes")},
                            onNo:function(){myConsole.log("no")},
                            msg:data.msg,
                            msgClass:data.code=="nok"?"error":"ok" // [ok||error]
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
                                        modal:false,
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
                        .append("<div class='buttonsBar'><input class='button submit' type='submit' href='#resubmit' value='Resubmit' /> <input type='button' class='button cancel' href='#close' value='Cancel' /></div>")
                        .appendTo($msg)
                
            form.find("input.cancel").click(function(){NVision.lightBoxes["resubmit"].closeIt()})
            form.submit(function(e){
                e.preventDefault();

                NVision.lightBoxes["resubmit"].closeIt();
                
                //generating the ajax request
                myAjax({
                    logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
                    success:function(data){
                        
                        myConsole.log("Refreshing the view...")
                        
                        //refreshing the tableView
                        NVision.updateEngine.updateNow();
                        NVision.updateEngine.start();
                        
                        var confBox={
                            title:"Resubmit confirmation",
                            yesCaption:"View submitted trades",
                            noCaption:"Close",                    
                            onYes:function(){myConsole.log("yes")},
                            onNo:function(){myConsole.log("no")},
                            msg:data.msg,
                            msgClass:data.code=="nok"?"error":"ok" // [ok||error]
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
                                        modal:false,
                                        title:"Resubmit",
                                        parent:hiddenBox,
                                        onClose:null
                                    });        
        })();        
        
        NVision.sysReady=sysReady;
        
        //getting the system definition
        $.ajax({
            url:sysConfig.sysComposition,
            dataType:"json",
            error:function(XMLHttpRequest, textStatus, errorThrown){
                myConsole.error(textStatus || errorThrown);
            },
            success:function(data){
                
                //add the objects to NVision
                $(data).each(function(){
                    switch(this.type){
                        case "system":
                            if(!NVision.systems){NVision.systems={}};
                            
                            //base settings
                            this.itemsPerPage=sysConfig.tableView.itemsPerPage;                            
                            this.currentPage=1;
                            
                            //adding the system to the NVision obj
                            NVision.systems[this.name]=this;
                        break;
                                            
                        case "adapter":
                            if(!NVision.adapters){NVision.adapters={}};
                            //adding the adapter to the NVision obj
                            NVision.adapters[this.name]=this;
                        break;
                        
                        case "link":
                            if(!NVision.links){NVision.links={}};
                            //adding the link to the NVision obj
                            NVision.links[this.name]=this;
                        break;
                        
                        case "layout":
                            //adding the layout to the NVision obj
                            NVision.layout=this;
                        break;
                        
                        default :
                          if(!NVision.otherObjects){NVision.otherObjects={}};
                            //adding the otherObjects to the NVision obj
                            NVision.otherObjects[this.name]=this;                            
                        break;

                    }
                })
                                
                
                NVision.showDashboard();
                //NVision.showTable(NVision.systems.ClearVision);
                
                //firing the ready event!
                NVision.sysReady();                            
            }
        });
        
        //starting the updateEngine
        //NVision.updateEngine.start();
        
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
                .find("#_tradingRef").attr("value",tradeObj["Trading Ref."]);
                
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
        $("#backToDB").click(function(){        
            NVision.showDashboard();
        })
        
        //setting the export button
        $("#export").click(function(e){
            e.preventDefault();
            NVision.utils.exportToCSV(NVision.systems["ClearVision"].trades)
        })
        
        // setting the updateBtn function
        $("#updatesBtn").find("a").click(            
            function(){
                if($(this).hasClass("pause")){
                    NVision.updateEngine.updateNow();
                    NVision.updateEngine.start();
                }else{
                    NVision.updateEngine.stop();
                }
            }
        )
    },
    
    doSearch:function(theForm){
        $("#tableView").show(0);
        $("#tableData").empty();
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        
        // clearing the update engine
        NVision.updateEngine.empty();
        
        var searchObj={
            name:"Search results",
            currentPage:1,
            itemsPerPage:sysConfig.tableView.itemsPerPage,
            updatesInterval:1000,
            type:"searchResults",
            queryString:$(theForm).serialize()
        };
        
        NVision.currentSys=searchObj;
        
        //adding the system to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(searchObj);
        
        reqObj.url=sysConfig.searchUrl;
        reqObj.data=$(theForm).serialize();
        
        $("#updatesBtn").hide(0);
        
         NVision.updateEngine.forceStart();
         
         NVision.updateEngine.setCallback(function(){
            NVision.updateEngine.stop();
         })
        
    },
    
    showTable:function(sysObj){
        $("#tableView").show(0);
        $("#tableData").empty();
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        $("#updatesBtn").show(0);
        
        NVision.currentSys=sysObj;
        
        // clearing the update engine
        NVision.updateEngine.empty();        
        
        //adding the systems to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(sysObj);
        
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((sysObj.updatesInterval-(now-reqObj.timeStamp))/1000),
                span=$("#updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);            
        });
        
        NVision.updateEngine.forceStart();
    },
    showDashboard:function(){
        
        $("#tableView").hide(0);
        $("#toolBar").hide(0);
        $("#dashBoardView").show(0);
        $("#updatesBtn").show(0);
        
        
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

            for(var sysObj in NVision.systems){                
                sysObj=NVision.systems[sysObj];
                                
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
    
    
    //handles all the updates requests
    updateEngine:(function(){
        var tasks={},               //hash table
        engineTimer=1000,           //checks the tasks list every x millisec.
        intervalHnd=null,
        loopCallback=[],            //functions array to be executed every second
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
                
                
                if(!reqObj.timeStamp || (reqObj.timeStamp+reqObj.updatesInterval<now)){
                    
                    reqObj.timeStamp=now;
                     
                    //generating the ajax request
                    myAjax({
                        logMsg:null, //"Updating sys.: " + reqObj.attributes.callerObj.name,
                        success:reqObj.callBack,
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
            tasks:tasks
        }
        
    })(),
    
    drawSystems:function(){
        
        
        // I am using NVision._dbReady to avoid drawing the dashBoard more than one time
        if(!NVision._dbReady){
            
            var db=$("#dbContent"),
                paper = Raphael("dbContent", db.innerWidth(), db.innerHeight());
                
            //getting the user defined systems positions
            var pos=NVision.utils.getPositions(),
                positions=null;
            
            if(pos){
                positions=eval("(" + pos + ")");
            }

            for(var i in NVision.layout.objectsPos){

                var layout=NVision.layout.objectsPos[i],
                    sysObj=NVision.systems[i]||NVision.adapters[i]||NVision.otherObjects[i];                
                    objPos=positions?positions[i]:layout;

                var objDiv=$("<div />");
                
                if(pos && !objPos){
                    myConsole.alert("Custom configuration data corrupted! Reverting to default",10000);
                    eraseCookie("positions");
                    positions=null;
                    objPos=layout;
                }

                try{
                    objDiv.attr("data_name",sysObj.name)
                        .addClass(sysObj.type)
                        .css({"left":objPos.left,"top":objPos.top})
                        .append(
                            $("<h3 />")
                                .text(sysObj.name)
                        )                                      
                        .appendTo(db);
                }catch(e){
                    myConsole.alert("Systems configuration data corrupted!",10000);
                    return false;
                }

                    
                var title=objDiv
                            .find("h3").draggable({
                                draggingClass:"",
                                elementToDrag:objDiv,
                                container:db,                                    
                                onStart:function(div){
                                },
                                onMove:function(div){
                                    var pos=div.position();
                                    var sysObj=NVision.systems[div.attr("data_name")]||NVision.adapters[div.attr("data_name")]||NVision.otherObjects[div.attr("data_name")]
                                    
                                    //redrawing the links
                                    for(var link in sysObj.canvasLink){
                                        link=sysObj.canvasLink[link];
                                        paper.connection(link)
                                    }
                                },
                                onStop:function(div){
                                    NVision.utils.savePositions();
                                }
                            })
                      
                if(sysObj.type=="adapter"){
                    /*
                    objDiv.addClass("css-vertical-text");
                    
                    
                    if(!$.browser.msie){
                        objDiv.css({
                            width:title.outerHeight(),
                            height:title.outerWidth()
                        })    
                    }
                    */
                    
                }

                objDiv
                    .mouseenter(function(){
                        $(this).css("z-index",10)
                    })
                    .mouseleave(function(){
                        $(this).css("z-index",1)
                    })
                
                //adding the system attributes
                if(sysObj.type=="system"){
                    objDiv.append(
                        $("<a />")
                            .addClass("showDetails")
                            .attr("href","#" + sysObj.name)
                            .text("View breaks")
                            .click(function(){NVision.showTable(NVision.systems[this.hash.replace("#","")])})                           
                    )  
                    for (var attr in sysObj.attributes){
                        attr=sysObj.attributes[attr];
                        
                       var attrDiv=$("<div class='attr' />")
                            .insertAfter(title)
                            $("<a />")
                                .attr("href","#" + sysObj.name)
                                .addClass("more")
                                .click(function(){
                                    $(this).siblings(".other").toggle();
                                    
                                    var sysObj=NVision.systems[this.hash.replace("#","")]
                                    //redrawing the links of this object
                                    for(var link in sysObj.canvasLink){
                                        link=sysObj.canvasLink[link];
                                        paper.connection(link)
                                    }                                    
                                    return false;
                                })
                                .appendTo(attrDiv)
                                .append($("<span/>").text(attr.name + ": "))
                                .append($("<strong/>").text(attr.value))
    
                        if(attr.other){
                            for (var other in attr.other){
                                var div=$("<div class='other' />")
                                    .appendTo(attrDiv)                            
                                
                                var value=attr.other[other];
                                
                                div .append($("<span/>").text(other + ": "))
                                    .append($("<strong/>").text(value))
                                
                            }                       
                        }
                    }                             
                }                           
                
                //making a note of the containing div
                sysObj.canvasBox = objDiv.get(0)
                            
            }
            
  
            //drawing all the links
            for (var link in NVision.links){                
                
                var link=NVision.links[link],                
                    fromSys=NVision.systems[link.from]||NVision.adapters[link.from]||NVision.otherObjects[link.from],
                    toSys=NVision.systems[link.to]||NVision.adapters[link.to]||NVision.otherObjects[link.to];
                    
                    var canvasLink=paper.connection(fromSys.canvasBox,toSys.canvasBox,"#fff", "#a5bfcb|4");
                    
                    fromSys.canvasLink=fromSys.canvasLink?fromSys.canvasLink:[];
                    fromSys.canvasLink.push(canvasLink);
                    toSys.canvasLink=toSys.canvasLink?toSys.canvasLink:[];
                    toSys.canvasLink.push(canvasLink);                    
            }
            
            
            NVision._dbReady=true;
        }
        
        return true;
    },

    
    createSystemsUpdateRequests:function(){
        // looping through the subSystems list and generating updatesRequest for each system       
         for (var sysName in NVision.systems){    
            var sysObj= NVision.systems[sysName];
            
            
            //generating and adding updatesRequest
            //to the updating queue.
            var updateReq= new updateRequest({
                callerObj:sysObj,
                updatesInterval:sysObj.updatesInterval,
                id:sysObj.name,
                url:sysConfig.sysUpdates,
                data:{"sysId":sysObj.name},
                callBack:function(data){
                    var sysObj=NVision.systems[data.name];
                    
                    if(!sysObj){
                        myConsole.alert("System not found: " + data.name,10000);
                        return false;
                    }
                    sysObj.displayLevel=NVision.utils.getLevel(data.alertLevel,data.alertThreshold);
                    
                    //todo: update the rest of the object
                }
            })
            NVision.updateEngine.add(updateReq);          
        }
      
    },
    
    createBreaksUpdateRequests:function(sysObj){
        // generating breaks updatesRequest for the passed system

        var updateReq= new updateRequest({
            callerObj:sysObj,
            updatesInterval:sysObj.updatesInterval,
            id:sysObj.name,
            url:sysConfig.sysTrades,
            data:{"sysId":sysObj.name},
            callBack:function(data){
                
                //showing the system name
                var nameSpan=$("#systemName").find("span").text(data.system);
                
                /*
                if(sysObj.type=="searchResults"){
                    nameSpan.after($("<strong />").text(sysObj.queryString))
                }
                */
                
                //updating the system trades object
                sysObj.trades=data.trades;
                
                //disabling the buttons
                $("#overwriteBtn").addClass("off")
                $("#resubmitBtn").addClass("off")
                
                
                function updateTable(){
                
                    // defining the table headings
                    var tableHeadings=[]
                    for(var h in data.trades[0]){
                        tableHeadings.push(h);
                    }                                        
                                        
                    if(sysObj.sortBy){
                        //defining the column order
                        for (var x=sysObj.sortBy.length-1;x>-1;x--){
                            var h=$.inArray(sysObj.sortBy[x].name,tableHeadings);
                            tableHeadings.unshift(tableHeadings.splice(h,1)[0])
                            
                            //sorting the trades list
                            sysObj.trades.sort(function(a,b){
                                if (sysObj.sortBy[x].ascending){
                                    return a[sysObj.sortBy[x].name]>b[sysObj.sortBy[x].name]?-1:(a[sysObj.sortBy[x].name]==b[sysObj.sortBy[x].name])?0:1;    
                                }else{
                                    return a[sysObj.sortBy[x].name]>b[sysObj.sortBy[x].name]?1:(a[sysObj.sortBy[x].name]==b[sysObj.sortBy[x].name])?0:-1;    
                                }
                                
                            })
                        }
                    }
                    
                    
                    // creating the table
                    var table=NVision.utils.createTable({
                        selectRow:true,
                        container:$("#tableData").empty(),
                        data:sysObj.trades,
                        tableHeadings:tableHeadings,
                        itemsPerPage:sysObj.displayAll?9999:sysObj.itemsPerPage,
                        currentPage:sysObj.currentPage,
                        headClick:function(anchor){
                            
                            var $anchor=$(anchor);
                            var up=myConsole.chkSpeed("updateTable: ");
                            
                            sysObj.sortBy=sysObj.sortBy?sysObj.sortBy:sysObj.sortBy=[];
                            
                            // checking whether the column is already in the sort list or not
                            var sortOption=null;                                
                            $(sysObj.sortBy).each(function(index,item){
                                if(this.name==$anchor.text()){
                                    sortOption=index;
                                }
                            })
                                

                            sortOption=sysObj.sortBy[sortOption];
                                                            
                            //updating the sortBy obj                                
                            if(sortOption){
                                sortOption.ascending=!sortOption.ascending;
                            }else{
                                sysObj.sortBy.push({name:$anchor.text(),ascending:true})
                            }                            
                            
                            
                            updateTable();
                            myConsole.chkSpeed("",up)
                            
                        },
                        rowClick:function(tr){                            
                            showTradeDetails(tr)
                        }                
                    })
                    
                    
                    //hiding the checkbox for the "COMPLETED" trades
                    if(sysObj.type=="searchResults"){
                        var tr=table.find("tbody").find("tr"),
                            first=sysObj.itemsPerPage*(sysObj.currentPage-1)
                        
                        for(var x=first; x<sysObj.itemsPerPage*(sysObj.currentPage);x++){
                            var trade=sysObj.trades[x]
                            if (trade.Status=="Complete"){
                                tr.eq(x-first).addClass("complete")
                            }
                        }
                        
                    }
                    
                    //highlighting the columns I am sorting the table by
                    if(sysObj.sortBy){
                        var headers=table.find("thead").find("a");
                        for (var x=0;x<sysObj.sortBy.length;x++){                            
                            headers.eq(x)
                                .addClass(sysObj.sortBy[x].ascending?"ascending":"descending")
                                .prepend("<span class='order'/>")
                                .append(
                                    $("<span title='disable' class='remove'/>")
                                        .click(function(){
                                            var x=$(this).attr("data-idx")
                                            sysObj.sortBy.splice(x,1);
                                            updateTable();
                                        })
                                        .attr("data-idx",x)                                   
                                )
                        }
                        
                        //highlighting the sorted column cells
                        setTimeout(function(){
                            table.find("tbody tr").find("td.cell:lt(" + sysObj.sortBy.length +")").addClass("sorted")
                        },10)
                        
                    }
                   
                    
                    
                    //adding the pagination
                    NVision.utils.createPagination({                    
                        container:$("#pagination"),
                        system:sysObj,                    
                        // when the user clicks on a page numb.
                        pageClick:function(pageNum){
                            sysObj.currentPage=pageNum;
                            
                            updateTable();                    
                        }
                    })
                }
                
                updateTable();
                
            }
        })
        NVision.updateEngine.add(updateReq);
        
        return updateReq;
    
    
    
    
        //this function fetches and displays the passed trade details
        function showTradeDetails(tr){
            var $tr=$(tr),
                tradeId=NVision.currentSys.trades[tr.getAttribute("data-Id")].id;
                        
            //removing the details table 
            if($tr.next().hasClass("detailsContainer")){
                $tr.removeClass("open");
                $tr.next().remove();
                
                NVision.updateEngine.start();
            }else{
                NVision.updateEngine.stop();
                
                //generating the ajax request
                $tr.addClass("open");
                myAjax({
                    data:{"tradeId":tradeId},
                    //logMsg:"Getting the breaks details for trade: " + tradeId,
                    success:function(data){
                        var messageData=data;
                        
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
                                /*
                                var doc=window.open("","_blank",'width=800,height=400,resizable=yes,scrollbars=yes').document,
                                    $doc=$(doc);
                                    
                                    //adding the css rules defined in the popup.css
                                    var sheet=$("#_popup").attr("sheet")||$("#_popup").attr("styleSheet"),
                                        r=sheet.cssRules||sheet.rules;
                                        
                                    var rules=$.map(r,function(item,index){                                        
                                        return item.cssText||(item.selectorText + "{" + item.style.cssText + "}");
                                    });
                                    
                                    $doc.find("head").append("<style type='text/css'>" + rules.join("\n") + "</style>");
                                    
                                
                                //setting the window title    
                                doc.title="Message detail View";
                                */
                                var msgId=$(tr).attr("data-id");

                                myAjax({
                                    data:{"msgId":messageData.details[msgId].id},
                                    success:function(msgDetails){
                                        
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
                                                $("<ul/>").addClass("tabMenu")
                                                    .append($("<li class='current'><a href='#_msg_raw'><span>Raw message:</span></a></li>"))                                            
                                                    .append($("<li><a href='#_msg_in'><span>Incoming:</span></a></li>"))
                                                    .append($("<li><a href='#_msg_out'><span>Outgoing:</span></a></li>"))                                            
                                                    .append($("<li><a href='#_msg_steps'><span>Steps:</span></a></li>"))                                            
                                            )
                                            
                                            
                                            .append($("<p class='tabContent current' id='_msg_raw'/>").text(msgDetails["Raw message"]))
                                            .append($("<p class='tabContent' id='_msg_in'/>").text(msgDetails["Incoming"]))
                                            .append($("<p class='tabContent' id='_msg_out'/>").text(msgDetails["Outgoing"]))
                                            
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
                                    },
                                    url:sysConfig.msgDetails
                                })
                                
                                
                            },
                            headClick:null                        
                        })
                        
                        //replacing ok/nok with icons
                        $.each(table.find("tbody tr"),function(){
                                var td=$(this).children().eq(0),
                                    text=td.text();
                                    
                                td.empty().addClass("status");                                
                                $(this).addClass(text);                                
                            })
                    },
                    url:sysConfig.tradeDetails
                })    
            }                           
        }
    },
    
    utils:{
        getLevel:function(lev,thr){
            //function to map the percentage with the error level
            return lev<thr/2?0:lev<thr?1:2;        
        },
        
        savePositions:function(){
            var objs=[];
            for (obj in NVision.adapters){
                
                var pos=$(NVision.adapters[obj].canvasBox).position();
                
                objs.push(
                    '"' + obj + '":{' + '"left":' + pos.left + ',"top":' + pos.top +"}"
                )
            }
            for (obj in NVision.systems){
                var pos=$(NVision.systems[obj].canvasBox).position();
                
                objs.push(
                    '"' + obj + '":{' + '"left":' + pos.left + ',"top":' + pos.top +"}"
                )               
            }
            for (obj in NVision.otherObjects){
                var pos=$(NVision.otherObjects[obj].canvasBox).position();
                
                objs.push(
                    '"' + obj + '":{' + '"left":' + pos.left + ',"top":' + pos.top +"}"
                )               
            }
            
            createCookie("ver",NVision.ver,999);            
            createCookie("positions","{" + objs.join(",") + "}",999);
        },
        
        getPositions:function(){
            var ver=readCookie("ver"),
                pos=readCookie("positions");
                
                if(ver!=NVision.ver){
                    myConsole.log("System updated to ver: " + NVision.ver,10000)
                }
            
            return (ver==NVision.ver)?pos:null;
        },
        
        exportToCSV:function(data){
            var strArr=[];
            for(var d in data){
                strArr.push(data[d])
            }
            var ifr=$("#saveAs").get(0);                    
            
            var oDoc = ifr.contentWindow || ifr.contentDocument;
            if (oDoc.document) {
                oDoc = oDoc.document;
            }
            
            oDoc.designMode = 'on';

            var oDoc=oDoc.open("text/html","replace");
            oDoc.write(strArr.join(","));
            oDoc.close();
            oDoc.execCommand("saveas", false, "NVision.txt");            
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
                    .click(function(){
                        var $this=$(this);
                        
                        options.system.displayAll=options.system.displayAll?false:true;
                        
                        $this.text(options.system.displayAll?"Paginate":"Display all")
                        options.pageClick(1);                    
                    })
                    .appendTo(options.container)
                    
            if(options.system.trades.length==0){
                return false;
            }
            
         
            
            var from=options.system.itemsPerPage*(options.system.currentPage-1)+1,
                to=Math.min(options.system.trades.length,options.system.itemsPerPage*options.system.currentPage);
                
                to=options.system.displayAll?options.system.trades.length:to;
            
            legend.text("Showing: " + from + "-" + to +  " / " + options.system.trades.length)
            
            if(options.system.displayAll){
                return false;
            }               
            
            var pageCount=Math.ceil(options.system.trades.length/options.system.itemsPerPage),
                ul=$("<ul/>");
                
            for(var x=0;x<pageCount;x++){
                var page=x+1;                
                $("<li/>")
                    .append(
                        $("<a href='#" + page + "'/>")
                            .text(page)
                            .click(function(){
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


