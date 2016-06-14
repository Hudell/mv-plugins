/*=============================================================================
 * Orange - Overlay
 * By Hudell - www.hudell.com
 * OrangeOverlay.js
 * Version: 1.1.2
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc v1.1.2 - Adds overlay images to the map <OrangeOverlay>
 * @author Hudell
 *
 * @param Organized Folders
 * @desc Use different folders for each type of parallax
 * @default false
 *
 * @param Parallax Layer Filename
 * @desc 
 * @default par
 *
 * @param Ground Layer Filename
 * @desc 
 * @default ground
 *
 * @param Light Layer Filename
 * @desc 
 * @default light
 *
 * @param Shadow Layer Filename
 * @desc 
 * @default shadow
 *
 * @param Light Opacity
 * @desc 
 * @default 185
 *
 * @param Quick Start
 * @desc 
 * @default true
 *
 * @param Bush Region ID
 * @desc 
 * @default 7
 *
 * @param Fog Switch ID
 * @desc 
 * @default 1
 *
 * @param Light Switch ID
 * @desc 
 * @default 2
 *
 * @param Parallax Switch ID
 * @desc 
 * @default 3
 *
 * @param Shadow Switch ID
 * @desc 
 * @default 4
 *
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website:
 * http://hudell.com
 * 
 * ============================================================================
 * Instructions
 * ============================================================================
 * 
 * You can use this plugin to add overlay images to your maps
 * You can keep the images either on the img/parallaxes folder
 * Or (if you set the Organized Folders param to true) on separate folders like this:
 *
 * img/overlays/grounds
 * img/overlays/pars
 * img/overlays/shadows
 * img/overlays/lights
 * img/overlays/fogs
 *  
 * All image filenames must end with the number of the map that they are used on
 *  
 * Map notetags:
 *  
 * <all> : Display all overlays 
 * <ground> : Display ground overlay
 * <par> : Display parallax overlay
 * <light> : Display light overlay
 * <shadow> : Display shadow overlay
 * <fogName:filename> : Display the specified fog image
 * <fogOpacity:number> : Change the opacity level of the fog image (0 to 255)
 * <fogBlend:number> : Changes the blend type of the fog image
 * <fogDuration:number> : Changes the duration of the opacity transition
 * <xMove:number> : Changes the horizontal speed of the fog
 * <yMove:number> : Changes the vertical speed of the fog
 *
 * You can use variables numbers on the notetags by adding a $ symbol before the value
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * ----------------------------------------------------------------------------
 *  Overlay layertype filename
 * ----------------------------------------------------------------------------
 * Possible layer types: ground, light, shadow, par
 * 
 * ----------------------------------------------------------------------------
 *  Overlay fog filename opacity xMove yMove blendmode duration
 * ----------------------------------------------------------------------------
 * Changes the fog params to the ones specified in this command. 
 * Blendmode and duration are optional
 * Examples:
 * Overlay fog fog1 100 10 0 0 20
 * This will display the file fo1 with opacity 100 and move horizontally 10px
 * at a time, with a transition of 20 frames
 *
 * ----------------------------------------------------------------------------
 *  Overlay fadeout duration
 * ----------------------------------------------------------------------------
 * Do a fadeout effect on the current fog
 *
 * ----------------------------------------------------------------------------
 * Overlay addfog filename ID Opacity xMove yMove BlendType Z
 * ----------------------------------------------------------------------------
 * Adds an extra fog layer. BlendType and Z values are optional
 * 
 * ----------------------------------------------------------------------------
 * Overlay removefog ID
 * ----------------------------------------------------------------------------
 * Removes an extra fog that was added with the addfog command
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.1.2:
 * Fixed several small issues with the opacity
 *=============================================================================*/
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangeOverlay = Hudell.OrangeOverlay || {};

