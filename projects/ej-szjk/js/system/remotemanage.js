
function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px" onclick="Edit('+item.remote_xh+')">编辑</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px" onclick="Delete('+item.remote_xh+')">删除</a>';
	return str;
}

var serverlist;
$(function(){
	$(".m-side-subnav li[title=right]").each(function(){
		var name = $(this).attr("name");
			if(name == "回放设备"){
					 $(this).addClass("active");
			}
	});
	
	result = new AjaxResult2Table({
		resultTableId : "tab",
		pagerId : "pager",
		searchUrl : basePath+"video/getremotepage.htm"
	});


result.search({},null,function(){
});
			

$("#addBtn").click(function(){
	
	if(Experimental()){
	CallWebMethod(
			basePath+"video/addremote.htm",
			{
				isnew:1,
				//remote_xh:$("#addremote_xh").val(),
				remote_ip:$("#addremote_ip").val(),
				remote_port:$("#addremote_port").val(),
				remote_user:$("#addremote_user").val(),
				remote_pwd:$("#addremote_pwd").val(),
				remote_cj:$("#addremote_cj").val(),
				remote_protocoltype:$("#addremote_protocoltype").val()
			},
			function(data)
			{
				if(data.flag==true){
					alert("添加成功");
					$("#addRemoteDiv").dialog("close");
					result.search({remote_ip:$("#remote_ip").val(),remote_cj:$("#remote_cj").val(),remote_protocoltype:$("#remote_protocoltype").val()},null,function(){
					});
				}else{
					alert("添加失败");
				}
			}
		);
	}
});

$("#editBtn").click(function(){
	
	if(Experimental()){
	CallWebMethod(
			basePath+"video/addremote.htm",
			{
				remote_xh:$("#addremote_xh").val(),
				remote_ip:$("#addremote_ip").val(),
				remote_port:$("#addremote_port").val(),
				remote_user:$("#addremote_user").val(),
				remote_pwd:$("#addremote_pwd").val(),
				remote_cj:$("#addremote_cj").val(),
				remote_protocoltype:$("#addremote_protocoltype").val()
			},
			function(data)
			{
				if(data.flag==true){
					alert("编辑成功");
					$("#addRemoteDiv").dialog("close");
					result.search({remote_ip:$("#remote_ip").val(),remote_cj:$("#remote_cj").val(),remote_protocoltype:$("#remote_protocoltype").val()},null,function(){
					});
				}else{
					alert("编辑失败");
				}
			}
		);
	}
});


			$("#cancelBtn").on("click",function(){
				$("#addRemoteDiv").dialog("close");
			});
			
			//搜索按钮
			$("#search").click(function(){
				result.search({remote_ip:$("#remote_ip").val(),remote_cj:$("#remote_cj").val(),remote_protocoltype:$("#remote_protocoltype").val()},null,function(){
				});
			});
			
			$("#addremote_protocoltype").change(function(){
				if($("#addremote_protocoltype").val() == 1){
					$("#server_select").css("display","inline-block");
					var select = $("#addserver_select").val();
					for(var i=0;i<serverlist.length;i++){
						if(serverlist[i].xh == select){
							$("#addremote_ip").val(serverlist[i].server_ip);
							$("#addremote_port").val(serverlist[i].server_port);
							$("#addremote_user").val(serverlist[i].server_user);
							$("#addremote_pwd").val(serverlist[i].server_pwd);
						}
					}
				}else{
					$("#server_select").css("display","none");
					$("#addremote_ip").val("");
					$("#addremote_port").val("");
					$("#addremote_user").val("");
					$("#addremote_pwd").val("");
				}
			});

			$("#addserver_select").change(function(){
				var select = $("#addserver_select").val();
				for(var i=0;i<serverlist.length;i++){
					if(serverlist[i].xh == select){
						$("#addremote_ip").val(serverlist[i].server_ip);
						$("#addremote_port").val(serverlist[i].server_port);
						$("#addremote_user").val(serverlist[i].server_user);
						$("#addremote_pwd").val(serverlist[i].server_pwd);
					}
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
							$("#remote_cj").html(htm);
							$("#addremote_cj").html(htm2);
						}
					);
			//上下级
			CallWebMethod(
					basePath+"video/getserverpage.htm",
						{
						},
						function(data)
						{
							var list = data.result;
							serverlist = data.result;
							var htm = '';
							for(var i=0;i<list.length;i++){
								htm+='<option value="'+list[i].xh+'">'+list[i].cjname+'</option>';
							}
							$("#addserver_select").html(htm);
						}
					);
			
			
});


function Delete(val){
	if(confirm("确定要删除？")){
		CallWebMethod(
				basePath+"video/deleteremote.htm",
				{
					remote_xh:val
				},
				function(data)
				{if(data.flag == true){
					alert("删除成功");
					result.search({remote_ip:$("#remote_ip").val(),remote_cj:$("#remote_cj").val(),remote_protocoltype:$("#remote_protocoltype").val()},null,function(){
					});
				}else
					alert("删除失败");
				}
			);
		}
}

function Add(){
	$("#addremote_xh").val("");
	$("#addremote_ip").val("");
	$("#addremote_port").val("");
	$("#addremote_user").val("");
	$("#addremote_pwd").val("");
	$("#addremote_cj").val();
	$("#addremote_protocoltype").val("");
	
	
	var	title="新增";
		$("#addBtn").css("display","inline-block");
		$("#editBtn").css("display","none");

	var $divHeight=$("#addRemoteDiv").height()>500?500:"auto";
	$("#addRemoteDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : title,
		close : function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}

function Edit(val){
	if($("#addremote_protocoltype").val() == 1){
		
	}else
	$("#server_select").css("display","none");
	var remote=result.detailInfo(val);
	$("#addremote_xh").val(remote.remote_xh);
	$("#addremote_ip").val(remote.remote_ip);
	$("#addremote_port").val(remote.remote_port);
	$("#addremote_user").val(remote.remote_user);
	$("#addremote_pwd").val(remote.remote_pwd);
	$("#addremote_cj").val(remote.remote_cj);
	$("#addremote_protocoltype").val(remote.remote_protocoltype);
	
	
	var	title="编辑";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","inline-block");

	var $divHeight=$("#addRemoteDiv").height()>500?500:"auto";
	$("#addRemoteDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : title,
		close : function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}

function Experimental(){
	var flag=true;
	if($("#addremote_ip").val()==null || $("#addremote_ip").val()==''){
		alert("IP为空");
		flag = false;
	}
	if($("#addremote_port").val()==null || $("#addremote_port").val()==''){
		alert("端口号为空");
		flag = false;
	}	
	if($("#addremote_user").val()==null || $("#adddev_ip").val()==''){
		alert("用户名为空");
		flag = false;
	}
	if($("#addremote_pwd").val()==null || $("#addremote_pwd").val()==''){
		alert("密码为空");
		flag = false;
	}	
	return flag;
}