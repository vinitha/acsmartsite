
function toJsonString(obj) {
    var parts = [];
    var is_list = (Object.prototype.toString.apply(obj) === '[object Array]');
	
    for(var key in obj) {
    	var value = obj[key];
		
        if(typeof value == "object") { 							//Custom handling for arrays
			var tmpStr = toJsonString(value);
			if(!is_list){
				parts.push('"' + key + '":' + tmpStr); 	/* :RECURSION: */				
			}else{
				parts.push(tmpStr); 					/* :RECURSION: */							
			}
			
        } else {
			//if(key=="toJsonString") continue;
            var str = "";
            if(!is_list) str = '"' + key + '":';

		//Custom handling for multiple data types
            if(typeof value == "number") str += value; 		//Numbers
            else if(value === false) str += 'false'; 		//The booleans
            else if(value === true) str += 'true';
            else str += '"' + value + '"'; 					//All other things
        // :TODO: Is there any more datatype we should be in the lookout for? (Functions?)

            parts.push(str);
        }
    }
    var json = parts.join(",");
	
    if(is_list) return '[' + json + ']';		//Return numerical JSON
    return '{' + json + '}';					//Return associative JSON
}