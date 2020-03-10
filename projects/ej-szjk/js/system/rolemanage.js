
function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px" onclick="addRole(0,'+item.roleid+')">编辑</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px" onclick="deleteRole('+item.roleid+',\''+item.rolenum+'\')">删除</a>';
	return str;
}

//打开新增页面
function addRole(val,key){
	var title="";
	if(val==1){
		title="新增";
		$("#addBtn").css("display","inline-block");
		$("#editBtn").css("display","none");
		
		$("#addroleid").val("");
		$("#addrolenum").val("");
		$("#addrolename").val("");
		$("#addrolememo").val("");
		$("#addmenulist input[name=menu]").each(function(){
			if($(this).attr("checked")=="checked")
			$(this).click();
		});
		$("#addvideorightlist input[name=video]").each(function(){
			if($(this).attr("checked")=="checked")
			$(this).click();
		});
		$("#addsystemsetuplist input[name=setup]").each(function(){
			if($(this).attr("checked")=="checked")
			$(this).click();
		});
	}else if(val==0){
		title="编辑";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","inline-block");
		var role=result.detailInfo(key);
		$("#addroleid").val(role.roleid);
		$("#addrolenum").val(role.rolenum);
		$("#addrolename").val(role.rolename);
		$("#addrolememo").val(role.rolememo);
		checkmenu(role.rolenum);
		checksetup(role.rolenum);
	}
	var $divHeight=$("#addRoleDiv").height()>500?500:"auto";
	$("#addRoleDiv").dialog({
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

//验证是否为空，格式
function Experimental(val){
	var flag=true;
	if($("#addrolenum").val()==null || $("#addusername").val()==''){
		alert("角色编码为空");
		flag = false;
	}
	if($("#addrolename").val()==null || $("#addrealname").val()==''){
		alert("角色名为空");
		flag = false;
	}	
	
	 return flag;
}


//获取选中的项
function getrolemenu(){
	var menu = "";
	$("#addmenulist input[name=menu]").each(function(){
		if($(this).attr("checked")=="checked")
			menu+=$(this).attr("menu")+",";
	});
	$("#addvideorightlist input[name=video]").each(function(){
		if($(this).attr("checked")=="checked")
			menu+=$(this).attr("video")+",";
	});
	menu=menu.substring(0, menu.length-1);
	return menu;
}

function getrolesystemsetup(){
	var setup = "";
	$("#addsystemsetuplist input[name=setup]").each(function(){
		if($(this).attr("checked")=="checked")
			setup+=$(this).attr("setup")+",";
	});
	setup=setup.substring(0, setup.length-1);
	return setup;
}

//获取rolemenu
function checkmenu(rolenum){
	
	CallWebMethod(
			basePath+"user/getrolemenulist.htm",
			{
				rolenum:rolenum
			},
			function(data)
			{
				$("#addmenulist input[name=menu]").each(function(){
					if($(this).attr("checked")=="checked")
						$(this).click();
				});
				$("#addvideorightlist input[name=video]").each(function(){
					if($(this).attr("checked")=="checked")
					$(this).click();
				});
				var menulist = data.list;
				for(var i=0;i<menulist.length;i++){
					$("#addmenulist input[name=menu]").each(function(){
						if($(this).attr("menu")==menulist[i].MENUNUM)
							$(this).click();
					});
					$("#addvideorightlist input[name=video]").each(function(){
						if($(this).attr("video")==menulist[i].MENUNUM)
							$(this).click();
					});
				}
			}
		);
}

//获取rolesetup
function checksetup(rolenum){
	
	CallWebMethod(
			basePath+"user/getrolesystemlist.htm",
			{
				rolenum:rolenum
			},
			function(data)
			{
				$("#addsystemsetuplist input[name=setup]").each(function(){
					if($(this).attr("checked")=="checked")
						$(this).click();
				});
				var list = data.list;
				for(var i=0;i<list.length;i++){
					$("#addsystemsetuplist input[name=setup]").each(function(){
						if($(this).attr("setup")==list[i].SYSTEMSETUPNUM)
							$(this).click();
					});
				}
			}
		);
}