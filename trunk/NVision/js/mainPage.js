$().ready(function(){
    
    //getting the bmMAtrix
    $.ajax({
        url:sysConfig.bmMatrix,
        type:"GET",
        dataType:"json",
        success:function(data){
            bmMatrix.buildWidget(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            alert(textStatus||errorThrown);            
        }
    })  
});



var bmMatrix=(function(){
    var _matrix=null;
    var filterObj={};
    
    _buildWidget=function(data){
        _matrix=data.MarketsMatrix;
        
        var cmbAsset=$("#asset"),
            cmbRegion=$("#region"),
            cmbExchange=$("#exchange")

        
        //creating the first level buttons
        _populateCombo(cmbAsset,"Asset class",_getObjsAtLevel(_matrix,0))
        _populateCombo(cmbRegion,"Regions",_getObjsAtLevel(_matrix,1))
        _populateCombo(cmbExchange,"Exchange",_getObjsAtLevel(_matrix,2))
              
            
        $("#marketPicker select").change(function(ev){
                var comboVal=$(this).attr("value");
                
                filterObj[this.id]=(comboVal=="")?null:comboVal;
                        
                var bmTable=_getBMs(filterObj);            
            
            $("#availableBMs").empty();
            
            var bms=_getObjsAtLevel(bmTable,2);
            
            for(var bm in bms){
                $("<a />")
                    .attr("href","#" + bm)
                    .text(bm)
                    .appendTo("#availableBMs")
            }
        })
            
        
    };
    
    _populateCombo=function(combo,title,data){
        combo.empty();
        
        $("<option />")
            .text("- - -")
            .attr("value","")
            .appendTo(combo)
            
        for (var obj in data){
            $("<option/>")
                .text(obj)
                .attr("value",obj)
                .appendTo(combo)
        }
    };

    _getBMs=function (filters){        
        var obj=_getObjsByName(_matrix,0,filters.asset);
        obj=_getObjsByName(obj,1,filters.region);
        obj=_getObjsByName(obj,2,filters.exchange);
        
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
    
    _getObjsAtLevel=function(obj,level){
        //traverses an object and returns an hashtable of that object Nth-level children.
        
        var newObj={};
        
        if (level==0){
            return obj
        }
        
        level--;
        
        for (var o in obj){
            
            var child=_getObjsAtLevel(obj[o],level)
            
            for (var c in child){
                newObj[c]=child[c]
            }            
        }
        return newObj;

    };      
    
    
    return   {
       buildWidget:_buildWidget, 
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
