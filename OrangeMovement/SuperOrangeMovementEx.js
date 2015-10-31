/*=============================================================================
 * Orange - Super Movement
 * By Hudell - www.hudell.com
 * SuperOrangeMovementEx.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Movement Improvements: Diagonal Movement, Pixel Movement, Actor Hitbox Changer.
 *
 * @param Tile_Sections
 * @desc How many pieces do you want to break the tiles into?
 * @default 4
 *
 * @param Diagonal_Movement
 * @desc Enable Diagonal Movement?
 * @default true
 *
 * @param FollowersDistance
 * @desc What's the distance (in tiles) that each party member should keep from the next one?
 * @default 0.5
 *
 * @param TriggerAllAvailableEvents
 * @desc If true, the game may trigger multiple events when you press a button if there are more than one event in front of you.
 * @default false
 *
 * @param TriggerTouchEventsAfterTeleport
 * @desc Check the plugin help for detailed explanation
 * @default false
 *
 * @param BlockRepeatedTouchEvents
 * @desc If false, any touch triggered event will be executed after every step that the player takes inside that tile.
 * @default true
 *
 * @param IgnoreEmptyEvents
 * @desc If true, the game won't try to trigger events that have no commands
 * @default true
 *
 * @param DisablePixelMovementForMouseRoutes
 * @desc CAUTION: Check the plugin help for info on disabling this
 * @default true
 *
 * @param EnableAutoAvoid
 * @desc Set this to false to disable the AutoAvoid feature
 * @default true
 *
 * @param AutoAvoid_AvoidEvents
 * @desc Set this to true if you want the player to avoid events.
 * @default false
 *
 * @param AutoAvoid_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AutoAvoid_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_MaxOffset
 * @desc The max distance (in tiles) that the character is allowed to walk in a different direction to avoid an obstacle. 
 * @default 0.75
 *
 * @param AutoAvoid_RetainDirection
 * @desc If true, the character won't face the other direction when walking around an object.
 * @default true
 *
 * @param EnableAutoAvoidDiagonal
 * @desc Set this to false to disable the AutoAvoid diagonally feature
 * @default true
 *
 * @param AvDiagonal_AvoidEvents
 * @desc Set this to false if you don't want the player to avoid events.
 * @default true
 *
 * @param AvDiagonal_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AvDiagonal_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AvDiagonal_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 *
 *
 * @author Hudell
 *
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * Get the latest version of this script on
 * http://link.hudell.com/super-orange-movement
 * 
 * ============================================================================
 * Params
 * ============================================================================
 * 
 * TriggerTouchEventsAfterTeleport: 
 * If you're using pixel movement and you teleport the player
 * to a tile with a touch triggered event, that event will be
 * triggered on the first step the player takes.
 * If you want that to happen, change this to true.
 *
 *
 * DisablePixelMovementForMouseRoutes:
 * If true, the pixel movement will be disabled when you assign a
 * fixed move route to the player;
 * ATTENTION:
 * If you turn this to false, the player character may get stuck when
 * controlled with a mouse
 
 * 
 *=============================================================================*/
