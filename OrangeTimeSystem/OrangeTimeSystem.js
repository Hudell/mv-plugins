/*=============================================================================
 * Orange - Time System
 * By Hudell - www.hudell.com
 * OrangeTimeSystem.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Adds a time system to your game
 * @author Hudell
 *
 * @param secondLength
 * @desc How many real time milliseconds should an ingame second last
 * Default: 1000
 * @default 1000
 *
 * @param minuteLength
 * @desc How many ingame seconds should an ingame minute last
 * Default: 6
 * @default 6
 *
 * @param hourLength
 * @desc How many ingame minutes should an ingame hour last
 * Default: 6
 * @default 6
 *
 * @param dayLength
 * @desc How many ingame hours should an ingame day last
 * Default: 24
 * @default 24
 *
 * @param weekLength
 * @desc How many ingame days should an ingame week last
 * Default: 7
 * @default 7
 *
 * @param monthLength
 * @desc How many ingame days should an ingame month last
 * Default: 31
 * @default 31
 *
 * @param yearLength
 * @desc How many ingame months should an ingame year last
 * Default: 4
 * @default 4
 *
 * @param dayPeriod1Hour
 * @desc At what hour does night turn into early morning
 * Default: 6
 * @default 6
 *
 * @param dayPeriod2Hour
 * @desc At what hour does early morning turn into day
 * Default: 9
 * @default 9
 *
 * @param dayPeriod3Hour
 * @desc At what hour does day turn into evening
 * Default: 18
 * @default 18
 *
 * @param dayPeriod4Hour
 * @desc At what hour does evening turn into night
 * Default: 20
 * @default 20
 *
 * @param mainSwitchId
 * @desc The Number of the Switch used to activate the flow of time
 * Default: 0
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * 
 * This plugin creates a time system for your game. Nothing will change on the
 * game itself, unless you use another plugin that uses this one.
 * 
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/time-system
 * 
 */

var Imported = Imported || {};

if (Imported['MVCommons'] === undefined) {
  console.log('Download MVCommons: http://link.hudell.com/mvcommons');
  throw new Error("This library needs MVCommons to work properly!");
}
if (Imported['OrangeEventManager'] === undefined) {
  console.log('Download MVCommons: http://link.hudell.com/event-manager');
  throw new Error("This library needs OrangeEventManager to work properly!");
}

var OrangeTimeSystem = OrangeTimeSystem || MVC.shallowClone(OrangeEventManager);

