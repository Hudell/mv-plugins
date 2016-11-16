/*=============================================================================
 * Orange - AutoSave
 * By Hudell - www.hudell.com
 * OrangeAutoSave.js
 * Version: 1.1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Automatically save the game on map change <OrangeAutoSave>
 * @author Hudell
 *
 * @param saveSlot
 * @desc Set this to the number of the slot where the plugin should save
 * @default 1
 *
 * @param saveOnPluginTransfer
 * @desc save game automatically on any kind of player transfer
 * @default false
 *
 * @param saveOnTransferCommand
 * @desc save game automatically when the "transfer player" command is used
 * @default true
 *
 * @param autoSaveSlot
 * @desc Instead of using the saveSlot param, the plugin will pick the last used slot
 * @default false
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
 * 
 * You only need to enable saveOnPluginTransfer if you have other plugins
 * that transfer the player and you want the game to be saved on those
 * transfers too.
 *
 * When you enable it, this plugin will have to change the "new game" and
 * "load game" commands to make sure the game isn't autosaved by them too.
 * 
 * ============================================================================
 * 
 * You can trigger an auto save with the following script call:
 *
 * DataManager.autoSave();
 *
 *=============================================================================*/
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangeAutoSave = Hudell.OrangeAutoSave || {};

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeAutoSave>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeAutoSave parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = {};
  $.enabled = true;
  $.skipCalls = 0;

  // Param validation

  if ($.Parameters.saveSlot !== "false") {
    $.Param.saveSlot = Number($.Parameters.saveSlot || 1);
  } else {
    $.Param.saveSlot = 99;
  }

  $.Param.saveOnPluginTransfer = ($.Parameters.saveOnPluginTransfer || "").toLowerCase() === "true";
  $.Param.saveOnTransferCommand = ($.Parameters.saveOnTransferCommand || "").toLowerCase() !== "false";
  $.Param.autoSaveSlot = ($.Parameters.autoSaveSlot || "").toLowerCase() !== "false";
  $.Param.currentSaveSlot = $.Param.saveSlot;

  // Code

  $.getSaveSlot = function() {
    return $.Param.currentSaveSlot;
  };

  $.skipNextCall = function() {
    $.skipCalls++;
  };

  $.doAutoSave = function() {
    $gameSystem.onBeforeSave();
    DataManager.saveGameWithoutRescue($.getSaveSlot());
  };

  //Only change the performTransfer method if it's activated through params
  if ($.Param.saveOnPluginTransfer) {
    $.oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
      $.oldGamePlayer_performTransfer.call(this);
      
      if ($.skipCalls > 0) {
        $.skipCalls--;
        return;
      }

      if (this._newMapId > 0) {
        if ($.enabled) {
          $.doAutoSave();
        }
      }
    };

    //Changes setupNewGame so that the initial player transfer doesn't trigger an auto save
    $.oldDataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
      $.skipNextCall();
      $.oldDataManager_setupNewGame.call(this);
    };

    //Changes reloadMapIfUpdated so that loading a game doesn't trigger an auto save
    $.oldSceneLoad_reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
    Scene_Load.prototype.reloadMapIfUpdated = function() {
      if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $.skipNextCall();
      }

      $.oldSceneLoad_reloadMapIfUpdated.call(this);
    };

  //Only change the command if the performTransfer is disabled and the transfer command is enabled
  } else if ($.Param.saveOnTransferCommand) {
    $.oldGameInterpreter_command201 = Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201 = function() {
      $.oldGameInterpreter_command201.call(this);
      
      if ($gamePlayer.isTransferring() && $.enabled) {
        $.doAutoSave();
      }
    };
  }

  if ($.Param.autoSaveSlot) {
    var oldDataManager_saveGameWithoutRescue = DataManager.saveGameWithoutRescue;
    DataManager.saveGameWithoutRescue = function(savefileId) {
      oldDataManager_saveGameWithoutRescue.call(this, savefileId);
      $.Param.currentSaveSlot = savefileId;
    };

    var oldDataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function(savefileId) {
      oldDataManager_loadGameWithoutRescue.call(this, savefileId);
      $.Param.currentSaveSlot = savefileId;
    };

    var autoSaveSlot_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
      autoSaveSlot_setupNewGame.call(this);
      $.Param.currentSaveSlot = $.Param.saveSlot;
    };
  }

  DataManager.autoSave = $.doAutoSave;
})(Hudell.OrangeAutoSave);

Imported.OrangeAutoSave = 1.1;
