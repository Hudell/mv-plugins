/*=============================================================================
 * Orange - Instant Trigger Mouse Events
 * By Hudell - www.hudell.com
 * OrangeInstantTriggerMouseEvents.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin will trigger events instantly when you click on them
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/trigger-mouse-events
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeInstantTriggerMouseEvents = OrangeInstantTriggerMouseEvents || {};

(function($) {
  "use strict";

  Scene_Map.prototype.tryTriggeringEvent = function() {
    if ($gameMap.isAnyEventStarting() || $gameMap.isEventRunning() || !$gamePlayer.canStartLocalEvents()) {
      return false;
    }

    if (TouchInput.isTriggered() || this._touchCount > 0) {
      if (TouchInput.isPressed()) {
        if (this._touchCount === 0 || this._touchCount >= 15) {
          var x = $gameMap.canvasToMapX(TouchInput.x);
          var y = $gameMap.canvasToMapY(TouchInput.y);

          var events = $gameMap.eventsXy(x, y);

          if (events.length === 0) {
            return false;
          }

          for (var i = 0; i < events.length; i++) {
            if (events[i].isTriggerIn([0])) {
              events[i].start();
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  var oldSceneMap_processMapTouch = Scene_Map.prototype.processMapTouch;
  Scene_Map.prototype.processMapTouch = function() {
    if (!this.tryTriggeringEvent()) {
      oldSceneMap_processMapTouch.call(this);
    }
  };
})(OrangeInstantTriggerMouseEvents);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeInstantTriggerMouseEvents", "1.0.0", "This plugin will trigger events instantly when you click on them", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-22");
} else {
  Imported["OrangeInstantTriggerMouseEvents"] = true;
}
