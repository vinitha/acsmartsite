
$().ready(function(){
    
    //widgets init function
    widgets.init()
    
    
    //defining and adding the dictionaries to HAP
    HAP.dictionary.add({
        it:{
            d_1:"Inserire un valore su cui effettuare la ricerca.",
            d_2:"non definito"
        },
        
        en:{
            d_1:"Please provide a value for the required field.",
            d_2:"undefined"
        }    
    })

    //setting the current dictionary
    HAP.dictionary.set("en");


    
    var stdForm=$("#stdSearch");
    //on std submit..
    stdForm.submit(function(e){
        e.preventDefault();
        var input=$(this).find("input");
        input.removeClass("error");
        
        if(input.val()==""){
            myConsole.alert(HAP.dictionary.getTranslation("d_1"));
            input.addClass("error").focus();
            return false;            
        }
        
        var data=stdForm.serialize();
        
        HAP.doSearch({
            qForm:stdForm,
            callback:null
        })
    })     
    
    
    var mainMenu=$("#menuBar ul:first");
    mainMenu.change(function(e,aObj){
        
        // if the href is a proper URL then follow the link
        if(!aObj.hash){
            location.href=aObj.href;
            return false;
        }
        
        // hoterwise switch the anchor visibility
        $(aObj.hash).slideDown(300).siblings().slideUp(300);
    })
    
    //setting the advanced search module up.
    var advForm=$("#advSearch"),
        fieldset=advForm.find("fieldset.multiple").eq(0),
        select=fieldset.find("select"),
        input=fieldset.find("input"),
        addRuleBtn=fieldset.find("a.addRule");
        
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
                myConsole.alert(HAP.currentDictionary.get("d_1"))
                return false;
            }
        }
        
        HAP.doSearch({
                qForm:advForm,
                qData:qString,
                callback:null
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
    var _dictionaries={};
    var _currentDictionary=null;
    
    var _currentResults={};      //hashtable usato per il lookup rapido dei document correntemente mostrati all'utente
    

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
                    var ul=$('<ul class="switch btnsSwitch"><li class="current"><a href="#AND">AND</a></li><li><a href="#OR">OR</a></li></ul>').appendTo(div)
                    
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
                myConsole.alert("advQueryObj.showOnElement " + HAP.dictionary.getTranslation("d_2"))
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
    function _doSearch(qObj){
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
                _searchHistory.push({query:qData,data:data});                
                
                var cbData=qObj.callback?qObj.callback(data):null;
                
                //se la callback ritorna False -> esco senza mostrare i risultatu
                if(cbData===false){
                    return false;
                }
                
                _showResults(data);
            },
            error:function(a,b,c){
                alert(b||a||c)
            }
        })
    };
    
    


    
    function _showResults(json){
        
        //pulisco l'hashTable dei risultati correnti
        _currentResults={};
        
        
        var mainMenu=$("#menuBar ul:first")
        var risLi=$("li.risultati",mainMenu),
            risDiv=$("#risultatiRicerca");
            
        if(risLi.length==0){
            risLi=$("<li class='risultati newItem' ><a href='#risultatiRicerca' title='Risultati' ><span>Risultati</span></a></li>")
                .appendTo(mainMenu);
         
            risDiv=$("<div id='risultatiRicerca' />").appendTo("#bodyCol").hide(0);
        }
        risDiv
            .empty()
            .append($("<h3 class='titoloPannello'>Risultati della ricerca:<h3/>"));
        
        risLi.find("a").click();
        
        var arUL=$("<ul class='archivi tabMenu switch' />");
        arUL.appendTo(risDiv);
        
        //lo rendo uno switch
        doSwitch(arUL);
        
        arUL.change(function(e,aObj){
            $(aObj.hash).show(0).siblings("div").hide(0);            
        })
        
        for (var x=0;x<json.length;x++){
            var obj=json[x];
            //creo l'entry nel tabmenu
            $("<li class='li_arch' ><a class='' href='#arch_"+obj.id+"' title='Apri archivio' ><span>"+obj.nome+" ("+obj.totaleDocs+")</span></a></li>")
                .appendTo(arUL);
            
            //creo il div che conterra' i documenti
            var docDiv=$("<div class='archDiv' id='arch_"+obj.id+"' />").appendTo(risDiv).hide(0)
            
            //creo i documenti
            var docUL=$("<ul class='documenti switch' />");
            
            for (var d=0;d<obj.risultati.length;d++){
                var doc=obj.risultati[d];
                
                //popolo l'hashtable
                _currentResults[doc.id]=doc;
                
                $("<li class='li_doc' />")
                    .append(
                        $("<a class='doc' href='#doc_"+doc.id+"' title='"+doc.titolo+"' ><span>"+doc.titolo+"</span></a>")
                            .click(function(){
                                _showDocument(this.hash.replace("#doc_",""),$(this).closest("div"))
                            })
                            .append($("<a class='add' href='#doc_"+doc.id+"' title='Aggiungi al raccoglitore' ><span class='hidden'>Aggiungi al raccoglitore</span></a>")
                                .click(function(){
                                    myConsole.log("Todo: inserirlo nel raccoglitore")}
                                )
                        )                                
                    )                                
                    .appendTo(docUL);
                    
            }
            
            docUL.appendTo(docDiv);
            
            //lo rendo uno switch!
            doSwitch(docUL);
        }
        
        arUL.find("a:first").click();
    };
    
    function _showDocument(docId, container){
        var docView=container.find(".hap_docView").empty();
        if (docView.length==0){
            docView=$("<div class='hap_docView' />").appendTo(container);
        }
        
        var doc=_currentResults[docId];
        container.addClass("showingDoc");
        docView.html(doc.html);        
               
        
        //$("#main .leftCol").hide(300);
        
    };



    
    return {
        advQueryObj:_advQueryObj,
        doSearch:_doSearch,
        searchHistory:_searchHistory,
        dictionary:{
            add:function(dicObj){
                for (var d in dicObj){
                    _dictionaries[d]=dicObj[d];
                }
            },
            set:function(code){
                if(!_dictionaries[code]){
                    myConsole.alert("Dizionario non presente: " + code)
                }
                _currentDictionary=_dictionaries[code];
                return this.dictionary;
            },
            
            getTranslation:function(code){
                return _currentDictionary[code];
            }
        }
    };
    
})();









////// widgets ////////

    var widgets={
        init:function(){
            //setting the switch widget up
            doSwitch($("ul.switch"))
            
            //defining the click event
            $($("ul.switch a").live("click",function(e){
                e.preventDefault();
                
                var $this=$(this);
                $this.closest("ul").trigger("change",$this)
            }));           
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
                
    }