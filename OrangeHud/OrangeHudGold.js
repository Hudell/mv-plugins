/*=============================================================================
 * Orange - Gold HUD
 * By HUDell - www.hudell.com
 * OrangeHudGold.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds the Gold value to Orange Hud
 * @author Hudell
 *
 * @param Pattern
 * @desc The pattern of the line that will be drawn
 * @default %1
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
  throw new Error("Please add OrangeHud before OrangeHudGold!");
}

var OrangeHudGoldLine = OrangeHudGoldLine || {};

if (Imported["OrangeHudGold"] === undefined) {
  OrangeHudGoldLine.validateParams = function(line) {
    if (line.ScriptPattern !== undefined && line.ScriptPattern.trim() === "") {
      line.ScriptPattern = undefined;
    }

    if (line.Pattern === undefined) {
      line.Pattern = "%1";
    } else if (line.Pattern.trim() === "") {
      line.Pattern = "";
    }

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

  OrangeHudGoldLine.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var pattern = variableData.Pattern;
    if (variableData.ScriptPattern !== undefined) {
      pattern = Function("return " + variableData.ScriptPattern)();
    }

    var line = pattern.format($gameParty.gold());

    window.contents.fontFace = variableData.FontFace;
    window.contents.fontSize = variableData.FontSize;
    window.contents.fontItalic = variableData.FontItalic;
    window.changeTextColor(variableData.FontColor);

    window.drawTextEx(line, variableData.X, variableData.Y);

    window.resetFontSettings();
  };

  OrangeHudGoldLine.getValue = function(variableData) {
    return $gameParty.gold();
  };

  OrangeHudGoldLine.getKey = function(variableData) {
    return 'gold';
  };

  OrangeHud.registerLineType('OrangeHudGold', OrangeHudGoldLine);
  Imported["OrangeHudGold"] = 1.0;
}