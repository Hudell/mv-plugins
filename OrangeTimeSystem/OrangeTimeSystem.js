/*=============================================================================
 * Orange - Time System
 * By Hudell - www.hudell.com
 * OrangeTimeSystem.js
 * Version: 1.3
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Adds a time system to your game
 * @author Hudell
 *
 * @param useRealTime
 * @desc If true, the time "Length" variables will be ignored and the plugin will use the real time
 * @default false
 *
 * @param secondLength
 * @desc How many real time milliseconds should an ingame second last
 * @default 1000
 *
 * @param minuteLength
 * @desc How many ingame seconds should an ingame minute last
 * @default 6
 *
 * @param hourLength
 * @desc How many ingame minutes should an ingame hour last
 * @default 6
 *
 * @param dayLength
 * @desc How many ingame hours should an ingame day last
 * @default 24
 *
 * @param weekLength
 * @desc How many ingame days should an ingame week last
 * @default 7
 *
 * @param monthLength
 * @desc How many ingame days should an ingame month last
 * @default 31
 *
 * @param yearLength
 * @desc How many ingame months should an ingame year last
 * @default 4
 *
 * @param dayPeriod1Hour
 * @desc At what hour does night turn into early morning
 * @default 6
 *
 * @param dayPeriod2Hour
 * @desc At what hour does early morning turn into day
 * @default 9
 *
 * @param dayPeriod3Hour
 * @desc At what hour does day turn into evening
 * @default 18
 *
 * @param dayPeriod4Hour
 * @desc At what hour does evening turn into night
 * @default 20
 *
 * @param mainSwitchId
 * @desc The Number of the Switch used to activate the flow of time
 * @default 0
 *
 * @param pauseClockDuringConversations
 * @desc If true, it will stop the flow of time while messages are being displayed on screen.
 * @default true
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
  var MVC = {};

  (function($){ 
    $.isArray = function(obj) { return Object.prototype.toString.apply(obj) === '[object Array]'; };
    $.shallowClone = function(obj) { var result; if ($.isArray(obj)) { return obj.slice(0); } else if (obj && !obj.prototype && (typeof obj == 'object' || obj instanceof Object)) { result = {}; for (var p in obj) { result[p] = obj[p]; } return result; } return obj;  };
    $.defaultGetter = function(name) { return function () { return this['_' + name]; }; };
    $.defaultSetter = function(name) { return function (value) { var prop = '_' + name; if ((!this[prop]) || this[prop] !== value) { this[prop] = value; if (this._refresh) { this._refresh(); } } }; };
    $.accessor = function(value, name /* , setter, getter */) { Object.defineProperty(value, name, { get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name), set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name), configurable: true });};
  })(MVC);

  if (Utils.isOptionValid('test')) {
    console.log('MVC not found, OrangeTimeSystem will be using essentials (copied from MVC 1.2.1).');
  }
}

