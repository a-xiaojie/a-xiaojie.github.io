$j(function(){
	$j(".silder_con .silder_panel").hide().eq(0).show();
	var len = $j("#slider_name .silder_panel").length;
	var index = 0;
	var picTimer;
	
	var btn = "<a class='prev'>Prev</a><a class='next'>Next</a>";
	$j("#slider_name").append(btn);

	$j("#slider_name .silder_nav li").css({"opacity":"0.8","filter":"alpha(opacity=80)"}).mouseenter(function() {
		clearInterval(picTimer);
		index = $j(this).index();
		showPics(index);
	}).eq(0).trigger("mouseenter");


	// Prev
	$j("#slider_name .prev").click(function() {
		index=(index-1+len)%len;
		showPics(index);
	});

	// Next
	$j("#slider_name .next").click(function() {
		index=(index+1)%len;
		showPics(index);
	});

	// 
	$j("#slider_name").hover(function() {
		clearInterval(picTimer);
	},function() {		
		picTimer = setInterval(function() {
			index=(index+1)%len;
			showPics(index);		
		},6000); 
	}).trigger("mouseleave");
	
	// showPics
	var picTime2=null;
	function showPics(index) {
		if (picTime2!=null) window.clearTimeout(picTime2);
		$j(".silder_nav li").removeClass("current").eq(index).addClass("current"); 
		picTime2=window.setTimeout(function(){
			
			$j(".silder_con .silder_panel").stop(true,false).hide().eq(index).stop(true,false).show();
			$j(".silder_nav li").stop(true,false).animate({"opacity":"0.8"},500).eq(index).stop(true,false).animate({"opacity":"1"},500);
		},300);
	}
});