/*:pt
 * @plugindesc Melhorias no movimento: Movimentação Diagonal, Movimentação por Pixel, Mudança na caixa de colisão dos personagens.
 *
 * @param Tile_Sections
 * @desc Em quantos pedaços os tiles deverão ser quebrados?
 * @default 4
 *
 * @param Diagonal_Movement
 * @desc Habilitar movimentação diagonal?
 * @default true
 *
 * @param FollowersDistance
 * @desc Qual a distância (em tiles) que cada membro do grupo deve manter um do outro?
 * @default 0.5
 *
 * @param TriggerAllAvailableEvents
 * @desc Se false, o jogo impedirá que mais de um evento seja disparado quando você pressionar Enter na frente de dois eventos
 * @default false
 *
 * @param TriggerTouchEventsAfterTeleport
 * @desc Clique no botão ajuda do plugin para uma explicação detalhada
 * @default false
 *
 * @param BlockRepeatedTouchEvents
 * @desc Se false, qualquer evento touch será executado depois de cada passo do jogador. Se true, apenas ao entrar no tile.
 * @default true
 *
 * @param IgnoreEmptyEvents
 * @desc Se true, o jogo não tentará disparar eventos que não possuem comandos, pulando para o próximo evento disponível
 * @default true
 *
 * @param DisablePixelMovementForMouseRoutes
 * @desc CUIDADO: Clique no botão ajuda para mais informações sobre este parametro
 * @default true
 *
 * @param EnableAutoAvoid
 * @desc Set this to false to disable the AutoAvoid feature
 * @default true
 *
 * @param AutoAvoid_AvoidEvents
 * @desc Set this to true if you want the player to avoid events.
 * @default false
 *
 * @param AutoAvoid_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AutoAvoid_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_MaxOffset
 * @desc The max distance (in tiles) that the character is allowed to walk in a different direction to avoid an obstacle. 
 * @default 0.75
 *
 * @param AutoAvoid_RetainDirection
 * @desc If true, the character won't face the other direction when walking around an object.
 * @default true
 *
 * @param EnableAutoAvoidDiagonal
 * @desc Set this to false to disable the AutoAvoid diagonally feature
 * @default true
 *
 * @param AvDiagonal_AvoidEvents
 * @desc Set this to false if you don't want the player to avoid events.
 * @default true
 *
 * @param AvDiagonal_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AvDiagonal_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AvDiagonal_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 * @author Hudell
 *
 *
 * @help
 * ============================================================================
 * Última Versão
 * ============================================================================
 * Baixe a última versão do script em 
 * http://link.hudell.com/super-orange-movement
 * 
 * ============================================================================
 * Parametros
 * ============================================================================
 * 
 * TriggerTouchEventsAfterTeleport: 
 * Se você estiver usando movimentação por pixel e teletransportar o jogador
 * para um tile onde há um evento touch, o evento será
 * disparado no primeiro passo que o jogador der.
 * Se você quer que isso aconteça, mude isto para true.
 *
 *
 * DisablePixelMovementForMouseRoutes:
 * Se true, a movimentação por pixel será desativada quando você usa uma
 * rota de movimento ou clica em algum ponto do mapa com o mouse.
 * ATENÇÃO:
 * Se você mudar isto para false, o personagem do jogador poderá ficar preso
 * quando controlado com o mouse.
 
 * 
 *=============================================================================*/
