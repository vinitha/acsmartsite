/* requires jQuery */


//useful function
var utils={
	twoDigits:function(inte){
		if (inte<10) return "0" + inte;
		if (inte>99) {
			var str=inte.toString();
			return str.substring(str.length-2);
		}
			return inte.toString();
	},
	
		dateDiff:function(date1,date2){
		var baseDate=new Date(1970,01,01);
		date1=date1||baseDate;
		date2=date2||baseDate;
		
		return Math.abs(date1.getTime()-date2.getTime())
	},
	
	RealTypeOf:function(v) {
		if (typeof(v) == "object") {
		if (v === null) return "null";
		if (v.constructor == (new Array).constructor) return "array";
		if (v.constructor == (new Date).constructor) return "date";
		if (v.constructor == (new RegExp).constructor) return "regex";
			return "object";
		}
		return typeof(v);
	}
};         

Date.prototype.shortDate=function(sep){			//i.e. 22/11/1989
	sep=sep||"/";	
	return utils.twoDigits(this.getDate()) + sep + utils.twoDigits(this.getMonth()+1) + sep + this.getFullYear();
}

// object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element)
	
		var scrollRight=function(scrollSize){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var width=myDiv.innerWidth()*scrollSize,
				scrollWidth=myDiv.get(0).scrollWidth;			
			
			var availableScroll=scrollWidth-myDiv.scrollLeft()-width;					
			availableScroll=availableScroll>width?width:availableScroll;						
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},500)				
		}
		
		var scrollLeft=function(scrollSize){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var width=myDiv.innerWidth()*scrollSize,
				scrollWidth=myDiv.get(0).scrollWidth;
			
			var availableScroll=myDiv.scrollLeft();
			availableScroll=availableScroll>width?-width:-availableScroll;
				
			myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},500)
		}
		
		var scrollUp=function(scrollSize){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var height=myDiv.innerHeight()*scrollSize,
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=scrollHeight-myDiv.scrollTop()-height;					
			availableScroll=availableScroll>height?height:availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},500)				
		}
		
		var scrollDown=function(scrollSize){
			myDiv.stop();
			var scrollSize=scrollSize||1;
			var height=myDiv.innerHeight()*scrollSize,
				scrollHeight=myDiv.get(0).scrollHeight;
			
			var availableScroll=myDiv.scrollTop();
			availableScroll=availableScroll>height?-height:-availableScroll;						
			myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},500)
		}	
	
	return {
		scrollLeft:scrollLeft,
		scrollRight:scrollRight,
		scrollUp:scrollUp,
		scrollDown:scrollDown
	}
}


$(document).ready(function() {
  
	if ( jQuery("ul.tabs").length )
	{
   	initializeProductTabs();
   }
    
   //convert selects
   $("form.jqtransform").jqTransform();

   setupSearchFormBehaviour();

   if ($('#content').hasClass('search-page')) {     
     handleSearchResultsTypeFiltering();
   }
   
   
   /* jquery-ui stuff */
	initializeJqueryUiStuff();


    /* Remove dotted border effect when links clicked */
		jQuery(".tabContainer a, .accordionContainer h3").click(function(){
         this.blur();
      });
  
   // external links
   $('a[href][rel*=external]').each(function(i){
      this.target = "_blank";
   });
	
   // colorbox plugin used to display overlay - opens new html page into div
   	$('a.modalOverlay').colorbox({onComplete:function(box){
		
		//applying the custom scrollBar to the popup content
		box.find("h1").next("div")	
			.each(function(index,item){
				var myDiv=$(item)
				
				var sbContainer=$("<div class='popupScroll'></div>").insertAfter(myDiv)
				//adding the vertical scrollBar
				addScrollBar({
						horizontal:false,
						elemToScroll:myDiv,
						className:"verScrollBar",
						barContainer:sbContainer				//if null then scrollBar html will be inserted after the elemToScroll element.
					})							
			});		
	}});
   	
   if ($('#content').hasClass('faq-page')) initializeFaqToggles();
   
   
   if ( jQuery(".add-collection-link").length )
	{
   	initializeMyCollection();
   }
   	
/* binding toolTips events*/
	$(".carouselContainer ul a:first-child").live("mouseenter",function(){
		
		//creating the html for the toolTip content
		var ttContainer=$("<div></div>").addClass("container");
		var ttContent=$("<div></div>").addClass("content").appendTo(ttContainer);
		
		var $this=$(this);
		var	title=$this.siblings(".title").text()||"--",
			author=$this.siblings(".author").text()||"--",
			date=$this.siblings(".date").text()?new Date($this.siblings(".date").text().split(" ")[0]).shortDate():"--";			
		
		$("<p></p>")
			.text(title)
			.addClass("title")
			.appendTo(ttContent);
		
		var dl=$("<dl></dl>").appendTo(ttContent);
			
		$("<dt>Author(s):</dt>").appendTo(dl);
		$("<dd></dd>")
			.text(author)	
			.appendTo(dl);
			
		$("<dt>Pub Date:</dt>").appendTo(dl);
		$("<dd></dd>")
			.addClass("date")
			.text(date)
			.appendTo(dl);
			
		//showing the toolTip
		toolTip.show(ttContainer,this);
		
	})

	$(".carouselContainer ul a:first-child").live("mouseleave",function(){
		toolTip.hide();
	});
	
	
	/* customScrollBars */	
	$("#tab-1 .carousel-outer")			
		.each(function(index,item){
			var myDiv=$(item)
			//adding the horizontal scrollBar
			addScrollBar({
					horizontal:true,
					elemToScroll:myDiv,
					className:"myHorScrollBar",
					barContainer:myDiv.siblings(".horBar")				//if null then scrollBar html will be inserted after the elemToScroll element.
				})							
		});
	

		
   	
});




