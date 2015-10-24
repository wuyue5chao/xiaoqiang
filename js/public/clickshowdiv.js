//鼠标点击后显示隐藏div
function clickShowDiv(disid,thisobj){
	if(!thisobj) return;
    //获取显隐的回调函数
    var showfun=arguments[2] || "";
    var hidefun=arguments[3] || "";
    //控制点击当前对象的显隐
    this.disobj=document.getElementById(disid);

    this.showdisobj=function(){
        var ishide=o.disobj.style.display;
        if(ishide!="none"){
            o.hidedisobj();
        }else{
            o.disobj.style.display="";
            if(showfun!=""){
                showfun.apply(thisobj,[this.disobj]);
            }
        }
    }
    
    //控制鼠标移出当前对象和显示对象的显隐
    this.checkmousedis=1;

    this.showdisid=function(){
        o.checkmousedis=1;
    }
    this.hidedisid=function(){
        o.checkmousedis=0;
    }

    this.hidedisobj=function(){
        this.disobj.style.display="none";
        if(hidefun!=""){
            hidefun.apply(thisobj,[this.disobj]);
        }
    }
    this.isdisobj=function(){
        if(o.checkmousedis!=1)
        o.hidedisobj();
    }
    //添加当前点击对象和document的时间
    if (window.addEventListener) { 
        thisobj.addEventListener("click",this.showdisobj,false);
        thisobj.addEventListener("mouseover",this.showdisid,false);
        thisobj.addEventListener("mouseout",this.hidedisid,false);
        this.disobj.addEventListener("mouseover",this.showdisid,false);
        this.disobj.addEventListener("mouseout",this.hidedisid,false);
        document.addEventListener("click",this.isdisobj,false);
    }else{
        thisobj.attachEvent("onclick",this.showdisobj);
        thisobj.attachEvent("onmouseover",this.showdisid);
        thisobj.attachEvent("onmouseout",this.hidedisid);
        this.disobj.attachEvent("onmouseover",this.showdisid);
        this.disobj.attachEvent("onmouseout",this.hidedisid);
        document.attachEvent("onclick",this.isdisobj);
    }
    var o=this;
}