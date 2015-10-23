/*=============================================================================
 * Orange - Move Character To
 * By Hudell - www.hudell.com
 * OrangeMoveCharacterTo.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc This plugin adds a script call and a plugin command you can use
 *             to move the player or an event to a specific position
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
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/move-character-to
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
        character.setDestination(parseInt(args[1], 10), parseInt(args[2], 10));
      } else {
        character.clearDestination();
      }
    }
  };

  var oldGameCharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var canCheckDestination = false;
    if (this instanceof Game_Event) {
      canCheckDestination = true;
    } else if (this instanceof Game_Player) {
      canCheckDestination = this.isMoveRouteForcing();
    }

    if (canCheckDestination === true) {
      if (this._xDestination !== undefined && this._yDestination !== undefined) {
        if (this._xDestination == this._x && this._yDestination == this._y) {
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
    }

    oldGameCharacterBase_update.call(this);
  };

  // Only calls the old updateRoutineMove if there's no destination set.
  // This is done to prevent the game from moving to the next route command when you use setDestination inside a move command
  // This way you can add several "setDestination" calls inside a move route and the character will do one after the other.
  var oldGameCharacter_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
  Game_Character.prototype.updateRoutineMove = function() {
    if (this._xDestination === undefined && this._yDestination === undefined) {
      oldGameCharacter_updateRoutineMove.call(this);
    }
  };

  // Clears the destination automatically if a new move route is set
  var oldGameCharacter_setMoveRoute = Game_Character.prototype.setMoveRoute;
  Game_Character.prototype.setMoveRoute = function(moveRoute) {
    this.clearDestination();
    oldGameCharacter_setMoveRoute.call(this, moveRoute);
  };

  Game_CharacterBase.prototype.setDestination = function(x, y) {
    this._xDestination = x;
    this._yDestination = y;
  };

  Game_CharacterBase.prototype.clearDestination = function() {
    this._xDestination = undefined;
    this._yDestination = undefined;
  };
})(OrangeMoveCharacterTo);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeMoveCharacterTo", "1.0.0", "Adds a move route script call that you can use to make a character go to a specific position", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-22");
} else {
  Imported['OrangeMoveCharacterTo'] = true;
}
