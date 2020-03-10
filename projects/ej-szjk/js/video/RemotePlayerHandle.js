///<reference path="CookiesHandle.js" /> 
  function onRemoteVideoView()
                {
                var strTemp= document.all('remoteVideoNodeInfo').value;
                if(strTemp=="")//判断监控点信息是否正确，补充！
                {
                  alert("请选择监控点！");
                  return;
                }
               var paras=strTemp.split('|');
                if(paras.length<2 )
                {
                 alert("播放参数缺失，请重新选择监控点！");
                 return;
                }
               var startTime=document.all('txtStartTime').value;
               var endTime=document.all('txtEndTime').value;
               if(!isDateTime(startTime))
               {
                  alert("开始时间格式错误！");
                  return;
               }
                if(!isDateTime(endTime))
               {
                  alert("结束时间格式错误！");
                  return;
               }
               if(startTime >= endTime)
               { 
                  alert("开始时间需要早于结束时间！");
                  return;
               }
             CRemotePlayer.Stop()
             if(!CRemotePlayer.Play(startTime,endTime))
             {
               alert("远程回放失败！");
             }
             else 
             {                
                var log = "远程回放！监控点：" + $("strVideoNodeName").val();
                Logging(log);
             }
             SetPlayTime(startTime,endTime);
             //关闭同步保存状态
             closeSave();
        }
               
    
 //关闭同步保存状态
 function closeSave()
{

    if(document.all('endSave').style.display=='')
    {
        CRemotePlayer.StopPlaySave();
        document.all('endSave').style.display='none';
        document.all('startSave').style.display='';
        document.all('tdSavequee').style.display='none';
     //   document.all('Savequee').style.display='none';
    }
}

function stopCloseSave()
{
    CRemotePlayer.SaveStop(document.getElementById('AVRemoteVideo'));
    parent.RightFram.document.all('endSave').style.display='none';
    parent.RightFram.document.all('startSave').style.display='';
    parent.RightFram.document.all('tdSavequee').style.display='none';
}
   
   //开始同步保存    
 function onClkstartSave()
{
    if(!CRemotePlayer.GetIsPlay())
    {
        alert("请先播放视频！");
        return;
    }
   var strTemp= document.all('remoteVideoNodeInfo').value;
   if(strTemp=="")//判断监控点信息是否正确，补充！
   {
      alert("请选择监控点！");
      return;
   }
  if(sFunNums=="")
  {
     alert("Session过期，请重新登录！");
     return;
  }
   if(sFunNums.indexOf("009")>=0){
    if(CRemotePlayer.StartPlaySave())
    {
        var log = "同步保存！监控点：" + $("strVideoNodeName").val();
        Logging(log);
        document.all('startSave').style.display='none';
        document.all('endSave').style.display=''; 
        document.all('tdSavequee').style.display='';
    }
    else
    {
      alert("同步保存失败！");
    }
    }else
    {
      alert("您没有此监控点的远程回放下载权限，请与管理员联系！");
    }
}     
//结束同步保存  
  function onClkendSave()
{    
closeSave();
}     

//开始快速下载
  function onClkstartSave1()
{ 
  if(CRemotePlayer.GetIsPlay())
  {
     alert("请关闭播放后下载！");
     return;
  }
  
  var strTemp= document.all('remoteVideoNodeInfo').value;
   if(strTemp=="")//判断监控点信息是否正确，补充！
   {
      alert("请选择监控点！");
      return;
   }
  if(sFunNums=="")
  {
     alert("Session过期，请重新登录！");
     return;
  }
  if(sFunNums.indexOf("009") >= 0)
  {
   var paras=strTemp.split('|');
    if(paras.length < 2 )
    {
     alert("播放参数缺失，请重新选择监控点！");
     return;
    }
    var startTime=document.all('txtStartTime').value;
    var endTime=document.all('txtEndTime').value;
    if(!isDateTime(startTime))
    {
      alert("开始时间格式错误！");
      return;
    }
    if(!isDateTime(endTime))
    {
      alert("结束时间格式错误！");
      return;
    }
    if(startTime >= endTime)
    {
      alert("开始时间需要早于结束时间！");
      return;
    }
    var strFilePath=GetCookie("SavePath") || "C:\\videofile"; 
    strFilePath+="\\视频\\";//视频\\
    var myDate = new Date();
    var filename=document.all('strVideoNodeName').innerText;
    var log="监控点:"+filename+",录像时间范围:"+ChangeTime(startTime) +"至" +ChangeTime(endTime);
    filename+="-" +ChangeTime(startTime) +"至" +ChangeTime(endTime) +"("+myDate.getFullYear()+(myDate.getMonth()+1)+myDate.getDate()+ myDate.getHours()+myDate.getMinutes()+myDate.getSeconds()+")"+".mp4";
    CRemotePlayer.StopDownLoad();
    
   if( CRemotePlayer.StartDownLoad(startTime, endTime, strFilePath + filename))
   {
    document.all('startSave1').style.display='none';
    document.all('endSave1').style.display=''; 
    document.all('tdSavequee1').style.display=''; 
    alert("录像开始下载,"+strFilePath+filename);
    Logging(log);
   }
   else
   {
      //var strError=DownloadPlayer.GetLastError();
      alert("下载失败");
      CRemotePlayer.StopDownLoad();
      document.all('startSave1').style.display='';
      document.all('endSave1').style.display='none';  
      document.all('tdSavequee1').style.display='none';
    }
     }else
    {
      alert("您没有此监控点的远程回放下载权限，请与管理员联系！");
    }
}
    
//结束快速下载
 function onClkendSave1()
{
  document.all('endSave1').style.display='none';
  document.all('startSave1').style.display='';
  document.all('tdSavequee1').style.display='none'; 
  CRemotePlayer.StopDownLoad();

}
 function onClkSavePath()
{
    try
    {
        document.all("AVRemoteVideo").SetLoadFilePathEx();
        var strPath ="C:\\videofile";//需修改
        document.getElementById("btSavePath1").title=strPath;
        if(strPath != null)
        {
            SetCookie("SavePath",strPath,2592000);
//            document.getElementById('btSavePath1').setAttribute('title','当前路径为:'+strPath+'\\');
            document.getElementById('btSavePath1').innerText='存储路径为:'+strPath+'\\';
            document.all("DownDvrVideoX1").SetLoadFilePathE(strPath);
        }
    }
    catch(e)
    {
    }
}
      
                                  
//判断是否是时间格式 
function isDateTime(str)
{
var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
var r = str.match(reg);
if(r==null)return false;
var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
}

 function ChangeTime(strtime)
  {
       var strtimeRal;
       strtimeRal=strtime.replace(":","-");
       strtimeRal=strtimeRal.replace(":","-");
       strtimeRal=strtimeRal.replace(".","-");
       strtimeRal=strtimeRal.replace(" ","-");
       return strtimeRal;
  }
