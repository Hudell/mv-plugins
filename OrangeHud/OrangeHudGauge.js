/*=============================================================================
 * Orange - Gauge HUD
 * By HUDell - www.hudell.com
 * OrangeHudGauge.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc OrangeHudGauge 1.5.1 - Adds a new Variable Picture to Orange Hud
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

    paramsLine.VariableX = Number(paramsLine.VariableX || 0);
    paramsLine.VariableY = Number(paramsLine.VariableY || 0);
    paramsLine.SwitchId = Number(paramsLine.SwitchId || 0);

    paramsLine.AllowOverflow = paramsLine.AllowOverflow === "true";

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
    var value = this.getVariableValue(variableData);
    var maxValue = this.getMaxValue(variableData);
    var rate;
    var width = variableData.Width;

    if (maxValue > 0) {
      rate = parseFloat((value / maxValue).toPrecision(12));
    } else {
      rate = 0;
    }

    if (!variableData.AllowOverflow) {
      rate = rate.clamp(0, 1);
    }

    if (width > 0) {
      hudWindow.drawGauge(x, y, width, rate, color1, color2);
    }
  };

  OrangeHudGauge.getValue = function(variableData) {
    return this.getVariableValue(variableData) + ' / ' + this.getMaxValue(variableData);
  };
  
  OrangeHudGauge.getVariableValue = function(variableData) {
    if (variableData.ValueVariableId > 0) {
      return $gameVariables.value(variableData.ValueVariableId);
    } else {
      return 0;
    }
  };

  OrangeHudGauge.getMaxValue = function(variableData) {
    if (variableData.MaxValueVariableId > 0) {
      return $gameVariables.value(variableData.MaxValueVariableId);
    } else {
      return 0;
    }
  };

  OrangeHudGauge.getKey = function(variableData) {
    return variableData.ValueVariableId;
  };

  OrangeHud.registerLineType('OrangeHudGauge', OrangeHudGauge);
  Imported["OrangeHudGauge"] = 1.0;
}