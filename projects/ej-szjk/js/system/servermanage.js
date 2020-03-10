
function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px;" onclick="Edit('+item.xh+')">编辑</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px;" onclick="Delete('+item.xh+','+item.videoid+')">删除</a>';
	if(serverlevel == "0"){
		//if(item.level == "0")
		//	str="--";
		if(item.level == "1")
			str+='<a href="javascript:;" title="注册" style="margin-right:5px" onclick="Search('+item.videoid+','+item.xh+')">注册/查询</a>';
	}
	if(serverlevel == "1"){
		if(item.level == "0")
			str+='<a href="javascript:;" title="注册" style="margin-right:5px" onclick="Send('+item.videoid+')">共享</a>';
		if(item.level == "1" && item.cj != "0")
			str+='<a href="javascript:;" title="注册" style="margin-right:5px" onclick="Send('+item.videoid+')">注册/查询</a>';
		//if(item.level == "1")
		//	str="--";
	}
	return str;
}

function returnSyn(item){
	var str='<input name="syn" syn="'+item.videoid+'" type="checkbox" class="u-che" />';
	return str;
}

$(function(){
	$(".m-side-subnav li[title=right]").each(function(){
		var name = $(this).attr("name");
			if(name == "上下级平台"){
					 $(this).addClass("active");
			}
	});
	
	result = new AjaxResult2Table({
		resultTableId : "tab",
		pagerId : "pager",
		searchUrl : basePath+"video/getserverpage.htm"
	});


result.search({},null,function(){
});
			

$("#addBtn").click(function(){
	
	if(Experimental()){
	CallWebMethod(
			basePath+"video/addserver.htm",
			{
				isnew:1,
				//server_xh:$("#addserver_xh").val(),
				server_ip:$("#addserver_ip").val(),
				server_port:$("#addserver_port").val(),
				server_user:$("#addserver_user").val(),
				server_pwd:$("#addserver_pwd").val(),
				cj:$("#addcj").val(),
				server_realm:$("#addrealm").val(),
				server_id:$("#addserver_id").val(),
				level:$("#addlevel").val(),
				heardbeat:$("#addheadbeat").val(),
				expires:$("#addexpires").val(),
				timeout:$("#addtimeout").val(),
				locallevel:serverlevel
			},
			function(data)
			{
				if(data.flag==true){
					alert("添加成功");
					$("#addServerDiv").dialog("close");

					result.search({server_ip:$("#server_ip").val(),cj:$("#cj").val()},null,function(){
					});
				}else{
					if(data.remark != "" && data.remark != null)
						alert(data.remark);
					else
						alert("添加失败");
				}
			}
		);
	}
});

$("#editBtn").click(function(){
	
	if(Experimental()){
	CallWebMethod(
			basePath+"video/addserver.htm",
			{
				xh:$("#addxh").val(),
				server_ip:$("#addserver_ip").val(),
				server_port:$("#addserver_port").val(),
				server_user:$("#addserver_user").val(),
				server_pwd:$("#addserver_pwd").val(),
				cj:$("#addcj").val(),
				server_realm:$("#addrealm").val(),
				server_id:$("#addserver_id").val(),
				level:$("#addlevel").val(),
				heardbeat:$("#addheadbeat").val(),
				expires:$("#addexpires").val(),
				timeout:$("#addtimeout").val(),
				locallevel:serverlevel
			},
			function(data)
			{
				if(data.flag==true){
					alert("编辑成功");
					$("#addServerDiv").dialog("close");

					result.search({server_ip:$("#server_ip").val(),cj:$("#cj").val()},null,function(){
					});
				}else{
					alert("编辑失败!"+data.remark);
				}
			}
		);
	}
});


			$("#cancelBtn").on("click",function(){
				$("#addServerDiv").dialog("close");
			});
			$("#devcancelBtn").on("click",function(){
				$("#sipdevDiv").dialog("close");
			});
			$("#devaddBtn").on("click",function(){
				//选中设备
				var devids = getDevIds();
				//同步设备
				if(selserver.cj == 0 || selserver.cj == "0"){
					CallWebMethod(
							basePath+"redis/syndevredisfromlow.htm",
							{
								server_dev_id:$("#server_dev_id").val(),
								devids:devids,
								servercj:selserver.cj,
								dev_ip:selserver.server_ip,
								dev_port:selserver.server_port,
								dev_user:selserver.server_user,
								dev_password:selserver.server_pwd
							},
							function(data)
							{
								if(data.flag == 1 || data.flag == "1"){
									alert("同步成功");
									$("#sipdevDiv").dialog("close");
								}else{
									alert("同步失败");
								}
								if(data.remark != "" && data.remark != null){
									alert(data.remark);
								}
							}
						);
				}else{

					CallWebMethod(
							basePath+"redis/syndevredis.htm",
							{
								server_dev_id:$("#server_dev_id").val(),
								devids:devids
							},
							function(data)
							{
								if(data.flag == 1 || data.flag == "1"){
									alert("同步成功");
									$("#sipdevDiv").dialog("close");
								}else{
									alert("同步失败");
								}
								if(data.remark != "" && data.remark != null){
									alert(data.remark);
								}
							}
						);
				}
			});
			
			$("#addlevel").change(function(){
				if($("#addlevel").val() == 0)
					$(".leveldiv").css("display","inline-block");
				if($("#addlevel").val() == 1)
					$(".leveldiv").css("display","none");
			});
			
			//搜索按钮
			$("#search").click(function(){
				result.search({server_ip:$("#server_ip").val(),cj:$("#cj").val()},null,function(){
				});
			});
			
			$("#synall").click(function(){
				if($("#synall").attr("checked")=="checked"){
				$("#sipdevtab input[name=syn]").each(function(){
					if($(this).attr("checked")!="checked")
						$(this).click();
				});
				}else{
					$("#sipdevtab input[name=syn]").each(function(){
						if($(this).attr("checked")=="checked")
							$(this).click();
					});
				}
			});
			//设备厂商getdevcjlist
			CallWebMethod(
					basePath+"video/getdevcjlist.htm",
						{
						},
						function(data)
						{
							var htm = '<option value="">所有厂商</option>';
							var htm2 = '';
							for(var i=0;i<data.list.length;i++){
								htm+='<option value="'+data.list[i].code+'">'+data.list[i].name+'</option>';
								htm2+='<option value="'+data.list[i].code+'">'+data.list[i].name+'</option>';
							}
							$("#cj").html(htm);
							$("#addcj").html(htm2);
						}
					);
			
			
});


