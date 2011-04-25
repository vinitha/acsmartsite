
$().ready(function(){    

    //defining and adding the dictionaries to HAP
    HAP.dictionary.add({
        it:{
            d_1:"Inserire un valore su cui effettuare la ricerca.",
            d_2:"non definito",
            d_3:"Mostra / nascondi",
            d_4:"Precedente",
            d_5:"Successivo",
            d_6:"Chiudi",
            d_7:"Stampa",
            d_8:"Aggiungi al Raccoglitore",
            d_8a:"Rimuovi dal Raccoglitore",
            d_9:"Risultati",
            d_10:"Raccoglitore",
            d_11:"Documento aggiunto al Raccoglitore!",
            d_12:"Documento rimosso dal Raccoglitore!",
            d_13:"Storico ricerche:",
            d_14:"Elimina",
            d_15:"Rimuovi tutto",
            d_16:"Vuoi davvero rimuovere tutti i documenti dal Raccoglitore?"
        },
        
        en:{
            d_1:"Please provide a value for the required field.",
            d_2:"undefined",
            d_3:"Show / hide",
            d_4:"Previous",
            d_5:"Next",
            d_6:"Close",
            d_7:"Print",
            d_8:"Add to the Binder",
            d_8a:"Remove from the Binder",
            d_9:"Results",
            d_10:"Binder",
            d_11:"Document added to the Binder!",
            d_12:"Document removed from the Binder!",
            d_13:"Search history:",
            d_14:"Delete",
            d_15:"Clear all",
            d_16:"Are you sure you want to remove all the documents from the Binder?"
        }    
    })

    //setting the current dictionary (getting it from the <HTML> lang attribute)
    HAP.dictionary.set(document.documentElement.lang);

    
    //adding the show/hide leftCol button
    $("#leftCol")
        .append(
            $("<a id='leftColBtn' title='" + HAP.dictionary.getTranslation("d_3") + "' href='#showHide'><span>" + HAP.dictionary.getTranslation("d_3") + "</span></a>")
                .click(function(){
                    var col=$(this).closest("div");
                    if(col.hasClass("contracted")){
                        col.trigger("expand")
                        HAP.tmpSettings.leftColContracted=false;
                    }else{
                        col.trigger("contract")
                        HAP.tmpSettings.leftColContracted=true;
                    }
                })
        )
        .bind("expand",function(){
            var lCol=$(this).removeClass("contracted")   
            $(".colContent",lCol).show(300)        
        })
        .bind("contract",function(){
            var lCol=$(this).addClass("contracted")   
            $(".colContent",lCol).hide(300)        
        })
        
        
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
        
        HAP.doSearch({
            qForm:stdForm,
            callback:function(resObj){
                
                var sh=HAP.searchHistory();
                
                //aggiungo la ricerca all'history                
                sh.push(resObj.query);
                
                if(sh.length>8){
                    sh.shift();
                }                
            }
        })
    })     
    
    
    var mainMenu=$("#menuBar").find("ul");
    
    mainMenu.bind("change",function(e,aObj){
        
        // if the href is a proper URL then follow the link
        if(!aObj.hash){
            location.href=aObj.href;
            return false;
        }
                
        // otherwise switch the anchor visibility
        $(aObj.hash).slideDown(300).siblings().slideUp(300);
        
        //moving the focus to the main Content
        $("#bodyCol").focus();
        
        
        //additional item specific actions
        switch(aObj.hash){
            case "#homeContent":
                $("#leftCol").trigger("expand")
            break;
                
            case "#risultatiRicerca":
                if(typeof HAP.tmpSettings.leftColContracted=="undefined"){
                    if(HAP.tmpSettings.docOpen){
                        $("#leftCol").trigger("contract")
                    }
                }else{
                    if(!(HAP.tmpSettings.leftColContracted===false)){
                        if(HAP.tmpSettings.docOpen){
                            $("#leftCol").trigger("contract")
                        }
                    }
                }                
            break;
        
            case "#docsBinder":
                //HAP.docsBinder.refresh();
            break;
        
        }
    })
    
    //setting the advanced search module up.
    var advForm=$("#advSearch"),
        fieldset=advForm.find("fieldset.multiple").eq(0),
        select=fieldset.find("select"),
        input=fieldset.find("input"),
        addRuleBtn=fieldset.find("a.addRule");
        
    //handling the searchSwitch change event
    $("#searchSwitch").bind("change",function(e,aObj){
        var toShow=aObj.hash,
            toHide=(toShow=="#advSearch")?"#stdSearch":"#advSearch",
            title=$("#searchPanel").find("h3");
           
        $(toShow).slideDown(300,function(){$(this).find("input").eq(0).focus()});
        $(toHide).slideUp(300);
        
        toShow=="#advSearch"?(title.slideDown(300)):(title.slideUp(300));
        
    })
    
    //in-field labels
    $("#stdSearch").find("label").inFieldLabels();    

    $("#bodyCol").attr("tabindex",-1);
    
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
                myConsole.alert(HAP.dictionary.getTranslation("d_1"))
                return false;
            }
        }
        
        HAP.doSearch({
                qForm:advForm,
                qData:qString,
                obj:HAP.advQueryObj.getHash(),
                callback:function(resObj){
                    var sh=HAP.searchHistory();
                    
                    //aggiungo la ricerca all'history                
                    sh.push(resObj.query);
                    
                    if(sh.length>8){
                        sh.shift();
                    }                
                }
            })
        
    })
    
    //on reset
    advForm.find("button.reset").click(function(e){
        e.preventDefault();
        HAP.advQueryObj.clear();
        
        advForm.find("input:first").focus();
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
  
    //widgets init function
    widgets.init()
    
    //Hap init
    HAP.init();
    
});



