jQuery(function(){
	var len = jQuery(".silder_con li").length;
	var index = 0;
	var picTimer;
	
	showPics(index);
	
	jQuery(".sliders .dot-nav li").click(function() {
		clearInterval(picTimer);
		index = jQuery(this).index();
		showPics(index);
		
	});
	
	
	/*jQuery(".pre-btn, .next-btn").hover(function(){
		jQuery(this).stop(true,false).animate({opacity:"1",filter:"alpha(opacity=100)"},500);
	},function() {
		jQuery(this).stop(true,false).animate({opacity:"0.5",filter:"alpha(opacity=50)"},500);
	});*/
	// Prev
	jQuery(".sliders .pre-btn").click(function() {
		index=(index-1+len)%len;
		showPics(index);
	});

	// Next
	jQuery(".sliders .next-btn").click(function() {
		index=(index+1)%len;
		showPics(index);
	});

	// 
	jQuery(".sliders").hover(function() {
		clearInterval(picTimer);
		jQuery(".pre-btn, .next-btn").css({opacity:"0.5",filter:"alpha(opacity=50)"});
	},function() {	
		jQuery(".pre-btn, .next-btn").css({opacity:"0",filter:"alpha(opacity=0)"});
		picTimer = setInterval(function() {
			index=(index+1)%len;
			showPics(index);		
		},6000); 
	}).trigger("mouseleave");
	
	
	
	// showPics
	var picTime2=null;
	
	function showPics(index) {
		if (picTime2!=null) window.clearTimeout(picTime2);
		jQuery(".dot-nav li").removeClass("active").eq(index).addClass("active"); 
		picTime2=window.setTimeout(function(){
			jQuery(".silder_con li").stop(true,false).animate({opacity:"hide"},300).eq(index).stop(true,false).animate({opacity:"show"},500);
		},300);
		setTimeout(function(){jQuery(".s-txt").stop(true,false).animate({opacity:"hide"},500).eq(index).stop(true,false).animate({ opacity: "show"},1000);},1000);
	}
	
});