function initializeMyCollection() {
	//alert ('initialising collection');
	

	if (jQuery('.add-collection-link').length) {
		$('.add-collection-link').click(function(){
			alert('Handler for add-collection-link.click() called, ' + this.id);
		});
	}	
	if ( jQuery('.remove-collection-link').length ) {
		$('.remove-collection-link').click(function() {
			alert('Handler for remove-collection-link.click() called, ' + this.id);
		});
	}

	
	
};



/* --- tooltip object definition --- */
	var toolTip=(function(){
		
		//private variables and functions
		var divObj=null,
			show=function(content,hoveredElem){
				
				if (!divObj){
					divObj=$("<div></div>")
						.attr("id","toolTip")				 
						.css({
							position:"absolute",
							display:"none",
							zIndex:999
						})
						.appendTo(document.body)
				}
				
				divObj.empty();		
				divObj.append(content);
				
				hoveredElem=$(hoveredElem);
				var pos=hoveredElem.offset();
				
				divObj.css({
						left:(pos.left+hoveredElem.outerWidth()/2)-divObj.outerWidth()/2,			
						top:pos.top-divObj.outerHeight(true)
					})		
				
				divObj.show(0);		
				
			},
			hide=function(){
				divObj.hide(0);
			}
		
		//public API
		return {
			show:show,
			hide:hide
		}
	})();
/* ---------------------------------- */

