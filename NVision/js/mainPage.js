


$().ready(function(){
    
    //getting the bmMAtrix
    $.ajax({
        url:sysConfig.bmMatrix,
        type:"GET",
        dataType:"json",
        success:function(data){
            bmMatrix.buildWidget(data);
            
            $("#marketPicker label").css("zoom",1)  //this is needed to fix an IE7 layout issue (WTF!)
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(textStatus||errorThrown);            
        }
    })
    
    setTimeout(
        function(){
            $(".tip")
                .fadeOut(300,
                    function(){
                        $(this)
                            .fadeIn(300)
                            .addClass("on")
                            .html("<strong>Ctrl + click</strong> to open the Business Martket in a new Tab.");
                })        
        }   
        ,5000
    )
});



var bmMatrix=(function(){
    var _matrix=null;
    var filterObj={};
    
    _buildWidget=function(data){
        _matrix=data;//.MarketsMatrix;
        
        var cmbAsset=$("#asset"),
            cmbRegion=$("#region");
            //cmbExchange=$("#exchange");

        
        //creating the first level buttons
        _populateCombo(cmbAsset,"Asset class",_getHashAtLevel(_matrix,1))
        _populateCombo(cmbRegion,"Regions",_getHashAtLevel(_matrix,3))
        //_populateCombo(cmbExchange,"Exchange",_getHashAtLevel(_matrix,5))
              
            
        $("#marketPicker select").change(function(ev){
            var comboVal=$(this).blur().attr("value");            
            
            filterObj[this.id]=(comboVal=="")?null:comboVal;
                    
            var bmTable=_getBMs(filterObj);            
            
            $("#availableBMs").empty();
            
            var bms=_getListAtLevel(bmTable,5);
            
            //filtering out the combos content
            _populateCombo(cmbAsset,"Asset class",_getHashAtLevel(bmTable,1),filterObj.asset)
            _populateCombo(cmbRegion,"Regions",_getHashAtLevel(bmTable,3),filterObj.region)
            //_populateCombo(cmbExchange,"Exchange",_getHashAtLevel(bmTable,5),filterObj.exchange)            
            
            //creating the BMS buttons
            for(var x=0;x<bms.length;x++){
                $("<a />")
                    .attr("href",sysConfig.bmUrl+ "#BM=" + bms[x].id)
                    .text(bms[x].name)
                    .appendTo("#availableBMs")
            }
        })
        
        cmbAsset.change();
        
    };
    
    _populateCombo=function(combo,title,data,selectedValue){
        combo.empty();
        
        $("<option />")
            .text("- - -")
            .attr("value","")
            .appendTo(combo)    
            
        for (var obj in data){
            $("<option/>")
                .text(obj)
                .attr("value",obj)
                .attr("selected",selectedValue==obj?"selected":"")
                .appendTo(combo)
        }            
    };

    _getBMs=function (filters){        
        var obj=_getObjsByName(_matrix,1,filters.asset);
        obj=_getObjsByName(obj,3,filters.region);
        obj=_getObjsByName(obj,5,filters.exchange);
        
        return obj    
    };
    
    _getObjsByName=function(obj,level,name){
        //traverses an object and returns an hashtable of that object filtered by "name".
        
        var newObj={};
        
        if (level==0){
            newObj[name]=obj[name];
            return name?(newObj[name]?newObj:null):obj
        }
        
        level--;
        
        var hasChildren=false;
        for (var o in obj){
            
            var child=_getObjsByName(obj[o],level,name)
            if(child){
                newObj[o]=child;
                hasChildren=true;
            }            
            
        }
        return hasChildren?newObj:null;
    };   
    
    _getHashAtLevel=function(obj,level){
        //traverses an object and returns an hashtable of that object Nth-level children.
        
        var newObj={};
        
        if (level==0){
            return obj
        }
        
        level--;
        
        for (var o in obj){
            
            var child=_getHashAtLevel(obj[o],level)
            
            for (var c in child){
                newObj[c]=child[c]
            }            
        }
        return newObj;

    };      
    
    
    _getListAtLevel=function(obj,level){
        //traverses an object and returns a list of that object Nth-level children.
        
        var newObj=[];
        
        if (level==0){
            return obj
        }
        
        level--;
        
        for (var o in obj){
            
            var child=_getListAtLevel(obj[o],level)
            
            for (var c in child){
                newObj.push(child[c])
            }            
        }
        return newObj;

    };      
    
    return   {
       buildWidget:_buildWidget
    };
    
    })();








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
