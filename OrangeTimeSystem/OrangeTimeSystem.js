/*=============================================================================
 * Orange - Time System
 * By Hudell - www.hudell.com
 * OrangeTimeSystem.js
 * Version: 2.5
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Adds a time system to your game
 * @author Hudell
 *
 * @param useRealTimeStructure
 * @desc If true, the time "Length" (except secondLength) variables will be ignored and the plugin will use the real time structure
 * @default false
 *
 * @param useRealTime
 * @desc If true, the time will be synced with the player's computer
 * @default false
 *
 * @param secondLength
 * @desc How many real time milliseconds should an ingame second last
 * @default 100
 *
 * @param secondLengthDuringTest
 * @desc Use a different testLength during playtest
 * @default 0
 *
 * @param secondLengthVariable
 * @desc Load the length of the second from a variable instead of a fixed value
 * @default 0
 *
 * @param minuteLength
 * @desc How many ingame seconds should an ingame minute last
 * @default 60
 *
 * @param hourLength
 * @desc How many ingame minutes should an ingame hour last
 * @default 60
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
 * @default 12
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
 * @param initialSecond
 * @desc At what second will the game start?
 * @default 0
 *
 * @param initialMinute
 * @desc At what minute will the game start?
 * @default 0
 *
 * @param initialHour
 * @desc At what hour will the game start?
 * @default 6
 *
 * @param initialDay
 * @desc At what day will the game start?
 * @default 1
 *
 * @param initialMonth
 * @desc At what month will the game start?
 * @default 1
 *
 * @param initialYear
 * @desc At what year will the game start?
 * @default 1
 *
 * @param weekDayOffset
 * @desc Change the value here to a number betwen 0 and 6 to change the week day of the first day of the firstyear
 * @default 0
 *
 * @param dayNames
 * @desc A list of all the day names, separated by comma. If empty, the day number will be used
 * @default Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
 *
 * @param dayShortNames
 * @desc A list of all the day short names, separated by comma. If empty, the day number will be used
 * @default Mon, Tue, Wed, Thur, Fri, Sat, Sun
 *
 * @param monthNames
 * @desc A list of all the month names, separated by comma. If empty, the month number will be used
 * @default January, February, March, April, May, June, July, August, September, October, November, December
 *
 * @param monthShortNames
 * @desc A list of all the month short names, separated by comma. If empty, the month number will be used
 * @default Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
 *
 * @param insideSwitch
 * @desc A switch to indicate if a map is inside a building or closed space
 * @default 0
 *
 * @param tilesetList
 * @desc You can set a list of comma separated tilesets that will always be treated as "inside", regardless of the switch value.
 * @default 
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 * 
 * This plugin creates a time system for your game. Nothing will change on the
 * game itself, unless you use another plugin that uses this one.
 * ============================================================================
 * Plugin Commands and Script Calls
 * ============================================================================
 * The plugin commands for this plugin are written in plain english, using
 * the following formats:
 * 
 * ---------------------------------------------------------------------------- 
 *  COMMAND:   REFRESH TIME SYSTEM
 *  COMMAND:   RESTART TIME SYSTEM
 *  SCRIPT:    OrangeTimeSystem.refreshTimeSystem();
 * ---------------------------------------------------------------------------- 
 * Both commands do the same: They disable the time system and enable it again.
 * This is required when you use the secondLengthVariable param.
 * Call this every time you change the value of that variable for it to work.
 * 
 * 
 * ---------------------------------------------------------------------------- 
 *  COMMAND:   RUN COMMON EVENT 10 IN 6 SECONDS
 *  SCRIPT:    OrangeTimeSystem.runInSecondss(10, 6);
 *
 *  COMMAND:   RUN COMMON EVENT 10 IN 5 MINUTES
 *  SCRIPT:    OrangeTimeSystem.runInMinutes(10, 5);
 *
 *  COMMAND:   RUN COMMON EVENT 10 IN 4 HOURS
 *  SCRIPT:    OrangeTimeSystem.runInHours(10, 4);
 *
 *  COMMAND:   RUN COMMON EVENT 10 IN 1 DAY
 *  SCRIPT:    OrangeTimeSystem.runInDays(10, 1);
 *
 *  COMMAND:   RUN COMMON EVENT 10 IN 2 MONTHS
 *  SCRIPT:    OrangeTimeSystem.runInDays(10, 2);
 *
 *  COMMAND:   RUN COMMON EVENT 10 IN 1 YEAR
 *  SCRIPT:    OrangeTimeSystem.runInYears(10, 1);
 * ---------------------------------------------------------------------------- 
 * Commands in this format will make the specified common event (10 in this example)
 * be triggered when the specified amount of time is passed.
 * This info is saved on the save file.
 * If you are using real time and call "run common event 2 in 1 day"
 * if the player only loads that game three days later, the common event will
 * called anyway (as soon as the player loads the game).
 * The common event will only be triggered once.
 *
 * 
 * ---------------------------------------------------------------------------- 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY HOUR
 *  SCRIPT:    OrangeTimeSystem.on('changeHour', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY MINUTE
 *  SCRIPT:    OrangeTimeSystem.on('changeMinute', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY SECOND
 *  SCRIPT:    OrangeTimeSystem.on('changeSecond', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY DAY
 *  SCRIPT:    OrangeTimeSystem.on('changeDay', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY MONTH
 *  SCRIPT:    OrangeTimeSystem.on('changeMonth', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY YEAR
 *  SCRIPT:    OrangeTimeSystem.on('changeYear', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY PERIOD
 *  SCRIPT:    OrangeTimeSystem.on('changeDayPeriod', 10);
 * 
 *  COMMAND:   RUN COMMON EVENT 10 EVERY TIME
 *  SCRIPT:    OrangeTimeSystem.on('changeTime', 10);
 * ---------------------------------------------------------------------------- 
 * Commands in this format will trigger the specified common event every time
 * the specified variable changes.
 * 
 * 
 * ---------------------------------------------------------------------------- 
 *  COMMAND:   RUN COMMON EVENT 10 ON HOUR 10 MINUTE 20
 *  COMMAND:   RUN COMMON EVENT 10 ON DAY 1 HOUR 20 MINUTE 15
 *  COMMAND:   RUN COMMON EVENT 10 ON YEAR 2 DAY 1 HOUR 15
 *  COMMAND:   RUN COMMON EVENT 10 ON PERIOD 2
 * 
 *  SCRIPT:    OrangeTimeSystem.onDateTime(commonEvent, day, month, year, hour, minute, second)
 *  SCRIPT:    OrangeTimeSystem.onTime(commonEvent, hour, minute, second)
 *  SCRIPT:    OrangeTimeSystem.onDayPeriod(commonEvent, dayPeriod)
 * ---------------------------------------------------------------------------- 
 * Those script calls will trigger the specified commonEvent at the exact datetime
 * specified.
 * 
 * For example, to trigger common event 10 at 11:50:21, call:
 * 
 *  SCRIPT:    OrangeTimeSystem.onTime(10, 11, 50, 21)
 *  COMMAND:   RUN COMMON EVENT 10 ON HOUR 11 MINUTE 50 SECOND 21
 * 
 * If you don't want to specify any of the variables, use the word undefined.
 * For example, to trigger common event 10 at every hour when the minutes turn 50, call:
 * 
 *  SCRIPT:    OrangeTimeSystem.onTime(10, undefined, 50, 0)
 *  COMMAND:   RUN COMMON EVENT 10 ON MINUTE 50 SECOND 0
 * 
 * This will trigger the event at 00:50:00, 01:50:00, 02:50:00 and so on.
 * 
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/time-system
 * 
 */