/* scrollBar function definition */
	function addScrollBar(options){
		var clickPos={},
			myDiv=options.elemToScroll.css("overflow","hidden"),
			horiz=options.horizontal,
			moving=false;
		
		//size check
		var containerSize=horiz?myDiv.innerWidth():myDiv.innerHeight(),
			contentSize=horiz?myDiv.get(0).scrollWidth:myDiv.get(0).scrollHeight;
		
		var delta=contentSize-containerSize;					
		
		if(delta<1) return false;
		
		//check the positioning property
		if(myDiv.css("position")=="static") myDiv.css("position","relative")
		
		//handling the mouseWheel
		myDiv.mousewheel(function(event, delta) {
			event.preventDefault();
			
			if(delta<0){
				if(horiz){
					scroller(myDiv).scrollRight(0.5)
				}else{
					scroller(myDiv).scrollUp(0.5)
				}
			}else{
				if(horiz){
					scroller(myDiv).scrollLeft(0.5)
				}else{
					scroller(myDiv).scrollDown(0.5)
				}				
			}
			
			return false;
		});

		
		var myScrollBar=$("<div></div>")
			.addClass(options.className)
			.append(
				$("<a href='#left'></a>")
					.addClass(horiz?"left":"top")
					.click(function(ev){
						ev.preventDefault();																		
						if(horiz){
							scroller(myDiv).scrollLeft();
						}else{
							scroller(myDiv).scrollDown();
						}
						return false;
					})	
				.css({
					float:horiz?"left":"none",
					display:"block",
					"min-width":10,
					height:"100%",
					"background-color":"#999"
				})							
			)
			.append(
				$("<a href='#right'></a>")
					.addClass(horiz?"right":"bottom")
					.click(function(ev){
						ev.preventDefault();																			
						if(horiz){
							scroller(myDiv).scrollRight();
						}else{
							scroller(myDiv).scrollUp()
						}
						return false;
					})
					.css({float:horiz?"right":"none",display:"block","min-width":10,height:"100%","background-color":"#999"})
			)						
			.append(
				$("<div class='bar'></div>")
					.css({
						position:"relative",
						height:"100%",
						overflow:"hidden"
					})
					.append(
						$("<div></div>")
							.addClass(horiz?"barLeftEnd":"barTopEnd")
							.css({float:horiz?"left":"none",display:"block"})
					)
					.append(
						$("<div></div>")
							.addClass(horiz?"barRightEnd":"barBottomEnd")
							.css({float:horiz?"right":"none",display:"block"})
					)								
					.append(
						$("<a class='cursor'></a>")
							.mousedown(function(ev){
								var $this=$(this)
								
								moving=true;
								
								clickPos.left=ev.pageX;
								clickPos.top=ev.pageY;
								clickPos.cursorLeft=$this.position().left
								clickPos.cursorTop=$this.position().top

								
								$(document).bind("mousemove",{target:$this,clickPos:clickPos,horizontal:options.horizontal},_scrollBarMousemove);										
								$(document).bind("mouseup",_scrollBarMouseUp);							
								
							})
							.css({display:"block",position:"absolute",left:0,top:0,width:containerSize/contentSize*100 + "%",height:"100%","background-color":"#069"})
							.append(
									$("<span></span>")
										.addClass(horiz?"cursorLeftEnd":"cursorTopEnd")
										.css({float:horiz?"left":"none",display:"block"})
								)
							.append(
									$("<span></span>")
										.addClass(horiz?"cursorRightEnd":"cursorBottomEnd")
										.css({float:horiz?"right":"none",display:"block"})
								)
							.append(
								$("<span class='cursorBody'></span>")
								.css({display:"block"})
							)										
					)
			)
			.css({
				"min-height":10,
				width:"100%",
				"background-color":"#eee",
				overflow:"hidden"
			})
		
		//finalizing the vertical style
		if(!horiz){
			myScrollBar.css({
				width:"auto",height:"100%",position:"relative"
			})
			myScrollBar.children("a.top").css({position:"absolute",top:"0px","min-height":"10px",width:"100%",height:"auto"})
			myScrollBar.children("a.bottom").css({position:"absolute",bottom:"0px","min-height":"10px",width:"100%",height:"auto"})
			myScrollBar.find("div.barBottomEnd").css({position:"absolute",bottom:0,left:0})			
			
			var cBottom=myScrollBar.find("span.cursorBottomEnd").css({
				position:"absolute",bottom:0,left:0
			})			
			
			var cur=myScrollBar.find("a.cursor").css({
				width:"100%",height:containerSize/contentSize*100 + "%"
			})
				
		}
		
		// attach the scrollBar to the Dom
		if (options.barContainer){
			myScrollBar.appendTo(options.barContainer)
		}else{
			myScrollBar.insertAfter(myDiv)
		}
		

		//rechecking the bar size and position after the user css has been applyed
		if(!horiz){
			var top=myScrollBar.children("a.top").outerHeight(),
				bottom=myScrollBar.children("a.bottom").outerHeight(),
				len=myScrollBar.innerHeight()-top-bottom;
				
			myScrollBar.children("div.bar").css({position:"absolute",top:top,width:"100%",height:len})
			
			myScrollBar.find("span.cursorBody").css({
				height:cur.innerHeight()-myScrollBar.find("span.cursorTopEnd").outerHeight()-cBottom.outerHeight()
			})				
		}
		
		//setting the event handler
		myDiv.scroll(function(){
			if (!moving){
				if (horiz){
					myScrollBar.find(".cursor").css("left",(myDiv.scrollLeft()/contentSize*100 + "%"))
				}else{
					myScrollBar.find(".cursor").css("top",(myDiv.scrollTop()/contentSize*100 + "%"))
				}
				
			}
		})						
	
		
		//event function
		function _scrollBarMousemove(ev){
			
			var clickPos=ev.data.clickPos,
				horiz=ev.data.horizontal;
				
			var $this=ev.data.target,
				newPos=horiz?(ev.pageX-clickPos.left)+clickPos.cursorLeft:(ev.pageY-clickPos.top)+clickPos.cursorTop,						
				cursor=myScrollBar.find(".cursor"),
				bar=myScrollBar.find(".bar");
			
			var barSize=horiz?bar.innerWidth():bar.innerHeight(),
				cursorSize=horiz?$this.outerWidth():$this.outerHeight(),
				
			
			newPos=(newPos<0)?0:newPos;
			newPos=(newPos+cursorSize<barSize)?newPos:barSize-cursorSize;
								
			$this.css(horiz?"left":"top",newPos);					
			
			if (horiz){
				myDiv.scrollLeft(newPos*(contentSize-containerSize)/(barSize-cursorSize))
			}else{
				myDiv.scrollTop(newPos*(contentSize-containerSize)/(barSize-cursorSize))
			}
			
		}
		
		function _scrollBarMouseUp(ev){
			moving=false;
			$(document).unbind("mousemove",_scrollBarMousemove);
			$(document).unbind("mouseup",_scrollBarMouseUp);
			
			//needed to avoid selecting text!
			if(window.getSelection){
				var selection = window.getSelection();
				selection.collapse (selection.anchorNode, selection.anchorOffset);
			}
		}
		
	}					
