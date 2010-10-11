GM.DEFAULT_DISCLAIMER_LINK = 'https://globalmarkets.bnpparibas.com/fiweb/public/disclaimer/Disclaimer.html';
GM.RESEARCH_POLICY_URL = 'https://globalmarkets.bnpparibas.com/fiweb/public/ResearchPolicy.html';

GM.launchDisclaimer = function(url, style) {
	if (url == undefined)
		url = GM.DEFAULT_DISCLAIMER_LINK;
	if (style == undefined)
		style = 'help=no,status=no,location=no,width=520,height=500,menubar=no,scrollbars=no,toolbar=no,resizable=no,directories=no';
	var mywin = window.open(url, '', style);	
	mywin.focus();
	return false;
}

GM.launchResearchConflictsPolicy = function (url) {
	if (url == undefined)
		url = GM.RESEARCH_POLICY_URL;
	var mywin = window.open(url, '', 'help=no,status=no,location=no,width=540,height=500,menubar=no,scrollbars=yes,toolbar=no,resizable=no,directories=no');
	mywin.focus();
	return false;
}

GM.regulationPopup = function(szDivID, iState){
	// state : 1 visible, 0 hidden
	var div = jQuery("#" + szDivID);
	
	if(document.layers){
		div.css('visibility', (iState ? "show" : "hide")); 
	} else {
		div.css('visibility', (iState ? "visible" : "hidden"));
	}
}