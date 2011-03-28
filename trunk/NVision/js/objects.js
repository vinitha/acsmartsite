
//updates request abstraction
function updateRequest(options){
        
    var attributes={
        callerObj:null,
        updatesInterval:10000,  //10 secs
        url:"",
        data:null,
        id:null,
        callBack:function(){},
        timeStamp:0
    }
    return $.extend(attributes,options);    
}



// function used to bind the ajax request with myConsole message
function myAjax(options){
    
    var attributes={
        logMsg:null,
        url:"",
        success:function(){},
        error:function(){},
        data:{}
    }
        
    $.extend(attributes,options)
    $.extend(attributes.data,{"BM":NVision.appStatus.BM})
    
    if(attributes.logMsg){
        var msgId=myConsole.status(attributes.logMsg);    
    }
    
    $.ajax({
        url:attributes.url,
        type:"GET",
        dataType:"json",
        data:attributes.data,
        success:function(data){
            if(attributes.logMsg){
                myConsole.status("Ok ",msgId);
            }
            attributes.success(data)
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            myConsole.error(textStatus||errorThrown);
            attributes.error(XMLHttpRequest, textStatus, errorThrown)
        }
    })    
}


// OBJECTS definition


//baseObj def
    function baseObj(obj){
        for(var p in obj){
            this[p]=obj[p];
        }
    }
    
    baseObj.prototype.draw=function(objPos,container){
        
        var objDiv=$("<div />"),
            sysObj=this;
        
        try{
            objDiv.attr("data_name",sysObj.name)
                .addClass(sysObj.type)
                .css({"left":objPos.left,"top":objPos.top})
                .append(
                    $("<h3 />")
                        .text(sysObj.name)
                )                                      
                .appendTo(container);
        }catch(e){
            myConsole.alert("Systems configuration data corrupted! - " + e,10000);
            return false;
        }
                
        var title=objDiv
                    .find("h3").draggable({
                        draggingClass:"",
                        elementToDrag:objDiv,
                        container:container,                                    
                        onStart:function(div){
                        },
                        onMove:function(div){
                            var pos=div.position();
                            
                            var sysObj=NVision.systems[div.attr("data_name")]||NVision.adapters[div.attr("data_name")]||NVision.otherObjects[div.attr("data_name")]
                            
                            //redrawing the links
                            NVision.redrawLinks(sysObj)

                        },
                        onStop:function(div){
                            NVision.utils.checkDbSize();
                            NVision.utils.savePositions();
                        }
                    })                    
        
        //making a note of the containing div
        sysObj.canvasBox = objDiv.get(0)
    }

    baseObj.prototype.getZoomedPosition=function(){
        //returns the obj position regardless the zoom level
        var pos=$(this.canvasBox).position();
        
        pos.left/=NVision.zoomFactor;
        pos.top/=NVision.zoomFactor;
        
        return pos;
    }




// exchange object def
    function exchange(obj){
        baseObj.call(this,obj)
    }
    
    exchange.prototype=new baseObj();
    exchange.prototype.constructor=exchange;
    
    exchange.prototype.draw=function(objPos,container){
        
        //calling the base function first
        baseObj.prototype.draw.call(this,objPos,container)
        var title=$(this.canvasBox)
            .addClass("verticalText")
            .find("h3"),
            newText=[],
            titText=title.text();
        
        
        for (var x=0; x<titText.length;x++){
            var c=titText.substr(x,1);
            newText.push(c==" "?"&nbsp;":c)
        }
        
        title.html(newText.join(" "))
        
    }



// System object def
    function system(obj){
        baseObj.call(this,obj)
    }
    
    system.prototype=new baseObj();
    system.prototype.constructor=system;
    
    
