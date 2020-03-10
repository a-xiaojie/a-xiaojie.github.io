// JScript 文件

/*****************************************************************************
* 功能说明:DownloadPlayer类
* 视频下载控件
*****************************************************************************/
var  DownloadPlayer = {
        urlForDownload  : "window.document.getElementById('DownDvrVideoX1')",
        StopDownVideoX        : function() {  //停止下载
                              eval(this.urlForDownload).StopDownVideoX();
                              //return eval(this.urlForDownload).DisposeX();
        },
        SetChannelInfo      :function(lpIP, nPort, nChannel, lpUserID, lpUserPwd){//设置需要下载的点的信息
                              eval(this.urlForDownload).SetChannelInfo(lpIP,nPort,nChannel,lpUserID,lpUserPwd);
        },
        StartDownVideo        :function(lpStartTime,lpEndTime){//设置要下载的视频的时间范围和文件名称
                              return eval(this.urlForDownload).StartDownVideo(lpStartTime, lpEndTime);
        },
//        GetDownPos          : function() {   //获取下载位置
//                              return eval(this.urlForDownload).GetDownPos();
//        },
        GetLastError          : function() {  //获取下载出错代码
                              return eval(this.urlForDownload).GetLastError();
        },
        SetLoadFilePath       : function(sPath) { //设置下载路径
                              return eval(this.urlForDownload).SetLoadFilePath(sPath);
        },
       SetSYSPath           :function ()
                   {
                       try{  if(eval(this.urlForDownload).SetSYSPath())
                             {
                                 return eval(this.urlForDownload).GetSYSPath();
                             }
                             return "";
                         }catch(e){}
                   },
       GetSYSPath            :function()
                   {
                       try{  eval(this.urlForDownload).GetSYSPath();}catch(e){}
                   }
};

