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
		this.goTop = $("#goTop");
		this.loginObj = $("#loginObj");
		this.regObj = $("#regObj");
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
		if(searchCon === "")return false;
		var formObj = $('<form action="/xiaoqiang/search.html" target="_self" method="get"></form>');
		var html = ['<input type="hidden" name="type" value="'+this.searchType+'">'];
		html.push('<input type="hidden" name="keyword" value="'+encodeURIComponent(searchCon)+'">');
		formObj.html(html.join(","));
		$("body").append(formObj);
		formObj.submit();
	}

	this.getSearchLink = function(){
		var nowTime = new Date().getTime();
		if(nowTime-this.getLinkPrevTime < this.getLinkWatTime && this.getLinkAjaxObj){
			clearTimeout(this.getLinkAjaxObj);
			this.getLinkAjaxObj = "";
		}

		var self = this;

		self.getLinkPrevTime = nowTime;

		var searchVal = this.searchConObj.val();

		if(searchVal === ""){
			this.clearSearchTipsObj();
			return false;
		}

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
				if(data.code!==0)return false;
				if(data.searchTime != self.getLinkPrevTime)return false;
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
			this.clearSearchTipsObj();
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
		if(this.getLinkAjaxObj)clearTimeout(this.getLinkAjaxObj);
	}

	this.createLoginObj = function(){
		var loginHtml = '<div class="loginbox" style="display:none"><p class="tit"><a href="javascript:void(0);" id="tabLog" class="tab on">登录</a><a href="javascript:void(0);" id="tabReg" class="tab">注册</a><a href="javascript:void(0);" class="close" id="closeLog">×</a></p><div class="con"><ul class="list" style="display:;" id="logConObj"><li><span class="w1">用户名：</span><input type="text" class="w2" id="userObj"/></li><li><span class="w1">密码：</span><input type="password" class="w2" id="pwdObj"/><a href="/忘记密码" class="font12 fontgray">忘记密码？</a><p class="font12 fontred mleft tips" id="logerrorObj"></p></li><li><a href="javascript:void(0);" class="mleft btn" id="subLogin">登录</a></li></ul><ul class="list" style="display:none;" id="regConObj"><li><span class="w1">用户名：</span><input type="text" class="w2" id="regUserObj"/><p class="font12 fontgray mleft tips">3-16个字符</p></li><li><span class="w1">密码：</span><input type="password" class="w2" id="regPwdObj"/></li><li><span class="w1">确认密码：</span><input type="password" class="w2" id="regRepwdObj"/><p class="font12 fontred mleft tips" id="regErrorObj"></p></li><li><a href="javascript:void(0);" class="mleft btn" id="subReg">注册</a></li></ul></div></div>';
		this.loginObj = $(loginHtml);
		$("body").append(this.loginObj);
		$("#userObj,#pwdObj,#regUserObj,#regPwdObj,#regRepwdObj").focus(function(){
			$(this).addClass("focus");
		});
		$("#userObj,#pwdObj,#regUserObj,#regPwdObj,#regRepwdObj").blur(function(){
			$(this).removeClass("focus");
		});

		$("#closeLog").click(function(){
			this.loginObj.loadDialog("close");
		});

		$("#tabLog").click(function(){
			$(this).siblings().removeClass("on");
			$(this).addClass("on");
			$("#logConObj").show();
			$("#regConObj").hide();
		});
		$("#tabReg").click(function(){
			$(this).siblings().removeClass("on");
			$(this).addClass("on");
			$("#logConObj").hide();
			$("#regConObj").show();
		});
		var self = this;
		$("#subLogin").click(function(){
			self.loginAjax();
		});
		$("#subReg").click(function(){
			self.regAjax();
		});
	}

	this.loginAjax = function(){
		var self = this;
		var userVal = $("#userObj").val();
		var pwdVal = $("#pwdObj").val();
		$.ajax({
			url : "/xiaoqiang/php/login.php",
			data : "user="+userVal+"&pwd="+pwdVal,
			type : "post",
			dataType : "json",
			success : function(msg){
				if(msg.code === 0){
					self.loginObj.loadDialog("close");
					alert("登陆成功");
				}else{
					$("#logerrorObj").html(msg.msg);
				}
			}
		});
	}

	this.regAjax = function(){
		var self = this;
		var userVal = $("#regUserObj").val();
		var pwdVal = $("#regPwdObj").val();
		var rePwdVal = $("#regRepwdObj").val();
		if(userVal.length < 3 || userVal.length >16){
			alert("用户名长度为3-16个字符");
			return false;
		}else if(userVal==="" || pwdVal==="" || rePwdVal===""){
			alert("用户名和密码不能为空");
			return false;
		}else if(rePwdVal != pwdVal){
			alert("两次密码输入不一样");
			return false;
		}else if(pwdVal.length<6){
			alert("密码长度至少是6位");
			return false;
		}
		$.ajax({
			url : "/xiaoqiang/php/reg.php",
			data : "user="+userVal+"&pwd="+pwdVal,
			type : "post",
			dataType : "json",
			success : function(msg){
				if(msg.code === 0){
					self.loginObj.loadDialog("close");
					alert("注册成功");
				}else{
					$("#regErrorObj").html(msg.msg);
				}
			}
		});
	}

	this.showLoginObj = function(){
		if(this.loginObj)this.createLoginObj();
		this.loginObj.loadDialog();
	}

	this.documentEvent = function(){
		var self = this;
		this.searchChildObj.children("li").click(function(){
			self.selectSearchType(this);
		});

		this.searchObj.click(function(){
			self.subSearch();
		});

		this.searchConObj.keyup(function(e){
			e = e ? e : window.event;
			if(e.keyCode == 13){
				self.subSearch();
				return false;
			}
			self.getSearchLink();
		});

		this.searchTipsObj.delegate("li","click",function(){
			self.linkSearch(this);
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
		this.searchChildObj.delegate("li","mouseenter",function(){
			$(this).addClass('on');
		});
		this.searchChildObj.delegate("li","mouseleave",function(){
			$(this).removeClass('on');
		});
		this.searchTipsObj.delegate("li","mouseenter",function(){
			$(this).addClass('on');
		});
		this.searchTipsObj.delegate("li","mouseleave",function(){
			$(this).removeClass('on');
		});

		this.loginObj.click(function(){
			self.showLoginObj();
		});

		this.regObj.click(function(){
			alert("现在这个链接是假的，请给我真的连接");
			window.location.href = "/注册";
		});

		this.goTop.click(function(){
			window.scrollTo(0,0)
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