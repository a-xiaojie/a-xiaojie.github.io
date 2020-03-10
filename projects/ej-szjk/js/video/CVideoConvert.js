// JScript 文件

/*****************************
 * 功能说明:CVideoConvert类 
 * 转化控件，用于转化视频文件         
 *****************************/
var  CVideoConvert = {
        urlForConvert  : "window.document.getElementById('VideoConvert1')",
        SetVideoPath        : function(srcPath,desPath) {  //设置要转化视频路径和保存路径
                              eval(this.urlForConvert).SetVideoPath(srcPath,desPath);
                              //return eval(this.urlForDownload).DisposeX();
        },
        SetVideoType      :function(nType){//设置需要转化的本地文件的类型，0代表海康
                              eval(this.urlForConvert).SetVideoType(nType);
        },
        SetConVidetType        :function(sIndex){//设置要转化成格式类型，0：AVI；1：WMA
                              return eval(this.urlForConvert).SetConVidetType(sIndex);
        },
        StartConVertVideo          : function() {  //开始转化
                              return eval(this.urlForConvert).StartConVertVideo();
        }
};