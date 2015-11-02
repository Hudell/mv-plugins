/*=============================================================================
 * Orange - Day and Night
 * By Hudell - www.hudell.com
 * OrangeDayAndNight.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Tints the screen to show the time passing
 *             
 * @author Hudell
 *=============================================================================
 *
 * @param morningTint
 * @desc Red, Green, Blue and Gray values to use in the morning, comma separated
 * @default -34, -17, 10, 68
 *
 * @param middayTint
 * @desc Red, Green, Blue and Gray values to use during the day, comma separated
 * @default 0, 0, 0, 0
 *
 * @param eveningTint
 * @desc Red, Green, Blue and Gray values to use in the evening, comma separated
 * @default 17, -34, -68, 17
 *
 * @param nightTint
 * @desc Red, Green, Blue and Gray values to use at night, comma separated
 * @default -102, -85, 0, 170
 *
 * @param tintSpeed
 * @desc how many frames should the tint effect take to complete?
 * @default 300
 *
 * @param insideSwitch
 * @desc when this switch is on, the screen will not be tinted
 * @default 0
 */
var Imported = Imported || {};

if (Imported["OrangeTimeSystem"] === undefined) {
  console.log('Download OrangeTimeSystem: http://link.hudell.com/time-system');
  throw new Error("This library requires the OrangeTimeSystem!");
}

var OrangeDayAndNight = OrangeDayAndNight || MVC.shallowClone(OrangeEventManager);

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeDayAndNight');
  $.Param = $.Param || {};

  $.Param.morningTint = $.Parameters['morningTint'] || "-34, -17, 10, 68";
  $.Param.middayTint = $.Parameters['middayTint'] || "0, 0, 0, 0";
  $.Param.eveningTint = $.Parameters['eveningTint'] || "17, -34, -68, 17";
  $.Param.nightTint = $.Parameters['nightTint'] || "-102, -85, 0, 170";

  $.Param.tintSpeed = Number($.Parameters['tintSpeed'] || 0);
  $.Param.insideSwitch = Number($.Parameters['insideSwitch'] || 0);

  $.canTintScreen = function() {
    if ($.Param.insideSwitch > 0) {
      if ($gameSwitches.value($.Param.insideSwitch)) {
        return false;
      }
    }

    return true;
  };

  $.onDayPeriodChange = function(){
    $.updateTint($.Param.tintSpeed);
  };

  $.updateTint = function(speed) {
    if (!$.canTintScreen()) {
      return;
    }

    var dataStr = "";

    switch(OrangeTimeSystem.dayPeriod) {
      case 1 :
        dataStr = $.Param.morningTint;
        break;
      case 2 :
        dataStr = $.Param.middayTint;
        break;
      case 3 :
        dataStr = $.Param.eveningTint;
        break;
      case 4 :
        dataStr = $.Param.nightTint;
        break;
      default :
        return;
    }

    var data = dataStr.split(',');
    if (data.length > 0) {
      data[0] = parseInt(data[0], 10);
    } else {
      data.push(0);
    }
    if (data.length > 1) {
      data[1] = parseInt(data[1], 10);
    } else {
      data.push(0);
    }
    if (data.length > 2) {
      data[2] = parseInt(data[2], 10);
    } else {
      data.push(0);
    }
    if (data.length > 3) {
      data[3] = parseInt(data[3], 10);
    } else {
      data.push(0);
    }

    $gameScreen.startTint(data, speed);
  };

  OrangeTimeSystem.on('changeDayPeriod', $.onDayPeriodChange);

  var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function() {
    oldGamePlayer_performTransfer.call(this);
    $.updateTint(1);
  };
})(OrangeDayAndNight);

Imported["OrangeDayAndNight"] = 1.1;