var HAP=(function(){
    var _searchHistory=[],
        _dictionaries={},
        _currentDictionary=null,
        _Binder={},
        _Binder_Doc_count=0,
        _currentResults={};      //hashtable usato per il lookup rapido dei documenti correntemente mostrati all'utente
    

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
            qCount=0
            queriesHash={};
            showOnElement.empty();
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
            refresh()
        }
        
        refresh=function(){
            var i=0;
            showOnElement.empty();
            for(var obj in queriesHash){
                if(i==0){
                    delete(queriesHash[obj].operator);
                }
                i++;
                
                if(obj!="fields"){
                    drawObj(queriesHash[obj]);
                }
            }            
        }
        
        getHash=function(){
            return queriesHash;
        }
        
        setHash=function(obj){
            clear();
            
            for(p in obj){
                
                if(p!="fields"){
                    addQuery(obj[p]);
                }
            }
            
            var advForm=$("#advSearch");
            advForm.find("input[type='checkbox']").attr("checked",false);
            
            if(obj.fields){
                for(var chk in obj.fields){
                    var chkObj=obj.fields[chk]
                    advForm.find("#"+chkObj.name).attr("checked",true);
                }
            }
            
            
            
        }
        //public propeties/methods
        return {
            addQuery:addQuery,
            getQueriesString:getQueriesString,
            clear:clear,
            showOn:showOn,
            getHash:getHash,
            setHash:setHash,
            refresh:refresh
        }
    })();

    
    
    
    
    
    //effettua la ricerca
    function _doSearch(qObj){
        /*qObj structure:            
            qForm,qData,obj,callback
        */        
        var qData=((typeof qObj.qData)=="string")?escape(qObj.qData):qObj.qForm.serialize();
        
        var queryObject=$.extend({},qObj.obj);
        
        //se non viene passato allora e' una ricerca semplice
        if(!qObj.obj){
            queryObject=qObj.qForm.serializeArray()[0];
        }else{
            //aggiungo gli altri campi del form (advanced search only)
            queryObject.fields=$("#archivi input").serializeArray();
        }
        
 
        //aggiungo un booleano da usare lato server per distinguere una ricerca ajax da una classica (=> no JS)
        qData={"query":qData,isAjax:true};
        
        $.ajax({
            url:qObj.qForm.attr("action"),
            data:qData,
            method:qObj.qForm.attr("method"),
            dataType:"json",
            success:function(data){
                //nessun documento e' aperto al momento
                HAP.tmpSettings.docOpen=false;
                
                var cbData=qObj.callback?qObj.callback({query:queryObject,data:data}):null;
                
                
                //se la callback ritorna False -> esco senza mostrare i risultati
                if(cbData===false){
                    return false;
                }
                
                //rendering grafico dei risultati
                _showResults(data);
                
                //rendering grafico dello storico ricerche
                _showSearchHistory();
                
                //rendering grafico dei clusters
                //_showClusters(data.clusters);
                
                utils.createCookie("searchHistory",JSON.stringify(_searchHistory),1);
            },
            error:function(a,b,c){
                alert(b||a||c)
            }
        })
    };
    
    function _showSearchHistory(){
        var $div=$("#searchHistory"),
            $title=$div.find("h3"),
            $ul=$div.find("ul")
        
        if(_searchHistory.length==0){
            $div.hide(0);
            $ul.empty();        
            return false;
        }
        
        $div.show(0);
        
        if($div.length==0){
            $div=$("<div id='searchHistory' />").insertBefore($("#searchPanel"));
            $title=$("<h3 />").text(HAP.dictionary.getTranslation("d_13")).appendTo($div);
            $ul=$("<ul />").addClass("switch btnsSwitch").appendTo($div);
            doSwitch($ul);
            
            $ul.bind("itemClick",function(e, anchor){
                var q=$(anchor).data("data_query"),
                    switcher=$("#searchSwitch"),
                    base=switcher.find(".base a"),
                    adv=switcher.find(".adv a");                
                
                if(q.name){ //la ricerca semplice e' l'unica che ha un attr=nome
                    var input=$("#stdSearch").find("input[name='"+q.name+"']").val(q.value);
                    
                    switcher.trigger("itemClick",base);
                    input.focus().keydown()
                }else{
                    switcher.trigger("itemClick",adv);
                    HAP.advQueryObj.setHash(q);
                }
                
            })
        }
        
        $ul.empty();        
        
        for (var s=0;s< _searchHistory.length;s++){
            
            var search=_searchHistory[s],
                $li=$("<li/>").appendTo($ul);
            
            var label=search.value;
            if(!label){   
                for (var o in search){
                    if(o!="fields"){
                        label=search[o].value;
                    }
                }
            }
            
            $("<a />")
                .addClass("search")
                .appendTo($li)
                .attr("href","#" + label)
                .data("data_query",search)
                .text(label)                
                
                
            $("<button />")
                .addClass("remove")
                .attr("title",HAP.dictionary.getTranslation("d_14"))
                .data("data_index",s)
                .click(function(e){
                    e.preventDefault();
                    
                    var s=$(this).data("data_index");
                    
                    //removing the entry from the array
                    _searchHistory.splice(s,1);
                    
                    //updating the cookie
                    utils.createCookie("searchHistory",JSON.stringify(_searchHistory),999);

                    //refresh
                    _showSearchHistory();
                })
                .appendTo($li)                
        }
        
        $ul.appendTo($div);
        
    };

    
    function _showResults(json){
        
        //pulisco l'hashTable dei risultati correnti
        _currentResults={};
        
        
        var mainMenu=$("#menuBar ul")
        var risLi=$("li.risultati",mainMenu),
            risDiv=$("#risultatiRicerca"),
            risClust=$("risultatiCluster");
            
        if(risLi.length==0){
            risLi=$("<li class='risultati newItem icon' ><a href='#risultatiRicerca' title='"+HAP.dictionary.getTranslation("d_9")+"' ><span>"+HAP.dictionary.getTranslation("d_9")+"</span></a></li>")
                .appendTo(mainMenu);
         
            risDiv=$("<div id='risultatiRicerca' />").appendTo("#bodyCol").hide(0);
        }
        risDiv
            .empty()
            .append($("<h3 class='titoloPannello'>Risultati della ricerca:</h3>"));
                
        
        //controllo la larghezza (nel caso aggiungo i pulsantini di scroll)
        mainMenu.trigger("checkWidth",mainMenu);
        
        var arUL=$("<ul class='archivi tabMenu' />")
            .appendTo($("<div id='docMenu' />").appendTo(risDiv));
            
        //creo i tab dei documenti
        var documenti=json.documenti;
        for (var x=0;x<documenti.length;x++){
            var obj=documenti[x];
            //creo l'entry nel tabmenu
            $("<li class='li_arch' ><a class='' href='#arch_"+obj.id+"' title='Apri archivio' ><span>"+obj.nome+" ("+obj.totaleDocs+")</span></a></li>")
                .appendTo(arUL);
            
            //creo il div che conterra' i documenti
            var docDiv=$("<div class='archDiv' id='arch_"+obj.id+"' />").appendTo(risDiv).hide(0)
            
            
            //aggiungo la paginazione
            var pagDiv=$("<div class='pagination' />")
            var pagUl=$("<ul class='switch' />").appendTo(pagDiv);
            
            var pStart=Math.max(0,Math.min(obj.pagina-6,obj.totPagine-10)),
                pEnd=Math.min(pStart+10,obj.totPagine),
                curPage=null;
                
            for(var p=pStart;p<pEnd;p++){
                var li=$("<li><a title='"+(p+1)+"' href='#"+p+"'>"+ (p+1) +"</a></li>").appendTo(pagUl);
                if((p+1)==obj.pagina){
                    curPage=li.find("a");
                }
            }
            
            pagUl.appendTo(pagDiv.appendTo(docDiv))
            doSwitch(pagUl);
            pagUl.trigger("itemClick",curPage)
            pagUl.change(function(e,aObj){
                myConsole.info("vai a pag: "+$(aObj).text())
            })
                        
            _createDocumentsUl({
                    data:obj.risultati,
                    container:docDiv,
                    hashTable:_currentResults
                    });
            
        }
        
        //lo rendo un menu
        doTabMenu(arUL);
        
        arUL.change(function(e,aObj){
            $(aObj.hash).show(0).siblings("div.archDiv").hide(0);            
        })
        
        mainMenu.trigger("itemClick",risLi.find("a"));
        arUL.trigger("itemClick",arUL.find("a:first"));
        


        //creo il tab dei clusters
        var clusters=json.clusters;
        
        //creo l'entry nel tabmenu
        $("<li class='li_arch clusters' ><a class='' href='#clust_div' title='Apri clusters' ><span>Clusters</span></a></li>")
            .appendTo(arUL);
            
        //creo il div che conterra' i documenti
        var docDiv=$("<div class='archDiv clusterDiv' id='clust_div' />").appendTo(risDiv).hide(0)
            
        for (var x=0;x<clusters.length;x++){
           var obj=clusters[x];
           $("<p />").text(obj.nome).appendTo(docDiv)
        }
        
        //ricalcolo la larghezza minima del tab menu (usato per lo scroller)
        arUL.trigger("checkWidth",arUL);
    };
    
    function _createDocumentsUl(options){
        /* options={
                    data:
                    container:
                    hashTable
                    }
        */
        //creo i documenti
        var docUL =options.container.find(".documenti").empty();
        
        if(docUL.length==0){
            docUL=$("<ul class='documenti switch' />").appendTo(options.container);
            
            //lo rendo uno switch!
            doSwitch(docUL);
            
            docUL.bind("itemClick",function(e, anchor){
                _showDocument({
                    doc:$(anchor).data("data-doc"),
                    container:$(anchor).closest("div")
                });
                 
                if((typeof HAP.tmpSettings.leftColContracted==undefined)){
                    $("#leftCol").trigger("contract")
                }else{
                    if(!(HAP.tmpSettings.leftColContracted===false)){
                        $("#leftCol").trigger("contract")
                    }
                }
            })            
        }
        
        var tmpData=[];
        if($.isPlainObject(options.data)){
            for(var p in options.data){
                tmpData.push(options.data[p]);
            }
            
            options.data=tmpData;
        }
        
        //aggiorno il numero dei doc.
        _Binder_Doc_count=0;
        
        for (var d=0;d<options.data.length;d++){
            var doc=options.data[d];
            
            _Binder_Doc_count++;
            
            //popolo l'hashtable
            if(options.hashTable){
                options.hashTable[doc.id]=doc;
            }
            
            
            
            var li=$("<li class='li_doc' />").appendTo(docUL);
            
            var a=$("<a class='doc' href='#doc_"+doc.id+"' title='"+doc.titolo+"' ><span>"+doc.titolo+"</span></a>")
                        .data("data-doc",doc)
                        .append(
                            $("<a href='#doc_"+doc.id+"' ><span class='hidden'>" + HAP.dictionary.getTranslation("d_8") +"</span></a>")
                            .data("data-doc",doc)
                            .click(function(e){
                                    e.preventDefault();
                                    var $this=$(this),
                                        doc=$this.data("data-doc");
                                    
                                    if($(this).hasClass("add")){
                                        HAP.docsBinder.add(doc);
                                        $this.removeClass("add").addClass("remove")
                                    }else{
                                        HAP.docsBinder.remove(doc);                                        
                                        if($(this).closest("li").hasClass("current")){
                                            //if removing the doc currently displayed...
                                            _closeDocument(options.container);                                            
                                        }
                                        $this.removeClass("remove").addClass("add")
                                    }
                                    
                                    HAP.docsBinder.refresh();
                                                
                                    return false;                                    
                                }
                            )
                        )  
                .appendTo(li)                                                    
            
            a.mouseenter(function(){                
                
                var add=HAP.docsBinder.getDoc(this.hash.replace("#doc_",""))==undefined,
                    $this=$(this);
                
                $this.find("a")
                    .attr("title",HAP.dictionary.getTranslation(add?"d_8":"d_8a"))
                    .removeClass("add remove")
                    .addClass(add?"add":"remove")
                    .find("span").text(HAP.dictionary.getTranslation(add?"d_8":"d_8a"));
            })
        }
        
          
    };
    
    function _closeDocument(container){
        HAP.tmpSettings.docOpen=false;
        
        container
            .find(".toolBar").hide(0).end()
            .find(".hap_docView").hide(0);
            
        var docsUl=container.find("ul.documenti");
            
        
        
        var newWidth=docsUl.closest("div").innerWidth()-docsUl.closest("div").css("padding-left").replace("px","");
        docsUl.animate({width:newWidth},600,function(){
                container.removeClass("showingDoc");
                docsUl.css("width","auto")
            });    
            
    };
    
    function _showDocument(options){
        /* options={
                doc,
                container
            }
        */
        //we have a doc. displayed
        HAP.tmpSettings.docOpen=true;
        
        options.container.find(".toolBar").remove();
        
        var toolBar=$("<div class='toolBar' />").attr("tabIndex",-1),
            add=HAP.docsBinder.getDoc(options.doc.id)==undefined;
        
        //todo: wrappare i link in un <ul>
        toolBar
            .append(
                $("<a href='#prev' class='btn prev' title='" + HAP.dictionary.getTranslation("d_4")+ "'><span class='hidden'>" + HAP.dictionary.getTranslation("d_4")+ "</span></a>")
                    .click(function(e){
                        e.preventDefault();
                        options.container.find("ul.documenti").prevItem();
                    })
            )
            .append(
                $("<a href='#next' class='btn next' title='" + HAP.dictionary.getTranslation("d_5")+ "'><span class='hidden'>" + HAP.dictionary.getTranslation("d_5")+ "</span></a>")
                    .click(function(e){
                        e.preventDefault();
                        options.container.find("ul.documenti").nextItem();
                    })
            )
            
            .append(
                $("<a href='#print' class='btn print' title='" + HAP.dictionary.getTranslation("d_7")+ "'><span class='hidden'>" + HAP.dictionary.getTranslation("d_7")+ "</span></a>")
                    .click(function(){myConsole.info(HAP.dictionary.getTranslation("d_7"))})
            )
            .append($("<a href='#add' class='" + (add?"btn add":"btn remove") +"' title='" + HAP.dictionary.getTranslation("d_8")+ "'><span class='hidden'>" + HAP.dictionary.getTranslation("d_8")+ "</span></a>")
                        .data("data-doc",options.doc)
                        .click(function(e){
                            e.preventDefault();
                            var $this=$(this)
                                doc=$this.data("data-doc")
                                add=$this.hasClass("add");

                            if(add){
                                HAP.docsBinder.add(doc);                                
                            }else{
                                HAP.docsBinder.remove(doc);
                                if($this.closest("div").parent("div").attr("id")=="docsBinder"){
                                    _closeDocument(options.container)
                                }
                            }
                            this.className="btn";
                            
                            $this.addClass(add?"remove":"add");
                            
                            HAP.docsBinder.refresh();
                            return false;
                        })
                        .mouseenter(function(){
                            var doc=$(this).data("data-doc");
                            var add=HAP.docsBinder.getDoc(doc.id)==undefined,
                                $this=$(this);
                                
                            this.className="btn";
                            $this.addClass(add?"add":"remove");
                        })
            )
            
            .append(
                $("<a href='#close' class='btn close' title='" + HAP.dictionary.getTranslation("d_6")+ "'><span class='hidden'>" + HAP.dictionary.getTranslation("d_6")+ "</span></a>")
                    .click(function(){_closeDocument(options.container)})
            )
    
                
        
        var docView=options.container.find(".hap_docView").empty().detach();
        if (docView.length==0){
            docView=$("<div class='hap_docView' />");
        }
        
        var doc=options.doc,
            docsUl=options.container.find("ul.documenti"),
            title=$("<h3/>").text(doc.titolo).appendTo(docView),
            content=$("<div class='content' />").appendTo(docView);
            
        docsUl.css({width:docsUl.innerWidth()-docsUl.css("padding-left").replace("px","")})
        
        
        if(options.container.hasClass("showingDoc")){
            toolBar.appendTo(options.container).show(0);
            content.html(doc.html)
            docView.appendTo(options.container).show(0);
                
            //muovo il focus sul documento per migliorare l'usabilita'
            toolBar.focus();            
        }else{
            options.container.addClass("showingDoc");
            //var width=$("#leftCol").hasClass("contracted")?280:140;
            var width=140;
            docsUl.animate({width:width},600,function(){
                toolBar.appendTo(options.container).show(0);
                content.html(doc.html)
                docView.appendTo(options.container).show(0);
                
                //muovo il focus sul documento per migliorare l'usabilita'
                toolBar.focus();                
            });    
        }
        
        if (!doc.html){
            //Recupero il corpo del documento via Ajax!
            
            content.parent().addClass("loading");
            $.ajax({                
                url:sysConfig.htmlBodyUrl,
                data:{docId:doc.id},
                method:"get",
                dataType:"text",
                success:function(data){
                    content.html(data);
                    doc.html=data;
                },
                error:function(a,b,c){
                    alert(b||a||c)
                },
                complete:function(){
                    content.parent().removeClass("loading");
                }
            })
            
        }
        
        
    };



    
    return {
        init:function(){
            //creo il pannello con lo storico delle ricerche            
            _searchHistory=$.parseJSON(utils.readCookie("searchHistory"))||[];
            
            _showSearchHistory();            
            
            
            //recupero i documenti del Raccoglitore salvati nei cookies            
            _Binder=$.parseJSON(utils.readCookie("docsBinder"))||{};
            
            HAP.docsBinder.refresh();
            HAP.docsBinder.createTab()
            
            
        },        
        advQueryObj:_advQueryObj,
        doSearch:_doSearch,
        searchHistory:function(){ return _searchHistory},
        tmpSettings:{},
        documents:{
            getDoc:function(docId){
                return _currentResults[docId];
            }
        },
        docsBinder:{
            save:function(){
                //"salvo" il Raccoglitore nei cookies
                
                var obj={};
                for(var o in _Binder){
                    var doc=_Binder[o];
                    obj["Doc_" + doc.id]={
                        id:doc.id,
                        titolo:doc.titolo
                    }
                }
                
                utils.createCookie("docsBinder",JSON.stringify(obj),999);
            },
            
            add:function(docObj){

                if(_Binder["Doc_" + docObj.id]){
                    alert("Documento gia' nel Raccoglitore")
                    return false;
                }
                
                _Binder["Doc_" + docObj.id]=docObj;
                _Binder_Doc_count++;
                
                HAP.docsBinder.createTab();
                HAP.docsBinder.save();
                
                
                myConsole.info(HAP.dictionary.getTranslation("d_11"),2000);
            },
            createTab:function(){
                
                if(_Binder_Doc_count==0){
                    return false;
                }
                var menu=$("#menuBar ul"),
                    li=menu.find(".docBinder");
                    
                if(li.length==0){
                    li=$("<li class='docBinder newItem icon'><a href='#docsBinder' title='"+HAP.dictionary.getTranslation("d_10")+"'><span>"+HAP.dictionary.getTranslation("d_10")+"</span></a></li>")
                        .appendTo(menu)
                        .slideUp(0)
                        .slideDown(500);
                    $("<button/>")
                        .attr("title",HAP.dictionary.getTranslation("d_15"))
                        .click(function(e){
                            e.preventDefault();
                            
                            if(confirm(HAP.dictionary.getTranslation("d_16"))){
                                //svuoto il raccoglitore
                                HAP.docsBinder.empty();
                            }
                        })
                        .appendTo(li);
                }
                
                menu.trigger("checkWidth",menu);
            },
            remove:function(doc){
                
                if(_Binder["Doc_" + doc.id]){
                    delete(_Binder["Doc_" + doc.id]);
                    _Binder_Doc_count--;
                }
                
                if (_Binder_Doc_count==0){
                    HAP.docsBinder.empty();
                }
                
                //"salvo" il Raccoglitore nei cookies
                HAP.docsBinder.save();
                
                myConsole.info(HAP.dictionary.getTranslation("d_12"),2000);
            },
            empty:function(){
                _Binder={};
                _Binder_Doc_count=0;
                
                //"salvo" il Raccoglitore nei cookies
                HAP.docsBinder.save();
                
                
                $("#menuBar li.docBinder").remove();
                var newTab=$("#menuBar").find("li.risultati a");
                if (newTab.length==0){
                    newTab=$("#menuBar li a");
                }
                
                $("#menuBar .tabMenu").trigger("itemClick",newTab.eq(0))
                
                var menu=$("#menuBar ul");
                menu.trigger("checkWidth",menu);
            },
            getAll:function(){
                return _Binder;
            },
            getDoc:function(docId){
                return _Binder["Doc_" + docId];
            },
            refresh:function(){
                var div=$("#docsBinder"),
                    isNew=(div.length==0);
                
                if(isNew){
                    div=$("<div id='docsBinder' />").appendTo("#bodyCol").hide(0);
                    
                }
                                
                _createDocumentsUl({
                    data:_Binder,
                    container:div,
                    hashTable:null
                    })
                
            }
        },
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
            $($("ul.switch a, ul.tabMenu a").live("click",function(e){
                e.preventDefault();
                
                var $this=$(this);                
                $this.closest("ul").trigger("itemClick",$this);
                return false;
            }));
            
            doTabMenu($("ul.tabMenu"));
            
            $(window).resize(function(){
                $("ul.tabMenu").each(function(){
                    $(this).trigger("checkWidth",this)
                })    
            });
            
           
            
        }
    };



    //tabMenu widget
    function doTabMenu(ulElem){
        
        ulElem.bind("checkWidth",function(e,ul){
            
            
            //assigning the tabMenus' parent min-width value
            var $this=$(ul);
                parent=$this.parent(),
                btnsBar=parent.siblings("div.scrollBtnsBar"),
                width=0;
                
            $this.find("li").each(function(){
                width+=$(this).outerWidth(true);
            })
            $this.css("min-width",width+1);            
            
            //nel caso servissero i pulsantini
            if(parent.innerWidth()<parent.get(0).scrollWidth){
                btnsBar.addClass("scroll")
            }else{
                btnsBar.removeClass("scroll")
            }        
        })
        
        doSwitch(ulElem);
        
        ulElem.bind("change",function(e,anchor){
            var menu=$(anchor).closest("ul")
            menu.trigger("checkWidth",menu);
        })
        
        //tabMenu
        ulElem.each(function(){
            var parent=$(this).parent(),
                div=$("<div class='scrollBtnsBar' />");
                
            $("<button class='btnLeft'><span>Scroll left</span></button>")
                .click(function(){
                    scroller(parent).scrollLeft();    
                })
                .prependTo(div)
            $("<button class='btnRight'><span>Scroll right</span></button>")
                .click(function(){
                    scroller(parent).scrollRight();    
                })
                .appendTo(div);
            
            div.insertBefore(parent)
        })        
    }

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
        
        ulElem.bind("itemClick",function(e,currentA){
                if($(currentA).closest("li").hasClass("current")){return false;}
                $(currentA).closest("ul").trigger("change",currentA)
            });
        
        //widget init.
        ulElem.trigger("change",ulElem.find(".current a"))
        
        $.fn.nextItem=function(){
		var thisObj=$(this);
                var nextItem=thisObj.find(".current").next().find("a");

                if (nextItem.length==0){return false;}
                thisObj.trigger("itemClick", nextItem);
                return thisObj;
        };
        
        $.fn.prevItem=function(){
		var thisObj=$(this);
                var prevItem=thisObj.find(".current").prev().find("a");
                
                if (prevItem.length==0){return false;}
                thisObj.trigger("itemClick", prevItem);
                return thisObj;
        }        
    }