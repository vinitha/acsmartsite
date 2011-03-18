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
        
        console.dir(bmMatrix.getBMs(null,null,"Eurex"))
    },

    getBMs:function (asset,region,exchange){
        
        return bmMatrix.getObjsAtLevel(bmMatrix.matrix,1, "Seap")
    
    },
    
    getObjsAtLevel:function(obj,level,name){
        //traverses an object and returns an hashtable of that object Nth-level children.
        if (level==0){            
            return name?obj[name]:obj;
        }
        
        level--;
        
        var lObj={};
        for (var o in obj){
            lObj=$.extend(lObj,bmMatrix.getObjsAtLevel(obj[o],level,name))
        }
        
        return lObj;

    }
}


