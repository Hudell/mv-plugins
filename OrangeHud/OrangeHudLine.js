/*=============================================================================
 * Orange - Line HUD
 * By HUDell - www.hudell.com
 * OrangeHudLine.js
 * Version: 1.6
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc OrangeHudLine 1.5 - Adds a new Variable to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param Pattern
 * @desc The pattern of the line that will be drawn
 * @default %1
 *
 * @param VariableId
 * @desc The number of the variable that will be displayed on this line.
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
 * @param FontFace
 * @desc The font face to use. Leave empty to use the HUD default
 * @default 
 *
 * @param FontSize
 * @desc The font size to use. Leave empty to use the HUD default
 * @default
 *
 * @param FontColor
 * @desc The font color to use. Leave empty to use the HUD default
 * @default
 *
 * @param FontItalic
 * @desc Should use italic? Leave empty to use the HUD default
 * @default
 *
 * @param ScriptPattern
 * @desc A script call to be used instead of the Pattern
 * @default 
 *
 * @param VariableX
 * @desc The number of the variable that holds the X position of the picture inside the HUD
 * @default 0
 *
 * @param VariableY
 * @desc The number of the variable that holds the Y position of the picture inside the HUD
 * @default 0
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/hud-line
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudLine!");
}

var OrangeHudDefaultLine = OrangeHudDefaultLine || {};

if (Imported["OrangeHudLine"] === undefined) {
  OrangeHudDefaultLine.validateParams = function(line) {
    line.GroupName = line.GroupName || "main";
    
    if (line.ScriptPattern !== undefined && line.ScriptPattern.trim() === "") {
      line.ScriptPattern = undefined;
    }

    if (line.Pattern === undefined) {
      line.Pattern = "%1";
    } else if (line.Pattern.trim() === "") {
      line.Pattern = "";
    }

    line.VariableId = Number(line.VariableId || 0);
    if (line.FontFace === undefined || line.FontFace.trim() === "") {
      line.FontFace = OrangeHud.Param.DefaultFontFace;
    }

    if (line.FontColor === undefined || line.FontColor.trim() === "") {
      line.FontColor = OrangeHud.Param.DefaultFontColor;
    }

    line.FontSize = Number(line.FontSize || OrangeHud.Param.DefaultFontSize);
    line.VariableX = Number(line.VariableX || 0);
    line.VariableY = Number(line.VariableY || 0);
    line.X = Number(line.X || 0);
    line.Y = Number(line.Y || 0);

    if (line.FontItalic === undefined || line.FontItalic.trim() === "") {
      line.FontItalic = OrangeHud.Param.DefaultFontItalic;
    } else {
      line.FontItalic = line.FontItalic == "true";
    }

    line.SwitchId = Number(line.SwitchId || 0);
  };

  OrangeHudDefaultLine.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var pattern = variableData.Pattern;
    if (variableData.ScriptPattern !== undefined) {
      pattern = Function("return " + variableData.ScriptPattern)();
    }

    var line = pattern.format($gameVariables.value(variableData.VariableId));

    window.contents.fontFace = variableData.FontFace;
    window.contents.fontSize = variableData.FontSize;
    window.contents.fontItalic = variableData.FontItalic;
    window.changeTextColor(variableData.FontColor);

    window.drawTextEx(line, this.realX(variableData), this.realY(variableData));

    window.resetFontSettings();
  };

  OrangeHudDefaultLine.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudDefaultLine.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };


  OrangeHudDefaultLine.getValue = function(variableData) {
    return $gameVariables.value(variableData.VariableId);
  };

  OrangeHudDefaultLine.getKey = function(variableData) {
    return variableData.VariableId;
  };

  OrangeHud.registerLineType('OrangeHudLine', OrangeHudDefaultLine);
  Imported["OrangeHudLine"] = 1.6;
}