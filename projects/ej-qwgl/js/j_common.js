/* 打开新窗口 */
function fnOpenWin(url,name){
	window.open(url,name,'left=0,top=0,width='+ (screen.availWidth - 10) +',height='+ (screen.availHeight-50) +',toolbar=no,menubar=no,scrollbars=yes, resizable=no,location=no, status=no')
}

/* 打开对话框 */
function fnDia(txt){
	$('.dia-cont').text(txt);
	$('.dia').css('margin-top',-($('.dia').height()/2)+'px').show();
	$('.dia .save-btn').click(function(){
		alert('确认！');
		$('.dia').hide();
	});
	$('.dia .cancel-btn').click(function(){
		alert('取消！');
		$('.dia').hide();
	});
}

/* 岗位新增勤务时间 减 */
function fnDel(obj){
            var _index=$(obj).parents('ul').find('li').index($(obj).parents('li'));
            var _len=$(obj).parents('ul').find('li').length;
            if(_index==(_len-1)&&_index>0){
                $(obj).parents('ul').find('li').eq(_index-1).append('<a class="li-add-btn" onclick="fnAdd(this)"></a>')
            }
            if(_len>1){
                $(obj).parent().remove();
            }
}

/* 岗位新增勤务时间 加 */
function fnAdd(obj){
            var str='<li>'+$(obj).parents().html()+'</li>';
            $(str).appendTo('.form-time ul');
            $(obj).remove();
            $(".form-time.nano").nanoScroller({alwaysVisible: true});
}

/* 拖动添加警员 */
function fnDragAdd(){
    $('.pb-people .pb-t-list li').draggable({
        appendTo:"body",
        helper:"clone",
        zIndex:999,
        opacity:.8,
        start:function(event,ui){
            $('.pb-detail li').removeClass('active');
        },
        drag: function(event, ui) { 
            var _this=$(this);
            $('.pb-detail li span').each(function(){
                    if($(this).text()==_this.text()){
                        $(this).addClass('high-light');
                    }
                })
        },
        stop:function(){
            $('.pb-detail li span').removeClass('high-light');
        }
    });
    $( ".pb-detail ol li .pb-name" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
        drop: function( event, ui ) {
            var _str='';
            $(this).find('span').each(function(){
                if($(this).hasClass('placeholder')){
                    $(this).remove();
                    _str+='<span>'+ui.draggable.text()+'</span>';
                }
                else if($(this).text()==ui.draggable.text()){
                    alert('已存在'+ ui.draggable.text()+'！');
                    _str='';
                    return false;
                }
                else{
                    _str='<span>'+ui.draggable.text()+'</span>';
                }
            })
            $(this).append(_str);
            fnDragDel();
        }
    })
}

/* Enter键添加警员 */
function fnKeyAdd(){
    $(document).keypress(function(e) {
        if (e.which == 13){
            var _str='';
            var _str2='';
            if(!$('.pb-t-list li').hasClass('active')){
                alert('请选择警员!');
                return;
            }

            if(!$('.pb-detail ol li').hasClass('active')){
                alert('请选择时间!');
                return;
            }

            $('.pb-t-list li.active').each(function(){
                var _this=$(this);
                $('.pb-detail ol li.active .pb-name span').each(function(){
                    if($(this).hasClass('placeholder')){
                        $(this).remove();
                        _str='<span>'+_this.text()+'</span>'
                    }
                    else if($(this).text()==_this.text()){
                        alert('已存在'+ $(this).text() +'！');
                        _str='';
                        return false;
                    }
                    else{
                        _str='<span>'+_this.text()+'</span>';
                    }
                });
                $(this).removeClass('active');
                $('.pb-detail ol li.active .pb-name').append(_str);
            });
            $('.pb-detail ol li.active').removeClass('active');
            
            fnDragDel();
        }
    });
}

/* 拖动删除警员 */
function fnDragDel(){
    $('.pb-detail .pb-name span:not(.placeholder)').draggable({
        appendTo:"body",
        helper:"clone",
        zIndex:999,
        opacity: 0.8
    });
    $('.pb-detail').droppable({
        out:function(event,ui){
            if(ui.draggable.siblings('span').length<=0){
                ui.draggable.parent().append('<span class="placeholder">请添加警员</span>')
            }
            ui.draggable.remove();
        }
    });
}

/* 排版详情 */
function fnDetail(obj){
            if($(obj).hasClass('open')){
                $('.list-detail').slideUp();
                $(obj).removeClass('open');
            }
            else{
                $('.list-detail').slideUp();
                $('.detail-box').removeClass('open');
                $(obj).addClass('open');
                $(obj).parents('.list-info').find('.list-detail').slideDown();
            }
}

