/*=============================================================================
 * Orange - Event Hitboxes
 * By Hudell - www.hudell.com
 * OrangeEventHitboxes.js
 * Version: 1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Allows the configuration of custom hitboxes for events
 * @author Hudell
 * @help
 * ============================================================================
 * Instructions
 * ============================================================================
 * This plugin REQUIRES MVCommons: http://link.hudell.com/mvcommons
 * 
 * There are 4 tags that can be used to configure the event hitboxes:
 * <hitboxX:0>
 * <hitboxY:0>
 * <hitboxWidth:1>
 * <hitboxHeight:1>
 *
 * The hitboxX and hitboxY tags are used to relocate the top left position of
 * the hitbox. The default value is 0
 * The hitboxWidth and hitboxHeight tags are used to resize the hitbox. The
 * default value is 1.
 *
 * All values are on tiles. If you change hitboxX to -1:
 * <hitboxX:-1>
 * then the hitbox will start one tile to left of where it would usually start
 *
 * Those tags can be added to the event notes. If you want a different
 * size for a specific page, you can add those tags on a comment on that page
 * and the plugin will understand that it should use that configuration
 * for that specific page.
 *
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/event-hitboxes
 * 
 */

var Imported = Imported || {};

if (Imported.MVCommons === undefined) {
  var MVC = MVC || {};

  (function($){ 
    $.defaultGetter = function(name) { return function () { return this['_' + name]; }; };
    $.defaultSetter = function(name) { return function (value) { var prop = '_' + name; if ((!this[prop]) || this[prop] !== value) { this[prop] = value; if (this._refresh) { this._refresh(); } } }; };
    $.accessor = function(value, name /* , setter, getter */) { Object.defineProperty(value, name, { get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name), set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name), configurable: true });};
    $.reader = function(obj, name /*, getter */) { Object.defineProperty(obj, name, { get: arguments.length > 2 ? arguments[2] : defaultGetter(name), configurable: true }); };

    $.getProp = function(meta, propName){ if (meta === undefined) return undefined; if (meta[propName] !== undefined) return meta[propName]; for (var key in meta) { if (key.toLowerCase() == propName.toLowerCase()) { return meta[key]; } } return undefined; };
    $.extractEventMeta = function(event) { var the_event = event; if (the_event instanceof Game_Event) { the_event = event.event(); } var pages = the_event.pages; if (pages === undefined) return; var re = /<([^<>:]+)(:?)([^>]*)>/g; for (var i = 0; i < pages.length; i++) { var page = pages[i]; page.meta = page.meta || {}; for (var j = 0; j < page.list.length; j++) { var command = page.list[j]; if (command.code !== 108 && command.code !== 408) continue; for (;;) { var match = re.exec(command.parameters[0]); if (match) { if (match[2] === ':') { page.meta[match[1]] = match[3]; } else { page.meta[match[1]] = true; } } else { break; } } } } };
  })(MVC);

  Number.prototype.fix = function() { return parseFloat(this.toPrecision(12)); };
  Number.prototype.floor = function() { return Math.floor(this.fix()); };
}

var OrangeEventHitboxes = OrangeEventHitboxes || {};

