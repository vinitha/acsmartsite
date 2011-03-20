$().ready(function(){
    
    //widget init function
    widget.init()
    
    //handling the searchSwitch change event
    $("#searchSwitch").change(function(e,aObj){
        var searchType=aObj.hash,
            toHide=(searchType=="#advSearch")?"#stdSearch":"#advSearch",
            title=$("#searchPanel").find("h3");
    
        $(searchType).slideDown(300);
        $(toHide).slideUp(300);
        
        searchType=="#advSearch"?(title.slideDown(300)):(title.slideUp(300));
        
    })
    
    //in-field labels
    $("#stdSearch").find("label").inFieldLabels();
    
    
    //setting the advanced search module up.
    var advForm=$("#advSearch"),
        fieldset=advForm.find("fieldset").eq(0),
        select=fieldset.find("select"),
        input=fieldset.find("input");
        
    
    //removing all the fieldsets but the first one.
    advForm.find("fieldset").not(":first").remove();
    //removing the operators
    fieldset.find(".operatori").remove();
    
    //creating the query display panel
    var div=$("<div />").addClass("advQuery").insertAfter(fieldset)
    
    //assigning it to the advQueryObj
    advQueryObj.showOn(div)
    
    //handling the + button
    fieldset.find("a.addRule").click(function(e){
        e.preventDefault();
        if(input.val()!=""){
            input.removeClass("error");
            
            advQueryObj.addQuery({
                name:select.val(),
                value:input.val()
            })
                        
        }else{
            myConsole.alert("Inserire il valore su cui effettuare la ricerca!")
            input.addClass("error").focus();
        }
        
    })
  
    
    
    
});



var advQueryObj=(function(){
    
    //private propeties/methods
    var qIndex=0,
        qCount=0,
        queriesHash={},
        showOnElement=null;
        
    getIndex=function(){
        return "q_" + qIndex++;
    }
    
    clear=function(){
        qIndex=0;
        queriesHash={};
        showOn.empty();
    }
    
    showOn=function(elem){
        showOnElement=elem;
    }
    
    getQueriesHash=function(){
        return queriesHash;
    }
    
    addQuery=function(obj){
        var i=getIndex();
        obj.qIndex=i;
        qCount++;
        
        queriesHash[i]=obj;
        if(qCount>1){
            obj.operator="AND";
        }
        drawObj(obj);
    }
    
    drawObj=function(obj){
        if (showOnElement){
            var div=$("<div />")
                .data("qObject",obj)
                .appendTo(showOnElement)
            if(obj.operator){
                //creating the operators/switch widget
                var ul=$('<ul class="switch"><li class="current"><a href="#AND">AND</a></li><li><a href="#OR">OR</a></li></ul>').appendTo(div)
                
                //calling the init function
                doSwitch(ul)
                
                //handling the change event
                ul.change(function(e,aObj){
                    var obj=$(this).closest("div").data("qObject");
                    obj.operator=aObj.hash.replace("#","")
                })
            }
            $("<p />")
                .append(
                    $("<a />")
                        .text("-")
                        .addClass("remove")
                        .data("qIndex",obj.qIndex)
                        .click(function(e){
                            e.preventDefault();
                            removeQuery($(this).data("qIndex"))
                            $(this).closest("div").remove();
                        })
                )
                .append(
                    $("<span />").text(obj.name + " = " + obj.value)
                )
                .appendTo(div);
            
                
        }else{
            myConsole.alert("advQueryObj.showOnElement undefined!")
        }        
    }
    
    removeQuery=function(qI){
        qCount--;
        console.log(qI, qCount)
        delete(queriesHash[qI]);
        
        var i=0;
        showOnElement.empty();
        for(var obj in queriesHash){
            if(i==0){
                delete(queriesHash[obj].operator);
            }
            i++;
            drawObj(queriesHash[obj]);
        }

    }
    
    
    //public propeties/methods
    return {
        addQuery:addQuery,
        getQueriesHash:getQueriesHash,
        clear:clear,
        showOn:showOn
    }
})()







////// widgets ////////

    var widget={
        init:function(){
            //setting the switch widget up
            doSwitch($("ul.switch"))
        }
    };






    //Switch    
    function doSwitch(ulElem){
        //setting the widget custom event
        ulElem.bind("change",function(e,currentA){
                if(!currentA){return false};
                
                var $A=$(currentA);
                $A.closest("ul")
                    .data("value",$A.attr("hash").replace("#",""))
                    .find("li").removeClass("current");
                $A.closest("li").addClass("current")
            });
            
        //widget init.
        ulElem.trigger("change",ulElem.find(".current a"))
        
        //defining the click event delegation
        $("ul.switch a").live("click",function(e){
            e.preventDefault();
            
            var $this=$(this);
            $this.closest("ul").trigger("change",$this)
        })        
    }