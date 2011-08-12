
//updates request abstraction
function updateRequest(options){
        
    var attributes={
        callerObj:null,
        updateInterval:10000,  //10 secs
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
		delegateErrorHandling:true,
        data:{}
    }
	    
    $.extend(attributes,options)
	
	if(utils.RealTypeOf(attributes.data)=="array"){
		
		var data={};
		$.each(attributes.data,function(i,elem){
			data[elem.name]=elem.value			
		})
		
		attributes.data=data;
	}
	
	
	attributes.data["BM"]=NVision.appStatus.BM	
	//adding dummy data to avoid cache issues
	attributes.data["dummyId"]=(new Date()).getTime();
		
    if(attributes.logMsg){
        var msgId=myConsole.status(attributes.logMsg);    
    }
	
	myConsole.alert("revert to POST method!")
	return $.ajax({
        url:attributes.url,
        type:"GET",
        dataType:"json",
        data:attributes.data,
        success:function(data){
            if(attributes.logMsg){
                myConsole.status("Ok ",msgId);
            }

			if(!data || !data._code){
				myConsole.alert("Wrong data format!");
				if(attributes.error){
					attributes.error("Wrong data format!");
				}
				return false;
			}
			
			if(data._code!="ok" && attributes.delegateErrorHandling){

				var lb=NVision.lightBoxes["alertBox"];
								
					lb.find("h3").text(data._errObj.id)
					lb.find("p.shortDesc").text(data._errObj.shortDesc)
					lb.find(".longDesc span").text(data._errObj.longDesc)
				
				if(!lb.is(":visible")){	
					lb.show();
				}
                
                NVision.enableUi();
			}
			
            attributes.success(data)
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
			if((textStatus||errorThrown)=="abort"){
				//console.log("error")
				return false;
			}else{
				myConsole.error(textStatus||errorThrown);
			}
            attributes.error(XMLHttpRequest, textStatus, errorThrown);			
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
		
		if(obj && obj.queryString){
			//adding the BusinessMarket id to the query string
			//obj.queryString.push({name:"BM",value:NVision.appStatus.BM})
		}
		
        baseObj.call(this,obj)
    }
    
    tradeHolder.prototype=new baseObj();
    tradeHolder.prototype.constructor=tradeHolder;    


	tradeHolder.prototype.showResubmitted=function(tableContainer,paginationContainer){    
		// defining the table headings
		var sysObj=this;
		  
        var tableHeaders=[];
		
		if(this.tableHeaders){
			tableHeaders=this.tableHeaders
		}else{
			for(var h in sysObj.resubmitted[0]){
				tableHeaders.push(h);
			}                                        
		}                                       
					
					
							
		if(sysObj.sortBy){
			//defining the column order
			for (var x=sysObj.sortBy.length-1;x>-1;x--){
				var h=$.inArray(sysObj.sortBy[x].name,tableHeaders);
				tableHeaders.unshift(tableHeaders.splice(h,1)[0])
			}
		}
		
		
		sysObj.filteredData=sysObj.resubmitted;
		
		//removing the old table and clearing the NVision.fnObj
		NVision.utils.deleteTable(tableContainer.find("table"))
			
		
		// creating the table
		NVision.utils.createTable({
			selectRow:false,
			container:tableContainer,
			data:sysObj.resubmitted,
			tableHeadings:tableHeaders,
			itemsPerPage:sysObj.displayAll?9999:sysObj.itemsPerPage,
			currentPage:sysObj.currentPage,
			pageCount:sysObj.pageCount,			
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
				
				NVision.updateEngine.onNewData(NVision.enableUi);
				NVision.disableUi();
				
				NVision.updateEngine.updateNow();
				
				//myConsole.chkSpeed("",up)
				
			},
			rowClick:null 
		},function(table){
				
			table.addClass("resubmitted")
				
				
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
										e.stopPropagation();
										
										var x=$(this).attr("data-idx")
										sysObj.sortBy.splice(x,1);
										
										NVision.updateEngine.onNewData(NVision.enableUi);
										NVision.disableUi();
										
										NVision.updateEngine.updateNow();
										
										//sysObj.showResubmitted(tableContainer,paginationContainer); 
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
						
						//temporarely disabling the UI
						NVision.updateEngine.onNewData(NVision.enableUi)
						NVision.disableUi();
						
						sysObj.currentPage=pageNum;
						NVision.updateEngine.updateNow();
						
						//sysObj.showResubmitted(tableContainer,paginationContainer);                    
					}
				})		
			
			})
		
		
	}




    tradeHolder.prototype.showTrades=function(tableContainer,paginationContainer,rowClick,selectRow){    
        // defining the table headings
        var sysObj=this; 
        var tableHeaders=[];
		
		if(this.tableHeaders){
			tableHeaders=this.tableHeaders
		}else{
			for(var h in sysObj.trades[0]){
				tableHeaders.push(h);
			}                                        
		}
		
        if(sysObj.sortBy){
            //defining the column order
            for (var x=sysObj.sortBy.length-1;x>-1;x--){
                var h=$.inArray(sysObj.sortBy[x].name,tableHeaders);
                tableHeaders.unshift(tableHeaders.splice(h,1)[0])
                
                ////sorting the trades list
                //sysObj.trades.sort(function(a,b){
                //    if (sysObj.sortBy[x].ascending){
                //        return a[sysObj.sortBy[x].name]>b[sysObj.sortBy[x].name]?-1:(a[sysObj.sortBy[x].name]==b[sysObj.sortBy[x].name])?0:1;    
                //    }else{
                //        return a[sysObj.sortBy[x].name]>b[sysObj.sortBy[x].name]?1:(a[sysObj.sortBy[x].name]==b[sysObj.sortBy[x].name])?0:-1;    
                //    }
                //    
                //})
            }
        }
        
        
        ////filtering out the data according to the "filters" settings
        //var filteredData=[];
        //
        //_t:for (var trade in sysObj.trades){
        //    _f:for(var f in sysObj.filters){                        
        //        if(sysObj.trades[trade][f]!=sysObj.filters[f]){
        //            continue _t;
        //        }
        //    }
        //    filteredData.push(sysObj.trades[trade]);
        //}
        
        sysObj.filteredData=sysObj.trades;
        
        //removing the old table and clearing the NVision.fnObj
        NVision.utils.deleteTable(tableContainer.find("table"))
        
        // creating the table
        NVision.utils.createTable({
            selectRow:selectRow===undefined?true:false,
            container:tableContainer,
            data:sysObj.trades,
			showTotalOn:sysObj.showTotalOn,
            tableHeadings:tableHeaders,
            itemsPerPage:sysObj.displayAll?9999:sysObj.itemsPerPage,
            currentPage:sysObj.currentPage,
			pageCount:sysObj.pageCount,
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
                
                
                NVision.updateEngine.onNewData(NVision.enableUi);
				NVision.disableUi();
				
                NVision.updateEngine.updateNow();
				
                //myConsole.chkSpeed("",up)
                
            },
            rowClick:rowClick      
        },function(table){
						
				//hiding the checkbox for the "COMPLETED" trades
			if(sysObj.type=="searchResults"){
				var tr=table.find("tbody").find("tr"),
					first=sysObj.itemsPerPage*(sysObj.currentPage-1),
					last=sysObj.displayAll?sysObj.trades.length:Math.min(sysObj.trades.length,sysObj.itemsPerPage*(sysObj.currentPage));
				
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
									e.stopPropagation();
									
									var x=$(this).attr("data-idx")
									sysObj.sortBy.splice(x,1);
									
									NVision.updateEngine.onNewData(NVision.enableUi);
									NVision.disableUi();
									
									NVision.updateEngine.updateNow();
									//sysObj.showTrades(tableContainer,paginationContainer,rowClick); 
								})
								.attr("data-idx",x)                                   
						)
				}
				
				//highlighting the sorted column cells
				setTimeout(function(){
					table.find("tbody tr").find("td.cell:lt(" + sysObj.sortBy.length +")").addClass("sorted")
				},10)
				
			}
		
		
		})
        
        
       
        
        
        //adding the pagination
        NVision.utils.createPagination({                    
            container:paginationContainer,
            system:sysObj,                    
            // when the user clicks on a page numb.
            pageClick:function(pageNum){
		
				//temporarely disabling the UI
				NVision.updateEngine.onNewData(NVision.enableUi)
				NVision.disableUi();
				
				sysObj.currentPage=pageNum;
				NVision.updateEngine.updateNow();				
                
            }
        })
        
        
              
    }    



