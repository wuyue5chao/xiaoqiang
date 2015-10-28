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

	this.createDomObj = function(){
		this.conditionSelectObj = $("#conditionSelectObj");
		this.searchNumObj = $("#searchNumObj");
		this.conditionObj = $("#conditionObj");
		this.searchListObj = $("#searchListObj");
		this.collectionObj = $("#collectionObj");
		this.ajaxScrollTipsObj = $("#ajaxScrollTipsObj");
	}

	this.createSearchData = function(){
		var thisDataStr = window.location.search;
		if(thisDataStr.indexOf("?") === 0)thisDataStr = thisDataStr.slice(1);
		var thisDataArr = thisDataStr.split("&");
		for(var i=0,ilen=thisDataArr.length;i<ilen;i++){
			var thiskeyVal = thisDataArr[i].split("=");
			this.searchData[thiskeyVal[0]] = [decodeURIComponent(decodeURI(thiskeyVal[1]))];
		}

		this.searchData['searchTime'] = 0;
	}

	this.createCondSelectHtml = function(){
		var html = [];
		for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
			var thisV = decodeURIComponent(decodeURI(this.searchData['keyword'][i]));
			var searchCond = (thisV.indexOf("_")>-1 && thisV.split("_").length==3) ? thisV.split("_")[2]:  thisV;
			html.push('<a href="javascript:void(0);" class="keyword">'+searchCond+'<em class="close">X</em></a>');
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
				postData['keyword'] = this.searchData['keyword'][i];
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
					self.resetSearchCondHtml(data['info']['cond']);
				}
				if(data['info']['searchList']['page'] == 1)self.createSeatchCountHtml(data['info']['count']);
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

	this.createFloatCondHtml = function(data,i){
		var html = '<div class="item" data-t="float" data-k="'+data['key']+'"'+(i==0? ' style="border-top-color:#f2f4f6"' : '')+'><h3><a href="javascript:void(0)">'+data['cn']+'</a></h3><i class="arrow more">></i><span'+(i==0 ? ' style="height:45px;top:-1px;"' : '')+' class="borderout"></span></div>';
		return html;
	}

	this.createFloatCondHastitleHtml = function(key,data){
		var html = ['<div class="column" data-title="'+data['title']+'"><dl><dt><strong>'+data['title']+'</strong></dt>'];

		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<dd><label><input type="checkbox" value="'+key+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" data-t="cond" class="ipt" /><span class="txt">'+data['child'][i]['cond']+'</span><em class="num">('+data['child'][i]['num']+')</em></label></dd>');
		}

		html.push('</dd></dl></div>');

		return html.join("");
	}

	this.createFloatCondNoHastitleHtml = function(key,data){
		return '<div class="column"><label><input type="checkbox" class="ipt" value="'+key+"_"+data['id']+"_"+data['cond']+'" data-t="cond"/><span class="txt">'+data['cond']+'</span><em class="num">('+data['num']+')</em></label></div>';
	}

	this.createFloatCondLayerHtml = function(data){
		var html = ['<div class="down-layer" id="'+data['key']+'LayerObj" style="display:none;">'];
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			if(data['child'][i]['title']){
				html.push(this.createFloatCondHastitleHtml(data['key'],data['child'][i]));
			}else{
				html.push(this.createFloatCondNoHastitleHtml(data['key'],data['child'][i]));
			}
		}
		this.conditionObj.after(html.join(""));
	}

	this.createFloatCondMouseEvent = function(data){
		if(!data || !data.length)return false;
		var self = this;
		var conditionDivObj = this.conditionObj.children("div");
		for(var i=0,ilen=conditionDivObj.length;i<ilen;i++){
			var thisK = conditionDivObj.eq(i).attr("data-k");
			if($.inArray(thisK,data)>-1){
				new mouseShowDiv(thisK+"LayerObj",conditionDivObj.eq(i)[0],50,200,function(){

					for(var d=0,dlen=conditionDivObj.length;d<dlen;d++){
						if(!conditionDivObj.eq(d)[0].className.indexOf('item_on')<0)continue;
						conditionDivObj.eq(d).removeClass('item-on');
					}
					$(this).addClass("item-on");
				},function(){
					$(this).removeClass("item-on");
				});
			}
		}
	}

	this.setFloatCondLayerHeight = function(data){
		if(!data || !data.length)return false;
		var titleHeight = this.conditionObj.height();
		for(var i=0,ilen=data.length;i<ilen;i++){
			var thisObj = $("#"+data[i]+"LayerObj");
			thisHeight = thisObj.height();
			if(thisHeight < titleHeight){
				thisObj.css({
					"height" : titleHeight-20,
					"min-height" : titleHeight-20
				});
			}
		}
	}

	this.createSelectCondHtml = function(data){
		var html = ['<div class="item"  data-t="float" data-k="'+data['key']+'"><h3><a href="javascript:void(0);"><i class="more">-</i> '+data['cn']+'</a></h3><ul class="second-list">'];
		for(var i=0,ilen=data['child'].length;i<ilen;i++){
			html.push('<li><label><input value="'+data['key']+"_"+data['child'][i]['id']+"_"+data['child'][i]['cond']+'" data-t="cond" type="checkbox"/> '+data['child'][i]['cond']+'<em>('+data['child'][i]['num']+')</em></label></li>');
		}

		html.push('</ul></div>');

		return html.join("");
	}

	this.createSearchCondHtml = function(data){
		var html = new Array();
		var floatKey = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			switch (data[i]['type']){
				case "float" : floatKey.push(data[i]['key']);html.push(this.createFloatCondHtml(data[i],i));this.createFloatCondLayerHtml(data[i]);break;
				case "select" : html.push(this.createSelectCondHtml(data[i]));break;
			}
		}

		this.conditionObj.html(html.join(""));
		this.setFloatCondLayerHeight(floatKey);
		this.createFloatCondMouseEvent(floatKey);
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
		var html = ['<div class="tags-wrap">'];
		for(var i=0,ilen=data.length;i<ilen;i++){
			html.push('<span class="tags">'+data[i]+'</span>');
		}

		html.push("</div>");
		return html.join("");
	}

	this.createSearchListHtml = function(data){
		var html = new Array();
		for(var i=0,ilen=data.length;i<ilen;i++){
			html.push('<div class="item-info'+(i%2 ? " hover" : "")+'">'+this.createSearchListLabelHtml(data[i]['label'])+'<h3><a href="javascript:void(0);" data-t="detail" data-i="'+data[i]['id']+'" class="fontblue">'+data[i]['title']+'</a></h3><p class="text">'+data[i]['content']+'...</p></div>');
		}

		this.searchListObj.append(html);
	}

	this.collecCondition = function(){
		if(this.checkCollecAjax)return false;
		var self = this;
		this.checkCollecAjax = true;
		$.ajax({
			url : "/xiaoqiang/php/collection.php",
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
		var thisV = obj.value;
		if(obj.checked){
			this.searchData['keyword'].push(thisV);
		}else{
			var temData = new Array();
			for(var i=0,ilen=this.searchData['keyword'].length;i<ilen;i++){
				if(this.searchData['keyword'][i] == thisV)continue;
				temData.push(this.searchData['keyword'][i]);
			}
			this.searchData['keyword'] = temData;
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

	this.clearSearchRequestData = function(){
		this.searchPage = 1;
		this.checkSearchListAjax = false;
		this.searchListObj.html("");
	}

	this.createEvent = function(){
		var self = this;
		this.searchListObj.delegate("a","click",function(){
			var thisT = $(this).attr("data-t");
			if(thisT!="detail")return false;
			var thisId = $(this).attr("data-i");
			window.location.href = "/xiaoqiang/detail.html?case_id="+thisId+"&keyword="+self.searchData['keyword'];
		});

		this.collectionObj.click(function(){
			self.collecCondition();
		});

		this.conditionObj.parent().delegate("input","click",function(){
			self.selectCondition(this);
		});

		window.onscroll = function(){
			if(self.checkSearchListAjax)return false;
			var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			var searchListHeight = self.searchListObj.height();

			if(self.clientHeight + scrollTop > searchListHeight*3/4){
				++self.searchPage;
				self.getSearchListData();
			}

		};
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