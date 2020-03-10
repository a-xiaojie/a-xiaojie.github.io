// JScript 文件

/*****************************************************************************
*功能说明:PtzControl类
* 控制代理控件
*****************************************************************************/

//-----------
//   设备
//-----------
var DeciveType = { PELCOMATRIX : 1, ABMATRIX : 2, HIKDVR : 3, DHDVR : 4  };
//-----------
//   控制
//0 - 向左
//1 - 向右
//2 - 向上
//3 - 向下
//4 - 镜头放大
//5 - 镜头缩小
//6 –左上
//7 –左下
//8 –右上
//9 –右下
//10 - 聚焦(远)
//11 - 聚焦(近)
//12 - 光圈放大
//13 –光圈缩小

//-----------
var PTZCTRLOPR = {
        LEFT : 0, RIGHT : 1, UP : 2, DOWN : 3, FARR : 5, NEARR : 4,
        WIDE : 10, TINY : 11, BRIGHTER : 13, DARK : 12, AUXOPEN : 21, AUXCLOSE : 22,
        SETPOS : 21, OPRPOS : 22, DELPOS : 23, UPLEFT : 6, UPRIGHT : 8,
        DOWNLEFT : 7, DOWNRIGHT : 9
    };

    function CPtzControl(sUrl) {
        this.strUrl = sUrl;   // || "document.getElementById('PtzControl')";
        this.sCmr = null;   //Camra号 ----改为{String}
        this.strControlServerIP = null;   //控制代理IP "192.168.9.126"
        this.nControlServerPort = null;   //控制代理端口号 3232
        this.strUserID = null;   //用户名 "admin" 
        this.nUserLevel = null;   //用户权限0~255 200

        this.nDecType = null;   //设备类型
        this.strMatrixName = null;   //矩阵
        this.strDvrTypeNum = null;   //DVR类型编号
        this.strDvrIP = null;   //DVRIP
        this.nDvrPort = null;   //DVR端口
        this.nDvrChannel = null;   //DVR通道
        this.strDvrUserName = null;   //DVR用户名
        this.strDvrPassword = null;   //DVR密码       

        //连接控制代理服务器
        this.Connect = function () { this.LuoConnect(); };

        //---------------------
        //   云台控制初始化
        //---------------------
        this.PtzCtrlConn = function (sCmr, sControlServerIP, iControlServerPort, sUserID, iUserLevel, sMatrixName, sDvrIP, iDvrPort, iDvrChannel, sDvrUserName, sDvrPassword) {
            this.sCmr = sCmr;
            this.strControlServerIP = sControlServerIP;
            this.nControlServerPort = iControlServerPort;
            this.strUserID = sUserID;
            this.nUserLevel = iUserLevel;
            this.strMatrixName = sMatrixName;
            this.strDvrIP = sDvrIP;
            this.nDvrPort = iDvrPort;
            this.nDvrChannel = iDvrChannel;
            this.strDvrUserName = sDvrUserName;
            this.strDvrPassword = sDvrPassword;
            this.nDecType = this.PtzDecTypeConvert();
            try {
                this.SetConnectInfo(this.strControlServerIP, this.nControlServerPort);
                this.SetUserInfo(this.strUserID, this.nUserLevel);
                this.LuoConnect();
            } catch (e) { }
        }
        this.PtzDecTypeConvert = function () {
            var iDecType = -1;
            if (this.strMatrixName == "pelco") iDecType = DeciveType.PELCOMATRIX;
            else if (this.strMatrixName == "AB") iDecType = DeciveType.ABMATRIX;
            else if (this.strMatrixName == "HIK") iDecType = DeciveType.HIKDVR;
            else if (this.strMatrixName == "DH") iDecType = DeciveType.DHDVR;
            return iDecType;
        }
        //---------------------
        //     云台控制
        //---------------------
        this.PtzCtrl = function (nOprCmd, nSpeed, nStop) {
            switch (this.nDecType) {
                case DeciveType.PELCOMATRIX:
                case DeciveType.ABMATRIX:
                    this.PtzCtrlMatrix(nOprCmd, nSpeed, nStop);
                    break;
                case DeciveType.HIKDVR:
                case DeciveType.DHDVR:
                    this.PtzCtrlDVR(nOprCmd, nSpeed, nStop);
                    break;
            }
            return true;
        }

        //---------------------
        //     矩阵控制
        //---------------------
        this.PtzCtrlMatrix = function (nOprCmd, nSpeed, nStop) {
            var bRet = true;
            try {
                var nMonitor = 1;
                this.MatrixSetMonitorCmr(nMonitor, this.sCmr, this.nDecType);
                if (nStop == 1) nSpeed = 0;
                switch (nOprCmd) {
                    case PTZCTRLOPR.SETPOS:
                    case PTZCTRLOPR.DELPOS:
                        break;
                    case PTZCTRLOPR.OPRPOS:
                        break;
                    default:
                        this.MatrixPTZCtrlSpeed(this.sCmr, nOprCmd, nSpeed, this.nDecType);
                        break;
                }
            } catch (e) { }
            return bRet;
        }

        //---------------------
        //     DVR控制
        //---------------------
        this.PtzCtrlDVR = function (nOprCmd, nSpeed, nStop) {
            var bRet = true;
            try {
                this.DVRPTZInfo(this.strDvrIP, this.nDvrPort, this.strDvrUserName, this.strDvrPassword, this.nDecType);
                switch (nOprCmd) {
                    case PTZCTRLOPR.SETPOS:
                    case PTZCTRLOPR.DELPOS:
                    case PTZCTRLOPR.OPRPOS:
                        // this.DVRPreSet();         
                        break;
                    default:
                        this.DVRPTZCtrlSpeed(this.nDvrChannel, nOprCmd, nSpeed, nStop, this.nDecType);
                        break;
                }
            } catch (e) { }
            return bRet;
        }


        //====================================================
        //                   控件接口
        //====================================================
        //Socket消息映射
        //void LuoConnect()
        this.LuoConnect = function () { try { eval(this.strUrl).LuoConnect(); } catch (e) { } };
        //云台控制
        //boolean LuoPtzContro(short sCmr, short nType)
        //  sCmr：摄像头号  nType：控制命令{STOP=0,LEFT=1,RIGHT=2,UP=3,DOWN=4,FARR=5,NEARR=6,WIDE=7,TINY=8}
        //  return：true 表示成功，false 表示失败
        this.LuoPtzContro = function (sCmr, nType) {
            var bRet = false;
            try { bRet = eval(this.strUrl).LuoPtzContro(sCmr, nType); }
            catch (e) { bRet = false; }
            return bRet;
        };
        //设置用户信息
        //void SetUserInfo(BSTR pStrUserID, short nUserLevel)
        //  strUserID：用户名 nUserLevel：用户等级
        this.SetUserInfo = function (strUserID, nUserLevel) {
            try { eval(this.strUrl).SetUserInfo(strUserID, nUserLevel); } catch (e) { }
        };
        //设置连接控制代理服务器地址
        //void SetConnectInfo(BSTR pStrIP, short nPort)
        //  pStrIP：IP地址  nPort：端口号
        this.SetConnectInfo = function (strIP, nPort) {
            try { eval(this.strUrl).SetConnectInfo(strIP, nPort); } catch (e) { }
        };
        //设置云台控制的监视器号，摄像头号           
        //void LuoPtzSetMonitorCmr(short nMonitor, short sCmr)
        //  nMonitor：监视器  sCmr：摄像头
        this.LuoPtzSetMonitorCmr = function (nMonitor, sCmr) {
            try { eval(this.strUrl).LuoPtzSetMonitorCmr(nMonitor, sCmr); } catch (e) { }
        };
        //设置云台控制的通道号、监视器号，摄像头号
        //boolean PTZVipSetMntCmr(short nChannel, short nMonitor, short sCmr)
        //  nChannel：通道号  nMonitor：监视器  sCmr：摄像头
        //  return：true 表示成功，false 表示失败
        this.PTZVipSetMntCmr = function (nChannel, nMonitor, sCmr) {
            var bRet = false;
            try { bRet = eval(this.strUrl).PTZVipSetMntCmr(nChannel, nMonitor, sCmr); }
            catch (e) { bRet = false; }
            return bRet;
        };
        //根据云台控制的通道号查询摄像头号
        //boolean PTZQueryChannelCmr(short nChannel)
        //  nChannel：通道号
        //  return：true 表示成功，false 表示失败
        this.PTZQueryChannelCmr = function (nChannel) {
            var bRet = false;
            try { bRet = eval(this.strUrl).PTZQueryChannelCmr(nChannel); }
            catch (e) { bRet = false; }
            return bRet;
        };
        //获取通道，摄像头号 ***BS不支持
        //void LuoGetVipChannelCmr(short* pChannel, short* pCmr)

        //=====新添加的矩阵函数
        //设置摄像头、监视器
        //void MatrixSetMonitorCmr(short nMonitor, short sCmr, int nDecType)
        this.MatrixSetMonitorCmr = function (nMonitor, sCmr, nDecType) {
            try { eval(this.strUrl).MatrixSetMonitorCmr(nMonitor, sCmr, nDecType); } catch (e) { }
        };
        //球机号、命令、速度
        //void MatrixPTZCtrlSpeed(SHORT sCmr, SHORT nType, SHORT nSpeed, int nDecType)
        this.MatrixPTZCtrlSpeed = function (sCmr, nType, nSpeed, nDecType) {
            try { eval(this.strUrl).MatrixPTZCtrlSpeed(sCmr, nType, nSpeed, nDecType); } catch (e) { }
        };
        //设置预置位
        //void MatrixSetPreSet(SHORT sCmr,BSTR strPosInfo, SHORT sPosID, int nDecType)
        this.MatrixSetPreSet = function (sCmr, strPosInfo, nPosID, nDecType) {
            try { eval(this.strUrl).MatrixSetPreSet(sCmr, strPosInfo, nPosID, nDecType); } catch (e) { }
        };
        //执行预置位
        //void MatrixCtrlPreSet(SHORT sPreSetID, int nDecType)
        this.MatrixCtrlPreSet = function (nPreSetID, nDecType) {
            try { eval(this.strUrl).MatrixCtrlPreSet(nPreSetID, nDecType); } catch (e) { }
        };
        //读取预置位文件
        //void MatrixReadPreSetFile(SHORT sCmr, int nDecType)
        this.MatrixReadPreSetFile = function (sCmr, nDecType) {
            try { eval(this.strUrl).MatrixReadPreSetFile(sCmr, nDecType); } catch (e) { }
        };

        //=====新添加的DVR接口函数
        //设置DVR的相关信息
        //void DVRPTZInfo(BSTR pDVRIP, SHORT sDVRPort, BSTR pDVRUserName, BSTR pDVRUserPwd,int nDecType)
        this.DVRPTZInfo = function (sDVRIP, nDVRPort, sDVRUserName, sDVRUserPwd, nDecType) {
            try { eval(this.strUrl).DVRPTZInfo(sDVRIP, nDVRPort, sDVRUserName, sDVRUserPwd, nDecType); } catch (e) { }
        };
        //DVR的控制速度
        //void DVRPTZCtrlSpeed(SHORT nChannel, SHORT nCmdType, SHORT nSpeed,SHORT nStop,int nDecType)
        this.DVRPTZCtrlSpeed = function (nChannel, nCmdType, nSpeed, nStop, nDecType) {
            try { eval(this.strUrl).DVRPTZCtrlSpeed(nChannel, nCmdType, nSpeed, nStop, nDecType); } catch (e) { }
        };
        //预置位操作
        //void DVRPreSet(SHORT nChannel,SHORT sPresetCmd, BSTR strPosInfo, SHORT sPosID,int nDecType)
        this.DVRPreSet = function (nChannel, nPresetCmd, strPosInfo, nPosID, nDecType) {
            try { eval(this.strUrl).DVRPreSet(nChannel, nPresetCmd, strPosInfo, nPosID, nDecType); } catch (e) { }
        };
        //巡航操作 
        //void DVRCruise(SHORT nChannel, int nCmdType, int nCruiseRoute, int nCruisePoint, int nInPut,int nDecType)
        this.DVRCruise = function (nChannel, nCmdType, nCruiseRoute, nCruisePoint, nInPut, nDecType) {
            try { eval(this.strUrl).DVRCruise(nChannel, nCmdType, nCruiseRoute, nCruisePoint, nInPut, nDecType); } catch (e) { }
        };
        //读取预置位文件
        //void DVRReadPreSetFile(BSTR pDVRIP,SHORT sDVRPort,SHORT nChannel,int nDecType)
        this.DVRReadPreSetFile = function (sDVRIP, nDVRPort, nChannel, nDecType) {
            try { eval(this.strUrl).DVRReadPreSetFile(sDVRIP, nDVRPort, nChannel, nDecType); } catch (e) { }
        };
    };
