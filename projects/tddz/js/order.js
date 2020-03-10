var _timeout = 600;
var _layer_timeout = 2000;
var page_redirect = false;
var cookieOrderInfo = {};
var cookieAdvistor = {};
var $imScroll = $("#im_scroll");
var $alertTips = $("#alert_tips");
var $tripOrder = $("#trip_order");

function go_trip_url(id){
    window.open('http://www.6renyou.com/xingcheng/'+id);
  }


function _pay(_sn,_id){
    page_redirect = true;
    location.href='/orderc/selectTrip?sn='+_sn+'&trip_id='+_id;
}

function setCookieAdvistor( cookieJson ) {
    var cookieStr = "";
    for(var key in cookieJson) {
        cookieStr += key + "=" + cookieJson[key] + "&&";
    }
    $.cookie('advistor_info',cookieStr, {expires:30, path:'/',domain:'.6renyou.com'});
}

function alertLayer(message) {
    $alertTips.find("div.tips-item p").text(message);
    $alertTips.show();
    setTimeout(function(){
        $alertTips.hide();
    }, _layer_timeout);
}

function scrollBottom() {
    $imScroll.animate({scrollTop:$tripOrder.height()},400);
}

function storageSave( key, value ) {
    pcOrderCookie.storageSave( key, value );
    return true;
}

//重新咨询
function newChat(){
    clearCookie();
    page_redirect = true;
    newStatus = 1;
    location.href=location.href;
}

function continueChat(){
    continueStatus = 1;
    $('div.mask-disable').hide();
}

function add_people(obj){
    var num = $(obj).prev().find("input").val();
    if(isNaN(num)){
        num = 0;
        $(obj).addClass("valuecomb_disable");
    }else{
        num = parseInt(num)+1;
        $(obj).siblings("span").removeClass("valuecomb_disable");
    }
    $(obj).prev().find("input").val(num);
}
function minus_people(obj){
    var num = $(obj).next().find("input").val();
    if(isNaN(num) || num<=1){
        num = 0;
        $(obj).addClass("valuecomb_disable");
    }else{
        num = parseInt(num)-1;
        $(obj).siblings("span").removeClass("valuecomb_disable");
    }
    $(obj).next().find("input").val(num);
}

var wx = {
    //接受的DEST，与solid_dest相比；是否有匹配
    param_dest_select_status:0,
    submit_status:0,
    first_dest_click_status:0, //目的地 第一次 点击状态
    first_child_dest_click_status:0,
    first_days_click_status:0, //天数 第一次 点击状态
    dest_click_status:0, //渲染 重新提交  确定  修改此值
    child_dest_click_status:0, //渲染 重新提交  确定  修改此值
    days_click_status:0, //渲染 重新提交  确定  修改此值
    days_type:0, //1表示可以选择天数
    solid_dest_list:""
};

wx.firstGetDestBindClick = function() {
    $("#first_pg").find("div.im-btns a.im-btn").click(function(){
        if( 1 === wx.param_dest_select_status )
            return false;
        wx.param_dest_select_status = 1;
        $(this).addClass("col-disabled");
        var _html = wx.getSolidDestHtml();
        $("#trip_order").append( _html );
        wx.secondInit();
    });
};

//固定目的地
wx.getSolidDestHtml = function() {
    var _html = [];
    _html.push('<li class="im-item me" id="second_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">您准备去什么地方旅游？</div>');
    _html.push('            <div class="city-list">');
    _html.push('                <ul class="list-row inland clearfix">');
    var destList = solidDestList["list"];
    for(var id in destList) {
        var selectStyel = "";
        if(paramDest===destList[id]) {
            selectStyel = "col-selected";
            wx.param_dest_select_status = 1;
        }
    _html.push('                    <li class="col3"><span class="col-btn '+selectStyel+'">'+destList[id]+'</span></li>');
    }
    _html.push('                </ul>');
    _html.push('                <ul class="list-row abroad clearfix">');
    var destOut = solidDestList["out"];
    for(var id in destOut) {
        var selectStyel = "";
        if(paramDest===destOut[id]) {
            selectStyel = "col-selected";
            wx.param_dest_select_status = 1;
        }
    _html.push('                    <li class="col3"><span class="col-btn '+selectStyel+'">'+destOut[id]+'</span></li>');
    }
    _html.push('                </ul>');
    _html.push('                <div class="im-change">');
    _html.push('                    <a href="javascript:void(0)" class="im-btn btn-other">其他目的地</a>');
    _html.push('                    <textarea id="destination" name="destination" class="area-txt" placeholder="在这里填写目的地" style="display:none;"></textarea>');
    _html.push('                </div>');
    _html.push('            </div>');
    _html.push('            <div class="im-btns">');
    _html.push('                <a href="javascript:void(0)" class="im-btn btn-normal">确认选择</a>');
    _html.push('            </div>');
    _html.push('            <div class="finished-sel" style="display:none;">');
    _html.push('                <div class="sel-item-l"><i class="icon-success mr5"></i>已选择</div>');
    _html.push('                <div class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></div>');
    _html.push('            </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    //提示语
    _html.push('<li class="im-item you" id="second_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    return _html.join("");
};


wx.secondInit = function(){
    wx.secondBindClick();
};

wx.paramDestOther = function() {
    if( paramDest && 0 === wx.param_dest_select_status ) {
        wx.param_dest_select_status = 1;
        $("#destination").prev().hide();
        $("#first_pg").find("div.im-btns a.im-btn").addClass("col-disabled");
        $("#destination").val( paramDest ).addClass("col-disabled").attr("disabled", true).show();
    }
    return true;
};

//第二步骤  事件
wx.secondBindClick = function() {
    var $secondPg = $("#second_pg");
    $secondPg.find("div.city-list").find("li.col3").on("click", "span", function(){
        if(1 === wx.dest_click_status || 1 === wx.first_dest_click_status)
            return false;
        var _class = $(this).attr("class");

        if( -1 === _class.indexOf("col-selected") ) {
            $(this).addClass("col-selected").parent().siblings().children().removeClass("col-selected");
            $(this).parent().parent().siblings().find("li>span").removeClass("col-selected");
        }
        else{
            $(this).removeClass("col-selected");
        }
        //隐藏input
        var $imChange = $secondPg.find("div.im-change");
        $imChange.find("a.im-btn").show().next().hide();//设定显示，input隐藏
        $("#destination").val(""); //input值空
    });

    //其它设定
    $secondPg.find("div.im-change>a.im-btn").click(function(){
        if( 1 === wx.dest_click_status || 1===wx.first_dest_click_status)
            return false;
        $(this).hide().next().show(); //设定隐藏，input显示
        $secondPg.find("div.city-list").find("li.col3>span").removeClass("col-selected"); //清除选中
    });

    var writeTips = "在这里填写目的地";
    $("#destination").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    //确定选择
    $secondPg.find("div.im-btns a.im-btn").click(function(){
        var $secondPg = $("#second_pg");
        var _length = $secondPg.find("span.col-selected").length;
        var _input = $.trim($("#destination").val());
        if( !_length && !_input ) {
            alertLayer("请选择目的地");
            return false;
        }
        $secondPg.find("div.im-change").find("a.im-btn").addClass("col-disabled");

        $secondPg.find("span.col-btn").each(function(i){
            var _class = $(this).attr("class");
            if( -1 === _class.indexOf("col-selected") ) {
                $(this).addClass("col-disabled");
            }
        });
        $("#destination").attr("disabled","disabled"); //禁用
        var _selectDest = $.trim($secondPg.find("span.col-selected").text());
        var _dest = _selectDest || _input;

        cookieAdvistor["dest"] = _dest;
        setCookieAdvistor(cookieAdvistor);

        var jsonList = $.cookie("destlist");
        if( !jsonList )
            jsonList = {"ul_index":-1, "index":-1, "other":""};
        else
            jsonList = JSON.parse( jsonList );
        $.cookie("subdestlist",null);
        $.cookie("destdays",null);
        $.cookie("triplist",null);
        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);
        if( _selectDest ) {
            var selectObj = $secondPg.find("span.col-selected"); //选择索引
            var _selectIndex = selectObj.parent("li").index(); //选择索引
            var _ulIndex = selectObj.parent().parent("ul.list-row").index();

            jsonList.index = _selectIndex;
            jsonList.ul_index = _ulIndex;
            jsonList.other = "";
        }
        else{
            jsonList.index = -1;
            jsonList.ul_index = -1;
            jsonList.other = _dest;
        }
        storageSave("destlist", jsonList );

        $("#destination").val(_dest);
        $secondPg.find("div.im-btns").hide().next().show();
        $secondPg.next().find("p").text("我想要去" + _dest);
        $secondPg.next().show();

        wx.first_dest_click_status=1;
        wx.dest_click_status = 0;
        //显示第三页
        wx.getChildDest();
    });

    $secondPg.find("div.finished-sel button.im-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        var $secondPg = $("#second_pg");
        var $imChange = $secondPg.find("div.im-change");
        $secondPg.find("div.im-btns").show().next().hide(); //重新提交隐藏
        $secondPg.find("a.im-btn").removeClass("col-disabled");
        $secondPg.find("div.city-list").find("li.col3>span").removeClass("col-disabled col-selected"); //清除选中
        $imChange.find("a.im-btn").show().next().hide();//设定显示，input隐藏
        $("#destination").val("").removeAttr("disabled").removeClass("col-disabled"); //input值空
        $secondPg.next().hide().find("p").html("&nbsp;");
        $secondPg.next().nextAll().remove();
        wx.dest_click_status = 0; //取消禁止点击
        wx.first_dest_click_status=0;

        wx.child_dest_click_status = 0; //子目的地解禁
        wx.first_child_dest_click_status = 0;

        wx.days_click_status = 0; //天数解禁
        wx.first_days_click_status = 0;
    });
    scrollBottom();
};

