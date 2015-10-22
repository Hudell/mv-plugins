/*=============================================================================
 * Orange - Auto Avoid Obstacles
 * By Hudell - www.hudell.com
 * OrangeAutoAvoidObstacles.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Makes the player automatically Avoid small obstacles, by walking around them
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
 * @param MaxOffset
 * @desc The max distance (in number of tiles) that the character is allowed to
 *       walk in a different direction to avoid an obstacle. 
 * Default: 0.75
 * @default 0.75
 *
 * @param RetainDirection
 * @desc If true, the character won't face the other direction when walking
 *       around an object
 * Default: true
 * @default true
 *
 * @author Hudell
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

var OrangeAutoAvoidObstacles = OrangeAutoAvoidObstacles || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeAutoAvoidObstacles');
  $.Param = $.Param || {};

  $.Param.AvoidEvents = $.Param["AvoidEvents"] !== "false";
  $.Param.OnlyWhenDashing = $.Param["OnlyWhenDashing"] === "true";
  $.Param.DashingDelay = Number($.Param["DashingDelay"] || 0);
  $.Param.WalkingDelay = Number($.Param["WalkingDelay"] || 0);
  $.Param.MaxOffset = Number($.Param["MaxOffset"] || 0.75);
  $.Param.RetainDirection = $.Param["RetainDirection"] !== "false";

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

    if (this.tryToAvoid(direction, $.Param.MaxOffset)) {
      return true;
    }

    return false;
  };

  Game_Player.prototype.tryToAvoid = function(direction, maxOffset) {
    if (avoidObstaclesDelay > 0) {
      return false;
    }

    var previousOffset = 0;
    var offset = this.myStepSize();

    var tryDirection = function(xOffset, yOffset, movementDirection, faceDirection) {
      // Test if the player would be able to move on the faceDirection if they were at the offset position. If they could, then move towards that position for now.
      if (this.canPass((this._x + xOffset).fix(), (this._y + yOffset).fix(), faceDirection)) {
        this.executeMove(movementDirection);

        if ($.Param.RetainDirection) {
          this.setDirection(faceDirection);
        }
        
        return true;
      }
      
      return false;
    };

    if (direction == Direction.LEFT || direction == Direction.RIGHT) {
      // If the player can't walk horizontally on the current position, but would be able to walk if he were a little higher or lower then move vertically instead
      // on the next iterations it will keep trying to move horizontaly again and it will eventually work before the offset is reached

      var downEnabled = true;
      var upEnabled = true;
      while (offset <= maxOffset) {
        if (downEnabled) {
          if (!this.canPass(this._x, (this._y + previousOffset).fix(), Direction.DOWN)) {
            downEnabled = false;
          }
        }

        if (upEnabled) {
          if (!this.canPass(this._x, (this._y - previousOffset).fix(), Direction.UP)) {
            upEnabled = false;
          }          
        }

        if (downEnabled === true && tryDirection.call(this, 0, offset, Direction.DOWN, direction)) {
          return true;
        }

        if (upEnabled === true && tryDirection.call(this, 0, -offset, Direction.UP, direction)) {
          return true;
        }

        previousOffset = offset;
        offset += this.myStepSize();
      }
    }
    else if (direction == Direction.UP || direction == Direction.DOWN) {
      // If the player can't walk vertically on the current position, but would be able to walk if he were a little left or right then move horizontally instead
      // on the next iterations it will keep trying to move vertically again and it will eventually work before the offset is reached

      var leftEnabled = true;
      var rightEnabled = true;

      while (offset <= maxOffset) {
        if (leftEnabled) {
          if (!this.canPass((this._x - previousOffset).fix(), this._y, Direction.LEFT)) {
            leftEnabled = false;
          }
        }
        if (rightEnabled) {
          if (!this.canPass((this._x + previousOffset).fix(), this._y, Direction.RIGHT)) {
            rightEnabled = false;
          }
        }

        if (rightEnabled === true && tryDirection.call(this, offset, 0,  Direction.RIGHT, direction)) {
          return true;
        }

        if (leftEnabled === true && tryDirection.call(this, -offset, 0, Direction.LEFT, direction)) {
          return true;
        }

        previousOffset = offset;
        offset += this.myStepSize();
      }
    }

    return false;
  };


})(OrangeAutoAvoidObstacles);

PluginManager.register("OrangeAutoAvoidObstacles", "1.0.0", "Will make the player avoid small obstacles automatically", {
  email: "plugins@hudell.com",
  name: "Hudell",
  website: "http://www.hudell.com"
}, "2015-10-21");
