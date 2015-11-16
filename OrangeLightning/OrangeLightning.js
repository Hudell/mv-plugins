/*=============================================================================
 * Orange - Lightning
 * By Hudell - www.hudell.com
 * OrangeLightning.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Lightning system <OrangeLightning>
 * @author Hudell
 *
 * @param lightMaskSwitch
 * @desc When this switch is on, the lightning system will be activated
 * @default 0
 *
 * @param resetOnMapChange
 * @desc Reset light switches automatically on map change?
 * @default false
 *
 * @param playerRadius
 * @desc The size of the light globe around the player
 * @default 40
 *
 * @param playerColor
 * @desc The color of the light around the player
 * @default #FFFFFF
 *
 * @param playerFlicker
 * @desc Should the plugin flick the light around the player?
 * @default false
 *
 * @param opacityVariable
 * @desc The variable that defines the opacity of the black mask. If none is defined, the opacity will be 255.
 * @default 0
 *
 * @param flashlightSwitch
 * @desc When this switch is on, a flashlight will be added to the player.
 * @default 0
 *
 * @param hourColors
 * @desc A different color mask for each hour of the day. Requires OrangeTimeSystem.
 * @default #000000, #000000, #000000, #000000, #000000, #111111, #111111, #666666, #AAAAAA, #EEEEEE, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #EEEEEE, #AAAAAA, #776666, #441111, #000000, #000000, #000000
 *
 * @param insideBuildingsHourColor
 * @desc A different color mask to use inside buildings, for each hour of the day. Requires OrangeTimeSystem.
 * @default #FFFFFF
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
Hudell.OrangeLightning = Hudell.OrangeLightning || {};

(function(namespace) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) {
    return plugin.description.contains('<OrangeLightning>');
  });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeLightning parameters.");
  }
  namespace.Parameters = parameters[0].parameters;
  namespace.Param = {};

  namespace.Param.resetOnMapChange = (namespace.Parameters.resetOnMapChange || "false").toUpperCase() === "TRUE";
  namespace.Param.playerRadius = Number(namespace.Parameters.playerRadius || 40);
  namespace.Param.playerColor = namespace.Parameters.playerColor || '#FFFFFF';
  namespace.Param.playerFlicker = (namespace.Parameters.playerFlicker || "false").toUpperCase() === "TRUE";
  namespace.Param.flashlightSwitch = Number(namespace.Parameters.flashlightSwitch || 0);
  namespace.Param.lightMaskSwitch = Number(namespace.Parameters.lightMaskSwitch || 0);
  namespace.Param.opacityVariable = Number(namespace.Parameters.opacityVariable || 0);

  namespace.Param.hourColors = (namespace.Parameters.hourColors || "").split(",");
  namespace.Param.insideBuildingsHourColor = (namespace.Parameters.insideBuildingsHourColor || "").split(",");
  (function(){
    for (var i = 0; i < namespace.Param.hourColors.length; i++) {
      namespace.Param.hourColors[i] = namespace.Param.hourColors[i].trim();
    }

    for (i = 0; i < namespace.Param.insideBuildingsHourColor.length; i++) {
      namespace.Param.insideBuildingsHourColor[i] = namespace.Param.insideBuildingsHourColor[i].trim();
    }

    if (namespace.Param.hourColors.length === 0){
      namespace.Param.hourColors.push('black');
    }

    if (namespace.Param.insideBuildingsHourColor.length === 0){
      namespace.Param.insideBuildingsHourColor.push('#FFFFFF');
    }
  })();

  Object.defineProperties(namespace, {
    dirty: {
      get: function() {
        return this._dirty;
      },
      set: function(value) {
        this._dirty = value;
      },
      configurable: true
    }
  });

  namespace.isActive = function() {
    return true;
  };

  function OrangeLightmask() {
    this.initialize.apply(this, arguments);
  }

  namespace.shouldShowLightMask = function(){
    return namespace.Param.lightMaskSwitch === 0 || $gameSwitches.value(namespace.Param.lightMaskSwitch);
  };

  namespace.shouldShowFlashlight = function(){
    return namespace.Param.flashlightSwitch > 0 && $gameSwitches.value(namespace.Param.flashlightSwitch);
  };

  namespace.Lightmask = OrangeLightmask;
  namespace.Lightmask.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  namespace.Lightmask.prototype.constructor = namespace.Lightmask;

  (function($) {
    Object.defineProperties($, {
      width: {
        get: function() {
          return this._width;
        },
        configurable: true
      },
      height: {
        get: function() {
          return this._height;
        },
        configurable: true
      },
      sprites: {
        get: function() {
          return this._sprites;
        },
        configurable: true
      },
      currentMapId: {
        get: function() {
          return this._currentMapId;
        },
        set: function(value) {
          this._currentMapId = value;
        },
        configurable: true
      }
    });

    $.initialize = function() {
      PIXI.DisplayObjectContainer.call(this);
      this._width = Graphics.width;
      this._height = Graphics.height;
      this._sprites = [];
      this.createMaskBitmap();
    };

    $.update = function() {
      this.updateMask();
    };

    $.createMaskBitmap = function() {
      this._maskBitmap = new Bitmap(Graphics.width, Graphics.height);
    };

    $.getPlayerPosition = function() {
      var pw = $gameMap.tileWidth();
      var ph = $gameMap.tileHeight();
      var dx = $gameMap.displayX();
      var dy = $gameMap.displayY();
      var px = $gamePlayer._realX;
      var py = $gamePlayer._realY;
      var pd = $gamePlayer._direction;

      var x1 = (pw / 2) + ((px - dx) * pw);
      var y1 = (ph / 2) + ((py - dy) * ph);

      return [x1, y1, pd];
    };

    $.refreshPlayerLightGlobe = function() {
      var canvas = this._maskBitmap.canvas;
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = 'lighter';

      var positions = this.getPlayerPosition();

      if (namespace.shouldShowFlashlight()) {
        this._maskBitmap.makeFlashlightEffect(positions[0], positions[1], 0, namespace.Param.playerRadius, namespace.Param.playerColor, 'black', positions[2]);
      } else {
        if (namespace.Param.playerRadius < 100) {
          this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 0, namespace.Param.playerRadius, '#999999', 'black', namespace.Param.playerFlicker);
        } else {
          this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 20, namespace.Param.playerRadius, namespace.Param.playerColor, 'black', namespace.Param.playerFlicker);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    $.maskColor = function() {
      if (Imported["OrangeTimeSystem"] !== undefined) {
        var hour = OrangeTimeSystem.hour;
        if (OrangeTimeSystem.inside) {
          return namespace.Param.insideBuildingsHourColor[hour % namespace.Param.insideBuildingsHourColor.length];
        } else {
          return namespace.Param.hourColors[hour % namespace.Param.hourColors.length];
        }
      } else {
        return "black";
      }
    };

    $.refreshMask = function() {
      this.popAllSprites();

      namespace._showing = namespace.shouldShowLightMask();

      if (namespace._showing) {
        var backOpacity = 255;
        if (namespace.Param.opacityVariable > 0) {
          backOpacity = $gameVariables.value(namespace.Param.opacityVariable).clamp(0, 255);
        }

        namespace._lastMaskColor = $.maskColor();

        // Adds the black background
        this.addSprite(0, 0, this._maskBitmap, backOpacity);
        this._maskBitmap.fillRect(0, 0, Graphics.width, Graphics.height, namespace._lastMaskColor);

        namespace._showingFlashlight = namespace.shouldShowFlashlight();

        //Refreshes the player's light globe
        this.refreshPlayerLightGlobe();
      }
    };

    $.updateMask = function() {
      if (!namespace.isActive()) return;

      var newId = 0;

      if ($gameMap !== undefined && $gameMap !== null) {
        newId = $gameMap._mapId;
      }

      if (newId !== this.currentMapId) {
        namespace.dirty = true;
      }

      if (namespace.shouldShowLightMask() !== namespace._showing) {
        namespace.dirty = true;
      }

      if (namespace.shouldShowFlashlight() !== namespace._showingFlashlight) {
        namespace.dirty = true;
      }

      if (namespace.Param.playerFlicker && !namespace.shouldShowFlashlight()) {
        namespace.dirty = true;
      }

      if (namespace._lastMaskColor !== $.maskColor()) {
        namespace.dirty = true;
      }

      if (namespace.dirty) {
        this.refreshMask();
        namespace.dirty = false;
        this.currentMapId = newId;
      }
    };

    $.addSprite = function(x, y, bitmap, opacity, blendMode, rotation, anchorX, anchorY) {
      if (opacity === undefined) opacity = 255;
      if (blendMode === undefined) blendMode = 2;
      if (rotation === undefined) rotation = 0;
      if (anchorX === undefined) anchorX = 0;
      if (anchorY === undefined) anchorY = 0;

      var sprite = new Sprite(this.viewport);
      sprite.bitmap = bitmap;
      sprite.opacity = opacity;
      sprite.blendMode = blendMode;
      sprite.x = x;
      sprite.y = y;

      this._sprites.push(sprite);
      this.addChild(sprite);

      sprite.rotation = rotation;
      sprite.ax = anchorX;
      sprite.ay = anchorY;
      sprite.opacity = opacity;

      return sprite;
    };

    $.popSprite = function() {
      var sprite = this._sprites.pop();

      if (sprite) {
        this.removeChild(sprite);
      }

      return sprite;
    };

    $.popAllSprites = function() {
      var sprite;
      while (this._sprites.length > 0) {
        sprite = this._sprites.pop();

        if (sprite) {
          this.removeChild(sprite);
        }
      }
    };
  })(namespace.Lightmask.prototype);

  (function($) {
    $.createLightmask = function() {
      this._lightmask = new namespace.Lightmask();
      this.addChild(this._lightmask);
    };

    // Creates the Lightmask before the weather layer
    namespace.Spriteset_Map_prototype_createWeather = $.createWeather;
    $.createWeather = function() {
      this.createLightmask();
      namespace.Spriteset_Map_prototype_createWeather.call(this);
    };
  })(Spriteset_Map.prototype);


  (function($) {
    namespace.Game_Player_prototype_update = $.update;
    $.update = function(sceneActive) {
      var oldD = this._direction;
      namespace.Game_Player_prototype_update.call(this, sceneActive);

      if (this.isMoving() || oldD !== this._direction) {
        namespace.dirty = true;
      }
    };
  })(Game_Player.prototype);

  (function($){
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        red : parseInt(result[1], 16),
        green : parseInt(result[2], 16),
        blue : parseInt(result[3], 16)
      } : null;
    }  

    $.radialgradientFillRect = function (x, y, startRadius, endRadius, color1, color2, flicker) {
      var context = this._context;
      var grad;
      var wait = Math.floor((Math.random() * 8) + 1);

      if (flicker === true && wait == 1) {
        var gradRnd = Math.floor((Math.random() * 7) + 1);
        var colorRnd = Math.floor((Math.random() * 10) - 5);
        var red = hexToRgb(color1).red;
        var green = hexToRgb(color1).green;
        var blue = hexToRgb(color1).blue;

        green = (green + colorRnd).clamp(0, 255);
        color1 = '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
        endRadius -= gradRnd;
      }

      grad = context.createRadialGradient(x, y, startRadius, x, y, endRadius);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      context.save();
      context.fillStyle = grad;
      context.fillRect(x - endRadius, y - endRadius, endRadius * 2, endRadius * 2);
      context.restore();
      this._setDirty();
    };

    $.makeFlashlightEffect = function(x, y, startRadius, endRadius, color1, color2, direction) {
      var context = this._context;
      var grad;

      context.save();

      grad = context.createRadialGradient(x, y, startRadius, x, y, endRadius);
      grad.addColorStop(0, '#999999');
      grad.addColorStop(1, color2);

      context.fillStyle = grad;
      context.fillRect(x - endRadius, y - endRadius, endRadius * 2, endRadius * 2);

      for (var cone = 0; cone < 8; cone++) {
        startRadius = cone * 2;
        endRadius = cone * 12;

        switch(direction) {
          case 6 :
            x += cone * 6;
            break;
          case 4 :
            x -= cone * 6;
            break;
          case 2 :
            y += cone * 6;
            break;
          case 8 :
            y -= cone * 6;
            break;
          default :
            break;
        }

        grad = context.createRadialGradient(x, y, startRadius, x, y, endRadius);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        context.fillStyle = grad;
        context.fillRect(x - endRadius, y - endRadius, endRadius * 2, endRadius * 2);
      }

      context.restore();
      this._setDirty();
    };
  })(Bitmap.prototype);
})(Hudell.OrangeLightning);

OrangeLightning = Hudell.OrangeLightning;
Imported["OrangeLightning"] = 1.0;