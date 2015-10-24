$(function(){
	this.searchType = "";

	this.getDom = function(id){return document.getElementById(id)};

	this.createDom = function(){
		this.searchChildObj = $("#searchChildObj");
		this.searchTypeObj = $("#searchTypeObj");
	}

	this.getDefSearchType = function(){
		var searchOnObj = this.searchChildObj.children("li.sObj");
	}

	this.showSearchType = function(){
		this.showSearchEventObj = new clickShowDiv('searchChildObj',this.getDom('searchTypeObj'));
	}

	this.hideSearchTypeObj = function(){
		this.searchChildObj.hide();
	}

	this.documentEvent = function(){
		var self = this;
		this.searchChildObj.children("li").click(function(){
			self.searchType = $(this).attr("data-v");
			var thisText = $(this).text();
			self.searchTypeObj.find("span").html(thisText);
			$(this).addClass("sObj");
			$(this).siblings("li").removeClass("sObj");
			self.hideSearchTypeObj();
		});
	}

	this.init = function(){
		this.createDom();
		this.getDefSearchType();
		this.showSearchType();
		this.documentEvent();
	}

	this.init();
});