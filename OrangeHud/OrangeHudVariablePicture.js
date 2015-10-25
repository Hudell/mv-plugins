/*=============================================================================
 * Orange - Variable Picture HUD
 * By HUDell - www.hudell.com
 * OrangeHudVariablePicture.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Variable to Orange Hud
 * @author Hudell
 *
 * @param Pattern
 * @desc The pattern of the picture file name that will be drawn
 * @default %1
 *
 * @param VariableId
 * @desc The number of the variable that will be used to control this picture.
 * @default 1
 *
 * @param SwitchId
 * @desc Set this to a switch number to use it to control the visibility of this line
 * @default 0
 *
 * @param X
 * @desc The X position of the variable line inside the HUD
 * @default 
 *
 * @param Y
 * @desc The Y position of the variable line inside the HUD
 * @default 
 *
 * @param ScriptPattern
 * @desc A script call to be used to decide the filename of the picture instead of the pattern
 * @default 
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/hud-line-variable-picture
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudVariablePicture!");
}

var OrangeHudVariablePicture = OrangeHudVariablePicture || {};

if (Imported["OrangeHudVariablePicture"] === undefined) {
  OrangeHudVariablePicture.validateParams = function(line) {
    if (line.ScriptPattern !== undefined && line.ScriptPattern.trim() === "") {
      line.ScriptPattern = undefined;
    }

    if (line.Pattern === undefined) {
      line.Pattern = "%1";
    } else if (line.Pattern.trim() === "") {
      line.Pattern = "";
    }

    line.VariableId = Number(line.VariableId || 0);

    line.X = Number(line.X || 0);
    line.Y = Number(line.Y || 0);

    line.SwitchId = Number(line.SwitchId || 0);
  };

  OrangeHudVariablePicture.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var filename = this.getFileName(variableData);

    window.drawPicture(filename, variableData.X, variableData.Y);
  };

  OrangeHudVariablePicture.getValue = function(variableData) {
    if (variableData.VariableId > 0) {
      return $gameVariables.value(variableData.VariableId);
    } else {
      return 0;
    }
  };
  
  OrangeHudVariablePicture.getFileName = function(variableData) {
    var pattern = variableData.Pattern;
    if (variableData.ScriptPattern !== undefined) {
      pattern = Function("return " + variableData.ScriptPattern)();
    }

    var varValue = '';

    if (variableData.VariableId > 0) {
      varValue = Number($gameVariables.value(variableData.VariableId));
    }

    return pattern.format(varValue);
  };

  OrangeHudVariablePicture.getKey = function(variableData) {
    return variableData.VariableId;
  };

  OrangeHud.registerLineType('OrangeHudVariablePicture', OrangeHudVariablePicture);
  Imported["OrangeHudVariablePicture"] = true;
}