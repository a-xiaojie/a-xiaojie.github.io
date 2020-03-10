/* 添加收藏 */
function AddFavorite(sURL, sTitle)
{
    try
    {
        window.external.addFavorite(sURL, sTitle);
    }
    catch (e)
    {
        try
        {
            window.sidebar.addPanel(sTitle, sURL, "");
        }
        catch (e)
        {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}
/* 设为首页 */
function SetHome(obj,vrl){
        try{
                obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);
        }
        catch(e){
                if(window.netscape) {
                        try {
                                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        }
                        catch (e) {
                                alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
                        }
                        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                        prefs.setCharPref('browser.startup.homepage',vrl);
                 }
        }
}



$(function(){
	<!-- 获取当前日期 -->
	var str='';
	GetDateStr();
	$('.top_list .date').text(str);
	function GetDateStr(){
		var dd=new Date();	
		var y=dd.getFullYear();
		var m=dd.getMonth()+1;
		var d=dd.getDate();
		str=y+'-'+m+'-'+d;
	}
	
	
	<!-- 下拉菜单 -->
	$('.nav li:eq(2)').mouseover(function(){
		$(this).addClass('active');
		$(this).find('.subnav').show();
	}).mouseout(function(){
			$(this).removeClass('active');
			$(this).find('.subnav').hide();
		})
		
		
	$('.list li').each(function(index, element) {
   	$(this).click(function(){
		index=$(this).index();	
		$('.list li').removeClass('active');
		$(this).addClass('active');
		$('.article').css('border-bottom','1px  dashed #d4d4d4').eq(index-1).css('border-bottom','none');
		$('.article').removeClass('active').eq(index).addClass('active').css('border-bottom','1px solid #f5e6c2');
	}) 
});

$('.article').last().css('border-bottom','none');
});