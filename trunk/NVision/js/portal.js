/* Author: 
    Alessio Carnevale
*/

$().ready(function(){
    $("#appsList a").append(
        $("<div class='overlay' />")        
    )
    
    $("#appsList li").hover(
        function(){$(this).addClass("hover")},
        function(){$(this).removeClass("hover")}
    )
})