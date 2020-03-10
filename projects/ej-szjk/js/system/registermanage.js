
function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px" onclick="Apply('+item.rid+')">审核</a>'
		+'<a href="javascript:;" title="拒绝" style="margin-right:5px" onclick="Refuse('+item.rid+')">拒绝</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px" onclick="Delete('+item.rid+')">删除</a>';
	return str;
}

function returnState(item){
	var str="";
	if(item.state==0) str="审核中";
	if(item.state==1) str="通过";
	if(item.state==2) str="拒绝";
	return str;
}

function Apply(val){
	var user=result.detailInfo(val);
	$("#addrid").val(user.rid);
	$("#addusername").val(user.username);
	$("#addrealname").val(user.realname);
	$("#adduserpwd").val(user.userpwd);
	$("#adduserpwd2").val(user.userpwd);
	$("#addzoneid").val(user.zoneid);
	$("#addrolenum").val(user.rolenum);
	$("#addtel").val(user.tel);
	$("#addemail").val(user.email);
	$("#addpkikey").val(user.card);
	$("#addunitno").val(user.unitno);
	$("#addremark").val(user.remark);
	//$("#addcontrollevel").val(user.controllevel);
	//$("#addvalid").val(user.valid);
	//$("#addcontrolid").val(user.controlid);
	//清空选择
	$("#addvideolist input[name=zone]").each(function(){
		if($(this).attr("checked")=="checked")
			$(this).click();
	});
	
	var $divHeight=$("#addUserDiv").height()>500?500:"auto";
	$("#addUserDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : "审核",
		close : function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}
function applyregisterforuser(){
	var rid = $("#addrid").val();
	var eav = username;
	CallWebMethod(
			basePath+"user/applyregister.htm",
			{
				rid:rid,
				eav:eav
			},
			function(data)
			{
			}
		);
}

function Refuse(val){
	var eav = username;
	CallWebMethod(
			basePath+"user/refuseregister.htm",
			{
				rid:val,
				eav:eav
			},
			function(data)
			{
				if(data.flag == true){
					alert("拒绝成功");
					result.search({},null,function(){
					});
				}else
					alert("拒绝失败");
			}
		);
}

function Delete(val){
	if(confirm("确定要删除？")){
	CallWebMethod(
			basePath+"user/deleteregister.htm",
			{
				rid:val
			},
			function(data)
			{if(data.flag == true){
				alert("删除成功");
				result.search({},null,function(){
				});
			}else
				alert("删除失败");
			}
		);
	}
}

//验证是否为空，格式
function Experimental(val){
	var flag=true;
	if($("#addusername").val()==null || $("#addusername").val()==''){
		alert("用户名为空");
		flag = false;
	}
	if($("#addrealname").val()==null || $("#addrealname").val()==''){
		alert("用户姓名为空");
		flag = false;
	}	
	if(val==1){
		if($("#adduserpwd").val()==null || $("#adduserpwd").val()==''){
			alert("密码为空");
			flag = false;
		}
			
	}
	if($("#adduserpwd").val()!=null && $("#adduserpwd").val()!='' && $("#adduserpwd").val()!= $("#adduserpwd2").val()){
		alert("2次密码输入不同");
		flag = false;
	}
	
	 return flag;
}

//获取选中
function getuservideozone(){
	var zone = "";
	$("#addvideolist input[name=zone]").each(function(){
		if($(this).attr("checked")=="checked")
			zone+=$(this).attr("zone")+",";
	});
	zone=zone.substring(0, zone.length-1);
	return zone;
}

