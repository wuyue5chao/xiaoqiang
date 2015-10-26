/** 
    * @description 事件委托验证;
    * @param e obj 事件对象
    * @param tarName string 事件对应的标签名称
*/ 
$.fn.checkEvent=function(e,tarName){
    var e = e || window.event;
    var target = e.srcElement || e.target;
    //如果当前标签不是指定标签，那么就去验证上级标签，如果知道body不是那么返回false
    var checkParent=function(target){
        var parentObj=$(target).parent();
        if(!parentObj[0]){
            return false;
        }else if(parentObj[0].tagName==tarName){
            return parentObj[0];
        }else if(parentObj[0].tagName=="BODY"){
            return false;
        }else{
            return checkParent(parentObj[0]);
        }
    }
    if(target.tagName!=tarName){
        return checkParent(target);
    }else{
        return target;
    }
}