//第三步骤 获取子目的地
wx.getChildDest = function() {
    var _dest = $.trim( $("#destination").val() );
    $.get("/Ordercext/selectDest",{dest:_dest}, function(data){
        if( !data || $.isEmptyObject(data)) {
            alertLayer("网络连接错误，无法获取数据1");
            return false;
        }
        var _status = parseInt( data.status );
        if( 2 == _status ){

            //有下级
            var _html = wx.secondChildDest(data.data);
            $("#trip_order").append(_html);
            wx.threeInit();
        }
        else if( 1 == _status ) {

            //无下级
            wx.getRouteDays( data.data );
        }
        else if( 0 == _status ) {
            //没有此目的地
            var _html = wx.getRouteHtml( data.data.days );
            $("#trip_order").append(_html);
            wx.fourInit();
            //没有目的地，直接天数
        }
        else{
            //错误
            alertLayer("应用程序错误");
            return false;
        }
    }, "json");
};

//获取上一级已经选择或填写的目的地
wx.getSelectDest = function() {
    var selectDest = [];
    $("#second_pg").find("li.col3>span").each(function(){
        var _class = $(this).attr("class");
        if( -1 !== _class.indexOf("col-selected") ) {
            selectDest.push($(this).text());
        }
    });
    var _dest = selectDest.join(",");
    var _otherDest = $.trim( $("#destination").val() );
    var _dest = _dest || _otherDest;
    return _dest;
};

