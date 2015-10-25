$(function(){
	this.searchType = "";

	this.getLinkWatTime = 200;
	this.getLinkPrevTime = 0;
	this.getLinkAjaxObj = "";

	this.getDom = function(id){return document.getElementById(id)};

	this.createDom = function(){
		this.searchChildObj = $("#searchChildObj");
		this.searchTypeObj = $("#searchTypeObj");
		this.searchObj = $("#searchObj");
		this.searchConObj = $("#searchConObj");
		this.searchTipsObj = $("#searchTipsObj");
	}

	this.getDefSearchType = function(){
		var searchOnObj = this.searchChildObj.children("li.sObj");
		this.searchType = searchOnObj.attr("data-v");
	}

	this.showSearchType = function(){
		this.showSearchEventObj = new clickShowDiv('searchChildObj',this.getDom('searchTypeObj'),function(){
			//显示回调
		},function(){
			//隐藏回调
		});
	}

	this.hideSearchTypeObj = function(){
		this.searchChildObj.hide();
	}

	this.selectSearchType = function(obj){
		this.searchType = $(obj).attr("data-v");
		var thisText = $(obj).text();
		this.searchTypeObj.find("span").html(thisText);
		$(obj).addClass("sObj");
		$(obj).siblings("li").removeClass("sObj");
		this.hideSearchTypeObj();
	}

	this.subSearch = function(){
		var searchCon = this.searchConObj.val();
		var formObj = $('<form action="/xiaoqiang/search.html" target="_self" method="get"></form>');
		var html = ['<input type="hidden" name="type" value="'+this.searchType+'">'];
		html.push('<input type="hidden" name="con" value="'+searchCon+'">');
		formObj.html(html.join(","));
		$("body").append(formObj);
		formObj.submit();
	}

	this.getSearchLink = function(){
		var searchVal = this.searchConObj.val();

		if(searchVal === ""){
			this.clearSearchTipsObj();
			return false;
		}
		var nowTime = new Date().getTime();
		if(nowTime-this.getLinkPrevTime < this.getLinkWatTime && this.getLinkAjaxObj){
			clearTimeout(this.getLinkAjaxObj);
			this.getLinkAjaxObj = "";
		}

		var self = this;

		self.getLinkPrevTime = nowTime;

		this.getLinkAjaxObj = setTimeout(function(){
			self.getData();
		},this.getLinkWatTime);
	}

	this.getData = function(){
		var self = this;
		$.ajax({
			url : "/xiaoqiang/php/searchlink.php",
			data : "type="+this.searchType+"&con="+this.searchConObj.val()+"&searchTime="+this.getLinkPrevTime,
			type : "post",
			dataType : "json",
			success : function(data){
				if(data.code!=0)return false;
				if(data.searchTime != data.searchTime)return false;
				self.createSearchListDom(data.info);
			}
		});
	}

	this.createSearchListDom = function(data){
		var html = [];
		for(var i=0,ilen=data.length;i<ilen;i++){
			html.push('<li data-v="'+data[i]+'">'+data[i]+'</li>');
		}
		if(html.length==0){
			this.searchTipsObj.hide();
			return false;
		}
		this.searchTipsObj.html(html.join(""));
		this.searchTipsObj.show();
	}

	this.linkSearch = function(obj){
		var thisV = $(obj).attr("data-v");
		this.searchConObj.val(thisV);
		this.subSearch();
	}

	this.clearSearchTipsObj = function(){
		this.searchTipsObj.html("");
		this.searchTipsObj.hide();
		this.getLinkPrevTime = 0;
		if(this.getLinkAjaxObj)clearTimeout(this.getLinkAjaxObj);
	}

	this.documentEvent = function(){
		var self = this;
		this.searchChildObj.children("li").click(function(){
			self.selectSearchType(this);
		});

		this.searchObj.click(function(){
			self.subSearch();
		});

		this.searchConObj.keyup(function(){
			self.getSearchLink();
		});

		this.searchTipsObj.click(function(e){
			var liObj = $.fn.checkEvent(e,"LI");
			if(liObj){
				self.linkSearch(liObj);
			}
		});

		this.checkSearch = false;

		this.searchTipsObj.mouseenter(function(){
			self.checkSearch = true;
		});

		this.searchTipsObj.mouseleave(function(){
			self.checkSearch = false;
		});

		this.searchConObj.blur(function(){
			if(self.checkSearch)return false;
			self.clearSearchTipsObj();
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