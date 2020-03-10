// JScript 文件
//设定Cookie值
function SetCookie(name, value)
{
	var Days = 30; 
	//此 cookie 将被保存 30 天     
	var exp = new Date();    //new Date("December 31, 9998");     
	exp.setTime(exp.getTime() + Days*24*60*60*1000);     
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}   
 function GetCookie(name)
//获得Cookie的原始值
{
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen)
    {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
    return GetCookieVal (j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
    }
    return null;
}
        
function GetCookieVal(offset)
//获得Cookie解码后的值
{
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
    endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function addCookie(objName,objValue,objHours)
{      
	//添加cookie     
	var str = objName + "=" + escape(objValue);     
	if(objHours > 0)
	{                               
		//为时不设定过期时间，浏览器关闭时cookie自动消失         
		var date = new Date();         
		var ms = objHours*3600*1000;         
		date.setTime(date.getTime() + ms);         
		str += "; expires=" + date.toGMTString();    
	}    
	document.cookie = str; 
}
function delCookie(name)
//删除cookie 
{    
	document.cookie = name+"=;expires="+(new Date(0)).toGMTString(); 
}