/*:fr
 * @plugindesc Amélioration des déplacements : déplacement en diagonale, déplacement au pixel près et adaptation de la hitbox du personnage
 *
 * @param Tile_Sections
 * @desc En combien de sous-divisions voulez-vous diviser un tile ?
 * @default 4
 *
 * @param Diagonal_Movement
 * @desc Autoriser le mouvement en diagonale ?
 * @default true
 *
 * @param FollowersDistance
 * @desc Quelle est la distance (en tiles) que doivent conserver chaque personnage du groupe entre eux ? (mode chenille)
 * @default 0.5
 *
 * @param TriggerAllAvailableEvents
 * @desc Si true, le jeu pourra déclencher plusieurs événements quand vous appuyez sur une touche s'il y a plus d'un événement en face de vous.
 * @default false
 *
 * @param TriggerTouchEventsAfterTeleport
 * @desc Voir la section Aide du plugin pour les explications détaillées.
 * @default false
 *
 * @param BlockRepeatedTouchEvents
 * @desc Si false, tout événement activé par l'appui d'une touche sera activé après chaque pas que le personnage fera sur le tile de l'événement.
 * @default true
 *
 * @param IgnoreEmptyEvents
 * @desc Si true, le jeu n'essaiera pas de déclencher les événements qui n'ont pas de commandes.
 * @default true
 *
 * @param DisablePixelMovementForMouseRoutes
 * @desc ATTENTION ! Lire attentivement la section Aide avant de désactiver cette option (désactiver = false).
 * @default true
 *
 * @param EnableAutoAvoid
 * @desc Set this to false to disable the AutoAvoid feature
 * @default true
 *
 * @param AutoAvoid_AvoidEvents
 * @desc Set this to true if you want the player to avoid events.
 * @default false
 *
 * @param AutoAvoid_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AutoAvoid_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 *
 * @param AutoAvoid_MaxOffset
 * @desc The max distance (in tiles) that the character is allowed to walk in a different direction to avoid an obstacle. 
 * @default 0.75
 *
 * @param AutoAvoid_RetainDirection
 * @desc If true, the character won't face the other direction when walking around an object.
 * @default true
 *
 * @param EnableAutoAvoidDiagonal
 * @desc Set this to false to disable the AutoAvoid Diagonally feature
 * @default true
 *
 * @param AvDiagonal_AvoidEvents
 * @desc Set this to false if you don't want the player to avoid events.
 * @default true
 *
 * @param AvDiagonal_OnlyWhenDashing
 * @desc Set this to true to only avoid obstacles when the player is dashing.
 * @default false
 *
 * @param AvDiagonal_DashingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when dashing. Set this to a number of frames.
 * @default 0
 *
 * @param AvDiagonal_WalkingDelay
 * @desc Makes the character wait a little before trying to avoid an obstacle when walking. Set this to a number of frames.
 * @default 0
 *
 * @author Hudell
 *
 *
 * @help
 * ============================================================================
 * Dernière version
 * ============================================================================
 * Récupérez la dernière version du plugin sur :
 * http://link.hudell.com/super-orange-movement
 * 
 * ============================================================================
 * Explications détaillées des paramètres
 * ============================================================================
 * 
 * TriggerTouchEventsAfterTeleport : 
 * Si vous utilisez le mouvement au pixel près et que vous téléportez le personnage
 * sur un tile contenant un événement activé par appui sur une touche,
 * cet événement sera déclenché au premier pas que le personnage fera.
 * Si vous voulez que le plugin autorise cela, changez ceci pour true.
 *
 *
 * DisablePixelMovementForMouseRoutes :
 * Si true, le mouvement au pixel près sera désactivé quand
 * vous assignerez une route prédéfinie au peersonnage.
 * ATTENTION :
 * En revanche, si vous changez ceci pour false, le personnage
 * pourra resté bloqué quand il sera contrôlé à la souris.
 * 
 *=============================================================================*/

var Imported = Imported || {};

if (Imported["SuperOrangeMovement"]) {
  if (Utils.isOptionValid('test')) {
    alert("You've got both SuperOrangeMovement and SuperOrangeMovementEx on the same project. SuperOrangeMovementEx will be ignored.");
  }
  
  throw new Error("You've got both SuperOrangeMovement and SuperOrangeMovementEx on the same project. SuperOrangeMovementEx will be ignored.");
}

if (Imported['MVCommons'] === undefined) {
  var MVC = {};

  (function($) {
    $.defaultGetter = function(name) {return function() {return this['_' + name];};};
    $.defaultSetter = function(name) {return function(value) {var prop = '_' + name;if ((!this[prop]) || this[prop] !== value) {this[prop] = value;if (this._refresh) {this._refresh();}}};};
    $.accessor = function(value, name /* , setter, getter */ ) {Object.defineProperty(value, name, {get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name),set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name),configurable: true});};
    $.reader = function(obj, name /*, getter */ ) {Object.defineProperty(obj, name, {get: arguments.length > 2 ? arguments[2] : defaultGetter(name),configurable: true});};
    $.getProp = function(meta, propName) {if (meta === undefined) return undefined;if (meta[propName] !== undefined) return meta[propName];for (var key in meta) {if (key.toLowerCase() == propName.toLowerCase()) {return meta[key];}}return undefined;};
  })(MVC);

  Number.prototype.fix = function() {return (parseFloat(this.toPrecision(12)));};
  Number.prototype.floor = function() {return Math.floor(this.fix());};
  Number.prototype.ceil = function() {return Math.ceil(this.fix());};
  Number.prototype.abs = function() {return Math.abs(this);};

  if (Utils.isOptionValid('test')) {
    console.log('MVC not found, SuperOrangeMovementEx will be using essentials (copied from MVC 1.2.1).');
  }
}

