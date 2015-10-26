/*=============================================================================
 * Orange - Region Collisions
 * By Hudell - www.hudell.com
 * OrangeRegionCollisions.js
 * Version: 1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Allows the usage of regions to overwrite the passability configuration of tiles
 * @author Hudell
 *
 * @param BlockRegionId
 * @desc The ID of the region that should be used to block passage on a tile
 * @default 0
 *
 * @param UnblockRegionId
 * @desc The ID of the region that should be used to unblock passage on a tile
 * @default 0
 *
 * @param BlockPlayerRegionId
 * @desc The ID of the region that should be used to block passage of the player on a tile
 * @default 0
 *
 * @param UnblockPlayerRegionId
 * @desc The ID of the region that should be used to unblock passage of the player on a tile
 * @default 0
 *
 * @param BlockEventRegionId
 * @desc The ID of the region that should be used to block passage of events on a tile
 * @default 0
 *
 * @param UnblockEventRegionId
 * @desc The ID of the region that should be used to unblock passage of events on a tile
 * @default 0
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/region-collisions
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeRegionCollisions = OrangeRegionCollisions || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeRegionCollisions');
  $.Param = $.Param || {};

  $.Param.BlockRegionId = Number($.Parameters['BlockRegionId'] || 0);
  $.Param.UnblockRegionId = Number($.Parameters['UnblockRegionId'] || 0);
  $.Param.BlockPlayerRegionId = Number($.Parameters['BlockPlayerRegionId'] || 0);
  $.Param.UnblockPlayerRegionId = Number($.Parameters['UnblockPlayerRegionId'] || 0);
  $.Param.BlockEventRegionId = Number($.Parameters['BlockEventRegionId'] || 0);
  $.Param.UnblockEventRegionId = Number($.Parameters['UnblockEventRegionId'] || 0);

  var oldGame_Map_checkPassage = Game_Map.prototype.checkPassage;
  Game_Map.prototype.checkPassage = function(x, y, bit) {
    if ($.Param.BlockRegionId > 0 || $.Param.UnblockRegionId > 0) {
      var regionId = this.regionId(x, y);

      if (regionId > 0) {
        if ($.Param.BlockRegionId > 0 && regionId == $.Param.BlockRegionId) {
          return false;
        }

        if ($.Param.UnblockRegionId > 0 && regionId == $.Param.UnblockRegionId) {
          return true;
        }
      }
    }

    return oldGame_Map_checkPassage.call(this, x, y, bit);
  };

  var oldGameEvent_isMapPassable = Game_Event.prototype.isMapPassable;
  Game_Event.prototype.isMapPassable = function(x, y, d) {
    if ($.Param.BlockEventRegionId > 0 || $.Param.UnblockRegionId > 0) {
      var new_x = $gameMap.roundXWithDirection(x, d);
      var new_y = $gameMap.roundYWithDirection(y, d);
      var regionId = $gameMap.regionId(new_x, new_y);

      if (regionId > 0) {
        if ($.Param.BlockEventRegionId > 0 && regionId == $.Param.BlockEventRegionId) {
          return false;
        }

        if ($.Param.UnblockRegionId > 0 && regionId == $.Param.UnblockRegionId) {
          return true;
        }
      }
    }

    return oldGameEvent_isMapPassable.call(this, x, y, d);    
  };

  var oldGamePlayer_isMapPassable = Game_Player.prototype.isMapPassable;
  if (Imported["SuperOrangeMovement"] !== undefined) {
    var insignificantValue = 0.000001;

    $.runForAllPositions = function(x, y, callback) {
      var first_x = (x + this.hitboxXSize).floor();
      var last_x = (x + this.hitboxXSize + this.hitboxWidthSize - insignificantValue).floor();
      var first_y = (y + this.hitboxYSize).floor();
      var last_y = (y + this.hitboxYSize + this.hitboxHeightSize - insignificantValue).floor();

      for (var new_x = first_x; new_x <= last_x; new_x++) {
        for (var new_y = first_y; new_y <= last_y; new_y++) {
          var result = callback.call(this, new_x, new_y);

          if (result === true) return true;
          if (result === false) return false;
        }
      }

      return null;
    };


    $.checkPlayerRegionCollision = function(x, y) {
      var regionId = $gameMap.regionId(x, y);

      if (regionId > 0) {
        if ($.Param.BlockPlayerRegionId > 0 && regionId == $.Param.BlockPlayerRegionId) {
          return false;
        }

        if ($.Param.UnblockRegionId > 0 && regionId == $.Param.UnblockRegionId) {
          return true;
        }
      }

      return null;
    };

    Game_Player.prototype.isMapPassable = function(x, y, d) {
      if ($.Param.BlockPlayerRegionId > 0 || $.Param.UnblockRegionId > 0) {
        var new_x = $gameMap.roundFractionXWithDirection(x, d);
        var new_y = $gameMap.roundFractionYWithDirection(y, d);

        var result = $.runForAllPositions.call(this, new_x, new_y, $.checkPlayerRegionCollision);
        
        if (result === true) return true;
        if (result === false) return false;
      }

      return oldGamePlayer_isMapPassable.call(this, x, y, d);    
    };
  }
  else {
    Game_Player.prototype.isMapPassable = function(x, y, d) {
      if ($.Param.BlockPlayerRegionId > 0 || $.Param.UnblockRegionId > 0) {
        var new_x = $gameMap.roundXWithDirection(x, d);
        var new_y = $gameMap.roundYWithDirection(y, d);
        var regionId = $gameMap.regionId(new_x, new_y);

        if (regionId > 0) {
          if ($.Param.BlockPlayerRegionId > 0 && regionId == $.Param.BlockPlayerRegionId) {
            return false;
          }

          if ($.Param.UnblockRegionId > 0 && regionId == $.Param.UnblockRegionId) {
            return true;
          }
        }
      }

      return oldGamePlayer_isMapPassable.call(this, x, y, d);    
    };

  }

})(OrangeRegionCollisions);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeRegionCollisions", "1.1.0", "Allows the usage of regions to overwrite the passability configuration of tiles", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-21");
} else {
  Imported["OrangeRegionCollisions"] = true;
}
