function returnVaild(item){
	var str="";
	if(item.valid == 0 || item.valid == "0")
		str = "永久";
	if(item.valid == 1 || item.valid == "1")
		str = "一天";
	return str;
}

function returnAvailable(item){
	var str="";//'<input type="checkbox" class="u-che"';
	if(item.available == 1 || item.available == "1")
		str+=  '是';
	if(item.available == 0 || item.available == "0")
		str += ' 否 ';
	//str+=' />';
	return str;
}

function returnIsonline(item){
	var str="";//var str='<input type="checkbox" class="u-che"';
	if(item.isonline == 1 || item.isonline == "1")
		str+=  '是';
	if(item.isonline == 0 || item.isonline == "0")
		str+= '否';
	//str+=' />';
	return str;
}

function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" onclick="addUser(0,'+item.userid+')">编辑</a>'
		+'<a href="javascript:;" title="删除" onclick="deleteUser('+item.userid+')">删除</a>';
	return str;
}

//打开新增页面
function addUser(val,key){
	var title="";
	if(val==1){
		title="新增";
		$("#addBtn").css("display","inline-block");
		$("#editBtn").css("display","none");
		$("#adduserid").val("");
		$("#addusername").val("");
		$("#addrealname").val("");
		$("#adduserpwd").val("");
		$("#adduserpwd2").val("");
		$("#addzoneid").val("");
		$("#addrolenum").val("");
		$("#addtel").val("");
		$("#addemail").val("");
		$("#addpkikey").val("");
		$("#addunitno").val("");
		$("#addcontrollevel").val(0);
		$("#addvalid").val("");
		$("#addcontrolid").val(0);
	//	$("#addavailable").attr("checked","");
	//	$("#addispki").attr("checked","");
		//清空选择
		$("#addvideolist input[name=zone]").each(function(){
			if($(this).attr("checked")=="checked")
				$(this).click();
		});
	}else if(val==0){
		title="编辑";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","inline-block");
		//获取userinfo
		var user=result.detailInfo(key);
		$("#adduserid").val(user.userid);
		$("#addusername").val(user.username);
		$("#addrealname").val(user.realname);
		$("#adduserpwd").val("");
		$("#adduserpwd2").val("");
		$("#addzoneid").val(user.zoneid);
		$("#addrolenum").val(user.rolenum);
		$("#addtel").val(user.tel);
		$("#addemail").val(user.email);
		$("#addpkikey").val(user.pkikey);
		$("#addunitno").val(user.unitno);
		$("#addcontrollevel").val(user.controllevel);
		$("#addvalid").val(user.valid);
		$("#addcontrolid").val(user.controlid);
	//	$("#addavailable").attr("checked","checked");
	//	$("#addispki").attr("checked","checked");
		//勾选已有
		checkvideozone(user.userid);
	}

	var $divHeight=$("#addUserDiv").height()>500?500:"auto";
	$("#addUserDiv").dialog({
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

function checkvideozone(userid){
	CallWebMethod(
			basePath+"video/getuservideozonelist.htm",
			{
				userid:userid
			},
			function(data)
			{
				$("#addvideolist input[name=zone]").each(function(){
					if($(this).attr("checked")=="checked")
						$(this).click();
				});
				var list = data.list;
				for(var i=0;i<list.length;i++){
					$("#addvideolist input[name=zone]").each(function(){
						if($(this).attr("zone")==list[i].zoneid)
							$(this).click();
					});
				}
			}
		);
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