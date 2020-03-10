function AjaxResult2Table(params){
	this.searchUrl = params.searchUrl;
	if(params.resultTableId && params.resultTableId != ""){
		this.resultTableId = params.resultTableId;
	} else {
		this.resultTableId = "resultTable";
	}
	if(params.pagerId && params.pagerId != ""){
		this.pagerId = params.pagerId;
	} else {
		this.pagerId = 'pager';
	}
	this.searchParams = {};
	this.page = {
		pageSize : 15,
		currentPage: 1,
		totalPage : 0,
		currentCount : 0,
		result : null,
		sortExp : "", 
		sortDir : ""
	};
	this.column = [];
	this.keyid = null;
	this.hasData = false;
	this.searchCallback = params.callback;
	this.searchComplete = params.complete;
	this.selectAllCheckBoxId = "selectAll";
	this.init();
}

/**
 * 初始化
 */
AjaxResult2Table.prototype.init = function(){
	var resultTable = this;
	if($("#" + this.resultTableId).attr("keyid") != ""){
		this.keyid = $("#" + this.resultTableId).attr("keyid");
	} else {
		this.keyid = "id";
	}
	$("#"+this.resultTableId+" thead tr th").each(function(column){
		switch($(this).attr("type")){
		case "xh":column.push({type:"xh"});break;
		case "btn":
    		var btn=[];
    		$.each($(this).attr("btn").split('&'),function(i,b){
    			var tmp = b.split('|');
    			btn.push({id:tmp[0],text:tmp[1]});
    		});
    		column.push({type:"btn",btn:btn});
    		break;
    	case "callback":column.push({type:"callback",fun:$(this).attr("fun")});break;
    	case "checkbox":
    		column.push({type:"checkbox"});
    		var id = resultTable.getSelectId(0);
    		$(this).html("<input type='checkbox' id='"+id+"' class='checkall' />");
    		$("#"+id).click(function(){
    			if($(this).attr("checked")){
    				$("#" + resultTable.resultTableId + " tbody tr").each(function(){
    					$(this).addClass("trSelect");
    				});
    			} else {
    				$("#" + resultTable.resultTableId + " tbody tr").each(function(){
    					$(this).removeClass("trSelect");
    				});
    			}
    			$("#" +resultTable.resultTableId + " input[type='checkbox']").attr("checked",!!$(this).attr("checked"));
    		});
    		break;
    	case "child":
    		column.child=true;
    		column.childlist=$(this).attr("childlist");
    		column.push({type:"child",fun:$(this).attr("fun")});
    		break;
    	default:
    		if($(this).attr("column")){
    			column.push({type:"col", tdClass : $(this).attr("tdClass"), col:$(this).attr("column"),dataType : $(this).attr("dataType"), dateFormat:$(this).attr("dateFormat"), jsonValue:$(this).attr("jsonValue"), notWithTitle:$(this).attr("notWithTitle")});
    		}else
    			column.push({type:"none"});
    		break;
		};
	}, [this.column]);
	//排序
	$("#"+resultTable.resultTableId+" th[sort]").each(function(){
		var sort = $(this).html().match(/[↑↓]$/g);
		if(sort){
			resultTable.page.sortExp = $(this).attr("sort");
			if(sort[0] == "↑")resultTable.page.sortDir = "desc";
			return false;
		}
	});
	$("#"+resultTable.resultTableId+" th[sort]").die().live("click", function() {
		$("#"+resultTable.resultTableId+" th[sort]").each(function() { $(this).html($(this).html().replace(/[↑↓]/g, '')); });
        if ($(this).attr("sort") == resultTable.page.sortExp) {
        	resultTable.page.sortDir = (resultTable.page.sortDir == "desc" ? "" : "desc");
        }
        resultTable.page.sortExp=$(this).attr("sort");
        $(this).html($(this).html() + (resultTable.page.sortDir == "desc" ? "↑" : "↓"));
        resultTable.research();
    }).live("mouseover",function(){
    	$(this).css("cursor","hand");
    });
};

/**
 * 用户查询
 * @param searchParam
 * @param callback
 * @param complete
 */
