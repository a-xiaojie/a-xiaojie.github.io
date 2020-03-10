//自定义图层，用户加载ArcGIS Server默认设置下的切片
OpenLayers.Layer.ArcGISTileCache = OpenLayers.Class(OpenLayers.Layer.TileCache, {	
	getURL:function(bounds){	    	    
		var res = this.map.getResolution();
		var bbox = this.maxExtent;
		var size = this.tileSize;
		//Get ArcGIS Server Tile Path
        var tileX = Math.round((bounds.left - bbox.left) / (res * size.w));
        var tileY = Math.round((bbox.top - bounds.top) / (res * size.h));
        //Level
        var tileZ = this.serverResolutions != null ?	        
            OpenLayers.Util.indexOf(this.serverResolutions, res) :
            this.map.getZoom();
        for(var z = 0; z < this.serverResolutions.length; z++){
        	if(Math.floor(this.serverResolutions[z]) == Math.floor(res)){
        		tileZ = z;
        		break;
        	}
        }	        
		var rowID = "00000000" + Math.abs(tileY).toString(16).toUpperCase();
		var colID = "00000000" + Math.abs(tileX).toString(16).toUpperCase();  
		rowID = (tileY >= 0 ? "":"-") + rowID.substr(rowID.length - 8);
		colID = (tileX >= 0 ? "":"-") + colID.substr(colID.length - 8);				
	    var path = "/R" + rowID + "/C" + colID + ".png";    
        var url1 = this.url[tileZ];
        return url1 + path;
	},
	
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.TileCache.prototype.initialize.apply(this, arguments);
    },
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;
        
        var offsetlat = extent.top - bounds.top;  
        var tilerow = Math.floor(offsetlat/tilelat) - this.buffer;
        var tilerowremain = offsetlat/tilelat - tilerow + 1;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.top - tilerow * tilelat;
        
        //alert(tileoffsetx + "  " + tileoffsety + "\n" + tileoffsetlon + "  " + tileoffsetlat);
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },    
    initGriddedTiles:function(bounds){
	var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) + 
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);
        
        var extent = this.map.getMaxExtent();
        var resolution = this.map.getResolution();   
        var tileLayout = this.calculateGridLayout(bounds, extent, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;
        
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;

        var rowidx = 0;
        
        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);
        
    
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
 
            do {
                var tileBounds = 
                    new OpenLayers.Bounds(tileoffsetlon, 
                                          tileoffsetlat, 
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols);
             
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows);
        
        //shave off exceess rows and colums
        
        this.removeExcessTiles(rowidx, colidx);
        
        //now actually draw the tiles
        this.spiralTileLoad();
    },
    
    CLASS_NAME: "OpenLayers.Layer.ArcGISTileCache"
});
//请求瓦片不存在时，显示为空图片
OpenLayers.Util.onImageLoadError = function() {
    this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
    if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
        var urls = this.urls;
        if (urls && urls instanceof Array && urls.length > 1){
            var src = this.src.toString();
            var current_url, k;
            for (k = 0; current_url = urls[k]; k++){
                if(src.indexOf(current_url) != -1){
                    break;
                }
            }
            var guess = Math.floor(urls.length * Math.random());
            var new_url = urls[guess];
            k = 0;
            while(new_url == current_url && k++ < 4){
                guess = Math.floor(urls.length * Math.random());
                new_url = urls[guess];
            }
            this.src = src.replace(current_url, new_url);
        } else {
            this.src = this.src;
        }
    } else {
        this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
        this.src = "../js/OpenLayers/img/blank.gif";//自定义空图片位置
    }
    this.style.display = "";
};

OpenLayers.Control.SelectFeature.prototype.clickFeature=function(feature){
    if(!this.hover) {
        var selected = (OpenLayers.Util.indexOf(
            feature.layer.selectedFeatures, feature) > -1);
        if(selected) {
            if(this.toggleSelect()) {
                this.unselect(feature);
            } else if(!this.multipleSelect()) {
                this.unselectAll({except: feature});
            }
        } else {
            if(!this.multipleSelect()) {
                this.unselectAll({except: feature});
            }
            this.select(feature);
        }
    }
    if(feature&&feature.cluster.length>0)
    {
    	openDialog(feature.cluster[0].attributes.vid);
        //showModalDialog("../GIS/video.aspx?id="+feature.cluster[0].attributes.vid,"","dialogHeight:460px; dialogWidth:775px; status:no;help:no;");//scroll:no;
    }
}

