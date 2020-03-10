$(function(){
		$(".m-side-subnav li[title=right]").each(function(){
			var name = $(this).attr("name");
				if(name == "监控点管理"){
						 $(this).addClass("active");
				}
		});
		
		//pager宽度，不设置没有页数
		$("#pager").width($("#tab").width());
		result = new AjaxResult2Table({
			resultTableId : "tab",
			pagerId : "pager",
			searchUrl : basePath+"video/getvideopage.htm"
		});


	result.search({},null,function(){
	});
	
	//查询
	$("#search").click(function(){
		result.search({dev_ip:$("#dev_ip").val(),videnodename:$("#videnodename").val(),
			devicetype:$("#devicetype").val(),zoneid:$("#zoneid").val(),
			sort:$("#sort").val(),data_source:$("#data_source").val()},null,function(){
		});
	});
	
	$("#addBtn").click(function(){
		var adddisplay ;
		if($("#adddisplay").attr("checked")=="checked") adddisplay=1;
		else adddisplay=0;
		
		if(Experimental()){
		CallWebMethod(
				basePath+"video/addvideo.htm",
				{
					isnew:1,
					//videoid:$("#addvideoid").val(),
					videonodename:$("#addvideonodename").val(),
					videonodename1:$("#addvideoname1").val(),
					zoneid:$("#addzoneid").val(),
					cameranum:$("#addcameranum").val(),
					speed:$("#addspeed").val(),
					screentype:$("#addscreentype").val(),
					x:$("#addX").val(),
					y:$("#addY").val(),
					nindex:$("#addnindex").val(),
					display:adddisplay,
					dev_ip:$("#adddev_ip").val(),
					dev_port:$("#adddev_port").val(),
					dev_user:$("#adddev_user").val(),
					dev_password:$("#adddev_pwd").val(),
					coderatetype:$("#addcoderatetype").val(),
					contype:$("#addcontype").val(),
					devicetype:$("#adddevicetype").val(),
					data_source:$("#adddata_source").val(),
					dev_modal:$("#adddev_modal").val(),
					dev_cj:$("#adddev_cj").val(),
					dev_id:$("#adddev_id").val(),
					channel:$("#addchannel").val(),
					protocol_type:$("#addprotocol_type").val(),
					remote_type:$("#addremote_type").val(),
					remote_info:$("#addremote_info").val(),
					streamid:$("#addstreamid").val(),
					controltype:$("#addcontroltype").val(),
					matrixid:$("#addmatrixid").val(),
					sip_ip:$("#txtSipIP").val(),
					sip_port:$("#txtSipPort").val(),
					sip_user:$("#txtSipUser").val(),
					sip_password:$("#txtSipPwd").val(),
					sip_realm:$("#txtSipRealm").val(),
					sip_id:$("#txtSipID").val()
				},
				function(data)
				{
					if(data.flag==true){
						alert("添加成功");
						$("#addVideoDiv").dialog("close");

						result.search({dev_ip:$("#dev_ip").val(),videnodename:$("#videnodename").val(),
							devicetype:$("#devicetype").val(),zoneid:$("#zoneid").val(),
							sort:$("#sort").val(),data_source:$("#data_source").val()},null,function(){
						});
					}else{
						alert("添加失败");
					}
				}
			);
		}
	});
	
	$("#editBtn").click(function(){
		var adddisplay ;
		if($("#adddisplay").attr("checked")=="checked") adddisplay=1;
		else adddisplay=0;
		
		if(Experimental()){
		CallWebMethod(
				basePath+"video/addvideo.htm",
				{
					videoid:$("#addvideoid").val(),
					videonodename:$("#addvideonodename").val(),
					videonodename1:$("#addvideoname1").val(),
					zoneid:$("#addzoneid").val(),
					cameranum:$("#addcameranum").val(),
					speed:$("#addspeed").val(),
					screentype:$("#addscreentype").val(),
					x:$("#addX").val(),
					y:$("#addY").val(),
					nindex:$("#addnindex").val(),
					display:adddisplay,
					dev_ip:$("#adddev_ip").val(),
					dev_port:$("#adddev_port").val(),
					dev_user:$("#adddev_user").val(),
					dev_password:$("#adddev_pwd").val(),
					coderatetype:$("#addcoderatetype").val(),
					contype:$("#addcontype").val(),
					devicetype:$("#adddevicetype").val(),
					data_source:$("#adddata_source").val(),
					dev_modal:$("#adddev_modal").val(),
					dev_cj:$("#adddev_cj").val(),
					dev_id:$("#adddev_id").val(),
					channel:$("#addchannel").val(),
					protocol_type:$("#addprotocol_type").val(),
					remote_type:$("#addremote_type").val(),
					remote_info:$("#addremote_info").val(),
					streamid:$("#addstreamid").val(),
					controltype:$("#addcontroltype").val(),
					matrixid:$("#addmatrixid").val(),
					sip_ip:$("#txtSipIP").val(),
					sip_port:$("#txtSipPort").val(),
					sip_user:$("#txtSipUser").val(),
					sip_password:$("#txtSipPwd").val(),
					sip_realm:$("#txtSipRealm").val(),
					sip_id:$("#txtSipID").val()
				},
				function(data)
				{
					if(data.flag==true){
						alert("编辑成功");
						$("#addVideoDiv").dialog("close");

						result.search({dev_ip:$("#dev_ip").val(),videnodename:$("#videnodename").val(),
							devicetype:$("#devicetype").val(),zoneid:$("#zoneid").val(),
							sort:$("#sort").val(),data_source:$("#data_source").val()},null,function(){
						});
					}else{
						alert("编辑失败");
					}
				}
			);
		}
	});
	
	$("#cancelBtn").click(function(){

		$("#addVideoDiv").dialog("close");
	});
	
	//sip_div显示隐藏
	$("#addprotocol_type").change(function(){
		if($("#addprotocol_type").val() == 1 || $("#addprotocol_type").val() == "1")
			$("#sip_div").css("display","inline-block");
		else
			$("#sip_div").css("display","none");
	});
	
	//列出区域
	CallWebMethod(
			basePath+"video/getzonelist.htm",
				{
				},
				function(data)
				{
					var htm = '<option value="">所有区域</option>';
					var htm2 = '';
					for(var i=0;i<data.zonelist.length;i++){
						htm+='<option value="'+data.zonelist[i].zoneid+'">'+data.zonelist[i].zonename+'</option>';
						htm2+='<option value="'+data.zonelist[i].zoneid+'">'+data.zonelist[i].zonename+'</option>';
					}
					$("#zoneid").html(htm);
					$("#addzoneid").html(htm2);
					
				}
			);
	
	//控制类型getcontrollist
/*	CallWebMethod(
			basePath+"video/getcontrollist.htm",
				{
				},
				function(data)
				{
					var htm = '';
					for(var i=0;i<data.list.length;i++){
						htm+='<option value="'+data.list[i].controlid+'">'+data.list[i].controlname+'</option>';
					}
					$("#addcontroltype").html(htm);
					
				}
			);*/
	
	//设备厂商getdevcjlist
	CallWebMethod(
			basePath+"video/getdevcjlist.htm",
				{
				},
				function(data)
				{
					var htm = '';
					for(var i=0;i<data.list.length;i++){
						htm+='<option value="'+data.list[i].code+'">'+data.list[i].name+'</option>';
					}
					$("#adddev_cj").html(htm);
					
				}
			);
	//回放设备
	CallWebMethod(
			basePath+"video/getremotelist.htm",
				{
				},
				function(data)
				{
					var htm = '';
					for(var i=0;i<data.list.length;i++){
						htm+='<option value="'+data.list[i].remote_xh+'">'+data.list[i].procotocoltype
						+'-'+data.list[i].remote_cjname+'-'+data.list[i].remote_ip
						+'('+data.list[i].remote_port+')</option>';
					}
					$("#addremote_info").html(htm);
					
				}
			);
	//流媒体
	CallWebMethod(
			//searchUrl : "<%=basePath %>video/getstreaminfopage.htm"
			basePath+"video/getstreaminfopage.htm",
				{
				pagesize:"50"
				},
				function(data)
				{
					var htm = '';
					for(var i=0;i<data.result.length;i++){
						//streamid,streamname,streamip,streamport,username,password,strreamtype
						htm+='<option value="'+data.result[i].streamid+'">'+data.result[i].streamname
						+'</option>';
					}
					$("#addstreamid").html(htm);					
				}
			);
	//矩阵
	CallWebMethod(
			basePath+"video/getmatrixlist2.htm",
				{
				},
				function(data)
				{
					var htm = '';
					for(var i=0;i<data.list.length;i++){
						htm+='<option value="'+data.list[i].matrixid+'">'+data.list[i].matrixmemo
						+'</option>';
					}
					$("#addmatrixid").html(htm);
					
				}
			);	
	//第三方
	CallWebMethod(
			basePath+"video/getserverpage.htm",
				{
				pagesize:999
				},
				function(data)
				{
					var htm = '<option value="" selected="selected">所有</option><option value="0">用户添加</option>';
					var htm2 = '<option value="0">用户添加</option>';
					for(var i=0;i<data.result.length;i++){
						htm+='<option value="'+data.result[i].videoid+'">'+data.result[i].cjname
						+'</option>';
						htm2+='<option value="'+data.result[i].videoid+'">'+data.result[i].cjname
						+'</option>';
					}
					$("#data_source").html(htm);
					$("#adddata_source").html(htm2);
				}
			);	
	
	});
	

