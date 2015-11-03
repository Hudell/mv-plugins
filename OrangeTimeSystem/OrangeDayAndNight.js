/*=============================================================================
 * Orange - Day and Night
 * By Hudell - www.hudell.com
 * OrangeDayAndNight.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Tints the screen to show the time passing
 *             
 * @author Hudell
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
 * @help
 * Use the following plugin command to update the screen tint immediatelly:
 *
 *   update screen tint
 * 
 * You can specify the duration of the tint effect this way:
 * 
 *   update screen tint in 20 frames
 *
 * 
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

  $.canTintScreen = function() {
    return !OrangeTimeSystem.inside;
  };

  $.onDayPeriodChange = function(){
    $.updateTint($.Param.tintSpeed);
  };

  $.updateTint = function(speed) {
    var dataStr = "";
    var data = [0, 0, 0, 0];

    if ($.canTintScreen()) {
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

      data = dataStr.split(',');
    }

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

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    oldGameInterpreter_pluginCommand.call(this, command, args);

    if (command.toUpperCase() == 'UPDATE') {
      if (args.length >= 2 && args[0].toUpperCase() == 'SCREEN' && args[1].toUpperCase() == 'TINT') {
        var speed = 0;
        if (args.length >= 4 && args[2].toUpperCase() == 'IN') {
          speed = parseInt(args[3], 10);
        }

        $.updateTint(speed);
      }
    }
  };  
})(OrangeDayAndNight);

Imported["OrangeDayAndNight"] = 1.3;