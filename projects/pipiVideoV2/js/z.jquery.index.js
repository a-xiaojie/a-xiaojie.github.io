$j(function() {
	$j(".tab").find("li").click(function() {
		if ($j(this).hasClass("on")) return;
		$j(this).addClass("on").siblings("li").removeClass("on");
		
		var _z = $j(this).parent().parent().find("div.ztcon");
		_z.hide();
		$j(_z.get($j(this).index())).show();
	});
	
	$j(".tab").find("li").mouseenter(function() {
		if ($j(this).hasClass("hover"))
			return;
		$j(this).addClass("hover").siblings("li").removeClass("hover");
	});
	
});


$j(function() {
	$j(".teb").find("li").click(function() {
		if ($j(this).hasClass("on")) return;
		$j(this).addClass("on").siblings("li").removeClass("on");
		
		var _z = $j(this).parent().parent().find("div.ztcon");
		_z.hide();
		$j(_z.get($j(this).index())).show();
	});
	
	$j(".teb").find("li").mouseenter(function() {
		if ($j(this).hasClass("hover"))
			return;
		$j(this).addClass("hover").siblings("li").removeClass("hover");
	});
	
	
});

