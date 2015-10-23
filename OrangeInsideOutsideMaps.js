/*=============================================================================
 * Orange - Inside / Outside Maps
 * By Hudell - www.hudell.com
 * OrangeInsideOutsideMaps.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Allow you to mark maps as being 'inside' or 'outside' with a notetag
 *             
 * @author Hudell
 *
 * @param insideSwitchId
 * @desc The number of the switch to activate on "inside" maps
 * @default 0
 *
 * @help
 * Add <inside> on the notes of the maps that you want to tag as being inside
 *
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/inside-outside-maps
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeInsideOutsideMaps = OrangeInsideOutsideMaps || {};

if (Imported['MVCommons'] === undefined) {
  console.log('You should download MVCommons: http://link.hudell.com/mvcommons');
}

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeInsideOutsideMaps');
  $.Param = $.Param || {};

  $.Param.insideSwitchId = Number($.Parameters['insideSwitchId'] || 0);

  Game_Map.prototype.isInside = function() {
    if (Imported['MVCommons'] === undefined) {
      return $dataMap.meta.inside === true;
    } else {
      return MVC.getProp($dataMap.meta, 'inside') === true;
    }
  };

  $.updateSwitch = function() {
    if ($.Param.insideSwitchId !== undefined && $.Param.insideSwitchId > 0) {
      if (SceneManager._scene instanceof Scene_Map) {
        $gameSwitches.setValue($.Param.insideSwitchId, $gameMap.isInside());
      }
    }
  };

  var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function() {
    var updateSwitch = this.isTransferring();

    oldGamePlayer_performTransfer.call(this);
    if (updateSwitch) {
      $.updateSwitch();
    }
  };
})(OrangeInsideOutsideMaps);

if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeInsideOutsideMaps", "1.0.0", "Allow you to mark maps as being 'inside' or 'outside'", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-18");
} else {
  Imported["OrangeInsideOutsideMaps"] = true;
}
