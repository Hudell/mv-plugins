/*=============================================================================
 * Orange - Super Movement
 * By Hudell - www.hudell.com
 * SuperOrangeMovement.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================
 * @plugindesc Movement Improvements:
 *             Diagonal Movement
 *             Pixel Movement
 *             Actor Hitbox Changer
 *
 * @param Tile_Sections
 * @desc How many pieces do you want to break the tiles into?
 * Default: 4
 * @default 4
 *
 * @param Diagonal_Movement
 * @desc Enable Diagonal Movement?
 * Default: true
 * @default true
 *
 * @param FollowersDistance
 * @desc What's the distance (in tiles) that each party member should keep from
 *       the next one?
 * Default: 0.5
 * @default 0.5
 *
 * @param TriggerAllAvailableEvents
 * @desc If active, the game may trigger multiple events when you press
 *       the action button if there are more than one event in front of you
 * Default: false
 * @default false
 *
 * @param TriggerTouchEventsAfterTeleport
 * @desc If you're using pixel movement and you teleport the player
 *       to a tile with a touch triggered event, that event will be
 *       triggered on the first step the player takes.
 *       If you want that to happen, change this to true.
 * Default: false
 * @default false
 *
 * @param BlockRepeatedTouchEvents
 * @desc If you're using pixel movement and set this param to false,
 *       any touch triggered event will be executed after every step
 *       that the player takes inside that tile.
 * Default: true
 * @default true
 *
 * @param IgnoreEmptyEvents
 * @desc If true, the game won't try to trigger events that have no
 *       commands
 * Default: true
 * @default true
 *
 * @param DisablePixelMovementForMouseRoutes
 * @desc If true, the pixel movement will be disabled when you assign a
 *       fixed move route to the player;
 *       ATTENTION:
 *       If you turn this to false, the player character may get stuck when
 *       controlled with a mouse
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

var SuperOrangeMovement = SuperOrangeMovement || {};
SuperOrangeMovement.VERSION = 0.1;

// Useful Direction Constants
var Direction = {
  UP: 8,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 6,
  UP_LEFT: 7,
  UP_RIGHT: 9,
  DOWN_LEFT: 1,
  DOWN_RIGHT: 3,

  goes_up: function(d) {
    return [7, 8, 9].indexOf(d) >= 0;
  },

  goes_down: function(d) {
    return [1, 2, 3].indexOf(d) >= 0;
  },

  goes_left: function(d) {
    return [1, 4, 7].indexOf(d) >= 0;
  },

  goes_right: function(d) {
    return [3, 6, 9].indexOf(d) >= 0;
  },

  join_directions: function(dir1, dir2) {
    if (dir1 == Direction.UP || dir2 == Direction.UP) {
      if (dir1 == Direction.LEFT || dir2 == Direction.LEFT) {
        return Direction.UP_LEFT;
      } else if (dir1 == Direction.RIGHT || dir2 == Direction.RIGHT) {
        return Direction.UP_RIGHT;
      }
    } else if (dir1 == Direction.DOWN || dir2 == Direction.DOWN) {
      if (dir1 == Direction.LEFT || dir2 == Direction.LEFT) {
        return Direction.DOWN_LEFT;
      } else if (dir1 == Direction.RIGHT || dir2 == Direction.RIGHT) {
        return Direction.DOWN_RIGHT;
      }
    }

    if (dir1 >= 1 && dir1 <= 9 && dir1 != 5) {
      return dir1;
    } else {
      return dir2;
    }
  },

  get_button_name: function(direction, defaultValue) {
    switch (direction) {
      case Direction.UP:
        return 'up';
      case Direction.DOWN:
        return 'down';
      case Direction.LEFT:
        return 'left';
      case Direction.RIGHT:
        return 'right';
      default:
        break;
    }

    if (defaultValue === undefined) {
      defaultValue = '';
    }

    return defaultValue;
  }
};


(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('SuperOrangeMovement');
  $.Param = $.Param || {};

  $.Param.Tile_Sections = $.Parameters["Tile_Sections"];
  $.Param.Diagonal_Movement = $.Parameters["Diagonal_Movement"] !== "false";
  $.Param.IgnoreEmptyEvents = $.Parameters["IgnoreEmptyEvents"] !== "false";
  $.Param.DisablePixelMovementForMouseRoutes = $.Parameters["DisablePixelMovementForMouseRoutes"] !== "false";
  $.Param.BlockRepeatedTouchEvents = $.Parameters["BlockRepeatedTouchEvents"] !== "false";
  $.Param.FollowersDistance = Number($.Parameters["FollowersDistance"] || 0.5);
  $.Param.TriggerAllAvailableEvents = $.Parameters["TriggerAllAvailableEvents"] === "true";
  $.Param.TriggerTouchEventsAfterTeleport = $.Parameters["TriggerTouchEventsAfterTeleport"] === "true";

  if ($.Param.Tile_Sections === undefined || parseInt($.Param.Tile_Sections, 10) <= 0) {
    throw new Error("SuperOrangeMovement: The Tile_Sections param is invalid.");
  }

  $.Param.Step_Size = (1 / $.Param.Tile_Sections).fix();

  $._checkedTiles = [];

  // The insignificantValue is used to decrease from the 'right' and 'bottom' positions of the hitboxes, so that those position do not "flow" to the next integer value
  // Example:  Left  = 10, Top = 15, Right = 10.999999, Bottom = 15.999999 instead of Right = 11 and Bottom = 16
  var insignificantValue = 0.000001;

  MVC.reader(Game_CharacterBase.prototype, 'enableFractionalMovement', function() {
    return false;
  });

  Game_Player.prototype.actor = function() {
    if ($gameParty._actors.length > 0) {
      return $gameParty._actors[0];
    } else {
      return undefined;
    }
  };

  var addPropertiesToCharacter = function(character) {
    
    // X position of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxX', function(value) {
      this._hitboxX = value;
      this._canClearHitboxX = false;
    }, function() {
      if (this._hitboxX === undefined) {
        var size = MVC.getProp(this.actor().meta, 'hitboxX');
        if (size !== undefined) {
          size = parseInt(size, 10);
        }

        if (typeof(size) == "number") {
          this._hitboxX = size;
        } else {
          this._hitboxX = 0;
        }

        this._canClearHitboxX = true;
      }

      return this._hitboxX;
    });

    // Y position of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxY', function(value) {
      this._hitboxY = value;
      this._canClearHitboxY = false;
    }, function() {
      if (this._hitboxY === undefined) {
        var size = MVC.getProp(this.actor().meta, 'hitboxY');
        if (size !== undefined) {
          size = parseInt(size, 10);
        }

        if (typeof(size) == "number") {
          this._hitboxY = size;
        } else {
          this._hitboxY = 0;
        }

        this._canClearHitboxY = true;
      }

      return this._hitboxY;
    });

    // Width of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxWidth', function(value) {
      this._hitboxWidth = value;
      this._canClearHitboxWidth = false;
    }, function() {
      if (this._hitboxWidth === undefined) {
        var size = MVC.getProp(this.actor().meta, 'hitboxWidth');
        if (size !== undefined) {
          size = parseInt(size, 10);
        }

        if (typeof(size) == "number") {
          this._hitboxWidth = size;
        } else {
          this._hitboxWidth = $gameMap.tileWidth();
        }

        this._canClearHitboxWidth = true;
      }

      return this._hitboxWidth;
    });

    // Height of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxHeight', function(value) {
      this._hitboxHeight = value;
      this._canClearHitboxHeight = false;
    }, function() {
      if (this._hitboxHeight === undefined) {
        var size = MVC.getProp(this.actor().meta, 'hitboxHeight');
        if (size !== undefined) {
          size = parseInt(size, 10);
        }

        if (typeof(size) == "number") {
          this._hitboxHeight = size;
        } else {
          this._hitboxHeight = $gameMap.tileHeight();
        }

        this._canClearHitboxHeight = true;
      }

      return this._hitboxHeight;
    });


    // X position of the character hitbox (in tiles)
    MVC.reader(character.prototype, 'hitboxXSize', function() {
      return (this.hitboxX / $gameMap.tileWidth()).fix();
    });

    // Y position of the character hitbox (in tiles)
    MVC.reader(character.prototype, 'hitboxYSize', function() {
      return (this.hitboxY / $gameMap.tileHeight()).fix();
    });

    // Width of the character hitbox (in tiles)
    MVC.reader(character.prototype, 'hitboxWidthSize', function() {
      return (this.hitboxWidth / $gameMap.tileWidth()).fix();
    });

    // Height of the character hitbox (in tiles)
    MVC.reader(character.prototype, 'hitboxHeightSize', function() {
      return (this.hitboxHeight / $gameMap.tileHeight()).fix();
    });

    // Gets the top Y position adjusted with the hitbox
    MVC.reader(character.prototype, 'top', function() {
      return (this._y + this.hitboxYSize).fix();
    });

    // Gets the left X position adjusted with the hitbox
    MVC.reader(character.prototype, 'left', function() {
      return (this._x + this.hitboxXSize).fix();
    });

    // Gets the right X position adjusted with the hitbox
    MVC.reader(character.prototype, 'right', function() {
      return (this._x + this.hitboxXSize + this.hitboxWidthSize - insignificantValue).fix();
    });

    // Gets the bottom Y position adjusted with the hitbox
    MVC.reader(character.prototype, 'bottom', function() {
      return (this._y + this.hitboxYSize + this.hitboxHeightSize - insignificantValue).fix();
    });
  };

  var addOrangeMovementToCharacter = function(character) {
    // Adds the hitbox properties to this character
    addPropertiesToCharacter(character);

    // Activates Fractional Movement on this character
    MVC.reader(Game_CharacterBase.prototype, 'enableFractionalMovement', function() {
      return true;
    });

    // Gets the real _x position of the character
    MVC.reader(character.prototype, 'float_x', function() {
      return this._x;
    });

    // Gets the real _y position of the character
    MVC.reader(character.prototype, 'float_y', function() {
      return this._y;
    });

    // Gets the Y position of the character as an approximated integer
    MVC.reader(character.prototype, 'tile_y', function() {
      var diff = this._y - this._y.floor();
      if (diff < 0.5) {
        return this._y.floor();
      } else {
        return this._y.ceil();
      }
    });

    // Gets the X position of the character as an approximated integer
    MVC.reader(character.prototype, 'tile_x', function() {
      var diff = this._x - this._x.floor();
      if (diff < 0.5) {
        return this._x.floor();
      } else {
        return this._x.ceil();
      }
    });

    // MVC.reader(character.prototype, 'x', function() {
    //   return this.tile_x;
    // });

    // MVC.reader(character.prototype, 'y', function() {
    //   return this.tile_y;
    // });

    character.prototype.deltaXFrom = function(x) {
      return $gameMap.deltaX(this._x, x);
    };

    character.prototype.deltaYFrom = function(y) {
      return $gameMap.deltaY(this._y, y);
    };

    // Method that checks if the character can move in a specified direction
    character.prototype.can_go_to = function(x, y, d) {
      switch (d) {
        case Direction.UP:
          return this.can_go_up(x, y);
        case Direction.DOWN:
          return this.can_go_down(x, y);
        case Direction.LEFT:
          return this.can_go_left(x, y);
        case Direction.RIGHT:
          return this.can_go_right(x, y);
        default:
          return false;
      }
    };

    // Method that checks if the character can move up
    character.prototype.can_go_up = function(x, y) {
      // Variables the_x and the_y hold the true position, considering the hitbox configuration
      var the_x = (x + this.hitboxXSize).fix();
      var the_y = (y + this.hitboxYSize).fix();

      // Variable end_x hold the right position, considering the hitbox configuration
      // The script decreases an insignificant value from it to ensure that this position doesn't pass to the next integer value unless the character is actually on the next tile.
      var end_x = (the_x + this.hitboxWidthSize - insignificantValue).fix();

      // destination_y is the top position where the player is moving to, considering the hitbox
      var destination_y = (the_y - $.Param.Step_Size).fix();

      // Run the collission check for every X tile the character is touching
      for (var new_x = the_x.floor(); new_x <= end_x.floor(); new_x++) {
        if (!$gameMap.isPassable(new_x, the_y.floor(), Direction.UP)) {
          return false;
        }

        if (!$gameMap.isPassable(new_x, destination_y.floor(), Direction.DOWN)) {
          return false;
        }
      }

      return true;
    };

    // Method that checks if the character can move down
    character.prototype.can_go_down = function(x, y) {
      // Variables the_x and the_y hold the true position, considering the hitbox configuration
      var the_x = (x + this.hitboxXSize).fix();
      var the_y = (y + this.hitboxYSize).fix();

      // Variables end_x and end_y hold the right and bottom position, considering the hitbox configuration
      // The script decreases an insignificant value from it to ensure that this position doesn't pass to the next integer value unless the character is actually on the next tile.
      var end_x = (the_x + this.hitboxWidthSize - insignificantValue).fix();
      var end_y = (the_y + this.hitboxHeightSize - insignificantValue).fix();

      // destination_y is the top position where the player is moving to, considering the hitbox
      var destination_y = (the_y + $.Param.Step_Size).fix();
      // destination_end_y is the bottom position where the player is moving to, considering the hitbox
      var destination_end_y = (end_y + $.Param.Step_Size).fix();

      // Run the collission check for every X tile the character is touching
      for (var new_x = the_x.floor(); new_x <= end_x.floor(); new_x++) {
        if (!$gameMap.isPassable(new_x, end_y.floor(), Direction.DOWN)) {
          return false;
        }

        if (!$gameMap.isPassable(new_x, destination_end_y.floor(), Direction.UP)) {
          return false;
        }
      }

      return true;
    };

    // Method that checks if the character can move left
    character.prototype.can_go_left = function(x, y) {
      // Variables the_x and the_y hold the true position, considering the hitbox configuration
      var the_x = x + this.hitboxXSize;
      var the_y = y + this.hitboxYSize;

      // Variable end_y hold the bottom position, considering the hitbox configuration
      // The script decreases an insignificant value from it to ensure that this position doesn't pass to the next integer value unless the character is actually on the next tile.
      var end_y = the_y + this.hitboxHeightSize - insignificantValue;

      // destination_x is the left position where the player is moving to, considering the hitbox
      var destination_x = the_x - $.Param.Step_Size;

      // Run the collission check for every Y tile the character is touching
      for (var new_y = the_y.floor(); new_y <= end_y.floor(); new_y++) {
        if (!$gameMap.isPassable(the_x.floor(), new_y, Direction.LEFT)) {
          return false;
        }

        if (!$gameMap.isPassable(destination_x.floor(), new_y, Direction.RIGHT)) {
          return false;
        }
      }

      return true;
    };

    // Method that checks if the character can move right
    character.prototype.can_go_right = function(x, y) {
      // Variables the_x and the_y hold the true position, considering the hitbox configuration
      var the_x = (x + this.hitboxXSize).fix();
      var the_y = (y + this.hitboxYSize).fix();

      // Variables end_x and end_y hold the right and bottom position, considering the hitbox configuration
      // The script decreases an insignificant value from it to ensure that this position doesn't pass to the next integer value unless the character is actually on the next tile.
      var end_x = (the_x + this.hitboxWidthSize - insignificantValue).fix();
      var end_y = (the_y + this.hitboxHeightSize - insignificantValue).fix();

      // destination_x is the left position where the player is moving to, considering the hitbox
      var destination_x = (the_x + $.Param.Step_Size).fix();
      // destination_end_x is the right position where the player is moving to, considering the hitbox
      var destination_end_x = (end_x + $.Param.Step_Size).fix();

      // Run the collission check for every Y tile the character is touching
      for (var new_y = the_y.floor(); new_y <= end_y.floor(); new_y++) {
        if (!$gameMap.isPassable(end_x.floor(), new_y, Direction.RIGHT)) {
          return false;
        }

        if (!$gameMap.isPassable(destination_end_x.floor(), new_y, Direction.LEFT)) {
          return false;
        }
      }

      return true;
    };

    character.prototype.myStepSize = function() {
      return $.Param.Step_Size;
    };

    character.prototype.isTilesetPassable = function(x, y, d) {
      var x2 = $gameMap.roundFractionXWithDirection(x, d, this.myStepSize());
      var y2 = $gameMap.roundFractionYWithDirection(y, d, this.myStepSize());

      if (!$gameMap.isValid(x2, y2)) {
        return false;
      }

      if (this.isThrough() || this.isDebugThrough()) {
        return true;
      }

      if (!this.isMapPassable(x, y, d)) {
        return false;
      }

      if (!this.isMapPassable(x2, y2, this.reverseDir(d))) {
        return false;
      }

      return true;
    };

    // Replaces the original canPass method to consider the step size when getting the new x and Y position
    character.prototype.canPass = function(x, y, d) {
      if (!this.isTilesetPassable(x, y, d)) {
        return false;
      }

      if (this.isThrough() || this.isDebugThrough()) {
        return true;
      }

      var x2 = $gameMap.roundFractionXWithDirection(x, d, this.myStepSize());
      var y2 = $gameMap.roundFractionYWithDirection(y, d, this.myStepSize());

      if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
      }

      return true;
    };

    // Replaces the original canPassDiagonally method to consider the step size when getting the new x and Y position
    character.prototype.canPassDiagonally = function(x, y, horz, vert) {
      var x2 = $gameMap.roundFractionXWithDirection(x, horz, this.myStepSize());
      var y2 = $gameMap.roundFractionYWithDirection(y, vert, this.myStepSize());

      if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
        return true;
      }
      if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
        return true;
      }
      return false;
    };

    // Replaces the original isMapPassable method, changing the way the collision is checked to consider fractional position
    character.prototype.isMapPassable = function(x, y, d) {
      if (Direction.goes_up(d)) {
        if (!this.can_go_up(x, y)) {
          return false;
        }
      } else if (Direction.goes_down(d)) {
        if (!this.can_go_down(x, y)) {
          return false;
        }
      }

      if (Direction.goes_left(d)) {
        if (!this.can_go_left(x, y)) {
          return false;
        }
      } else if (Direction.goes_right(d)) {
        if (!this.can_go_right(x, y)) {
          return false;
        }
      }

      return true;
    };

    character.prototype.isTouchingTile = function(x, y) {
      if (!(x >= this.left.floor() && x <= this.right.floor())) {
        return false;
      }

      if (!(y >= this.top.floor() && y <= this.bottom.floor())) {
        return false;
      }

      return true;
    };

    character.prototype.pos = function(x, y) {
      return this.isTouchingTile(x, y);
      // return this._x === x && this._y === y;
    };

    // Run the callback method for all tiles touched by the character on the informed position
    character.prototype.runForAllPositions = function(x, y, callback) {
      var first_x = (x + this.hitboxXSize).floor();
      var last_x = (x + this.hitboxXSize + this.hitboxWidthSize - insignificantValue).floor();
      var first_y = (y + this.hitboxYSize).floor();
      var last_y = (y + this.hitboxYSize + this.hitboxHeightSize - insignificantValue).floor();

      for (var new_x = first_x; new_x <= last_x; new_x++) {
        for (var new_y = first_y; new_y <= last_y; new_y++) {
          if (callback.call(this, new_x, new_y) === true) {
            return true;
          }
        }
      }

      return false;
    };

    // Replaces the method that checks if the position would collide with an event, because fractional positions should test more than one tile
    character.prototype.isCollidedWithEvents = function(x, y) {
      return this.runForAllPositions(x, y, function(block_x, block_y) {
        //If the player is "inside" it, then this event won't be considered,
        //because if it did, the player would be locked on it
        //this shouldn't be possible on normal conditions.

        if (this.isTouchingTile(block_x, block_y)) {
          return false;
        }

        var events = $gameMap.eventsXyNt(block_x, block_y);
        return events.some(function(event) {
          return event.isNormalPriority();
        });
      });
    };

    character.prototype.isCollidedWithVehicles = function(x, y) {
      return this.runForAllPositions(x, y, function(block_x, block_y) {
        return $gameMap.boat().posNt(block_x, block_y) || $gameMap.ship().posNt(block_x, block_y);
      });
    };

    // Replaces the original moveStraight method, changing the calculation of the new position to consider the step_size
    character.prototype.moveStraight = function(d) {
      this.setMovementSuccess(this.canPass(this._x, this._y, d));

      if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this._x = $gameMap.roundFractionXWithDirection(this._x, d, this.myStepSize());
        this._y = $gameMap.roundFractionYWithDirection(this._y, d, this.myStepSize());
        this._realX = $gameMap.fractionXWithDirection(this._x, this.reverseDir(d), this.myStepSize());
        this._realY = $gameMap.fractionYWithDirection(this._y, this.reverseDir(d), this.myStepSize());

        this.increaseSteps();
      } else {
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
      }
    };

    // Replaces the original moveDiagonally method, changing the calculation of the new position to consider the step_size
    character.prototype.moveDiagonally = function(horz, vert) {
      this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));

      if (this.isMovementSucceeded()) {
        this._x = $gameMap.roundFractionXWithDirection(this._x, horz, this.myStepSize());
        this._y = $gameMap.roundFractionYWithDirection(this._y, vert, this.myStepSize());
        this._realX = $gameMap.fractionXWithDirection(this._x, this.reverseDir(horz), this.myStepSize());
        this._realY = $gameMap.fractionYWithDirection(this._y, this.reverseDir(vert), this.myStepSize());
        this.increaseSteps();
      }

      if (this._direction === this.reverseDir(horz)) {
        this.setDirection(horz);
      }
      if (this._direction === this.reverseDir(vert)) {
        this.setDirection(vert);
      }
    };
  };

  addOrangeMovementToCharacter(Game_Player);
  addOrangeMovementToCharacter(Game_Follower);

  var oldGamePlayer_moveStraight = Game_Player.prototype.moveStraight;
  var oldGamePlayer_moveDiagonally = Game_Player.prototype.moveDiagonally;

  Game_Player.prototype.moveStraight = function(d) {
    if (this.isMovementSucceeded()) {
      this._followers.updateMove();
    }

    oldGamePlayer_moveStraight.call(this, d);
  };

  Game_Player.prototype.moveDiagonally = function(horz, vert) {
    if (this.isMovementSucceeded()) {
      this._followers.updateMove();
    }

    oldGamePlayer_moveDiagonally.call(this, horz, vert);
  };

  // This method adds or subtracts the step_size to an X position, based on the direction
  Game_Map.prototype.fractionXWithDirection = function(x, d) {
    if (Direction.goes_left(d)) {
      return x - $.Param.Step_Size;
    } else if (Direction.goes_right(d)) {
      return x + $.Param.Step_Size;
    } else {
      return x;
    }
  };

  // This method adds or subtracts the step_size to a Y position, based on the direction
  Game_Map.prototype.fractionYWithDirection = function(y, d) {
    if (Direction.goes_down(d)) {
      return y + $.Param.Step_Size;
    } else if (Direction.goes_up(d)) {
      return y - $.Param.Step_Size;
    } else {
      return y;
    }
  };

  // When using horizontally looped maps, this method gets the real X position
  Game_Map.prototype.roundFractionXWithDirection = function(x, d) {
    return this.roundX(this.fractionXWithDirection(x, d));
  };

  // When using vertically looped maps, this method gets the real Y position
  Game_Map.prototype.roundFractionYWithDirection = function(y, d) {
    return this.roundY(this.fractionYWithDirection(y, d));
  };

  // Create two methods that can be overriden by add-ons
  Game_Player.prototype.onBeforeMove = Game_Player.prototype.onBeforeMove || function() {};
  Game_Player.prototype.trySavingFailedMovement = Game_Player.prototype.trySavingFailedMovement || function(direction) {
    return false;
  };

  // Replaces the old startMapEvent method to check for events on all tiles touched by the player
  // Calls the original method inside a loop, unless BlockRepeatedTouchEvents or IgnoreEmptyEvents is true
  var oldGamePlayer_startMapEvent = Game_Player.prototype.startMapEvent;
  Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if ($gameMap.isEventRunning()) {
      return;
    }

    this.runForAllPositions(x, y, function(block_x, block_y) {
      // unless it is configured to run all available events, quit the loop if there's an event running
      if (!$.Param.TriggerAllAvailableEvents) {
        if ($gameMap.isEventRunning()) {
          return;
        }
      }

      if ($.Param.BlockRepeatedTouchEvents === true || $.Param.IgnoreEmptyEvents === true) {
        this.doActualStartMapEvent(block_x, block_y, triggers, normal);
      } else {
        oldGamePlayer_startMapEvent.call(this, block_x, block_y, triggers, normal);
      }
    });

  };

  // New method, replaces the original startMapEvent code when BlockRepeatedTouchEvents or IgnoreEmptyEvents is true
  Game_Player.prototype.doActualStartMapEvent = function(x, y, triggers, normal) {
    if ($.isTileChecked(x, y)) {
      return;
    }

    $gameMap.eventsXy(x, y).forEach(function(event) {
      if (!event._erased) {
        if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal && event.hasAnythingToRun()) {
          if ($.Param.BlockRepeatedTouchEvents === true && event.isTriggerIn([1, 2])) {
            $.markTileAsChecked(event.x, event.y);
          }

          event.start();
        }
      }
    });
  };

  Game_Event.prototype.hasAnythingToRun = function() {
    if ($.Param.IgnoreEmptyEvents !== true) {
      return true;
    }

    for (var idx in this.list()) {
      var command = this.list()[idx];

      // Comments
      if (command.code == 108 || command.code == 408) {
        continue;
      }

      // Label
      if (command.code == 118) {
        continue;
      }

      // End of List
      if (Number(command.code) === 0) {
        continue;
      }

      return true;
    }

    return false;
  };

  $.isTileChecked = function(x, y) {
    return $._checkedTiles.some(function(tile) {
      if (tile.x != x) {
        return false;
      }

      if (tile.y != y) {
        return false;
      }

      return true;
    });
  };

  $.markTileAsChecked = function(x, y) {
    $._checkedTiles.push({
      x: x,
      y: y
    });
  };

  $.clearCheckedTiles = function() {
    var newList = [];

    $._checkedTiles.forEach(function(tile) {
      if ($gamePlayer.isTouchingTile(tile.x, tile.y)) {
        newList.push(tile);
      }
    });

    $._checkedTiles = newList;
  };

  // Small trick used so the game doesn't abuse of the pathfinding script
  Game_Player.prototype.determineDirectionToDestination = function() {
    var x = $gameTemp.destinationX();
    var y = $gameTemp.destinationY();

    if ($.Param.DisablePixelMovementForMouseRoutes !== false) {
      var horzDirection = undefined;
      var vertDirection = undefined;

      if (this._x.floor() < this._x) {
        if (this.direction() == Direction.LEFT || this.direction() == Direction.RIGHT) {
          horzDirection = this.direction();
        } else {
          if (this._x.floor() - x >= 1) {
            horzDirection = Direction.LEFT;
          } else if (x - this._x.floor() >= 1) {
            horzDirection = Direction.RIGHT;
          }
        }
      }

      if (this._y.floor() < this._y) {
        if (this.direction() == Direction.UP || this.direction() == Direction.DOWN) {
          vertDirection = this.direction();
        } else {
          if (this._y.floor() - y >= 1) {
            vertDirection = Direction.UP;
          } else if (y - this._y.floor() >= 1) {
            vertDirection = Direction.DOWN;
          }
        }
      }

      if (horzDirection !== undefined && vertDirection !== undefined) {
        return Direction.join_directions(horzDirection, vertDirection);
      }

      if (horzDirection !== undefined) {
        return horzDirection;
      }

      if (vertDirection !== undefined) {
        return vertDirection;
      }
    }

    return this.findDirectionTo(x, y);
  };

  // If the player is holding two direction buttons, Input.dir4 will give you one of them and this method will give you the other one
  Game_Player.prototype.getAlternativeDirection = function(direction, diagonal_d) {
    if (direction != diagonal_d) {
      switch (diagonal_d) {
        case Direction.UP_LEFT:
          return direction == Direction.UP ? Direction.LEFT : Direction.UP;
        case Direction.UP_RIGHT:
          return direction == Direction.UP ? Direction.RIGHT : Direction.UP;
        case Direction.DOWN_LEFT:
          return direction == Direction.DOWN ? Direction.LEFT : Direction.DOWN;
        case Direction.DOWN_RIGHT:
          return direction == Direction.DOWN ? Direction.RIGHT : Direction.DOWN;
        default:
          break;
      }
    }

    return direction;
  };

  // Replaces the moveByInput method to add all of the plugins functionality
  Game_Player.prototype.moveByInput = function() {
    if (this.isMoving() || !this.canMove()) {
      return;
    }

    var button = 'down';
    var direction = Input.dir4;
    var diagonal_d = Input.dir8;
    var alternative_d = direction;

    // If there's a directional button pressed, clear the mouse destination
    if (direction > 0) {
      $gameTemp.clearDestination();
    }
    // If there's a valid mouse destination, pick the direction from it
    else if ($gameTemp.isDestinationValid()) {
      direction = this.determineDirectionToDestination();

      diagonal_d = direction;
    }

    // If the player is pressing two direction buttons and the direction picked by dir4 is unavailable, try the other non-diagonal direction
    alternative_d = this.getAlternativeDirection(direction, diagonal_d);
    button = Direction.get_button_name(direction, button);

    $.clearCheckedTiles();

    if (direction === 0) {
      return;
    }

    if (this.canPass(this._x, this._y, direction) || this.canPass(this._x, this._y, alternative_d)) {
      this.onBeforeMove();

      // If diagonal movement is active, try it first
      if ($.Param.Diagonal_Movement) {
        this.executeMove(diagonal_d);
        if (this.isMovementSucceeded()) {
          return;
        }
      }

      this.executeMove(direction);

      if (!this.isMovementSucceeded()) {
        this.executeMove(alternative_d);
      }
    } else {
      // If the movement failed, call this method to let add-ons try too
      if (this.trySavingFailedMovement(direction)) {
        return;
      }

      if (this._direction != direction) {
        this.setDirection(direction);
        this.checkEventTriggerTouchFront();
      }
    }
  };

  Game_Player.prototype.executeMove = function(direction) {
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      case Direction.LEFT:
      case Direction.RIGHT:
        this.moveStraight(direction);
        break;

      case Direction.UP_LEFT:
        this.moveDiagonally(Direction.LEFT, Direction.UP);
        break;
      case Direction.UP_RIGHT:
        this.moveDiagonally(Direction.RIGHT, Direction.UP);
        break;
      case Direction.DOWN_LEFT:
        this.moveDiagonally(Direction.LEFT, Direction.DOWN);
        break;
      case Direction.DOWN_RIGHT:
        this.moveDiagonally(Direction.RIGHT, Direction.DOWN);
        break;

      default:
        break;
    }
  };

  // Replaces checkEventTriggerThere to work with pixel movement
  Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
      var direction = this.direction();
      var x1 = this._x;
      var y1 = this._y;
      var x2 = $gameMap.roundFractionXWithDirection(x1, direction);
      var y2 = $gameMap.roundFractionYWithDirection(y1, direction);
      this.startMapEvent(x2, y2, triggers, true);
      if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
        var x3 = $gameMap.roundFractionXWithDirection(x2, direction);
        var y3 = $gameMap.roundFractionYWithDirection(y2, direction);
        this.startMapEvent(x3, y3, triggers, true);
      }
    }
  };


  // ------------------------------------------------
  // With Great Movement, comes Great Responsibility
  // ------------------------------------------------

  // Changes the logic used to turn towards the player, because the old one didn't work well with pixel movement
  Game_Character.prototype.turnTowardPlayer = function() {
    var sx = this.deltaXFrom($gamePlayer.float_x);
    var sy = this.deltaYFrom($gamePlayer.float_y);

    if (sx.abs() < 1 && sy.abs() < 1) {
      this.setDirection(10 - $gamePlayer.direction);
    } else {
      if (sx.abs() > sy.abs()) {
        this.setDirection(sx > 0 ? 4 : 6);
      } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
      }
    }
  };

  // Changes the logic used to turn away from the player, because the old one didn't work well with pixel movement
  Game_Character.prototype.turnAwayFromPlayer = function() {
    var sx = this.deltaXFrom($gamePlayer.float_x);
    var sy = this.deltaYFrom($gamePlayer.float_y);

    if (sx.abs() < 1 && sy.abs() < 1) {
      this.setDirection($gamePlayer.direction);
    } else {
      if (sx.abs() > sy.abs()) {
        this.setDirection(sx > 0 ? 7 : 4);
      } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 2 : 8);
      }
    }
  };

  // Changes the logic used to chase characters, because the old one didn't work well with pixel movement
  // Also adds the FollowersDistance param.
  Game_Follower.prototype.chaseCharacter = function(character) {
    if (!this.isMoving()) {
      var ideal_x = character.float_x;
      var ideal_y = character.float_y;

      switch (character.direction()) {
        case Direction.DOWN:
          ideal_y -= $.Param.FollowersDistance;
          break;
        case Direction.LEFT:
          ideal_x += $.Param.FollowersDistance;
          break;
        case Direction.RIGHT:
          ideal_x -= $.Param.FollowersDistance;
          break;
        case Direction.UP:
          ideal_y += $.Param.FollowersDistance;
          break;
        default:
          break;
      }

      var sx = this.deltaXFrom(ideal_x);
      var sy = this.deltaYFrom(ideal_y);

      if (sx.abs() >= $.Param.Step_Size && sy.abs() >= $.Param.Step_Size) {
        this.moveDiagonally(sx > 0 ? Direction.LEFT : Direction.RIGHT, sy > 0 ? Direction.UP : Direction.DOWN);
      } else if (sx.abs() >= $.Param.Step_Size) {
        this.moveStraight(sx > 0 ? Direction.LEFT : Direction.RIGHT);
      } else if (sy.abs() >= $.Param.Step_Size) {
        this.moveStraight(sy > 0 ? Direction.UP : Direction.DOWN);
      }

      this.setMoveSpeed($gamePlayer.realMoveSpeed());
    }
  };


  if ($.Param.BlockRepeatedTouchEvents === true) {
    // Overrides command201 to pick the tile where the player was teleported to and add it to the list of tiles that shouldn't trigger events until the player leaves it.
    var oldGameInterpreter_command201 = Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201 = function() {
      oldGameInterpreter_command201.call(this);

      if ($gameParty.inBattle()) {
        return;
      }

      $.clearCheckedTiles();

      if (!$.Param.TriggerTouchEventsAfterTeleport) {
        $.markTileAsChecked($gamePlayer.x, $gamePlayer.y);
      }
    };
  }
})(SuperOrangeMovement);

PluginManager.register("SuperOrangeMovement", "1.0.0", "Movement Improvements (Diagonal Movement and Pixel Movement with several settings), ", {
  email: "plugins@hudell.com",
  name: "Hudell",
  website: "http://www.hudell.com"
}, "2015-10-21");
