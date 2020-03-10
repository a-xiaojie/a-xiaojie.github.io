$(document).ready(function(){
	/*
	$.ajaxSetup({
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		cache : false,
		url:"xmlhttp",
		complete : function(XMLHttpRequest, textStatus) {
			var resText = XMLHttpRequest.responseText;
			alert(resText);
			if (resText != null && resText != "") {
				var res = eval("(" + resText + ")");
				if (res.sessionState == 0) {
					window.location.href = "login/logout.htm";
				}
			}
		}
	});
	*/
	$(document).ajaxComplete(function(e, XHR, options){
		var resText = XHR.responseText;
		if (resText != null && resText != "") {
			if(resText.indexOf("sessionState") >=0){
				var res = eval("(" + resText + ")");
				if (res.sessionState == 0) {
					TimeoutTorReload();
				}
			}
			
		}
    });
});
var beCalled=false;
function TimeoutTorReload(){
	if(!beCalled){
		beCalled=true;
		alert("登录超时，请重新登录！");
		window.location.href = "login/logout.htm";
	}
}
