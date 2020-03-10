//自定义图层，用于请求arcgis server默认设置下的切片
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
        this.src = "../js/OpenLayers/blank.gif";//自定义空图片位置
    }
    this.style.display = "";
};  

    OpenLayers.Layer.Text.prototype.loadText= function() {    	
        if (!this.loaded ) {//&& this.location
            this.clearFeatures();
	        //this.clearMarkers();
	        var bounds = map.getExtent().transform(pgoogle,pdis);
	        var left = bounds.left;
	        var right = bounds.right;
	        var bottom = bounds.bottom;
	        var top = bounds.top;
            if (this.location != null) {
                var onFail = function(e) {
                    this.events.triggerEvent("loadend");
                };
                this.events.triggerEvent("loadstart");
                OpenLayers.Request.GET({
                    url: this.location+"?left="+left+"&right="+right+"&bottom="+bottom+"&top="+top,
                    success: this.parseData,
                    failure: onFail,
                    scope: this
                });
                //图层变动时，从数据库刷新数据
                //alert(.left);
                //this.loaded = true;
            }
        }    
    };
    
    
    OpenLayers.Layer.Text.prototype.parseData=function(ajaxRequest) {
        var text = ajaxRequest.responseText;
        
        var options = {};
        
        OpenLayers.Util.extend(options, this.formatOptions);
        
        if (this.map && !this.projection.equals(this.map.getProjectionObject())) {
            options.externalProjection = this.projection;
            options.internalProjection = this.map.getProjectionObject();
        }    
        
        var parser = new OpenLayers.Format.Text(options);
        var features = parser.read(text);
        for (var i=0, len=features.length; i<len; i++) {
            var data = {};
            var feature = features[i];
            var location;
            var iconSize, iconOffset;
            
            location = new OpenLayers.LonLat(feature.geometry.x, 
                                             feature.geometry.y);
            
            if (feature.style.graphicWidth 
                && feature.style.graphicHeight) {
                iconSize = new OpenLayers.Size(
                    feature.style.graphicWidth,
                    feature.style.graphicHeight);
            }        
            
            // FIXME: At the moment, we only use this if we have an 
            // externalGraphic, because icon has no setOffset API Method.
            /**
             * FIXME FIRST!!
             * The Text format does all sorts of parseFloating
             * The result of a parseFloat for a bogus string is NaN.  That
             * means the three possible values here are undefined, NaN, or a
             * number.  The previous check was an identity check for null.  This
             * means it was failing for all undefined or NaN.  A slightly better
             * check is for undefined.  An even better check is to see if the
             * value is a number (see #1441).
             */
            if (feature.style.graphicXOffset !== undefined
                && feature.style.graphicYOffset !== undefined) {
                iconOffset = new OpenLayers.Pixel(
                    feature.style.graphicXOffset, 
                    feature.style.graphicYOffset);
            }
            
            if (feature.style.externalGraphic != null) {
                data.icon = new OpenLayers.Icon(feature.style.externalGraphic, 
                                                iconSize, 
                                                iconOffset);
            } else {
                data.icon = OpenLayers.Marker.defaultIcon();

                //allows for the case where the image url is not 
                // specified but the size is. use a default icon
                // but change the size
                if (iconSize != null) {
                    data.icon.setSize(iconSize);
                }
            }
            
            if ((feature.attributes.title != null) 
                && (feature.attributes.description != null)) {
                data['popupContentHTML'] = 
                    '<h2>'+feature.attributes.title+'</h2>' + 
                    '<p>'+feature.attributes.description+'</p>';
                    data['ID']=feature.attributes.title;
            }
            
            data['overflow'] = feature.attributes.overflow || "auto"; 
            
            var markerFeature = new OpenLayers.Feature(this, location, data);
            this.features.push(markerFeature);
            var marker = markerFeature.createMarker();
            if ((feature.attributes.title != null) 
                && (feature.attributes.description != null)) {
              marker.events.register('click', markerFeature, this.markerClick);
            }
            this.addMarker(marker);
        }
        this.events.triggerEvent("loadend");
    }
    
    OpenLayers.Layer.Text.prototype.markerClick=function (evt){
        var sameMarkerClicked = (this == this.layer.selectedFeature);
        this.layer.selectedFeature = (!sameMarkerClicked) ? this : null;
//        for(var i=0, len=this.layer.map.popups.length; i<len; i++) {
//            this.layer.map.removePopup(this.layer.map.popups[i]);
//        }
        if (!sameMarkerClicked) {
            showModalDialog("video.aspx?id="+this.layer.selectedFeature.data['ID']);
            //alert(this.layer.selectedFeature.data['ID']);
            //this.layer.map.addPopup(this.createPopup()); 
        }
        OpenLayers.Event.stop(evt);
        //alert(evt);alert(this.attributes);
    }
   