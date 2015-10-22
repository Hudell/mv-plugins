/*=============================================================================
 * Orange - Region Collisions
 * By Hudell - www.hudell.com
 * OrangeRegionCollisions.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Allows the usage of regions to overwrite the passability configuration
 *             of tiles
 * @author Hudell
 *
 * @param BlockRegionId
 * @desc The ID of the region that should be used to block passage on a tile
 * Default: 0
 * @default 0
 *
 * @param UnblockRegionId
 * @desc The ID of the region that should be used to unblock passage on a tile
 * Default: 0
 * @default 0
 *=============================================================================*/
var Imported = Imported || {};
var OrangeRegionCollisions = OrangeRegionCollisions || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeRegionCollisions');
  $.Param = $.Param || {};

  $.Param.BlockRegionId = $.Parameters['BlockRegionId'];
  $.Param.UnblockRegionId = $.Parameters['UnblockRegionId'];

  var oldGame_Map_checkPassage = Game_Map.prototype.checkPassage;
  Game_Map.prototype.checkPassage = function(x, y, bit) {
    if ($.Param.BlockRegionId !== undefined || $.Param.UnblockRegionId !== undefined) {
      var regionId = this.regionId(x, y);

      if (regionId > 0) {
        if ($.Param.BlockRegionId !== undefined && regionId == Number($.Param.BlockRegionId)) {
          return false;
        }

        if ($.Param.UnblockRegionId !== undefined && regionId == Number($.Param.UnblockRegionId)) {
          return true;
        }
      }
    }

    return oldGame_Map_checkPassage.call(this, x, y, bit);
  };
})(OrangeRegionCollisions);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeRegionCollisions", "1.0.0", "Allows the usage of regions to overwrite the passability configuration of tiles", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-21");
}
else {
  Imported["OrangeRegionCollisions"] = true;
}
