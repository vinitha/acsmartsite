$().ready(function(){
    
    //widgets init function
    widgets.init()
    
    //handling the searchSwitch change event
    $("#searchSwitch").change(function(e,aObj){
        var toShow=aObj.hash,
            toHide=(toShow=="#advSearch")?"#stdSearch":"#advSearch",
            title=$("#searchPanel").find("h3");
    
        $(toShow).slideDown(300,function(){$(this).find("input").eq(0).focus()});
        $(toHide).slideUp(300);
        
        toShow=="#advSearch"?(title.slideDown(300)):(title.slideUp(300));
        
    })
    
    //in-field labels
    $("#stdSearch").find("label").inFieldLabels();
    
    var stdForm=$("#stdSearch")
    //on std submit..
    stdForm.submit(function(e){
        e.preventDefault();
        var input=$(this).find("input");
        input.removeClass("error");
        
        if(input.val()==""){
            myConsole.alert("Inserire un valore su qui effettuare la ricerca.");
            input.addClass("error").focus();
            return false;            
        }
        
        var data=stdForm.serialize();
        
        HAP.doSearch({
            qForm:stdForm,
            callback:function(json){
                
            }
        })
    })     
    
    //setting the advanced search module up.
    var advForm=$("#advSearch"),
        fieldset=advForm.find("fieldset.multiple").eq(0),
        select=fieldset.find("select"),
        input=fieldset.find("input"),
        addRuleBtn=fieldset.find("a.addRule");
    
    //changing the input field according to the selected data-type
    select.change(function(e){
        var opt=$(this).find("option:selected"),
            type=opt.data("type");
            
            input.remove();
        switch(type){
            case "text":
                input=$('<input class="testo" type="text" id="valore_1" name="avanzata" value="" />').insertBefore(addRuleBtn)
            break;
            
            case "date":                
                $('<input maxlength="10" class="date" title="da" type="text" id="date_From" name="date_From" value="" />').insertBefore(addRuleBtn);
                $('<input maxlength="10" class="date" title="a" type="text" id="date_to" name="date_to" value="" />').insertBefore(addRuleBtn);
                input=fieldset.find("input");
            break;
        }
        
        input.eq(0).focus();
        
    })
    // firing the event when the page loads
    select.change();
    
    //on adv submit..
    advForm.submit(function(e){
        e.preventDefault();
        
        var advString=HAP.advQueryObj.getQueriesString(),
            qString=advString + "&" + $("#archivi input").serialize();

        if(input.val()!=""){
            addRuleBtn.click();
            return false;
        }else{
            if(advString==""){
                myConsole.alert("Inserire un valore su qui effettuare la ricerca.")
                return false;
            }
        }
        
        HAP.doSearch({
                qForm:advForm,
                qData:qString,
                callback:function(json){
                    
                }
            })
        
    })
    
    //removing all the fieldsets but the first one.
    advForm.find("fieldset.multiple").not(":first").remove();
    //removing the operators
    fieldset.find(".operatori").remove();
    
    //creating the query display panel
    var div=$("<div />").addClass("advQuery").insertAfter(fieldset)
    
    //assigning it to the advQueryObj
    HAP.advQueryObj.showOn(div)
    
    //handling the + button
    addRuleBtn.click(function(e){
        e.preventDefault();
        
        var opt=select.find("option:selected"),
            type=opt.data("type");
            
        switch(type){
            case "text":
                if(input.val()!=""){
                    input.removeClass("error");
                    
                    HAP.advQueryObj.addQuery({
                        name:select.val(),
                        value:input.val()
                    })
                    input.val("");
                                
                }else{
                    //myConsole.alert("Inserire il valore su cui effettuare la ricerca!")
                    input.focus();
                }                
            break;
            
            case "date":
                var da=input.eq(0),
                    a=input.eq(1);
                    
                if(da.val()=="" && a.val()==""){

                    //myConsole.alert("Inserire almeno una data!")
                    input.eq(0).focus();
                                                    
                }else{
                                        
                    input.removeClass("error");                    
                    HAP.advQueryObj.addQuery({
                        name:select.val(),
                        value:(da.val()||" - - ") + " \u2192 " + (a.val()||" - - ")
                    })                   
                }
                input.val("");
                da.focus();
            break;
        }        
        
    })
  
    
    
    

});



var HAP=(function(){
    var _searchHistory=[];
        
    var _showResults=function(resultsDiv){
        console.log(_results);
    }

    //la logica della ricerca avanzata e' mappata su quest'oggetto
    var _advQueryObj=(function(){
        
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
        
        getQueriesString=function(){
            var str="";
            for (var obj in queriesHash){
                var tmpObj=queriesHash[obj]
                str+=(tmpObj.operator?" " + tmpObj.operator + " ":" ") + tmpObj.name + "=" + tmpObj.value
            }
            
            return str;
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
            getQueriesString:getQueriesString,
            clear:clear,
            showOn:showOn
        }
    })();

    
    
    
    //effettua la ricerca
    var _doSearch=function(qObj){
        /*qObj structure:            
            qForm,qData,callback
        */
        var qData=((typeof qObj.qData)=="string")?escape(qObj.qData):qObj.qForm.serialize();
        
        //aggiungo un booleano da usare lato server per distinguere una ricerca ajax da una classica (=> no JS)
        qData={"query":qData,isAjax:true};
        
        $.ajax({
            url:qObj.qForm.attr("action"),
            data:qData,
            method:qObj.qForm.attr("method"),
            dataType:"json",
            success:function(data){
                
                //aggiungo la ricerca all'history
                searchHistory.push({query:qData,data:data});
                
                qObj.callback?qObj.callback(data):null;
            },
            error:function(a,b,c){
                alert(b||a||c)
            }
        })
    };
    
    
    return {
        advQueryObj:_advQueryObj,
        doSearch:_doSearch,
        showResults:_showResults
    };
    
})();









////// widgets ////////

    var widgets={
        init:function(){
            //setting the switch widget up
            doSwitch($("ul.switch"))
        }
    };






    //Switch widget   
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
        
        //defining the click event
        ulElem.find("a").click(function(e){
            e.preventDefault();
            
            var $this=$(this);
            $this.closest("ul").trigger("change",$this)
        })        
    }