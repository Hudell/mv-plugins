/*=============================================================================
 * Orange - Notetag to Variable
 * By Hudell - www.hudell.com
 * OrangeNoteTagToVariable.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Allow you to automatically change a Variable value everytime a notetag is found on a map or event - <OrangeNoteTagToVariable>
 * @author Hudell
 *
 * @param VariableId
 * @desc The number of the Variable to store the value of the notetag
 * @default 0
 *
 * @param notetag
 * @desc The name of the notetag to look for on the maps and event notes
 * @default 0
 *
 * @help
 * Add the <notetag> on the notes of the maps and events that you want to tag.
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
if (Imported["OrangeNoteTagToVariable"] === undefined) {
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
        if ($plugins[i].description.indexOf('<OrangeNoteTagToVariable>') >= 0) {
          var variableId = Number($plugins[i].parameters['VariableId'] || 0);
          var notetagName = $plugins[i].parameters['notetag'] || '';

          if (variableId > 0 && notetagName.trim().length > 0) {
            paramList.push({
              variableId : variableId,
              notetagName : notetagName
            });
          }
        }
      }
    }

    updateParamList();

    if (paramList.length > 0) {
      var updateVariableList = function() {
        if (SceneManager._scene instanceof Scene_Map) {
          for (var i = 0; i < paramList.length; i++) {
            var value = undefined;

            if ($gameMap._interpreter._eventId > 0) {
              var eventData = $dataMap.events[$gameMap._interpreter._eventId];
              if (eventData) {
                value = getProp(eventData.meta, paramList[i].notetagName);
              }
            }

            if (value === undefined) {
              value = $gameMap.getNoteTagValue(paramList[i].notetagName);
            }
            
            if (value !== undefined) {
              $gameVariables.setValue(paramList[i].variableId, value);
            }
          }
        }
      };

      var oldGameInterpreter_setup = Game_Interpreter.prototype.setup;
      Game_Interpreter.prototype.setup = function(list, eventId) {
        oldGameInterpreter_setup.call(this, list, eventId);
        updateVariableList();
      };

      Game_Map.prototype.getNoteTagValue = function(notetagName) {
        return getProp($dataMap.meta, notetagName);
      };

      var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
      Game_Player.prototype.performTransfer = function() {
        oldGamePlayer_performTransfer.call(this);
        updateVariableList();
      };
    }
  })();

  Imported["OrangeNoteTagToVariable"] = 1;
}