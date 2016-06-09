/*=============================================================================
 * Orange - Mapshot
 * By Hudell - www.hudell.com
 * OrangeMapshot.js
 * Version: 1.7
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc This plugin will save a picture of the entire map on a Mapshots folder when you press a key. <OrangeMapshot>
 * @author Hudell
 *
 * @param useMapName
 * @desc if true, the filename will be the name of the map. If false it will be the number.
 * @default true
 *
 * @param layerType
 * @desc 0 = all, 1 = upper and lower, 2 = separate everything
 * @default 0
 *
 * @param drawAutoShadows
 * @desc set this to false to disable autoshadows on the map shot
 * @default true
 *
 * @param drawEvents
 * @desc set this to false to stop drawing the events on the full bitmap
 * @default true
 *
 * @param keyCode
 * @desc code of the key that will be used (44 = printscreen). http://link.hudell.com/js-keys
 * @default 44
 *
 * @param imageType
 * @desc What type of image should be generated. Can be png, jpeg or webp
 * @default png
 *
 * @param imageQuality
 * @desc If the imageType is jpeg or webp, you can set this to a number between 0 and 100 indicating the quality of the image
 * @default 70
 *
 * @param imagePath
 * @desc The path where the images will be saved
 * @default ./Mapshots
 *
 * @help
 * Check keycodes at  http://link.hudell.com/js-keys
 */
var Imported = Imported || {};

