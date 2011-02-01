/* Author: 
    Alessio Carnevale
*/

$().ready(function(){
    //init. the NVision object (passing a function to be executed when the system is ready)
    NVision.init(function(){});
    
    $("select").ixDropDown();
})

Element.prototype.getBBox=function(){
    var $obj=$(this),
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
    systems:null,     //hashtable containing the subSystems
    adapters:null,
    links:null,
    layout:null,
    sysReady:null,     //this function gets exectuted after the json data has been processed by the client
    init:function(sysReady){
        
        NVision.sysReady=sysReady;
        
        //getting the system definition
        $.ajax({
            url:sysConfig.sysComposition,
            dataType:"json",
            error:function(XMLHttpRequest, textStatus, errorThrown){
                myConsole.error(textStatus);
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
        NVision.updateEngine.start();
        
        // setting the buttons function up
            $("#overwriteBtn").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                myConsole.log("overWriting...")
            });
            
            $("#resubmitBtn").click(function(e){
                e.preventDefault();
                if($(this).hasClass("off")){
                    return false;
                }
                
                myConfirm("Resubmit the selected trade?",function(){
                    myConsole.log("resubmitting...")
                })
            });
            
            $("#tableData input[type='checkbox']").live("change",function(){
                var checkedCount=$("#tableData input[type='checkbox']:checked").length;
                
                //overwrite button
                (checkedCount==1) ?
                    
                    $("#overwriteBtn").removeClass("off")
                :
                    $("#overwriteBtn").addClass("off");
                    
                    
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
        
        // clearing the update engine
        NVision.updateEngine.empty();        
        
        //adding the systems to the updates queue
        var reqObj=NVision.createBreaksUpdateRequests(sysObj);
        
        //setting the callback to update the updatesBtn!
        NVision.updateEngine.setCallback(function(){

            var now=(new Date()).getTime(),
                timer=Math.round((sysObj.updatesInterval-(now-reqObj.timeStamp))/1000);
                span=$("#updatesBtn").find("span"),
                value=parseInt(span.text());
                
            if(value<timer){
                span.parent().addClass("on")
            }else{
                span.parent().removeClass("on")
            }
            
            span.text(timer);        
        });        
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
    },
    
    
    //handles all the updates requests
    updateEngine:(function(){
        var tasks={},               //hash table
        engineTimer=1000,           //checks the tasks list every x millisec.
        intervalHnd=null,
        loopCallback=function(){}   //executed every second
        
        add=function(obj){
            tasks[obj.id]=obj;
        },
        remove=function(obj){
            delete tasks[obj.id];
        },        
        start=function(){
            //starting the updates timer
            if(!intervalHnd){
                intervalHnd=setInterval(update,engineTimer);            
                
                myConsole.log("Update engine running...",3000)
                $("#updatesBtn").find("a").removeClass("pause")
                
                //running the first update
                update();
            }
        },
        stop=function(){
            if(intervalHnd){                
                myConsole.log("Update engine paused",3000)
                $("#updatesBtn").find("a").addClass("pause")
                clearInterval(intervalHnd);
                intervalHnd=null;
            }
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
                        url:reqObj.url,
                        data:reqObj.data
                    })
                }                
            }
            
            //executing the callback
            loopCallback();            
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
            loopCallback=function(){};
        },
        
        setCallback=function(fn){
            //this function is executed every second
            loopCallback=fn;
        }
        
        //public functions
        return {
            add:add,
            remove:remove,
            start:start,
            stop:stop,
            update:update,
            empty:empty,
            setCallback:setCallback,
            updateNow:updateNow
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
                            .attr("href","#" + sysObj.name)
                            .text("show details...")
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
                    fromSys=NVision.systems[link.from]
                    toSys=NVision.systems[link.to]
                    
                    var canvasLink=paper.connection(fromSys.canvasBox,toSys.canvasBox,"#fff", "#999|4");
                    
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
                    myConsole.alert("Todo: system status updated",2000)
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
                        itemsPerPage:sysObj.itemsPerPage,
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
                            NVision.updateEngine.stop();
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
                if(!$tr.siblings().hasClass("detailsContainer")){
                    NVision.updateEngine.start();
                }
            }else{
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
                        
                                                
                        NVision.utils.createTable({
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
                    },
                    url:sysConfig.tradeDetails
                })    
            }                           
        }
    },
    
    utils:{
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
                    
            if(options.system.trades.length==0 || options.system.itemsPerPage==0){
                return false;
            }
            
            var from=options.system.itemsPerPage*(options.system.currentPage-1),
                to=Math.min(options.system.trades.length,options.system.itemsPerPage*options.system.currentPage);
            
            legend.text("Showing: " + from + "-" + to +  " / " + options.system.trades.length)
            
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
                            .attr("data-Id",trade[cellCaption])
                    }
                }
                
                hTr.children().length>(options.selectRow?1:0)?hTr.appendTo(thead):null;
                bTr.appendTo(tbody);
                
                table.appendTo(options.container);
            }
                        
            return table;
        }
    }
}