if (Imported['OrangeEventManager'] === undefined) {
  var OrangeEventManager = {};
  (function($) { "use strict"; $._events = [];  $.on = function(eventName, callback) {    if (this._events[eventName] === undefined) this._events[eventName] = [];    this._events[eventName].push(callback);  };  $.un = function(eventName, callback) {    if (this._events[eventName] === undefined) return;    for (var i = 0; i < this._events[eventName].length; i++) {      if (this._events[eventName][i] == callback) {        this._events[eventName][i] = undefined;        return;      }    }  };  $.executeCallback = function(callback) {    if (typeof(callback) == "function") {      return callback.call(this);    }    if (typeof(callback) == "number") {      $gameTemp.reserveCommonEvent(callback);      return true;    }    if (typeof(callback) == "string") {      if (parseInt(callback, 10) == callback.trim()) {        $gameTemp.reserveCommonEvent(parseInt(callback, 10));        return true;      }      return eval(callback);    }        console.error("Unknown callback type: ", callback);    return undefined;  };  $.runEvent = function(eventName) {    if (this._events[eventName] === undefined) return;    for (var i = 0; i < this._events[eventName].length; i++) {      var callback = this._events[eventName][i];      if (this.executeCallback(callback) === false) {        break;      }    }  };})(OrangeEventManager);
  Imported["OrangeEventManager"] = 1;

  if (Utils.isOptionValid('test')) {
    console.log('No OrangeEventManager plugin not found, OrangeTimeSystem will be using it\'s internal copy of version 1.0.');
  }
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

  $.Param.useRealTime = $.Parameters["useRealTime"] == "true";
  if ($.Param.useRealTime) {
    $.Param.secondLength = 1000;
  } else {
    $.Param.secondLength = Number($.Parameters['secondLength'] || 1000);
  }
  
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

  $.Param.pauseClockDuringConversations = $.Parameters["pauseClockDuringConversations"] !== "false";

  var switchId = parseInt($.Parameters['mainSwitchId'], 10);

  if (switchId !== NaN && switchId > 0) {
    $.Param.mainSwitchId = switchId;
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
      if ($gameSwitches === undefined || $gameSwitches === null) return true;
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

  $.runTimeChangeEvents = function(oldData) {
    if (oldData.seconds != this.seconds) {
      this._onChangeSecond();
    }

    if (oldData.minute !== this.minute) {
      this._onChangeMinute();
    }

    if (oldData.hour !== this.hour) {
      this._onChangeHour();
    }

    if (oldData.day !== this.day) {
      this._onChangeDay();
    }

    if (oldData.month !== this.month) {
      this._onChangeMonth();
    }

    if (oldData.year !== this.year) {
      this._onChangeYear();
    }

    if (oldData.dayPeriod !== this.dayPeriod) {
      this._onChangeDayPeriod();
    }
  };

  $.updateTime = function(runEvents) {
    if (runEvents === undefined) runEvents = true;

    var oldData = $.getDateTime();

    while (this.seconds >= $.Param.minuteLength) {
      this.minute += 1;
      this.seconds -= $.Param.minuteLength;
    }

    while (this.minute >= $.Param.hourLength) {
      this.hour += 1;
      this.minute -= $.Param.hourLength;
    }

    while (this.hour >= $.Param.dayLength) {
      this.day += 1;
      this.hour -= $.Param.dayLength;
    }

    while (this.day > $.Param.monthLength) {
      this.month += 1;
      this.day -= $.Param.monthLength;
    }

    while (this.month > $.Param.yearLength) {
      this.year += 1;
      this.month -= $.Param.yearLength;
    }

    this.updateDayPeriod();

    if (runEvents) {
      this.runTimeChangeEvents(oldData);
    }

    // Calculate week day
    var previousYears = this.year - 1;
    var previousMonths = previousYears * $.Param.yearLength;
    var numMonths = previousMonths + this.month - 1;
    var numDays = numMonths * $.Param.monthLength + this.day;
    this.weekDay = numDays % $.Param.weekLength;

    this._onUpdateTime();
  };

  $.updateDayPeriod = function() {
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

  $.loadRealTime = function() {
    var date = new Date();
    var oldData = this.getDateTime();
    var anyChanged = false;

    $.seconds = date.getSeconds();
    $.minute = date.getMinutes();
    $.hour = date.getHours();
    $.day = date.getDate();
    $.month = date.getMonth() + 1;
    $.year = date.getFullYear();
    $.weekDay = date.getDay();
    $.updateDayPeriod();

    if ($.seconds != oldData.seconds) {
      $._onChangeSecond();
    }

    if ($.minute != oldData.minute) {
      $._onChangeMinute();
    }

    if ($.hour != oldData.hour) {
      $._onChangeHour();
    }

    if ($.day != oldData.day) {
      $._onChangeDay();
    }

    if ($.month != oldData.month) {
      $._onChangeMonth();
    }

    if ($.year != oldData.year) {
      $._onChangeYear();
    }
  };

  $.setTime = function(seconds, minute, hour, day, month, year) {
    var oldData = this.getDateTime();

    if (seconds !== undefined) {
      this.seconds = seconds;
    }

    if (minute !== undefined) {
      this.minute = minute;
    }

    if (hour !== undefined) {
      this.hour = hour;
    }

    if (day !== undefined) {
      this.day = day;
    }

    if (month !== undefined) {
      this.month = month;
    }

    if (year !== undefined) {
      this.year = year;
    }

    $.updateTime(false);
    $.runTimeChangeEvents(oldData);
  };

  $.addSeconds = function(seconds) {
    $.addTime({seconds : seconds});
  };

  $.addMinutes = function(minutes) {
    $.addTime({minutes : minutes});
  };

  $.addHours = function(hours) {
    $.addTime({hours : hours});
  };

  $.addDays = function(days) {
    $.addTime({days : days});
  };

  $.addMonths = function(months) {
    $.addTime({months : months});
  };

  $.addYears = function(years) {
    $.addTime({years : years});
  };

  $.addTime = function(timeData) {
    $.passTime(timeData.seconds, timeData.minutes, timeData.hours, timeData.days, timeData.months, timeData.years);
  };

  $.passTime = function(seconds, minutes, hours, days, months, years) {
    var oldData = this.getDateTime();

    this.seconds += Number(seconds || 0);
    this.minute += Number(minutes || 0);
    this.hour += Number(hours || 0);
    this.day += Number(days || 0);
    this.month += Number(months || 0);
    this.year += Number(years || 0);

    $.updateTime(false);
    $.runTimeChangeEvents(oldData);
  };

  $.isInternallyPaused = function() {
    if ($.Param.pauseClockDuringConversations === true) {
      if ($gameMessage.isBusy()) {
        return true;
      }
    }

    return false;
  };

  $.progressTime = function() {
    if (this.paused) return;
    if (this.isInternallyPaused()) return;

    if ($.Param.useRealTime) {
      $.loadRealTime();
      $._onUpdateTime();
    } else if (SceneManager._scene instanceof Scene_Map) {
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

Imported.OrangeTimeSystem = 1.3;