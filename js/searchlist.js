$(function(){
	this.searchData = new Object();

	this.createDomObj = function(){
		this.conditionSelectObj = $("#conditionSelectObj");
		this.searchNumObj = $("#searchNumObj");
		this.conditionObj = $("#conditionObj");
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
		this.conditionSelectObj.html(html.join(""));
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

	this.createFloatCondHtml = function(data){
		var html = '<div class="item" data-t="float" data-k="'+data['key']+'"><h3><a href="javascript:void(0)">'+data['cn']+'</a></h3><i class="arrow more">></i></div>';
		return html;
	}

	this.createFloatCondHastitleHtml = function(data){
		console.log(data);
		var html = ['<div class="column"><dl><dt><strong>'+data['title']+'</strong></dt>'];

		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<dd><label><input type="checkbox" class="ipt" /><span class="txt">'+data['child'][i]['cond']+'</span><em class="num">('+data['child'][i]['num']+')</em></label></dd>');
		}

		html.push('</dd></dl></div>');

		return html.join("");
	}

	this.createFloatCondNoHastitleHtml = function(data){
		return '<div class="column"><label><input type="checkbox" class="ipt" /><span class="txt">'+data['cond']+'</span><em class="num">('+data['num']+')</em></label></div>';
	}

	this.createFloatCondLayerHtml = function(data){
		var html = ['<div class="down-layer" id="'+data['key']+'LayerObj" style="min-height:567px;display:none;">'];
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			if(data['child'][i]['title']){
				html.push(this.createFloatCondHastitleHtml(data['child'][i]));
			}else{
				html.push(this.createFloatCondNoHastitleHtml(data['child'][i]));
			}
		}
		this.conditionObj.after(html.join(""));
	}

	this.createSelectCondHtml = function(data){
		var html = ['<div class="item"  data-t="float" data-k="'+data['key']+'"><h3><a href="javascript:void(0);"><i class="more">-</i> '+data['cn']+'</a></h3><ul class="second-list">'];
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<li><label><input type="checkbox"/> '+data['child'][i]['cond']+'<em>('+data['child'][i]['num']+')</em></label></li>');
		}

		html.push('</ul></div>');

		return html.join("");
	}

	this.createSearchCondHtml = function(data){
		var html = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			switch (data[i]['type']){
				case "float" : html.push(this.createFloatCondHtml(data[i]));this.createFloatCondLayerHtml(data[i]);break;
				case "select" : html.push(this.createSelectCondHtml(data[i]));break;
			}
		}

		this.conditionObj.html(html.join(""));
	}

	this.createSearchListHtml = function(data){

	}

	this.createEvent = function(){
		// this.conditionObj.delegate("div","mouseenter",function(){
		// 	var thisObj = $(this);
		// 	var thisT = thisObj.attr("data-t");
		// 	if(thisT!="float")return false;
		// });
		// this.conditionObj.delegate("div","mouseleave",function(){
		// 	var thisObj = $(this);
		// 	var thisT = thisObj.attr("data-t");
		// 	if(thisT!="float")return false;
		// });
	}

	this.init = function(){
		this.createDomObj();
		this.createEvent();
		this.createSearchData();
		this.createCondSelectHtml();
		this.getSearchListData();
	}

	this.init();
});