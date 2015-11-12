<?php
//登陆接口
	$ajaxData = array(
		'code' => 0,//返回结果编码，0为成功，其他为失败
		'msg' => "登陆成功",//返回结果内容，成功或者其他错误信息
	);

	print(json_encode($ajaxData));
?>