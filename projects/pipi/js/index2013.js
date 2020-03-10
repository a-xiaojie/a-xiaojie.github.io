//搜索框默认文本
$(function(){ 
	$('.input-text').bind({ 
		focus:function(){ 
			if (this.value == this.defaultValue){ 
				this.value=""; 
			} 
		}, 
		blur:function(){ 
			if (this.value == ""){ 
				this.value = this.defaultValue; 
			} 
		} 
	}); 
}) 


function Reset(){
	var oWidth=document.documentElement.clientWidth;
	if(oWidth>1132)
	  {
		$(".tray").css("width","1132px");
	  }
	else{
		  $(".tray").css("width","100%");
		  }	
		
}


//tab切换
$(function() {
	$(".list-tab").find("li").click(function(){
		if($(this).hasClass("on")) return;
		$(this).addClass("on").siblings("li").removeClass("on");
		
		var _z=$(this).parent().parent().parent().find(".tab-content");
		_z.hide();
		$(_z.get($(this).index())).show();
			
		var _x=$(this).parent().parent().parent().find(".tab-content-heji");
		_x.hide();
		$(_x.get($(this).index())).show();		
	});	
});


$(function() {
	$(".classify").find("a").click(function(){
		if($(this).hasClass("on")) return;
		$(this).addClass("on").siblings("a").removeClass("on");
		
		var _z=$(this).parent().parent().find("ul.tv-list");
		_z.hide();
		$(_z.get($(this).index())).show();
					
	});	
});

