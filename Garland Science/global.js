/* requires $ */




var SEARCH_BOX_DEFAULT_TEXT = "Keyword, Title, Author, ISBN";

var currentQues = 0;
var totalQues = 0;
var quizCorrectAnswerArr = [1,3,5,3,2];

if (typeof Sarissa != 'undefined'){
	jQuery.ajaxSetup({
		xhr: function(){
			if (Sarissa.originalXMLHttpRequest){
				return new Sarissa.originalXMLHttpRequest();
			}else if (typeof ActiveXObject != 'undefined'){
				return new ActiveXObject("Microsoft.XMLHTTP");
			}else{
				return new XMLHttpRequest();
			}
		}
	});
}

function testjsfn(){
	// "My Collection" carousel
	$("#carousel-2").ixCarousel({
		className:"custom",		// please define a className to customize this carousel style!
		scrollDuration:600,		//the scrolling duration in ms.
		scrollSize:0.75			//the scroll width (75% of the viewport)
	});
}

//useful function
var utils={
		twoDigits:function(inte){
			if (inte<10) return "0" + inte;
			if (inte>99){
				var str=inte.toString();
				return str.substring(str.length-2);
			}
			return inte.toString();
		},

		dateDiff:function(date1,date2){
			var baseDate=new Date(1970,01,01);
			date1=date1||baseDate;
			date2=date2||baseDate;

			return Math.abs(date1.getTime()-date2.getTime());
		},

		RealTypeOf:function(v){
			if (typeof(v) == "object"){
				if (v === null) return "null";
				if (v.constructor == (new Array).constructor) return "array";
				if (v.constructor == (new Date).constructor) return "date";
				if (v.constructor == (new RegExp).constructor) return "regex";
				return "object";
			}
			return typeof(v);
		}
};

Date.prototype.shortDate=function(sep){ //i.e. 22/11/1989
	sep=sep||"/";
	return utils.twoDigits(this.getMonth()+1) + sep + utils.twoDigits(this.getDate()) + sep + this.getFullYear();
};

//object usefull to handle content scroll.
var scroller=function(element){
	var myDiv=$(element);

	var scrollRight=function(scrollSize,duration){
		myDiv.stop();
		var scrollSize=scrollSize||1;
		var width=myDiv.innerWidth(),
		scrollWidth=myDiv.get(0).scrollWidth;

		var availableScroll=scrollWidth-myDiv.scrollLeft()-width;
		availableScroll=availableScroll>width*scrollSize?width*scrollSize:availableScroll;
		myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500);
	};

	var scrollLeft=function(scrollSize,duration){
		myDiv.stop();
		var scrollSize=scrollSize||1;
		var width=myDiv.innerWidth(),
		scrollWidth=myDiv.get(0).scrollWidth;

		var availableScroll=myDiv.scrollLeft();
		availableScroll=availableScroll>width*scrollSize?-width*scrollSize:-availableScroll;

		myDiv.animate({scrollLeft:myDiv.scrollLeft()+availableScroll},duration||500);
	};

	var scrollUp=function(scrollSize,duration){
		myDiv.stop();
		var scrollSize=scrollSize||1;
		var height=myDiv.innerHeight(),
		scrollHeight=myDiv.get(0).scrollHeight;

		var availableScroll=scrollHeight-myDiv.scrollTop()-height;
		availableScroll=availableScroll>height*scrollSize?height*scrollSize:availableScroll;
		myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500);
	};

	var scrollDown=function(scrollSize,duration){
		myDiv.stop();
		var scrollSize=scrollSize||1;
		var height=myDiv.innerHeight(),
		scrollHeight=myDiv.get(0).scrollHeight;

		var availableScroll=myDiv.scrollTop();
		availableScroll=availableScroll>height*scrollSize?-height*scrollSize:-availableScroll;
		myDiv.animate({scrollTop:myDiv.scrollTop()+availableScroll},duration||500);
	};

	return{
		scrollLeft:scrollLeft,
		scrollRight:scrollRight,
		scrollUp:scrollUp,
		scrollDown:scrollDown
	};
};