var map;
var VideoLayer;
var selectFeature;
var pgoogle = new OpenLayers.Projection("EPSG:900913");
var pdis = new OpenLayers.Projection("EPSG:4326");
function init(){
    //地图分辨率
    var resolutions=getResolutions(10,18);
    //错误切片透明显示
    OpenLayers.Util.onImageLoadErrorColor="transparent";
    //地图参数
    var options={
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"), 
        resolutions: resolutions,                   
        units: "m",
        maxExtent: new OpenLayers.Bounds(-20037700,-30241100,20037700, 30241100),
        controls:[
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.KeyboardDefaults()
        ]
    };
    map=new OpenLayers.Map("Map1",options);
    mapPan = new OpenLayers.Control.Navigation()
    map.addControl(mapPan);
    mapPan.activate();
    var levels=getCachePath("http://192.168.91.165/map",9);
    var BaseLayer=new OpenLayers.Layer.ArcGISTileCache(
        "BaseLayer",
        levels,
        "basic",
        {
            serverResolutions:resolutions,
            isBaseLayer:true    
        }
    );
    map.addLayer(BaseLayer);
    var style=new OpenLayers.Style({
        externalGraphic:"../images/ico_camera.png",
        graphicWidth:24,
        pointRadius: 8
    },
    {
        context: {
            width: function(feature) {
                   return (feature.cluster) ? 2 : 1;
                   },
            radius: function(feature) {
                    var pix = 2;
                    if(feature.cluster) {
                        pix = Math.min(feature.attributes.count, 7) + 2;
                    }
                    return pix;
                    }
        }
    });
    var style1=new OpenLayers.Style({
        externalGraphic:"../images/ico_video.png",
        graphicWidth:24,
        pointRadius: 8
    });
    strategy = new OpenLayers.Strategy.Cluster();
    VideoLayer=new OpenLayers.Layer.Vector(
        "VideoLayer",
        {
            strategies:[strategy],
            styleMap:new OpenLayers.StyleMap({
                "default":style,
                "select":style1
            })
        }
    );
    map.addLayer(VideoLayer);
    selectFeature = new OpenLayers.Control.SelectFeature(VideoLayer);
    map.addControl(selectFeature);
    selectFeature.activate();
    map.setCenter(new OpenLayers.LonLat(120.165,30.260).transform(pdis,pgoogle),3);
    LoadPoint();
    map.events.register("zoomend",null,LoadPoint);
    map.events.register("moveend",null,LoadPoint);
}

window.onresize=function(){
    if(Map1==null||map==null)
    return false;
    Map1.style.width=document.documentElement.clientWidth;
    Map1.style.height=document.documentElement.clientHeight-27;
    map.updateSize();
}

document.onreadystatechange=function(){
    if(document.readyState=="complete")
    {
        Map1.style.width=document.documentElement.clientWidth;
        Map1.style.height=document.documentElement.clientHeight-27;
        init();
    }
}