var OrangeMapshot = OrangeMapshot || {};

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) {
    return plugin.description.indexOf('<OrangeMapshot>') >= 0;
  });
  if (parameters.length === 0) {
    throw new Error("Couldn't find OrangeMapshot parameters.");
  }
  $.Parameters = parameters[0].parameters;

  $.Param = {};
  $.Param.useMapName = $.Parameters.useMapName !== "false";
  $.Param.drawAutoShadows = $.Parameters.drawAutoShadows !== "false";
  $.Param.drawEvents = $.Parameters.drawEvents !== "false";
  $.Param.layerType = Number($.Parameters.layerType || 0);
  $.Param.imageType = $.Parameters.imageType || 'png';
  $.Param.imagePath = $.Parameters.imagePath || './Mapshots';
  $.Param.imageQuality = Number($.Parameters.imageQuality || 70);

  $.Param.keyCode = Number($.Parameters.keyCode || 44);

  $.imageType = function() {
    if ($.Param.imageType == 'webp') return 'image/webp';
    if ($.Param.imageType == 'jpeg' || $.Param.imageType == 'jpg') return 'image/jpeg';
    return 'image/png';
  };

  $.imageRegex = function() {
    if ($.Param.imageType == 'webp') return (/^data:image\/webp;base64,/);
    if ($.Param.imageType == 'jpeg' || $.Param.imageType == 'jpg') return (/^data:image\/jpeg;base64,/);
    
    return (/^data:image\/png;base64,/);
  };

  $.fileExtension = function() {
    if ($.Param.imageType == 'webp') return '.webp';
    if ($.Param.imageType == 'jpeg' || $.Param.imageType == 'jpg') return '.jpg';
    return '.png';
  };

  $.imageQuality = function() {
    if ($.fileExtension() == '.jpg' || $.fileExtension() == '.webp') {
      return Math.min($.Param.imageQuality, 100) / 100;
    }

    return 1;
  };

  $.baseFileName = function() {
    var mapName = ($gameMap._mapId).padZero(3);
    if ($.Param.useMapName) {
      mapName = $dataMapInfos[$gameMap._mapId].name;
    } else {
      mapName = 'Map' + mapName;
    }

    return mapName;
  };

  $.getMapshot = function() {
    var lowerBitmap;
    var upperBitmap;

    switch($.Param.layerType) {
      case 1 :
        lowerBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        upperBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        SceneManager._scene._spriteset._tilemap._paintEverything(lowerBitmap, upperBitmap);

        return [lowerBitmap, upperBitmap];
      case 2 :
        var groundBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var ground2Bitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var lowerBitmapLayer = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var upperBitmapLayer = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var shadowBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var lowerEvents = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var normalEvents = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        var upperEvents = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());

        SceneManager._scene._spriteset._tilemap._paintLayered(groundBitmap, ground2Bitmap, lowerBitmapLayer, upperBitmapLayer, shadowBitmap, lowerEvents, normalEvents, upperEvents);
        return [groundBitmap, ground2Bitmap, lowerBitmapLayer, upperBitmapLayer, shadowBitmap, lowerEvents, normalEvents, upperEvents];
      default :
        lowerBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        upperBitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        SceneManager._scene._spriteset._tilemap._paintEverything(lowerBitmap, upperBitmap);

        var bitmap = new Bitmap($dataMap.width * $gameMap.tileWidth(), $dataMap.height * $gameMap.tileHeight());
        bitmap.blt(lowerBitmap, 0, 0, lowerBitmap.width, lowerBitmap.height, 0, 0, lowerBitmap.width, lowerBitmap.height);
        bitmap.blt(upperBitmap, 0, 0, upperBitmap.width, upperBitmap.height, 0, 0, upperBitmap.width, upperBitmap.height);
        return [bitmap];
    }
  };

  Tilemap.prototype._paintEverything = function(lowerBitmap, upperBitmap) {
    var tileCols = $dataMap.width;
    var tileRows = $dataMap.height;

    for (var y = 0; y < tileRows; y++) {
      for (var x = 0; x < tileCols; x++) {
        this._paintTilesOnBitmap(lowerBitmap, upperBitmap, x, y);
      }
    }

    if ($.Param.drawEvents !== false) {
      this._paintCharacters(lowerBitmap, 0);
      this._paintCharacters(lowerBitmap, 1);
      this._paintCharacters(upperBitmap, 2);    
    }
  };

  Tilemap.prototype._paintLayered = function(groundBitmap, ground2Bitmap, lowerBitmap, upperLayer, shadowBitmap, lowerEvents, normalEvents, upperEvents) {
    var tileCols = $dataMap.width;
    var tileRows = $dataMap.height;

    for (var y = 0; y < tileRows; y++) {
      for (var x = 0; x < tileCols; x++) {
        this._paintTileOnLayers(groundBitmap, ground2Bitmap, lowerBitmap, upperLayer, shadowBitmap, x, y);
      }
    }

    this._paintCharacters(lowerEvents, 0);
    this._paintCharacters(normalEvents, 1);
    this._paintCharacters(upperEvents, 2);        
  };

  Tilemap.prototype._paintCharacters = function(bitmap, priority) {
    this.children.forEach(function(child) {
      if (child instanceof Sprite_Character) {
        if (child._character !== null) {
          if (child._character instanceof Game_Player || child._character instanceof Game_Follower || child._character instanceof Game_Vehicle) return;
        } 

        child.update();

        if (child._characterName === '' && child._tileId === 0) return;
        if (priority !== undefined && child._character._priorityType !== priority) return;

        var x = child.x - child._frame.width / 2 + $gameMap._displayX * $gameMap.tileWidth();
        var y = child.y - child._frame.height + $gameMap._displayY * $gameMap.tileHeight();

        bitmap.blt(child.bitmap, child._frame.x, child._frame.y, child._frame.width, child._frame.height, x, y, child._frame.width, child._frame.height);
      }
    });
  };

  Tilemap.prototype._paintTileOnLayers = function(groundBitmap, ground2Bitmap, lowerBitmap, upperBitmap, shadowBitmap, x, y) {
    var tableEdgeVirtualId = 10000;
    var mx = x;
    var my = y;
    var dx = (mx * this._tileWidth);
    var dy = (my * this._tileHeight);
    var lx = dx / this._tileWidth;
    var ly = dy / this._tileHeight;
    var tileId0 = this._readMapData(mx, my, 0);
    var tileId1 = this._readMapData(mx, my, 1);
    var tileId2 = this._readMapData(mx, my, 2);
    var tileId3 = this._readMapData(mx, my, 3);
    var shadowBits = this._readMapData(mx, my, 4);
    var upperTileId1 = this._readMapData(mx, my - 1, 1);

    if (groundBitmap !== undefined) {
      groundBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    }

    if (ground2Bitmap !== undefined) {
      ground2Bitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    }

    if (lowerBitmap !== undefined) {
      lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    }

    if (upperBitmap !== undefined) {
      upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    }

    if (shadowBitmap !== undefined) {
      shadowBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    }

    var me = this;

    function drawTiles(bitmap, tileId, shadowBits, upperTileId1) {
      if (tileId < 0) {
        if ($.Param.drawAutoShadows && shadowBits !== undefined) {
          me._drawShadow(bitmap, shadowBits, dx, dy);
        }
      } else if (tileId >= tableEdgeVirtualId) {
        me._drawTableEdge(bitmap, upperTileId1, dx, dy);
      } else {
        me._drawTile(bitmap, tileId, dx, dy);
      }
    }

    if (groundBitmap !== undefined) {
      drawTiles(groundBitmap, tileId0, undefined, upperTileId1);
  
      if (shadowBitmap !== undefined && tileId0 < 0) {
        drawTiles(shadowBitmap, tileId0, shadowBits, upperTileId1);
      }
    }

    if (ground2Bitmap !== undefined) {
      drawTiles(ground2Bitmap, tileId1, undefined, upperTileId1);
  
      if (shadowBitmap !== undefined && tileId1 < 0) {
        drawTiles(shadowBitmap, tileId1, shadowBits, upperTileId1);
      }
    }

    if (lowerBitmap !== undefined) {
      drawTiles(lowerBitmap, tileId2, undefined, upperTileId1);
  
      if (shadowBitmap !== undefined && tileId2 < 0) {
        drawTiles(shadowBitmap, tileId2, shadowBits, upperTileId1);
      }
    }

    if (upperBitmap !== undefined) {
      drawTiles(upperBitmap, tileId3, shadowBits, upperTileId1);

      if (shadowBitmap !== undefined && tileId3 < 0) {
        drawTiles(shadowBitmap, tileId3, shadowBits, upperTileId1);
      }
    }
  };

  Tilemap.prototype._paintTilesOnBitmap = function(lowerBitmap, upperBitmap, x, y) {
    var tableEdgeVirtualId = 10000;
    var mx = x;
    var my = y;
    var dx = (mx * this._tileWidth);
    var dy = (my * this._tileHeight);
    var lx = dx / this._tileWidth;
    var ly = dy / this._tileHeight;
    var tileId0 = this._readMapData(mx, my, 0);
    var tileId1 = this._readMapData(mx, my, 1);
    var tileId2 = this._readMapData(mx, my, 2);
    var tileId3 = this._readMapData(mx, my, 3);
    var shadowBits = this._readMapData(mx, my, 4);
    var upperTileId1 = this._readMapData(mx, my - 1, 1);
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

    lowerTiles.push(-shadowBits);

    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
      if (!Tilemap.isShadowingTile(tileId0)) {
        lowerTiles.push(tableEdgeVirtualId + upperTileId1);
      }
    }

    if (this._isOverpassPosition(mx, my)) {
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

    lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);

    for (var i = 0; i < lowerTiles.length; i++) {
      var lowerTileId = lowerTiles[i];
      if (lowerTileId < 0) {
        if ($.Param.drawAutoShadows) {
          this._drawShadow(lowerBitmap, shadowBits, dx, dy);
        }
      } else if (lowerTileId >= tableEdgeVirtualId) {
        this._drawTableEdge(lowerBitmap, upperTileId1, dx, dy);
      } else {
        this._drawTile(lowerBitmap, lowerTileId, dx, dy);
      }
    }

    for (var j = 0; j < upperTiles.length; j++) {
      this._drawTile(upperBitmap, upperTiles[j], dx, dy);
    }
  };

  $.saveMapshot = function() {
    if (!Utils.isNwjs()) return;

    var fs = require('fs');
    var path = $.Param.imagePath;

    try {
      fs.mkdir(path, function() {
        try{
          var fileName = path + '/' + $.baseFileName();
          var ext = $.fileExtension();
          var names = [fileName + ext];
          var regex = $.imageRegex();

          switch ($.Param.layerType) {
            case 1 :
              names = [
                fileName + ' Lower' + ext,
                fileName + ' Upper' + ext
              ];
              break;
            case 2 :
              names = [
                fileName + ' Ground' + ext,
                fileName + ' Ground 2' + ext,
                fileName + ' Lower' + ext,
                fileName + ' Upper' + ext,
                fileName + ' Shadows' + ext,
                fileName + ' Lower Events' + ext,
                fileName + ' Normal Events' + ext,
                fileName + ' Upper Events' + ext
              ];

              break;
            default :
              names = [fileName + ext];
              break;
          } 

          var snaps = $.getMapshot();

          var callback = function(error) {
            if (error !== undefined && error !== null) {
              console.error('An error occured while saving the mapshot', error);
            }
          };

          for (var i = 0; i < names.length; i++) {
            var urlData = snaps[i].canvas.toDataURL($.imageType(), $.imageQuality());
            var base64Data = urlData.replace(regex, "");

            fs.writeFile(names[i], base64Data, 'base64', callback);
          }
        } catch (error) {
          if (error !== undefined && error !== null) {
            console.error('An error occured while saving the map shot:', error);
          }
        }
      });

      var nodePath = require('path');
      var longPath = nodePath.resolve(path);

      if (process.platform == 'win32' && $._openedFolder === undefined) {
        $._openedFolder = true;

        setTimeout(function(){
          var exec = require('child_process').exec;
          exec('explorer ' + longPath);
        }, 100);
      } else {
        $gameMessage.add('Mapshot saved to \n' + longPath.replace(/\\/g, '\\\\').match(/.{1,40}/g).join('\n')); 
      }

    } catch (error) {
      if (error !== undefined && error !== null) {
        console.error('An error occured while saving the mapshot:', error);
      }
    }
  };

  $.onKeyUp = function(event) {
    if (event.keyCode == $.Param.keyCode) {
      if (SceneManager._scene instanceof Scene_Map) {
        $.saveMapshot();
      }
    }
  };

  document.addEventListener('keyup', $.onKeyUp);
})(OrangeMapshot);

Imported.OrangeMapshot = 1.7;