var DayPeriods = {
  EARLY_MORNING: 1,
  DAY: 2,
  EVENING: 3,
  NIGHT: 4
};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeTimeSystem');
  $.Param = $.Param || {};

  $.Param.secondLength = Number($.Parameters['secondLength'] || 1000);
  $.Param.minuteLength = Number($.Parameters['minuteLength'] || 6);
  $.Param.hourLength = Number($.Parameters['hourLength'] || 6);
  $.Param.dayLength = Number($.Parameters['dayLength'] || 24);
  $.Param.weekLength = Number($.Parameters['weekLength'] || 7);
  $.Param.monthLength = Number($.Parameters['monthLength'] || 31);
  $.Param.yearLength = Number($.Parameters['yearLength'] || 4);
  $.Param.dayPeriod1Hour = Number($.Parameters['dayPeriod1Hour'] || 6);
  $.Param.dayPeriod2Hour = Number($.Parameters['dayPeriod2Hour'] || 9);
  $.Param.dayPeriod3Hour = Number($.Parameters['dayPeriod3Hour'] || 18);
  $.Param.dayPeriod4Hour = Number($.Parameters['dayPeriod4Hour'] || 20);

  var switchId = parseInt($.Parameters['mainSwitchId'], 10);

  if (switchId !== NaN && switchId > 0) {
    $.Param.mainSwitchId = $.Parameters['mainSwitchId'];
  } else {
    $.Param.mainSwitchId = undefined;
  }

  MVC.accessor($, 'seconds');
  MVC.accessor($, 'minute');
  MVC.accessor($, 'hour');
  MVC.accessor($, 'day');
  MVC.accessor($, 'month');
  MVC.accessor($, 'year');
  MVC.accessor($, 'dayPeriod');
  MVC.accessor($, 'weekDay');

  MVC.accessor($, 'paused', function(value) {
    if ($.Param.mainSwitchId !== undefined) {
      $gameSwitches.setValue($.Param.mainSwitchId, !value);
      return;
    }

    this._paused = value;
  }, function() {
    if ($.Param.mainSwitchId !== undefined) {
      return !$gameSwitches.value($.Param.mainSwitchId);
    }

    if (this._paused !== undefined) {
      return this._paused;
    }

    return false;
  });

  $._timeEvents = [];
  $.seconds = 0;
  $.minute = 0;
  $.hour = 0;
  $.day = 1;
  $.month = 1;
  $.year = 1;
  $.dayPeriod = 0;
  $.weekDay = 0;

  $.updateTime = function() {
    if (this.seconds >= $.Param.minuteLength) {
      this.minute += 1;
      this.seconds = 0;

      this._onChangeMinute();
    }

    if (this.minute >= $.Param.hourLength) {
      this.hour += 1;
      this.minute = 0;

      this._onChangeHour();
    }

    if (this.hour >= $.Param.dayLength) {
      this.day += 1;
      this.hour = 0;

      this._onChangeDay();
    }

    if (this.day > $.Param.monthLength) {
      this.month += 1;
      this.day = 1;

      this._onChangeMonth();
    }

    if (this.month > $.Param.yearLength) {
      this.year += 1;
      this.month = 1;

      this._onChangeYear();
    }

    var oldDayPeriod = this.dayPeriod;

    // Calculate day period
    if (this.hour < $.Param.dayPeriod1Hour) {
      this.dayPeriod = 4;
    } else if (this.hour < $.Param.dayPeriod2Hour) {
      this.dayPeriod = 1;
    } else if (this.hour < $.Param.dayPeriod3Hour) {
      this.dayPeriod = 2;
    } else if (this.hour < $.Param.dayPeriod4Hour) {
      this.dayPeriod = 3;
    } else {
      this.dayPeriod = 4;
    }

    if (oldDayPeriod != this.dayPeriod) {
      this._onChangeDayPeriod();
    }

    // Calculate week day
    var previousYears = this.year - 1;
    var previousMonths = previousYears * $.Param.yearLength;
    var numMonths = previousMonths + this.month - 1;
    var numDays = numMonths * $.Param.monthLength + this.day;
    this.weekDay = numDays % $.Param.weekLength;

    this._onUpdateTime();
  };

  $.isEarlyMorning = function() {
    return this.dayPeriod == DayPeriods.EARLY_MORNING;
  };

  $.isMidday = function() {
    return this.dayPeriod == DayPeriods.DAY;
  };

  $.isEvening = function() {
    return this.dayPeriod == DayPeriods.EVENING;
  };

  $.isNight = function() {
    return this.dayPeriod == DayPeriods.NIGHT;
  };

  $.isEnabled = function() {
    return (this._intervalHandler !== undefined);
  };

  $.enableTime = function() {
    if (this._intervalHandler !== undefined) return;

    this._intervalHandler = setInterval(function() {
      $.progressTime();
    }, $.Param.secondLength);
  };

  $.disableTime = function() {
    if (this._intervalHandler === undefined) return;

    clearInterval(this._intervalHandler);
    this._intervalHandler = undefined;
  };

  $.progressTime = function() {
    if (this.paused) return;

    if (SceneManager._scene instanceof Scene_Map) {
      $.seconds += 1;
      $.updateTime();
      $._onChangeSecond();
    }
  };

  $._onChangeSecond = function() {
    this.runEvent('changeSecond');
  };

  $._onChangeMinute = function() {
    this.runEvent('changeMinute');
  };

  $._onChangeHour = function() {
    this.runEvent('changeHour');
  };

  $._onChangeDayPeriod = function() {
    this.runEvent('changeDayPeriod');
  };

  $._onChangeDay = function() {
    this.runEvent('changeDay');
  };

  $._onChangeMonth = function() {
    this.runEvent('changeMonth');
  };

  $._onChangeYear = function() {
    this.runEvent('changeYear');
  };

  $.onTime = function(callback, hour, minute, second) {
    return this.registerTimeEvent({
      hour: hour,
      minute: minute,
      second: second,
      callback: callback
    });
  };

  $.onDate = function(callback, day, month, year) {
    return this.registerTimeEvent({
      day: day,
      month: month,
      year: year,
      callback: callback
    });
  };

  $.onDateTime = function(callback, day, month, year, hour, minute, second) {
    return this.registerTimeEvent({
      day: day,
      month: month,
      year: year,
      hour: hour,
      minute: minute,
      second: second,
      callback: callback
    });
  };

  $.onWeekDay = function(callback, weekDay) {
    return this.registerTimeEvent({
      weekDay: weekDay,
      callback: callback
    });
  };

  $.atDate = $.onDate;
  $.atTime = $.onTime;
  $.atDateTime = $.onDateTime;
  $.atWeekDay = $.onWeekDay;

  $.registerTimeEvent = function(config) {
    this._timeEvents.push(config);
    return this._timeEvents.indexOf(config);
  };

  $._onUpdateTime = function() {
    for (var i = 0; i < this._timeEvents.length; i++) {
      var config = this._timeEvents[i];

      if (config.day !== undefined && config.day != this.day) continue;
      if (config.month !== undefined && config.month != this.month) continue;
      if (config.year !== undefined && config.year != this.year) continue;
      if (config.hour !== undefined && config.hour != this.hour) continue;
      if (config.minute !== undefined && config.minute != this.minute) continue;
      if (config.second !== undefined && config.second != this.seconds) continue;
      if (config.weekDay !== undefined && config.weekDay != this.weekDay) continue;

      this.executeCallback(config.callback);
    }
  };

  $.getDateTime = function() {
    return {
      hour: $.hour,
      minute: $.minute,
      seconds: $.seconds,
      day: $.day,
      month: $.month,
      year: $.year,
      dayPeriod: $.dayPeriod,
      weekDay: $.weekDay,
      paused: $.paused
    };
  };

  $.setDateTime = function(dateTime) {
    this.hour = dateTime.hour || 0;
    this.minute = dateTime.minute || 0;
    this.seconds = dateTime.seconds || 0;
    this.day = dateTime.day || 1;
    this.month = dateTime.month || 1;
    this.year = dateTime.year || 1;
    this.dayPeriod = dateTime.dayPeriod || DayPeriods.EARLY_MORNING;
    this.weekDay = dateTime.weekDay || 0;

    if (dateTime.paused !== undefined) {
      this.paused = dateTime.paused;
    } else {
      this.paused = false;
    }
  };

  var oldDataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    var contents = oldDataManager_makeSaveContents.call(this);

    contents.orangeDateTime = $.getDateTime();
    return contents;
  };

  var oldDataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    oldDataManager_extractSaveContents.call(this, contents);

    if (contents.orangeDateTime !== undefined) {
      $.setDateTime(contents.orangeDateTime);
    }
  };

  $.enableTime();
})(OrangeTimeSystem);

PluginManager.register("OrangeTimeSystem", "1.0.0", "Adds a time system to your game", {
  email: "plugins@hudell.com",
  name: "Hudell",
  website: "http://www.hudell.com"
}, "2015-10-21");