var Imported = Imported || {};
var none = undefined;

if (Imported['MVCommons'] === undefined) {
  var MVC = MVC || {};

  (function($){ 
    $.isArray = function(obj) { return Object.prototype.toString.apply(obj) === '[object Array]'; };
    $.shallowClone = function(obj) { var result; if ($.isArray(obj)) { return obj.slice(0); } else if (obj && !obj.prototype && (typeof obj == 'object' || obj instanceof Object)) { result = {}; for (var p in obj) { result[p] = obj[p]; } return result; } return obj;  };
    $.defaultGetter = function(name) { return function () { return this['_' + name]; }; };
    $.defaultSetter = function(name) { return function (value) { var prop = '_' + name; if ((!this[prop]) || this[prop] !== value) { this[prop] = value; if (this._refresh) { this._refresh(); } } }; };
    $.accessor = function(value, name /* , setter, getter */) { Object.defineProperty(value, name, { get: arguments.length > 3 ? arguments[3] : $.defaultGetter(name), set: arguments.length > 2 ? arguments[2] : $.defaultSetter(name), configurable: true });};
    $.reader = function(obj, name /*, getter */) { Object.defineProperty(obj, name, { get: arguments.length > 2 ? arguments[2] : defaultGetter(name), configurable: true }); };
  })(MVC);

  Number.prototype.fix = function() { return parseFloat(this.toPrecision(12)); };
  Number.prototype.floor = function() { return Math.floor(this.fix()); };

  if (Utils.isOptionValid('test')) {
    console.log('MVC not found, OrangeTimeSystem will be using essentials (copied from MVC 1.2.1).');
  }
}