// sysMsg object def
    function sysMessage(obj){        
        tradeHolder.call(this,obj)
    }
    
    sysMessage.prototype=new tradeHolder();
    sysMessage.prototype.constructor=sysMessage;
	

	sysMessage.prototype.showTrades=function(tableContainer,paginationContainer){
        //calling the base function passing rowClick=null and selectRow=false
        tradeHolder.prototype.showTrades.call(this,tableContainer,paginationContainer,null,false);		
	}

// kpiObject object def
    function kpiObject(obj){        
        tradeHolder.call(this,obj)
    }
    
    kpiObject.prototype=new tradeHolder();
    kpiObject.prototype.constructor=kpiObject;
	

	kpiObject.prototype.showTrades=function(tableContainer,paginationContainer){
        //calling the base function passing rowClick=null and selectRow=false
        tradeHolder.prototype.showTrades.call(this,tableContainer,paginationContainer,null,false);
	}




// safestore object def
    function safestore(obj){        
        tradeHolder.call(this,obj)
    }
    
    safestore.prototype=new tradeHolder();
    safestore.prototype.constructor=safestore;
	
	safestore.prototype.draw=function(objPos,container){

        //calling the base function first
        baseObj.prototype.draw.call(this,objPos,container);
       
        var objDiv=$(this.canvasBox),
            sysObj=this;
                
            
        //adding the "Replay" button
		$("<a />")
			.addClass("replayBtn")
			.attr({
				"href":"#" + sysObj.id,
				"title":"Replay"
			})
			.click(function(e){
				e.preventDefault();
				
				NVision.appStatus[NVision.appStatus.currentTab].view={type:"safestore","sysName":this.hash.replace("#","")}
				$.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);    
			})
			.insertAfter(objDiv.find("h3"));
        
    }
	
	
	safestore.prototype.showTrades=function(tableContainer,paginationContainer){
        //calling the base function first
        tradeHolder.prototype.showTrades.call(this,tableContainer,paginationContainer,
				//customising the rowClick function
				function(tr){
					var sysId=$(tr).attr("data-id");
					NVision.updateEngine.stop();
					
					$("<p />").text(NVision.currentSys.filteredData[sysId].Msg).lightBox({
							title:"Raw message",
							modal:false,
							width:600,
							onClose:NVision.updateEngine.start
						}).show()
				});
		
	}





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
                    e.preventDefault();
                    
                    NVision.appStatus[NVision.appStatus.currentTab].view={type:"adapter","sysName":this.hash.replace("#","")}
                    $.bbq.pushState( NVision.appStatus[NVision.appStatus.currentTab],2);    
                })                           
        )         
       
       
       //displaying the attributes
        this.refresh(); 
        
    }
    
    
    
    
    