function Delete(val,val2){
	if(confirm("确定要删除？")){
		CallWebMethod(
				basePath+"video/deleteserver.htm",
				{
					xh:val,
					videoid:val2
				},
				function(data)
				{if(data.flag == true){
					alert("删除成功");

					result.search({server_ip:$("#server_ip").val(),cj:$("#cj").val()},null,function(){
					});
				}else
					alert("删除失败");
				}
			);
		}
}

function Add(){
	$(".leveldiv").css("display","inline-block");
	$("#addxh").val("");
	$("#addserver_ip").val("");
	$("#addserver_port").val("");
	$("#addserver_user").val("");
	$("#addserver_pwd").val("");
	$("#addcj").val("");
	$("#addserver_id").val("");
	$("#addrealm").val("");
	$("#addlevel").val("");
	$("#addheadbeat").val("");
	$("#addtimeout").val("");
	$("#addexpires").val("");

	$("#addlevel").html('<option value="0">上级</option><option value="1">下级</option>');
	
	var	title="新增";
		$("#addBtn").css("display","inline-block");
		$("#editBtn").css("display","none");

	var $divHeight=$("#addServerDiv").height()>500?500:"auto";
	$("#addServerDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : title,
		close: function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}

function Edit(val){
	var server=result.detailInfo(val);
	$("#addxh").val(server.xh);
	$("#addserver_ip").val(server.server_ip);
	$("#addserver_port").val(server.server_port);
	$("#addserver_user").val(server.server_user);
	$("#addserver_pwd").val(server.server_pwd);
	$("#addcj").val(server.cj);
	$("#addserver_id").val(server.server_id);
	$("#addrealm").val(server.server_realm);
	$("#addlevel").val(server.level);
	$("#addheadbeat").val(server.heardbeat);
	$("#addtimeout").val(server.timeout);
	$("#addexpires").val(server.expires);

	if($("#addlevel").val() == 0){
		$(".leveldiv").css("display","inline-block");
		$("#addlevel").html('<option value="0">上级</option>');
	}
	if($("#addlevel").val() == 1){
		$(".leveldiv").css("display","none");
		$("#addlevel").html('<option value="1">下级</option>');
	}
	
	var	title="编辑";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","inline-block");

	var $divHeight=$("#addServerDiv").height()>500?500:"auto";
	$("#addServerDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : title,
		close: function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}

var redisresult = null;
var interval = null;
var selserver = null;
function Search(val,xh){
	var server=result.detailInfo(xh);
	if(server.cj == 0){
		if($("#synall").attr("checked")=="checked")
			$("#synall").click();
		$("#server_dev_id").val(val);
		$("#loadDiv").dialog({
			resizable : false,
			modal : true,
			width : 190,
			height : 120,
			title : "",
			close: function(){
				$(".pop-iframe").remove();
			}
		});
		CallWebMethod(
				basePath+"redis/infoexchger.htm",
				{
					lowplat_ip:server.server_ip,
					lowplat_port:server.server_port,
					lowplat_id:server.videoid,
					lowplat_pwd:server.server_pwd
				},
				function(data)
				{
					if(data.status == 4 || data.status == '4'){
						$("#loadDiv").dialog("close");
						//任务完成,获取平台对应点位设备列表
							redisresult = new AjaxResult2Table({
								resultTableId : "sipdevtab",
								pagerId : "sipdevpager",
								searchUrl : basePath+"redis/getdevlistbysip.htm"
							});
						
						
							redisresult.search({devid:val},null,function(){
							});
							
							//选择的厂家
							selserver = server;
							//弹出列表窗口
							var $divHeight=$("#sipdevDiv").height()>500?500:"auto";
							$("#sipdevDiv").dialog({
								resizable : false,
								modal : true,
								width : 850,
								height : $divHeight,
								title : "同步列表",
								close: function(){
									$(".pop-iframe").remove();
								}
							});
							$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
							$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
						//页面选择设备点位
						//同步选中的点位，点位存入mysql，并将videoid同步至redis
					}else{
						$("#loadDiv").dialog("close");
						if(data.status == 4 || data.status == '4')
							alert("注册/查询失败,错误："+data.error_code+"--"+data.error_str);
						else
							alert("注册/查询失败");
					}
				});
	}else{
		
	if($("#synall").attr("checked")=="checked")
		$("#synall").click();
	$("#server_dev_id").val(val);
	CallWebMethod(
			basePath+"redis/registersearchserver.htm",
			{
				devid:val
			},
			function(data)
			{
				var status = "0";
				var count = 0;
				//返回index
				if(data.index != null && data.index != "" ){
					$("#loadDiv").dialog({
						resizable : false,
						modal : true,
						width : 190,
						height : 120,
						title : "",
						close: function(){
							$(".pop-iframe").remove();
						}
					});
					$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
					$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
						interval = setInterval(function(){
							count++;
							CallWebMethod(
									basePath+"redis/getsipstatus.htm",
									{
										index:data.index
									},
									function(data2)
									{
										status = data2.status;
										if(parseInt(status)==4){
											$("#loadDiv").dialog("close");
											clearInterval(interval);
											//任务完成,获取平台对应点位设备列表
												redisresult = new AjaxResult2Table({
													resultTableId : "sipdevtab",
													pagerId : "sipdevpager",
													searchUrl : basePath+"redis/getdevlistbysip.htm"
												});
											
											
												redisresult.search({devid:val},null,function(){
												});
												//弹出列表窗口
												var $divHeight=$("#sipdevDiv").height()>500?500:"auto";
												$("#sipdevDiv").dialog({
													resizable : false,
													modal : true,
													width : 850,
													height : $divHeight,
													title : "同步列表",
													close: function(){
														$(".pop-iframe").remove();
													}
												});
												$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
												$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
											//页面选择设备点位
											//同步选中的点位，点位存入mysql，并将videoid同步至redis
											
										}
										if( parseInt(status)>4){
											$("#loadDiv").dialog("close");
											alert("注册/查询失败");
											clearInterval(interval);
										}
										if( count>30){
											$("#loadDiv").dialog("close");
											alert("注册/查询超时");
											clearInterval(interval);
										}
									}
								);
						},1000);
					
				}
			}
		);

	}
}

function Send(id){
	$("#select_serverid").val(id);
	
	$("#treeSelected").html("");
	
	CallWebMethod(
			basePath+"video/getvideonodeserver.htm",
			{
				serverid:id
			},
			function(data)
			{
				var list = data.list;
				for(var i=0;i<list.length;i++){
					$("#treeSelected").append("<li id='"+list[i].videoid+"' name='vnode' style='border-bottom:1px solid #1f1f1f;height:28px;' onclick='selectedNode("+list[i].videoid+")' ondblclick='removeSelectedNode("+list[i].videoid+")'><span style='padding-left:8px'>"+list[i].videonodename+"</span></li>");
				}
			}
		);
	
	$("#selectNodeDiv").dialog({
		resizable : false,
		modal : true,
		width : 650,
		height : 800,
		title : "选择点位",
		close: function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}

function getsipstatus(index){
	CallWebMethod(
			basePath+"video/getsipstatus.htm",
			{
				index:data.index
			},
			function(data2)
			{
				status = data2.status;
			}
		);
}

function getDevIds(){
	var devids = "";
	$("#sipdevtab input[name=syn]").each(function(){
		if($(this).attr("checked")=="checked")
			devids+=$(this).attr("syn")+",";
	});
	devids=devids.substring(0, devids.length-1);
	return devids;
}


function Experimental(){
	var flag=true;
	if($("#addserver_ip").val()==null || $("#addserver_ip").val()==''){
		alert("IP为空");
		flag = false;
	}
	if($("#addserver_port").val()==null || $("#addserver_port").val()==''){
		alert("端口号为空");
		flag = false;
	}	
	if($("#addserver_user").val()==null || $("#adddev_ip").val()==''){
		alert("用户名为空");
		flag = false;
	}
	if($("#addserver_pwd").val()==null || $("#addserver_pwd").val()==''){
		alert("密码为空");
		flag = false;
	}	
	if($("#addrealm").val()==null || $("#addrealm").val()==''){
		alert("域为空");
		flag = false;
	}
	var realmlem = $("#addrealm").val();
	if(realmlem.length>10){
		alert("域长度请少于10位数字");
		flag = false;
	}
	if($("#addserver_ip").val()==null || $("#addserver_ip").val()==''){
		alert("ID为空");
		flag = false;
	}
	return flag;
}


$(function(){
	var treeObj = $("#vnodetree");

	var p = ($("#tbSearch").val() == "点位查找" ? "" : $("#tbSearch").val());
	
	//获取点位树图
	CallWebMethod(
		basePath+"video/getvideonodelist.htm",
		{
			param:p
		},
		function(data)
		{
			var zNodes = data.treenode;
			$.fn.zTree.init(treeObj, setting, zNodes);
			zTree_Menu = $.fn.zTree.getZTreeObj("vnodetree");			
		}
	);	
	
	$("#btSearch").click(function(){
		var param = $("#tbSearch").val();
		CallWebMethod(
				basePath+"video/getvideonodelist.htm",
				{
					param:param
				},
				function(data)
				{
					var zNodes = data.treenode;
					$.fn.zTree.init(treeObj, setting, zNodes);
					zTree_Menu = $.fn.zTree.getZTreeObj("vnodetree");
					

					//$.fn.zTree.init($("#treeDemo"), setting, zNodes);
				}
			);
	});
	
	$("#addNodeBtn").click(function(){
		addSelectedList();
	});

	$("#deleteNodeBtn").click(function(){
		removeSelectedList();
	});
	
	$("#confirmBtn").click(function(){
		var selected = "";
		$("#treeSelected li[name=vnode]").each(function(){
			selected += $(this).attr("id")+",";
		});
		selected = selected.substring(0, selected.length-1);
		
		CallWebMethod(
				basePath+"video/setvideonodeserver.htm",
				{
					serverid:$("#select_serverid").val(),
					videoids:selected
				},
				function(data)
				{
					if(data.flag == true)
						alert("操作成功");
					else
						alert("操作失败");
					$("#selectNodeDiv").dialog("close");
				}
			);
	});
	
	$("#treecancelBtn").click(function(){
		$("#selectNodeDiv").dialog("close");
	});
});

var remove_node_id='';
function addSelectedList(){
	var flag=0;
	$("#treeSelected li[name=vnode]").each(function(){
		if($(this).attr("id") == select_node_id){
			flag=1;
		}
	});
	if(flag == 1)
		alert("该点位已被选择");
	else
		$("#treeSelected").append("<li id='"+select_node_id+"' name='vnode' style='border-bottom:1px solid #1f1f1f;height:28px;' onclick='selectedNode("+select_node_id+")' ondblclick='removeSelectedNode("+select_node_id+")'><span style='padding-left:8px'>"+select_node_name+"</span></li>");
}

function removeSelectedList(){
	
	$("#treeSelected li[name=vnode]").each(function(){
		if($(this).attr("id") == remove_node_id){
			$(this).remove();
		}
	});
}

function selectedNode(nodeid){
	remove_node_id = nodeid;
}

function removeSelectedNode(nodeid){
	remove_node_id = nodeid;
	removeSelectedList();
}

var curMenu = null, zTree_Menu = null;
var setting = {
	view : {
		/* showLine : false,
		showIcon : false, */
		selectedMulti : false,
		dblClickExpand : true
		/* addDiyDom : addDiyDom */
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onClick: onClick,
		onDblClick : onDblClick
	}
};

var select_node_id='';
var select_node_name='';
function onClick(event, treeId, treeNode, clickFlag){
	select_node_id=treeNode.id;
	select_node_name=treeNode.name;
}

function onDblClick(event, treeId, treeNode, clickFlag){
	if(!isNaN(treeNode.id)){
		select_node_id=treeNode.id;
		select_node_name=treeNode.name;
		addSelectedList();
	}
}