AjaxResult2Table.prototype.search = function(searchParam, callback, complete){
	this.searchParams = searchParam;
	this.page.currentPage = 1;
	if(searchParam && searchParam.pageSize){
		this.page.pageSize = searchParam.pageSize;
	}
	if(searchParam && searchParam.sortExp){
		this.page.sortExp = searchParam.sortExp;
	}
	if(searchParam && searchParam.sortDir){
		this.page.sortDir = searchParam.sortDir;
	}
	if(typeof callback !== 'undefined')this.searchCallback = callback;
	if(typeof complete !== 'undefined')this.searchComplete = complete;
	this.research();
};

/**
 * 
 */
AjaxResult2Table.prototype.research = function(searchParam){
	if(searchParam){
		this.searchParams = $.extend({},searchParam,{
	        sortExp:this.page.sortExp,
	        sortDir:this.page.sortDir,
	        pageSize:this.page.pageSize
		});
	}else{
		this.searchParams = $.extend({},this.searchParams,{
	        sortExp:this.page.sortExp,
	        sortDir:this.page.sortDir,
	        pageSize:this.page.pageSize,
	        currentPage:this.page.currentPage
		});
	}
	var flag = false;
	//$("#" + this.resultTableId).hide();
	$("#" + this.resultTableId + " input[type='checkbox']").attr("checked", false);
	var resultTab = this;
	$("#searching").show();
	CallWebMethod(this.searchUrl,this.searchParams,function(json, textStatus){
		if (json && json.error) {
			resultTab.msg(json.error);
            return;
        }
		var page = json;
		if (!page || !page.result || page.result.length == 0) {
        	if(resultTab.page.currentPage>1){
        		resultTab.gotoPage(1);
        		return;
        	}
        	resultTab.msg("暂无数据！");
            return;
        }
		resultTab.hasData = true;
		resultTab.page.result = page.result;
		if (page && page.totalPage && page.currentPage && page.pageSize){
			resultTab.page.totalPage = page.totalPage;
			resultTab.page.currentPage = page.currentPage;
			resultTab.page.pageSize =  page.pageSize;
			resultTab.page.totalCount = page.totalCount;
		}
		if(typeof resultTab.searchCallback == 'function'){
			resultTab.searchCallback.call(resultTab);
		}
		flag = true;
		resultTab.fillTable();
		resultTab.showPager();
		$("#" + resultTab.resultTableId + " tbody tr td").click(function(){
			if(!$("input[type=checkbox]", this)[0]){
				if($("input[type=checkbox]", this.parentElement).attr("checked")){
					$("input[type=checkbox]", this.parentElement).attr("checked", false);
					$(this.parentElement).removeClass("trSelect");
				} else {
					if($("#" + resultTab.resultTableId).attr("selectType") == "radio"){
						//单选
						$("#" + resultTab.resultTableId + " tbody tr").each(function(){
							$("input[type=checkbox]", this).attr("checked", false);
							$(this).removeClass("trSelect");
						});
					}
					$("input[type=checkbox]", this.parentElement).attr("checked", true);
					$(this.parentElement).addClass("trSelect");
				}
			}
		});
		$("#" + resultTab.resultTableId + " tbody input[type=checkbox][nid]").click(function(){
			if(this.checked){
				$.each($("input[type=checkbox]", this.parentElement.parentElement), function(){
					this.checked = true;
				});
				$(this.parentElement.parentElement).addClass("trSelect");
			} else {
				$.each($("input[type=checkbox]", this.parentElement.parentElement), function(){
					this.checked = false;
				});
				$(this.parentElement.parentElement).removeClass("trSelect");
			}
		});
	}, function(){
		$("#searching").hide();
		if(!flag){
			resultTab.clearPager();
		}
		$("#"+resultTab.resultTableId+" tbody tr").mouseover(function(){
			$(this).addClass("trHand");
		});
		$("#"+resultTab.resultTableId+" tbody tr").mouseout(function(){
			$(this).removeClass("trHand");
		});
		$("#"+resultTab.resultTableId).show();
		if(typeof resultTab.searchComplete == 'function'){
			resultTab.searchComplete();
		}
	});
};
/**
 *  刷新数据，不刷新整个表格
 *  需设置keyid, 只刷新column列
 */
