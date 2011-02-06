/* Author: 
    Alessio Carnevale
*/

$().ready(function(){
    //init. the NVision object (passing a function to be executed when the system is ready)
    NVision.init(function(){});
    
    $("select").ixDropDown();
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
    systems:null,       //hashtable containing the subSystems
    currentSys:null,    //placeholder updated by showTable function
    lightBoxes:{},      //hashtable of premade lightboxes      
    adapters:null,
    links:null,
    layout:null,
    sysReady:null,     //this function gets exectuted after the json data has been processed by the client
    init:function(sysReady){
        
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
                
                myConsole.log("todo: " + form.serialize(),10000)
                NVision.lightBoxes["overwrite"].closeIt();
                
                //todo: waiting for the response and showing a confirm box
                var confBox={
                    title:"Overwrite confirmation",
                    yesCaption:"Retry",
                    noCaption:"Close",                    
                    onYes:function(){myConsole.log("yes")},
                    onNo:function(){myConsole.log("no")},
                    msg:"Error xyz occured. Retry overwriting now?",
                    msgClass:"error" // [ok||error]
                }
                
                
                setTimeout(function(){
                    confirm(confBox);
                },1000)                
                
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
                myConsole.log("todo: " + form.serialize(),10000)
                NVision.lightBoxes["resubmit"].closeIt();
                
                //todo: waiting for the response and showing a confirm box
                var confBox={
                    title:"Resubmit confirmation",
                    yesCaption:"View submitted trades",
                    noCaption:"Close",                    
                    onYes:function(){myConsole.log("yes")},
                    onNo:function(){myConsole.log("no")},
                    msg:"Message has been successfully resubmitted.",
                    msgClass:"ok" // [ok||error]
                }
                
                
                setTimeout(function(){
                    confirm(confBox);
                },1000)
                
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
                            if(!NVision.layout){NVision.layout={}};
                            //adding the layout to the NVision obj
                            NVision.layout=this;
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
    
    showTable:function(sysObj){
        $("#tableView").show(0);
        $("#toolBar").show(0);
        $("#dashBoardView").hide(0);
        
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
        
        // clearing the update engine
        NVision.updateEngine.empty();
        
        
        //drawing the subSystem panels
        NVision.drawSystems()
        
        //adding the systems to the updates queue
        NVision.createSystemsUpdateRequests();
        
        NVision.updateEngine.forceStart();
        
        //setting the function to highlight allerted systems
        NVision.updateEngine.setCallback(function(){

            for(var sysObj in NVision.systems){
                sysObj=NVision.systems[sysObj];
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
                            console.log(a,b,c)
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
            
            stopLevel=0;
            
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
            forceStart:forceStart
        }
        
    })(),
    
    drawSystems:function(){
        // I am using NVision._dbReady to avoid drawing the dashBoard more than one time
        if(!NVision._dbReady){
            var db=$("#dbContent"),
                paper = Raphael("dbContent", db.innerWidth(), db.innerHeight());

            for(var i in NVision.layout.systems){
                
                var layout=NVision.layout.systems[i],
                    sysObj=NVision.systems[layout.name];
                
                var sysDiv=$("<div id='" + sysObj.name + "' />")
                    .addClass("systemBox")
                    .css({"left":layout.left,"top":layout.top})
                    .append(
                        $("<h3 />")
                            .text(sysObj.name)
                    )
                    .append(
                        $("<a />")
                            .addClass("showDetails")
                            .attr("href","#" + sysObj.name)
                            .text("View breaks")
                            .click(function(){NVision.showTable(NVision.systems[this.hash.replace("#","")])})                           
                    )                                        
                    .appendTo(db);
                    
                var title=sysDiv.find("h3").draggable({
                                    draggingClass:"",
                                    elementToDrag:sysDiv,
                                    container:db,                                    
                                    onStart:function(div){
                                        var sysObj=NVision.systems[div.attr("id")];                                        
                                    },
                                    onMove:function(div){
                                        var pos=div.position();
                                        var sysObj=NVision.systems[div.attr("id")]
                                        
                                        //redrawing the links
                                        for(var link in sysObj.canvasLink){
                                            link=sysObj.canvasLink[link];
                                            paper.connection(link)
                                        }
                                    },
                                    onStop:function(div){
                                    }
                                })
                sysDiv
                    .mouseenter(function(){
                        $(this).css("z-index",10)
                    })
                    .mouseleave(function(){
                        $(this).css("z-index",1)
                    })
                
                //adding the system attributes
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
                            .append($("<span/>").text(attr.value))

                    if(attr.other){
                        for (var other in attr.other){
                            var div=$("<div class='other' />")
                                .appendTo(attrDiv)                            
                            
                            var value=attr.other[other];
                            
                            div .append($("<span/>").text(other + ": "))
                                .append($("<span/>").text(value))
                            
                        }                       
                    }

                }                
                
                //making a note of the containing div
                sysObj.canvasBox = sysDiv.get(0)
                            
            }
            
            //drawing all the links
            for (var link in NVision.links){
                var link=NVision.links[link],
                    fromSys=NVision.systems[link.from],
                    toSys=NVision.systems[link.to]
                    
                    var canvasLink=paper.connection(fromSys.canvasBox,toSys.canvasBox,"#fff", "#a5bfcb|4");
                    
                    fromSys.canvasLink=fromSys.canvasLink?fromSys.canvasLink:[];
                    fromSys.canvasLink.push(canvasLink);
                    toSys.canvasLink=toSys.canvasLink?toSys.canvasLink:[];
                    toSys.canvasLink.push(canvasLink);                    
            }
            
            NVision._dbReady=true;
        }
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
                callBack:function(data){
                    var sysObj=NVision.systems[data.name];
                    
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
            data:{},
            callBack:function(data){
                
                //showing the system name
                $("#systemName").find("span").text(data.system);
                
                //updating the system trades object
                sysObj.trades=data.trades;
                
                
                
                
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
                            
                            updateTable()
                       
                        },
                        rowClick:function(tr){                            
                            showTradeDetails(tr)
                        }                
                    })
                    
                    
                    //highlighting the columns I am sorting the table by
                    if(sysObj.sortBy){
                        var headers=table.find("thead a");
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
                        table.find("tbody tr").find("td.cell:lt(" + sysObj.sortBy.length +")").addClass("sorted")                        
                    }
                    
                    
                    //adding the pagination
                    NVision.utils.createPagination({                    
                        container:$("#pagination"),
                        system:sysObj,                    
                        // when the user clicks on a page numb.
                        pageClick:function(pageNum){
                            sysObj.currentPage=pageNum;
                            
                            updateTable();                    
                            
                            /*
                            if (pageNum>1){                        
                                //pause the engine
                                NVision.updateEngine.stop();
                            }else{
                                //restart the engine
                                NVision.updateEngine.start();
                            }
                            */
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
                tradeId=tr.getAttribute("data-Id");
                        
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
                    //logMsg:"Getting the breaks details for trade: " + tradeId,
                    success:function(data){
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
                                
                                var doc=window.open("","_blank",'width=800,height=400,resizable=yes').document,
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
                                
                                //IE bug
                                var msg="<h1>Message details:</h1>";
                                $doc.find("body").addClass("popup").append(msg)
                                
                                msg=$doc.find(".panel")
                                    .click(function(){msg.css("font-size","20px")})
                                    
                                    
                                //doc.write("<h1>xxxxxxxx</h1>")
                                /*
                                var lb=$("<p/>").text("click!").css("width",600)
                                    .lightBox({
                                        title:"Break details:"
                                    })
                                    .show();
                                */
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
            return lev<thr/2?0:lev<thr?1:2;        
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
                tbody=table.find("tbody");
            
            options.itemsPerPage=options.itemsPerPage||9999999;
            
            //displaying the trades list
            var first=options.itemsPerPage*(options.currentPage-1);
            
            for(var tradeIdx=0;tradeIdx<options.itemsPerPage && tradeIdx<options.data.length-first ;tradeIdx++){            
                
                var trade=options.data[first+tradeIdx],                    
                    hTr=$("<tr />"),
                    bTr=$("<tr />");
                    
                    if(options.selectRow){
                        //adding the checkBox to the first cell
                        hTr.append($('<th><p><input title="Select/deselect all" type="checkbox" id="selectBtn" value="selectAll" /></p></th>')),
                        bTr.append($("<td class='chkbox'><input type='checkbox'/></td>"));                        
                    }
                    
                    //adding the selectAll function
                    hTr.find("input").change(function(){
                        tbody.children("tr").not(".detailsContainer").find("input").attr("checked",$(this).attr("checked"))
                        
                        this.checked?NVision.updateEngine.stop():NVision.updateEngine.start();
                    })
                    
                for (var cell in options.tableHeadings){
                    
                    var cellCaption=options.tableHeadings[cell];
                    
                    // skiping the ID cell
                    if(cellCaption!="id"){
                        //creating the table headers
                        if (tradeIdx==0){
                            $("<th />")
                                .append(
                                    options.headClick?
                                        $("<a href='#sort' title='sort'/>")
                                            .append($("<span class='header'/>").text(cellCaption))                                            
                                            .click(function(e){
                                                e.preventDefault();
                                                options.headClick(this);
                                            })
                                        :
                                        $("<span />").text(cellCaption)
                                )
                                .appendTo(hTr)
                        }
                        
                        $("<td class='cell' href='#trade' />")
                            .text(trade[cellCaption])
                            .appendTo(bTr);                              
                    }else{
                        //making a note of the trade ID
                        bTr
                            .click(function(e){
                                if(e.target.tagName.toLowerCase()=="td"){
                                    options.rowClick?options.rowClick(this):null;
                                }
                            })
                            .attr("data-Id",first+tradeIdx)//trade[cellCaption])
                    }
                }
                
                hTr.children().length>(options.selectRow?1:0)?hTr.appendTo(thead):null;
                bTr.appendTo(tbody);
                
                table.appendTo(options.container);
            }
            var delta=((new Date()).getTime()-stTime)
            myConsole.log("rendering time: " + delta,5000)
            return table;
        }
    }
}


