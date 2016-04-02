/*=============================================================================
 * Orange - Gauge HUD
 * By HUDell - www.hudell.com
 * OrangeHudGauge.js
 * Version: 1.2
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc OrangeHudGauge 1.2 - Adds a new Gauge to Orange Hud
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param ValueVariableId
 * @desc The number of the variable that holds the value of the gauge.
 * @default 1
 *
 * @param MaxValueVariableId
 * @desc The number of the variable that holds the maximum value of the gauge.
 * @default 2
 *
 * @param ScriptValue
 * @desc A script to run to get the current value of the gauge.
 * @default 
 *
 * @param ScriptMaxValue
 * @desc A script to run to get the max value of the gauge.
 * @default 
 *
 * @param SwitchId
 * @desc Set this to a switch number to use it to control the visibility of this line
 * @default 0
 *
 * @param X
 * @desc The X position of the gauge inside the HUD
 * @default 
 *
 * @param Y
 * @desc The Y position of the gauge inside the HUD
 * @default 
 *
 * @param Width
 * @desc The width of the Gauge
 * @default 100
 *
 * @param Direction
 * @desc The direction in which the gauge is filled
 * @default right
 *
 * @param Height
 * @desc The height of the Gauge
 * @default 6
 *
 * @param VariableX
 * @desc The number of the variable that holds the X position of the picture inside the HUD
 * @default 0
 *
 * @param VariableY
 * @desc The number of the variable that holds the Y position of the picture inside the HUD
 * @default 0
 *
 * @param GaugeColor1
 * @desc The color (or color ID) to use on the gauge
 * @default 20
 *
 * @param GaugeColor2
 * @desc The color (or color ID) to use on the gauge
 * @default 21
 *
 * @param AllowOverflow
 * @desc Set this to true if you want the gauge bar to overflow when the value is too high
 * @default false
 *
 * @param AutoRefresh
 * @desc Set this to false to disable automatic refresh of the gauge
 * @default true
 *
 * @help
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudGauge!");
}
if (Imported["OrangeHud"] < 1.7) {
  throw new Error("Please update OrangeHud!");
}

var OrangeHudGauge = OrangeHudGauge || {};

if (Imported["OrangeHudGauge"] === undefined) {
  OrangeHudGauge.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    paramsLine.ValueVariableId = Number(paramsLine.ValueVariableId || 0);
    paramsLine.MaxValueVariableId = Number(paramsLine.MaxValueVariableId || 0);

    paramsLine.X = Number(paramsLine.X || 0);
    paramsLine.Y = Number(paramsLine.Y || 0);
    paramsLine.Width = Number(paramsLine.Width || 0);
    paramsLine.Height = Number(paramsLine.Height || 0);

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);
    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);
    if (!paramsLine.Direction) {
      paramsLine.Direction = 'right';
    } else {
      paramsLine.Direction = paramsLine.Direction.toLowerCase().trim();

      if (paramsLine.Direction !== 'left' && paramsLine.Direction !== 'up' && paramsLine.Direction !== 'down') {
        paramsLine.Direction = 'right';
      }
    }

    if (paramsLine.ScriptValue !== undefined && paramsLine.ScriptValue.trim() === "") {
      paramsLine.ScriptValue = undefined;
    } else {
      paramsLine.ScriptValue = Function("return " + paramsLine.ScriptValue);
    }

    if (paramsLine.ScriptMaxValue !== undefined && paramsLine.ScriptMaxValue.trim() === "") {
      paramsLine.ScriptMaxValue = undefined;
    } else {
      paramsLine.ScriptMaxValue = Function("return " + paramsLine.ScriptMaxValue);
    }

    paramsLine.AllowOverflow = paramsLine.AllowOverflow === "true";
    paramsLine.AutoRefresh = paramsLine.AutoRefresh !== "false";

    if (!paramsLine.GaugeColor1) {
      paramsLine.GaugeColor1 = 20;
    } else if (parseInt(paramsLine.GaugeColor1, 10) == paramsLine.GaugeColor1) {
      paramsLine.GaugeColor1 = parseInt(paramsLine.GaugeColor1, 10);
    }

    if (!paramsLine.GaugeColor2) {
      paramsLine.GaugeColor2 = 21;
    } else if (parseInt(paramsLine.GaugeColor2, 10) == paramsLine.GaugeColor2) {
      paramsLine.GaugeColor2 = parseInt(paramsLine.GaugeColor2, 10);
    }
  };

  OrangeHudGauge.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudGauge.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudGauge.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    this.drawGauge(hudWindow, variableData);
  };

  OrangeHudGauge.getRealColor = function(hudWindow, color) {
    if (typeof(color) == "number") {
      return hudWindow.textColor(color);
    } else {
      return color;
    }
  };

  OrangeHudGauge.drawGauge = function(hudWindow, variableData) {
    var x = this.realX(variableData);
    var y = this.realY(variableData);

    var color1 = this.getRealColor(hudWindow, variableData.GaugeColor1);
    var color2 = this.getRealColor(hudWindow, variableData.GaugeColor2);
    var value = this.getCurrentValue(variableData);
    var maxValue = this.getMaxValue(variableData);
    var rate;
    var width = variableData.Width;
    var height = variableData.Height;

    if (maxValue > 0) {
      rate = parseFloat((value / maxValue).toPrecision(12));
    } else {
      rate = 0;
    }

    if (isNaN(rate)) {
      rate = 0;
    }

    if (!variableData.AllowOverflow) {
      rate = rate.clamp(0, 1);
    }

    if (width > 0 && height > 0) {
      var fillW;
      var fillH;
      var fillX = x;
      var gaugeY = y;
      var fillY = gaugeY;

      if (variableData.Direction === 'left' || variableData.Direction === 'right') {
        fillW = Math.floor(width * rate);
        fillH = height;

        if (variableData.Direction === 'left') {
          fillX = fillX + width - fillW;
        }
      } else {
        fillW = width;
        fillH = Math.floor(height * rate);

        if (variableData.Direction == 'up') {
          fillY = fillY + height - fillH;
        }
      }

      console.log(x, gaugeY, width, height);
      hudWindow.contents.fillRect(x, gaugeY, width, height, hudWindow.gaugeBackColor());
      console.log(fillX, fillY, fillW, fillH);
      hudWindow.contents.gradientFillRect(fillX, fillY, fillW, fillH, color1, color2);
    }
  };

  OrangeHudGauge.getValue = function(variableData) {
    if (variableData.AutoRefresh) {
      return this.getCurrentValue(variableData) + ' / ' + this.getMaxValue(variableData);
    } else {
      return 0;
    }
  };
  
  OrangeHudGauge.getCurrentValue = function(variableData) {
    if (variableData.ScriptValue !== undefined) {
      if (typeof(variableData.ScriptValue) == "function") {
        return parseFloat(variableData.ScriptValue());
      } else {
        return parseFloat(Function("return " + variableData.ScriptValue)());
      }
    } else if (variableData.ValueVariableId > 0) {
      return $gameVariables.value(variableData.ValueVariableId);
    } else {
      return 0;
    }
  };

  OrangeHudGauge.getMaxValue = function(variableData) {
    if (variableData.ScriptMaxValue !== undefined) {
      if (typeof(variableData.ScriptValue) == "function") {
        return parseFloat(variableData.ScriptMaxValue());
      } else {
        return parseFloat(Function("return " + variableData.ScriptMaxValue)());
      }
    } else if (variableData.MaxValueVariableId > 0) {
      return $gameVariables.value(variableData.MaxValueVariableId);
    } else {
      return 0;
    }
  };

  OrangeHudGauge.getKey = function(variableData) {
    return variableData.ValueVariableId;
  };

  OrangeHud.registerLineType('OrangeHudGauge', OrangeHudGauge);
  Imported.OrangeHudGauge = 1.2;
}