AjaxResult2Table.prototype.reflash = function(callback,error){
	this.searchParams = $.extend({},this.searchParams,{
        sortExp:this.page.sortExp,
        sortDir:this.page.sortDir,
        pageSize:this.page.pageSize,
        currentPage:this.page.currentPage
	});
	var resultTab = this;
	CallWebMethod(this.searchUrl,this.searchParams,function(json, textStatus){
		$.each(json.result, function(ajaxR2TAB) {
			ajaxR2TAB.updateTr(this);
		},[resultTab]);
	},function(){
		if(typeof callback == 'function'){
			callback.call(resultTab);
		}
	},error);
};
/**
 *  刷新数据，刷新TR
 *  需设置keyid, 只刷新column列
 */
AjaxResult2Table.prototype.updateTr = function(data){
	var resultTab=this;
	var obj = data,
		oldIndex=_findIndexByID(resultTab.page.result,obj[resultTab.keyid],resultTab.keyid),
		old=(oldIndex>=0?resultTab.page.result[oldIndex]:[]);
	if(oldIndex<0){
		delete data;
		//this.research();
		return;
	}
		
	$("#"+resultTab.resultTableId+" tr[key='"+obj[resultTab.keyid]+"'] td").each(function(i){
		var l=resultTab.column[i];
		switch(l.type){
		case "xh":break;
		case "checkbox":break;
		case "child":break;
		case "btn":break;
		case "callback":
			$(this).html(eval(l.fun+"(obj)"));
			break;
		case "col":
			if(obj[l.col]==old[l.col])break;
			var value ="";
			if(l.dataType && l.dataType =="date" && obj[l.col] && obj[l.col] != ""){
				value = new Date(obj[l.col]).format(l.dateFormat);
			} else if(l.dataType && l.dataType =="json"){
				var map = eval(l.jsonValue);
				value = map[obj[l.col]]||"";
			} else {
				value = obj[l.col];
			}
			$(this).html(value||"");
			break;
		default:break;
		}
	});
	if(oldIndex>=0)resultTab.page.result[oldIndex]=obj;
}
function _findIndexByID(arr,id,keyid){
	var ret=-1;
	$.each(arr,function(i,v){
		if(v[keyid]==id){
			ret=i;
			return false;
		}
	});
	return ret;
}
/**
 * 将查询出来的数据填充表格
 */
