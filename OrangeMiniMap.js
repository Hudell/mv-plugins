/*=============================================================================
 * Orange - Mini Map
 * By Hudell - www.hudell.com
 * OrangeMiniMap.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Plugin Displays a minimap on the corner of the screen <OrangeMiniMap>
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website:
 * http://hudell.com
 * 
 *=============================================================================*/
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangeMiniMap = Hudell.OrangeMiniMap || {};

function Window_OrangeMinimap() {
    this.initialize.apply(this, arguments);
}

Window_OrangeMinimap.prototype = Object.create(Window_Base.prototype);
Window_OrangeMinimap.prototype.constructor = Window_OrangeMinimap;

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeMiniMap>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeMiniMap parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = {};
  $.Param.ZoomLevel = 8;

  var oldSceneMap_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    oldSceneMap_start.call(this);

    this.createMinimap();
  };

  Window_OrangeMinimap.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
    // this.refresh();
  };

  Window_OrangeMinimap.prototype.windowWidth = function() {
    return $gameMap.width() * $gameMap.tileWidth() / $.Param.ZoomLevel + (this.standardPadding() * 2);
  };
  Window_OrangeMinimap.prototype.windowHeight = function() {
    return $gameMap.height() * $gameMap.tileHeight() / $.Param.ZoomLevel + (this.standardPadding() * 2);
  };  
  Window_OrangeMinimap.prototype.standardPadding = function() {
    return 6;
  };

  Scene_Map.prototype.createMinimap = function() {
    this._minimapWindow = new Window_OrangeMinimap();
    this._minimapWindow.x = SceneManager._screenWidth - this._minimapWindow.windowWidth();
    this._minimapWindow.y = SceneManager._screenHeight - this._minimapWindow.windowHeight();

    this.addChild(this._minimapWindow);

    this._spriteset._tilemap._drawMinimap(this._minimapWindow.contents);
  };

  Tilemap.prototype._drawMinimap = function(bitmap) {
    console.log('started');
    var minX = 0;
    var minY = 0;
    var tileCols = $dataMap.width;
    var tileRows = $dataMap.height;

    for (var y = 0; y < tileRows; y++) {
      for (var x = 0; x < tileCols; x++) {
        var tableEdgeVirtualId = 10000;
        var mx = x;
        var my = y;
        var dx = (mx * this._tileWidth / $.Param.ZoomLevel);
        var dy = (my * this._tileHeight / $.Param.ZoomLevel);
        var lx = dx / this._tileWidth;
        var ly = dy / this._tileHeight;
        var tileId0 = this._readMapData(mx + minX, my + minY, 0);
        var tileId1 = this._readMapData(mx + minX, my + minY, 1);
        var tileId2 = this._readMapData(mx + minX, my + minY, 2);
        var tileId3 = this._readMapData(mx + minX, my + minY, 3);
        // var shadowBits = this._readMapData(mx + minX, my + minY, 4);
        var upperTileId1 = this._readMapData(mx + minX, my + minY - 1, 1);
        var lowerTiles = [];
        var upperTiles = [];

        if (this._isHigherTile(tileId0)) {
          upperTiles.push(tileId0);
        } else {
          lowerTiles.push(tileId0);
        }
        if (this._isHigherTile(tileId1)) {
          upperTiles.push(tileId1);
        } else {
          lowerTiles.push(tileId1);
        }

        // lowerTiles.push(-shadowBits);

        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
          if (!Tilemap.isShadowingTile(tileId0)) {
            lowerTiles.push(tableEdgeVirtualId + upperTileId1);
          }
        }

        if (this._isOverpassPosition(mx + minX, my + minY)) {
          upperTiles.push(tileId2);
          upperTiles.push(tileId3);
        } else {
          if (this._isHigherTile(tileId2)) {
            upperTiles.push(tileId2);
          } else {
            lowerTiles.push(tileId2);
          }
          if (this._isHigherTile(tileId3)) {
            upperTiles.push(tileId3);
          } else {
            lowerTiles.push(tileId3);
          }
        }

        bitmap.clearRect(dx, dy, this._tileWidth / $.Param.ZoomLevel, this._tileHeight / $.Param.ZoomLevel);

        for (var i = 0; i < lowerTiles.length; i++) {
          var lowerTileId = lowerTiles[i];
          if (lowerTileId < 0) {
            // this._drawShadow(bitmap, shadowBits, dx, dy);
          } else if (lowerTileId >= tableEdgeVirtualId) {
            this._drawMiniTableEdge(bitmap, upperTileId1, dx, dy);
          } else {
            this._drawMiniTile(bitmap, lowerTileId, dx, dy);
          }
        }

        for (var j = 0; j < upperTiles.length; j++) {
          this._drawMiniTile(bitmap, upperTiles[j], dx, dy);
        }
      }
    }

    console.log('finished');
  }; 

  Tilemap.prototype._drawMiniTableEdge = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
      var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
      var kind = Tilemap.getAutotileKind(tileId);
      var shape = Tilemap.getAutotileShape(tileId);
      var tx = kind % 8;
      var ty = Math.floor(kind / 8);
      var setNumber = 1;
      var bx = tx * 2;
      var by = (ty - 2) * 3;
      var table = autotileTable[shape];

      if (table) {
        var source = this.bitmaps[setNumber];
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 2; i++) {
            var qsx = table[2 + i][0];
            var qsy = table[2 + i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1 + h1/2;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            bitmap.blt(source, sx1, sy1, w1, h1/2, dx1, dy1, w1 / $.Param.ZoomLevel, h1/2 / $.Param.ZoomLevel);
        }
      }
    }
  };

  Tilemap.prototype._drawMiniTile = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
      if (Tilemap.isAutotile(tileId)) {
        this._drawMiniAutotile(bitmap, tileId, dx, dy);
      } else {
        this._drawMiniNormalTile(bitmap, tileId, dx, dy);
      }
    }
  };

  Tilemap.prototype._drawMiniNormalTile = function(bitmap, tileId, dx, dy) {
    var setNumber = 0;

    if (Tilemap.isTileA5(tileId)) {
        setNumber = 4;
    } else {
        setNumber = 5 + Math.floor(tileId / 256);
    }

    var w = this._tileWidth;
    var h = this._tileHeight;
    var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
    var sy = (Math.floor(tileId % 256 / 8) % 16) * h;

    var source = this.bitmaps[setNumber];
    if (source) {
        bitmap.blt(source, sx, sy, w, h, dx, dy, w / $.Param.ZoomLevel, h / $.Param.ZoomLevel);
    }
};

