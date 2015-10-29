$(function(){
	this.createDomObj = function(){
		this.navObj = $("#navObj");
	}

	this.getNavObjOffSet = function(){
		var thisOffSet = this.navObj.offset();
		this.navTop = thisOffSet.top;
	}

	this.createEvent = function(){
		var self = this;
		window.onscroll = function(){
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if(scrollTop > self.navTop){
				self.navObj.children('dl').addClass("top-fixed");
			}else{
				self.navObj.children('dl').removeClass("top-fixed");
			}
		}
	}

	this.init = function(){
		this.createDomObj();
		this.getNavObjOffSet();
		this.createEvent();
	}

	this.init();
});