AjaxResult2Table.prototype.fillTable=function(){
	if(this.page.result.length < 0){
		return;
	}
	//$("#"+this.resultTableId+" tbody tr").remove();
	var index = 0;
	var html = "";
	$.each(this.page.result, function(ajaxR2TAB) {
		var obj = this;
		var rowspan=ajaxR2TAB.column.child?" rowspan='"+obj[ajaxR2TAB.column.childlist].length+"'":"";
		var background = (index%2==1?" class='trDoubleRow'":"");
		index++;
		var rows = ajaxR2TAB.column.child && obj[ajaxR2TAB.column.childlist] && obj[ajaxR2TAB.column.childlist].length>0 ? obj[ajaxR2TAB.column.childlist].length:1;
		for(var r=0;r<rows;r++){
			html += "<tr"+(ajaxR2TAB.keyid?" key='"+obj[ajaxR2TAB.keyid]+"'":"")+background+">";
        	//$("#"+ajaxR2TAB.resultTableId+" tbody").append("<tr"+(ajaxR2TAB.keyid?" key='"+obj[ajaxR2TAB.keyid]+"'":"")+background+"></tr>");
        	$.each(ajaxR2TAB.column,function(j, l){
    			switch(l.type){
        		case "xh":
        			if(r>0) return true;
        			html += "<td"+rowspan+">" + (index) + "</td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td"+rowspan+">" + (index) + "</td>");
        			break;
        		case "btn":
        			if(r>0) return true;
        			var tmp ="<td"+rowspan+">";
        			$.each(l.btn,function(t,c){
        				tmp+=" <a mode='"+c.id+"' nid='" + obj[ajaxR2TAB.keyid] + "'>"+c.text+"</a>";
        			});
        			tmp+="</td>";
        			html += tmp;
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append(tmp);
        			break;
        		case "callback":
        			if(r>0) return true;
        			html += "<td"+rowspan+">" + eval(l.fun+"(obj)")+ "</td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td"+rowspan+">" + eval(l.fun+"(obj)")+ "</td>");
        			break;
        		case "checkbox":
        			if(r>0) return true;
        			html += "<td"+rowspan+"><input type='checkbox' nid='" + obj[ajaxR2TAB.keyid] + "' value='"+obj[ajaxR2TAB.keyid]+"' /></td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td"+rowspan+"><input type='checkbox' nid='" + obj[ajaxR2TAB.keyid] + "' value='"+obj[ajaxR2TAB.keyid]+"' /></td>");
        			break;
        		case "col":
        			if(r>0) return true;
        			//alert(l.col);
        			var value ="";
        			if(l.dataType && l.dataType =="date" && obj[l.col] && obj[l.col] != ""){
        				value = new Date(obj[l.col]).format(l.dateFormat);
        			} else if(l.dataType && l.dataType =="json"){
        				var map = eval(l.jsonValue);
        				value = map[obj[l.col]];
        			} else {
        				value = obj[l.col];
        			}
        			var tdClass= "";
        			if(l.tdClass){
        				tdClass = l.tdClass;
        			}
        			html += "<td"+rowspan+" class='"+tdClass+"' "+(l.notWithTitle?"":" title='" + (value||"") + "'")+">" + (value||"") + "</td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td"+rowspan+" class='"+tdClass+"'>" + (value||"") + "</td>");
        			break;
        		case "child":
        			html += "<td>"+eval(l.fun+"(n,i,r)")+"</td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td>"+eval(l.fun+"(n,i,r)")+"</td>");
        			break;
        		default:
        			if(r>0) return true;
        			html += "<td"+rowspan+"></td>";
        			//$("#"+ajaxR2TAB.resultTableId+" tbody tr:last-child").append("<td"+rowspan+"></td>");
        			break;
        		}
			});
        	html += "</tr>";
		}
	},[this]);
	$("#"+this.resultTableId+" tbody").html(html);
};
/**
 *  跳转至pageNum页
 * @param pageNum
 */
AjaxResult2Table.prototype.goToPage = function(pageNum){
	this.page.currentPage=parseInt(pageNum);
    this.research();
};

AjaxResult2Table.prototype.getSelectId = function(index){
	if($("#selall"+index)[0]){
		return this.getSelectId(++index);
	} else {
		return "selall"+index;
	}
};

/**
 * 获取已选中id
 */
AjaxResult2Table.prototype.getSelected = function(){
	var sels=[];
	$("#"+this.resultTableId+" input[type=checkbox]").each(function(i,item){
		if($(this).attr("checked")&&$(this).attr("nid"))sels.push($(this).attr("nid"));
	});
	return sels;
};

/**
 * 往表格中写信息
 * @param msg
 */
AjaxResult2Table.prototype.msg = function(msg){
	/*this.clearPager();
    $("#"+this.resultTableId+" tbody").find("tr").remove().end()
                .find("tr").hide().end()
                .append("<tr><td colspan='10'>" + msg + "</td></tr>").show();
    this.hasData = false;*/
	this.clearPager();
	var iniLen=10;
	if(this.column!=null && this.column.length>0){
		iniLen=this.column.length;
	}
    $("#"+this.resultTableId+" tbody").find("tr").remove().end()
                .find("tr").hide().end()
                .append("<tr><td colspan='"+iniLen+"'>" + msg + "</td></tr>").show();
    this.hasData = false;
};

/**
 * 清空翻页插件
 */
AjaxResult2Table.prototype.clearPager = function(){
	$("#" + this.pagerId).empty().hide();
};

/**
 * 显示翻页
 */
