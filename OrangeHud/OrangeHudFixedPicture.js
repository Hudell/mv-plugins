/*=============================================================================
 * Orange - Fixed Picture HUD
 * By HUDell - www.hudell.com
 * OrangeHudFixedPicture.js
 * Version: 1.5
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Fixed Picture to Orange Hud
 * @author Hudell
 *
 * @param FileName
 * @desc The picture filename that will be drawn
 * @default 
 *
 * @param SwitchId
 * @desc Set this to a switch number to use it to control the visibility of this picture
 * @default 0
 *
 * @param X
 * @desc The X position of the picture inside the HUD
 * @default 
 *
 * @param Y
 * @desc The Y position of the picture inside the HUD
 * @default 
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/hud-line-picture
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudFixedPicture!");
}
if (Imported["OrangeHud"] < 1.7) {
  throw new Error("Please update OrangeHud!");
}

var OrangeHudFixedPicture = OrangeHudFixedPicture || {};

if (Imported["OrangeHudFixedPicture"] === undefined) {
  OrangeHudFixedPicture.validateParams = function(line) {
    if (line.FileName === undefined) {
      line.FileName = "";
    } else if (line.FileName.trim() === "") {
      line.FileName = "";
    }

    line.X = Number(line.X || 0);
    line.Y = Number(line.Y || 0);

    line.SwitchId = Number(line.SwitchId || 0);
  };

  OrangeHudFixedPicture.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    if (variableData.FileName !== "") {
      var bitmap = ImageManager.loadPicture(variableData.FileName);
      bitmap.addLoadListener(function(){
        OrangeHud.setDirty();
      });

      window.drawPicture(variableData.FileName, variableData.X, variableData.Y);
    }
  };

  OrangeHudFixedPicture.getValue = function(variableData) {
    return 0;
  };
  
  OrangeHudFixedPicture.getKey = function(variableData) {
    return 'fixed-picture';
  };

  OrangeHud.registerLineType('OrangeHudFixedPicture', OrangeHudFixedPicture);
  Imported["OrangeHudFixedPicture"] = 1.5;
}