/* ---------------------------------- */



function initializeFaqToggles() {
   
   jQuery('dl.faqs dd').hide();
   jQuery('dl.faqs dt').each(function(){
      $(this).html( '<a href="#">' + $(this).html() + '</a>' );
   });
   
   jQuery('dl.faqs dt').click(function(){
         oDd = $(this).next();
         if ( oDd.is(":visible") ) {
            oDd.hide();
         }
         else
         {
            oDd.show();
         }
         return false;
      });

   jQuery('.categories').hide();
   jQuery('.category-1').show();
   jQuery('.faq-page #left-column .faq-categories li a').each(function(){
      sThisHref = jQuery(this)[0].getAttribute('href', 2);
      if ( sThisHref=='#category-1')
      {
         jQuery(this).html( '-- ' + jQuery(this).html() + ' --' );
      }
   });
   

   jQuery('.faq-page #left-column .faq-categories li a').click(function(){
         jQuery('.faq-page #left-column .faq-categories li a').each(function(){
               sLinkTitle = jQuery(this).html();
               sLinkTitle = sLinkTitle.replace('-- ', '');
               sLinkTitle = sLinkTitle.replace(' --', '');
               jQuery(this).html( sLinkTitle );
            });
         jQuery(this).html( '-- ' + jQuery(this).html() + ' --' );
         sTargetDiv = jQuery(this)[0].getAttribute('href', 2);
         sTargetDiv = sTargetDiv.replace( '#', '.' );
         jQuery('.categories').hide();
         jQuery(sTargetDiv).show();
      });
  
}

function initializeJqueryUiStuff($elt) {
	if (!$elt) $elt = $(document);
	
	/* Homepage Tabs */
	if ( $(".home .tabContainer").length ) {
	   $elt.find(".tabContainer").tabs({});
	}
	
	/* Accordions */
	if ($elt.find(".accordionContainer").length) {
	$elt.find(".accordionContainer").accordion({ 
		  /*configuration variables*/
		  autoHeight: false });
	}

    /* Carousels */
    var carousel=jQuery('.carouselContent, .autoCarouselContent, #carousel-1, #carousel-2, #carousel-3')
    if (carousel.length )
    {			
		//setting the carousel up
		carousel.ixCarousel({
			onScroll:paginationRefresh			
		});
		
		//binding the pagintation events
		bindPagination(carousel);	 
		 
		//forceing a refresh 
		carousel.scroll();
   }
   
	function paginationRefresh(){
		var $this=$(this);
		
		//checking the pagination
		var pagination=$this.closest("div").siblings("div.paginationContainer")
		var li=pagination.find("li");
		var curPage=Math.round($this.scrollLeft()/$this.innerWidth())				
		
		//adding - removing the "selected" class name
		var curLi=li.eq(curPage)
		if(!curLi.hasClass("selected")){
			li.removeClass("selected");
			curLi.addClass("selected");
		}	
	}
	
	function bindPagination(carousel){
		//binding the pagination links events
		carousel.closest("div").siblings("div.paginationContainer").find("a")
			.each(function(index,item){
				var $this=$(item)
				$this					
					.data("index",index)
					.click(function(){					
						var $this=$(this);
						var ul=$this.closest("div").siblings("div.carouselContainer").find("ul").stop();					
						var jumpSize=$this.data("index")*ul.innerWidth();
						
						ul.animate({scrollLeft:jumpSize},500);
						
						return false;
					})
					.closest("li").removeClass("selected")
			})		
	}
}

