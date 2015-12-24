/*=============================================================================
 * Orange - Time System Events
 * By Hudell - www.hudell.com
 * OrangeTimeSystemEvents.js
 * Version: 1.3
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
 * @param onChangeTime
 * @desc The number of the common event to call when the time changes
 * @default 0
 *
 * @param onNightPeriod
 * @desc The number of the common event to call when the night starts
 * @default 0
 *
 * @param onEarlyMorningPeriod
 * @desc The number of the common event to call when the night ends
 * @default 0
 *
 * @param onDayPeriod
 * @desc The number of the common event to call when the sun rises
 * @default 0
 *
 * @param onEveningPeriod
 * @desc The number of the common event to call when the sun starts to set
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
  $.Param.onChangeTime = Number($.Parameters['onChangeTime'] || 0);
  $.Param.onNightPeriod = Number($.Parameters['onNightPeriod'] || 0);
  $.Param.onEarlyMorningPeriod = Number($.Parameters['onEarlyMorningPeriod'] || 0);
  $.Param.onDayPeriod = Number($.Parameters['onDayPeriod'] || 0);
  $.Param.onEveningPeriod = Number($.Parameters['onEveningPeriod'] || 0);

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

    if (OrangeTimeSystem.dayPeriod == DayPeriods.NIGHT) {
      if ($.Param.onNightPeriod !== undefined && $.Param.onNightPeriod > 0) {
        this.executeCallback($.Param.onNightPeriod);
      }
    }

    if (OrangeTimeSystem.dayPeriod === DayPeriods.EARLY_MORNING) {
      if ($.Param.onEarlyMorningPeriod !== undefined && $.Param.onEarlyMorningPeriod > 0) {
        this.executeCallback($.Param.onEarlyMorningPeriod);
      }
    }

    if (OrangeTimeSystem.dayPeriod === DayPeriods.DAY) {
      if ($.Param.onDayPeriod !== undefined && $.Param.onDayPeriod > 0) {
        this.executeCallback($.Param.onDayPeriod);
      }
    }

    if (OrangeTimeSystem.dayPeriod === DayPeriods.EVENING) {
      if ($.Param.onEveningPeriod !== undefined && $.Param.onEveningPeriod > 0) {
        this.executeCallback($.Param.onEveningPeriod);
      }
    }
  };

  $.onChangeTime = function() {
    if ($.Param.onChangeTime !== undefined && $.Param.onChangeTime > 0) {
      this.executeCallback($.Param.onChangeTime);
    }
  };

  OrangeTimeSystem.on('changeDay', $.onChangeDay);
  OrangeTimeSystem.on('changeMonth', $.onChangeMonth);
  OrangeTimeSystem.on('changeYear', $.onChangeYear);
  OrangeTimeSystem.on('changeHour', $.onChangeHour);
  OrangeTimeSystem.on('changeMinute', $.onChangeMinute);
  OrangeTimeSystem.on('changeSecond', $.onChangeSecond);
  OrangeTimeSystem.on('changeDayPeriod', $.onChangeDayPeriod);
  OrangeTimeSystem.on('changeTime', $.onChangeTime);

})(OrangeTimeSystemEvents);

Imported["OrangeTimeSystemEvents"] = 1.3;