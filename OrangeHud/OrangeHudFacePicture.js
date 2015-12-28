/*=============================================================================
 * Orange - Face Picture HUD
 * By HUDell - www.hudell.com
 * OrangeHudFacePicture.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new Variable to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param ActorIndex
 * @desc The index of the actor in the party. If the index is invalid, nothing will be shown
 * @default 0
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
 * @desc The number of the variable that holds the X position of the picture inside the HUD
 * @default 0
 *
 * @param VariableY
 * @desc The number of the variable that holds the Y position of the picture inside the HUD
 * @default 0
 *
 * @help
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudFacePicture!");
}

if (Imported["OrangeHud"] < 1.7) {
  throw new Error("Please update OrangeHud!");
}

var OrangeHudFacePicture = OrangeHudFacePicture || {};

if (Imported["OrangeHudFacePicture"] === undefined) {
  OrangeHudFacePicture.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    paramsLine.ActorIndex = Number(paramsLine.ActorIndex || 0);

    paramsLine.X = Number(paramsLine.X || 0);
    paramsLine.Y = Number(paramsLine.Y || 0);

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);

    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);
  };

  OrangeHudFacePicture.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudFacePicture.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudFacePicture.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var fileData = this.getValue(variableData);
    if (fileData !== false) {
      x = this.realX(variableData);
      y = this.realY(variableData);

      var bitmap = ImageManager.loadFace(fileData[0]);
      bitmap.addLoadListener(function(){
        OrangeHud.setDirty();
      });

      hudWindow.drawFace(fileData[0], fileData[1], x, y);
    }
  };

  OrangeHudFacePicture.drawPicture = function(hudWindow, filename, x, y, variableData) {
    hudWindow.drawPicture(filename, x, y);
  };

  OrangeHudFacePicture.getValue = function(variableData) {
    if (variableData.ActorIndex >= 0) {
      var members = $gameParty.members();
      if (variableData.ActorIndex < members.length) {
        var faceName = members[variableData.ActorIndex]._faceName;
        var faceIndex = members[variableData.ActorIndex]._faceIndex;

        return [faceName, faceIndex];
      }
    }
    
    return false;
  };
  
  OrangeHudFacePicture.getKey = function(variableData) {
    return variableData.ActorIndex;
  };

  OrangeHud.registerLineType('OrangeHudFacePicture', OrangeHudFacePicture);
  Imported["OrangeHudFacePicture"] = 1.3;
}