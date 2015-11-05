<?php
	$ajaxData = array(
		'code' => 0,//返回结果编码，0为成功，其他为失败
		'msg' => "成功",//返回结果内容，成功或者其他错误信息
		'info' => array(//查询结果数据，cond是查询后的条件 count是查询出来的结果条目 searchList是查询出的列表数据
			'cond' => array(//数组中每个子元素代表一个大的条件类型
					array(
						'key'=>"reason",//条件的key 就是你当初网站上的那个查询的get里面的key
						'type'=>"float",//这个案由和法院是float其他的是select 因为案由和法院条件是谈层弹出的，其他的是收缩表现的。
						'cn'=>"案由",//条件中文名称
						'child'=>array(//案由的数组内容和法院的是不一样的，这个要注意 数组中每个子元素都是一个查询条件
							array('id'=>"123",'cond'=>"我是一号测试",'num'=>3000
							),//id就是查询的时候给后台的值 cond是中文敏刚才 num是有多少条数据
							array('id'=>"124",'cond'=>"我是二号测试",'num'=>3000),
							array('id'=>"125",'cond'=>"我是三号测试",'num'=>3000),
							array('id'=>"126",'cond'=>"我是四号测试",'num'=>3000),
							array('id'=>"127",'cond'=>"我是五号测试",'num'=>3000),
							array('id'=>"128",'cond'=>"我是六号测试",'num'=>3000),
							array('id'=>"129",'cond'=>"我是懒得写了",'num'=>3000)
						)
					),
					array(
						'key'=>"court",//条件的key 就是你当初网站上的那个查询的get里面的key
						'type'=>"float",//这个案由和法院是float其他的是select 因为案由和法院条件是谈层弹出的，其他的是收缩表现的。
						'cn'=>"审理法院",//条件中文名称
						'child'=>array(//案由的数组内容和法院的是不一样的，这个要注意 数组中每个子元素都是一个查询条件
							array(
								'id'=>"126668",'cond'=>"山西省",'num'=>3000,//省份，这个和案由数据结构不一样，请注意
								'child'=>array(//当前省份里面的查询条件
									array('id'=>"130",'cond'=>"北京市人民法院",'num'=>3000),//id就是查询的时候给后台的值 cond是中文敏刚才 num是有多少条数据
									array('id'=>"131",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"132",'cond'=>"东直门",'num'=>3000),
									array('id'=>"133",'cond'=>"东直门",'num'=>3000),
									array('id'=>"134",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"135",'cond'=>"东直门",'num'=>3000),
									array('id'=>"136",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"137",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"138",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"139",'cond'=>"东直门",'num'=>3000),
									array('id'=>"140",'cond'=>"东直门",'num'=>3000),
									array('id'=>"141",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"142",'cond'=>"东直门",'num'=>3000),
									array('id'=>"143",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"144",'cond'=>"北京市人民法院",'num'=>3000),
									array('id'=>"145",'cond'=>"北京市人民法院",'num'=>3000)
								),
							)
						)
					),
					array(
						'key'=>"judgement",//条件的key 就是你当初网站上的那个查询的get里面的key
						'type'=>"select",//这个案由和法院是float其他的是select 因为案由和法院条件是谈层弹出的，其他的是收缩表现的。
						'cn'=>"案件性质",//条件中文名称
						'child'=>array(//这个和案由的一样
							array('id'=>"144",'cond'=>"判决",'num'=>3000),//id就是查询的时候给后台的值 cond是中文敏刚才 num是有多少条数据
							array('id'=>"155",'cond'=>"裁定",'num'=>3000),
							array('id'=>"166",'cond'=>"其他",'num'=>3000)
						)
					),
					array(
						'key'=>"case",
						'type'=>"select",
						'cn'=>"案件类型",
						'child'=>array(
							array('id'=>"456",'cond'=>"民事",'num'=>3000),
							array('id'=>"345",'cond'=>"刑事",'num'=>3000),
							array('id'=>"678",'cond'=>"行政",'num'=>3000),
							array('id'=>"348",'cond'=>"执行",'num'=>3000),
							array('id'=>"1201",'cond'=>"其他",'num'=>3000)
						)
					),
					array(
						'key'=>"round",
						'type'=>"select",
						'cn'=>"审理程序",
						'child'=>array(
							array('id'=>"2234",'cond'=>"一审",'num'=>3000),
							array('id'=>"3234",'cond'=>"二审",'num'=>3000),
							array('id'=>"4234",'cond'=>"再审",'num'=>3000),
							array('id'=>"5234",'cond'=>"其他",'num'=>3000)
						)
					),
					array(
						'key'=>"year",
						'type'=>"select",
						'cn'=>"审判年份",
						'child'=>array(
							array('id'=>"2015",'cond'=>"2015",'num'=>3000),
							array('id'=>"2014",'cond'=>"2014",'num'=>3000),
							array('id'=>"2013",'cond'=>"2013",'num'=>3000),
							array('id'=>"2012",'cond'=>"2012",'num'=>3000),
							array('id'=>"2011",'cond'=>"2011",'num'=>1)
						)
					)
				),
			'count' => 280,//查询结果总数
			'searchList' => array(
				'page' => $_POST['page'],//这个是前端给传的当前页数，第一页是1，前端传什么返回什么，用于前端页数验证。
				'count' => 20,//这个是下方list里面有多少条数据，是每页查询条数，不是所有的总数，和上级的count是不一样的，前端会给后端传一个每页最大的条数（searchNum），每页最多返回searchNum条数据，也就是count的值不会大于searchNum
				'list' => array(//这个是查询的结果，每天数据在页面上展示一跳
					array("id"=>"3330",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),//id 是跳转到详情页面用到的id title是页面展示的title content是页面展示的部分内容 label是页面上展示的标签 type是类型 公报还是知道性质的 add是地址 num是文案编号 date是日期 ctype是下方显示的类型 presname是审判长名字 这里的字段名称都可以修改，后期你们这边觉得不妥按照你们的来，我修改起来很方便的。
					array("id"=>"2222",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"3333",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"4444",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"5555",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"6666",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"7777",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"8888",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"9999",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"0000",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"32423",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"67567",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"678",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),
					array("id"=>"56756",'title'=>"我是测试数据","content"=>"我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。我就测试一下，我不说话，我就看看。","label"=>array("民事","一审","判决"),"type"=>"公报案例","add"=>"河北高级人民法院","num"=>"(2015)豫法民提字第000083号","date"=>"2015-10-08","ctype"=>"劳动合同纠纷","presname"=>"柴永"),

				)
			)
		),
		'searchTime' => $_POST['searchTime']//这个前端传什么，后段就返回什么，用于前端验证的
	);

	print(json_encode($ajaxData));
?>