function returnDisplay(item){
	//var str='<input type="checkbox" class="u-che"';
	var str="";
	if(item.display == 1 || item.display == "1")
		str+=  '是';
	if(item.display == 0 || item.display == "0")
		str += '否';
	//str+=' />';
	return str;
}


function returnControl(item){
	var str="";
	str = '<a href="javascript:;" title="编辑" style="margin-right:5px" onclick="Edit('+item.videoid+')">编辑</a>'
		+'<a href="javascript:;" title="拒绝" style="margin-right:5px" onclick="Delete('+item.videoid+')">删除</a>'
		+'<a href="javascript:;" title="删除" style="margin-right:5px" onclick="Detail('+item.videoid+',0)">查看</a>';
	return str;
}

function Edit(val){
	Detail(val,1);
}

function Delete(val){
	if(confirm("确定要删除？")){
		CallWebMethod(
				basePath+"video/deletevideo.htm",
				{
					videoid:val
				},
				function(data)
				{if(data.flag == true){
					alert("删除成功");

					result.search({dev_ip:$("#dev_ip").val(),videnodename:$("#videnodename").val(),
						devicetype:$("#devicetype").val(),zoneid:$("#zoneid").val(),
						sort:$("#sort").val(),data_source:$("#data_source").val()},null,function(){
					});
				}else
					alert("删除失败");
				}
			);
		}
}