var SuperOrangeMovementEx = SuperOrangeMovementEx || {};
SuperOrangeMovementEx.VERSION = 0.1;

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

  $.Parameters = PluginManager.parameters('SuperOrangeMovementEx');
  $.Param = $.Param || {};

  $.Param.Tile_Sections = Number($.Parameters["Tile_Sections"] || 4);
  $.Param.Diagonal_Movement = $.Parameters["Diagonal_Movement"] !== "false";
  $.Param.IgnoreEmptyEvents = $.Parameters["IgnoreEmptyEvents"] !== "false";
  $.Param.DisablePixelMovementForMouseRoutes = $.Parameters["DisablePixelMovementForMouseRoutes"] !== "false";
  $.Param.BlockRepeatedTouchEvents = $.Parameters["BlockRepeatedTouchEvents"] !== "false";
  $.Param.FollowersDistance = Number($.Parameters["FollowersDistance"] || 0.5);
  $.Param.TriggerAllAvailableEvents = $.Parameters["TriggerAllAvailableEvents"] === "true";
  $.Param.TriggerTouchEventsAfterTeleport = $.Parameters["TriggerTouchEventsAfterTeleport"] === "true";

  $.Param.EnableAutoAvoidDiagonal = $.Parameters["EnableAutoAvoidDiagonal"] !== "false";
  $.Param.AvDiagonal_AvoidEvents = $.Parameters["AvDiagonal_AvoidEvents"] !== "false";
  $.Param.AvDiagonal_OnlyWhenDashing = $.Parameters["AvDiagonal_OnlyWhenDashing"] === "true";
  $.Param.AvDiagonal_DashingDelay = Number($.Parameters["AvDiagonal_DashingDelay"] || 0);
  $.Param.AvDiagonal_WalkingDelay = Number($.Parameters["AvDiagonal_WalkingDelay"] || 0);

  $.Param.EnableAutoAvoid = $.Parameters["EnableAutoAvoid"] !== "false";
  $.Param.AutoAvoid_AvoidEvents = $.Parameters["AutoAvoid_AvoidEvents"] === "true";
  $.Param.AutoAvoid_OnlyWhenDashing = $.Parameters["AutoAvoid_OnlyWhenDashing"] === "true";
  $.Param.AutoAvoid_DashingDelay = Number($.Parameters["AutoAvoid_DashingDelay"] || 0);
  $.Param.AutoAvoid_WalkingDelay = Number($.Parameters["AutoAvoid_WalkingDelay"] || 0);
  $.Param.AutoAvoid_MaxOffset = Number($.Parameters["AutoAvoid_MaxOffset"] || 0.75);
  $.Param.AutoAvoid_RetainDirection = $.Parameters["AutoAvoid_RetainDirection"] !== "false";


  if ($.Param.Tile_Sections === undefined || parseInt($.Param.Tile_Sections, 10) <= 0) {
    throw new Error("SuperOrangeMovementEx: The Tile_Sections param is invalid.");
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
      return $gameActors.actor($gameParty._actors[0]);
    } else {
      return undefined;
    }
  };

  Game_Vehicle.prototype.actor = function() {
    return undefined;
  };

  Game_Vehicle.prototype.check_vehicle_passage = function(x, y) {
    if (this.isBoat()) {
      return $gameMap.isBoatPassable(x, y);
    }

    if (this.isShip()) {
      return $gameMap.isShipPassable(x, y);
    }

    return this.isAirship();
  };

  Game_Vehicle.prototype.isLandOk = function(x, y, d) {
    if (this.isAirship()) {
      if (!$gameMap.isAirshipLandOk(x, y)) {
        return false;
      }
      if ($gameMap.eventsXy(x, y).length > 0) {
        return false;
      }
    } else {
      var x2 = $gameMap.roundXWithDirection(x.floor(), d);
      var y2 = $gameMap.roundYWithDirection(y.floor(), d);

      if (!$gameMap.isValid(x2, y2)) {
        return false;
      }

      if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
        return false;
      }

      if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
      }
    }
    return true;
  };

  var addPropertiesToCharacter = function(character) {

    // X position of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxX', function(value) {
      this._hitboxX = value;
      this._canClearHitboxX = false;
    }, function() {
      if (this._hitboxX === undefined) {
        var actor = this.actor();
        if (actor !== undefined) {
          var size = MVC.getProp(actor.actor().meta, 'hitboxX');
          if (size !== undefined) {
            size = parseInt(size, 10);
          }

          if (typeof(size) == "number") {
            this._hitboxX = size;
          } else {
            this._hitboxX = 0;
          }

          this._canClearHitboxX = true;
        } else {
          this._hitboxX = 0;
          this._canClearHitboxX = false;
        }
      }

      return this._hitboxX;
    });

    // Y position of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxY', function(value) {
      this._hitboxY = value;
      this._canClearHitboxY = false;
    }, function() {
      if (this._hitboxY === undefined) {
        var actor = this.actor();
        if (actor !== undefined) {
          var size = MVC.getProp(actor.actor().meta, 'hitboxY');
          if (size !== undefined) {
            size = parseInt(size, 10);
          }

          if (typeof(size) == "number") {
            this._hitboxY = size;
          } else {
            this._hitboxY = 0;
          }

          this._canClearHitboxY = true;
        } else {
          this._hitboxY = 0;
          this._canClearHitboxY = false;
        }
      }

      return this._hitboxY;
    });

    // Width of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxWidth', function(value) {
      this._hitboxWidth = value;
      this._canClearHitboxWidth = false;
    }, function() {
      if (this._hitboxWidth === undefined) {
        var actor = this.actor();
        if (actor !== undefined) {
          var size = MVC.getProp(actor.actor().meta, 'hitboxWidth');
          if (size !== undefined) {
            size = parseInt(size, 10);
          }

          if (typeof(size) == "number") {
            this._hitboxWidth = size;
          } else {
            this._hitboxWidth = $gameMap.tileWidth();
          }

          this._canClearHitboxWidth = true;
        } else {
          this._hitboxWidth = $gameMap.tileWidth();
          this._canClearHitboxWidth = false;
        }
      }

      return this._hitboxWidth;
    });

    // Height of the character hitbox (in pixels)
    MVC.accessor(character.prototype, 'hitboxHeight', function(value) {
      this._hitboxHeight = value;
      this._canClearHitboxHeight = false;
    }, function() {
      if (this._hitboxHeight === undefined) {
        var actor = this.actor();
        if (actor !== undefined) {
          var size = MVC.getProp(actor.actor().meta, 'hitboxHeight');
          if (size !== undefined) {
            size = parseInt(size, 10);
          }

          if (typeof(size) == "number") {
            this._hitboxHeight = size;
          } else {
            this._hitboxHeight = $gameMap.tileHeight();
          }

          this._canClearHitboxHeight = true;
        } else {
          this._hitboxHeight = $gameMap.tileHeight();
          this._canClearHitboxHeight = false;
        }
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

    character.prototype.check_up_passage = function(new_x, the_y, destination_y) {
      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();
        if (vehicle !== undefined && vehicle !== null) {
          return vehicle.check_vehicle_passage(new_x, the_y.floor()) && vehicle.check_vehicle_passage(new_x, destination_y.floor());
        }
      }

      if (!$gameMap.isPassable(new_x, the_y.floor(), Direction.UP)) {
        return false;
      }

      if (!$gameMap.isPassable(new_x, destination_y.floor(), Direction.DOWN)) {
        return false;
      }

      return null;
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
        if (this.check_up_passage(new_x, the_y, destination_y) === false) {
          return false;
        }
      }

      return true;
    };

    character.prototype.check_down_passage = function(new_x, end_y, destination_end_y) {
      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();
        if (vehicle !== undefined && vehicle !== null) {
          return vehicle.check_vehicle_passage(new_x, end_y.floor()) && vehicle.check_vehicle_passage(new_x, destination_end_y.floor());
        }
      }

      if (!$gameMap.isPassable(new_x, end_y.floor(), Direction.DOWN)) {
        return false;
      }

      if (!$gameMap.isPassable(new_x, destination_end_y.floor(), Direction.UP)) {
        return false;
      }

      return null;
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
        if (this.check_down_passage(new_x, end_y, destination_end_y) === false) {
          return false;
        }
      }

      return true;
    };

    character.prototype.check_left_passage = function(the_x, new_y, destination_x) {
      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();
        if (vehicle !== undefined && vehicle !== null) {
          return vehicle.check_vehicle_passage(the_x.floor(), new_y) && vehicle.check_vehicle_passage(destination_x.floor(), new_y);
        }
      }

      if (!$gameMap.isPassable(the_x.floor(), new_y, Direction.LEFT)) {
        return false;
      }

      if (!$gameMap.isPassable(destination_x.floor(), new_y, Direction.RIGHT)) {
        return false;
      }

      return null;
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
        if (this.check_left_passage(the_x, new_y, destination_x) === false) {
          return false;
        }
      }

      return true;
    };

    character.prototype.check_right_passage = function(end_x, new_y, destination_end_x) {
      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();
        if (vehicle !== undefined && vehicle !== null) {
          return vehicle.check_vehicle_passage(end_x.floor(), new_y) && vehicle.check_vehicle_passage(destination_end_x.floor(), new_y);
        }
      }

      if (!$gameMap.isPassable(end_x.floor(), new_y, Direction.RIGHT)) {
        return false;
      }

      if (!$gameMap.isPassable(destination_end_x.floor(), new_y, Direction.LEFT)) {
        return false;
      }

      return null;
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
        if (this.check_right_passage(end_x, new_y, destination_end_x) === false) {
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

      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();

        if (vehicle !== undefined && vehicle !== null) {
          return true;
        }
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
      if (this instanceof Game_Player) {
        var vehicle = this.vehicle();
        if (vehicle !== undefined || vehicle !== null) {
          return false;
        }
      }

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
  addOrangeMovementToCharacter(Game_Vehicle);

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

  Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()) {
      var direction = this.direction();
      var x1 = this.x;
      var y1 = this.y;
      var x2 = $gameMap.roundFractionXWithDirection(x1, direction);
      var y2 = $gameMap.roundFractionYWithDirection(y1, direction);
      var x3 = $gameMap.roundFractionXWithDirection(x2, direction);
      var y3 = $gameMap.roundFractionYWithDirection(y2, direction);
      var destX = $gameTemp.destinationX();
      var destY = $gameTemp.destinationY();

      if ((x1.floor() === destX || x1.ceil() === destX) && (y1.floor() === destY || y1.ceil() === destY)) {
        return this.triggerTouchActionD1(x1, y1);
      } else if ((x2.floor() === destX || x2.ceil() === destX) && (y2.floor() === destY || y2.ceil() === destY)) {
        return this.triggerTouchActionD2(x2, y2);
      } else if ((x3.floor() === destX || x3.ceil() === destX) && (y3.floor() === destY || y3.ceil() === destY)) {
        return this.triggerTouchActionD3(x2, y2);
      }
    }
    return false;
  };

  Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    for (var i = 0; i < $.Param.Tile_Sections; i++) {
      this.moveForward();
    }
    this.setThrough(false);
  };

  Game_Map.prototype.isAirshipLandOk = function(x, y) {
    var first_x = x.floor();
    var last_x = x.ceil();
    var first_y = y.floor();
    var last_y = y.ceil();

    for (var new_x = first_x; new_x <= last_x; new_x++) {
      for (var new_y = first_y; new_y <= last_y; new_y++) {
        if (!this.checkPassage(new_x, new_y, 0x800) || !this.checkPassage(new_x, new_y, 0x0f)) {
          return false;
        }
      }
    }

    return true;
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

  Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x.ceil() < this.width() && y >= 0 && y.ceil() < this.height();
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

    if (this.canPass(this._x, this._y, direction) || (direction != alternative_d && this.canPass(this._x, this._y, alternative_d))) {
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

  // alias the updateNonmoving method from the Game_Player class to check
  // if there's any event to trigger
  var oldGamePlayer_updateNonmoving = Game_Player.prototype.updateNonmoving;
  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    oldGamePlayer_updateNonmoving.call(this, wasMoving);

    // If the player was moving or it's pressing an arrow key
    if (wasMoving || Input.dir4 !== 0) {
      // Doesn't trigger anything if there's already something running
      if (!$gameMap.isEventRunning()) {
        this.checkEventTriggerThere([1, 2]);

        // Setups the starting event if there's any.
        if ($gameMap.setupStartingEvent()) {
          return;
        }
      }
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
  
  if ($.Param.EnableAutoAvoidDiagonal) {
    var avoidObstacleDiagonallysDelay = 0;

    // Every time the player succesfully moves, reset the delay
    var oldGamePlayer_onBeforeMove = Game_Player.prototype.onBeforeMove;
    Game_Player.prototype.onBeforeMove = function() {
      if (this.isDashing()) {
        avoidObstacleDiagonallysDelay = $.Param.AvDiagonal_DashingDelay;
      }
      else {
        avoidObstacleDiagonallysDelay = $.Param.AvDiagonal_WalkingDelay;
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

      if (avoidObstacleDiagonallysDelay > 0) {
        avoidObstacleDiagonallysDelay--;
      }

      if ($.Param.AvDiagonal_OnlyWhenDashing === true) {
        if (!this.isDashing()) {
          return false;
        }
      }

      if ($.Param.AvDiagonal_AvoidEvents !== true) {
        if (this.isTilesetPassable(this._x, this._y, direction)) {
          var x2 = $gameMap.roundFractionXWithDirection(this._x, direction, this.myStepSize());
          var y2 = $gameMap.roundFractionYWithDirection(this._y, direction, this.myStepSize());

          if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
          }
        }
      }

      if (this.tryToAvoidDiagonally(direction)) {
        return true;
      }

      return false;
    };

    Game_Player.prototype.tryToAvoidDiagonally = function(direction) {
      if (avoidObstacleDiagonallysDelay > 0) {
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
  }

  if ($.Param.EnableAutoAvoid) {
      var avoidObstaclesDelay = 0;

    // Every time the player succesfully moves, reset the delay
    var oldGamePlayer_onBeforeMove2 = Game_Player.prototype.onBeforeMove;
    Game_Player.prototype.onBeforeMove = function() {
      if (this.isDashing()) {
        avoidObstaclesDelay = $.Param.AutoAvoid_DashingDelay;
      }
      else {
        avoidObstaclesDelay = $.Param.AutoAvoid_WalkingDelay;
      }

      if (oldGamePlayer_onBeforeMove2 !== undefined) {
        oldGamePlayer_onBeforeMove2.call(this);
      }
    };

    var oldGamePlayer_trySavingFailedMovement2 = Game_Player.prototype.trySavingFailedMovement;
    Game_Player.prototype.trySavingFailedMovement = function(direction) {
      if (oldGamePlayer_trySavingFailedMovement2 !== undefined) {
        if (oldGamePlayer_trySavingFailedMovement2.call(this, direction)) {
          return true;
        }
      }

      if (avoidObstaclesDelay > 0) {
        avoidObstaclesDelay--;
      }

      if ($.Param.AutoAvoid_OnlyWhenDashing === true) {
        if (!this.isDashing()) {
          return false;
        }
      }

      if ($.Param.AutoAvoid_AvoidEvents !== true) {
        if (this.isTilesetPassable(this._x, this._y, direction)) {
          var x2 = $gameMap.roundFractionXWithDirection(this._x, direction, this.myStepSize());
          var y2 = $gameMap.roundFractionYWithDirection(this._y, direction, this.myStepSize());

          if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
          }
        }
      }

      if (this.tryToAvoid(direction, $.Param.AutoAvoid_MaxOffset)) {
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

          if ($.Param.AutoAvoid_RetainDirection) {
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
  }
})(SuperOrangeMovementEx);

Imported.SuperOrangeMovementEx = 1.3;