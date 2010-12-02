/* Author: 
    Alessio Carnevale
*/


// Init
$().ready(function(){
    
    //creating the <p> to display validation feedback
    var errorMsg=$("<p />")
        .addClass("errorMsg")
        .appendTo(document.body);
                    
                    
    //setting the show/hide function
    $("a.hideBtn").click(function(e){
        e.preventDefault();
        $(this.hash).toggle("fast");
    })
    
    //setting the event delegation to show validation feedback
    $("form")
        .delegate("input","focus",function(){
            var $this=$(this)
            
            //if the input is invalid then display a feedback tooltip next to the field
            if($this.hasClass("invalid")){
                //getting the input position
                var pos=$this.offset();
                
                //displaying the tooltip
                if(!errorMsg.is(":visible")){                    
                    errorMsg
                        .text($this.data("msg"))
                        .css({
                            left:pos.left+$this.outerWidth(true),
                            top:pos.top
                        })
                        .fadeTo(1,200)
                }else{
                    errorMsg
                        .stop()
                        .fadeTo(1,200)
                        .text($this.data("msg"))
                        .animate({
                            left:pos.left+$this.outerWidth(true),
                            top:pos.top
                        },200);
                }
                
            }
        })
        .delegate("input","blur",function(){            
            //hiding the tooltip
            errorMsg.fadeOut(200);        
        })
        
        //form validation
        .submit(function(){
            
            var $this=$(this),
                isValid=true,
                toFocus=null;   //holds the element to move the focus on if validation fails.
               
                
                
            //going through the inputs array
            $this.find("input").each(function(){
                var $input=$(this)
                    .removeClass("invalid"), //clearing the input status                
                    fieldValue=$input.attr("value");
                    
                if ($input.hasClass("required")){
                    if (fieldValue.length==0){
                        $input.addClass("invalid");
                        $input.data("msg","This is a required field!")
                        isValid=false;
                        toFocus=toFocus||this;
                        
                        //skipping to the next item
                        return true;
                    }
                    
                }
                
                //checking the input format
                
                if (fieldValue.length>0){
                    switch($input.attr("data-check")){
                        
                        case "email":
                            
                            var pattern=/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
			    if(!pattern.test(fieldValue)){                                
                                $input.addClass("invalid");
                                $input.data("msg","Please provide a correct email address!")
                                isValid=false;
                                toFocus=toFocus||this;
                                
                                //skipping to the next item
                                return true;
                            }
                            
                        break;
                        
                        case "phone":
                            //UK mobile phone number, with optional +44 national code. Allows optional brackets and spaces at appropriate positions.
                            var pattern=/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
			    if(!pattern.test(fieldValue)){                                
                                $input.addClass("invalid");
                                $input.data("msg","Please provide a correct phone number!")
                                isValid=false;
                                toFocus=toFocus||this;
                                
                                //skipping to the next item
                                return true;
                            }
                        break;
                    }
                }
                
            })
            
            //moving the focus on the first invalid field
            if(toFocus){
                //console.log(toFocus)
                toFocus.focus();
            }
            return isValid;
        
        
        })

})





















