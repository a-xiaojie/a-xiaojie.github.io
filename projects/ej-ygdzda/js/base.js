//判断是否支持placeholder
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}
function fnTable(){
	$('.contact-head-box th').on({
		mouseover:function(){
			$(this).animate({'background-color': '#c1d4f0'}, 300);
		},
		click:function(){
			$(this).animate({'background-color': '#99b7e6'}, 300);
		},
		mouseout:function(){
			$(this).animate({'background-color':'#f1f1f1'}, 300);
		}
	})
	$('.contact-list-box table tr:odd').addClass('odd-row')
	$('.contact-list-box tr').on({
		mouseover:function(){
			$(this).addClass('hover');
		},
		mouseout:function(){
			$(this).removeClass('hover')
		}
	});
	$('.contact-list-box tr td input').click(function(){
		$(this).parent().parent().toggleClass('selected-row');
	});
	$(".nano-content table tr").on({
		mouseover:function(){
    		$(this).find('div').show();  
		},
		mouseout:function(){
    		$(this).find('div').hide();
		}
	});
}
$(window).on('load',function(){
	$.fn.zTree.init($("#depTree"), setting, zNodes);
})
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
			$('.seperate-bar').css('left', _left+moveX+'px')
			$('.aside').css('width', _left+moveX-5+'px');
			$('.main-content').css('left',_left+moveX+10+'px');
		},     //拖动时执行的函数
		stop:function(e,ui){
			var moveX=e.clientX-startX;
			if(moveX<0){ //向左移动
				if(parseInt($('.seperate-bar').css('left'))<= -10){
					$('.seperate-bar').css('left', -10+'px');
					$('.aside').css('width','0');
					$('.main-content').css('left','0');
				}
			}
			else{ //向右移动
				if(parseInt($('.seperate-bar').css('left'))>= $(window).width()-25){ 
					$('.seperate-bar').css('left',$(window).width()-25+'px');
					$('.aside').css('width',$(window).width()-30+'px')
					$('.main-content').css('left',$(window).width()-20+'px')
				}
			}
			$('.seperate-bar').removeClass('active');
			_left=parseInt($('.seperate-bar').css('left'));
		}      //拖动停止执行的函数
	});
	
	fnTable();

	$('.search-input').on({
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
	})
})

