/*=============================================================================
 * Orange - Map Change Event
 * By Hudell - www.hudell.com
 * OrangeMapChangeEvent.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Will let you call a common event everytime the player is transfered to a new map
 *             
 * @author Hudell
 *
 * @param commonEventId
 * @desc The number of the common event to call
 * @default 0
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/map-change-event
 * 
 *=============================================================================*/
var Imported = Imported || {};

var OrangeMapChangeEvent = OrangeMapChangeEvent || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeMapChangeEvent');
  $.Param = $.Param || {};

  $.Param.commonEventId = Number($.Parameters['commonEventId'] || 0);

  var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
      if ($.Param.commonEventId !== undefined && $.Param.commonEventId > 0) {
        $gameTemp.reserveCommonEvent($.Param.commonEventId);
      }
    }

    oldGamePlayer_performTransfer.call(this);
  };

})(OrangeMapChangeEvent);

if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeMapChangeEvent", "1.0.0", "Will let you call a common event everytime the player is transfered to a new map", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-19");
} else {
  Imported["OrangeMapChangeEvent"] = true;
}
