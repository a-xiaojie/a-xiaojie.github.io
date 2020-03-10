// JScript 文件

// JScript 文件
//v 1.0.0.1
function CallWebMethod(url, data, callback, complete, async) {
	if (typeof PreCallWebMethod == 'function')
		PreCallWebMethod();
	if (typeof console != "undefined")
		console.log("CallWebMethod：" + url + ":" + data);
	return $.ajax({
		type : "POST",
		async : async,
		url : url,
		contentType : 'application/x-www-form-urlencoded; charset=utf-8',
		data : data,
		dataType : "json",
		timeout : 60000,
		success : callback,
		complete : function() {
			if (typeof complete == 'function')
				complete();
			if (typeof PostCallWebMethod == 'function')
				PostCallWebMethod();
		},
		error : function(xhr, status, errMsg) {
			var error = "系统异常！";
			try {
				var errorMeg = xhr.responseText;
				var emsg = errorMeg.split("###");
				if(emsg.length>1)
					error = emsg[1];
				if(errorMeg.indexOf("用户登录") > 0)
					error = "登陆超时";
				//error = eval(xhr.responseText).Message;
			} catch (ex) {
			}
			if (typeof console != "undefined")
				console.log("error：" + error);
			alert(error);
			if(error == "登陆超时")
				window.location=ej_basePath;
		}
	});
}
function sendRedisCmd(nOprCmd,nStop,videoid,num,name,userlevel,path,preset_id)
{
	CallWebMethod(
			basePath +"redis/ptzplay.htm",
			{
                dev_id:videoid,
                node_id:"0",
                priority:userlevel,
                cmd_type:nOprCmd,
                cmd_status:nStop,
                h_speed :num,
                v_speed :num,
                z_speed:num,
                f_speed :num,
                i_speed :num,
                preset_id:preset_id
			},
			function(data)
			{
				;
			}
		);	
}
