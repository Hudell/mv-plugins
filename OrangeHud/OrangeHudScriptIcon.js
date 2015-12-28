/*=============================================================================
 * Orange - Script Icon HUD
 * By HUDell - www.hudell.com
 * OrangeHudScriptIcon.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Script Icon to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param ScriptCall
 * @desc A script that when called should result in the index of the icon that should be displayed.
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
 * @param VariableX
 * @desc The number of the variable that holds the X position of the Icon inside the HUD
 * @default 0
 *
 * @param VariableY
 * @desc The number of the variable that holds the Y position of the Icon inside the HUD
 * @default 0
 *
 * @help
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudScriptIcon!");
}

var OrangeHudScriptIcon = OrangeHudScriptIcon || {};

if (Imported["OrangeHudScriptIcon"] === undefined) {
  OrangeHudScriptIcon.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    paramsLine.ScriptCall = paramsLine.ScriptCall || "1";
    if (typeof(paramsLine.ScriptCall) !== "string") {
      paramsLine.ScriptCall = paramsLine.ScriptCall.toString();
    }

    paramsLine.ScriptCall = paramsLine.ScriptCall.trim();

    paramsLine.X = Number(paramsLine.X || 0);
    paramsLine.Y = Number(paramsLine.Y || 0);

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);

    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);
  };

  OrangeHudScriptIcon.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudScriptIcon.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudScriptIcon.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var iconindex;

    try {
      iconindex = Function("return " + variableData.ScriptCall)();
    } catch(e) {
      iconindex = 0;
    }

    x = this.realX(variableData);
    y = this.realY(variableData);

    if (iconindex >= 0) {
      this.drawIcon(hudWindow, iconindex, x, y, variableData);
    }
  };

  OrangeHudScriptIcon.drawIcon = function(hudWindow, iconindex, x, y, variableData) {
    hudWindow.drawIcon(iconindex, x, y);
  };

  OrangeHudScriptIcon.getValue = function(variableData) {
    if (variableData.VariableId > 0) {
      return $gameVariables.value(variableData.VariableId);
    } else {
      return 0;
    }
  };
  
  OrangeHudScriptIcon.getIconIndex = function(variableData) {
    var varValue = -1;

    if (variableData.VariableId > 0) {
      varValue = Number($gameVariables.value(variableData.VariableId));
    }

    return varValue;
  };

  OrangeHudScriptIcon.getKey = function(variableData) {
    return variableData.VariableId;
  };

  OrangeHud.registerLineType('OrangeHudScriptIcon', OrangeHudScriptIcon);
  Imported["OrangeHudScriptIcon"] = 1.0;
}