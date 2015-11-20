/*=============================================================================
 * Orange - Lighting
 * By Hudell - www.hudell.com
 * OrangeLighting.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Lighting system <OrangeLighting>
 * @author Hudell
 *
 * @param lightMaskSwitch
 * @desc When this switch is on, the lighting system will be activated
 * @default 0
 *
 * @param opacityVariable
 * @desc The variable that defines the opacity of the black mask. If none is defined, the opacity will be 255.
 * @default 0
 *
 * @param tintSpeed
 * @desc The speed in which the color will change. (4 = black to white in 1 second, 255 = instant)
 * @default 0.3
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
Hudell.OrangeLighting = Hudell.OrangeLighting || {};

(function(namespace) {
  "use strict";

  namespace.addOns = {};
  namespace._listeners = {};

  var parameters = $plugins.filter(function(plugin) {
    return plugin.description.contains('<OrangeLighting>');
  });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeLighting parameters.");
  }
  namespace.Parameters = parameters[0].parameters;
  namespace.Param = {};

  namespace.Param.lightMaskSwitch = Number(namespace.Parameters.lightMaskSwitch || 0);
  namespace.Param.opacityVariable = Number(namespace.Parameters.opacityVariable || 0);
  namespace.Param.tintSpeed = Number(namespace.Parameters.tintSpeed || 0.3);

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

  namespace.on = function(eventName, callback) {
    if (this._listeners[eventName] === undefined) this._listeners[eventName] = [];

    this._listeners[eventName].push(callback);
  };

  namespace.un = function(eventName, callback) {
    if (this._listeners[eventName] === undefined) return;

    for (var i = 0; i < this._listeners[eventName].length; i++) {
      if (this._listeners[eventName][i] == callback) {
        this._listeners[eventName][i] = undefined;
        return;
      }
    }
  };

  namespace.runEvent = function(eventName, scope) {
    if (this._listeners[eventName] === undefined) return;
    if (scope === undefined) scope = this;

    for (var i = 0; i < this._listeners[eventName].length; i++) {
      var callback = this._listeners[eventName][i];

      callback.call(scope);
    }
  };

  namespace.Lightmask = OrangeLightmask;
  namespace.Lightmask.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  namespace.Lightmask.prototype.constructor = namespace.Lightmask;

  //Copied from http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
  namespace.colorNameToHex = function(color)
  {
    if (color.charAt('0') == '#') return color;

    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colors[color.toLowerCase()] != 'undefined')
      return colors[color.toLowerCase()];

    return false;
  };

  namespace.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red : parseInt(result[1], 16),
      green : parseInt(result[2], 16),
      blue : parseInt(result[3], 16)
    } : null;
  };

  namespace.getCharacterPosition = function(character) {
    var pw = $gameMap.tileWidth();
    var ph = $gameMap.tileHeight();
    var dx = $gameMap.displayX();
    var dy = $gameMap.displayY();
    var px = character._realX;
    var py = character._realY;
    var pd = character._direction;

    var x1 = (pw / 2) + ((px - dx) * pw);
    var y1 = (ph / 2) + ((py - dy) * ph);

    return [x1, y1, pd];
  };  

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

    $.maskColor = function() {
      return "black";
    };

    $.walkColor = function(newRGB, currentRGB, colorName, tintSpeed) {
      if (newRGB[colorName] < currentRGB[colorName]) {
        currentRGB[colorName] = currentRGB[colorName] - tintSpeed;
        if (newRGB[colorName] > currentRGB[colorName]) {
          currentRGB[colorName] = newRGB[colorName];
        }
      } else if(newRGB[colorName] > currentRGB[colorName]) {
        currentRGB[colorName] = currentRGB[colorName] + tintSpeed;
        if (newRGB[colorName] < currentRGB[colorName]) {
          currentRGB[colorName] = newRGB[colorName];
        }
      }

      newRGB[colorName] = newRGB[colorName].clamp(0, 255);
    };

    $.refreshMaskColor = function() {
      var destinationColor = $.maskColor();
      var newColor = destinationColor;

      if (namespace._lastMaskColor !== undefined && destinationColor !== namespace._lastMaskColor) {
        var currentColor = namespace._lastMaskColor;
        var currentRGB = namespace._currentRGB;

        if (!!currentRGB || currentColor.charAt(0) == '#') {
          newColor = namespace.colorNameToHex(destinationColor);
          if (newColor === false) {
            newColor = destinationColor;
          }

          if (currentRGB === undefined) {
            currentRGB = namespace.hexToRgb(currentColor);
          }
          var newRGB = namespace.hexToRgb(newColor);

          this.walkColor(newRGB, currentRGB, 'red', namespace.Param.tintSpeed);
          this.walkColor(newRGB, currentRGB, 'green', namespace.Param.tintSpeed);
          this.walkColor(newRGB, currentRGB, 'blue', namespace.Param.tintSpeed);

          newColor = '#' + ((1 << 24) + (Math.floor(currentRGB.red) << 16) + (Math.floor(currentRGB.green) << 8) + Math.floor(currentRGB.blue)).toString(16).slice(1);
          namespace._currentRGB = currentRGB;
        }
      } else {
        namespace._currentRGB = undefined;
      }

      namespace._lastMaskColor = newColor;
    };

    $.refreshMask = function() {
      namespace.runEvent('beforeRefreshMask', this);

      this.popAllSprites();

      namespace._showing = namespace.shouldShowLightMask();

      if (namespace._showing) {
        namespace.runEvent('refreshMask', this);

        var backOpacity = 255;
        if (namespace.Param.opacityVariable > 0) {
          backOpacity = $gameVariables.value(namespace.Param.opacityVariable).clamp(0, 255);
        }

        //calculates what will be the new mask color
        this.refreshMaskColor();        
        namespace.runEvent('refreshMaskColor', this);

        // Adds the mask sprite
        this.addSprite(0, 0, this._maskBitmap, backOpacity);
        this._maskBitmap.fillRect(0, 0, Graphics.width, Graphics.height, namespace._lastMaskColor);

        namespace.runEvent('afterRefreshMask', this);
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

      if (namespace._lastMaskColor !== $.maskColor()) {
        namespace.dirty = true;
      }

      namespace.runEvent('updateMask', this);

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


  (function($){

    $.radialgradientFillRect = function (x, y, startRadius, endRadius, color1, color2, flicker) {
      var context = this._context;
      var grad;
      var wait = Math.floor((Math.random() * 8) + 1);

      if (flicker === true && wait == 1) {
        var gradRnd = Math.floor((Math.random() * 7) + 1);
        var colorRnd = Math.floor((Math.random() * 10) - 5);
        var red = namespace.hexToRgb(color1).red;
        var green = namespace.hexToRgb(color1).green;
        var blue = namespace.hexToRgb(color1).blue;

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
})(Hudell.OrangeLighting);

OrangeLighting = Hudell.OrangeLighting;
Imported["OrangeLighting"] = 1.3;