(function($){

	$(document).ready(function(){

		//overriding the setTarget function contained in the HTML code
		window.setTarget=function(){
			if ($('#search-type-all').attr('checked')){
				document.BasicSearchForm.setAttribute('target', '_blank');
			}else{
				document.BasicSearchForm.setAttribute('target', '_self');
			}
		};

		if ($.browser.msie){
			//ie layout fix
			$("#header-logo,#nav")
			.css("zoom",1);

			// IE6 hover fix
			if ($.browser.version<7){
				$("#dropdown li").hover(
						function(){$(this).addClass("over");},
						function(){$(this).removeClass("over");}
				);
			}
		}

		if ( $("ul.tabs").length ){
			initializeProductTabs();
		};

		//transforming all the select.ixDropDown elements into ixDropDown widgets
		//$("select").ixDropDown();	
		var selectArray=[
			"#header select",
			"#header-myaccount-top select",
			"#search-ribbon select",
			".sortby-form select",
			"#resources-search select"
		]		
		$(selectArray.join(",")).ixDropDown();


		setupSearchFormBehaviour();

		if ($('#content').hasClass('search-page')){
			handleSearchResultsTypeFiltering();
		}

		//remove this to activate the share-links bar
		//shareLinks.init();

		/* $-ui stuff */
		initialize$UiStuff();


		/* Remove dotted border effect when links clicked */
		$(".tabContainer a, .accordionContainer h3").click(function(){
			this.blur();
		});

		// external links
		$('a[href][rel*=external]').each(function(i){
			this.target = "_blank";
		});

		if ($().colorbox){
			// colorbox plugin used to display overlay - opens new html page into div
			$('a.modalOverlay').colorbox({onComplete:function(box){
				//applying the custom scrollBar to the popup content
				box.find("div.verScroll, #contact-us-popup-inner").each(function(index,item){
					var myDiv=$(item);

					//var sbContainer=$("<div class='overlayScroll'></div>").insertAfter(myDiv)
					//adding the vertical scrollBar
					addScrollBar({
						horizontal:false,
						elemToScroll:myDiv,
						className:"verScrollBar overlayScroll"/*,
						barContainer:null				//if null then scrollBar html will be inserted after the elemToScroll element.*/
					});
				});
			}});
		}

		if ($('#content').hasClass('faq-page')) initializeFaqToggles();

		if ( $(".add-collection-link").length )
		{
			initializeMyCollection();
		}

		/* binding toolTips events*/
		var ttElements=$("#right-column .carouselContainer a img");

		ttElements.live("mouseenter",function(){
			//creating the html for the toolTip content
			var ttContainer=$("<div></div>").addClass("container");
			var ttContent=$("<div></div>").addClass("content").appendTo(ttContainer);

			var $this=$(this),
			spanTags=$this.closest("li").children("span");

			var	title=spanTags.filter(".title").text()||"--",
			author=spanTags.filter(".author").text()?spanTags.filter(".author").html().replace(/<BR>/g,"<br>").split("<br>"):["--"],
					date=spanTags.filter(".date").text()||"--";

			if(date!="--"){
				date=date.split(" ")[0].split("-");
				date=new Date(date[0],date[1]-1,date[2]).shortDate();
			}

			$("<p></p>")
			.text(title)
			.addClass("title")
			.appendTo(ttContent);

			var dl=$("<dl></dl>").appendTo(ttContent);


			$("<dt>Author(s):</dt>").appendTo(dl);
			$("<dd></dd>")
			.text(author.join(", ").replace(/&nbsp;/g," "))
			.appendTo(dl);


			$("<dt>Pub Date:</dt>").appendTo(dl);
			$("<dd></dd>")
			.addClass("date")
			.text(date)
			.appendTo(dl);

			//showing the toolTip
			toolTip.show(ttContainer,this);
		});

		ttElements.live("mouseleave",function(){
			toolTip.hide();
		});

		/* customScrollBars */
		$("#tab-1 .carousel-outer")
		.each(function(index,item){
			var myDiv=$(item);
			var params={
					horizontal:true,
					elemToScroll:myDiv,
					className:"myHorScrollBar",
					barContainer:null//myDiv.siblings(".horBar")				//if null then scrollBar html will be inserted after the elemToScroll element.
			};

			//adding the horizontal scrollBar
			if ($.browser.webkit){
				$(window).load(function(){
					addScrollBar(params);
				});
			}else{
				addScrollBar(params);
			}

		});

		// quiz section
		if ( $(".quiz").length )
		{

			$('.quiz fieldset').hide();
			initialiseQuiz ();
			showQuizQuestion();

			$('#previous-ques').click(function(){
				if (currentQues > 0 ){
					currentQues--;

					// handle next/previous links active states
					if (currentQues==0){
						$('#previous-ques').addClass('inactive');
					}
					if (currentQues!= totalQues){
						if ($('#next-ques').hasClass('inactive')) {$('#next-ques').removeClass('inactive'); }
					}

					showQuizQuestion();
					$('#correct-answer').hide();
					$('#wrong-answer').hide();
				}

				return false;
			});

			$('#next-ques').click(function(){
				if (currentQues < totalQues){
					currentQues++;

					// handle next/previous links active states
					if (currentQues == totalQues){
						$('#next-ques').addClass('inactive');
					}
					if (currentQues > 0){
						if ($('#previous-ques').hasClass('inactive')){
							$('#previous-ques').removeClass('inactive');
						}
					}

					showQuizQuestion();
					$('#correct-answer').text('');
					$('#correct-answer').hide();
					$('#wrong-answer').text('');
					$('#wrong-answer').hide();

				}

				return false;
			});

			$('#answer-check').click(function(){

				var correctAns;
				var correctMsg ='Correct! ';
				var incorrectMsg = 'Correct answer is ';
				var correctLabel = '';
				var currentQuesIndexOne = currentQues + 1;
				var currentQuesName = 'question_' + currentQuesIndexOne;
				var thisQues = 'form input[name=' + currentQuesName + ']:radio';

				$(thisQues).each(function(i){
					if ($(this).hasClass('correct')){
						correctAns = $(this).val();
						correctLabel = $(this).next().text();
					}
				});

				var checkedVal = $('input:radio[name=' + currentQuesName +  ']:checked').val();

				if (checkedVal == correctAns){
					$('#correct-answer').text(correctMsg + correctLabel);
					$('#correct-answer').show();
				}else{
					$('#wrong-answer').text(incorrectMsg + correctAns);
					$('#wrong-answer').show();
				}

				return false;
			});
		}
		// end quiz section

		// flashcard section
		if ($('.flashcard-form').length){

			var currentFlashcard = 0;
			var totalFlashcards = 0;

			$('#prev-card').click(function(){

				if (currentFlashcard == 1 ){
					$('#prev-card').hide();
				}

				if (currentFlashcard > 0 ){
					$('.flashcard-form').eq(currentFlashcard).hide();
					currentFlashcard--;
					$('.flashcard-form').eq(currentFlashcard).show();
					$('.flashcard-answer').hide();
					$('#next-card').show();
					updateFlashcardNumber(currentFlashcard+1);
				}

				return false;
			});

			$('#next-card').click(function(){

				if (currentFlashcard == totalFlashcards-2 ){
					$('#next-card').hide();
				}

				if (currentFlashcard < totalFlashcards-1 ){
					$('.flashcard-form').eq(currentFlashcard).hide();
					currentFlashcard++;
					$('.flashcard-form').eq(currentFlashcard).show();
					$('.flashcard-answer').hide();
					$('#prev-card').show();
					updateFlashcardNumber(currentFlashcard+1);
				}

				return false;

			});

			$('.show-flashcard-answer').click(function(){
				$('.flashcard-answer').show();
				return false;
			});

			var totalFlashcards = $('.flashcard-form').length;
			$('#flashcard-total').text(totalFlashcards);

			updateFlashcardNumber(currentFlashcard + 1);

			$('.flashcard-form').hide();
			$('.flashcard-form').eq(0).show();
			$('.flashcard-answer').hide();
			$('#prev-card').hide();

		}

		// start student search section, select all checkboxes
		if ($('#resources-search-wrapper').length){
			$('#select-all-resources').click(function(){
				$('#resources-search-wrapper input:checkbox').attr('checked', true);
				return false;
			});
		}
		// end student search section
	});
})(jQuery);

