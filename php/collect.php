<?php
//收藏内容接口
//这个是搜索出数据的收藏，和条件收藏不一样，前端会给后端传收藏文案的id，多个用逗号隔开，后端也要支持多个文案的收藏，说不准后期会用到
	$ajaxData = array(
		'code' => 0,//返回结果编码，0为成功，其他为失败
		'msg' => "成功",//返回结果内容，成功或者其他错误信息
	);

	print(json_encode($ajaxData));
?>