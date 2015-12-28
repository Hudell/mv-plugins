/*=============================================================================
 * Orange - Variable Picture HUD
 * By HUDell - www.hudell.com
 * OrangeHudVariablePicture.js
 * Version: 1.6
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc OrangeHudVariablePicture 1.5.1 - Adds a new Variable Picture to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
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
 * @param VariableX
 * @desc The number of the variable that holds the X position of the picture inside the HUD
 * @default 0
 *
 * @param VariableY
 * @desc The number of the variable that holds the Y position of the picture inside the HUD
 * @default 0
 *
 * @param CommonEventId
 * @desc Number of a common event to call if the player clicks on this picture
 * @default 
 *
 * @help
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudVariablePicture!");
}
if (Imported["OrangeHud"] < 1.7) {
  throw new Error("Please update OrangeHud!");
}

var OrangeHudVariablePicture = OrangeHudVariablePicture || {};

if (Imported["OrangeHudVariablePicture"] === undefined) {
  OrangeHudVariablePicture.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    if (paramsLine.ScriptPattern !== undefined && paramsLine.ScriptPattern.trim() === "") {
      paramsLine.ScriptPattern = undefined;
    }

    if (paramsLine.Pattern === undefined) {
      paramsLine.Pattern = "%1";
    } else if (paramsLine.Pattern.trim() === "") {
      paramsLine.Pattern = "";
    }

    paramsLine.VariableId = Number(paramsLine.VariableId || 0);

    paramsLine.X = Number(paramsLine.X || 0);
    paramsLine.Y = Number(paramsLine.Y || 0);

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);
    paramsLine.CommonEventId = Number(paramsLine.CommonEventId || 0);

    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);

    if (paramsLine.CommonEventId > 0) {
      var key = OrangeHudVariablePicture.getKey(paramsLine);

      this.images = this.images || {};
      this.images[key] = this.images[key] || {};

      var alias = TouchInput._onMouseDown;
      var me = this;

      TouchInput._onMouseDown = function(event) {
        if (paramsLine.SwitchId > 0) {
          if (!$gameSwitches.value(paramsLine.SwitchId)) {
            return;
          }
        }

        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);

        var width = me.images[key].width;
        var height = me.images[key].height;

        if (width !== undefined && height !== undefined) {
          var imageX = me.realX(paramsLine) + OrangeHud.Param.HudX + OrangeHud.Param.WindowMargin + OrangeHud.Param.WindowPadding;
          var imageY = me.realY(paramsLine) + OrangeHud.Param.HudY + OrangeHud.Param.WindowMargin + OrangeHud.Param.WindowPadding;

          if (x >= imageX && y >= imageY) {
            if (x <= imageX + width && y <= imageY + height) {
              $gameTemp.reserveCommonEvent(paramsLine.CommonEventId);
              return;
            }
          }
        }

        // If the click wasn't triggered, call the alias to keep the mouseDown event happening
        alias.call(this, event);
      };
    }
  };

  OrangeHudVariablePicture.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudVariablePicture.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudVariablePicture.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var filename = this.getFileName(variableData);

    x = this.realX(variableData);
    y = this.realY(variableData);

    var bitmap = ImageManager.loadPicture(filename);
    bitmap.addLoadListener(function(){
      OrangeHud.setDirty();
    });
    var key = OrangeHudVariablePicture.getKey(variableData);
    
    this.images = this.images || {};
    this.images[key] = this.images[key] || {};
    this.images[key].width = bitmap._canvas.width;
    this.images[key].height = bitmap._canvas.height;

    this.drawPicture(hudWindow, filename, x, y, variableData);
  };

  OrangeHudVariablePicture.drawPicture = function(hudWindow, filename, x, y, variableData) {
    hudWindow.drawPicture(filename, x, y);
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
  Imported["OrangeHudVariablePicture"] = 1.6;
}