function initializeMyCollection(){
	var $=jQuery;
	if ($('.add-collection-link').length){
		$('.add-collection-link').click(function(){
		});
	}

	if ( $('.remove-collection-link').length ){
		$('.remove-collection-link').click(function(){
		});
	}
};

//share-links bar handler
var shareLinks={
		init:function(){
			//show-hide share-links bar button
			$("div.share-links a.closeBtn").toggle(
					function(){
						$(this).text("show tools").parent().addClass("closed");
					},
					function(){
						$(this).text("hide tools").parent().removeClass("closed");
					}
			);

			var links=$("div.share-links a");

			// setting the current url for Facebook and Twitter
			links.filter(".fb,.tw").each(function(){
				var linkUrl=this.hash.replace("#","")+window.location;
				this.href=linkUrl;
			});

			//customising the email button
			links.filter(".email").click(function(){
				alert ("Please add the email function!");
				return false;
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
			.appendTo(document.body);
		}

		divObj.empty();
		divObj.append(content);

		hoveredElem=$(hoveredElem);
		var pos=hoveredElem.offset();

		divObj.css({
			left:(pos.left+hoveredElem.outerWidth()/2)-divObj.outerWidth()/2,
			top:pos.top-divObj.outerHeight(true)
		});

		divObj.show(0);

	},
	hide=function(){
		divObj.hide(0);
	};

	//public API
	return{
		show:show,
		hide:hide
	};
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
			if(myDiv.css("position")=="static") myDiv.css("position","relative");

			//handling the mouseWheel
			myDiv.mousewheel(function(event, delta){
				event.preventDefault();

				if(delta<0){
					if(horiz){
						scroller(myDiv).scrollRight(0.5);
					}else{
						scroller(myDiv).scrollUp(0.5);
					}
				}else{
					if(horiz){
						scroller(myDiv).scrollLeft(0.5);
					}else{
						scroller(myDiv).scrollDown(0.5);
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
							scroller(myDiv).scrollUp();
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
								var $this=$(this);

								moving=true;

								clickPos.left=ev.pageX;
								clickPos.top=ev.pageY;
								clickPos.cursorLeft=$this.position().left;
								clickPos.cursorTop=$this.position().top;


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
			});

			//finalizing the vertical style
			if(!horiz){
				myScrollBar.css({
					width:"auto",height:containerSize,position:"relative"
				});
				myScrollBar.children("a.top").css({position:"absolute",top:"0px","min-height":"10px",width:"100%",height:"auto"});
				myScrollBar.children("a.bottom").css({position:"absolute",bottom:"0px","min-height":"10px",width:"100%",height:"auto"});
				myScrollBar.find("div.barBottomEnd").css({position:"absolute",bottom:0,left:0});

				var cBottom=myScrollBar.find("span.cursorBottomEnd").css({
					position:"absolute",bottom:0,left:0
				});

				var cur=myScrollBar.find("a.cursor").css({
					width:"100%",height:containerSize/contentSize*100 + "%"
				});

			}

			// attach the scrollBar to the Dom
			if (options.barContainer){
				myScrollBar.appendTo(options.barContainer);
			}else{
				myScrollBar.insertAfter(myDiv);
			}


			//rechecking the bar size and position after the user css has been applyed
			if(!horiz){
				var top=myScrollBar.children("a.top").outerHeight(),
				bottom=myScrollBar.children("a.bottom").outerHeight(),
				len=myScrollBar.innerHeight()-top-bottom;

				myScrollBar.children("div.bar").css({position:"absolute",top:top,width:"100%",height:len});

				myScrollBar.find("span.cursorBody").css({
					height:cur.innerHeight()-myScrollBar.find("span.cursorTopEnd").outerHeight()-cBottom.outerHeight()
				});
			}

			//setting the event handler
			myDiv.scroll(function(){
				if (!moving){
					if (horiz){
						myScrollBar.find(".cursor").css("left",(myDiv.scrollLeft()/contentSize*100 + "%"));
					}else{
						myScrollBar.find(".cursor").css("top",(myDiv.scrollTop()/contentSize*100 + "%"));
					}

				}
			});

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
							myDiv.scrollLeft(newPos*(contentSize-containerSize)/(barSize-cursorSize));
						}else{
							myDiv.scrollTop(newPos*(contentSize-containerSize)/(barSize-cursorSize));
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

function initializeFaqToggles(){
	var $=jQuery;
	
	$('dl.faqs dd').hide();
	$('dl.faqs dt').each(function(){
		$(this).html( '<a href="#">' + $(this).html() + '</a>' );
	});

	$('dl.faqs dt').click(function(){
		oDd = $(this).next();
		if (oDd.is(":visible")){
			oDd.hide();
		}
		else{
			oDd.show();
		}
		return false;
	});

	$('.categories').hide();
	$('.category-1').show();
	$('.faq-page #left-column .faq-categories li a').each(function(){
		sThisHref = $(this)[0].getAttribute('href', 2);
		if (sThisHref=='#category-1'){
			$(this).html('-- ' + $(this).html() + ' --');
		}
	});

	$('.faq-page #left-column .faq-categories li a').click(function(){
		$('.faq-page #left-column .faq-categories li a').each(function(){
			sLinkTitle = $(this).html();
			sLinkTitle = sLinkTitle.replace('-- ', '');
			sLinkTitle = sLinkTitle.replace(' --', '');
			$(this).html( sLinkTitle );
		});
		$(this).html( '-- ' + $(this).html() + ' --' );
		sTargetDiv = $(this)[0].getAttribute('href', 2);
		sTargetDiv = sTargetDiv.replace( '#', '.' );
		$('.categories').hide();
		$(sTargetDiv).show();
	});
}

function initialize$UiStuff($elt){
	var $=jQuery;
	if (!$elt) $elt = $(document);

	/* Homepage Tabs */
	if ( $(".home .tabContainer").length ){
		$elt.find(".tabContainer").tabs({});
	}

	/* Accordions */
	if ($elt.find(".accordionContainer").length){
		$elt.find(".accordionContainer").accordion({
			/*configuration variables*/
			autoHeight: false });
	}

	/* Carousels */
	$('.carouselContent, #carousel-1, #carousel-2, #carousel-3, div.carousel-outer-box>ul').ixCarousel();

	/* autoScroller */
	$(".autoCarouselContent").ixCarousel({
		scrollDuration:1600,		//the scrolling duration in ms.
		autoStart:true,
		showButtons:false,
		showPag:false,
		slideDuration:8000
	});
}

function initializeProductTabs(){
	var $=jQuery;
	var $tabs = $('ul.tabs');

	//remove bad DIV caused by include
	$('ul.tabs > div li').each(function(){
		$(this).remove().appendTo($tabs);
	});

	$('ul.tabs > div').remove();
	var $tabBodies = $('<div id="tabBodies"></div>').insertAfter($tabs);
	$tabs.addClass('jsTabs')
	.find('h2, h3')
	.each(function(){
		$(this).siblings('div')
		.hide()
		.remove()
		.appendTo($tabBodies);

		$(this).find('a').click(function(){
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

function handleSearchResultsTypeFiltering(){
	var $resultDivs = $('#right-column div[id$=BooksResults]');
	var params = getUrlParameters();
	var $=jQuery;

	$resultDivs.hide();
	var tf = params['typeFilter'];
	if (!tf) tf = "all";
	$('#'+tf+'BooksResults').show();

	// hide sort by select after it has been restyled with ixdropdown
	$('.sortby-form select').hide();


	$('#content.search-page #left-column dl.left-navigation.last dd a').bind('click', function(){
		this.blur();
		var section = (this.id).split("-link")[0];
		var target = section + "BooksResults";
		$.scrollTo('#content');
		$resultDivs.hide();
		$('#'+target).show();
		return false;
	});
}

function mycarousel_initCallback(carousel){
	// Disable autoscrolling if the user clicks the prev or next button.
	carousel.buttonNext.bind('click', function(){
		carousel.startAuto(0);
	});

	carousel.buttonPrev.bind('click', function(){
		carousel.startAuto(0);
	});

	// Pause autoscrolling if the user moves with the cursor over the clip.
	carousel.clip.hover(function(){
		carousel.stopAuto();
	}, function(){
		carousel.startAuto();
	});
};


function setupSearchFormBehaviour(){
	var $=jQuery;
	$('.clear-on-focus').each(function(){
		// put title attribute into field
		var actualValue = $(this).val();
		if (actualValue && actualValue != SEARCH_BOX_DEFAULT_TEXT){
			$(this).attr('focused', true);
			$(this).removeClass('clear-on-focus').addClass('typed-in');
		}else{
			$(this).val($(this).attr('title'));
		}
	}).live('focus', function(e){
		var $target = $(e.target);
        $target.attr('focused', true);
		if ($target.hasClass('typed-in')){
			return;
		}else{
            $(e.target).addClass('typed-in');
			$target.val('');
		}
	}).live('blur', function(e){
		var $target = $(e.target);
		if ($target.hasClass('typed-in')) return;
		$target.removeClass('enlarged');
		// put title text back
		$target.val($target.attr('title'));
	}).live('keypress', function(e){ // sadly, this also catches the tab key
		// change colour, prevent default text being put back
		$(e.target).addClass('typed-in');
	});

	$('#catalogue-picker-set input').live('click', function(){
		adjustSubjectPickerAvailability();
	});

	adjustSubjectPickerAvailability(); // could differ from default if user refreshes page after checking a radio button
}

function clearEmptyFields(elt){ // currently called from search ribbon submit button's onclick
	if (!elt) elt = document;
	$(elt).closest('form').find('.clear-on-focus').each(function(){
		if (!$(this).hasClass('typed-in') ||$(this).val() == SEARCH_BOX_DEFAULT_TEXT){
			$(this).val('');
		}
	});
}

/**
 * Returns a jquery wrapped element which has the given html id, as generated by faces. If the element is not found,
 * and exception is thrown.
 *
 * @param facesHtmlId the id of an html element, as generated by Faces.
 */
function getJQueryElement(facesHtmlId) {
    var element = $("#" + facesHtmlId.replace(":", "\\:"));
    if (element.size() == 0) {
      throw "Field with id " + facesHtmlId + " not found";
    }
    else {
        return element;
    }
}

/**
 * Checks if any value has been entered in a search field
 * @param searchInputFieldHtmlId the id of an HTML input text
 */
function isSearchEmpty(searchInputFieldHtmlId) {
    var searchInputField = getJQueryElement(searchInputFieldHtmlId);
    // remove leading/trailing whitespace
    var searchInputFieldValue = searchInputField.val().replace(/^\s+|\s+$/g, "");
    return searchInputFieldValue.length == 0 || !searchInputField.attr('focused');
}

/**
 * Validates prior to a search, that search terms have been entered. If not, an error message is raised.
 * @param searchInputFieldHtmlId
 * @param errorMessage
 */
function validateSearchInput(searchInputFieldHtmlId, errorMessage) {
    if (isSearchEmpty(searchInputFieldHtmlId)) {
        alert((errorMessage == undefined || errorMessage == null) ? "Please enter keyword(s) or search term and try again." : errorMessage);
        return false;
    }
    return true;
}

/**
 * Performs a search validation and if successful, clears the search fields.
 * @param element
 * @param searchInputFieldHtmlId
 */
function validateSearchAndClearFields(element, searchInputFieldHtmlId) {
    var searchValidated = validateSearchInput(searchInputFieldHtmlId, null);
    if (searchValidated) {
        clearEmptyFields(element);
    }
    return searchValidated;
}

function adjustSubjectPickerAvailability(){
	var $=jQuery;
	var $subjectDropdown = $('#subject-picker-set a.ixDropDown_A');
	var $clicker = $subjectDropdown.find('.jqTransformSelectOpen');
	var allIsActive = $('#catalogue-picker-set input[value=all]').attr('checked'); // boolean

	$subjectDropdown.disabled(allIsActive);
}

function getUrlParameters(){
	var map = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,   function(m,key,value){
		map[key] = value;
	});
	return map;
}

function reloadPageWithSelectedCountry(url, queryString){
	var country = $("#region").val();
	queryString = setUrlEncodedKey('region', country, queryString);

	url += queryString;
	window.location = url;
}

getUrlEncodedKey = function(key, query){
	if (!query)
		query = window.location.search;
	var re = new RegExp("[?|&]" + key + "=(.*?)&");
	var matches = re.exec(query + "&");
	if (!matches || matches.length < 2)
		return "";
	return decodeURIComponent(matches[1].replace("+", " "));
};

setUrlEncodedKey = function(key, value, query){
	query = query || window.location.search;
	var q = "";

	if (query.length > 0) {
		q = query + "&";

		var re = new RegExp("[?&]?" + key + "=[^&]*&?");
		if (re.test(q)) {
			q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
		}
		else {
			q += (key + "=" + encodeURI(value));
		}

		q = q.trimStart("&").trimEnd("&");
		if (q[0] != "?") {
			q = "?" + q;
		}
	}
	else {
		q = "?" + key + "=" + encodeURI(value);
	}

	return q;
};

String.prototype.trimEnd = function(c){
	if (c)
		return this.replace(new RegExp(c.escapeRegExp() + "*$"), '');
	return this.replace(/\s+$/, '');
};
String.prototype.trimStart = function(c){
	if (c)
		return this.replace(new RegExp("^" + c.escapeRegExp() + "*"), '');
	return this.replace(/^\s+/, '');
};

String.prototype.escapeRegExp = function(){
	return this.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
};

//ixCarousel
(function($){
	$.fn.ixCarousel=function(options){
		var defaults={
				onScroll:function(){},
				className:"",
				scrollDuration:600,
				scrollSize:1,
				showButtons:true,
				showPag:true,
				autoStart:false,
				slideDuration:5000
		};

		$.extend(defaults,options);

		return this.each(function(){

			var timerHnd=null;

			var carousel=$(this).addClass("carouselContainer");

			if (!carousel.parent("div").hasClass("ixCarousel")){

				carousel.wrap($("<div class='ixCarousel'></div>").addClass(defaults.className));

				if (defaults.showButtons){
					$("<a href='#left' class='left'></a>")
					.focus(function(){$(this).addClass("focus");})
					.blur(function(){$(this).removeClass("focus");})
					.mouseup(function(){$(this).removeClass("focus");})
					.click(function(){
						if (timerHnd) clearInterval(timerHnd);
						scroller($(this).siblings("ul")).scrollLeft(defaults.scrollSize,defaults.scrollDuration);
						return false;
					})
					.insertBefore(carousel);

					$("<a href='#right' class='right'></a>")
					.focus(function(){$(this).addClass("focus");})
					.blur(function(){$(this).removeClass("focus");})
					.mouseup(function(){$(this).removeClass("focus");})
					.click(function(){
						if (timerHnd) clearInterval(timerHnd);
						scroller($(this).siblings("ul")).scrollRight(defaults.scrollSize,defaults.scrollDuration);
						return false;
					})
					.insertAfter(carousel);
				}

				carousel.scroll(function(ev){
					var $this=$(this);
					if ($this.scrollLeft()==0){
						$this.siblings("a.left").addClass("off");
					}else{
						$this.siblings("a.left").removeClass("off");
					}

					if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
						$this.siblings("a.right").addClass("off");
					}else{
						$this.siblings("a.right").removeClass("off");
					}

					if(defaults.showPag){
						//checking the pagination
						var pagination=$this.siblings("div.paginationContainer");
						var li=pagination.find("li");
						var curPage=Math.round($this.scrollLeft()/$this.innerWidth());

						var curLi=li.eq(curPage);
						if(!curLi.hasClass("selected")){
							li.removeClass("selected");
							curLi.addClass("selected");
						}
					}

					//event callBack
					defaults.onScroll.call(this,ev);
				});

				if(defaults.showPag){
					if ($.browser.webkit){
						//chrome needs this to calculate the width correctly
						$(window).load(function(){
							makePagination.call(carousel.get(0));
						});
					}else{
						makePagination.call(this);
					}
				}

				if(defaults.autoStart){
					timerHnd=setInterval(function(){doSlide.call(carousel.get(0),defaults);},defaults.slideDuration);
					carousel.data("timerHnd",timerHnd);
				}
			}
		});

		function doSlide(defaults){
			var $this=$(this);

			if ($this.scrollLeft()==this.scrollWidth-$this.innerWidth()){
				$this.animate({scrollLeft:0},defaults.scrollDuration);
			}else{
				scroller(this).scrollRight(defaults.scrollSize,defaults.scrollDuration);
			}
		}

		function makePagination(){
			var carousel=$(this);

			if (carousel.find("li").length>0){
				//creating the pagination code
				var pagDiv=$("<div class='paginationContainer'></div>").insertAfter(carousel);
				var ul=$("<ul></ul>").appendTo(pagDiv);
				var pageCount=Math.ceil(this.scrollWidth/carousel.innerWidth());

				for( var x=0;x<pageCount;x++){
					$("<a></a>")
					.focus(function(){$(this).addClass("focus");})
					.blur(function(){$(this).removeClass("focus");})
					.mouseup(function(){$(this).removeClass("focus");})
					.attr("href","#"+x)
					.data("index",x)
					.click(function(){
						var $this=$(this);
						var ul=$this.closest("div").siblings("ul").stop();
						var curPage=$this.closest("div").find("li.selected a").data("index");
						var thisPage=$this.data("index");
						var jumpSize=curPage-thisPage;

						if(defaults.autoStart){
							clearInterval(carousel.data("timerHnd"));
						}

						if (jumpSize==0){
							return false;
						}

						if (jumpSize<0){
							scroller(ul).scrollRight(Math.abs(jumpSize),defaults.duration);
						}else{
							scroller(ul).scrollLeft(Math.abs(jumpSize),defaults.duration);
						}


						return false;
					})
					.appendTo(
							$("<li></li>").appendTo(ul)
					);

				}
			}

			//quick refresh
			carousel.scroll(0);
		}

	};
})(jQuery);

//quiz
function changeQuestion (direction){
	alert("Hello+" + direction);
}

function initialiseQuiz(){
	currentQues = 0;
	
	var $=jQuery;

	$('#previous-ques').addClass('inactive');


	// populate array with correct/incorrect answers
	// show/hide correct current question
	$(".quiz fieldset").each(function(i){
		totalQues = i;
	});

	$('#quiz-total').text(totalQues+1);

	$('#correct-answer').hide();
	$('#wrong-answer').hide();
}

function showQuizQuestion(){
	$(".quiz fieldset").each(function(i){

		if (i == currentQues){
			$(this).show();
		}else{
			$(this).hide();
		}
		$('#current-quiz-page').text(currentQues+1);
	});
}
/// end quiz

//ixDropDown plugin
(function($){
	$.fn.ixDropDown=function(options){
		//defining the base style for this object. Style customisation can be done by assigning a className to the <select> element
		//and then defining its rules in your CSS
		var rules=[
		           ".ixDropDown_A span{display:block}",
		           ".ixDropDown_A {display:inline-block; text-align:left; zoom: 1; *display: inline;vertical-align:bottom;outline:none}",
		           ".ixDropDown_A{ color:#069; padding-right:15px}",
		           ".ixDropDown_DIV {position:absolute; display:none;}",
			   ".ixDropDown_Cont {zoom:1}",
		           ".ixDropDown_UL {list-style-type:none; padding:0; margin:0px; outline:none}"
		           ];

		$("<style type='text/css'>" + rules.join("\n") + "</style>").appendTo("head");


		return this.each(function(){

			var thisObj=$(this).hide(0),
			timerHnd=null;

			//binding the onChange event to the <select>
			thisObj.change(function(){
				$(this).siblings("a.ixDropDown_A").find("span").text(this.options[this.selectedIndex].text);
			});

			var curOption=$.map(thisObj.find("option"),function(item, index){
				return item.selected?item:null;
			});
			

			curOption=curOption.length>0?curOption[0]:thisObj.children().eq(0).get(0);
			

			var anchor=$("<a href='#show' />")
			.insertAfter(thisObj)
			.addClass("ixDropDown_A " + this.className)
			.addClass(this.disabled?" disabled":(curOption?"":"disabled"))
			.append($("<span />").text(curOption?(curOption.label||$(curOption).text()):"- empty -"))
			.focus(function(){
				clearTimeout(timerHnd);
			})
			.blur(function(){
				var $this=$(this);
				timerHnd=setTimeout(function(){
					close($this);
				},100
				);
			})
			.click(function(e){
				e.preventDefault();
				var $anchor=$(this);

				if ($anchor.hasClass("disabled")){return false;};

				var select=$anchor.prev("select").get(0),
				externalDiv=$("<div />")
				.keydown(function(e){
					switch(e.which){
					case 40: //down
						$(document.activeElement).closest("li").nextAll().find("a").eq(0).focus();
						return false;
						break;

					case 38: //up
						$(document.activeElement).closest("li").prevAll().find("a").eq(0).focus();
						return false;
						break;
					}
				})
				.addClass("ixDropDown_DIV " + select.className),
				contDiv=$("<div />").addClass("ixDropDown_Cont").appendTo(externalDiv),
				ul=$("<ul />")
				.attr("tabIndex",-1)
				.focus(function(){
					clearTimeout(timerHnd);
				})
				.blur(function(){
					timerHnd=setTimeout(function(){
						close($anchor);
					},100
					);
				})
				.addClass("ixDropDown_UL")
				.appendTo(contDiv);

				var options=$(select).children();

				if($anchor.data("externalDiv")){
					close($anchor);
					return false;
				}

				//adding the "open" className
				$anchor.addClass("open");

				$anchor.data("externalDiv",externalDiv);

				doHTML(options);

				function doHTML(items){
					$.each(items,function(index,item){

						if(item.disabled){
							$("<span />")
							.text(item.text)
							.addClass("disabled")
							.appendTo(
									$("<li />").appendTo(ul)
							);
							return true;
						}

						switch(item.tagName.toLowerCase()){
						case "optgroup":
							$("<strong />")
							.text(item.label)
							.appendTo(
									$("<li />").appendTo(ul)
							);

							doHTML($(item).children());
							break;

						case "option":
							$("<a />")
							.text(item.text)
							.attr("href","#" + item.text)
							.attr("data_index",index)
							.click(function(e){
								e.preventDefault();

								var $this=$(this);
								var index=$this.attr("data_index");
								var option=items[index];

								option.selected="selected";

								close($anchor);

								$anchor.siblings("select").change();
							})
							.focus(function(){
								clearTimeout(timerHnd);
							})
							.blur(function(){
								timerHnd=setTimeout(function(){
									close($anchor);
								},100
								);
							})
							.appendTo(
									$("<li />").appendTo(ul)
							);
							break;
						}
					});
				}

				var pos=$anchor.offset();

				externalDiv.appendTo(document.body)
				.css({
					left:pos.left,
					top:pos.top+$anchor.outerHeight(true)
				})
				.slideDown(120,function(){ul.find("a:first").focus();});

				return false;
			});
		});

		function close(anchor){
			var externalDiv=anchor.data("externalDiv");

			anchor.removeClass("open");

			if(externalDiv){
				anchor.data("externalDiv",null).focus();
				externalDiv.slideUp(120,function(){externalDiv.remove();});
			}
		}
	};

	$.fn.disabled=function(status){
		var select=this.prev("select");
		
		if(select.length>0){
			select.attr("disabled",status?"disabled":"")
				.find("option").get(0).selected="selected";
	
			select.change();	
		}
		
		return status?this.addClass("disabled"):this.removeClass("disabled");
	};
})(jQuery);

//flashcards.
function updateFlashcardNumber(fcnum){
	var $=jQuery;
	$('#current-flashcard-page').text(fcnum);
}
//end flashcards

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
(function($){
	$.event.special.mousewheel = {
			setup: function(){
				var handler = $.event.special.mousewheel.handler;

				// Fix pageX, pageY, clientX and clientY for mozilla
				if ( $.browser.mozilla )
					$(this).bind('mousemove.mousewheel', function(event){
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

			teardown: function(){
				var handler = $.event.special.mousewheel.handler;

				$(this).unbind('mousemove.mousewheel');

				if ( this.removeEventListener )
					this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
				else
					this.onmousewheel = function(){};

					$.removeData(this, 'mwcursorposdata');
			},

			handler: function(event){
				var args = Array.prototype.slice.call( arguments, 1 );

				event = $.event.fix(event || window.event);
				// Get correct pageX, pageY, clientX and clientY for mozilla
				$.extend( event, $.data(this, 'mwcursorposdata') || {});
				var delta = 0, returnValue = true;

				if (event.wheelDelta) delta = event.wheelDelta/120;
				if (event.detail) delta = -event.detail/3;
//				if ($.browser.opera) delta = -event.wheelDelta;

				event.data = event.data || {};
				event.type = "mousewheel";

				// Add delta to the front of the arguments
				args.unshift(delta);
				// Add event to the front of the arguments
				args.unshift(event);

				return $.event.handle.apply(this, args);
			}
	};

	$.fn.extend({
		mousewheel: function(fn){
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
		},

		unmousewheel: function(fn){
			return this.unbind("mousewheel", fn);
		}
	});
})(jQuery);