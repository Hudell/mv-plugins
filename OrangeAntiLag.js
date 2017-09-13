/*=============================================================================
 * Orange - Anti Lag
 * By Hudell - www.hudell.com
 * OrangeAntiLag.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Improves part of RM code to reduce lag
 * @author Hudell */

var Imported = Imported || {};
var OrangeAntiLag = OrangeAntiLag || {};

(function($) {
  "use strict";

  // Replaces the original refreshTileEvents to filter the _events array directly
  Game_Map.prototype.refreshTileEvents = function() {
    this.tileEvents = this._events.filter(function(event) {
      return !!event && event.isTile();
    });
  };

  // Replaces the original eventsXy to filter the _events array directly
  Game_Map.prototype.eventsXy = function(x, y) {
    return this._events.filter(function(event) {
      return !!event && event.pos(x, y);
    });
  };

  // Replaces the original eventsXyNt to filter the _events array directly
  Game_Map.prototype.eventsXyNt = function(x, y) {
    return this._events.filter(function(event) {
      return !!event && event.posNt(x, y);
    });
  };


  // Make Tilemap class sort sprites only when needed
  Game_Temp.prototype.canSortTileMapChildren = function() {
    return !!this._zOrderChanged;
  };

  Game_Temp.prototype.markZOrderChanged = function() {
    this._zOrderChanged = true;
  };

  Game_Temp.prototype.clearZOrderChanged = function() {
    this._zOrderChanged = false;
  };

  var oldGameTempInitialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    oldGameTempInitialize.call(this);
    this._zOrderChanged = false;
  };

  var oldTileMapSortChildren = Tilemap.prototype._sortChildren;
  Tilemap.prototype._sortChildren = function() {
    if ($gameTemp.canSortTileMapChildren()) {
      oldTileMapSortChildren.call(this);
      $gameTemp.clearZOrderChanged();
    }
  };

  var oldSpriteCharacterUpdatePosition = Sprite_Character.prototype.updatePosition;
  Sprite_Character.prototype.updatePosition = function() {
    if (this.z !== this._character.screenZ() || this.y !== this._character.screenY()) {
      $gameTemp.markZOrderChanged();
    }
    
    oldSpriteCharacterUpdatePosition.call(this);
  };



  Window.prototype._refreshBack = function() {
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;

    var bitmap = this._windowBackSprite.bitmap;
    if (!bitmap) {
      bitmap = new Bitmap(w, h);
    } else if (bitmap.width !== w || bitmap.height !== h) {
      bitmap.resize(w, h);
    }

    this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    if (w > 0 && h > 0 && this._windowskin) {
      var p = 96;
      bitmap.bltImage(this._windowskin, 0, 0, p, p, 0, 0, w, h);
      for (var y = 0; y < h; y += p) {
        for (var x = 0; x < w; x += p) {
          bitmap.bltImage(this._windowskin, 0, p, p, p, x, y, p, p);
        }
      }
      var tone = this._colorTone;
      bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
  };

  Window.prototype._refreshFrame = function() {
    var w = this._width;
    var h = this._height;
    var m = 24;

    var bitmap = this._windowFrameSprite.bitmap;
    if (!bitmap) {
      bitmap = new Bitmap(w, h);
    } else if (bitmap.width != w || bitmap.height != h) {
      bitmap.resize(w, h);
    }

    this._windowFrameSprite.bitmap = bitmap;
    this._windowFrameSprite.setFrame(0, 0, w, h);

    if (w > 0 && h > 0 && this._windowskin) {
      var skin = this._windowskin;
      var p = 96;
      var q = 96;
      bitmap.bltImage(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m);
      bitmap.bltImage(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m);
      bitmap.bltImage(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2);
      bitmap.bltImage(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2);
      bitmap.bltImage(skin, p+0, 0+0, m, m, 0, 0, m, m);
      bitmap.bltImage(skin, p+q-m, 0+0, m, m, w-m, 0, m, m);
      bitmap.bltImage(skin, p+0, 0+q-m, m, m, 0, h-m, m, m);
      bitmap.bltImage(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m);
    }
  };

  Window.prototype._refreshCursor = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var m = 4;
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x - x2;
    var oy = y - y2;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);

    var bitmap = this._windowCursorSprite.bitmap;

    if (!bitmap) {
      bitmap = new Bitmap(w2, h2);
    } else if (bitmap.width !== w2 || bitmap.height !== h2) {
      bitmap.resize(w2, h2);
    }

    this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, w2, h2);
    this._windowCursorSprite.move(x2, y2);

    if (w > 0 && h > 0 && this._windowskin) {
      var skin = this._windowskin;
      var p = 96;
      var q = 48;
      bitmap.bltImage(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
      bitmap.bltImage(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
      bitmap.bltImage(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
      bitmap.bltImage(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
      bitmap.bltImage(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
      bitmap.bltImage(skin, p+0, p+0, m, m, ox+0, oy+0, m, m);
      bitmap.bltImage(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
      bitmap.bltImage(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
      bitmap.bltImage(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);
    }
  };

  Window_Base.prototype.createContents = function() {
    var w = this.contentsWidth();
    var h = this.contentsHeight();

    if (!this.contents) {
      this.contents = new Bitmap(w, h);
    } else if (this.contents.width != w || this.contents.height != h) {
      this.contents.resize(w, h);
      this.contents.clear();
    } else {
      this.contents.clear();
    }

    this.resetFontSettings();
  };


  var uniqueMessageWindow = false;
  Scene_Map.prototype.createMessageWindow = function() {
    if (uniqueMessageWindow) {
      this._messageWindow = uniqueMessageWindow;
      this._messageWindow.openness = 0;
      this._messageWindow.initMembers();
      // this._messageWindow.updatePlacement();
    } else {
      this._messageWindow = new Window_Message();
      uniqueMessageWindow = this._messageWindow;
    }
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
  };


  var uniqueScrollTextWindow = false;
  Scene_Map.prototype.createScrollTextWindow = function() {
    if (uniqueScrollTextWindow) {
      this._scrollTextWindow = uniqueScrollTextWindow;

      this._scrollTextWindow.opacity = 0;
      this._scrollTextWindow.hide();
      this._scrollTextWindow._text = '';
      this._scrollTextWindow._allTextHeight = 0;
    } else {
      this._scrollTextWindow = new Window_ScrollText();
      uniqueScrollTextWindow = this._scrollTextWindow;
    }

    this.addWindow(this._scrollTextWindow);
  };

  var uniqueMapNameWindow = false;
  Scene_Map.prototype.createMapNameWindow = function() {
    if (uniqueMapNameWindow) {
      this._mapNameWindow = uniqueMapNameWindow;
      this._mapNameWindow.opacity = 0;
      this._mapNameWindow.contentsOpacity = 0;
      this._mapNameWindow._showCount = 0;
      this._mapNameWindow.refresh();

    } else {
      this._mapNameWindow = new Window_MapName();
      uniqueMapNameWindow = this._mapNameWindow;
    }
    this.addChild(this._mapNameWindow);
  };

  var uniqueDestinationSprite = false;
  Spriteset_Map.prototype.createDestination = function() {
    if (uniqueDestinationSprite) {
      this._destinationSprite = uniqueDestinationSprite;
      this._destinationSprite._frameCount = 0;
    } else {
      this._destinationSprite = new Sprite_Destination();
      uniqueDestinationSprite = this._destinationSprite;
    }

    this._destinationSprite.z = 9;
    this._tilemap.addChild(this._destinationSprite);
  };

  var uniqueTimerSprite = false;
  Spriteset_Base.prototype.createTimer = function() {
    if (uniqueTimerSprite) {
      this._timerSprite = uniqueTimerSprite;
      this._timerSprite._seconds = 0;
      this._timerSprite.update();
    } else {
      this._timerSprite = new Sprite_Timer();
      uniqueTimerSprite = this._timerSprite;
    }
    this.addChild(this._timerSprite);
  };

  var uniqueWeather = false;
  Spriteset_Map.prototype.createWeather = function() {
    if (uniqueWeather) {
      this._weather = uniqueWeather;

      this._weather.power = 0;
      this._weather.type = 'none';
      this._weather.origin = new Point();
    } else {
      this._weather = new Weather();
      uniqueWeather = this._weather;
    }
    this.addChild(this._weather);
  };




})(OrangeAntiLag);

Imported.OrangeAntiLag = true;