/*=============================================================================
 * Orange - Trigger Blocked Touch Events
 * By Hudell - www.hudell.com
 * OrangeTriggerBlockedTouchEvents.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc This plugin will trigger onTouch events on normal priority
 *             if the player tries to walk into them
 * @author Hudell
 *
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/trigger-blocked-touch-events
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeTriggerBlockedTouchEvents = OrangeTriggerBlockedTouchEvents || {};

(function($) {
  "use strict";

  // alias the updateNonmoving method from the Game_Player class to check
  // if there's any event to trigger
  var oldGamePlayer_updateNonmoving = Game_Player.prototype.updateNonmoving;
  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    oldGamePlayer_updateNonmoving.call(this, wasMoving);

    // If the player was moving or it's pressing an arrow key
    if (wasMoving || Input.dir4 !== 0) {
      // Doesn't trigger anything if there's already something running
      if (!$gameMap.isEventRunning()) {
        // Makes sure the player is blocked before checking the events
        if (!this.isMapPassable(this._x, this._y, this.direction)) {
          this.checkEventTriggerThere([1]);

          // Setups the starting event if there's any.
          if ($gameMap.setupStartingEvent()) {
            return;
          }
        }
      }
    }
  };
})(OrangeTriggerBlockedTouchEvents);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeTriggerBlockedTouchEvents", "1.0.0", "Will trigger onTouch events on normal priority if the player tries to walk into them", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-21");
} else {
  Imported["OrangeTriggerBlockedTouchEvents"] = true;
}
