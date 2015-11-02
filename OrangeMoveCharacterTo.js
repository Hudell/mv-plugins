/*=============================================================================
 * Orange - Move Character To
 * By Hudell - www.hudell.com
 * OrangeMoveCharacterTo.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin adds a script call and a plugin command you can use to move the player or an event to a specific position.
 * @author Hudell
 *
 * @param failedMovementDelay
 * @desc How many frames should the characters wait before trying to move again after failing to move once.
 * @default 30
 *
 * @help
 * Plugin Commands Examples:
 *   move event 10 to position 15 20 and face left
 *   move player to event 5
 *   move event 7 to player and follow
 *   clear player path
 *   clear event 7 path
 *
 * Script calls (can be used inside move routes):
 *   this.setDestination(x, y, d);
 *   this.setCharacterDestination(eventId, follow)
 *
 * Example:
 *   this.setDestination(15, 20, 2);
 *   this.setCharacterDestination(10, true);
 *
 * Direction numbers are the RPG Maker default:
 *  left = 4
 *  right = 6
 *  top = 8
 *  down = 2
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

  var parameters = PluginManager.parameters('OrangeMoveCharacterTo') || {};
  var failedMovementDelay = Number(parameters.failedMovementDelay || 30);

  Game_Interpreter.prototype.checkOldOrangeMoveToFormat = function(command, args) {
    if (command.toUpperCase() === 'ORANGEMOVETO') {
      var character = this.character(parseInt(args[0], 10));

      if (args.length > 2) {
        var x = parseFloat(args[1]);
        var y = parseFloat(args[2]);
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

  Game_Interpreter.prototype.checkOrangeClearPathCommand = function(command, args) {
    if (command.toUpperCase() !== 'CLEAR') return;
    if (args.length < 2) return;

    var nextIndex = 0;
    var eventId = undefined;

    if (args[0].toUpperCase() === 'EVENT') {
      eventId = parseInt(args[1], 10);
      nextIndex = 2;
    } else if (args[0].toUpperCase() === 'PLAYER') {
      eventId = -1;
      nextIndex = 1;
    } else if (args[0].toUpperCase() === 'THIS' && args[1].toUpperCase() === 'EVENT') {
      eventId = 0;
      nextIndex = 2;
    }

    if (args.length > nextIndex && args[nextIndex].toUpperCase() === 'PATH') {
      var character = this.character(eventId);
      if (character !== undefined && character !== null) {
        character.clearDestination();
      }
    }
  };

  Game_Interpreter.prototype.checkNewOrangeMoveToFormat = function(command, args) {
    if (command.toUpperCase() !== 'MOVE') return;
    if (args.length <= 4) return;

    var eventId = undefined;
    var newEventId = undefined;
    var newX = undefined;
    var newY = undefined;
    var nextIndex = 0;
    var follow = false;
    var direction = 0;

    if (args[0].toUpperCase() === 'EVENT') {
      eventId = parseInt(args[1], 10);
      nextIndex = 2;
    } else if (args[0].toUpperCase() === 'PLAYER') {
      eventId = -1;
      nextIndex = 1;
    } else if (args[0].toUpperCase === 'THIS' && args[1].toUpperCase() === 'EVENT') {
      eventId = 0;
      nextIndex = 2;
    } else {
      return;
    }

    if (args[nextIndex].toUpperCase() !== 'TO') return;
    nextIndex++;

    if (args.length <= nextIndex) return;

    if (args[nextIndex].toUpperCase() === 'EVENT') {
      nextIndex++;
      
      if (args.length <= nextIndex) return;
      
      newEventId = parseInt(args[nextIndex], 10);
      nextIndex++;
    } else if (args[nextIndex].toUpperCase() === 'PLAYER') {
      newEventId = -1;
      nextIndex++;
    } else if (args[nextIndex].toUpperCase() === 'POSITION') {
      if (args.length <= nextIndex + 2) return;

      newX = parseFloat(args[nextIndex + 1]);
      newY = parseFloat(args[nextIndex + 2]);

      nextIndex += 3;
    }

    if (args.length > nextIndex +1) {
      if (args[nextIndex].toUpperCase() === 'AND') {
        nextIndex++;

        if (args[nextIndex].toUpperCase() === 'FOLLOW') {
          follow = true;
          nextIndex++;
        } else if (args[nextIndex].toUpperCase() === 'FACE' || args[nextIndex].toUpperCase() === 'TURN') {
          nextIndex++;

          if (args.length > nextIndex) {
            if (args[nextIndex].toUpperCase() === 'LEFT') {
              direction = 4;
            } else if (args[nextIndex].toUpperCase() === 'RIGHT') {
              direction = 6;
            } else if (args[nextIndex].toUpperCase() === 'UP') {
              direction = 8;
            } else if (args[nextIndex].toUpperCase() === 'DOWN') {
              direction = 2;
            } else {
              direction = parseInt(args[nextIndex], 10);
            }

            nextIndex++;
          }
        }
      }
    }

    var character = this.character(eventId);

    if (newEventId !== undefined) {
      var newCharacter = this.character(newEventId);
      if (newCharacter === undefined || newCharacter === null) return;

      character.setCharacterDestination(newCharacter, follow);
    } else {
      character.setDestination(newX, newY, direction);
    }
  };

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    oldGameInterpreter_pluginCommand.call(this, command, args);
    this.checkOldOrangeMoveToFormat.call(this, command, args);
    this.checkNewOrangeMoveToFormat.call(this, command, args);
    this.checkOrangeClearPathCommand.call(this, command, args);
  };

  var oldGameCharacterBase_updateStop = Game_CharacterBase.prototype.updateStop;
  Game_CharacterBase.prototype.updateStop = function() {
    var direction = undefined;
    var distance = undefined;

    if (this._orangeMovementDelay !== undefined && this._orangeMovementDelay > 0) {
      this._orangeMovementDelay--;
      return;
    }

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
          var xDistance = this._x - this._xDestination;
          var yDistance = this._y - this._yDestination;
          
          // Check if there's any additional partial tile to walk
          if (Math.abs(xDistance) < 1 && Math.abs(yDistance) < 1) {
            if (xDistance < 0) {
              this._direction = 6;
              this._x = this._xDestination;
              return;
            } else if (yDistance < 0) {
              this._direction = 2;
              this._y = this._yDestination;
              return;
            } else if (xDistance > 0) {
              this._direction = 4;
              this._x = this._xDestination;
              return;
            } else if (yDistance > 0) {
              this._y = this._yDestination;
              this._direction = 8;
              return;
            }
          } else {
            //Check if there's any partial position to fix before start walking
            if (this._x - Math.floor(this._x) || this._y - Math.floor(this._y)) {
              if (this._xDestination > this._x) {
                this._direction = 6;
                this._x = Math.ceil(this._x);
              } else {
                this._direction = 4;
                this._x = Math.floor(this._x);
              }

              if (this._yDestination > this._y) {
                this._direction = 2;
                this._y = Math.ceil(this._y);
              } else {
                this._direction = 8;
                this._y = Math.floor(this._y);
              }

              return;
            }
          }

          direction = this.findDirectionTo(Math.floor(this._xDestination), Math.floor(this._yDestination));

          if (direction > 0) {
            this.moveStraight(direction);
            if (!this.isMovementSucceeded()) {
              this._orangeMovementDelay = failedMovementDelay;
            }

            return;
          }
        }
      }
    }

    if (this._destinationCharacter !== undefined) {
      if (this._destinationCharacter._x === this._x && this._destinationCharacter._y == this._y) {
        //If the stalker reached the character, check if it needs to keep following it
        if (this._followCharacter !== true) {
          this.clearDestination();
        } else {
          return;
        }
      }

      if (this._destinationCharacter !== undefined) {
        if (!this.isMoving()) {
          direction = this.findDirectionTo(this._destinationCharacter._x, this._destinationCharacter._y);

          if (direction > 0) {
            this.moveStraight(direction);
            if (!this.isMovementSucceeded()) {

              //If failed to move, and it's not set to follow the character and distance is less than 1 tile, stop moving.
              if (this._followCharacter !== true) {
                distance = Math.abs(this._x - this._destinationCharacter._x) + Math.abs(this._y - this._destinationCharacter._y);
                if (distance <= 1) {
                  this.clearDestination();
                  return;
                }                
              }

              this._orangeMovementDelay = failedMovementDelay;
            }

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
    if (this._xDestination === undefined && this._yDestination === undefined && this._destinationCharacter === undefined) {
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

  Game_CharacterBase.prototype.setCharacterDestination = function(character, follow) {
    if (follow === undefined) follow = false;

    if (typeof(character) == "number") {
      character = $gameMap._interpreter.character(character);
    }

    if (character === undefined) return;

    if (follow === true) {
      this._destinationCharacter = character;
      this._followCharacter = true;
    } else {
      if (this._x != character._x || this._y != character._y || this.isMoving()) {
        this._destinationCharacter = character;
        this._followCharacter = false;
      }
    }
  };

  //Updates Game_Temp.prototype.setDestination to only be executed when the player has no destination set on itself
  var oldGameTemp_setDestination = Game_Temp.prototype.setDestination;
  Game_Temp.prototype.setDestination = function(x, y) {
    if ($gamePlayer._xDestination === undefined && $gamePlayer._destinationCharacter === undefined && $gamePlayer._yDestination === undefined) {
      oldGameTemp_setDestination.call(this, x, y);
    }
  };

  Game_CharacterBase.prototype.clearDestination = function() {
    this._xDestination = undefined;
    this._yDestination = undefined;
    this._dDestination = undefined;
    this._destinationCharacter = undefined;
    this._followCharacter = false;
  };
})(OrangeMoveCharacterTo);

Imported['OrangeMoveCharacterTo'] = 1.3;