//子目的
wx.secondChildDest = function( _data ) {
    var _dest = this.getSelectDest();

    var jsonList = JSON.parse($.cookie("subdestlist"));
    if( !jsonList ) {
        jsonList = {"list": _data, "index":-1, "other":""};
        storageSave( "subdestlist", jsonList );
    }

    var _html = [];
    _html.push('<li class="im-item me" id="three_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">'+_dest+'有多个景区，您想去哪几个？<span class="c9">(可多选)</span></div>');
    _html.push('        <div class="city-list">');
    _html.push('            <ul class="list-row clearfix">');
    for(var id in _data){
    _html.push('                <li class="col2"><span class="col-btn" rel="'+id+'">'+_data[id]+'</span></li>');
    }
    _html.push('                <!--li class="col2"><span class="col-btn igreen">更多...</span></li-->');
    _html.push('            </ul>');
    _html.push('            <div class="im-change">');
    _html.push('                <a href="javascript:void(0)" class="im-btn btn-other" style="display:none;">其他目的地</a>');
    _html.push('                <input name="child_dest" id="child_dest" type="text" class="ipt-txt" maxleng="50" placeholder="在这里填写其它目的地" value="" style="display: block;"/>');
    _html.push('            </div>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="submit">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display:none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('                <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('                <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="three_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

//第三部，初始化字目的地
wx.threeInit = function() {
    this.threeBindClichk();
};

wx.threeBindClichk = function() {
    var $threePg = $("#three_pg");
    var _otherBtn = $threePg.find("a.im-btn");
    //字目的地选择
    $threePg.find("li.col2").on("click", "span", function(){
        if( 1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status )
            return false;
        var _class = $(this).attr("class");
        if( -1 === _class.indexOf("col-selected") )
            $(this).addClass("col-selected");
        else{
            $(this).removeClass("col-selected");
        }
        //_otherBtn.hide().next().show().val("");
    });

    //其它设定
    _otherBtn.bind("click", function(){
        if( 1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status)
            return false;
        $threePg.find("li.col2>span").removeClass("col-selected");
        $(this).hide().next().show();
    });

    var writeTips = "在这里填写其它目的地";
    $("#child_dest").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    //重新提交
    $threePg.find("button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        var $imChange = $threePg.find("div.im-change");
        $threePg.find("li.col2>span").removeClass("col-selected col-disabled");
        $threePg.find("div.im-btns").show().next().hide(); //确认选择
        //互斥屏蔽
        //$imChange.children().removeClass("col-disabled"); //其它、input禁用
        //$imChange.children().first().show().next().removeAttr("disabled").hide();
        $("#child_dest").val("").removeClass("col-disabled").removeAttr("disabled");
        $threePg.next().hide().find("p").html("&nbsp;");
        //wx.threeBindClick();
        $threePg.next().nextAll().remove();

        wx.child_dest_click_status = 0; //子目的地解禁
        wx.first_child_dest_click_status = 0;

        wx.days_click_status = 0; //天数解禁
        wx.first_days_click_status = 0;
    });
    //确定选择
    $threePg.find("div.im-btnss button.im-btn").click(function(){
        var _childDest = '';
        var _dest = "";
        var ArrIndex = [];

        var jsonList = JSON.parse( $.cookie("subdestlist") ); //subdestlistselect  本地化存储
        var length  = $threePg.find("li.col2>span.col-selected").length;
        if( 0 === length ) {
            _dest = $.trim($("#child_dest").val());
            if( paramDest )
                _dest = paramDest;
            if( !_dest ) {
                alertLayer("请填写或选择目的地");
                return false;
            }

            jsonList.index = -1;
            jsonList.other = _dest;

            _childDest = _dest;

            $.get("/route/getdays/", {dest:_dest}, function(data){
                if( !data || $.isEmptyObject( data ) ) {
                    alertLayer("获取天数失败");
                    return false;
                }
                if( data.status && 1 == parseInt( data.status )) {
                    var _html = wx.getRouteHtml( data.data );
                }
                else{
                    var _html = wx.getRouteHtml( [] );
                }
                $("#trip_order").append(_html);
                wx.fourInit();
                /*var _html = wx.getFiveHtml( data.data.data );
                $("ul.im-list").append(_html);
                wx.fiveInit();*/
            },"json");
        }
        else{
            var destList = [];
            var destIds = [];
            var ArrIndex = [];
            $threePg.find("li.col2>span").each(function(i){
                var _class = $(this).attr("class");
                if( -1 !== _class.indexOf("col-selected") ) {
                    destList.push($.trim( $(this).text() ) );
                    destIds.push($(this).attr("rel"));
                    ArrIndex.push( $(this).parent().index() );
                }
            });

            var _selectDest = destList.join(",");
            var _ids = destIds.join(",");
            if( !_selectDest ) {
                alertLayer("请选择或填写目的地");
                return false;
            }
            _childDest = _selectDest;
            $("#child_dest").val(_ids);

            //subdestlistselect  本地化存储
            if( ArrIndex.length > 0 ) {
                var indexs = ArrIndex.join(",");
                jsonList.index = indexs;
                jsonList.other = "";
            }
            //end
            if(destIds.length > 1) {
                var _json = {"id":_ids};
                wx.getRouteDays( _json, "/route/getDaysMoreDest" ); //子目的地线路
            }
            else{
                var _json = {"id":_ids};
                wx.getRouteDays( _json ); //子目的地线路
            }
        }
        jsonList.other = ( -1 !== jsonList.index ) ? "" : _dest;

        $.cookie("destdays",null);
        $.cookie("triplist",null);

        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);
        storageSave("subdestlist", jsonList); //本地存储


        wx.first_child_dest_click_status = 1;
        wx.child_dest_click_status = 0;

        $threePg.find("li.col2>span").each(function(i){
            var _class = $(this).attr("class");
            if( -1 === _class.indexOf("col-selected") ) {
                $(this).addClass("col-disabled");
            }
        });
        $threePg.find("div.im-change").children().addClass("col-disabled"); //其它、input禁用
        $(this).parents("div.im-btns").hide().next().show(); //上下需要优化
        $threePg.next().show().find("p").text("我想要去" + _childDest);
    });

    wx.threeChildDestConfirm();

    scrollBottom();
};

wx.threeChildDestConfirm = function( ) {
    var $threePg = $("#three_pg");
    $("#three_pg").find("div.im-btns button.im-btn").click(function(){
        if(1 === wx.child_dest_click_status || 1 === wx.first_child_dest_click_status)
            return false;
        var jsonList = JSON.parse( $.cookie("subdestlist") ); //subdestlistselect  本地化存储
        var destText = []; //文本
        var ids = []; //ID
        var other = $.trim( $("#child_dest").val() ); //
        var otherId = "";
        var childDest = "";
        var ArrIndex = [];
        var $selected = $threePg.find("li.col2>span.col-selected");
        var length = $selected.length;
        if( !other && 0 === length ) {
            alertLayer("请选择或填写目的地");
            return false;
        }
        wx.first_child_dest_click_status = 1;

        $threePg.find("li.col2>span").each(function(i){
            var _text = $.trim( $(this).text() );
            var _id = $(this).attr("rel");
            var _class = $(this).attr("class");
            var _num = _class.indexOf("col-selected");
            var _index = $(this).index();

            if( -1 !== _num ) {
                destText.push(_text);
                ids.push( _id );
                ArrIndex.push(_index);
            }
            else{
                $(this).addClass( "col-disabled" );
            }
            if( other == _text &&  -1===_num ) {
                destText.push( _text );
                ids.push( _id );
            };
        });
        $("#child_dest").addClass("col-disabled").attr("disabled", true);

        //本地化
        if( ArrIndex.length > 0)
            jsonList.index = ArrIndex.join(",");
        jsonList.other = other;

        $.cookie("destdays",null);
        $.cookie("triplist",null);
        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);
        storageSave("subdestlist", jsonList);

        $threePg.find("div.im-btns").hide().next().show();
        if( length > 0 ) {
            childDest = destText.join(",")
            if( other && -1 === $.inArray(other, destText) ) {
                childDest += "," + other;
                var _html = wx.getRouteHtml( [] );
                $("#trip_order").append(_html);
                wx.fourInit();
            }
            else{

                var _ids = ids.join(",");
                if( ids.length > 1 ) {
                    var _json = {"id":_ids};
                    wx.getRouteDays( _json, "/route/getDaysMoreDest" ); //子目的地线路
                }
                else{
                    var _json = {"id":_ids};
                    wx.getRouteDays( _json ); //子目的地线路
                }
            }

            cookieAdvistor["dest"] = childDest;
            setCookieAdvistor(cookieAdvistor);
            $threePg.next().show().find("p").text( "我想要去" + childDest );
        }
        else{
            cookieAdvistor["dest"] = other;
            setCookieAdvistor(cookieAdvistor);
            $threePg.next().show().find("p").text( "我想要去" + other );
            //填写
            $.get("/route/getdays/", {dest:other}, function(data){
                if( !data || $.isEmptyObject( data ) ) {
                    alertLayer("获取天数失败");
                    return false;
                }
                if( data.status && 1 == parseInt( data.status )) {
                    var _html = wx.getRouteHtml( data.data );
                }
                else{
                    var _html = wx.getRouteHtml( [] );
                }
                $("#trip_order").append(_html);
                wx.fourInit();
            },"json");
        }

    });
};

//第四步骤 天数
//{dest:data.id, type:"days"}
wx.getRouteDays = function(data, url) {
    url = url || "/route/getdays/";
    $.get(url, { dest:data.id }, function(data){
        if( !data || $.isEmptyObject( data ) ) {
            alertLayer("获取天数失败");
            return false;
        }
        if( data.status && 1==parseInt(data.status) ){
            var _html = wx.getRouteHtml( data.data );
            $("#trip_order").append(_html);
            wx.fourInit();
        }
    }, "json");
};