AjaxResult2Table.prototype.showPager = function(){
	var count = this.page.totalPage;
    var index = this.page.currentPage;
    $("#" + this.pagerId).empty().hide();
    var len = 10;
    var div_width = $("#" + this.pagerId).width();
    if(div_width < 400){
	    if (index < count && index != 1) {
	    	if(index > 8){
	    		if(index > 99)
	    			len = Math.floor((div_width - 150)/50);
	    		else
	    			len = Math.floor((div_width - 150)/32);
	    	}else 
	    			len = Math.floor((div_width - 150)/25);
	
	    }else{	
	    	if(index > 8)
	    		len = Math.floor((div_width - 75)/32);
	    	else if(count > 99)
    			len = Math.floor((div_width - 85)/32);
    		else
    			len = Math.floor((div_width - 75)/25);
	    }
    }else{
    	len = 10;
    }
    if (count <= 1) return;
    $("#" + this.pagerId).append("<div class='fl tl'><span id='lIndex'>第" + index + "页</span><span id='lCount'>/共" + count + "页，</span><span id='totalCountSpan'>共" + this.page.totalCount + "条记录</span></div>")
               .append("<div class='fr'></div>");
    if (index > 1) {
        $("#" + this.pagerId + " div.fr").append("<a page='1' title='首页' >&lt;&lt;</a>")
                   .append("<a page='" + (index - 1) + "' title='上一页'>&lt;</a>");
    }
    for (var i = Math.floor((index - 1) / len) * len + 1; i <= count && i <= Math.floor((index - 1) / len + 1) * len; i++) {
        if (i == index)
            $("#" + this.pagerId + " div.fr").append("<a class='selected'>" + i + "</a>");
        else
            $("#" + this.pagerId + " div.fr").append("<a page='" + i + "' class='bg'>" + i + "</a>");
    }
    if (index < count) {
        $("#" + this.pagerId + " div.fr").append("<a page='" + (index + 1) + "' title='下一页' >&gt;</a>")
                   .append("<a page='" + count + "' title='末页' >&gt;&gt;</a>");
    }
    var resultTAB = this;
    $("#"+this.pagerId+" a[page]").click(function() { resultTAB.goToPage($(this).attr("page")); return false;});
    $("#" + this.pagerId).show();
};

/**
 * 表单添加
 * @param addURL
 * @param params
 * @param success
 * @param complete
 */
AjaxResult2Table.prototype.add = function (addURL, params, success, complete){
	CallWebMethod(url,data,
		function(json, textStatus){
            if (json) {
                if (json.error)
                    jAlert(json.error);
                else {
                    jAlert('添加成功', function() {
                    	if(typeof success == 'function')success();
                        if (this.hasData) this.research();
                    });
                }
            }
    	},
    	function(){
    		if(typeof complete == 'function')complete();
    	}
	);
};

/**
 * 表单修改
 * @param editURL
 * @param params
 * @param success
 * @param complete
 */
AjaxResult2Table.prototype.edit = function (editURL, params, success, complete){
	CallWebMethod(url,data,
		function(json, textStatus){
            if (json) {
                if (json.error)
                    jAlert(json.error);
                else {
                    jAlert('修改成功', function() {
                    	if(typeof success == 'function')success();
                        if (this.hasData) this.research();
                    });
                }
            }
    	},
    	function(){
    		if(typeof complete == 'function')complete();
    	}
	);
};

/**
 * 表单删除
 * @param delURL
 * @param params
 * @param success
 * @param complete
 */
AjaxResult2Table.prototype.del = function(delURL, params, success, complete){
	CallWebMethod(url,data,
		function(json, textStatus){
            if (json) {
                if (json.error)
                    jAlert(json.error);
                else {
                    jAlert('删除成功', function() {
                    	if(typeof success == 'function')success();
                        if (this.hasData) this.research();
                    });
                }
            }
    	},
    	function(){
    		if(typeof complete == 'function')complete();
    	}
	);
};

/**
 * 查看详细
 * @param id
 */
AjaxResult2Table.prototype.detail = function(id){
	if(id!=null && id!=""){
		var detailObj = this.detailInfo(id);
		if(detailObj == null){
			jAlert("读取数据错误！");
		}
		return detailObj;
	}
	return null;
};
AjaxResult2Table.prototype.detailInfo = function(id){
	var detailObj = null;
	if(this.page.result != null && this.page.result.length > 0){
		var resultTable = this;
		$.each(this.page.result, function(i, obj){
			if(obj[resultTable.keyid] == id){
				detailObj = obj;
				return false;
			}
		});
	}
	return detailObj;
};

Date.prototype.format = function(format) //author: meizz 
{ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "H+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  };
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
};




