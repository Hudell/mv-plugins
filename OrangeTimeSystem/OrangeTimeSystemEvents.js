/*=============================================================================
 * Orange - Time System Events
 * By Hudell - www.hudell.com
 * OrangeTimeSystemEvents.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Allow you to configure common events to be called when the time system changes
 *             
 * @author Hudell
 *=============================================================================
 *
 * @param onChangeSecond
 * @desc The number of the common event to call when the second change
 * @default 0
 *
 * @param onChangeMinute
 * @desc The number of the common event to call when the minute change
 * @default 0
 *
 * @param onChangeHour
 * @desc The number of the common event to call when the hour change
 * @default 0
 *
 * @param onChangeDay
 * @desc The number of the common event to call when the day change
 * @default 0
 *
 * @param onChangeMonth
 * @desc The number of the common event to call when the month change
 * @default 0
 *
 * @param onChangeYear
 * @desc The number of the common event to call when the year change
 * @default 0
 *
 * @param onChangeDayPeriod
 * @desc The number of the common event to call when the day period change
 * @default 0
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/time-system-events
 * 
 *=============================================================================*/
var Imported = Imported || {};

if (Imported["OrangeTimeSystem"] === undefined) {
  console.log('Download OrangeTimeSystem: http://link.hudell.com/time-system');
  throw new Error("This library requires the OrangeTimeSystem!");
}

var OrangeTimeSystemEvents = OrangeTimeSystemEvents || MVC.shallowClone(OrangeEventManager);

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeTimeSystemEvents');
  $.Param = $.Param || {};

  $.Param.onChangeDay = Number($.Parameters['onChangeDay'] || 0);
  $.Param.onChangeMonth = Number($.Parameters['onChangeMonth'] || 0);
  $.Param.onChangeYear = Number($.Parameters['onChangeYear'] || 0);
  $.Param.onChangeHour = Number($.Parameters['onChangeHour'] || 0);
  $.Param.onChangeMinute = Number($.Parameters['onChangeMinute'] || 0);
  $.Param.onChangeSecond = Number($.Parameters['onChangeSecond'] || 0);
  $.Param.onChangeDayPeriod = Number($.Parameters['onChangeDayPeriod'] || 0);

  $.onChangeDay = function() {
    if ($.Param.onChangeDay !== undefined && $.Param.onChangeDay > 0) {
      this.executeCallback($.Param.onChangeDay);
    }
  };

  $.onChangeMonth = function() {
    if ($.Param.onChangeMonth !== undefined && $.Param.onChangeMonth > 0) {
      this.executeCallback($.Param.onChangeMonth);
    }
  };

  $.onChangeYear = function() {
    if ($.Param.onChangeYear !== undefined && $.Param.onChangeYear > 0) {
      this.executeCallback($.Param.onChangeYear);
    }
  };

  $.onChangeHour = function() {
    if ($.Param.onChangeHour !== undefined && $.Param.onChangeHour > 0) {
      this.executeCallback($.Param.onChangeHour);
    }
  };

  $.onChangeMinute = function() {
    if ($.Param.onChangeMinute !== undefined && $.Param.onChangeMinute > 0) {
      this.executeCallback($.Param.onChangeMinute);
    }
  };

  $.onChangeSecond = function() {
    if ($.Param.onChangeSecond !== undefined && $.Param.onChangeSecond > 0) {
      this.executeCallback($.Param.onChangeSecond);
    }
  };

  $.onChangeDayPeriod = function() {
    if ($.Param.onChangeDayPeriod !== undefined && $.Param.onChangeDayPeriod > 0) {
      this.executeCallback($.Param.onChangeDayPeriod);
    }
  };

  OrangeTimeSystem.on('changeDay', $.onChangeDay);
  OrangeTimeSystem.on('changeMonth', $.onChangeMonth);
  OrangeTimeSystem.on('changeYear', $.onChangeYear);
  OrangeTimeSystem.on('changeHour', $.onChangeHour);
  OrangeTimeSystem.on('changeMinute', $.onChangeMinute);
  OrangeTimeSystem.on('changeSecond', $.onChangeSecond);
  OrangeTimeSystem.on('changeDayPeriod', $.onChangeDayPeriod);

})(OrangeTimeSystemEvents);

Imported["OrangeTimeSystemEvents"] = 1.1;