//天数HMTL
wx.getRouteHtml = function ( data ) { //获取天数
    var jsonList = $.cookie( "destdays" );
    if( !jsonList ) {
        jsonList = {"list":data, "index":-1, "other":""};
        storageSave("destdays", jsonList ); //天数
    }

    var _html = [];
    _html.push('<li class="im-item me" id="four_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">游玩天数</div>');
    _html.push('        <div class="city-list">');
    _html.push('            <ul class="list-row clearfix">');
    for( var day in data ) {
        wx.days_type = 1;
    _html.push('                <li class="col3"><span class="col-btn"><i class="f24" rel="'+data[day]+'">'+day+'</i>天</span></li>');
    }
    _html.push('            </ul>');
    _html.push('            <div class="im-change">');
    _html.push('                <a href="javascript:void(0)" class="im-btn btn-other">自己设定</a>');
    _html.push('                <input name="set_days" id="set_days" type="text" class="ipt-txt" placeholder="在这里填写游玩天数" value="" style="display:none;"/>');
    _html.push('            </div>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="button">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display:none;">');
    _html.push('            <div class="sel-item-l"><i class="icon-success mr5"></i>已选择</div>');
    _html.push('            <div class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></div>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="four_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    return _html.join("");
};

wx.fourInit = function() {
    scrollBottom();
    this.fourBindClick();
    this.showInput();
};

//选择天数不存在；只能填写天数
wx.showInput =function() {
    var $fourPg = $("#fout_pg");
    if( 1 === wx.days_type ) { //有选择天数
        //$fourPg.find("div.im-btns").show().next().hide();
        $("#set_days").siblings().show(); //其它设定隐藏
        $("#set_days").hide();
    }
    else{
        $("#set_days").siblings().hide(); //其它设定隐藏
        $("#set_days").show();
    }
};

//天数事件绑定
wx.fourBindClick = function() {
    var $fourPg = $("#four_pg");
    //天数选择
    $fourPg.find("li.col3>span").bind("click", function() {
        if( 1===wx.days_click_status || 1===wx.first_days_click_status )
            return false;
        var _class = $(this).attr("class");
        if( -1 === _class.indexOf("col-selected") ){
            $(this).addClass("col-selected").parent().siblings().children("span").removeClass("col-selected");
        }
        else{
            $(this).removeClass("col-selected");
        }
        $fourPg.find("a.im-btn").show().next().hide().val("");
    });
    //确认选择
    $fourPg.find("div.im-btns button.im-btn").click(function(){
        var selectDays = $(this).parent().siblings(".city-list").find(".col-selected>i").text();
        var setDays = $.trim( $("input[name=set_days]").val() );
        var selectIndex = null;
        var days = selectDays || setDays;
        days = isNaN( days ) ? 0 : parseInt( days );

        if( !days ) {
            alertLayer( "请选择或指定天数" );
            return false;
        }
        if( isNaN( days ) || !/^\d{1,3}$/.test(days) ) {
            alertLayer("请输入数字，数字长度请限制在3位");
            return false;
        }

        wx.first_days_click_status = 1;
        wx.days_click_status = 0;

        //隐藏并禁用
        $fourPg.find("div.im-btns").hide().next().show();
        $fourPg.find("li.col3>span").each(function(i){
            var _class = $(this).attr("class");
            if( -1 === _class.indexOf("col-selected") ) {
                $(this).addClass("col-disabled");
            }
            else{
                selectIndex = $(this).parent().index();
            }
        });

        $("#set_days").addClass("col-disabled").attr("disabled", true);
        $("#set_days").siblings().addClass("col-disabled").attr("disabled", true);

        selectDays = isNaN( selectDays ) ? 0 : parseInt( selectDays );
        //本地化存储
        $.cookie("triplist",null);
        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);

        var jsonList = JSON.parse($.cookie("destdays"));
        if( selectDays ){
            jsonList.index = selectIndex;
            jsonList.other = "";
            $("#set_days").val( selectDays );
        }
        else{
            jsonList.index = -1;
            jsonList.other = days;
        }
        storageSave( "destdays", jsonList );

        if( selectDays ){

            $("#set_days").val( selectDays );
        }

        cookieAdvistor["days"] = days;
        setCookieAdvistor(cookieAdvistor);
        $fourPg.next().show().find("p").text( "我选择了"+days+"天的行程" );
        wx.getTripList();
    });
    //天数设定
    $fourPg.find("div.im-change a.im-btn").bind("click", function(){
        if( 1 === wx.days_click_status || 1 === wx.first_days_click_status )
            return false;
        $fourPg.find("li.col3>span").removeClass("col-selected");
        $(this).hide().next().show().val("");
    });

    var writeTips = "在这里填写游玩天数";
    $("#set_days").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    //重新提交
    $fourPg.find("div.finished-sel button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        wx.first_days_click_status = 0;
        wx.days_click_status = 0;
        $fourPg.find("div.im-btns").show().next().hide();
        $fourPg.find("li.col3>span").removeClass("col-selected col-disabled");
        var length = $("#four_pg").find("li.col3>span").length;
        var $imChange = $fourPg.find("div.im-change");
        if( length > 0 ) {
            $imChange.find("a.im-btn").removeClass("col-disabled").show();
            $imChange.find("input").removeAttr("disabled").hide().removeClass("col-disabled");
        }
        else{
            $imChange.find("a.im-btn").removeClass("col-disabled").hide();
            $imChange.find("input").removeAttr("disabled").removeClass("col-disabled").show();
        }

        $fourPg.next().hide().find("p").text("&nbsp;");
        $fourPg.next().nextAll().remove();
    });
};
//获取天数
wx.getSelectDays = function(){
    return $.trim($("#set_days").val()) || 0;
}

//得到线路行程单
wx.getTripList = function(){
    var $fourPg = $("#four_pg");
    var days = 0;
    var routeIds = null;
    var length = $fourPg.find("li.col3>span").length;
    if( 0 == length ) {
        //直接人数
        wx.getSixPepleHtmlCode();
        return false; //不返回，导致两个人数
    }
    else{
        var $colSelected = $fourPg.find("li.col3>span.col-selected");
        var selectLen = $colSelected.length;
        if( selectLen > 0 ){
            days = $colSelected.find("i").text();
            days = isNaN( days ) ? 0 : parseInt( days );
            routeIds = $colSelected.find("i").attr("rel");
        }
    }
    if( 0 == days ){
        //本地化存储
        var jsonList = JSON.parse( $.cookie("destdays") );
        days = $.trim( $("#set_days").val() );
        $fourPg.find("li.col3>span").each(function(i) {
            var tempDay = $.trim( $(this).children("i").text() );
            if( days === tempDay ) {
                routeIds = $(this).find("i").attr("rel");

                jsonList.index = $(this).parent().index();
                jsonList.other = '';
            }
        });
        storageSave("destdays", jsonList);
    }
    if( !routeIds ) {
        //直接人数
        wx.getSixPepleHtmlCode();
    }
    else{
        $.get("/route/getTripList/", {"id":routeIds}, function( data ){
            if( data.status && 1==parseInt(data.status) ){
                var _html = wx.getFiveHtml(data.data);
                $("#trip_order").append(_html);
                wx.fiveInit();
                return true;
            }
            //直接人数
            wx.getSixPepleHtmlCode();
        }, "json");
    }

};

