//鼠标移上后显示div
function mouseShowDiv(disDiv,thisObj){
    //初始化时间
    this.showTime=isNaN(arguments[2])?0 :arguments[2];
    this.hideTime=isNaN(arguments[3])?500 :arguments[3];
    //回调函数
    this.showFun=!arguments[4]?"" : arguments[4];
    this.hideFun=!arguments[5]?"" : arguments[5];
    //初始化参数
    this.showDivId=disDiv;
    this.mouseObj=thisObj;
    
    //showdiv obj
    this.showDivObj=document.getElementById(this.showDivId);
    
    //showDiv显隐
    this.showDiv=function(){
        if(oldShowDivObj.getShowDiv()&&oldShowDivObj.getShowDiv()!=o.showDivId){
            document.getElementById(oldShowDivObj.getShowDiv()).style.display="none";
        }
        oldShowDivObj.setShowDiv(o.showDivId);
        o.showDivObj.style.display="";
        if(o.showFun!=""){
            o.showFun.apply(o.mouseObj);
        }
    }
    this.hideDiv=function(obj){
        o.showDivObj.style.display="none";
        if(o.hideFun!=""){
            o.hideFun.apply(o.mouseObj);
        }
    }

    //showDiv 显隐时间控制
    //时间控制事件记录
    this.showDivTimeEvent;
    this.startTime=0;
    this.endTime=0;
    this.hideDivTimeEvent;

    this.showDivTime=function(){
        this.showDivTimeEvent=setTimeout(o.showDiv,o.showTime);
        var startTimeObj=new Date();
        this.startTime=startTimeObj.getTime();
    }
    this.hideDivTime=function(){
        if(this.showDivTimeEvent){
            var endTimeObj=new Date();
            this.endTime=endTimeObj.getTime();
            if(this.endTime-this.startTime<o.showTime){
                clearTimeout(this.showDivTimeEvent);
            }else{
                o.hideDivTimeEvent=setTimeout(o.hideDiv,o.hideTime);
            }
        }
    }

    this.showDivMouse=function(){
        clearTimeout(o.hideDivTimeEvent);
    }
    this.hideDivMouse=function(){
        o.hideDivTimeEvent=setTimeout(o.hideDiv,o.hideTime);
    }
 
    if (window.addEventListener){ 
        this.mouseObj && this.mouseObj.addEventListener("mouseenter",this.showDivTime,false);
        this.mouseObj && this.mouseObj.addEventListener("mouseleave",this.hideDivTime,false);

        this.showDivObj && this.showDivObj.addEventListener("mouseenter",this.showDivMouse,false);
        this.showDivObj && this.showDivObj.addEventListener("mouseleave",this.hideDivMouse,false);
    }else{
        this.mouseObj && this.mouseObj.attachEvent("mouseenter",this.showDivTime);
        this.mouseObj && this.mouseObj.attachEvent("mouseleave",this.hideDivTime);

        this.showDivObj && this.showDivObj.attachEvent("mouseenter",this.showDivMouse);
        this.showDivObj && this.showDivObj.attachEvent("mouseleave",this.hideDivMouse);
    }

    var o=this;
}
//记录上次显示的obj
function oldShowDiv(){
    this.showDiv;
    this.setShowDiv=function(showDiv){
        this.showDiv=showDiv;
    }
    this.getShowDiv=function(){
        return this.showDiv;
    }
}
var oldShowDivObj=new oldShowDiv();