function initializeProductTabs() {
  var $tabs = $('ul.tabs');
  //remove bad DIV caused by include
  $('ul.tabs > div li').each(function() {
    $(this).remove().appendTo($tabs); 
  });
  $('ul.tabs > div').remove();
  var $tabBodies = $('<div id="tabBodies">').insertAfter($tabs);
  $tabs
    .addClass('jsTabs')
    .find('h2, h3')
    .each(function() {
      $(this).siblings('div')
        .hide()
        .remove()
        .appendTo($tabBodies);
      $(this).find('a').click(function() {
        $('.jsTabs li').removeClass('hit');
        $(this).closest('li').addClass('hit').get(0).blur();
        $('.tabBody').hide();
        var href = $(this).attr('href');
        var $target = $('div#'+href);
        $target.addClass('tabBody').show();
        return false;
      });
  });
  $tabs.find('h2:first a, h3:first a').click(); 
}

function handleSearchResultsTypeFiltering() {
  var $resultDivs = $('#right-column div[id$=BooksResults]');
  var params = getUrlParameters();
  $resultDivs.hide(); 
  var tf = params['typeFilter'];
  if (!tf) tf = "all"; 
  $('#'+tf+'BooksResults').show();
  
  $('#content.search-page #left-column dl.left-navigation.last dd a').bind('click', function() {
      this.blur();
      var section = (this.id).split("-link")[0];
      var target = section + "BooksResults";
      $.scrollTo('#content');
      $resultDivs.hide();
      $('#'+target).show();
      return false;
  });
}

function mycarousel_initCallback(carousel)
{
    // Disable autoscrolling if the user clicks the prev or next button.
    carousel.buttonNext.bind('click', function() {
        carousel.startAuto(0);
    });

    carousel.buttonPrev.bind('click', function() {
        carousel.startAuto(0);
    });

    // Pause autoscrolling if the user moves with the cursor over the clip.
    carousel.clip.hover(function() {
        carousel.stopAuto();
    }, function() {
        carousel.startAuto();
    });
};


function mycarousel_itemFirstInCallback(carousel, item, idx, state) {
   
	 	//alert (carousel.list.context.id );
		var carouselIdNoStr = carousel.list.context.id;		
		carouselIdNoStr = carouselIdNoStr.replace("carousel-","");
		
		//alert (carouselIdNoStr);
		carouselPaginationStr = '#carouselPagination-' + carouselIdNoStr;
		
		//alert (carouselPaginationStr);
		
		//debugger;
		paginationItem = Math.floor(idx/5); // change to match scroll value
		 //alert('Item #' + idx + ' is now the first item, ' + paginationItem + '= the page number');
		 
		 //jQuery('ul.#carouselPagination-1').children()
		 
		 jQuery(carouselPaginationStr).find('li').removeClass('selected');
		 jQuery(carouselPaginationStr).find('li').slice(paginationItem, paginationItem+1).addClass('selected');
		 
		 
		 		 
		 
		 
		 
};


function setupSearchFormBehaviour() {
  $('.clear-on-focus').each(function() {
    // put title attribute into field
    var actualValue = $(this).val();
    if (actualValue) {
      $(this).removeClass('clear-on-focus').addClass('typed-in');
    } else {
      $(this).val($(this).attr('title'));
    }
  }).live('focus', function(e) {
    var $target = $(e.target);
    if ($target.hasClass('typed-in')) {
      return;
    } else {
      $target.val('');
    }
  }).live('blur', function(e) {
    var $target = $(e.target);
    if ($target.hasClass('typed-in')) return;
    $target.removeClass('enlarged');
    // put title text back
    $target.val($target.attr('title'));
  }).live('keypress', function(e) { // sadly, this also catches the tab key
    // change colour, prevent default text being put back
    $(e.target).addClass('typed-in');
  }); 
  
  $('#catalogue-picker-set input').live('click', function() {
    adjustSubjectPickerAvailability();
  });

  // redirect for T&F search
  $('#search-form').bind('submit', function() {
      var allSearch = $('#search-type-all').attr('checked'); // bool
      if (allSearch) {
        var searchTerm = $('#search-text').val();
        var tandfSearchUrl = 'http://www.taylorandfrancis.com/search/';
        window.location = tandfSearchUrl + searchTerm;
        return false;
      }
      // else fall through and submit normally
  });
  
  adjustSubjectPickerAvailability(); // could differ from default if user refreshes page after checking a radio button
}

