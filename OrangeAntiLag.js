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
})(OrangeAntiLag);

Imported["OrangeAntiLag"] = true;