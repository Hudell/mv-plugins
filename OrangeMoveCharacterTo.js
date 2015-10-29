/*=============================================================================
 * Orange - Move Character To
 * By Hudell - www.hudell.com
 * OrangeMoveCharacterTo.js
 * Version: 1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin adds a script call and a plugin command you can use to move the player or an event to a specific position.
 *             
 * @author Hudell
 *
 * @help
 * Plugin Command:
 *   ORANGEMOVETO character x y
 * Example:
 *   ORANGEMOVETO 0 15 20
 *
 * Script call (can be used inside move routes):
 *   this.setDestination(x, y);
 * Example:
 *   this.setDestination(15, 20);
 *
 *
 * You can also add a direction for the character to face after walking,
 * like this:
 *
 * ORANGEMOVETO 0 15 20 left
 * or
 * this.setDestination(15, 20, 4);
 #
 # Direction numbers are (RPG Maker default):
 #  left = 4
 #  right = 6
 #  top = 8
 #  down = 2
 * 
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/move-character-to
 * 
 *=============================================================================*/
var Imported = Imported || {};
var OrangeMoveCharacterTo = OrangeMoveCharacterTo || {};

(function($) {
  "use strict";

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    oldGameInterpreter_pluginCommand.call(this, command, args);

    if (command.toUpperCase() === 'ORANGEMOVETO') {
      var character = this.character(parseInt(args[0], 10));

      if (args.length > 2) {
        var x = parseInt(args[1], 10);
        var y = parseInt(args[2], 10);
        var d = 0;
        if (args.length > 3) {
          switch(args[3].toUpperCase()) {
            case 'LEFT' :
              d = 4;
              break;
            case 'RIGHT' :
              d = 6;
              break;
            case 'UP' :
              d = 8;
              break;
            case 'DOWN' :
              d = 2;
              break;
            default :
              d = parseInt(args[3], 10);
              break;
          }
        } 

        character.setDestination(x, y, d);
      } else {
        character.clearDestination();
      }
    }
  };

  var oldGameCharacterBase_updateStop = Game_CharacterBase.prototype.updateStop;
  Game_CharacterBase.prototype.updateStop = function() {
    if (this._xDestination !== undefined && this._yDestination !== undefined) {
      if (this._xDestination == this._x && this._yDestination == this._y) {
        // If the character reached the destination, check if there's a direction to face
        if (this._dDestination !== undefined && this._dDestination !== 0) {
          if (this.isMoving()) {
            return;
          }
          this._direction = this._dDestination;
        }

        this.clearDestination();
      }

      if (this._xDestination !== undefined) {
        if (!this.isMoving()) {
          var direction = this.findDirectionTo(this._xDestination, this._yDestination);

          if (direction > 0) {
            this.moveStraight(direction);
            return;
          }
        }
      }
    }

    oldGameCharacterBase_updateStop.call(this);
  };

  // Change the advanceMoveRouteIndex  to only advance the index when the character reach the destination.
  var oldGameCharacter_advanceMoveRouteIndex = Game_Character.prototype.advanceMoveRouteIndex;
  Game_Character.prototype.advanceMoveRouteIndex = function() {
    if (this._xDestination === undefined && this._yDestination === undefined) {
      oldGameCharacter_advanceMoveRouteIndex.call(this);
    }
  };

  // Clears the destination automatically if a new move route is set
  var oldGameCharacter_setMoveRoute = Game_Character.prototype.setMoveRoute;
  Game_Character.prototype.setMoveRoute = function(moveRoute) {
    this.clearDestination();
    oldGameCharacter_setMoveRoute.call(this, moveRoute);
  };

  Game_CharacterBase.prototype.setDestination = function(x, y, d) {
    if (this._x != x || this._y != y || this.isMoving()) {
      this._xDestination = x;
      this._yDestination = y;
      
      if (d !== undefined) {
        this._dDestination = d;
      }
    } else if (d !== undefined && d !== 0) {
      this._direction = d;
    }
  };

  //Updates Game_Temp.prototype.setDestination to only be executed when the player has no destination set on itself
  var oldGameTemp_setDestination = Game_Temp.prototype.setDestination;
  Game_Temp.prototype.setDestination = function(x, y) {
    if ($gamePlayer._xDestination === undefined) {
      oldGameTemp_setDestination.call(this, x, y);
    }
  };

  Game_CharacterBase.prototype.clearDestination = function() {
    this._xDestination = undefined;
    this._yDestination = undefined;
    this._dDestination = undefined;
  };
})(OrangeMoveCharacterTo);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeMoveCharacterTo", "1.1", "Adds a move route script call that you can use to make a character go to a specific position", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-22");
} else {
  Imported['OrangeMoveCharacterTo'] = true;
}
