// JScript 文件

/*****************************
 * 功能说明:CLocalPlayer类 
 * 本地回放控件，用于播放本地视频文件         
 *****************************/
function CLocalPlayer(sUrl){
    this.isPlayFrame=false;
    this.strUrl          = sUrl || "document.getElementById('AVLocalVideo')";
    this.nPlayState      = 0;               

    this.Open            = function(){                           //打开
//                        if(eval(this.strUrl).OpenFileBySelectEx()){
//                          if( !eval(this.strUrl).PlayEx() ) alert("文件不能打开！");
                          if(eval(this.strUrl).OpenFile()){
                          if(!eval(this.strUrl).Play() )
                          { alert("文件不能打开！");}
                          else
                          { 
                            $('.videoplay').removeAttr("disabled");
                            r.sldMax=this.GetFileTotalTime();
                          }
                        }
//                        else{
//                         alert("文件不能打开！");
//                        }
document.getElementById('showCapturePic').innerHTML="";
                      };
    this.Play            = function(){                           //播放}
    //if(this.isPlayFrame)
    // return;
if(!eval(this.strUrl).Play()){
                             alert("播放文件失败！")};
                     document.getElementById('showCapturePic').innerHTML="";
 };
    this.Pause           = function(){                           //暂停
                    eval(this.strUrl).Pause();
                      document.getElementById('showCapturePic').innerHTML="";
};
    this.CapturePic      = function(){                           //抓拍
                        var strPath =document.all('HFSavePath').text;
                        var   date;   
                        var   current="";   
                        date   =   new   Date();
                        var dateMonth=date.getMonth()+1;
                        current   +=   date.getFullYear();
                        current   +=   "-"+dateMonth;
                        current   +=   "-"+date.getDate()
                        current   +=   "-"+date.getHours();
                        current   +=   "-"+date.getMinutes();
                        current   +=   "-"+date.getSeconds();
                        var strTimeReplace=current;
                        var url=strPath+"\\"+"图片\\"+strTimeReplace+".bmp";
                       // var url=strTimeReplace+".bmp";//关于图片名称中是否包含path，需要调试
                       // var bCap = eval(this.strUrl).CapPicEx(url);//CapturePicEx
                        var bCap = eval(this.strUrl).CapturePicEx(url);//CapturePicEx
                        $("#showCapturePic").show();
                        if(bCap)
                        {
                        	$("#showCapturePic").html("抓图成功，图片保存在："+url);
                        }
                        else
                        {
                        	$("#showCapturePic").html("抓图失败");
                        }
                        setTimeout(function(){
                            $("#showCapturePic").hide("slow");
                        },1000);
                      };
    this.Stop            = function(){eval(this.strUrl).Stop();document.getElementById('showCapturePic').innerHTML="";
};           //停止1
    this.Slow            = function(){eval(this.strUrl).PlaySlow();document.getElementById('showCapturePic').innerHTML="";
};           //慢放1
    this.Fast            = function(){eval(this.strUrl).PlayFast();document.getElementById('showCapturePic').innerHTML="";
};           //快放1
    this.PlayFrame       = function(){this.isPlayFrame=true;eval(this.strUrl).PlayNextFrame();document.getElementById('showCapturePic').innerHTML="";
};   //帧播放1
    this.PlayNormal      = function(){this.isPlayFrame=false;eval(this.strUrl).PlayNormal();document.getElementById('showCapturePic').innerHTML="";
};           //复位1    
    this.GotoStart       = function(){this.Stop();this.Play();document.getElementById('showCapturePic').innerHTML="";
};        //回到起始
    this.GotoEndEx       = function(){this.Stop();document.getElementById('showCapturePic').innerHTML="";
};        //结束
    this.SetState        = function(n) { this.nPlayState = n; document.getElementById('showCapturePic').innerHTML="";
};

    this.SetPlayedTime        = function(n) { eval(this.strUrl).SetPlayedTime(n);
};
    this.GetPlayedTime        = function() {return eval(this.strUrl).GetPlayedTime();
};
    this.GetFileTotalTime       = function() {return eval(this.strUrl).GetFileTotalTime();
};
    this.SetZoomOutNum      =function(n){return eval(this.strUrl).SetZoomOutNum(n);
};
    this.CutVideo   =function(start,end){
    var strFile=GetCookie("SavePath") || "C:\\videofile"; 
    var filename=strFile+"\\video";
    var myDate = new Date();
    filename+="\\"+myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+"-"+ myDate.getTime()+"-"+myDate.getMinutes()+"-"+myDate.getSeconds()+".mp4"; 
    eval(this.strUrl).SetSaveRecordPath(filename);
    eval(this.strUrl).SetSaveVideoPara(1,start,end);
    return eval(this.strUrl).StartSaveVideo();
 };
 this.GetFilePathName    =function(n){return eval(this.strUrl).GetFilePathName(n);
 };
 this.GetFilePathName    =function(n){return eval(this.strUrl).GetFilePathName();
 };

 this.OpenFileEx		=function(n){
	 if(eval(this.strUrl).OpenFileEx(n)){
     if(!eval(this.strUrl).Play() )
     { alert("文件不能打开！");}
     else
     { 
       $('.videoplay').removeAttr("disabled");
       r.sldMax=this.GetFileTotalTime();
     }
   }
 };
};
