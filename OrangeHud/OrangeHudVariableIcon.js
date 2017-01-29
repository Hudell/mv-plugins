/*=============================================================================
 * Orange - Variable Icon HUD
 * By HUDell - www.hudell.com
 * OrangeHudVariableIcon.js
 * Version: 1.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Variable Icon to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param VariableId
 * @desc The number of the variable that will be used to control this Icon.
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
 * ============================================================================
 * My Blog:
 * ============================================================================
 * http://hudell.com
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudVariableIcon!");
}

var OrangeHudVariableIcon = OrangeHudVariableIcon || {};

if (Imported["OrangeHudVariableIcon"] === undefined) {
  OrangeHudVariableIcon.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    paramsLine.VariableId = Number(paramsLine.VariableId || 0);

    paramsLine.X = Number(paramsLine.X || 0);
    paramsLine.Y = Number(paramsLine.Y || 0);

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);

    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);
  };

  OrangeHudVariableIcon.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudVariableIcon.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudVariableIcon.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var iconindex = this.getIconIndex(variableData);

    x = this.realX(variableData);
    y = this.realY(variableData);

    if (iconindex >= 0) {
      this.drawIcon(hudWindow, iconindex, x, y, variableData);
    }
  };

  OrangeHudVariableIcon.drawIcon = function(hudWindow, iconindex, x, y, variableData) {
    hudWindow.drawIcon(iconindex, x, y);
  };

  OrangeHudVariableIcon.getValue = function(variableData) {
    if (variableData.VariableId > 0) {
      return $gameVariables.value(variableData.VariableId);
    } else {
      return 0;
    }
  };
  
  OrangeHudVariableIcon.getIconIndex = function(variableData) {
    var varValue = -1;

    if (variableData.VariableId > 0) {
      varValue = Number($gameVariables.value(variableData.VariableId));
    }

    return varValue;
  };

  OrangeHudVariableIcon.getKey = function(variableData) {
    return variableData.VariableId;
  };

  OrangeHud.registerLineType('OrangeHudVariableIcon', OrangeHudVariableIcon);
  Imported["OrangeHudVariableIcon"] = 1.1;
}