/**
 * @method _drawAutotile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 */
Tilemap.prototype._drawMiniAutotile = function(bitmap, tileId, dx, dy) {
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    var kind = Tilemap.getAutotileKind(tileId);
    var shape = Tilemap.getAutotileShape(tileId);
    var tx = kind % 8;
    var ty = Math.floor(kind / 8);
    var bx = 0;
    var by = 0;
    var setNumber = 0;
    var isTable = false;

    if (Tilemap.isTileA1(tileId)) {
        var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
        setNumber = 0;
        if (kind === 0) {
            bx = waterSurfaceIndex * 2;
            by = 0;
        } else if (kind === 1) {
            bx = waterSurfaceIndex * 2;
            by = 3;
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        } else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
            if (kind % 2 === 0) {
                bx += waterSurfaceIndex * 2;
            }
            else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                by += this.animationFrame % 3;
            }
        }
    } else if (Tilemap.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }

    var table = autotileTable[shape];
    var source = this.bitmaps[setNumber];

    if (table && source) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
            var qsx = table[i][0];
            var qsy = table[i][1];
            var sx1 = (bx * 2 + qsx) * w1;
            var sy1 = (by * 2 + qsy) * h1;
            var dx1 = dx + (i % 2) * w1 / $.Param.ZoomLevel;
            var dy1 = dy + Math.floor(i / 2) * h1 / $.Param.ZoomLevel;
            if (isTable && (qsy === 1 || qsy === 5)) {
                var qsx2 = qsx;
                var qsy2 = 3;
                if (qsy === 1) {
                    qsx2 = [0,3,2,1][qsx];
                }
                var sx2 = (bx * 2 + qsx2) * w1 / $.Param.ZoomLevel;
                var sy2 = (by * 2 + qsy2) * h1 / $.Param.ZoomLevel;
                bitmap.blt(source, sx2, sy2, w1, h1, dx1, dy1, w1 / $.Param.ZoomLevel, h1 / $.Param.ZoomLevel);
                dy1 += h1/2;
                bitmap.blt(source, sx1, sy1, w1, h1/2, dx1, dy1, w1 / $.Param.ZoomLevel, h1/2 / $.Param.ZoomLevel);
            } else {
                bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1 / $.Param.ZoomLevel, h1 / $.Param.ZoomLevel);
            }
        }
    }
};


})(Hudell.OrangeMiniMap);

OrangeMiniMap = Hudell.OrangeMiniMap;
Imported["OrangeMiniMap"] = 1.0;