/* 根据年月获取有几个星期 */
function fnGetWeek(year, month) {
        // 第一天是周一
        var d = new Date();
        d.setFullYear(year, month-1, 1);
        var w1 = d.getDay();
        if (w1 == 0) w1 = 7;
        d.setFullYear(year, month, 0);
        var dd = d.getDate();
        if (w1 != 1) d1 = 7 - w1 + 2;
        else d1 = 1;
        week_count = Math.ceil((dd-d1+1)/7);

            $('#weeks .slide-down-box').empty();
        for( var i=0; i<week_count; i++){
            $('#weeks .slide-down-box').append('<a>第'+ (i+1)+'周</a>');
        }
        $('#weeks a').on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parents('li').find('span').text($(this).text());
        });
        //$('#info').html(year + "年" + month + "月有" + week_count +"周");
    }


$(function(){
    $(".nano").nanoScroller({alwaysVisible: true});
	/* 下拉菜单 */
	$('.slide-down-nav li').click(function(e){
        e.stopPropagation();
        if($(this).children('span').hasClass('active')){
            $(this).children('span').removeClass('active').next('.slide-down-box').slideUp('fast');
        }
        else{
            $('.slide-down-nav span').removeClass('active').next('.slide-down-box').slideUp('fast');
            $(this).children('span').addClass('active').next('.slide-down-box').slideDown('fast');
            $(this).find('.slide-down-box a').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                $(this).parents('li').find('span').text($(this).text());
                
                var _year=parseInt($('#years').find('a.active').text());
                var _month=parseInt($('#months').find('a.active').text());
        
                fnGetWeek(_year,_month);
            });
        }
    });

    /* tab切换 */
    $('.pb-f-tab li').click(function(e){
    	e.stopPropagation();
    	$(this).addClass('active').siblings().removeClass('active');
    	$('.pb-f-content').hide().eq($('.pb-f-tab li').index(this)).show();
    });

    /* 表格特效 */
    var _width=$('.third-table td').width();
    var _left=0;
    for(var i=0; i<4; i++){
    	_left+=$('#configure-table th').eq(i).width();
    }
    $('.configure-border').css('left',_left+_width+'px');
    $('.configure-bg-out').css('width',_width+3);
    $('.configure-bg-in').html($('#configure-table th').eq(5).html());
    $('.configure-border-b').css('width',_width);
    $(".configure-border-b").height($("#configure-table").height()-52);
    $('.third-table').mouseover(function(e){
		var index=$(e.target).index();
		if(index<1) return;
		if(e.target.tagName!="TD"){
		return false; 
		}
		var _tdLeft=0;
		for(var i=0; i<index; i++)
		{
		_tdLeft+=$('.third-table td').eq(i).width();
		}
		$('.configure-border').css('left',(_tdLeft+_left+(index-1)*2+0)+'px');
		$('.configure-bg-in').html($('#configure-table th').eq(index+4).html());
	});

    /* 菜单 */
        $('#menu a.item').click(function (e) {
            e.stopPropagation();
            $('#menu li').children('ul').slideUp('fast'); 
            $('#menu a.item').each(function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
            });
            $(this).siblings('ul').slideDown('fast');
            $(this).addClass('active'); 

            return false;
        });

        /* 两侧内容展开与缩进 */
        $('.bar-btn').click(function(e){
            e.stopPropagation();
            if($(this).hasClass('bar-open')){
                $(this).removeClass('bar-open').addClass('bar-close');
                $(this).parent().animate({width:'0'});
            }
            else if($(this).hasClass('bar-close')){
                $(this).removeClass('bar-close').addClass('bar-open');
                $(this).parent().animate({width:'166px'});
            }
        });

    /* 对话框拖拽 */
    $('.drag').draggable({
        cursor :"move"
    });

    /* 用户菜单下拉 */
    $('#setting').hover(function(){
        $(this).find('.h-menu-hd').addClass('active');
        $(this).find('.h-menu-bd').slideDown('fast');
    },function(){
        $(this).find('.h-menu-hd').removeClass('active');
        $(this).find('.h-menu-bd').slideUp('fast'); 
    });
    /* 全屏 */
    $("#fullscreen").click(function(){
        var WshShell = new ActiveXObject('WScript.Shell');
        WshShell.SendKeys('{F11}');
    });
    /* 退出 */
    $("#logout").click(function(){
        if(confirm("确定要退出吗？")){
            window.location.href = "";
            window.location.reload();
        } else {
            return false;
        }
    });
});