if (Imported['OrangeEventManager'] === undefined) {
  var OrangeEventManager = {};
  (function($) {"use strict";$._events = [];var oldGameTemp_initialize = Game_Temp.prototype.initialize;Game_Temp.prototype.initialize = function() {oldGameTemp_initialize.call(this);this._orangeCommonEvents = [];};Game_Temp.prototype.reserveOrangeCommonEvent = function(commonEventId) {if (commonEventId > 0) {this._orangeCommonEvents = this._orangeCommonEvents || [];this._orangeCommonEvents.push(commonEventId);}};var oldGameInterpreter_setupReservedCommonEvent = Game_Interpreter.prototype.setupReservedCommonEvent;Game_Interpreter.prototype.setupReservedCommonEvent = function() {var result = oldGameInterpreter_setupReservedCommonEvent.call(this);if (result) return result;if (!$gameTemp._orangeCommonEvents) return result;if ($gameTemp._orangeCommonEvents.length > 0) {var commonEventId = $gameTemp._orangeCommonEvents.shift();var commonEvent = $dataCommonEvents[commonEventId];this.setup(commonEvent.list);return true;}return result;};$.on = function(eventName, callback) {if (this._events[eventName] === undefined) this._events[eventName] = [];this._events[eventName].push(callback);};$.un = function(eventName, callback) {if (this._events[eventName] === undefined) return;for (var i = 0; i < this._events[eventName].length; i++) {if (this._events[eventName][i] == callback) {this._events[eventName][i] = undefined;return;}}};$.executeCallback = function(callback) {if (typeof(callback) == "function") {return callback.call(this);}if (typeof(callback) == "number") {$gameTemp.reserveOrangeCommonEvent(callback);return true;}if (typeof(callback) == "string") {var id = parseInt(callback, 10);if (parseInt(callback, 10) == callback.trim()) {$gameTemp.reserveOrangeCommonEvent(parseInt(callback, 10));return true;} else if (callback.substr(0, 1) == 'S') {var data = callback.split(',');var value = 'TRUE';if (data.length >= 2) {value = data[1].toUppercase();}$gameSwitches.setValue(id, value !== 'FALSE' && value !== 'OFF'); return true;}return eval(callback);}console.error("Unknown callback type: ", callback);return undefined;};$.runEvent = function(eventName) {if (this._events[eventName] === undefined) return;for (var i = 0; i < this._events[eventName].length; i++) {var callback = this._events[eventName][i];if (this.executeCallback(callback) === false) {break;}}};})(OrangeEventManager);

  Imported["OrangeEventManager"] = 1.1;

  if (Utils.isOptionValid('test')) {
    console.log('OrangeTimeSystem will be using it\'s internal copy of OrangeEventManager 1.1.');
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
  $.Param.useRealTimeStructure = $.Parameters["useRealTimeStructure"] == "true";
  
  if ($.Param.useRealTime) {
    $.Param.secondLength = 1000;
  } else {
    $.Param.secondLength = Number($.Parameters['secondLength'] || 100);

    if (Utils.isOptionValid('test')) {
      var testingLength = Number($.Parameters["secondLengthDuringTest" || 0]);
      if (testingLength > 0) {
        $.Param.secondLength = testingLength;
      }
    }
  }

  if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
    $.Param.yearLength = 12;
    $.Param.minuteLength = 60;
    $.Param.hourLength = 60;
    $.Param.dayLength = 24;
    $.Param.weekLength = 7;
    $.Param.monthLength = 31;
  } else {
    $.Param.yearLength = Number($.Parameters['yearLength'] || 12);
    $.Param.minuteLength = Number($.Parameters['minuteLength'] || 60);
    $.Param.hourLength = Number($.Parameters['hourLength'] || 60);
    $.Param.dayLength = Number($.Parameters['dayLength'] || 24);
    $.Param.weekLength = Number($.Parameters['weekLength'] || 7);
    $.Param.monthLength = Number($.Parameters['monthLength'] || 31);
  }
  
  $.Param.secondLengthVariable = Number($.Parameters['secondLengthVariable'] || 0);
  
  $.Param.initialSecond = Number($.Parameters['initialSecond'] || 0);
  $.Param.initialMinute = Number($.Parameters['initialMinute'] || 0);
  $.Param.initialHour = Number($.Parameters['initialHour'] || 6);
  $.Param.initialDay = Number($.Parameters['initialDay'] || 1);
  $.Param.initialMonth = Number($.Parameters['initialMonth'] || 1);
  $.Param.initialYear = Number($.Parameters['initialYear'] || 1);

  $.Param.dayPeriod1Hour = Number($.Parameters['dayPeriod1Hour'] || 6);
  $.Param.dayPeriod2Hour = Number($.Parameters['dayPeriod2Hour'] || 9);
  $.Param.dayPeriod3Hour = Number($.Parameters['dayPeriod3Hour'] || 18);
  $.Param.dayPeriod4Hour = Number($.Parameters['dayPeriod4Hour'] || 20);

  $.Param.insideSwitch = Number($.Parameters['insideSwitch'] || 0);
  $.Param.tilesetList = ($.Parameters["tilesetList"] || '').split(',');

  for (var i = 0; i < $.Param.tilesetList.length; i++) {
    $.Param.tilesetList[i] = parseInt($.Param.tilesetList[i], 10);
  }  

  $.Param.weekDayOffset = Number($.Parameters['weekDayOffset'] || 1);
  $.Param.pauseClockDuringConversations = $.Parameters["pauseClockDuringConversations"] !== "false";  

  var switchId = parseInt($.Parameters['mainSwitchId'], 10);

  var monthNames = ($.Parameters.monthNames || "").trim();
  var monthShortNames = ($.Parameters.monthShortNames || "").trim();
  var dayNames = ($.Parameters.dayNames || "").trim();
  var dayShortNames = ($.Parameters.dayShortNames || "").trim();

  if (monthNames.length > 0) {
    $.Param.monthNames = monthNames.split(',');
  } else {
    $.Param.monthNames = [];
  }

  if (monthShortNames.length > 0) {
    $.Param.monthShortNames = monthShortNames.split(',');
  } else {
    $.Param.monthShortNames = [];
  }

  if (dayNames.length > 0) {
    $.Param.dayNames = dayNames.split(',');
  } else {
    $.Param.dayNames = [];
  }

  if (dayShortNames.length > 0) {
    $.Param.dayShortNames = dayShortNames.split(',');
  } else {
    $.Param.dayShortNames = [];
  }

  while ($.Param.monthNames.length < $.Param.yearLength) {
    $.Param.monthNames.push(($.Param.monthNames.length + 1).toString());
  }
  while ($.Param.monthShortNames.length < $.Param.yearLength) {
    $.Param.monthShortNames.push(($.Param.monthShortNames.length + 1).toString());
  }
  while ($.Param.dayNames.length < $.Param.weekLength) {
    $.Param.dayNames.push(($.Param.dayNames.length + 1).toString());
  }
  while ($.Param.dayShortNames.length < $.Param.weekLength) {
    $.Param.dayShortNames.push(($.Param.dayShortNames.length + 1).toString());
  }

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

  MVC.reader($, 'monthName', function(){
    return $.Param.monthNames[(this.month - 1) % $.Param.monthNames.length];
  });

  MVC.reader($, 'monthShortName', function(){
    return $.Param.monthShortNames[(this.month - 1) % $.Param.monthShortNames.length];
  });

  MVC.reader($, 'dayName', function(){
    return $.Param.dayNames[(this.weekDay - 1 + $.Param.dayNames.length) % $.Param.dayNames.length];
  });

  MVC.reader($, 'dayShortName', function(){
    return $.Param.dayShortNames[(this.weekDay - 1 + $.Param.dayShortNames.length) % $.Param.dayShortNames.length];
  });

  MVC.reader($, 'inside', function(){
    if (SceneManager._scene instanceof Scene_Map) {
      if ($.Param.tilesetList.length > 0) {
        if ($dataMap !== null) {
          if ($.Param.tilesetList.indexOf($dataMap.tilesetId) >= 0) {
            return true;
          }
        }
      }

      if ($.Param.insideSwitch > 0) {
        if ($gameSwitches.value($.Param.insideSwitch)) {
          return true;
        }
      }
    }

    return false;    
  });

  $.seconds = $.Param.initialSecond;
  $.minute = $.Param.initialMinute;
  $.hour = $.Param.initialHour;
  $.day = $.Param.initialDay;
  $.month = $.Param.initialMonth;
  $.year = $.Param.initialYear;

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
  $._afterTimeEvents = [];
  $.seconds = 0;
  $.minute = 0;
  $.hour = 0;
  $.day = 1;
  $.month = 1;
  $.year = 1;
  $.dayPeriod = 0;
  $.weekDay = 0;

  $.runTimeChangeEvents = function(oldData) {
    var changedTime = false;

    if (oldData.seconds != this.seconds) {
      changedTime = true;
      this._onChangeSecond();
    }

    if (oldData.minute !== this.minute) {
      changedTime = true;
      this._onChangeMinute();
    }

    if (oldData.hour !== this.hour) {
      changedTime = true;
      this._onChangeHour();
    }

    if (oldData.day !== this.day) {
      changedTime = true;
      this._onChangeDay();
    }

    if (oldData.month !== this.month) {
      changedTime = true;
      this._onChangeMonth();
    }

    if (oldData.year !== this.year) {
      changedTime = true;
      this._onChangeYear();
    }

    if (oldData.dayPeriod !== this.dayPeriod) {
      changedTime = true;
      this._onChangeDayPeriod();
    }

    if (changedTime) {
      this._onChangeTime();
    }
  };

  $.convertConfigToTimestamp = function(config) {
    var years = config.year;
    var months = config.month;
    var days = config.day;
    var hours = config.hour;
    var minutes = config.minute;
    var seconds = config.seconds;

    if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
      var dateObj = new Date();
      dateObj.setFullYear(years);
      dateObj.setMonth(months - 1);
      dateObj.setDate(days);
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      dateObj.setSeconds(seconds);

      return dateObj.getTime();
    } else {
      years -= 1;
      if (years > 0) {
        months += years * $.Param.yearLength;
      }

      months -= 1;
      if (months > 0) {
        days += months * $.Param.monthLength;
      }

      days -= 1;
      if (days > 0) {
        hours += days * $.Param.dayLength;
      }

      if (hours > 0) {
        minutes += hours * $.Param.hourLength;
      }

      if (minutes > 0) {
        seconds += minutes * $.Param.minuteLength;
      }

      return seconds;
    }
  };

  $.convertTimestampToConfig = function(timestamp) {
    if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
      var dateObj = new Date(timestamp);

      return {
        seconds : dateObj.getSeconds(),
        minute : dateObj.getMinutes(),
        hour : dateObj.getHours(),
        day : dateObj.getDate(),
        month : dateObj.getMonth() + 1,
        year : dateObj.getFullYear()
      };
    } else {
      var seconds = timestamp;
      var minutes = 0;
      var hours = 0;
      var days = 0;
      var months = 0;
      var years = 0;

      minutes = (seconds / $.Param.minuteLength).floor();
      seconds -= (minutes * $.Param.minuteLength);

      hours = (minutes / $.Param.hourLength).floor();
      minutes -= (hours * $.Param.hourLength);

      days = (hours / $.Param.dayLength).floor();
      hours -= (days * $.Param.dayLength);

      months = (days / $.Param.monthLength).floor();
      days -= (months * $.Param.monthLength);

      years = (months / $.Param.yearLength).floor();
      months -= (years * $.Param.yearLength);

      return {
        seconds : seconds,
        minute : minutes,
        hour : hours,
        day : days + 1,
        month : months + 1,
        year : years + 1
      };
    }
  };

  // Returns the difference in number of seconds
  $.compareTimestamps = function(timestamp1, timestamp2) {
    if (typeof timestamp1 == "object") {
      timestamp1 = $.convertConfigToTimestamp(timestamp1);
    }

    if (typeof timestamp2 == "object") {
      timestamp2 = $.convertConfigToTimestamp(timestamp2);
    }

    var diff = timestamp2 - timestamp1;

    if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
      return (diff / 1000).floor();
    } else {
      return diff;
    }
  };

  $.validateDateTimeValues = function(date) {
    if ($.Param.useRealTime || $.Param.useRealTimeStructure) return;

    while (date.seconds >= $.Param.minuteLength) {
      date.minute += 1;
      date.seconds -= $.Param.minuteLength;
    }

    while (date.minute >= $.Param.hourLength) {
      date.hour += 1;
      date.minute -= $.Param.hourLength;
    }

    while (date.hour >= $.Param.dayLength) {
      date.day += 1;
      date.hour -= $.Param.dayLength;
    }

    while (date.day > $.Param.monthLength) {
      date.month += 1;
      date.day -= $.Param.monthLength;
    }

    while (date.month > $.Param.yearLength) {
      date.year += 1;
      date.month -= $.Param.yearLength;
    }
  };

  $.updateTime = function(runEvents) {
    if (runEvents === undefined) runEvents = true;

    var oldData = $.getDateTime();

    if ($.Param.useRealTimeStructure) {
      $.applyRealTimeLogic();
    }

    var date = {
      seconds : this.seconds,
      minute : this.minute,
      hour : this.hour,
      day : this.day,
      month : this.month,
      year : this.year
    };

    this.validateDateTimeValues(date);

    this.seconds = date.seconds;
    this.minute = date.minute;
    this.hour = date.hour;
    this.day = date.day;
    this.month = date.month;
    this.year = date.year;

    this.updateDayPeriod();

    if (runEvents) {
      this.runTimeChangeEvents(oldData);
    }

    // Calculate week day
    if (!$.Param.useRealTime && !$.Param.useRealTimeStructure) {
      var previousYears = this.year - 1;
      var previousMonths = previousYears * $.Param.yearLength;
      var numMonths = previousMonths + this.month - 1;
      var numDays = numMonths * $.Param.monthLength + this.day;
      this.weekDay = numDays % $.Param.weekLength + $.Param.weekDayOffset;
    }

    this._onUpdateTime();
  };

  $.updateDayPeriodForDate = function(date) {
    // Calculate day period
    if (date.hour < $.Param.dayPeriod1Hour) {
      date.dayPeriod = 4;
    } else if (date.hour < $.Param.dayPeriod2Hour) {
      date.dayPeriod = 1;
    } else if (date.hour < $.Param.dayPeriod3Hour) {
      date.dayPeriod = 2;
    } else if (date.hour < $.Param.dayPeriod4Hour) {
      date.dayPeriod = 3;
    } else {
      date.dayPeriod = 4;
    }
  };

  $.updateDayPeriod = function() {
    this.updateDayPeriodForDate(this);
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

    var length = $.Param.secondLength;
    if ($.Param.useRealTime) {
      length = 1000;
    } else if ($.Param.secondLengthVariable > 0) {
      if ($gameVariables !== null) {
        if ($gameVariables.value($.Param.secondLengthVariable) > 0) {
          length = $gameVariables.value($.Param.secondLengthVariable);
        }
      }
    }

    var increment = 1;

    if (length < 10) {
      var multiplier = Math.ceil(10 / length);
      increment *= multiplier;
      length *= multiplier;
    }

    this._intervalHandler = setInterval(function() {
      $.progressTime(increment);
    }, length);
  };

  $.refreshTimeSystem = function() {
    $.disableTime();
    $.enableTime();
  };

  $.disableTime = function() {
    if (this._intervalHandler === undefined) return;

    clearInterval(this._intervalHandler);
    this._intervalHandler = undefined;
  };

  $.applyRealTimeLogic = function(){
    var date = new Date();

    date.setFullYear(this.year);
    date.setMonth(this.month - 1);
    date.setDate(this.day);
    date.setHours(this.hour);
    date.setMinutes(this.minute);
    date.setSeconds(this.seconds);

    this.seconds = date.getSeconds();
    this.minute = date.getMinutes();
    this.hour = date.getHours();
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.weekDay = date.getDay();
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
      anyChanged = true;
      $._onChangeSecond();
    }

    if ($.minute != oldData.minute) {
      anyChanged = true;
      $._onChangeMinute();
    }

    if ($.hour != oldData.hour) {
      anyChanged = true;
      $._onChangeHour();
    }

    if ($.day != oldData.day) {
      anyChanged = true;
      $._onChangeDay();
    }

    if ($.month != oldData.month) {
      anyChanged = true;
      $._onChangeMonth();
    }

    if ($.year != oldData.year) {
      anyChanged = true;
      $._onChangeYear();
    }

    if (anyChanged) {
      $._onChangeTime();
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
      if (SceneManager._scene instanceof Scene_Map) {
        if ($gameMessage.isBusy()) {
          return true;
        }
      }
    }

    return false;
  };

  $.progressTime = function(increment) {
    if (this.paused) return;
    if (this.isInternallyPaused()) return;

    if (increment === undefined) {
      increment = 1;
    }

    if ($.Param.useRealTime) {
      $.loadRealTime();
      $._onUpdateTime();
    } else if (SceneManager._scene instanceof Scene_Map) {
      $.seconds += increment;

      $.updateTime();
      $._onChangeSecond();
      $._onChangeTime();
    }
  };

  $._onChangeSecond = function() {
    this.runEvent('changeSecond');
  };

  $._onChangeTime = function() {
    this.runEvent('changeTime');
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

  $.onTime = function(callback, hour, minute, second, autoRemove) {
    return this.onDateTime(callback, 0, 0, 0, hour, minute, second, autoRemove);
  };

  $.onDate = function(callback, day, month, year, autoRemove) {
    return this.onDateTime(callback, day, month, year, 0, 0, 0, autoRemove);
  };

  $.onDayPeriod = function(callback, dayPeriod, autoRemove) {
    if (autoRemove === undefined) {
      autoRemove = false;
    }

    var config = {
      callback : callback,
      dayPeriod : dayPeriod,
      autoRemove : autoRemove
    };

    return $.registerTimeEvent(config);
  };

  $.onDateTime = function(callback, day, month, year, hour, minute, second, autoRemove) {
    if (autoRemove === undefined) {
      autoRemove = false;
    }

    var config = {
      day: day,
      month: month,
      year: year,
      hour: hour,
      minute: minute,
      second: second,
      callback: callback,
      autoRemove : autoRemove,
      after : false
    };

    return $.registerTimeEvent(config);
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

  $.registerAfterTimeEvent = function(config) {
    this._afterTimeEvents.push(config);
    return this._afterTimeEvents.indexOf(config);
  };

  $.runInDateTime = function(callback, years, months, days, hours, minutes, seconds, autoRemove) {
    var newDate = $.getDateTime();

    newDate.year += Number(years || 0);
    newDate.month += Number(months || 0);
    newDate.day += Number(days || 0);
    newDate.hour += Number(hours || 0);
    newDate.minute += Number(minutes ||0);
    newDate.seconds += Number(seconds || 0);

    this.validateDateTimeValues(newDate);

    if (autoRemove === undefined) {
      autoRemove = true;
    }

    var config = {
      callback : callback,
      year : newDate.year,
      month : newDate.month,
      day : newDate.day,
      hour : newDate.hour,
      minute : newDate.minute,
      seconds : newDate.seconds,
      autoRemove : autoRemove,
      after : true
    };

    var key = undefined;

    key = $.registerAfterTimeEvent(config);
    config.key = key;
    return key;
  };

  $.runInHours = function(callback, hours, minutes, seconds) {
    return $.runInDateTime(callback, 0, 0, 0, hours, minutes, seconds);
  };

  $.runInDays = function(callback, days) {
    return $.runInDateTime(callback, 0, 0, days);
  };

  $.runInMonths = function(callback, months) {
    return $.runInDateTime(callback, 0, months);
  };

  $.runInYears = function(callback, years) {
    return $.runInDateTime(callback, years);
  };

  $.runInMinutes = function(callback, minutes) {
    return $.runInHours(callback, 0, minutes);
  };

  $.runInSeconds = function(callback, seconds) {
    return $.runInHours(callback, 0, 0, seconds);
  };

  $.registerTimeEvent = function(config) {
    this._timeEvents.push(config);
    return this._timeEvents.indexOf(config);
  };

  $.checkIfEventShouldRun = function(config) {
    if (config.day !== undefined && config.day > 0 && config.day != this.day) return false;
    if (config.month !== undefined && config.month > 0 && config.month != this.month) return false;
    if (config.year !== undefined && config.year > 0 && config.year != this.year) return false;
    if (config.hour !== undefined && config.hour != this.hour) return false;
    if (config.minute !== undefined && config.minute != this.minute) return false;
    if (config.second !== undefined && config.second != this.seconds) return false;
    if (config.weekDay !== undefined && config.weekDay != this.weekDay) return false;
    if (config.dayPeriod !== undefined && config.dayPeriod !== this.dayPeriod) return false;

    return true;
  };

  $.checkEventsToRun = function(eventList, after) {
    var config = undefined;
    var i;
    var keysToRemove = [];

    var currentTimestamp = this.convertConfigToTimestamp(this.getDateTime());
    if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
      currentTimestamp = (currentTimestamp / 1000).floor();
    }

    for (i = 0; i < eventList.length; i++) {
      config = eventList[i];

      if (config.callback === undefined) continue;
      
      if (after) {
        if (config.seconds === undefined) {
          config.seconds = config.second;
        }

        var timestamp = this.convertConfigToTimestamp(config);
        if ($.Param.useRealTime || $.Param.useRealTimeStructure) {
          timestamp = (timestamp / 1000).floor();
        }
        
        if (timestamp > currentTimestamp) {
          continue;
        }
      } else {
        if (!this.checkIfEventShouldRun(config)) {
          continue;
        }
      }

      this.executeCallback(config.callback);
      if (config.autoRemove === true) {
        config.callback = undefined;
        keysToRemove.push(config.key);
      }
    }

    for (var key in keysToRemove) {
      delete eventList[key];
    }
  };

  $.checkIfConfigHasCallback = function(config) {
    return config.callback !== undefined;
  };

  $._onUpdateTime = function() {
    $.checkEventsToRun(this._timeEvents, false);
    $.checkEventsToRun(this._afterTimeEvents, true);

    this._timeEvents = this._timeEvents.filter($.checkIfConfigHasCallback);
    this._afterTimeEvents = this._afterTimeEvents.filter($.checkIfConfigHasCallback);
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

  $.getTomorrow = function(){
    var dateObj = $.getDateTime();

    dateObj.day += 1;
    $.validateDateTimeValues(dateObj);

    return dateObj;
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

  $.getCallbacksFromList = function(eventList) {
    var callbackList = [];

    for (var key in eventList) {
      if (eventList[key].callback === undefined) continue;

      //can't save functions
      if (typeof(eventList[key].callback) == "function") continue;

      callbackList.push(MVC.shallowClone(eventList[key]));
    }

    return callbackList;
  };

  $.getCallbacks = function() {
    var callbackList = {};

    callbackList.after = this.getCallbacksFromList(this._afterTimeEvents);
    callbackList.normal = this.getCallbacksFromList(this._timeEvents);

    return callbackList;
  };

  $.setCallbacksToList = function(callbackList) {
    var eventList = [];

    for (var i = 0; i < callbackList.length; i++) {
      var config = MVC.shallowClone(callbackList[i]);

      eventList.push(config);
      config.key = eventList.indexOf(config);
    }

    return eventList;
  };

  $.setCallbacks = function(callbackList) {
    if (callbackList.after !== undefined) {
      this._afterTimeEvents = this.setCallbacksToList(callbackList.after);
    }

    if (callbackList.normal !== undefined) {
      this._timeEvents = this.setCallbacksToList(callbackList.normal);
    }
  };

  $.checkRunInCommands = function(eventId, args) {
    if (args.length < 6) return;
    
    var value = parseInt(args[4], 10);

    switch (args[5].toUpperCase()) {
      case 'MINUTE' :
      case 'MINUTES' :
        $.runInMinutes(eventId, value);
        break;
      case 'SECOND' :
      case 'SECONDS' :
        $.runInSeconds(eventId, value);
        break;
      case 'HOUR' :
      case 'HOURS' :
        $.runInHours(eventId, value);
        break;
      case 'DAY' :
      case 'DAYS' :
        $.runInDays(eventId, value);
        break;
      case 'MONTH' :
      case 'MONTHS' :
        $.runInMonths(eventId, value);
        break;
      case 'YEAR' :
      case 'YEARS' :
        $.runInYears(eventId, value);
        break;
      default:
        return;
    }
  };

  $.checkRunOnCommands = function(eventId, args) {
    if (args.length < 5) return;

    var hour, minute, seconds, day, month, year, dayPeriod;
    var nextIndex = 4;
    var autoRemove = false;

    while (true) {
      if (args.length < nextIndex + 1) break;

      switch(args[nextIndex].toUpperCase()) {
        case 'HOUR' :
          hour = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'MINUTE' :
          minute = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'SECOND' :
          seconds = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'DAY' :
          day = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'MONTH' :
          month = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'YEAR' :
          year = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'PERIOD' :
          dayPeriod = parseInt(args[nextIndex + 1], 10);
          nextIndex++;
          break;
        case 'ONCE' :
          autoRemove = true;
          break;
        default :
          break;
      }

      nextIndex++;
    }

    var config = {
      callback : eventId,
      hour : hour,
      minute : minute,
      seconds : seconds,
      day : day,
      month : month,
      year : year,
      dayPeriod : dayPeriod
    };

    $.registerTimeEvent(config);
  };

  $.checkRunEveryCommands = function(eventId, args) {
    if (args.length < 5) return;

    switch (args[4].toUpperCase()) {
      case 'HOUR' :
        $.on('changeHour', eventId);
        break;
      case 'MINUTE' :
        $.on('changeMinute', eventId);
        break;
      case 'SECOND' :
        $.on('changeSecond', eventId);
        break;
      case 'TIME' :
        $.on('changeTime', eventId);
        break;
      case 'DAY' :
        $.on('changeDay', eventId);
        break;
      case 'MONTH' :
        $.on('changeMonth', eventId);
        break;
      case 'YEAR' :
        $.on('changeYear', eventId);
        break;
      case 'PERIOD' :
        $.on('changeDayPeriod', eventId);
        break;
      default :
        break;
    }
  };

  $.checkRunCommands = function(command, args) {
    if (args.length < 4) return;

    if (command.toUpperCase() != 'RUN') return;
    if (args[0].toUpperCase() != 'COMMON') return;
    if (args[1].toUpperCase() != 'EVENT') return;

    var eventId = parseInt(args[2], 10);
    if (eventId <= 0) return;

    if (args[3].toUpperCase() == 'ON') {
      this.checkRunOnCommands(eventId, args);
    } else if (args[3].toUpperCase() == 'IN') {
      this.checkRunInCommands(eventId, args);
    } else if (args[3].toUpperCase() == 'EVERY') {
      this.checkRunEveryCommands(eventId, args);
    }
  };

  $.checkSystemCommands = function(command, args) {
    if (command.toUpperCase() == 'RESTART' || command.toUpperCase() == 'REFRESH') {
      if (args.length > 0 && args[0].toUpperCase() == 'TIME') {
        $.refreshTimeSystem();
      }
    }
  };

  var oldDataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    var contents = oldDataManager_makeSaveContents.call(this);

    contents.orangeDateTime = $.getDateTime();
    contents.orangeTimeSystemCallbacks = $.getCallbacks();

    return contents;
  };

  var oldDataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    oldDataManager_extractSaveContents.call(this, contents);

    if (contents.orangeDateTime !== undefined) {
      $.setDateTime(contents.orangeDateTime);
    }

    if (contents.orangeTimeSystemCallbacks !== undefined) {
      $.setCallbacks(contents.orangeTimeSystemCallbacks);
    }
  };

  var oldDataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    oldDataManager_setupNewGame.call(this);
    $.setDateTime({
      seconds : $.Param.initialSecond,
      minute : $.Param.initialMinute,
      hour : $.Param.initialHour,
      day : $.Param.initialDay,
      month : $.Param.initialMonth,
      year : $.Param.initialYear
    });
    $.refreshTimeSystem();
  };

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    oldGameInterpreter_pluginCommand.call(this, command, args);

    $.checkRunCommands(command, args);
    $.checkSystemCommands(command, args);
  };

  $.enableTime();
})(OrangeTimeSystem);

Imported.OrangeTimeSystem = 2.5;