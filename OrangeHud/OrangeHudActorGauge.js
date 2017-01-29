/*=============================================================================
 * Orange - Actor Gauge HUD
 * By HUDell - www.hudell.com
 * OrangeHudActorGauge.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc OrangeHudActorGauge 1.2 - Adds a new Gauge to Orange Hud
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
 * @param ValueExpression
 * @desc The expression for the the value. Click the help button for more info.
 * @default <hp>
 *
 * @param MaxValueExpression
 * @desc The expression for the the max value. Click the help button for more info.
 * @default <mhp>
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
 * ============================================================================
 * My Blog:
 * ============================================================================
 * http://hudell.com
 * ============================================================================
 * Valid variables:
 * ============================================================================
 * <hp>
 * <mp>
 * <tp>
 * <mhp>
 * <mmp>
 * <atk>
 * <def>
 * <mat>
 * <mdf>
 * <agi>
 * <luk>
 * <hit>
 * <eva>
 * <cri>
 * <cev>
 * <mev>
 * <mrf>
 * <cnt>
 * <hrg>
 * <mrg>
 * <trg>
 * <tgr>
 * <grd>
 * <rec>
 * <pha>
 * <mcr>
 * <tcr>
 * <pdr>
 * <mdr>
 * <fdr>
 * <exr>
 * <level>
 * <maxlevel>
 * */

var Imported = Imported || {};

if (Imported.OrangeHud === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudActorGauge!");
}
if (Imported.OrangeHud < 1.7) {
  throw new Error("Please update OrangeHud!");
}

var OrangeHudActorGauge = OrangeHudActorGauge || {};

