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



var bmMatrix={
    matrix:null,
    buildWidget:function(data){
        bmMatrix.matrix=data.MarketsMatrix;
        
        console.dir(bmMatrix.getBMs(null,"Ncsa",null))
    },

    getBMs:function (asset,region,exchange){
        
        var obj=bmMatrix.getObjsAtLevel(bmMatrix.matrix,0,asset);
        obj=bmMatrix.getObjsAtLevel(obj,1,region);
        obj=bmMatrix.getObjsAtLevel(obj,2,exchange);
        
        return obj
    
    },
    
    getObjsAtLevel:function(obj,level,name){
        //traverses an object and returns an hashtable of that object Nth-level children (optionally filtered by "name").
        
        var newObj={};
        
        if (level==0){
            newObj[name]=obj[name];
            return name?(newObj[name]?newObj:null):obj
        }
        
        level--;
        
        var hasChildren=false;
        for (var o in obj){
            
            var child=bmMatrix.getObjsAtLevel(obj[o],level,name)
            if(child){
                newObj[o]=child;
                hasChildren=true;
            }            
            
        }
        return hasChildren?newObj:null;

    }
}


