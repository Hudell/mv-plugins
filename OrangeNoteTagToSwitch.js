/*=============================================================================
 * Orange - Notetag to Switch
 * By Hudell - www.hudell.com
 * OrangeNoteTagToSwitch.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Allow you to automatically turn on a switch everytime a notetag is found on a map - OrangeNoteTagToSwitch
 * @author Hudell
 *
 * @param switchId
 * @desc The number of the switch to activate when the notetag is found
 * @default 0
 *
 * @param notetag
 * @desc The name of the notetag to look for on the maps notes
 * @default 0
 *
 * @help
 * Add the <notetag> on the notes of the maps that you want to tag.
 *
 * This plugin can be added multiple times to the same project
 * (just make a copy of the file and add it)
 *
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://hudell.com
 * 
 *=============================================================================*/
var Imported = Imported || {};
if (Imported["OrangeNoteTagToSwitch"] === undefined) {
  (function() {
    "use strict";

    var getProp = undefined;
    if (Imported["MVCommons"] !== undefined) {
      getProp = MVC.getProp;
    } else {
      getProp = function (meta, propName){ if (meta === undefined) return undefined; if (meta[propName] !== undefined) return meta[propName]; for (var key in meta) { if (key.toLowerCase() == propName.toLowerCase()) { return meta[key]; } } return undefined; };
    }

    var paramList = [];

    function updateParamList(){
      for (var i = 0; i < $plugins.length; i++) {
        if ($plugins[i].description.indexOf('OrangeNoteTagToSwitch') >= 0) {
          var switchId = Number($plugins[i].parameters['switchId'] || 0);
          var notetagName = $plugins[i].parameters['notetag'] || '';

          if (switchId > 0 && notetagName.trim().length > 0) {
            paramList.push({
              switchId : switchId,
              notetagName : notetagName
            });
          }
        }
      }
    }

    updateParamList();

    if (paramList.length > 0) {
      var updateSwitchList = function() {
        if (SceneManager._scene instanceof Scene_Map) {
          for (var i = 0; i < paramList.length; i++) {
            $gameSwitches.setValue(paramList[i].switchId, $gameMap.isNoteTagThere(paramList[i].notetagName));
          }
        }
      };

      Game_Map.prototype.isNoteTagThere = function(notetagName) {
        return getProp($dataMap.meta, notetagName) === true;
      };

      var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
      Game_Player.prototype.performTransfer = function() {
        var shouldUpdateSwitchList = this.isTransferring();

        oldGamePlayer_performTransfer.call(this);
        if (shouldUpdateSwitchList) {
          updateSwitchList();
        }
      };
    }
  })();

  Imported["OrangeNoteTagToSwitch"] = 1;
}