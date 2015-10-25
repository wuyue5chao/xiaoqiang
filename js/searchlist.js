$(function(){
	this.searchData = new Object();

	this.createDom = function(){
		this.conditionObj = $("#conditionObj");
		this.searchNumObj = $("#searchNumObj");
	}

	this.createSearchData = function(){
		var thisDataStr = window.location.search;
		if(thisDataStr.indexOf("?") === 0)thisDataStr = thisDataStr.slice(1);
		var thisDataArr = thisDataStr.split("&");
		for(var i=0,ilen=thisDataArr.length;i<ilen;i++){
			var thiskeyVal = thisDataArr[i].split("=");
			this.searchData[thiskeyVal[0]] = [thiskeyVal[1]];
		}
	}

	this.createCondHtml = function(){
		var html = [];
		for(var i=0,ilen=this.searchData['con'].length;i<ilen;i++){
			html.push('<a href="javascript:void(0);" class="keyword">'+decodeURIComponent(this.searchData['con'][i])+'<em class="close">X</em></a>');
		}
		this.conditionObj.html(html.join(""));
	}

	this.init = function(){
		this.createDom();
		this.createSearchData();
		this.createCondHtml();
	}

	this.init();
});