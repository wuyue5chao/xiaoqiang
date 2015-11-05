$(function(){
	this.searchData = new Object();

	this.searchPage = 1;
	this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
	this.listMaxNum = 20;
	this.checkSearchListAjax = false;
	this.checkCollecAjax = false;
	this.checkCreateCondition = true;
	this.selectConditionObj = "";
	this.selectConditionTime = new Date().getTime();
	this.maxPageDomNum = 10;

	this.createDomObj = function(){
		this.conditionSelectObj = $("#conditionSelectObj");
		this.searchNumObj = $("#searchNumObj");
		this.conditionObj = $("#conditionObj");
		this.searchListObj = $("#searchListObj");
		this.collectObj = $("#collectObj");
		this.ajaxScrollTipsObj = $("#ajaxScrollTipsObj");
		this.nodataObj = $("#nodataObj");
		this.pageObj = $("#pageObj");
		this.downObj = $("#downObj");
	}

	this.createSearchData = function(){
		var thisDataStr = window.location.search;
		if(thisDataStr.indexOf("?") === 0)thisDataStr = thisDataStr.slice(1);
		var thisDataArr = thisDataStr.split("&");
		for(var i=0,ilen=thisDataArr.length;i<ilen;i++){
			var thiskeyVal = thisDataArr[i].split("=");
			var thisSearchVal = decodeURIComponent(decodeURI(thiskeyVal[1])).replace(/\s+/g," ").split(" ");
			this.searchData[thiskeyVal[0]] = [].concat(thisSearchVal);
		}

		this.searchData['searchTime'] = 0;
	}

	this.createCondSelectHtml = function(){
		var html = [];
		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			var thisV = decodeURIComponent(decodeURI(this.searchData['keyword'][i]));
			var searchCond = (thisV.indexOf("_")>-1 && thisV.split("_").length==3) ? thisV.split("_")[2]:  thisV;
			html.push('<a data-v="'+thisV+'" href="javascript:void(0);" class="keyword">'+searchCond+'<em class="close">X</em></a>');
		}
		this.conditionSelectObj.html(html.join(""));
	}

	this.getSearchListPostData = function(){
		this.searchData['searchTime'] = new Date().getTime();
		var postData = {
			type : this.searchData['type'],
			page : this.searchPage,
			searchTime : this.searchData['searchTime'],
			searchNum : this.listMaxNum
		}

		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			var thisCond = this.searchData['keyword'][i].split("_");
			if(thisCond.length==1){
				if(!postData['keyword'])postData['keyword']=new Array();
				postData['keyword'].push(this.searchData['keyword'][i]);
				continue;
			}
			var thisK = thisCond[0];
			var thisId = thisCond[1];
			if(!postData[thisK+"_id"])postData[thisK+"_id"] = new Array();
			postData[thisK+"_id"].push(thisId);
		}

		for(var k in postData){
			if(postData[k].join)postData[k] = postData[k].join(",");
		}

		return postData;
	}

	this.getSearchListData = function(){
		if(this.checkSearchListAjax)return false;
		this.checkSearchListAjax = true;
		var self = this;
		this.ajaxScrollTipsObj.children('a').html("正在加载中...");
		this.ajaxScrollTipsObj.show();
		$.ajax({
			url : "/xiaoqiang/php/searchlist.php",
			data : this.getSearchListPostData(),
			dataType : "json",
			type : "post",
			success : function(data){
				self.ajaxScrollTipsObj.hide();
				self.checkSearchListAjax = false;
				if(data.code!==0)return false;
				if(data.searchTime!=self.searchData['searchTime'])return false;
				if(self.checkCreateCondition){
					self.createSearchCondHtml(data['info']['cond']);
					self.checkCreateCondition = false;
				}else{
					//self.resetSearchCondHtml(data['info']['cond']);
				}
				if(data['info']['searchList']['page'] == 1)self.createSeatchCountHtml(data['info']['count']);
				self.createPageHtml(Number(data['info']['searchList']['page']),Number(data['info']['count']),self.listMaxNum);
				if(data['info']['searchList']['page'] != self.searchPage)return false;
				self.createSearchListHtml(data['info']['searchList']['list']);
				if(data['info']['searchList']['count'] < self.listMaxNum){
					self.checkSearchListAjax = true;
					self.ajaxScrollTipsObj.show();
					self.ajaxScrollTipsObj.children('a').html("数据已经全部加载");
				}
			},error : function(){
				self.checkSearchListAjax = false;
			}
		})
	}

	this.createFloatCondHtml = function(data){
		var html = ['<div class="item clearfix" data-t="float" data-k="'+data['key']+'"><h3><a href="javascript:void(0);">'+data['cn']+'<i class="arrow"></i></a></h3><div class="lists-other clearfix">'];

		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<div class="other"><a href="javascript:void(0);" data-t="cond" data-v="'+data['key']+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" class="tit'+(data['child'][i]['child'] && data['child'][i]['child'].length ? ' onObj' : '')+'"><em>'+(data['child'][i]['child'] && data['child'][i]['child'].length ? '-' : '+')+'</em> '+data['child'][i]['cond']+'<em>('+data['child'][i]['num']+')</em></a>');
			if(!(data['child'][i]['child'] && data['child'][i]['child'].length)){
				html.push('</div>');
				continue;
			}
			html.push('<ul class="second-list">')
			for(var k=0,klen=data['child'][i]['child'].length;k<klen;k++){
				html.push('<li data-v="'+data['key']+"_"+data['child'][i]['child'][k]['id']+"_"+data['child'][i]['child'][k]['cond']+'" data-t="cond">'+data['child'][i]['child'][k]['cond']+'<em>('+data['child'][i]['child'][k]['num']+')</em></label></li>');
			}
			html.push('</ul></div>');
		}

		html.push('</div></div>');

		return html.join("");
	}

	// this.createFloatCondHastitleHtml = function(key,data){
	// 	var html = ['<div class="column" data-title="'+data['title']+'"><dl><dt><strong>'+data['title']+'</strong></dt>'];

	// 	for(var i=0,ilen=data['child'].length;i<ilen;i++){
	// 		html.push('<dd><label><input type="checkbox" value="'+key+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" data-t="cond" class="ipt" /><span class="txt">'+data['child'][i]['cond']+'</span><em class="num">('+data['child'][i]['num']+')</em></label></dd>');
	// 	}

	// 	html.push('</dd></dl></div>');

	// 	return html.join("");
	// }

	// this.createFloatCondNoHastitleHtml = function(key,data){
	// 	return '<div class="column"><label><input type="checkbox" class="ipt" value="'+key+"_"+data['id']+"_"+data['cond']+'" data-t="cond"/><span class="txt">'+data['cond']+'</span><em class="num">('+data['num']+')</em></label></div>';
	// }

	// this.createFloatCondLayerHtml = function(data){
	// 	var html = ['<div class="down-layer" id="'+data['key']+'LayerObj" style="display:none;">'];
	// 	for(var i=0,ilen=data['child'].length;i<ilen;i++){
	// 		if(data['child'][i]['title']){
	// 			html.push(this.createFloatCondHastitleHtml(data['key'],data['child'][i]));
	// 		}else{
	// 			html.push(this.createFloatCondNoHastitleHtml(data['key'],data['child'][i]));
	// 		}
	// 	}
	// 	this.conditionObj.after(html.join(""));
	// }

	// this.createFloatCondMouseEvent = function(data){
	// 	if(!data || !data.length)return false;
	// 	var self = this;
	// 	var conditionDivObj = this.conditionObj.children("div");
	// 	for(var i=0,ilen=conditionDivObj.length;i<ilen;i++){
	// 		var thisK = conditionDivObj.eq(i).attr("data-k");
	// 		if($.inArray(thisK,data)>-1){
	// 			new mouseShowDiv(thisK+"LayerObj",conditionDivObj.eq(i)[0],50,200,function(){

	// 				for(var d=0,dlen=conditionDivObj.length;d<dlen;d++){
	// 					if(!conditionDivObj.eq(d)[0].className.indexOf('item_on')<0)continue;
	// 					conditionDivObj.eq(d).removeClass('item-on');
	// 				}
	// 				$(this).addClass("item-on");
	// 			},function(){
	// 				$(this).removeClass("item-on");
	// 			});
	// 		}
	// 	}
	// }

	// this.setFloatCondLayerHeight = function(data){
	// 	if(!data || !data.length)return false;
	// 	var titleHeight = this.conditionObj.height();
	// 	for(var i=0,ilen=data.length;i<ilen;i++){
	// 		var thisObj = $("#"+data[i]+"LayerObj");
	// 		thisHeight = thisObj.height();
	// 		if(thisHeight < titleHeight){
	// 			thisObj.css({
	// 				"height" : titleHeight-20,
	// 				"min-height" : titleHeight-20
	// 			});
	// 		}
	// 	}
	// }

	this.createSelectCondHtml = function(data){
		var html = ['<div class="item clearfix" data-t="float" data-k="'+data['key']+'"><h3><a href="javascript:void(0);">'+data['cn']+'<i class="arrow"></i></a></h3><ul class="lists">'];
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<li data-v="'+data['key']+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" data-t="cond">'+data['child'][i]['cond']+'<em>('+data['child'][i]['num']+')</em></label></li>');
		}

		html.push('</ul></div>');

		return html.join("");
	}

	this.createSearchCondHtml = function(data){
		var html = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			switch (data[i]['type']){
				case "float" :html.push(this.createFloatCondHtml(data[i]));break;
				case "select" : html.push(this.createSelectCondHtml(data[i]));break;
			}
		}

		this.conditionObj.html(html.join(""));
	}

	this.resetFloatCondHastitleHtml = function(key,data){
		var divObj = $("#"+key+"LayerObj").children("div[data-title='"+data['title']+"']");
		var inputObj = divObj.find("input[data-t='cond']");
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			var thisVal = [key,data['child'][i]['id'],data['child'][i]['cond']].join("_");
			var thisInputObj = inputObj.filter("[value='"+thisVal+"']");
			if(thisInputObj.length){
				thisInputObj.nextAll("em").html("("+data['child'][i]['num']+")");
				thisInputObj[0].disabled = false;
				var index = inputObj.index(thisInputObj);
				inputObj[index] = false;
			}else{
				divObj.append('<dd><label><input type="checkbox" value="'+key+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" data-t="cond" class="ipt" /><span class="txt">'+data['child'][i]['cond']+'</span><em class="num">('+data['child'][i]['num']+')</em></label></dd>');
			}
		}

		for(var i=0,ilen=inputObj.length;i<ilen;i++){
			if(!inputObj[i])continue;
			inputObj[i].disabled = true;
			inputObj.eq(i).nextAll("em").html("(0)");
		}
	}

	this.resetFloatCondNoHastitleHtml = function(key,data){
		var inputObj = $("#"+key+"LayerObj").find("input[data-t='cond'][value='"+([key,data['id'],data['cond']].join("_"))+"']");
		if(inputObj.length){
			inputObj.nextAll("em").html("("+data['num']+")");
			inputObj[0].disabled = false;
		}else{
			$("#"+key+"LayerObj").append(this.createFloatCondNoHastitleHtml(key,data));
		}
	}

	this.resetFloatCondLayerHtml = function(data){
		var temKey = new Array();
		var type = "";
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			if(data['child'][i]['title']){
				this.resetFloatCondHastitleHtml(data['key'],data['child'][i]);
				temKey.push(data['child'][i]['title']);
				type= "title";
			}else{
				this.resetFloatCondNoHastitleHtml(data['key'],data['child'][i]);
				temKey.push([data['key'],data['child'][i]['id'],data['child'][i]['cond']].join("_"));
			}
		}

		if(type=="title"){
			this.checkFloatCondHastitleHtml(data['key'],temKey);
		}else{
			this.checkFloatCondNoHastitleHtml(data['key'],temKey);
		}
	}

	this.checkFloatCondHastitleHtml = function(key,data){
		var divObj = $("#"+key+"LayerObj").children("div");
		for(var i=0,ilen=divObj.length;i<ilen;i++){
			var thisTitle = divObj.eq(i).attr("data-title");
			if($.inArray(thisTitle,data)>-1)continue;
			var inputObj = divObj.eq(i).find("input[data-t='cond']");
			for(var k=0,klen=inputObj.length;k<klen;k++){
				inputObj[k].disabled = true;
				inputObj.eq(k).nextAll("em").html("(0)");
			}
		}
	}

	this.checkFloatCondNoHastitleHtml = function(key,data){
		var inputObj = $("#"+key+"LayerObj").find("input[data-t='cond']");
		for(var i=0,ilen=inputObj.length;i<ilen;i++){
			var thisV = inputObj[i].value;
			if($.inArray(thisV,data)>-1)continue;
			inputObj[i].disabled = true;
			inputObj.eq(i).nextAll("em").html("(0)");
		}
	}

	this.resetSelectCondHtml = function(data){
		var ulObj = this.conditionObj.children('div[data-k="'+data['key']+'"]').children('ul');
		var inputObj = ulObj.find("input[data-t='cond']");
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			var thisVal = [data['key'],data['child'][i]['id'],data['child'][i]['cond']].join("_");
			var thisInputObj = inputObj.filter("[value='"+thisVal+"']");
			if(thisInputObj.length){
				thisInputObj.nextAll("em").html("("+data['child'][i]['num']+")");
				thisInputObj[0].disabled = false;
				var index = inputObj.index(thisInputObj);
				inputObj[index] = false;
			}else{
				var html = '<li><label><input value="'+thisVal+'" data-t="cond" type="checkbox"/> '+data['child'][i]['cond']+'<em>('+data['child'][i]['num']+')</em></label></li>';
				ulObj.append(html);
			}
		}
		for(var i=0,ilen=inputObj.length;i<ilen;i++){
			if(!inputObj[i])continue;
			inputObj[i].disabled = true;
			inputObj.eq(i).nextAll("em").html("(0)");
		}
	}

	this.resetSearchCondHtml = function(data){
		var floatKey = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			var thisCondDivObj = this.conditionObj.children('div[data-k="'+data[i]['key']+'"]');
			if(thisCondDivObj.length){
				switch (data[i]['type']){
					case "float" : this.resetFloatCondLayerHtml(data[i]);break;
					case "select" : this.resetSelectCondHtml(data[i]);break;
				}
			}else{
				switch (data[i]['type']){
					case "float" : floatKey.push(data[i]['key']);this.conditionObj.append(this.createFloatCondHtml(data[i],i));this.createFloatCondLayerHtml(data[i]);break;
					case "select" : this.conditionObj.append(this.createSelectCondHtml(data[i]));break;
				}
			}
		}
		this.setFloatCondLayerHeight(floatKey);
		this.createFloatCondMouseEvent(floatKey);
	}

	this.createSeatchCountHtml = function(data){
		this.searchNumObj.html(data);
	}

	this.createSearchListLabelHtml = function(data){
		if(!(data && data.length))return "";
		var html = ['<span class="fontyellow">'];
		for(var i=0,ilen=data.length;i<ilen;i++){
			html.push('<em>'+data[i]+'</em>');
		}

		html.push("</span>");
		return html.join("");
	}

	this.createSearchListHtml = function(data){
		var html = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			html.push('<div class="item-info"><h3><a href="javascript:void(0);" data-t="detail" data-i="'+data[i]['id']+'" class="fontblue">'+data[i]['title']+'</a>'+(data[i]['type'] ? '<span class="tag">'+data[i]['type']+'</span>' : '')+'</h3><p class="zhushi font12 mb10">'+this.createSearchListLabelHtml(data[i]['label'])+'<span class="fontyellow"><em>'+data[i]['add']+'</em><span class="fontgray"><em>'+data[i]['num']+'</em></span><span class="fontgray"><em>'+data[i]['date']+'</em></span></p><p class="text mb10">'+data[i]['content']+'</p><div class="clearfix font12"><p class="zhushi fl">'+(data[i]['ctype'] ? '<span class="fontgray"><em>'+data[i]['ctype']+'</em></span>' : '')+(data[i]['presname'] ? '<span class="fontgray"><em>审判长：'+data[i]['presname']+'</em></span>' : '')+'</p><p class="save fr"><a href="javascript:void(0);" data-t="collectOne" data-i="'+data[i]['id']+'"><em class="save-icon icon"></em> 收藏</a><a href="javascript:void(0);" data-t="downOne" data-i="'+data[i]['id']+'"><em class="load-icon icon"></em> 下载</a></p></div></div>');
		}

		this.searchListObj.html(html);
	}

	this.createPageHtml = function(n,a,m){
		var allPageNum = Math.ceil(a/m);
		var html = ['<a href="javascript:void(0);"'+(n==1 ? ' style="display:none"' : '')+' data-t="page" data-v="prev">上一页</a>'];

		if(allPageNum < this.maxPageDomNum ){
			var startPage = 1;
		}else{
			var ljval = Math.floor(this.maxPageDomNum/2)+1
			var startPage = n>ljval ? n-ljval : 1;

			startPage = allPageNum-n > this.maxPageDomNum - ljval ? startPage : allPageNum-this.maxPageDomNum+1;
		}
		var endPage = allPageNum > this.maxPageDomNum ? this.maxPageDomNum : allPageNum;
		for(var i=0,page=startPage;i<endPage;i++,page++){
			html.push('<a href="javascript:void(0);" class="'+(page==n ? "on" : "")+'" data-t="page" data-v="'+page+'">'+page+'</a>');
		}
		html.push('<a href="javascript:void(0);" data-t="page"'+(n==allPageNum ? ' style="display:none"' : '')+' data-v="next">下一页</a>');

		this.pageObj.attr("data-a",allPageNum);
		this.pageObj.html(html.join(""));
	}

	this.collectCondition = function(){
		if(this.checkCollecAjax)return false;
		var self = this;
		this.checkCollecAjax = true;
		$.ajax({
			url : "/xiaoqiang/php/collectcondition.php",
			data : "type="+this.searchData['type'].join(",")+"&keyword="+this.searchData['keyword'].join(","),
			type : "post",
			dataType : "json",
			success : function(data){
				self.checkCollecAjax = false;
				if(data.code !== 0){
					alert(data.msg);
				}else{
					alert("收藏成功");
				}
			}
		});
	}

	this.selectCondition = function(obj){
		var thisV = obj.attr("data-v");
		var delVal = "";
		if(obj.hasClass('on')){
			obj.removeClass('on');
			delVal = thisV;
		}else{
			this.searchData['keyword'].push(thisV);
			obj.addClass('on');
			var oldSelectObj = obj.siblings('li.on');
			oldSelectObj.removeClass('on');
			delVal = oldSelectObj.attr("data-v");
		}

		var temData = new Array();
		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			if(this.searchData['keyword'][i] == delVal)continue;
			temData.push(this.searchData['keyword'][i]);
		}
		this.searchData['keyword'] = temData;

		this.clearSearchRequestData();
		this.createCondSelectHtml();
		var self = this;
		
		var nowTime = new Date().getTime();
		if(nowTime - this.selectConditionTime < 500){
			if(this.selectConditionObj)clearTimeout(this.selectConditionObj);
		}
		this.selectConditionTime = nowTime;
		this.ajaxScrollTipsObj.children('a').html("正在加载中...");
		this.ajaxScrollTipsObj.show();
		setTimeout(function(){
			self.getSearchListData();
		},500);
	}

	this.selectTitleCondition = function(obj){
		var thisV = obj.attr("data-v");
		var thisVArr = thisV.split("_");
		var temData = new Array();
		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			var thisDataArr = this.searchData['keyword'][i].split("_");
			if(thisDataArr.length ==3 && thisDataArr[0]== thisVArr[0])continue;
			temData.push(this.searchData['keyword'][i]);
		}

		this.searchData['keyword'] = temData;
		var ulObj = obj.next();
		if(obj.hasClass('onObj')){
			obj.removeClass('onObj');
			obj.find("em:eq(0)").html("+");
			if(ulObj.length)ulObj.hide();
			if(ulObj.length)ulObj.children('li.on').removeClass('on');
		}else{
			this.searchData['keyword'].push(thisV);
			obj.addClass('onObj');
			obj.find("em:eq(0)").html("-");
			if(ulObj.length)ulObj.show();
		}

		this.clearSearchRequestData();
		this.createCondSelectHtml();
		var self = this;
		
		var nowTime = new Date().getTime();
		if(nowTime - this.selectConditionTime < 500){
			if(this.selectConditionObj)clearTimeout(this.selectConditionObj);
		}
		this.selectConditionTime = nowTime;
		this.ajaxScrollTipsObj.children('a').html("正在加载中...");
		this.ajaxScrollTipsObj.show();
		setTimeout(function(){
			self.getSearchListData();
		},500);
	}

	this.deleteCondition = function(obj){
		var aObj = obj.parent();
		var thisV = aObj.attr("data-v");
		if(thisV.indexOf("_")>-1){
			var inputObj = this.conditionObj.parent().find("input[data-t='cond'][value='"+thisV+"']");
			if(inputObj.length)inputObj[0].checked = false;
		}
		var temCond = new Array();
		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			if(this.searchData['keyword'][i] == thisV)continue;
			temCond.push(this.searchData['keyword'][i]);
		}
		this.searchData['keyword'] = temCond;

		this.clearSearchRequestData();
		this.createCondSelectHtml();
		this.checkedSearchData();

		var self = this;
		
		var nowTime = new Date().getTime();
		if(nowTime - this.selectConditionTime < 500){
			if(this.selectConditionObj)clearTimeout(this.selectConditionObj);
		}
		this.selectConditionTime = nowTime;
		this.ajaxScrollTipsObj.children('a').html("正在加载中...");
		this.ajaxScrollTipsObj.show();
		setTimeout(function(){
			self.getSearchListData();
		},500);
	}

	this.checkedSearchData = function(){
		if(this.searchData['keyword'] && this.searchData['keyword'].length){
			this.nodataObj.hide();
			this.nodataObj.siblings('div').show();
		}else{
			this.nodataObj.show();
			this.nodataObj.siblings('div').hide();
		}
	}

	this.clearSearchRequestData = function(){
		this.searchPage = 1;
		this.checkSearchListAjax = false;
		this.searchListObj.html("");
	}

	this.collectList = function(idArr){
		if(this.checkCollecAjax)return false;
		var self = this;
		this.checkCollecAjax = true;
		$.ajax({
			url : "/xiaoqiang/php/collect.php",
			data : "id="+idArr.join(","),
			type : "post",
			dataType : "json",
			success : function(data){
				self.checkCollecAjax = false;
				if(data.code !== 0){
					alert(data.msg);
				}else{
					alert("收藏成功");
				}
			}
		});
	}

	this.hrefDetail = function(thisId){
		window.location.href = "/xiaoqiang/detail.html?case_id="+thisId+"&keyword="+this.searchData['keyword'].join(",");
	}

	this.collectOne = function(thisId){
		var idArr = [thisId];
		this.collectList(idArr);
	}	

	this.downOne = function(thisId){
		alert("这个是下载跳转，给我链接");
	}

	this.downList = function(){
		alert("这个是批量下载跳转，给我链接");
	}

	this.createEvent = function(){
		var self = this;
		this.searchListObj.delegate("a","click",function(){
			var thisT = $(this).attr("data-t");
			if(!thisT)return true;
			var thisId = $(this).attr("data-i");
			switch(thisT){
				case "detail" : self.hrefDetail(thisId);return true;
				case "collectOne" : self.collectOne(thisId);return true;
				case "downOne" : self.downOne(thisId);return true;
			}
		});

		this.pageObj.delegate("a","click",function(){
			var thisT = $(this).attr("data-t");
			if(thisT!="page")return true;
			var thisV = $(this).attr("data-v");
			self.searchPage = thisV == "prev" ? (self.searchPage-1) : (thisV == "next" ? (self.searchPage+1) : Number(thisV));
			self.getSearchListData();
		});

		this.collectObj.click(function(){
			self.collectCondition();
		});

		this.downObj.click(function(){
			self.downList();
		});

		this.conditionObj.delegate("li","click",function(){
			var thisT = $(this).attr("data-t");
			switch(thisT){
				case "cond" : self.selectCondition($(this));return true;
			}
		});

		this.conditionObj.delegate("a","click",function(){
			var thisT = $(this).attr("data-t");
			switch(thisT){
				case "cond" : self.selectTitleCondition($(this));return true;
			}
		});

		this.conditionSelectObj.delegate("em","click",function(){
			self.deleteCondition($(this));
		});
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