(function($) {
  "use strict";

  // Creates an accessor for the hitboxX property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 0.
  MVC.accessor(Game_Event.prototype, 'hitboxX', function(value) {
    this._hitboxX = value;
    this._canClearHitboxX = false;
  }, function() {
    if (this._hitboxX === undefined) {
      var size = this.findNoteTagValue('hitboxX');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxX = size;
      } else {
        this._hitboxX = 0;
      }

      this._canClearHitboxX = true;
    }

    return this._hitboxX;
  });

  // Creates an accessor for the hitboxY property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 0.
  MVC.accessor(Game_Event.prototype, 'hitboxY', function(value) {
    this._hitboxY = value;
    this._canClearHitboxY = false;
  }, function() {
    if (this._hitboxY === undefined) {
      var size = this.findNoteTagValue('hitboxY');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxY = size;
      } else {
        this._hitboxY = 0;
      }
      
      this._canClearHitboxY = true;
    }

    return this._hitboxY;
  });

  // Creates an accessor for the hitboxWidth property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 1.
  MVC.accessor(Game_Event.prototype, 'hitboxWidth', function(value) {
    this._hitboxWidth = value;
    this._canClearHitboxWidth = false;
  }, function() {
    if (this._hitboxWidth === undefined) {
      var size = this.findNoteTagValue('hitboxWidth');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxWidth = size;
      } else {
        this._hitboxWidth = 1;
      }

      this._canClearHitboxWidth = true;
    }

    return this._hitboxWidth;
  });

  // Creates an accessor for the hitboxHeight property,
  // It's value is read from the notetags and then cached. It can also be changed
  // manually. Default is 1.
  MVC.accessor(Game_Event.prototype, 'hitboxHeight', function(value) {
    this._hitboxHeight = value;
    this._canClearHitboxHeight = false;
  }, function() {
    if (this._hitboxHeight === undefined) {
      var size = this.findNoteTagValue('hitboxHeight');
      if (size !== undefined) {
        size = parseInt(size, 10);
      }

      if (typeof(size) == "number") {
        this._hitboxHeight = size;
      } else {
        this._hitboxHeight = 1;
      }
      this._canClearHitboxHeight = true;
    }

    return this._hitboxHeight;
  });

  // Quick reader for the left position of the hitbox
  MVC.reader(Game_Event.prototype, 'left', function() {
    return (this._x + this.hitboxX).fix();
  });
  // Quick reader for the top position of the hitbox
  MVC.reader(Game_Event.prototype, 'top', function() {
    return (this._y + this.hitboxY).fix();
  });
  // Quick reader for the right position of the hitbox
  MVC.reader(Game_Event.prototype, 'right', function() {
    return (this.left + this.hitboxWidth).fix();
  });
  // Quick reader for the bottom position of the hitbox
  MVC.reader(Game_Event.prototype, 'bottom', function() {
    return (this.top + this.hitboxHeight).fix();
  });

  // Adds a method that searches for a notetag value on all comments of the page
  Game_Event.prototype.findNoteTagValue = function(notetag) {
    var page = this.page();
    if (page === undefined) return false;

    if (page.meta === undefined) {
      MVC.extractEventMeta(this);
    }

    var result;
    if (page.meta !== undefined) {
      result = MVC.getProp(page.meta, notetag);
    }

    if (result === undefined) {
      return MVC.getProp(this.event().meta, notetag);
    }
    else {
      return result;
    }
  };

  // Adds a method that checks if the event is using the default hitbox, 
  // in which case some methods don't need to be changed.
  Game_Event.prototype.isUsingDefaultHitbox = function() {
    return (this.hitboxX === 0 && this.hitboxY === 0 && this.hitboxWidth === 1 && this.hitboxHeight === 1);
  };

  // Alias the method pos of the Game_Event class to check if the event 
  // is on a specified position. If the event hitbox wasn't changed, the old
  // method is run instead.
  var oldGameEvent_pos = Game_Event.prototype.pos;
  Game_Event.prototype.pos = function(x, y) {
    if (this.isUsingDefaultHitbox()) {
      return oldGameEvent_pos.call(this, x, y);
    } else {
      return (x >= this.left && x < this.right && y >= this.top && y < this.bottom);
    }
  };

  // Alias the setupPage method from the Game_Event class to clear the
  // hitbox cache (because the event can use a different cache for each page)
  var oldGameEvent_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    oldGameEvent_setupPage.call(this);

    if (this._canClearHitboxX === true) this._hitboxX = undefined;
    if (this._canClearHitboxY === true) this._hitboxY = undefined;
    if (this._canClearHitboxHeight === true) this._hitboxHeight = undefined;
    if (this._canClearHitboxWidth === true) this._hitboxWidth = undefined;
  };
})(OrangeEventHitboxes);

Imported.OrangeEventHitboxes = 1.1;