function getResolutions(start,end){
    var resolutions = [156542.7269,78271.36346,39135.68172,19567.84086,9783.920432,4891.960215,2445.980108,1222.990054,611.4950271,305.7475134,152.8737568,76.43687839,38.21843919,19.10921959,9.554609796,4.777304898,2.388652449,1.194326225,0.597163112,0.298581556];
    return resolutions.slice(start,end);
}
//获得缓存的相对路径
function getCachePath(rootPath, levels)
{
    var paths = new Array();
    for(i=0;i<levels;i++){
        paths[i] = i<10?rootPath+"/"+"L0"+i:rootPath+"/"+"L"+i;
    }
    return paths;
}
//加载视频监控点
function LoadPoint()
{
    var bounds = map.getExtent().transform(pgoogle,pdis);
    var left=bounds.left;
    var right=bounds.right;
    var top=bounds.top;
    var bottom=bounds.bottom;   
    loadNode(left,right,top,bottom);
}
var distance=30;
var threshold=null;
function LoadSuccess(ajaxRequest){
    var features=[];
    var text = ajaxRequest;//ajaxRequest.responseText; 
    VideoLayer.removeFeatures(VideoLayer.features);   
    if(text=="")
        return false;
    var textArray=text.split('*');
    if(textArray[0]==0)
        return false;
    for(var index in textArray)
    {
        var parse=textArray[index].split('&');
        if(parse[0]==0)
            continue;
        var lonlat=new OpenLayers.LonLat(parse[0],parse[1]).transform(pdis,pgoogle);
        var geometry=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
        geometry.attributes={vid:parse[2]};
        features.push(geometry);
    }
    strategy.distance = 30;
    strategy.threshold =null; 
    VideoLayer.addFeatures(features);
    ChangeFeature();
}
function LoadFail(e){
	
}
var mapPan,mapZoomIn,mapZoomOut,mouseDefaults;
function MapPan()
{
    if(mapPan==null)
    {
        mapPan = new OpenLayers.Control.Navigation();
        map.addControl(mapPan);
    }
    mapPan.activate();
    if(selectFeature==null)
    {
        selectFeature=new OpenLayers.Control.SelectFeature(VideoLayer);
        map.addControl(selectFeature);
    }
    selectFeature.activate();
    if(mapZoomIn!=null)mapZoomIn.deactivate();
    if(mapZoomOut!=null)mapZoomOut.deactivate();
    if(mouseDefaults!=null) mouseDefaults.deactivate();
}
function MapZoomIn()
{
    if(mapZoomIn==null)
    {
        mapZoomIn = new OpenLayers.Control.ZoomBox();
        map.addControl(mapZoomIn);
    }
    mapZoomIn.activate();
    if(mapPan!=null)mapPan.deactivate();
    if(mapZoomOut!=null)mapZoomOut.deactivate();
    if(mouseDefaults!=null) mouseDefaults.deactivate();
}
function MapZoomOut()
{
    if(mapZoomOut==null)
    {
        mapZoomOut=new OpenLayers.Control.ZoomBox({out:true});
        map.addControl(mapZoomOut);
    }
    mapZoomOut.activate();
    if(mapPan!=null)mapPan.deactivate();
    if(mapZoomIn!=null)mapZoomIn.deactivate();
    if(mouseDefaults!=null) mouseDefaults.deactivate();
}
function MapZoomToAll()
{
    map.setCenter(new OpenLayers.LonLat(120.192,30.240).transform(pdis,pgoogle),1);
}

function MouseDefaults()
{
    if(mouseDefaults==null)
    {
        mouseDefaults =new OpenLayers.Control.MouseDefaults();
        map.addControl(mouseDefaults);
    }
    mouseDefaults.activate();
    if(mapPan!=null)mapPan.deactivate();
    if(mapZoomIn!=null)mapZoomIn.deactivate();
    if(mapZoomOut!=null)mapZoomOut.deactivate();
}

var videoNodeID = null;
function ZoomToFeature(iVideoNodeID)
{
    if(iVideoNodeID=="") return;
    videoNodeID = iVideoNodeID;
    //videoStatus(iVideoNodeID);
    /*OpenLayers.Request.GET({
            url: "../GIS/videoStatus.ashx"+"?videoID="+iVideoNodeID,
            success: ZoomToVideo,
            failure: failNotice,
            scope: this
    });*/
}

function failNotice(){}

function ZoomToVideo(ajaxRequest){
    var textArray = ajaxRequest.split(",");
    if(textArray[0]!=0){
        var videoPoint = (new OpenLayers.LonLat(textArray[0],textArray[1])).transform(pdis,pgoogle);
        map.setCenter(videoPoint,5);        
    }
    else
    {
        videoNodeID = null;
        alert("暂无地理位置");
    }
}
function ChangeFeature(){
     if(videoNodeID!=null){
        var features=VideoLayer.features;
        for(var index in features)
        {
            for(var i in features[index].cluster)
            {
                if(features[index].cluster[i].attributes.vid==videoNodeID)
                {
                    var feature=features[index];
                    var selected = (OpenLayers.Util.indexOf(feature.layer.selectedFeatures, feature) > -1);
                    if(selected) {
                        if(selectFeature.toggleSelect()) {
                            selectFeature.unselect(feature);
                        } else if(!selectFeature.multipleSelect()) {
                            selectFeature.unselectAll({except: feature});
                        }
                    } else {
                        if(!selectFeature.multipleSelect()) {
                            selectFeature.unselectAll({except: feature});
                        }
                        selectFeature.select(feature);
                    }
                    videoNodeID=null;
                    return false;
                }
            }
        }
    }
}