/*=============================================================================
 * Orange - Auto Avoid Obstacles Diagonally
 * By Hudell - www.hudell.com
 * OrangeAutoAvoidObstaclesDiagonally.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Makes the player automatically Avoid small obstacles, by diagonally
 *
 * @param AvoidEvents
 * @desc Set this to false if you don't want the player to avoid events
 * Default: true
 * @default true
 *
 * @param OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing
 * Default: false
 * @default false
 *
 * @param DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle
 *       when dashing. Set this to the number of frames the character should wait
 * Default: 0
 * @default 0
 *
 * @param WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle
 *       when walking. Set this to the number of frames the character should wait
 * Default: 0
 * @default 0
 *
 * @author Hudell
 *
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/auto-avoid-diagonal
 * 
 *=============================================================================*/

var Imported = Imported || {};
if (Imported['MVCommons'] === undefined) {
  console.log('Download MVCommons: http://link.hudell.com/mvcommons');
  throw new Error("This library needs MVCommons to work properly!");
}

if (Imported['SuperOrangeMovement'] === undefined) {
  console.log('Download SuperOrangeMovement: http://link.hudell.com/super-orange-movement');
  throw new Error("This library needs SuperOrangeMovement to work properly!");
}

var OrangeAutoAvoidObstaclesDiagonally = OrangeAutoAvoidObstaclesDiagonally || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeAutoAvoidObstaclesDiagonally');
  $.Param = $.Param || {};

  $.Param.AvoidEvents = $.Param["AvoidEvents"] !== "false";
  $.Param.OnlyWhenDashing = $.Param["OnlyWhenDashing"] === "true";
  $.Param.DashingDelay = Number($.Param["DashingDelay"] || 0);
  $.Param.WalkingDelay = Number($.Param["WalkingDelay"] || 0);

  var avoidObstaclesDelay = 0;

  // Every time the player succesfully moves, reset the delay
  var oldGamePlayer_onBeforeMove = Game_Player.prototype.onBeforeMove;
  Game_Player.prototype.onBeforeMove = function() {
    if (this.isDashing()) {
      avoidObstaclesDelay = $.Param.DashingDelay;
    }
    else {
      avoidObstaclesDelay = $.Param.WalkingDelay;
    }

    if (oldGamePlayer_onBeforeMove !== undefined) {
      oldGamePlayer_onBeforeMove.call(this);
    }
  };

  var oldGamePlayer_trySavingFailedMovement = Game_Player.prototype.trySavingFailedMovement;
  Game_Player.prototype.trySavingFailedMovement = function(direction) {
    if (oldGamePlayer_trySavingFailedMovement !== undefined) {
      if (oldGamePlayer_trySavingFailedMovement.call(this, direction)) {
        return true;
      }
    }

    if (avoidObstaclesDelay > 0) {
      avoidObstaclesDelay--;
    }

    if ($.Param.OnlyWhenDashing === true) {
      if (!this.isDashing()) {
        return false;
      }
    }

    if ($.Param.AvoidEvents !== true) {
      if (this.isTilesetPassable(this._x, this._y, direction)) {
        var x2 = $gameMap.roundFractionXWithDirection(this._x, direction, this.myStepSize());
        var y2 = $gameMap.roundFractionYWithDirection(this._y, direction, this.myStepSize());

        if (this.isCollidedWithCharacters(x2, y2)) {
          return false;
        }
      }
    }

    if (this.tryToAvoid(direction)) {
      return true;
    }

    return false;
  };

  Game_Player.prototype.tryToAvoid = function(direction) {
    if (avoidObstaclesDelay > 0) {
      return false;
    }

    if (direction == Direction.LEFT || direction == Direction.RIGHT) {
      if (this.canPassDiagonally(this._x, this._y, direction, Direction.DOWN)) {
        this.executeMove(direction - 3);
        return true;
      }
      else if (this.canPassDiagonally(this._x, this._y, direction, Direction.UP)) {
        this.executeMove(direction + 3);
        return true;
      }
    }
    else if (direction == Direction.UP || direction == Direction.DOWN) {
      if (this.canPassDiagonally(this._x, this._y, Direction.LEFT, direction)) {
        this.executeMove(direction - 1);
        return true;
      }
      else if (this.canPassDiagonally(this._x, this._y, Direction.RIGHT, direction)) {
        this.executeMove(direction + 1);
        return true;
      }
    }

    return false;
  };


})(OrangeAutoAvoidObstaclesDiagonally);

PluginManager.register("OrangeAutoAvoidObstaclesDiagonally", "1.0.0", "Will make the player avoid small obstacles automatically by walking diagonally around them", {
  email: "plugins@hudell.com",
  name: "Hudell",
  website: "http://www.hudell.com"
}, "2015-10-21");