//第五步骤  行程单
wx.getFiveHtml = function(data) {
    var len = 0;
    for(var key in data) {
        len+=1;
    }

    var jsonList = $.cookie( "triplist" );
    if( !jsonList ) {
        jsonList = {"len":len, "list":data, "index":-1, "other":""};
    }
    else{
        jsonList = JSON.parse( jsonList );
        jsonList.list = data;
    }
    storageSave("triplist",jsonList ); //保存天数筛选出来的数据

    var _html = [];

    _html.push('<li class="im-item me" id="five_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">为您推荐了<span class=" corange">'+len+'个参考行程</span></div>');
    _html.push('        <div class="jour-cont">');
    _html.push('            <ul class="jour-list">');
    var loop = 0;
    for(var routeid in data){
        loop+=1;
        var arrRow = data[routeid];
    _html.push('                <li class="jour-item clearfix">');
    _html.push('                    <div class="jour-tit"><span class="j-xc-num">行程'+loop+'</span><a href="/xingcheng/'+routeid+'" target="_blank">'+arrRow.title+'</a></div>');
    _html.push('                    <div class="jour-cost">参考价格：<i class="jour-price">'+arrRow.min_cost+'～'+arrRow.max_cost+'</i>元 <span class="clude-txt">不含往返大交通</span></div>');
    _html.push('                    <div class="jour-wp clearfix">');
    _html.push('                        <div class="jour-img"><a href="/xingcheng/'+routeid+'" target="_blank"><img src="'+arrRow.img+'" width=220 height=145/></a></div>');
    _html.push('                        <div class="jour-line">');
    _html.push('                            <div class="jour-dw">');
    _html.push('                                <div class="jour-line-list">');
    var detail = arrRow.detail;
    for( var day in detail ) {
    _html.push('                                    <dl class="j-day-dl">');
    _html.push('                                        <dt>DAY'+day+'</dt>');
    _html.push('                                        <dd>'+detail[day]+'</dd>');
    _html.push('                                    </dl>');
    }
    _html.push('                                </div>');
    _html.push('                                <p class="pt10"><a href="javascript:void(0)" class="j-more">查看更多...</a></p>');
    _html.push('                            </div>');
    _html.push('                            <div class="jour-btns">');
    _html.push('                                <div class="left col2"><a href="/xingcheng/'+routeid+'" target=_blank class="im-btn btn-yellow mr15">查看详细</a></div>');
    _html.push('                                <div class="left col2"><a href="javascript:void(0)" class="im-btn btn-green" rel="'+routeid+'">参考并询价</a></div>');
    _html.push('                            </div>');
    _html.push('                        </div>');
    _html.push('                    </div>');
    _html.push('                </li>');
    }//end
    _html.push('                </ul>');
    _html.push('            </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <span class="im-txt">都不符合我的要求，请</span>');
    _html.push('            <a href="javascript:;" class="im-btn btn-normal">重新帮我规划一个</a>');
    _html.push('            <input type="hidden" name="trip_id" id="trip_id" value="">');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    _html.push('<li class="im-item you" id="five_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

wx.fiveInit = function() {
    wx.fiveBindClick();
};

//第五步骤 绑定事件
wx.fiveBindClick = function() {
    var $fivePg = $("#five_pg");
    var jsonList = JSON.parse( $.cookie("triplist") ); //本地化存储
    $fivePg.find("li.jour-item a.btn-green").click(function(){
        if( 1 === wx.submit_status )
            return false;
        $("#trip_id").val($(this).attr("rel"));
        //本地化
        var selectIndex = $(this).parent().parent().parent().index();
        jsonList.other = "";
        jsonList.index = selectIndex; //本地化存储
        storageSave("triplist", jsonList);

        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);

        $fivePg.find("div.col2 a.btn-green").removeClass("col-selected");
        $(this).addClass("col-selected");

        var _text = $(this).parents("div.jour-wp").siblings("div.jour-tit").find("span").text();
        $fivePg.next().nextAll().remove();
        $fivePg.next().show().find("p").text("请对"+_text+"帮我报价");
        var _html = wx.sixOrderHtml();
        $("#trip_order").append(_html);
        wx.sixInit();
    });

    //详细行程显示和隐藏
    $fivePg.find("li.jour-item").each(function(i){
        $(this).find("div.jour-line-list").children("dl:gt(3)").hide();
        $(this).find("div.jour-dw").find("p>a").click(function(){
            //if( 1 === wx.submit_status )
            //    return false;
            var _text = $(this).text();
            if( -1 === _text.indexOf("更多") ) {
                $(this).text("查看更多...");
                $(this).parent().siblings("div.jour-line-list").children("dl:gt(3)").hide();
            }
            else{
                $(this).parent().siblings("div.jour-line-list").children("dl:gt(3)").show();
                $(this).text("点击收起");
            }
        });
    });

    //都不符合要求
    $fivePg.find("div.im-btns>a.im-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        //本地存储
        var jsonList = JSON.parse( $.cookie("triplist") ); //本地化存储
        jsonList.index = -1;
        jsonList.other = "next";
        storageSave("triplist", jsonList);

        $.cookie("peoplenum", null);
        $.cookie("userinfo", null);

        $fivePg.find("div.col2 a.btn-green").removeClass("col-selected");
        $(this).next().val(""); //input值空
        $fivePg.next().hide().find("p").text("&nbsp;");
        $fivePg.next().nextAll().remove();
        var _html = wx.sixOrderHtml();
        $("#trip_order").append(_html);
        wx.sixInit();
    });

    scrollBottom();
};

//第六步骤  人数
wx.getSixPepleHtmlCode = function() {
    var _html = wx.sixOrderHtml();
    $("#trip_order").append( _html );
    wx.sixInit();
};
//人数界面
wx.sixOrderHtml = function(){
    var _html = [];
    _html.push('<li class="im-item me" id="six_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">请提供您的人数和服务要求</div>');
    _html.push('        <div class="im-form">');
    _html.push('            <ul class="form-list">');
    _html.push('                <li>');
    _html.push('                    <h3>几个人出游：</h3>');
    _html.push('                    <div class="fRight">');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">成人</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease"></span>');
    _html.push('                                <span class="ct"><input name="adult_num" id="adult_num" type="text" class="textbox" value="1"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                        </div>');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">儿童</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease valuecomb_disable"></span>');
    _html.push('                                <span class="ct"><input name="child_num" id="child_num" type="text" class="textbox" value="0"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                            <span class="peptxtsmall">0-11岁</span>');
    _html.push('                        </div>');
    _html.push('                        <div class="pepnum">');
    _html.push('                            <span class="peptxt">老人</span>');
    _html.push('                            <div class="valuecomb">');
    _html.push('                                <span class="decrease valuecomb_disable"></span>');
    _html.push('                                <span class="ct"><input name="old_num" id="old_num" type="text" class="textbox" value="0"/></span>');
    _html.push('                                <span class="increase"></span>');
    _html.push('                            </div>');
    _html.push('                            <span class="peptxtsmall">65岁以上</span>');
    _html.push('                        </div>');
    _html.push('                    </div>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>其它要求：</h3>');
    _html.push('                    <div class="fRight">');
    _html.push('                        <textarea name="trip_content" id="trip_content" class="area-txt" placeholder="在这里填写您的要求"/></textarea>');
    _html.push('                    </div>');
    _html.push('                </li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button href="javascript:;" class="im-btn btn-normal" type="button">确认提交</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display: none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('               <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('               <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('           </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="six_tips" style="display: none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};

wx.sixInit = function(){
    wx.sixBindClick();
};

wx.sixBindClick = function(){
    $sixPg = $("#six_pg");
    $sixPg.find("button.im-btn").click(function(){
        var total = 0;
        $sixPg.find("input").each(function(i){
            var num = $(this).val();
            num = num || 0;
            total += (isNaN(num) ? 0 : parseInt(num));
        });
        if( total<1 ) {
            alertLayer("请指定成人或儿童、老人的人数");
            return false;
        }
        $sixPg.find("input").attr("disabled", "disabled");
        $("#trip_content").attr("disabled", "disabled");
        $(this).parent().hide().next().show();
        $sixPg.next().show().find("p").text("我们一共"+total+"个人");
        //storage.removeItem("userinfo");
        wx.localSavePeple(); //人数本地存储数据
        var _html = wx.getContactHtml();
        $("#trip_order").append(_html);
        wx.sevenInit();
    });

    var writeTips = "在这里填写您的要求";
    $("#trip_content").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    $sixPg.find("button.resel-btn").click(function(){
        if( 1 === wx.submit_status )
            return false;
        $sixPg.find("input.num-value-txt").removeAttr("disabled").removeClass("col-disabled");
        $sixPg.find("textarea[name=trip_content]").removeAttr("disabled").removeClass("col-disabled");
        $sixPg.find("span.cui-number-ma").removeClass("cui-disabled");
        //$(this).parents(".finished-sel").hide().prev().show(); //原
        $(this).parent().parent().parent().hide().prev().show();
        $sixPg.next().hide().find("p").text("&nbsp;");
        $sixPg.next().nextAll().remove();

        $sixPg.find("span.num-minus").attr("onclick", "minus_people(this);");
        $sixPg.find("span.num-add").attr("onclick", "add_people(this);");
    });

    $sixPg.find("span.decrease").attr("onclick", "minus_people(this);");
    $sixPg.find("span.increase").attr("onclick", "add_people(this);");

    scrollBottom();
};

//本地化
wx.localSavePeple = function() {
    var adult = $("#adult_num").val();
    var child = $("#child_num").val();
    var old = $("#old_num").val();
    var content = $("#trip_content").val();
    $.cookie("userinfo", null);
    var peoplenum = {"adult":adult, "child":child, "old":old, "content":content};
    storageSave("peoplenum", peoplenum);
    return true;
};


//第七步骤；姓名和手机
wx.getContactHtml = function(){
    var _html = [];
    _html.push('<li class="im-item me" id="seven_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="im-title">请留下您的联系方式，方便报价过程中和您沟通</div>');
    _html.push('        <div class="im-form">');
    _html.push('            <ul class="form-list">');
    _html.push('                <li>');
    _html.push('                    <h3>您的称呼：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                            <input type="text" class="ipt-txt" name="username" id="username" maxlength="20" id="" placeholder="请输入您的称呼" value="">');
    _html.push('                     </span>');
    _html.push('                </li>');
    _html.push('                <li>');
    _html.push('                    <h3>联系方式：</h3>');
    _html.push('                    <span class="fRight">');
    _html.push('                        <input type="text" class="ipt-txt" name="contact" id="contact" maxlength="20" placeholder="请输入您的手机号码" value="">');
    _html.push('                    </span>');
    _html.push('                </li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <div class="im-btns">');
    _html.push('            <button class="im-btn btn-normal" type="button">确认选择</button>');
    _html.push('        </div>');
    _html.push('        <div class="finished-sel" style="display: none;">');
    _html.push('            <ul class="finished-sel-list">');
    _html.push('                <li class="sel-item-l"><i class="icon-success mr5"></i>已选择</li>');
    _html.push('                <li class="sel-item-r"><button class="im-btn resel-btn" type="button">重新提交</button></li>');
    _html.push('            </ul>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    _html.push('<li class="im-item you" id="seven_tips" style="display:none;">');
    _html.push('    <div class="im-content">');
    _html.push('        <div class="im-info">');
    _html.push('            <p class="im-you-txt">&nbsp;</p>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');
    return _html.join("");
};


wx.sevenInit = function() {
    wx.sevenBindClick();
};


wx.sevenBindClick = function () {
    var $sevenPg = $("#seven_pg");
    $sevenPg.find("div.im-btns button.im-btn").click(function() {
        var _contact = $.trim($("#contact").val()) || '';
        var mobile =  /^13[0-9]{9}|15[0-9]{9}|18[0-9]{9}$/;
        if( !_contact  || !mobile.test(_contact)) {
            alertLayer("请填写您的手机号码");
            return false;
        }
        var _username = $.trim($("#username").val()) || '';
        if( !_username ) {
            alertLayer("请填写您的姓名");
            return false;
        }
        wx.saveUserInfo(); //用户信息，本地化存储
        $("#username").addClass("col-disabled").attr("disabled", true);
        $("#contact").addClass("col-disabled").attr("disabled", true);
        $(this).parent().hide().next().show();
        //$sevenPg.next().show("slow").find("p").text("我的联系方式是"+_contact+"，我的称呼是" + _username);
        //Ajax
        wxAjax.saveOrder();
    });
    $sevenPg.find("div.finished-sel button.resel-btn").click(function() {
        if( 1 === wx.submit_status )
            return false;
        $("#username").removeClass("col-disabled").removeAttr("disabled");
        $("#contact").removeClass("col-disabled").removeAttr("disabled");

        $sevenPg.find("div.finished-sel").hide().prev().show();
        $sevenPg.next().hide().find("p").text("&nbsp;");
        $sevenPg.next().nextAll().remove();
    });

    var writeTips = "请输入您的称呼";
    $("#username").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips);
            }
        }
    });

    writeTips2 = "请输入您的手机号码";
    $("#contact").bind({
        focus:function() {
            var _tips = $(this).attr("placeholder");
            if( _tips == writeTips2 ) {
                $(this).attr("placeholder", "");
            }
        },
        blur:function() {
            var _value = $.trim($(this).val());
            if( !_value ) {
                $(this).attr("placeholder", writeTips2);
            }
        }
    });

    scrollBottom();
};

