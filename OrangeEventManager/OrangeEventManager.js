/*=============================================================================
 * Orange - Event Manager
 * By Hudell - www.hudell.com
 * OrangeEventManager.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Provides an event listener interface to any plugin
 *
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/event-manager
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeEventManager = OrangeEventManager || {};

(function($) {
  "use strict";

  $._events = [];

  $.on = function(eventName, callback) {
    if (this._events[eventName] === undefined) this._events[eventName] = [];

    this._events[eventName].push(callback);
  };

  $.un = function(eventName, callback) {
    if (this._events[eventName] === undefined) return;

    for (var i = 0; i < this._events[eventName].length; i++) {
      if (this._events[eventName][i] == callback) {
        this._events[eventName][i] = undefined;
        return;
      }
    }
  };

  $.executeCallback = function(callback) {
    if (typeof(callback) == "function") {
      return callback.call(this);
    }

    if (typeof(callback) == "number") {
      $gameTemp.reserveCommonEvent(callback);
      return true;
    }

    if (typeof(callback) == "string") {
      if (parseInt(callback, 10) == callback.trim()) {
        $gameTemp.reserveCommonEvent(parseInt(callback, 10));
        return true;
      }

      return eval(callback);
    }
    
    console.error("Unknown callback type: ", callback);
    return undefined;
  };

  $.runEvent = function(eventName) {
    if (this._events[eventName] === undefined) return;

    for (var i = 0; i < this._events[eventName].length; i++) {
      var callback = this._events[eventName][i];

      if (this.executeCallback(callback) === false) {
        break;
      }
    }
  };
})(OrangeEventManager);

if (Imported['MVCommons'] === undefined) {
  Imported["OrangeEventManager"] = 1;
}
else {
  PluginManager.register("OrangeEventManager", "1.0.0", "Provides an event listener interface to any plugin", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-22");
}