function Detail(val,i){
	
	var video=result.detailInfo(val);
	$("#addvideoid").val(video.videoid);
	$("#addvideonodename").val(video.videonodename);
	$("#addvideoname1").val(video.videonodename1);
	$("#addzoneid").val(video.zoneid);
	$("#addcameranum").val(video.cameranum);
	$("#addspeed").val(video.speed);
	$("#addscreentype").val(video.screentype);
	$("#addX").val(video.x);
	$("#addY").val(video.y);
	$("#addnindex").val(video.nindex);
	if(video.display==1)
	if($("#adddisplay").attr("checked")!="checked")
		$("#adddisplay").click();
	if(video.display==0)
			if($("#adddisplay").attr("checked")=="checked")
				$("#adddisplay").click();
	$("#adddev_ip").val(video.dev_ip);
	$("#adddev_port").val(video.dev_port);
	$("#adddev_user").val(video.dev_user);
	$("#adddev_pwd").val(video.dev_password);
	$("#addcoderatetype").val(video.coderatetype);
	$("#addcontype").val(video.CONTYPE);
	$("#adddevicetype").val(video.devicetype);
	$("#adddata_source").val(video.data_source);
	$("#adddev_modal").val(video.dev_modal);
	$("#adddev_cj").val(video.dev_cj);
	$("#adddev_id").val(video.dev_id);
	$("#addchannel").val(video.channel);
	$("#addprotocol_type").val(video.protocol_type);
	$("#addremote_type").val(video.remote_type);
	$("#addremote_info").val(video.remote_info);
	$("#addstreamid").val(video.streamid);
	$("#addcontroltype").val(video.controltype);
	$("#addmatrixid").val(video.matrixid);
	$("#txtSipIP").val(video.sip_ip);
	$("#txtSipPort").val(video.sip_port);
	$("#txtSipUser").val(video.sip_user);
	$("#txtSipPwd").val(video.sip_password);
	$("#txtSipRealm").val(video.sip_realm);
	$("#txtSipID").val(video.sip_id);
	
	if($("#addprotocol_type").val() == 1 || $("#addprotocol_type").val() == "1")
		$("#sip_div").css("display","inline-block");
	else
		$("#sip_div").css("display","none");
	
	var title='';
	if(i==0) {
		title="查看";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","none");
	}
	if(i==1){
		title="编辑";
		$("#addBtn").css("display","none");
		$("#editBtn").css("display","inline-block");
	} 
	var $divHeight=$("#addVideoDiv").height()>500?500:"auto";
	$("#addVideoDiv").dialog({
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

function Add(){
	$("#addvideoid").val("");
	$("#addvideonodename").val("");
	$("#addvideoname1").val("");
	$("#addzoneid").val("");
	$("#addcameranum").val("");
	$("#addspeed").val("");
	$("#addscreentype").val("");
	$("#addX").val("0");
	$("#addY").val("0");
	$("#addnindex").val("1");
	if($("#adddisplay").attr("checked")=="checked")
		$("#adddisplay").click();
	$("#adddev_ip").val("");
	$("#adddev_port").val("");
	$("#adddev_user").val("");
	$("#adddev_pwd").val("");
	$("#addcoderatetype").val("");
	$("#addcontype").val("");
	$("#adddevicetype").val("");
	$("#adddata_source").val("");
	$("#adddev_modal").val("");
	$("#adddev_cj").val("");
	$("#adddev_id").val("");
	$("#addchannel").val("0");
	$("#addprotocol_type").val("");
	$("#addremote_type").val("");
	$("#addremote_info").val("");
	$("#addstreamid").val("");
	$("#addcontroltype").val("");
	$("#addmatrixid").val("");
	$("#txtSipIP").val("");
	$("#txtSipPort").val("");
	$("#txtSipUser").val("");
	$("#txtSipPwd").val("");
	$("#txtSipRealm").val("");
	$("#txtSipID").val("");
	if($("#addprotocol_type").val() == 1 || $("#addprotocol_type").val() == "1")
		$("#sip_div").css("display","inline-block");
	else
		$("#sip_div").css("display","none");
	
	
	$("#addBtn").css("display","inline-block");
	$("#editBtn").css("display","none");
	var $divHeight=$("#addVideoDiv").height()>500?500:"auto";
	$("#addVideoDiv").dialog({
		resizable : false,
		modal : true,
		width : 850,
		height : $divHeight,
		title : "新增",
		close : function(){
			$(".pop-iframe").remove();
		}
	});
	$(".ui-widget-overlay").append("<iframe class='pop-iframe' frameborder='0'></iframe>");
	$(".pop-iframe").height($(".ui-widget-overlay").height()).width($(".ui-widget-overlay").width());
}
function exportVideo(){
	CallWebMethod(
			basePath+"video/exportvideolist.htm",
			{

			},
			function(data) {
				if (data.error) {
					alert(data.error);
				} else {
					//				window.open("${basePath}" + data.filePath);
					window.location.href = basePath + data.filePath;
				}
			});
}

function Experimental(){
	var flag=true;
	if($("#addvideonodename").val()==null || $("#addvideonodename").val()==''){
		alert("名称为空");
		flag = false;
	}
	if($("#addcameranum").val()==null || $("#addcameranum").val()==''){
		alert("逻辑号为空");
		flag = false;
	}	
	if($("#adddev_ip").val()==null || $("#adddev_ip").val()==''){
		alert("IP为空");
		flag = false;
	}
	if($("#adddev_port").val()==null || $("#adddev_port").val()==''){
		alert("端口为空");
		flag = false;
	}	
	if($("#addchannel").val()==null || $("#addchannel").val()==''){
		alert("通道号为空");
		flag = false;
	}
	return flag;
}