wx.saveUserInfo = function() {
    var realname = $("#username").val() || "";
    var mobile = $("#contact").val() || "";
    var userinfo = {"realname":realname, "mobile":mobile};
    storageSave( "userinfo", userinfo );
    return true;
};

//订单重新提交后，可以清除cookie
wx.submitOkBindResetClick = function() {
    $tripOrder.find("div.finished-sel button.resel-btn").click(function() {
        mastDisableStatus = 1;
        $("#mask_disable").show();
    });
};

var wxAjax = {
    getDays:function(){
        return $.trim($("#set_days").val()) || 0;
    },
    getOrderId:function() {
        return $.trim($("input[name=order_id]").val()) || "";
    },
    getAdult:function() {
        return $.trim($("#adult_num").val()) || 0;
    },
    getChild:function() {
        return $.trim($("#child_num").val()) || 0;
    },
    getOld:function() {
        return $.trim($("#old_num").val()) || 0;
    },
    getDest:function() {
        var _childDest = $.trim($("#child_dest").val()) || "";
        var _dest = $.trim($("#destination").val()) || "";
        if( !_dest || _childDest ) {
            alertLayer("获取目的地错误");
            return false;
        }
        if( !_childDest ) {
            _dest = _childDest;
        }
        return _dest;
    },
    getDestText:function() {
        var $threePg = $("#three_pg");
        var _dest = $.trim($("#second_pg").find("li.col3>span.col-selected").text()) || $.trim($("#destination").val());
        var _childDest = '';
        var listDest = [];
        var childNum = $threePg.find("li.col2>span.col-selected").length;
        if( childNum>0 ){
            $threePg.find("li.col2>span.col-selected").each(function(){
                listDest.push($.trim($(this).text()) );
            });

        }

        var childOther = $.trim($("#child_dest").val()) || "";
        if( childOther ) {
            listDest.push( childOther );
            _childDest = listDest.join( "," );
        }

        _dest = (_childDest || _dest);
        return _dest;
    },
    getContact:function() {
        return $.trim($("#contact").val()) || "";
    },
    getUsername:function() {
        return $.trim($("#username").val()) || "";
    },
    getTripId:function(){
        var _tripId = $.trim($("#trip_id").val()) || 0;
        return isNaN(_tripId) ? 0 : parseInt(_tripId);
    },
    getToken:function() {
        return $.trim($("#token").val());
    },
    getTripContent:function(){
        return $.trim( $( "#trip_content" ).val() );
    },
    saveOrder:function() {

        var token = this.getToken();
        if( !token ) {
            alertLayer("请先刷新页面，否则订单不允许提交");
            return false;
        }
        var _mobile = this.getContact();
        var params = {"order_id":this.getOrderId(),"dest":this.getDestText(),"adult":this.getAdult(),"child":this.getChild(),"old":this.getOld(),"oid":this.getTripId(),"mobile":_mobile,"realname":this.getUsername(),days:this.getDays(),token:this.getToken(),user_demand:this.getTripContent()};

        $.post("/ordercext/saveorder", params, function(data){
            if( !data || $.isEmptyObject( data ) ) {
                alertLayer("订单提交失败1");
                $("#seven_pg").next().hide().find("p").text("");
                return false;
            }

            if( 1 == data.status ) {
                wx.submitOkBindResetClick();
                wxAjax.saveOrderCallback( data.data );
                return true;
            }
            else{
                alertLayer("订单提交失败2");
                $("#eight_pg").next().hide().find("p").text("");
               return false;
            }
        },"json");
    }
};

