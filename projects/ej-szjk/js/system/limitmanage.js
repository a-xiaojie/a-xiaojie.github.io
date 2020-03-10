
function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px" onclick="Apply('+item.applyid+')">通过</a>'
		+'<a href="javascript:;" title="拒绝" style="margin-right:5px" onclick="Refuse('+item.applyid+')">拒绝</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px" onclick="Delete('+item.applyid+')">删除</a>';
	return str;
}

function returnState(item){
	var str="";
	if(item.applystate==0) str="审核中";
	if(item.applystate==1) str="通过";
	if(item.applystate==2) str="拒绝";
	return str;
}

function Apply(val){
	CallWebMethod(
			basePath+"user/applyuserlimit.htm",
			{
				applyid:val
			},
			function(data)
			{
				if(data.flag == true){
					alert("审核通过");
					result.search({rolenum:$("#rolenum").val(),username:$("#username").val(),applystate:$("#applystate").val()},null,function(){
					});
				}else
					alert("审核失败");
			}
		);
}

function Refuse(val){
	CallWebMethod(
			basePath+"user/refuseuserlimit.htm",
			{
				applyid:val
			},
			function(data)
			{
				if(data.flag == true){
					alert("拒绝成功");
					result.search({rolenum:$("#rolenum").val(),username:$("#username").val(),applystate:$("#applystate").val()},null,function(){
					});
				}else
					alert("拒绝失败");
			}
		);
}

function Delete(val){
	if(confirm("确定要删除？")){
	CallWebMethod(
			basePath+"user/deleteuserlimit.htm",
			{
				applyid:val
			},
			function(data)
			{if(data.flag == true){
				alert("删除成功");
				result.search({rolenum:$("#rolenum").val(),username:$("#username").val(),applystate:$("#applystate").val()},null,function(){
				});
			}else
				alert("删除失败");
			}
		);
	}
}