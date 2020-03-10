//判断是否支持placeholder
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}
function fnTable(){
	/*$('.contact-head-box th').on({
		mouseover:function(){
			$(this).animate({'background-color': '#c1d4f0'}, 300);
		},
		click:function(){
			$(this).animate({'background-color': '#99b7e6'}, 300);
		},
		mouseout:function(){
			$(this).animate({'background-color':'#f'}, 300);
		}
	})*/
	$('.contact-list-box table tr:odd').addClass('odd-row');
	$('.contact-list-box tr').on({
		mouseover:function(){
			$(this).addClass('hover');
		},
		click:function(){
			$(this).toggleClass('selected-row');
		},
		mouseout:function(){
			$(this).removeClass('hover')
		}
	});
}
/*$(window).on('load',function(){
	$.fn.zTree.init($("#depTree"), setting, zNodes);
});*/
$(window).on('resize load',function(){
	$(".nano").nanoScroller({alwaysVisible: true});
	
	var startX;
	var _left=parseInt($('.seperate-bar').css('left'));
	var lWidth=$('.aside').width();
	var rLeft=parseInt($('.main-content').css('left'));

	$('.seperate-bar').draggable({
		addClasses: false,
		axis:"x",
		cursor: "e-resize",
		start:function(e,ui){
			$('.seperate-bar').addClass('active');
			startX=e.clientX;
		},    //开始拖动执行的函数
		drag:function(e,ui){
			var moveX=e.clientX-startX;
			$('.seperate-bar').css('left', _left+moveX+'px');
			$('.aside').css('width', _left+moveX-10+'px');
			$('.main-content').css('left',_left+moveX+15+'px');
		},     //拖动时执行的函数
		stop:function(e,ui){
			var moveX=e.clientX-startX;
			if(moveX<0){ //向左移动
				if(parseInt($('.seperate-bar').css('left'))<= -15){
					$('.seperate-bar').css('left', -15+'px');
					$('.aside').css('width','0');
					$('.main-content').css('left','0');
				}
			}
			else{ //向右移动
				if(parseInt($('.seperate-bar').css('left'))>= $(window).width()-40){ 
					$('.seperate-bar').css('left',$(window).width()-40+'px');
					$('.aside').css('width',$(window).width()-50+'px');
					$('.main-content').css('left',$(window).width()-25+'px');
				}
			}
			$('.seperate-bar').removeClass('active');
			_left=parseInt($('.seperate-bar').css('left'));
		}      //拖动停止执行的函数
	});
	
	fnTable();

	$('.aside .icon-close').click(function(){
    	$('#parlabel').val($('#parlabel')[0].defaultValue);
		$('#parlabelVal').css('visibility','hidden');
		getTree();
		
	});
	
	$('#perlabelVal .icon-close').click(function(){
    	$('#perlabel').val($('#perlabel')[0].defaultValue);
		$('#perlabelVal').css('visibility','hidden');
		$('tbody').html('');
		$(".nano").nanoScroller();
	});

	$('.search-input').on({
		focus : function(){
			$(this).next(".search-val").hide();
			if (this.value == this.defaultValue){ 
				this.value=""; 
			} 
		},
		blur : function(){
			if (this.value == "" || this.value==this.defaultValue){
				this.value = this.defaultValue; 
				getTree();
			}
			else{
				$(this).next(".search-val").find('span').html(this.value)
				$(this).next(".search-val").show();
			}
		}
	});
})