(function($) {

  "use strict";

  var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeOverlay>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeOverlay parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = {};

  $.Param.organizedFolders = $.Parameters["Organized Folders"] == 'true';
  $.Param.parallaxLayerFileName = $.Parameters["Parallax Layer Filename"] || 'par';
  $.Param.groundLayerFileName = $.Parameters["Ground Layer Filename"] || 'ground';
  $.Param.lightLayerFileName = $.Parameters["Light Layer Filename"] || 'light';
  $.Param.shadowLayerFileName = $.Parameters["Shadow Layer Filename"] || 'shadow';
  $.Param.lightOpacity = Number($.Parameters["Light Opacity"] || 185);
  $.Param.quickStart = $.Parameters["Quick Start"] != 'false';
  $.Param.bushRegionId = Number($.Parameters["Bush Region ID"] || 7);
  $.Param.fogSwitchId = Number($.Parameters["Fog Switch ID"] || 1);
  $.Param.lightSwitchId = Number($.Parameters["Light Switch ID"] || 2);
  $.Param.parallaxSwitchId = Number($.Parameters["Parallax Switch ID"] || 3);
  $.Param.shadowSwitchId = Number($.Parameters["Shadow Switch ID"] || 4);

  $.clearParams = function() {
    $.fogFileNameCommand = '';
    $.fogOpacityCommand = 0;
    $.fogMoveXCommand = 0;
    $.fogMoveYCommand = 0;
    $.fodBlendCommand = 0;
    $.fogDurationCommand = 0;
    $.overlayFadeOut = false;
    
    $.fogFadeOut = 1;
    $.fogFileName = '';
    $.fogOpacity = 255;
    $.fogMoveX = 0;
    $.fogMoveY = 0;
    $.fogBlendMode = 0;
    $.fogDuration = 1;

    $.updateFog = false;
    $.updateLight = false;
    $.lightName = '';
    $.updateShadow = false;
    $.shadowName = '';
    $.updateParallax = false;
    $.parallaxName = '';
    $.updateGround = false;
    $.groundName = '';
    $.newFogToCreate = false;
    $.newFogName = '';
    $.newFogId = '';
    $.newFogOpacity = 0;
    $.newFogZ = 22;
    $.newFogBlend = 0;
    $.newFogXMove = 0;
    $.newFogYMove = 0;

    $.fogToRemove = 0;

    $.defOpacity = 0;
    $.defDuration = 1;
    $.defTransition = 0;

    $.fogNewX = 0;
    $.fogNewY = 0;
  };

  $.clearParams();

  var oldDataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    oldDataManager_setupNewGame.call(this);

    if ($.Param.quickStart) {
      if ($.Param.fogSwitchId > 0) {
        $gameSwitches.setValue($.Param.fogSwitchId, true);
      }

      if ($.Param.lightSwitchId > 0) {
        $gameSwitches.setValue($.Param.lightSwitchId, true);
      }

      if ($.Param.parallaxSwitchId > 0) {
        $gameSwitches.setValue($.Param.parallaxSwitchId, true);
      }

      if ($.Param.shadowSwitchId > 0) {
        $gameSwitches.setValue($.Param.shadowSwitchId, true);
      }
    }
  };

  var oldSpritesetMap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    $.clearParams();
    this._fogList = [];

    oldSpritesetMap_createLowerLayer.call(this);
  };

  Spriteset_Map.prototype.loadBitmap = function(folderName, fileName) {
    if ($.Param.organizedFolders) {
      return ImageManager.loadBitmap('img/overlays/' + folderName + '/', fileName);
    }

    return ImageManager.loadParallax(fileName);
  };

  Spriteset_Map.prototype.createLayer = function(folderName, fileNamePrefix, tagName, zValue, switchId, maxOpacity) {
    if (!$dataMap) return null;
    if (!$dataMap.meta) return null;
    if (!$dataMap.meta[tagName] && !$dataMap.meta.all) {
      return null;
    }

    if (maxOpacity === undefined) maxOpacity = 255;

    var layer = new Sprite();
    layer.bitmap = this.loadBitmap(folderName, fileNamePrefix + $gameMap._mapId);

    layer.z = zValue;
    this._tilemap.addChild(layer);

    if (switchId > 0) {
      layer.opacity = $gameSwitches.value(switchId) ? maxOpacity : 0;
    }

    return layer;
  };

  Spriteset_Map.prototype.createGroundLayer = function() {
    this._groundLayer = this.createLayer('grounds', $.Param.groundLayerFileName, 'ground', 1, 0);
  };

  Spriteset_Map.prototype.createParallaxLayer = function() {
    this._parallaxLayer = this.createLayer('pars', $.Param.parallaxLayerFileName, 'par', 20, $.Param.parallaxSwitchId);
  };

  Spriteset_Map.prototype.createShadowLayer = function() {
    this._shadowLayer = this.createLayer('shadows', $.Param.shadowLayerFileName, 'shadow', 21, $.Param.shadowSwitchId);
  };

  Spriteset_Map.prototype.getOverlayVariable = function(variableName) {
    if (!$dataMap) return false;
    if (!$dataMap.meta) return false;
    if ($dataMap.meta[variableName] === undefined) return false;

    var value = $dataMap.meta[variableName].trim();
    if (value[0] == '$') {
      value = value.slice(1);
      var variableId = parseInt(value, 10);
      if (!isNaN(variableId) && variableId > 0) {
        return $gameVariables.value(variableId);
      }
    }

    return value;
  };

  Spriteset_Map.prototype.createFogItem = function(id, fileName, xMove, yMove, opacity, blend, z) {
    if (!this._fogList[id]) {
      var data = {};

      data.bitmap = this.loadBitmap('fogs', fileName);
      if (!data.bitmap) return;

      data.sprite = new TilingSprite();
      data.sprite.bitmap = data.bitmap;
      data.sprite.width = Graphics.width;
      data.sprite.height = Graphics.height;
      data.sprite.opacity = opacity;
      data.sprite.blendMode = blend;
      data.sprite.z = z;

      data.newX = 0;
      data.newY = 0;
      data.xMove = xMove;
      data.yMove = yMove;

      this._fogList[id] = data;
      this._tilemap.addChild(data.sprite);
    }

    $.newFogToCreate = false;
  };

  Spriteset_Map.prototype.createFogLayer = function() {
    $.fogFileName = this.getOverlayVariable('fogName');
    $.fogOpacity = parseInt(this.getOverlayVariable('fogOpacity'), 10) || 255;
    $.fogMoveX = parseFloat(this.getOverlayVariable('xMove'), 10) || 0;
    $.fogMoveY = parseFloat(this.getOverlayVariable('yMove'), 10) || 0;
    $.fogBlendMode = parseInt(this.getOverlayVariable('fogBlend'), 10) || 0;
    $.fogDuration = parseInt(this.getOverlayVariable('fogDuration'), 10) || 1;

    if (!$.fogFileName && !$.fogFileNameCommand) return;

    var fileName = $.fogFileName;
    if (!!$.fogFileNameCommand && $.fogFileNameCommand !== '') {
      fileName  = $.fogFileNameCommand;
    }

    var bitmap = this.loadBitmap('fogs', fileName);
    if (!bitmap) return;

    var layer = new TilingSprite();
    layer.bitmap = bitmap;
    layer.width = Graphics.width;
    layer.height = Graphics.height;

    layer.blendMode = $.fogBlendMode;
    layer.opacity = 0;
    layer.origin.x =  $gameMap.displayX() * $gameMap.tileWidth();
    layer.origin.y =  $gameMap.displayY() * $gameMap.tileHeight();
    layer.z = 22;

    $.fogNewX = 0;
    $.fogNewY = 0;

    this._tilemap.addChild(layer);
    this._fogLayer = layer;
    $.updateFog = false;
  };

  Spriteset_Map.prototype.createLightLayer = function() {
    this._lightLayer = this.createLayer('lights', $.Param.lightLayerFileName, 'light', 23, $.Param.lightSwitchId, $.Param.lightOpacity);

    if (!!this._lightLayer) {
      this._lightLayer.blendMode = 1;
    }
  };

  var oldSpritesetMap_createCharacters = Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function() {
    this.createGroundLayer();
    oldSpritesetMap_createCharacters.call(this);
    this.createParallaxLayer();
    this.createShadowLayer();
    this.createFogLayer();
    this.createLightLayer();
  };

  Spriteset_Map.prototype.updateLayer = function(layerName, update, folderName, fileNamePrefix, tagName, zValue, switchId, maxOpacity, opacityChange) {
    if (maxOpacity === undefined) maxOpacity = 255;
    if (opacityChange === undefined) opacityChange = 10;

    var layer = this[layerName];

    if (!layer) {
      layer = this.createLayer(folderName, fileNamePrefix, tagName, zValue, switchId, maxOpacity);
      update = false;
    }

    if (!!layer) {
      layer.x = $gameMap.displayX() * (0 - $gameMap.tileWidth());
      layer.y = $gameMap.displayY() * (0 - $gameMap.tileHeight());

      if (switchId > 0) {
        if ($gameSwitches.value(switchId)) {
          if (layer.opacity < maxOpacity) {
            layer.opacity += opacityChange;
          }
          if (layer.opacity > maxOpacity) {
            layer.opacity = maxOpacity;
          }
        } else {
          if (layer.opacity > 0) {
            layer.opacity -= opacityChange;
          }

          if (layer.opacity < 0) {
            layer.opacity = 0;
          }
        }
      }

      if (update) {
        layer.bitmap = this.loadBitmap(folderName, fileNamePrefix + $gameMap._mapId);
      }

      this[layerName] = layer;
    }
  };

  Spriteset_Map.prototype.updateGroundLayer = function() {
    this.updateLayer('_groundLayer', $.updateGround, 'grounds', $.Param.groundLayerFileName, 'ground', 1, 0);
    $.updateGround = false;
  };

  Spriteset_Map.prototype.updateParallaxLayer = function() {
    this.updateLayer('_parallaxLayer', $.updateParallax, 'pars', $.Param.parallaxLayerFileName, 'par', 20, $.Param.parallaxSwitchId);
    $.updateParallax = false;
  };

  Spriteset_Map.prototype.updateShadowLayer = function() {
    this.updateLayer('_shadowLayer', $.updateShadow, 'shadows', $.Param.shadowLayerFileName, 'shadow', 21, $.Param.shadowSwitchId);
    $.updateShadow = false;
  };

  Spriteset_Map.prototype.updateFogItem = function(id) {
    var data = this._fogList[id];
    if (!data) return;

    data.newX += data.xMove;
    data.newY += data.yMove;

    data.sprite.origin.x = $gameMap.displayX() * $gameMap.tileWidth() - data.newX;
    data.sprite.origin.y = $gameMap.displayY() * $gameMap.tileHeight() - data.newY;
  };

  Spriteset_Map.prototype.removeFogItem = function(id) {
    if (!this._fogList[id]) return;

    delete this._fogList[id];
  };

  Spriteset_Map.prototype.updateFogLayer = function() {
    if (!this._fogLayer) {
      this.createFogLayer();
      
      if (!this._fogLayer) {
        return;
      }
    }

    var newOpacity;

    this._fogLayer.blendMode = $.fodBlendCommand === 0 ? 0 : 1;

    if ($.fogMoveXCommand !== 0) {
      $.fogNewX += $.fogMoveXCommand;
    } else {
      $.fogNewX += $.fogMoveX;
    }

    if ($.fogMoveYCommand !== 0) {
      $.fogNewY += $.fogMoveYCommand;
    } else {
      $.fogNewY += $.fogMoveY;
    }

    this._fogLayer.origin.x = $gameMap.displayX() * $gameMap.tileWidth() - $.fogNewX;
    this._fogLayer.origin.y = $gameMap.displayY() * $gameMap.tileHeight() - $.fogNewY;

    if ($.Param.fogSwitchId > 0 && $gameSwitches.value($.Param.fogSwitchId)) {
      if ($.fogOpacityCommand !== 0) {
        $.defOpacity = $.fogOpacityCommand;
      } else {
        $.defOpacity = $.fogOpacity;
      }

      if ($.fogDurationCommand !== 0) {
        $.defDuration = $.fogDurationCommand;
      } else {
        $.defDuration = $.fogDuration;
      }

      $.defTransition = $.defOpacity / $.defDuration;
    } else if (this._fogLayer.opacity > 0) {
      newOpacity = this._fogLayer.opacity - 10;
      if (newOpacity < 0) newOpacity = 0;
      this._fogLayer.opacity = newOpacity;
    }

    if ($.overlayFadeOut) {
      $.defTransition = $.defOpacity / $.fogFadeOut;
      if (this._fogLayer.opacity > 0) {
        newOpacity = this._fogLayer.opacity - $.defTransition;
        if (newOpacity < 0) newOpacity = 0;
        this._fogLayer.opacity = newOpacity;
      } else {
        $.overlayFadeOut = false;
        $.fogOpacityCommand = 0;
        $.defOpacity = 0;
        if ($.Param.fogSwitchId > 0) {
          $gameSwitches.setValue($.Param.fogSwitchId, false);
        }
      }
    } else if (this._fogLayer.opacity < $.defOpacity) {
      newOpacity = this._fogLayer.opacity + $.defTransition;
      if (newOpacity > $.defOpacity) newOpacity = $.defOpacity;
      this._fogLayer.opacity = newOpacity;
    }

    if ($.updateFog && !!$.fogFileNameCommand && $.fogFileNameCommand !== '') {
      this._fogLayer.bitmap = this.loadBitmap('fogs', $.fogFileNameCommand);
      $.updateFog = false;
    }
  };

  Spriteset_Map.prototype.updateLightLayer = function() {
    this.updateLayer('_lightLayer', $.updateLight, 'lights', $.Param.lightLayerFileName, 'light', 23, $.Param.lightSwitchId, $.Param.lightOpacity, 1);
    $.updateLight = false;
  };

  var oldSpritesetMap_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    this.updateGroundLayer();
    this.updateParallaxLayer();
    this.updateShadowLayer();
    this.updateFogLayer();
    this.updateLightLayer();

    oldSpritesetMap_updateTilemap.call(this);

    var len = this._fogList.length;
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        if (!!this._fogList[i]) {
          this.updateFogItem(i);
        }
      }
    }

    if ($.newFogToCreate) { 
      this.createFogItem($.newFogId, $.newFogName, $.newFogXMove, $.newFogYMove, $.newFogOpacity, $.newFogBlend, $.newFogZ);
      $.newFogToCreate = false;
    }

    if ($.fogToRemove > 0) {
      this.removeFogItem($.fogToRemove);
      $.fogToRemove = 0;
    }  
  };


  Game_Interpreter.prototype.overlayPluginCommand = function(args) {
    if (args.length < 2) return;

    switch(args[0].toLowerCase()) {
      case 'fog' :
        if (args.length < 5) return;

        if (!!args[1] && !!args[2] && !!args[3] && !!args[4]) {
          $.updateFog = true;
          $.fogFileNameCommand = args[1];
          $.fogOpacityCommand = parseInt(args[2], 10);
          $.fogMoveXCommand = parseFloat(args[3], 10);
          $.fogMoveYCommand = parseFloat(args[4], 10);

          if (args.length > 5 && !!args[5]) {
            $.fodBlendCommand = parseInt(args[5], 10);
          }
          if (args.length > 6 && !!args[6]) {
            $.fogDurationCommand = parseInt(args[6], 10);
          }
        }

        break;
      case 'fadeout' :
        if (!!args[1]) {
          $.overlayFadeOut = true;
          $.fogFadeOut = parseInt(args[1], 10);
        }
        break;
      case 'light' :
        if (!!args[1]) {
          $.updateLight = true;
          $.lightName = args[1];
        }
        break;
      case 'shadow' :
        if (!!args[1]) {
          $.updateShadow = true;
          $.shadowName = args[1];
        }
        break;
      case 'par' :
        if (!!args[1]) {
          $.updateParallax = true;
          $.parallaxName = args[1];
        }
        break;
      case 'ground' :
        if (!!args[1]) {
          $.updateGround = true;
          $.groundName = args[1];
        }
        break;
      case 'addfog' :
        if (args.length < 6) return;
        if (!args[1]) return;

        $.newFogToCreate = true;
        $.newFogName = args[1];
        $.newFogId = parseInt(args[2], 10);
        $.newFogOpacity = parseInt(args[3], 10);
        $.newFogXMove = parseFloat(args[4], 10);
        $.newFogYMove = parseFloat(args[5], 10);

        if (args.length > 6) {
          $.newFogBlend = parseInt(args[6], 10);
        } else {
          $.newFogBlend = 0;
        }

        if (args.length > 7) {
          $.newFogZ = parseInt(args[7], 10);
        } else {
          $.newFogZ = 22;
        }
        break;
      case 'removefog' :
        $.fogToRemove = parseInt(args[1], 10);
        break;
      default :
        console.log('unknown command: ', args[0]);
        break;        
    }
  };

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command.toLowerCase() == 'overlay') {
      this.overlayPluginCommand(args);
      return;
    }

    oldGameInterpreter_pluginCommand.apply(this, arguments);
  };

  if ($.Param.bushRegionId > 0) {
    var oldIsBush = Game_Map.prototype.isBush;
    Game_Map.prototype.isBush = function(x, y) {
      if (oldIsBush.call(this, x, y) === true) return true;

      if (this.isValid(x, y)) {
        return $gameMap.regionId(x, y) == $.Param.bushRegionId;
      }

      return false;
    };
  }

  if (!!Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION == "1.2.0") {
    TilingSprite.prototype.generateTilingTexture = function(arg) {
      PIXI.TilingSprite.prototype.generateTilingTexture.call(this, arg);
      // Purge from Pixi's Cache
      if (Graphics.isWebGL()) {
        if (!!this.tilingTexture && this.tilingTexture.canvasBuffer) {
          PIXI.Texture.removeTextureFromCache(this.tilingTexture.canvasBuffer.canvas._pixiId);
        }
      }
    };
  }

  var oldSpriteCharacter_startBallon = Sprite_Character.prototype.startBalloon;
  Sprite_Character.prototype.startBalloon = function() {
    oldSpriteCharacter_startBallon.call(this);
    if (!!this._balloonSprite) {
      this._balloonSprite.z = 30;
    }
  };

  var oldSpriteAnimation_initMembers = Sprite_Animation.prototype.initMembers;
  Sprite_Animation.prototype.initMembers = function() {
    oldSpriteAnimation_initMembers.apply(this, arguments);
    this.z = 30;
  };

})(Hudell.OrangeOverlay);

OrangeOverlay = Hudell.OrangeOverlay;
Imported.OrangeOverlay = 1.1;