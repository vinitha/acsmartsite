/* Author: Alessio Carnevale

*/

$().ready(function(){
	var h1=$("h1");
	var str=h1.text();
	h1.empty();
	
	for(var x=0;x<str.length;x++){
		$("<span />")
			.text(str.charAt(x))
			.addClass(str.charAt(x)==" "?"invisible":"")
			.appendTo(h1);
		
	}

})





















