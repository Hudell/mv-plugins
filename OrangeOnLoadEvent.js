/*=============================================================================
 * Orange - On Load Event
 * By Hudell - www.hudell.com
 * OrangeOnLoadEvent.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Will let you call a common event immediately after a load game
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
 * Get the latest version of this script on http://link.hudell.com/on-load-event
 * 
 *=============================================================================*/
var Imported = Imported || {};

var OrangeOnLoadEvent = OrangeOnLoadEvent || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeOnLoadEvent');
  $.Param = $.Param || {};

  $.Param.commonEventId = Number($.Parameters['commonEventId'] || 0);

  var oldGameSystem_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    oldGameSystem_onAfterLoad.call(this);

    if ($.Param.commonEventId !== undefined && $.Param.commonEventId > 0) {
      $gameTemp.reserveCommonEvent($.Param.commonEventId);
    }
  };
})(OrangeOnLoadEvent);

if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeOnLoadEvent", "1.0.0", "Will let you call a common event immediately after a load game", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-19");
} else {
  Imported["OrangeOnLoadEvent"] = true;
}
