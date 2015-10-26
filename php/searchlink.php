<?php
	$ajaxData = array(
		'code' => 0,//返回结果编码，0为成功，其他为失败
		'msg' => "成功",//返回结果内容，成功或者其他错误信息
		'info' => array("测试数据","返回搜素联想查询","周天写代码号累啊","苹果的中英文切换很烂"),//联想查询结果，数组
		'searchTime' => $_POST['searchTime']//这个前端传什么，后段就返回什么，用于前端验证的
		);

	print(json_encode($ajaxData));
?>