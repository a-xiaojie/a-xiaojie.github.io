// JScript 文件

/*****************************
 * 功能说明:CRemotePlayer类 
 * 远程浏览播放控件         
 *****************************/

var  CRemotePlayer = {
    strUrl          : "document.getElementById('AVRemoteVideo')",
    strIP           : "",               //IP
    nChannel        : 0,                //通道号
    nPort           : 8000,             //端口
    strUserID       : "admin",          //用户名
    strUserPwd      : "12345",          //密码
    strFilePath     : "C:\\videofile",  //保存路径开头
    strVideoName    : "",               //点位名称
    isPlaying       : false,            //是否在播放
    strLostPart    :"",                 //根据返回列表获取
    strBackStartTime    : "",           
    strBackEndTime      : "",
    starttime      :"",
    filepath       :"",
    DeviceType     :"",
    streamIP       :"",                 //流媒体信息：IP，端口，用户名，密码，逻辑号
    streamPort     :"",
    streamUser     :"",
    streamPassword :"",
    streamCameraid :"",
    strVideoID     :"",                 //点位ID（银江流媒体视频控件播放使用，主键）
  
    Init            : function(sUrl,sIP,iPort, iChannel,sUserID,sUserPwd,sFilePath,sVideoName,streamIP,streamPort,streamUser,streamPassword,id) {
                      if(this.isPlaying==true) this.Stop();
    
                        this.strUrl     = sUrl     || this.strUrl;
                        this.strIP      = sIP      || this.strIP;
                        this.nChannel   = iChannel || this.nChannel;
                        this.nPort      = iPort    || this.nPort;
                        this.strUserID  = sUserID  || this.strUserID;
                        this.strUserPwd = sUserPwd || this.strUserPwd;
                        this.strFilePath= sFilePath || this.strFilePath;
                        this.strVideoName=sVideoName || this.strVideoName;
                        this.streamIP       = streamIP       || this.streamIP      
                        this.streamPort     = streamPort     || this.streamPort    
                        this.streamUser     = streamUser     || this.streamUser    
                        this.streamPassword = streamPassword || this.streamPassword
                        this.strVideoID = id                                             
                     
                        this.Stop();                     
                    },
    Play          : function(strStartTime,strEndTime)//开始播放远程视频
                    {
                        var intstreamPort=parseInt(this.streamPort);
                        if(isNaN(intstreamPort))intstreamPort=0;
                        
                        var intPort=parseInt(this.nPort);
                        if(isNaN(intPort))intPort=0; 
                        eval(this.strUrl).Stop();
                        
                        eval(this.strUrl).SetVideoDeviceInfo("1", 0, 0, "1", "1",  this.strVideoID);
                        eval(this.strUrl).SetVideoStreamMediaServerInfo( this.streamIP, intstreamPort, this.streamUser, this.streamPassword);
                        eval(this.strUrl).OpenByTime(strStartTime,strEndTime) ;  
                        //eval(this.strUrl).OpenByTime("2015-05-21 08:31:05","2015-05-21 10:31:05") ;            
                        if( eval(this.strUrl).play())
                        {
                        	$("#txtNodeStatus").val("正常播放");
                            strBackStartTime=strStartTime;
                            strBackEndTime=strEndTime;
                            this.isPlaying=true;
                            return true;
                        }
                        return false;
                    },
    Stop          : function(){
        try
        {
            if( eval(this.strUrl).Stop())
            {
               this.isPlaying=false;
               return true;
            }
        }
        catch(e){}
        return false;
    },          //停止远程浏览
    
    OpenByTime    : function(strStartTime,strEndTime)//开始播放远程视频
    {
        var intstreamPort=parseInt(this.streamPort);
        if(isNaN(intstreamPort))intstreamPort=0;
        
        var intPort=parseInt(this.nPort);
        if(isNaN(intPort))intPort=0; 
    	eval(this.strUrl).SetVideoDeviceInfo(this.strIP, intPort, this.nChannel, this.strUserID, this.strUserPwd, this.strVideoID);
        eval(this.strUrl).SetVideoStreamMediaServerInfo( this.streamIP, intstreamPort, this.streamUser, this.streamPassword);
        return eval(this.strUrl).OpenByTime(strStartTime,strEndTime);
    },
    SaveStop      : function(sUrl){return eval(sUrl).StopRecord();},

    StartPlaySave : function(path){  //return eval(this.strUrl).StartPlaySave();
    this.starttime=eval(this.strUrl).GetOSDTime();
    var myDate = new Date();
    var filename=path;//+"\\视频"
    filename+="\\视频\\" + this.strVideoName + "_" + myDate.getFullYear() + (myDate.getMonth() + 1) + myDate.getDate() +  myDate.getHours() + myDate.getMinutes() + myDate.getSeconds() + ".mp4"; 
    if(eval(this.strUrl).StartRecord(filename))
    {
       alert("同步保存开始:"+filename);
       return true;
    }
    else
    {
       return false; 
    }
    }, //开始浏览时保存 lwj 20090116
    StopPlaySave  : function(){return eval(this.strUrl).StopRecord(); },  //停止浏览时保存
    Pause         : function(){return eval(this.strUrl).Pause(); },         //暂停浏览
    ReStart       : function(){return eval(this.strUrl).Continue(); },       //继续浏览
    Fast          : function(){return eval(this.strUrl).PlayFast(); },          //快进浏览
    Slow          : function(){return eval(this.strUrl).PlaySlow(); },          //慢进浏览
    PlayFrame     : function(){return eval(this.strUrl).PlayNextFrame(); },     //按帧浏览
    PlayNormal    : function(){return eval(this.strUrl).PlayNormal(); },    //恢复正常浏览
    CapturePic    : function(path){
    var myDate = new Date();    
    var filename=path;
    filename+="\\图片\\"+this.strVideoName+"-"+myDate.getFullYear()+"_"+ (myDate.getMonth()+1)+"_"+ myDate.getDate()+"_"+ myDate.getHours() +"_"+ myDate.getMinutes() +"_"+ myDate.getSeconds()+".bmp";
    if( eval(this.strUrl). CapPicture(filename))
    {
        alert(filename) ;
        return filename;
    }
    else
        return ""; },    //浏览时抓图 lwj 20090116
    GetPath       : function(){return this.strFilePath ;},    //得到当前路径 
    SetPath       : function(){  return eval(this.strUrl).SetLoadFilePathEx();},//设置路径
    GetIsPlay     : function(){ return this.isPlaying;},//得到播放状态
    GetOSDTime    : function(){return eval(this.strUrl).GetOSDTime();},//得到回放显示时间
    SetSYSPath    : function()
    {
        eval(this.strUrl).SetSYSPath();
        return eval(this.strUrl).GetSYSPath();
    },
    GetSYSPath    : function(){ return eval(this.strUrl).GetSYSPath();},
    StopDownLoad  : function(){ return eval(this.strUrl).StopDownLoad();},
    StartDownLoad : function(startTime, endTime, path)
    {
        var intstreamPort=parseInt(this.streamPort);
        if(isNaN(intstreamPort))intstreamPort=0;                        
        var intPort=parseInt(this.nPort);
        if(isNaN(intPort))intPort=0;          
        eval(this.strUrl).OpenByTime(startTime,endTime);    
        eval(this.strUrl).SetVideoDeviceInfo(this.strIP, intPort, this.nChannel, this.strUserID, this.strUserPwd, this.strVideoID);       
        eval(this.strUrl).SetVideoStreamMediaServerInfo( this.streamIP, intstreamPort, this.streamUser, this.streamPassword);
        return eval(this.strUrl).StartDownLoad(path);
    } 
};