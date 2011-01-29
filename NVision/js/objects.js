
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



// function used to bind the ajax request with the myConsole message
function myAjax(options){
    
    var attributes={
        logMsg:null,
        url:"",
        success:function(){},
        error:function(){},
        data:null
    }
        
    $.extend(attributes,options)
    
    if(attributes.logMsg){
        var msgId=myConsole.status(attributes.logMsg);    
    }
    
    $.ajax({
        url:attributes.url,
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
