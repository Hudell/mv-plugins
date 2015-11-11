/*=============================================================================
 * Orange - Event Manager
 * By Hudell - www.hudell.com
 * OrangeEventManager.js
 * Version: 1.1.1
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

  var oldGameTemp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    oldGameTemp_initialize.call(this);
    this._orangeCommonEvents = [];
  };

  Game_Temp.prototype.reserveOrangeCommonEvent = function(commonEventId) {
    if (commonEventId > 0) {
      this._orangeCommonEvents = this._orangeCommonEvents || [];
      this._orangeCommonEvents.push(commonEventId);
    }
  };

  var oldGameInterpreter_setupReservedCommonEvent = Game_Interpreter.prototype.setupReservedCommonEvent;
  Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    var result = oldGameInterpreter_setupReservedCommonEvent.call(this);
    if (result) return result;

    if (!$gameTemp._orangeCommonEvents) return result;
    if ($gameTemp._orangeCommonEvents.length > 0) {
      var commonEventId = $gameTemp._orangeCommonEvents.shift();
      var commonEvent = $dataCommonEvents[commonEventId];

      this.setup(commonEvent.list);
      return true;
    }

    return result;
  };

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
      $gameTemp.reserveOrangeCommonEvent(callback);
      return true;
    }

    if (typeof(callback) == "string") {
      var id = parseInt(callback, 10);

      if (parseInt(callback, 10) == callback.trim()) {
        $gameTemp.reserveOrangeCommonEvent(parseInt(callback, 10));
        return true;
      } else if (callback.substr(0, 1) == 'S') {
        var data = callback.split(',');
        var value = 'TRUE';

        if (data.length >= 2) {
          value = data[1].toUppercase();
        }

        $gameSwitches.setValue(id, value !== 'FALSE' && value !== 'OFF');
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

Imported["OrangeEventManager"] = 1.1;