// tradeHolder object def
    function tradeHolder(obj){
        baseObj.call(this,obj)
    }
    
    tradeHolder.prototype=new baseObj();
    tradeHolder.prototype.constructor=tradeHolder;    

    tradeHolder.prototype.showTrades=function(tableContainer,paginationContainer){    
        // defining the table headings
        var sysObj=this;
        
        
        var tableHeadings=[]
        for(var h in sysObj.trades[0]){
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
        
        
        //filtering out the data according to the "filters" settings
        var filteredData=[]
        _t:for (var trade in sysObj.trades){
            _f:for(var f in sysObj.filters){                        
                if(sysObj.trades[trade][f]!=sysObj.filters[f]){
                    continue _t;
                }
            }
            filteredData.push(sysObj.trades[trade]);
        }
        
        sysObj.filteredData=filteredData;
        
        //removing the old table and clearing the NVision.fnObj
        NVision.utils.deleteTable($("#tableData").find("table"))
        
        // creating the table
        var table=NVision.utils.createTable({
            selectRow:true,
            container:tableContainer,
            data:filteredData,
            tableHeadings:tableHeadings,
            itemsPerPage:sysObj.displayAll?9999:sysObj.itemsPerPage,
            currentPage:sysObj.currentPage,
            headClick:function(anchor){
                
                var $anchor=$(anchor);
                //var up=myConsole.chkSpeed("updateTable: ");
                
                sysObj.sortBy=sysObj.sortBy?sysObj.sortBy:[];
                
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
                
                
                sysObj.showTrades(tableContainer,paginationContainer);
                
                //myConsole.chkSpeed("",up)
                
            },
            rowClick:function(tr){                            
                showTradeDetails(tr)
            }                
        })
        
        //hiding the checkbox for the "COMPLETED" trades
        if(sysObj.type=="searchResults"){
            var tr=table.find("tbody").find("tr"),
                first=sysObj.itemsPerPage*(sysObj.currentPage-1),
                last=sysObj.displayAll?sysObj.trades.length:sysObj.itemsPerPage*(sysObj.currentPage);
            
            for(var x=first; x<last;x++){
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
                            .click(function(e){
                                e.preventDefault();
                                
                                var x=$(this).attr("data-idx")
                                sysObj.sortBy.splice(x,1);
                                
                                sysObj.showTrades(tableContainer,paginationContainer); 
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
            container:paginationContainer,
            system:sysObj,                    
            // when the user clicks on a page numb.
            pageClick:function(pageNum){
                sysObj.currentPage=pageNum;
                
                sysObj.showTrades(tableContainer,paginationContainer);                    
            }
        })
        
        
        //this function fetches and displays the passed trade details
        function showTradeDetails(tr){
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
                                                    //.append($("<li><a href='#_msg_raw'><span>Raw message:</span></a></li>"))                                            
                                                    .append($("<li class='current'><a href='#_msg_in'><span>Incoming:</span></a></li>"))
                                                    .append($("<li><a href='#_msg_out'><span>Outgoing:</span></a></li>"))                                            
                                                    .append($("<li><a href='#_msg_steps'><span>Steps:</span></a></li>"))                                            
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
    }    






// searchObj object def
    function searchObj(obj){
        //adding the BusinessMarket id to the query string
        obj.queryString.push({name:"BM",value:NVision.appStatus.BM});
        
        tradeHolder.call(this,obj)
    }
    
    searchObj.prototype=new tradeHolder();
    searchObj.prototype.constructor=searchObj;   



//adapter object def
    function adapter(obj){
        tradeHolder.call(this,obj)
    }
    
    adapter.prototype=new tradeHolder();
    adapter.prototype.constructor=adapter;
    
    adapter.prototype.refresh=function(){
        //refreshing the attributes view
        var objDiv=$(this.canvasBox),
            sysObj=this,
            title=objDiv.find("h3");
        
        
        if(sysObj.data){
            //thermometer thing
            var therm=$("div.therm",objDiv),
                perc=$("p.perc",objDiv);
            
            
            if(therm.length==0){
                therm=$("<div class='therm' />").appendTo(objDiv);
                $("<div class='lev' />").appendTo(therm);
                
                perc=$("<p class='perc' />").appendTo(therm);
            }
            
            perc.text(sysObj.data.alertLevel + "%");
      
            if(therm.length>0){
                var left=sysObj.displayLevel*1.2,
                    level=Math.max(0,(50-50*sysObj.data.alertLevel/100))/10,
                    css= -1 * left  + "em " + level + "em";
                    
                therm.css({backgroundPosition:css})                        
            }
        
            
            //clearing the object    
            objDiv.find("div.attr").remove()
            
            //recreating it
            var attrDiv=$("<div class='attr' />").insertAfter(title)
                    
            //todo: improve performance here!!!
            var attributes=sysObj.data?sysObj.data.attributes:null;
            
            for (var attr in attributes){
                $("<p />")
                    .addClass("more")
                    .appendTo(attrDiv)
                    .append($("<span/>").text(attr + ": "))
                    .append($("<strong/>").text(attributes[attr]))
        
            }
        }     
    }
    
    adapter.prototype.draw=function(objPos,container){
        
        //calling the base function first
        baseObj.prototype.draw.call(this,objPos,container)
       
        var objDiv=$(this.canvasBox),
            sysObj=this;
            
            objDiv.addClass(sysObj.collapsed==true?"":"expanded");
            
            
        //adding the showHide button            
            $("<a href='#attr' class='showHide' title='Expand / collapse' />")
                .click(function(e){
                    e.preventDefault();
                    objDiv.toggleClass("expanded");
                    
                    //redrawing the links
                    NVision.redrawLinks(sysObj)
                    
                    return false;
                })
                .insertAfter(objDiv.find("h3"));
                
            
        //adding the "View breaks" button
        objDiv.append(
            $("<a />")
                .addClass("showDetails")
                .attr("href","#" + sysObj.id)
                .text("View breaks")
                .click(function(e){
                    //NVision.showTable(NVision.systems[this.hash.replace("#","")]);
                    e.preventDefault();
                    
                    NVision.appStatus[NVision.appStatus.currentTab].view={type:"adapter","sysName":this.hash.replace("#","")}
                    $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);    
                })                           
        )         
       
       
       //displaying the attributes
        this.refresh(); 
        
    }
    
    
    
    
    