wxAjax.saveOrderCallback = function( json ) {
    //获取右侧订单信息
    //var _username = wxAjax.getUsername();
    var _contact = wxAjax.getContact();
    //$("#seven_pg").next().show("slow").find("p").text("我的联系方式是"+_contact+"，我的称呼是" + _username);

    zoomOrderSn =  json.order_sn;
    json.mobile = _contact;
    $("#order_id").val( json.order_sn );
    imChat.orderId = json.order_id;
    storageSave( "submitorder", JSON.stringify( json ) );
    $("#token").val("");

    wxAjax.clearCookie();
    imChat.getRightOrderInfo( json.order_sn );

    wx.submit_status = 1;
    imChat.resetChatBox( 1 ); //显示留言
    imChat.getPreMsg(); //获取留言前10条

    return true;
};

wxAjax.clearCookie = function() {
    cookieList = pcOrderCookie.cookieList;
    for( var i in cookieList ) {
        if( "submitorder" == cookieList[i] )
            continue;
        storageSave( cookieList[i], null );
    }
};

wx.eightSiteTips = function() {
    var _html = [];
    _html.push('<li class="im-item me" id="eight_pg">');
    _html.push('    <div class="im-content max-wrap">');
    _html.push('        <div class="thanks-cont">');
    _html.push('            <div class="thanks-top">');
    _html.push('                <div class="thank-flag"><span class="thank-icon"></span></div>');
    _html.push('                <div class="thank-txt">感谢您选择隐居网团队定制服务!</div>');
    _html.push('            </div>');
    _html.push('            <div class="thanks-dw">');
    if(  this.isChkWorktime() ){
    _html.push('                <p class="c9">1对1旅行管家已经收到您的定制需求，会和您电话沟通细节和初步行程报价。<i class="igreen">0571-56050351</i>，请注意接听。</p>');
    }
    else{
    _html.push('                <p class="c9">我们会在工作时间和您电话沟通细节和初步行程报价。<i class="igreen">0571-56050351</i>，请注意接听。</p>');
    }
    _html.push('            </div>');
    _html.push('        </div>');
    _html.push('        <span class="chat-triangle"></span>');
    _html.push('    </div>');
    _html.push('</li>');

    return _html.join("");
};

wx.isChkWorktime = function() {
    var _hour = $.trim( $("#server_hour").val() ) || "";
    if( !_hour || isNaN( _hour ) ) {
        var date = new Date();
        var tempHour = date.getHours();
        var tempMim = date.getMinutes();
        _hour = tempHour + "." + tempMim;
    }
    _hour = parseFloat( _hour );
    if( _hour>=9.0 && _hour <= 18.0 ) {
        return true;
    }
    return false;
};

wx.eightInit = function(){
    scrollBottom();
};

wx.tripInputParams = function( json ){
    var dest = !json.destination ? "" : $.trim( json.destination );
    var days = isNaN( json.days ) ? 0 : parseInt(json.days);

    var jsonList = JSON.parse( $.cookie("triplist") );
    jsonList.trip_id = paramTripId;
    jsonList.dest = dest;
    jsonList.days = days;
    storageSave("triplist", jsonList);

    cookieAdvistor["dest"] = dest;
    cookieAdvistor["days"] = days;
    setCookieAdvistor(cookieAdvistor);

    var _html = [];
    _html.push('<br><input type="hidden" name="destination" id="destination" value="'+dest+'">');
    _html.push('<br><input type="hidden" name="set_days" id="set_days" value="'+days+'">');
    $("#token").after( _html.join("") );
    return true;
};

var imChat = {
    tipNumTime:0, //
    tipNumTitle:document.title,
    tipNumTimer:null,
    tipNum:0,
    firstId:0,
    lastId:0,
    orderId:0, //订单编号
    noReadTimes:0, //总循环次数
    noReadLoading:0, //AJAX状态；1请求；0中断
    noReadInterval:3000,
    isLine:0, //客服是否在线
    preReadScrollType:0, //点击更多状态
    preReadStatus:0, //reload状态，1跳过eight_pg
    existsChatIds:{} //已存在chat_id
};

//更多或前10条记录
imChat.getPreMsg =  function(_func) {
    _func = _func || "imChat.getPreMsgCallback";
    var $loadMore = $("#load_more");
    $loadMore.hide().next().show();
    $.ajax({
        type: "get",
        url: 'http://im.6renyou.com/chat',
        data: {
            a:'g_user_msg',
            first_id:this.firstId,
            id_type:2,
            get_normal:1,
            to_type:1,
            to_user:this.orderId,
            oid:this.orderId,
            callback:_func,
            from_type:2,
            from_user:operatorUid
        },
        dataType:"script",
        error:function(){

        }
    });
};

//回调没有操作，只有last_id获取
imChat.getPreMsgLastIdCallback = function( json ) {
    if( json["status"] && 1 === parseInt( json['status'] ) ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total>0 ) {
            if(0 == imChat.preReadScrollType){
                this.lastId = json['data'][0]['id'];
            }
        }
    }
    if( 0 === imChat.noReadTimes ) {
        //未启动，就执行
        setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
    }
};

imChat.getPreMsgCallback = function( json ) {
    if( json["status"] && 1 === parseInt( json['status'] ) ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total>0 ) {
            //alert(imChat.getMsgHtml(json));
            if(0 == imChat.preReadScrollType){
                this.lastId = json['data'][0]['id'];
            }
            if( 1 === imChat.preReadScrollType ) {
                $("#first_pg").after(imChat.getMsgHtml(json));
                //$imScroll.scrollTop( 0 );
                $imScroll.animate({scrollTop:0},800);
            }
            else {
                $tripOrder.append( imChat.getMsgHtml(json) );
                //$imScroll.scrollTop( $tripOrder.height() );
                $imScroll.animate({scrollTop:$tripOrder.height()},800);
            }
            this.firstId = json['data'][_total-1]['id'];
        }
        var $loadMore = $("#load_more");
        if( _total < 10 ) {
            $loadMore.hide().next().hide();
        }
        else{
            $loadMore.show().next().hide();
        }
        imChat.isLineStatus(json['line']);

        //订单完成，留言读取完毕，显示提示语
        imChat.getOrderTips();
    }

    if( 0 === imChat.noReadTimes ) {
        //未启动，就执行
        setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
    }
};


imChat.getOrderTips = function() {
    if( orderSn || 1===imChat.preReadStatus )
        return false;
    /*setTimeout(function() {
            var _html = wx.eightSiteTips();
            $tripOrder.append( _html );
            wx.eightInit();
    }, _timeout);*/
    return true;
};

//循环获取聊天消息
imChat.getNoReadMsg = function (){
    if( 1===this.noReadLoading ){
        return false;
    }
    this.noReadLoading = 1;
    $.ajax({
        type: "get",
        url: 'http://im.6renyou.com/chat',
        data: {
            a:'g_user_msg',
            id_type:1,
            last_id:imChat.lastId,
            custom_line:imChat.isLine,
            to_type:1,
            to_user:imChat.orderId,
            oid:imChat.orderId,
            callback:"imChat.getNoReadMsgCallback",
            from_type:2,
            from_user:operatorUid
        },
        dataType: 'script',
        error:function(){
            imChat.noReadLoading = 0;
        }
    });
};
imChat.getNoReadMsgCallback = function( json ) {
    imChat.noReadLoading = 0; //1个AJAX请求完成后；状态置为0
    if(  json["status"] && 1 === parseInt( json["status"] )  ) {
        var _total = isNaN(json["c"]) ? 0 : parseInt(json["c"]);
        if( _total > 0 ) {
            imChat.lastId = json['data'][0]['id'];
            imChat.tipNum += _total;

            if(!imChat.tipNumTimer){ //标题提示
                imChat.tipTitle();
            }
            $tripOrder.append(imChat.getMsgHtml(json));
            //$imScroll.scrollTop( $tripOrder.height() );
            $imScroll.animate({scrollTop:$tripOrder.height()},300);
        }
        imChat.isLineStatus(json['line']);
    }
    imChat.noReadTimes += 1;
    setTimeout(function(){imChat.getNoReadMsg();}, imChat.noReadInterval); //循环取消息
};
imChat.sendMsg = function( obj ) {
    if( !imChat.orderId ) {
        alert("请您先下订单");
        return false;
    }
    if( 1 == $(obj).attr("rel") )
        return false;
    var message = $.trim( $("#message_input").val() );
    if( !message ) {
        alert("请留言");
        return false;
    }
    if( message.length > 200 ){
        alert("请少于200字");
        return false;
    }
    message = '<p class="im-you-txt">'+message+'</p>';
    var params = {message:message,oid:imChat.orderId};
    $(obj).attr("rel", 1)
    $.post("http://www.6renyou.com/ordercext/sendChat", params, function( json ) {
        if( 1 === json.status ) {
            imChat.existsChatIds[json.last_id] = 1;
            $tripOrder.append(imChat.getMsgTpl(json.message, 2));
            $("#message_input").val("");
            //$imScroll.scrollTop( $tripOrder.height() );
            $imScroll.animate({scrollTop:$tripOrder.height()},600);
            if( 0 === imChat.noReadTimes ){
                imChat.getNoReadMsg();
            }
        }
        $(obj).attr("rel",'0');
    }, "json");
};

