// JScript 文件

/*****************************************************************************
*功能说明:CRealPlayer类
* 实时浏览播放控件
*****************************************************************************/
function CRealPlayer(sUrl){
    this.strUrl          = sUrl;    // || "document.getElementById('AVRealPlay')";
    this.strIP           = null;    //IP "192.168.9.43"
    this.nPort           = null;    //端口 8000
    this.nChannel        = null;    //通道号 0
    this.strUserID       = null;    //用户名 "admin"
    this.strUserPwd      = null;    //密码 "12345"
    this.strVideoServerIP= null;    //流媒体服务器IP "192.168.9.126"
    this.nVideoServerPort= null;    //流媒体服务器端口 554
    
    this.nScreenNum      = null;    //画面数
    this.nSelectIndex    = null;    //当前选择项
    this.nConType        = null;    //nConType: 0-TCP 1-UDP 2-多播 3-RTP 4-音视频分开
    this.nStreamType     = null;    //nStreamType: 0-主码流 1-子码流
    this.bLoopFlag       = null;    //是否循环播放
    this.nDVRType        = null;    //DVR类型
    this.sFilePath       = null;    //当前录像抓图保存路径
    this.sVideoName      = null;    //点位名称
    
   
    //设置cameraID    
    this.SetCameraID=function(cameraID)
    {
         try{ eval(this.strUrl).SetCameraID(cameraID); }catch(e){}
    };
    //设置鼠标箭头显示
    this.EnableShowArrows=function (bl)
    {
        try{ eval(this.strUrl).EnableShowArrows(bl); }catch(e){}
    }
    this.SetShowCurStatus=function(nsc)
    {
         try{ eval(this.strUrl).SetShowCurStatus(nsc); }catch(e){}
    };
    
    //LoopFlag -- 是否循环播放
    this.GetLoopFlag     = function ()
                    {
                        try{ this.bLoopFlag = eval(this.strUrl).GetLoopFlag(); }catch(e){}
                        return this.bLoopFlag;
                    };
    this.SetLoopFlag     = function(bLoop)
                    {
                        this.bLoopFlag = bLoop;
                        try{ eval(this.strUrl).SetLoopFlag(this.bLoopFlag); }catch(e){}
                    };
    
    //ScreenNum -- 画面数
    this.GetScreenNum    = function ()
                    {
                        try{ this.nScreenNum = eval(this.strUrl).GetScreenNum(); }catch(e){}
                        return this.nScreenNum;
                    };
    this.SetScreenNum    = function(nScreenNum)
                    {
                        var iScreenNum = parseInt(nScreenNum);if(isNaN(iScreenNum)) iScreenNum=0;
                        this.nScreenNum = iScreenNum;
                        try{ eval(this.strUrl).SetScreenNum(this.nScreenNum); }catch(e){}
                    };
    
    //当前选择项
    this.GetSelPlayIndex = function ()
                    {
                        try{ this.nSelectIndex = eval(this.strUrl).GetSelPlayIndex(); }catch(e){}
                        return this.nSelectIndex;
                    };
    this.SetSelected     = function(nSel)
                    {
                        var iSel = parseInt(nSel);if(isNaN(iSel)) iSel=0;
                        this.nSelectIndex = iSel;
                        try{ eval(this.strUrl).SetSelected(this.nSelectIndex); }catch(e){}
                    };
     
   
    
    //nDVRType -- DVR类型

    this.SetSelVideoPlayType      = function(devicetype)
                {
                    try
                    {
                        var type = parseInt(devicetype);if(isNaN(type)) type=1;
                        eval(this.strUrl).SetSelVideoPlayType(type); 
                    }catch(e){}
                };
    
    this.SetSelWndDeviceInfo = function(nStreamMediaSvrType,nManufactType,nDeviceType,nProtocolType)
    {
        try
        {
            var StreamMediaSvrType = parseInt(nStreamMediaSvrType);if(isNaN(nStreamMediaSvrType)) StreamMediaSvrType = 0;
            var ManufactType = parseInt(nManufactType);if(isNaN(nManufactType)) ManufactType = 0;
            var DeviceType = parseInt(nDeviceType);if(isNaN(nDeviceType)) DeviceType = 0;
            var ProtocolType = parseInt(nProtocolType);if(isNaN(nProtocolType)) ProtocolType = 0;
            eval(this.strUrl).SetSelWndDeviceInfo(StreamMediaSvrType, ManufactType, DeviceType, ProtocolType); 
        }
        catch(e){}
    }
    //本地存放地址
    this.SetLoadFilePathE = function(sPath)
                    {
                        this.sFilePath = sPath;
                        var ret;
                        try{ ret = eval(this.strUrl).SetLoadFilePathE(this.sFilePath); }catch(e){}
                        return ret;
                    };
    
    //画面效果：亮度、对比度、饱和度、色度
    this.SetVideoEffect  = function(nBri,nCon,nSat,nHue)
                    {
                        var iBri = parseInt(nBri);if(isNaN(iBri)) iBri=0;
                        var iCon = parseInt(nCon);if(isNaN(iCon)) iCon=0;
                        var iSat = parseInt(nSat);if(isNaN(iSat)) iSat=0;
                        var iHue = parseInt(nHue);if(isNaN(iHue)) iHue=0;
                        var ret;
                        try{ ret=eval(this.strUrl).SetVideoEffect(iBri,iCon,iSat,iHue); }catch(e){}
                        return ret;
                    };
    
   
    //连接类型、码流类型
    this.SetStreamParm   = function(nConType,nStreamType)
                    {
                        var iConType = parseInt(nConType);if(isNaN(iConType)) iConType=0;
                        var iStreamType = parseInt(nStreamType);if(isNaN(iStreamType)) iStreamType=0;
                        this.nConType    = iConType;
                        this.nStreamType = iStreamType;
                        try{ eval(this.strUrl).SetStreamParm(this.nConType,this.nStreamType);  }catch(e){}
                    };
    //设置流媒体（整合重构后）
    this.SetSelVideoStreamMediaServerInfo = function (strIP, intPort, strID, strPWD)
    {
        var port=  parseInt(intPort);if(isNaN(port)) port=0;
        try 
        {
            eval(this.strUrl).SetSelVideoStreamMediaServerInfo(strIP, port, strID, strPWD);
        }
        catch(e){} 
    }
    //设置选中窗口视频设备信息
    this.SetSelVideoDeviceInfo = function(strIP, intPort, intlChnl, strID, strPWD, strCameraID)
    {
        var port=  parseInt(intPort);if(isNaN(port)) port=0;
        var Channel=  parseInt(intlChnl);if(isNaN(Channel)) Channel=0;
        try
        {
             eval(this.strUrl).SetSelVideoDeviceInfo(strIP, port, Channel, strID, strPWD, strCameraID);
        }
        catch(e){}
    }
    //设置屏幕比例
    this.SetSelVideoShowType = function (type)
    {
        var nTort=  parseInt(type);if(isNaN(type)) nTort=0;
        try 
        {
            eval(this.strUrl).SetSelVideoShowType(nTort);
        }
        catch(e){} 
    }
    //播放
    this.StartPlaySel = function()
                    {
                        var ret = false;
                        try{ ret =eval(this.strUrl).StartPlaySel(); }catch(e){}
                        return ret;
                    };
    this.StopPlaySel      = function ()
                    {
                        var ret = false;
                        try{ ret = eval(this.strUrl).StopPlaySel(); }catch(e){}
                        return ret;
                    };
    this.StopAllPlay     = function()
                    {
                        var ret = false;
                        try{ ret = eval(this.strUrl).StopAllPlay(); }catch(e){}
                        return ret;
                    }
    
    //录像
    this.StartRecordSel   = function (SavePath,url,videoname)
                    {
                        var path=SavePath+"\\";
                        var ret = false;
                        try{ ret = eval(this.strUrl).StartRecordSel(path + "视频\\" + videoname + "_" + url); }catch(e){}
                        return ret;
                    };
    this.StopRecordSel    = function ()
                    {
                        var ret = false;
                        try{ ret = eval(this.strUrl).StopRecordSel(); }catch(e){}
                        return ret;
                    };
    
    //抓图
    this.CapPicSel        = function (SavePath,videoname)
                    {
                        var date = new Date();
                        var current = "图片\\" + videoname + "_" + date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
                        var url= current+".bmp";
                        var path=SavePath+"\\";
                        var ret = false;
                        try{ ret = eval(this.strUrl).CapPicSel(path+url); }catch(e){}
                        if(!ret) url="";
                        return url;
                    };
    this.SetFullScreen       =function()
                    {
                            try{  eval(this.strUrl).SetSelScreenState(2);}catch(e){}
                    };
    //设置路径
    this.SetSYSPath     =function ()
                   {
                            try{  if(eval(this.strUrl).SetSYSPath())
                             {
                                 return eval(this.strUrl).GetSYSPath();
                             }
                             return "";
                         }catch(e){}
                   };
    this.GetSYSPath    =function()
                   {
                       try{ return eval(this.strUrl).GetSYSPath();}catch(e){}
                   };
    //控制命令接口
    this.MediaStreamPTZCtrlSpeed = function(nOprCmd, nSpeed, nStop)
    {
        try{ eval(this.strUrl).MediaStreamPTZCtrlSpeed(nOprCmd, nSpeed, nStop)}catch(e){}
    }
    //设置优先级
    this.MediaStreamPTZCtrlSetPriority=function(nPriority)
    {
        try{ eval(this.strUrl).MediaStreamPTZCtrlSetPriority(nPriority);}catch(e){}        
    }
    //SETPOS : 23, OPRPOS : 24, DELPOS : 25
    this.MediaStreamPTZPrePointOpr = function MediaStreamPTZPrePointOpr(nOprCmd, nIndex, name)
    {
        try{ eval(this.strUrl).MediaStreamPTZCtrlSpeed(nOprCmd, nIndex, name)}catch(e){}    
    }
};
