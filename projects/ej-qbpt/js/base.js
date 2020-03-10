//滚动公告f方法
function autoScroll(obj){ 
    $(obj).find(".notice-list").animate({ 
        marginTop : "-30px" 
    },500,function(){ 
        $(this).css({marginTop : "0px"}).find("li:first").appendTo(this); 
    }) 
} 
//判断是否支持placeholder
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}

//获取当前日期
var WeekDayStr=['周日','周一','周二','周三','周四','周五','周六'];
function fnGetDate(date){
	this.date=new Date();
	this.year=-1;
	this.month=-1;
	this.day=-1;
	this.week=-1;
	this.init=function(){
		if(!this.date) this.date=new Date();
		this.year=this.date.getFullYear();
		this.month=this.date.getMonth()+1;
		this.day=this.date.getDate();
		this.week=-1;
		return this;
	};
	this.toFullString=function(){
		var hhmm="";
		if(this.date.getHours()>0||this.date.getMinutes()>0){
			hhmm=" "+(this.date.getHours()<=9?"0":"")+this.date.getHours()+":"+(this.date.getMinutes()<=9?"0":"")+this.date.getMinutes();
		}
		return this.year+"/"+(this.month<=9?"0":"")+this.month+"/"+(this.day<=9?"0":"")+this.day+hhmm;
	};;
	this.toString=function(){
		return this.year+"/"+(this.month<=9?"0":"")+this.month+"/"+(this.day<=9?"0":"")+this.day
	};
	this.toShortString=function(){
		return (this.month<=9?"0":"")+this.month+"-"+(this.day<=9?"0":"")+this.day;
	};
	this.getWeekDayStr=function(){
		return WeekDayStr[this.date.getDay()];
	};
	this.add=function(d){
		this.date=new Date(this.date.getTime()+d*24*60*60*1000);
		return this.init();
	};
	this.gotoMonday=function(){
		this.date.setHours(0, 0, 0, 0);
		this.add((this.date.getDay()+6)%7*(-1));
		var d=new Date(this.year,this.month-1,1);
		var d1= (7 - d.getDay() + 1)%7+1;
		this.week=Math.floor((this.day-d1)/7+1);
		return this;
	};
	this.getWeekIndex=function(){
		if(this.week>0)return this.week;
		this.gotoMonday();
		return this.week;
	};
	this.init();
}

/* alert美化 */
function fnAlert(txt,callback){
	_addDiaDiv(callback);
	$('.alert').find('p').text(txt);
	$('.alert').dialog('open');
}
/* confirm美化 */
function fnConfirm(txt,callback){
	_addDiaDiv(callback);
	$('.alert').find('p').text(txt);
	$('.alert').dialog('open');
}
function _addDiaDiv(callback){
	if(!$('.alert').is('div')){
		$('body').append('<div class="alert"><p></p></div>');
	}
	if(typeof callback == 'function'){
		$('.alert').dialog({
			autoOpen: false,
			dialogClass: "no-close",
			resizable: false,
			open : function(){
				$('.pop-mask').show();
			},
			buttons: {
				'是': function() {
					$(this).dialog('close');
					$('.pop-mask').hide();
					callback();
				},
				'否': function() {
					$(this).dialog('close');
					$('.pop-mask').hide();
				}
			}
		});
	}
	else{
		$('.alert').dialog({
			autoOpen: false,
			dialogClass: "no-close",
			resizable: false,
			open : function(){
				$('.pop-mask').show();
			},
			buttons: {
				'确定': function() {
					$(this).dialog('close');
					$('.pop-mask').hide();
				}
			}
		});
	}
}

/* 根据年月获取有几个星期 */
function fnGetWeek(year, month,$week) {
    $week=$week||$('#weeks');
    var oldYear=$week.attr("data-year");
    var oldMonth=$week.attr("data-month");
    if(year==oldYear&&month==oldMonth)return;
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
    
    $week.attr("data-year",year).attr("data-month",month);
    $week.find('.slide-down-box').empty();
    for( var i=0; i<week_count; i++){
    	$week.find('.slide-down-box').append('<a>第'+ (i+1)+'周</a>');
    }
    $week.find("span").html("• 周");
    //$('#info').html(year + "年" + month + "月有" + week_count +"周");
}
function fnGetWeekTime($slideDownNav){
	$slideDownNav=$slideDownNav||$('.slide-down-nav');
	var _y=parseInt($slideDownNav.find('#years>span').text().replace(/[^\d]/g,''));
	var _m=parseInt($slideDownNav.find('#months>span').text().replace(/[^\d]/g,''));
	var _w=parseInt($slideDownNav.find('#weeks>span').text().replace(/[^\d]/g,''));
	if(_y>0&&_m>0&&_w>0){
		return new CustomDate(_y,_m,_w);
	}
	return false;
}
$(function(){
    //下拉菜单 
    $('#nav li').hover(function(){
        $('#nav .item').removeClass('hover');
        $(this).find('.item').addClass('hover');
        $('#nav .nav-bd').hide();
        $(this).find('.nav-bd').show();
    },function(){
        $('#nav .item').removeClass('hover');
        $('#nav .nav-bd').hide();
    });
	
	// Tab切换 
	$('.tabs .tab-list li').on('click','a',function(){
		$(this).parents('.tab-list').find('a').removeClass('active');
		$(this).addClass('active');
    	// $(this).parents('.cont').find('.tab-cont').hide().eq($('.tab-list li').index($(this).parent())).show();
		$(this).parents('.tabs').find('.tab-cont').hide().eq($(this).parents('.tabs').find('.tab-list li').index($(this).parent())).show();
		$.fn.zTree.init($("#depTree"), setting, zNodes);
    	$.fn.zTree.init($("#Tree"), setting, zNodes2);
	});
	/*$('.index-tab li').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		
	});*/

	// 下拉选择
	$('.slidedown-select li > span').click(function(e){
        $(this).parent().siblings().find('span').removeClass('active').next().slideUp('fast');
        $(this).toggleClass('active').next('.slide-down-box').slideToggle('fast');
    });
    $('.slidedown-select li .slide-down-box').on('click','a',function(e){
		$(this).closest('.slide-down-box').slideUp('fase').prev('span').text('• '+$(this).text()).removeClass('active');
        $(this).addClass('active').siblings().removeClass('active');
        
        if($(this).closest("li").is('#years')||$(this).closest("li").is('#months')){
            var _year=parseInt($(this).closest('.slidedown-select').find('#years').find('a.active').text());
            var _month=parseInt($(this).closest('.slidedown-select').find('#months').find('a.active').text());

            fnGetWeek(_year,_month,$(this).closest('.slidedown-select').find("#weeks"));
        }
    });

	// 退出
	$('#logoutA').on('click',function(){
		fnConfirm('确定要退出吗？',function(){   //确定之后的操作
			window.location.href='index_unlogin.html';
		});
	});

	// 全屏
	$('#fullscreenA').on('click',function(){
		 var WshShell = new ActiveXObject('WScript.Shell');
       	 WshShell.SendKeys('{F11}');
	});
});