imChat.getMsgTpl = function( msg, type ) {
    var _html = [];
    if( 2 == type ) {
        _html.push('<li class="im-item you">');
        _html.push('    <div class="im-content">');
        _html.push('        <div class="im-info">');
        _html.push(msg);
        _html.push('        </div>');
        _html.push('        <span class="chat-triangle"></span>');
        _html.push('    </div>');
        _html.push('</li>');
    }
    else{
        _html.push('<li class="im-item me">');
        _html.push('    <div class="im-content">');
        _html.push('        <div class="im-info">');
        _html.push(msg);
        _html.push('        </div>');
        _html.push('        <span class="chat-triangle"></span>');
        _html.push('    </div>');
        _html.push('</li>');
    }

    return _html.join("");
};

imChat.getMsgHtml = function(json){
    var _h = [];
    for(var i=json['c']-1;i>=0;i--){
        var row = json['data'][i];
        var chatId = row['id'];
        if( imChat.existsChatIds[chatId] ){
            imChat.tipNum -= 1;
            continue;
        }

        if(row['to_type']=='2'){
            _h.push( imChat.getMsgTpl(row['message'], 2) );
        }
        else if(row['to_type']=='1'){
            _h.push( imChat.getMsgTpl(row['message'], 1) );
        }
    }
    return _h.join('');
};

imChat.resetTipTitle = function(){
    if( imChat.tipNumTimer ){
        clearTimeout(imChat.tipNumTimer);
    }
    imChat.tipNumTimer = null;
    setTimeout(function(){
        document.title = imChat.tipNumTitle;
    },100);
    imChat.tipNum = 0;
};

imChat.tipTitle = function(){
    if(this.tipNumTimer){
        clearTimeout(this.tipNumTimer);
    }
    if(this.tipNum > 0){
          this.tipNumTimer = setTimeout(function () {
            if( imChat.tipNum > 0 ) {
              imChat.tipNumTime++;
              if (imChat.tipNumTime % 2 == 0) {
                  document.title = "【"+imChat.tipNum+"条新消息】" + imChat.tipNumTitle;
              }else {
                  document.title = "【         】" + imChat.tipNumTitle;
              }
              imChat.tipTitle();
            }
          }, 600);
    }
};
imChat.isLineStatus = function( line ) {
    imChat.isLine = line;
    $("#chat_online>div.six-img").show();
    $("#chat_online>i.six-txt").show();
    if(parseInt(line)==1){
        $('#chat_online div.six-img span').removeClass('six-outline').addClass('six-online');
        $('#chat_online i.six-txt').html('在线');
        $('#chat_online div.chat-r-top div.no-line').hide();
        $('#send_input_box input.chat-send-btn').val('发送');
    }
    else{
        if($('#chat_online i.six-txt').html()=='在线'){
            $('#chat_online div.six-img span').removeClass('six-online').addClass('six-outline');
            $('#chat_online i.six-txt').html('离线');
            imChat.tipOffline();
        }
        if($('#chat_online div.no-line').length<=0){
            imChat.tipOffline();
        }
    }
};

imChat.tipOffline = function() {
    if($('#chat_online div.no-line').attr('hand') != '1'){
        //$('#chat_online div.no-line').show();
    }
    $('#send_input_box input.chat-send-btn').val('留言');
};

imChat.getRightOrderInfo = function( orderSn ) {
    $.ajax({
        type:'get',
        url:'/orderc/get_right_info',
        data:{"sn":orderSn},
        success:function(right_str){
            if(right_str){
                $('#chat_order_right').html(right_str);
            }
        }
    });
};

imChat.resetChatBox = function ( isShow ) { //0隐藏；1显示
    if( 1 === isShow ) { //留言框显示时，聊天框高度降低；
        $("#im_scroll").css( "height","451px" );
        $("#send_input_box").show();
    }
    else{
        $("#im_scroll").css( "height","533px" );
        $("#send_input_box").hide();
    }
    return true;
};


$(document).ready(function(){
    $('div.chat-item-tit span').click(function(){
        if($(this).hasClass('fold-up')){
            $(this).removeClass('fold-up').addClass('fold-down');
            $(this).parents('div.chat-info-item').find('div.chat-item-detail').hide();
        }
        else{
            $(this).removeClass('fold-down').addClass('fold-up');
            $(this).parents('div.chat-info-item').find('div.chat-item-detail').show();
        }
    });

    if( orderSn ) {
        orderSnId = isNaN(orderSnId)  ? 0 : parseInt( orderSnId );
        if( orderSnId > 0 ) {
            imChat.orderId = orderSnId;
            imChat.getPreMsg();
            setTimeout(function(){ imChat.getNoReadMsg(); }, imChat.noReadInterval);
            $("#first_pg").hide();
            imChat.resetChatBox( 1 );
        }
        return;
    }

    paramTripId = isNaN(paramTripId) ? 0 : parseInt( paramTripId );
    if( paramTripId > 0 ) {
        $("#first_pg").hide();
        if( 1 === mastDisableStatus ) //如果有弹层，禁止下执行
            return false;
        $.get("/route/getTripList/", {"id":paramTripId}, function( data ){
            if( data.status && 1==parseInt(data.status) ){
                var _html = wx.getFiveHtml(data.data);
                $("ul.im-list").append(_html);
                wx.fiveInit();
                wx.tripInputParams( data.data[paramTripId] );
                $("#trip_id").val( paramTripId );
                return true;
            }
            //直接人数
            wx.getSixPepleHtmlCode();
        }, "json");
    }
    else {
        if( 1 === mastDisableStatus ) //如果有弹层，禁止下执行
        {
            $("#first_pg").hide(); //有oid=3775  跳转到  dest=昆明；隐藏first_pg
            return false;
        }

        var length =  $("#second_pg").length;
        if( length > 0 ) {
            $("#first_pg").show();
            $("#token").nextAll().remove();
        }
        wx.firstGetDestBindClick();
        if( paramDest ) {
            var destlist = $.cookie("destlist");
            if( !destlist ) {
                var _html = wx.getSolidDestHtml();
                $("#trip_order").append(_html);
                wx.secondInit();
            }

            wx.paramDestOther();
            var subdestlist = $.cookie('subdestlist');
            if( !subdestlist ) {
                $("#second_pg").find("div.im-btns a.im-btn").click();
            }
        }
    }
});