if (Imported.OrangeHudActorGauge === undefined) {
  OrangeHudActorGauge.validateParams = function(paramsLine) {
    paramsLine.GroupName = paramsLine.GroupName || "main";
    
    paramsLine.ValueExpression = paramsLine.ValueExpression || "";
    paramsLine.MaxValueExpression = paramsLine.MaxValueExpression || "";

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
      paramsLine.ScriptValue = Function("return " + paramsLine.ScriptValue); // jshint ignore:line
    }

    if (paramsLine.ScriptMaxValue !== undefined && paramsLine.ScriptMaxValue.trim() === "") {
      paramsLine.ScriptMaxValue = undefined;
    } else {
      paramsLine.ScriptMaxValue = Function("return " + paramsLine.ScriptMaxValue); //jshint ignore:line
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

  OrangeHudActorGauge.realX = function(variableData) {
    var x = variableData.X;

    if (variableData.VariableX > 0) {
      x = $gameVariables.value(variableData.VariableX);
    }

    return x;
  };

  OrangeHudActorGauge.realY = function(variableData) {
    var y = variableData.Y;

    if (variableData.VariableY > 0) {
      y = $gameVariables.value(variableData.VariableY);
    }

    return y;
  };

  OrangeHudActorGauge.drawLine = function(hudWindow, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    this.drawGauge(hudWindow, variableData);
  };

  OrangeHudActorGauge.getRealColor = function(hudWindow, color) {
    if (typeof(color) == "number") {
      return hudWindow.textColor(color);
    } else {
      return color;
    }
  };

  OrangeHudActorGauge.drawGauge = function(hudWindow, variableData) {
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

      hudWindow.contents.fillRect(x, gaugeY, width, height, hudWindow.gaugeBackColor());
      hudWindow.contents.gradientFillRect(fillX, fillY, fillW, fillH, color1, color2);
    }
  };

  OrangeHudActorGauge.getValue = function(variableData) {
    if (variableData.AutoRefresh) {
      return this.getCurrentValue(variableData) + ' / ' + this.getMaxValue(variableData);
    } else {
      return 0;
    }
  };
  
  OrangeHudActorGauge.getCurrentValue = function(variableData) {
    if (variableData.ScriptValue !== undefined) {
      if (typeof(variableData.ScriptValue) == "function") {
        return parseFloat(variableData.ScriptValue());
      } else {
        return parseFloat(Function("return " + variableData.ScriptValue)()); //jshint ignore:line
      }
    } else {
      return OrangeHudActorGauge.getActorValue(variableData, variableData.ValueExpression);
    }
  };

  OrangeHudActorGauge.getActorValue = function(variableData, expression) {
    var members = $gameParty.members();
    if (members.length > variableData.ActorIndex) {
      var actorData = members[variableData.ActorIndex];

      expression = expression.replace(/<hp>/gi, actorData.hp);
      expression = expression.replace(/<mp>/gi, actorData.mp);
      expression = expression.replace(/<tp>/gi, actorData.tp);
      expression = expression.replace(/<mhp>/gi, actorData.mhp);
      expression = expression.replace(/<mmp>/gi, actorData.mmp);
      expression = expression.replace(/<atk>/gi, actorData.atk);
      expression = expression.replace(/<def>/gi, actorData.def);
      expression = expression.replace(/<mat>/gi, actorData.mat);
      expression = expression.replace(/<mdf>/gi, actorData.mdf);
      expression = expression.replace(/<agi>/gi, actorData.agi);
      expression = expression.replace(/<luk>/gi, actorData.luk);
      expression = expression.replace(/<hit>/gi, actorData.hit);
      expression = expression.replace(/<eva>/gi, actorData.eva);
      expression = expression.replace(/<cri>/gi, actorData.cri);
      expression = expression.replace(/<cev>/gi, actorData.cev);
      expression = expression.replace(/<mev>/gi, actorData.mev);
      expression = expression.replace(/<mrf>/gi, actorData.mrf);
      expression = expression.replace(/<cnt>/gi, actorData.cnt);
      expression = expression.replace(/<hrg>/gi, actorData.hrg);
      expression = expression.replace(/<mrg>/gi, actorData.mrg);
      expression = expression.replace(/<trg>/gi, actorData.trg);
      expression = expression.replace(/<tgr>/gi, actorData.tgr);
      expression = expression.replace(/<grd>/gi, actorData.grd);
      expression = expression.replace(/<rec>/gi, actorData.rec);
      expression = expression.replace(/<pha>/gi, actorData.pha);
      expression = expression.replace(/<mcr>/gi, actorData.mcr);
      expression = expression.replace(/<tcr>/gi, actorData.tcr);
      expression = expression.replace(/<pdr>/gi, actorData.pdr);
      expression = expression.replace(/<mdr>/gi, actorData.mdr);
      expression = expression.replace(/<fdr>/gi, actorData.fdr);
      expression = expression.replace(/<exr>/gi, actorData.exr);
      expression = expression.replace(/<level>/gi, actorData.level);
      expression = expression.replace(/<maxlevel>/gi, actorData.maxLevel());
      expression = expression.replace(/<exp>/gi, actorData.currentExp());

      try {
        return parseFloat(Function("return " + expression)()); //jshint ignore:line
      }
      catch(e) {
        console.error(e);
        return 0;
      }
    } else {
      return 0;
    }
  };

  OrangeHudActorGauge.getMaxValue = function(variableData) {
    if (variableData.ScriptMaxValue !== undefined) {
      if (typeof(variableData.ScriptMaxValue) == "function") {
        return parseFloat(variableData.ScriptMaxValue());
      } else {
        return parseFloat(Function("return " + variableData.ScriptMaxValue)()); //jshint ignore:line
      }
    } else {
      return OrangeHudActorGauge.getActorValue(variableData, variableData.MaxValueExpression);
    }
  };

  OrangeHudActorGauge.getKey = function(variableData) {
    return variableData.ValueVariableId;
  };

  OrangeHud.registerLineType('OrangeHudActorGauge', OrangeHudActorGauge);
  Imported.OrangeHudActorGauge = 1.0;
}