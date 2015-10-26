$(function(){
	this.searchData = new Object();

	this.createDomObj = function(){
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
		this.searchData['searchTime'] = new Date().getTime();
	}

	this.createCondSelectHtml = function(){
		var html = [];
		for(var i=0,ilen=this.searchData['con'].length;i<ilen;i++){
			html.push('<a href="javascript:void(0);" class="keyword">'+decodeURIComponent(this.searchData['con'][i])+'<em class="close">X</em></a>');
		}
		this.conditionObj.html(html.join(""));
	}

	this.getSearchListData = function(){
		var self = this;
		$.ajax({
			url : "/xiaoqiang/php/searchlist.php",
			data : "type="+this.searchData['type'].join(",")+"&con="+this.searchData['con'].join(",")+"&searchTime="+this.searchData['searchTime'],
			dataType : "json",
			type : "post",
			success : function(data){
				if(data.code!==0)return false;
				if(data.searchTime!=self.searchData['searchTime'])return false;
				self.createSearchCondHtml(data['info']['cond']);
				self.createSearchListHtml(data['info']['list']);
			}
		})
	}

	this.createSearchCondHtml = function(data){
		console.log(data);
	}

	this.createSearchListHtml = function(data){
		console.log(data);

	}

	this.init = function(){
		this.createDomObj();
		this.createSearchData();
		this.createCondSelectHtml();
		this.getSearchListData();
	}

	this.init();
});