/*=============================================================================
 * Orange - Date HUD
 * By HUDell - www.hudell.com
 * OrangeHudDate.js
 * Version: 1.4
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Variable to Orange Hud
 * @author Hudell
 *
 * @param Pattern
 * @desc The pattern of the line that will be drawn
 * @default %1/%2/%3
 *
 * @param VariableDay
 * @desc The number of the variable that holds the Day value.
 * @default 0
 *
 * @param VariableMonth
 * @desc The number of the variable that holds the Month value.
 * @default 0
 *
 * @param VariableYear
 * @desc The number of the variable that holds the Year value.
 * @default 0
 *
 * @param YearDigits
 * @desc The number of digits to display on the year number.
 * @default 4
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
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudDate!");
}

var OrangeHudDate = OrangeHudDate || {};

if (Imported["OrangeHudDate"] === undefined) {
  OrangeHudDate.validateParams = function(line) {
    if (line.ScriptPattern !== undefined && line.ScriptPattern.trim() === "") {
      line.ScriptPattern = undefined;
    }

    if (line.Pattern === undefined) {
      line.Pattern = "%1:%2:%3";
    } else if (line.Pattern.trim() === "") {
      line.Pattern = "";
    }

    line.VariableDay = Number(line.VariableDay || 0);
    line.VariableMonth = Number(line.VariableMonth || 0);
    line.VariableYear = Number(line.VariableYear || 0);
    line.YearDigits = Number(line.YearDigits || 4);

    if (line.FontFace === undefined || line.FontFace.trim() === "") {
      line.FontFace = OrangeHud.Param.DefaultFontFace;
    }

    if (line.FontColor === undefined || line.FontColor.trim() === "") {
      line.FontColor = OrangeHud.Param.DefaultFontColor;
    }

    line.FontSize = Number(line.FontSize || OrangeHud.Param.DefaultFontSize);
    line.X = Number(line.X || 0);
    line.Y = Number(line.Y || 0);

    if (line.FontItalic === undefined || line.FontItalic.trim() === "") {
      line.FontItalic = OrangeHud.Param.DefaultFontItalic;
    } else {
      line.FontItalic = line.FontItalic == "true";
    }

    line.SwitchId = Number(line.SwitchId || 0);
  };

  OrangeHudDate.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var line = this.getValue(variableData);

    window.contents.fontFace = variableData.FontFace;
    window.contents.fontSize = variableData.FontSize;
    window.contents.fontItalic = variableData.FontItalic;
    window.changeTextColor(variableData.FontColor);

    window.drawTextEx(line, variableData.X, variableData.Y);

    window.resetFontSettings();
  };

  OrangeHudDate.getValue = function(variableData) {
    var pattern = variableData.Pattern;
    if (variableData.ScriptPattern !== undefined) {
      pattern = Function("return " + variableData.ScriptPattern)();
    }

    var day = '';
    var month = '';
    var year = '';

    if (variableData.VariableDay > 0) {
      day = $gameVariables.value(variableData.VariableDay);
      if (typeof(day) == "number" || parseInt(day, 10) == day) {
        day = Number(day).padZero(2);
      }
    }

    if (variableData.VariableMonth > 0) {
      month = $gameVariables.value(variableData.VariableMonth);
      if (typeof(month) == "number" || parseInt(month, 10) == month) {
        month = Number(month).padZero(2);
      }
    }

    if (variableData.VariableYear > 0) {
      year = Number($gameVariables.value(variableData.VariableYear)).padZero(variableData.YearDigits);
    }

    return pattern.format(day, month, year);
  };

  OrangeHudDate.getKey = function(variableData) {
    return variableData.VariableYear + ',' + variableData.VariableMonth + ',' + variableData.VariableDay;
  };

  OrangeHud.registerLineType('OrangeHudDate', OrangeHudDate);
  Imported["OrangeHudDate"] = true;
}