function adjustSubjectPickerAvailability() {
  var $subjectDropdown = $('#subject-picker-set > p');
  var $clicker = $subjectDropdown.find('.jqTransformSelectOpen');
  var allIsActive = $('#catalogue-picker-set input[value=all]').attr('checked'); // boolean
  if(allIsActive) {
    $subjectDropdown.addClass('disabled');
    $clicker.before('<b class="jqTransformSelectOpen"/>').remove();
  } else {
    $subjectDropdown.removeClass('disabled');
    $clicker.before('<a class="jqTransformSelectOpen"/>').remove();
  }
}

function getUrlParameters() {
  var map = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,   function(m,key,value) {
    map[key] = value;
  });
  return map; 
}

function reloadPageWithSelectedCountry(url, queryString) {
    var country = $("#region").val();
        queryString = setUrlEncodedKey('region', country, queryString);

    url += queryString;
    window.location = url;
}

getUrlEncodedKey = function(key, query) {
    if (!query)
        query = window.location.search;
    var re = new RegExp("[?|&]" + key + "=(.*?)&");
    var matches = re.exec(query + "&");
    if (!matches || matches.length < 2)
        return "";
    return decodeURIComponent(matches[1].replace("+", " "));
}
setUrlEncodedKey = function(key, value, query) {

    query = query || window.location.search;
    var q = query + "&";
    var re = new RegExp("[?|&]" + key + "=.*?&");
    if (!re.test(q))
        q += key + "=" + encodeURI(value);
    else
        q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
    q = q.trimStart("&").trimEnd("&");
    return q[0]=="?" ? q : q = "?" + q;
}

String.prototype.trimEnd = function(c) {
    if (c)
        return this.replace(new RegExp(c.escapeRegExp() + "*$"), '');
    return this.replace(/\s+$/, '');
}
String.prototype.trimStart = function(c) {
    if (c)
        return this.replace(new RegExp("^" + c.escapeRegExp() + "*"), '');
    return this.replace(/^\s+/, '');
}

String.prototype.escapeRegExp = function() {
    return this.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
};


//ixCarousel
(function($){	
	$.fn.ixCarousel=function(options){		
		$.extend({
			onScroll:function(){}
		},options)
		
        return this.each(function(){
			var carousel=$(this);
			if (!carousel.parent("div").hasClass("carouselContainer")){
				carousel.wrap("<div class='carouselContainer'></div>")
				$("<a href='#left' class='left'></a>")
					.hover(function(){$(this).addClass("hover")},function(){$(this).removeClass("hover")})
					.click(function(){
						scroller($(this).siblings("ul")).scrollLeft();
						return false;
					})		
					.insertBefore(carousel)
					
				$("<a href='#right' class='right'></a>")
					.hover(function(){$(this).addClass("hover")},function(){$(this).removeClass("hover")})
					.click(function(){
						scroller($(this).siblings("ul")).scrollRight();
						return false;
					})
					.insertAfter(carousel)
					
				carousel.scroll(function(ev){
					var $this=$(this);
					if ($this.scrollLeft()==0){
						$this.siblings("a.left").addClass("off")
					}else{
						$this.siblings("a.left").removeClass("off")
					}
					
					if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
						$this.siblings("a.right").addClass("off")
					}else{
						$this.siblings("a.right").removeClass("off")
					}
					
					options.onScroll.call(this,ev);

					
				})
				
				carousel.scroll();				
			}
					
        });		
			
		$.fn.ixCarousel.refresh=function(){
			$(this).scroll();
		};		
	}
})(jQuery);



/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4265 $
 *
 * Version: 3.0
 * 
 * Requires: $ 1.2.2+
 */

(function($) {

$.event.special.mousewheel = {
	setup: function() {
		var handler = $.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( $.browser.mozilla )
			$(this).bind('mousemove.mousewheel', function(event) {
				$.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = $.event.special.mousewheel.handler;
		
		$(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		$.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = $.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		$.extend( event, $.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
//		if ( $.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return $.event.handle.apply(this, args);
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);