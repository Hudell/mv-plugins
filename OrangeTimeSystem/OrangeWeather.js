/*=============================================================================
 * Orange - Weather
 * By Hudell - www.hudell.com
 * OrangeWeather.js
 * Version: 1.0.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds weather effects to your game
 *             
 * @author Hudell
 *=============================================================================
 *
 * @param weatherSpeed
 * @desc How many frames does it take for the weather effect to change completely
 * @default 60
 *
 * @param changeWeatherStrengthAlongTheDay
 * @desc If true, the weather effect strength may change during the day
 * @default true
 *
 * @param rainChance
 * @desc A number between 0 and 100 identifying the chances of raining
 * @default 0
 *
 * @param rainChanceByMonth
 * @desc You can set a different rain chance for each month, in the format <monthNumber: chance>. Example: <1: 20> <12:15>
 * @default 
 *
 * @param maxRainStrength
 * @desc A number between 1 and 9 identifying the max strength of rain. 
 * @default 9
 *
 * @param minRainStrength
 * @desc A number between 1 and 9 identifying the min strength of rain. 
 * @default 1
 *
 * @param rainStrengthByMonth
 * @desc You can set a different strength range for each month, in the format <monthNumber: minStrength,maxStrength>. Example: <1: 1,5> <12: 3,9>
 * @default 
 *
 * @param snowChance
 * @desc A number between 0 and 100 identifying the chances of snowing
 * @default 0
 *
 * @param snowChanceByMonth
 * @desc You can set a different snow chance for each month, in the format <monthNumber: chance>. Example: <1: 20> <12:15>
 * @default 
 *
 * @param maxSnowStrength
 * @desc A number between 1 and 9 identifying the max strength of snow. 
 * @default 9
 *
 * @param minSnowStrength
 * @desc A number between 1 and 9 identifying the min strength of snow. 
 * @default 1
 *
 * @param snowStrengthByMonth
 * @desc You can set a different strength range for each month, in the format <monthNumber: minStrength,maxStrength>. Example: <1: 1,5> <12: 3,9>
 * @default 
 *
 * @param stormChance
 * @desc A number between 0 and 100 identifying the chances of storming
 * @default 0
 *
 * @param stormChanceByMonth
 * @desc You can set a different storm chance for each month, in the format <monthNumber: chance>. Example: <1: 20> <12:15>
 * @default 
 *
 * @param maxStormStrength
 * @desc A number between 1 and 9 identifying the max strength of storm. 
 * @default 9
 *
 * @param minStormStrength
 * @desc A number between 1 and 9 identifying the min strength of storm. 
 * @default 1
 *
 * @param stormStrengthByMonth
 * @desc You can set a different strength range for each month, in the format <monthNumber: minStrength,maxStrength>. Example: <1: 1,5> <12: 3,9>
 * @default 
 *
 * @param playDefaultWeatherEffects
 * @desc set this to false if you want to use your own weather effects through common events
 * @default true
 * 
 * @param rainCommonEvent
 * @desc the common event to run when it starts raining
 * @default 0
 * 
 * @param snowCommonEvent
 * @desc the common event to run when it starts snowing
 * @default 0
 * 
 * @param stormCommonEvent
 * @desc the common event to run when a storm starts
 * @default 0
 * 
 * @param normalWeatherCommonEvent
 * @desc the common event to run when the weather goes back to sunny
 * @default 0
 * 
 */
var Imported = Imported || {};

if (Imported["OrangeTimeSystem"] === undefined) {
  console.log('Download OrangeTimeSystem: http://link.hudell.com/time-system');
  throw new Error("This library requires the OrangeTimeSystem!");
}

var OrangeWeather = OrangeWeather || MVC.shallowClone(OrangeEventManager);

(function($) {
  "use strict";

  $.WeatherTypes = {
    NORMAL : 0,
    RAIN : 1,
    SNOW : 2,
    STORM : 3
  };

  $.Parameters = PluginManager.parameters('OrangeWeather');
  $.Param = $.Param || {};

  $.Param.weatherSpeed = Number($.Parameters.weatherSpeed || 60);
  $.Param.changeWeatherStrengthAlongTheDay = $.Parameters.changeWeatherStrengthAlongTheDay != "false";
  $.Param.normalWeatherCommonEvent = Number($.Parameters.normalWeatherCommonEvent || 0);
  $.Param.playDefaultWeatherEffects = $.Parameters.playDefaultWeatherEffects != "false";

  $.Param.rainChance = Number($.Parameters.rainChance || 0);
  $.Param.maxRainStrength = Number($.Parameters.maxRainStrength || 0);
  $.Param.minRainStrength = Number($.Parameters.minRainStrength || 0);
  $.Param.rainCommonEvent = Number($.Parameters.rainCommonEvent || 0);

  $.Param.snowChance = Number($.Parameters.snowChance || 0);
  $.Param.maxSnowStrength = Number($.Parameters.maxSnowStrength || 0);
  $.Param.minSnowStrength = Number($.Parameters.minSnowStrength || 0);
  $.Param.snowCommonEvent = Number($.Parameters.snowCommonEvent || 0);

  $.Param.stormChance = Number($.Parameters.stormChance || 0);
  $.Param.maxStormStrength = Number($.Parameters.maxStormStrength || 0);
  $.Param.minStormStrength = Number($.Parameters.minStormStrength || 0);
  $.Param.stormCommonEvent = Number($.Parameters.stormCommonEvent || 0);
  
  var rainChanceByMonth = ($.Parameters.rainChanceByMonth || "").trim();
  var rainChanceByMonthObj = { note : rainChanceByMonth, meta : {}};
  DataManager.extractMetadata(rainChanceByMonthObj);

  var rainStrengthByMonth = ($.Parameters.rainStrengthByMonth || "").trim();
  var rainStrengthByMonthObj = { note : rainStrengthByMonth, meta : {} };
  DataManager.extractMetadata(rainStrengthByMonthObj);

  var snowChanceByMonth = ($.Parameters.snowChanceByMonth || "").trim();
  var snowChanceByMonthObj = { note : snowChanceByMonth, meta : {}};
  DataManager.extractMetadata(snowChanceByMonthObj);

  var snowStrengthByMonth = ($.Parameters.snowStrengthByMonth || "").trim();
  var snowStrengthByMonthObj = { note : snowStrengthByMonth, meta : {} };
  DataManager.extractMetadata(snowStrengthByMonthObj);

  var stormChanceByMonth = ($.Parameters.stormChanceByMonth || "").trim();
  var stormChanceByMonthObj = { note : stormChanceByMonth, meta : {}};
  DataManager.extractMetadata(stormChanceByMonthObj);

  var stormStrengthByMonth = ($.Parameters.stormStrengthByMonth || "").trim();
  var stormStrengthByMonthObj = { note : stormStrengthByMonth, meta : {} };
  DataManager.extractMetadata(stormStrengthByMonthObj);

  var i;
  var monthIndex;

  $.Param.rainChanceByMonth = [undefined];
  $.Param.rainStrengthByMonth = [undefined];
  $.Param.snowChanceByMonth = [undefined];
  $.Param.snowStrengthByMonth = [undefined];
  $.Param.stormChanceByMonth = [undefined];
  $.Param.stormStrengthByMonth = [undefined];

  for (i=0; i < OrangeTimeSystem.Param.yearLength; i++) {
    $.Param.rainChanceByMonth.push($.Param.rainChance);
    $.Param.snowChanceByMonth.push($.Param.snowChance);
    $.Param.stormChanceByMonth.push($.Param.stormChance);

    $.Param.rainStrengthByMonth.push({
      max :$.Param.maxRainStrength,
      min :$.Param.minRainStrength
    });
    $.Param.snowStrengthByMonth.push({
      max :$.Param.maxSnowStrength,
      min :$.Param.minSnowStrength
    });
    $.Param.stormStrengthByMonth.push({
      max :$.Param.maxStormStrength,
      min :$.Param.minStormStrength
    });
  }

  for (monthIndex in rainChanceByMonthObj.meta) {
    $.Param.rainChanceByMonth[monthIndex] = parseInt(rainChanceByMonthObj.meta[monthIndex], 10);
  }
  for (monthIndex in snowChanceByMonthObj.meta) {
    $.Param.snowChanceByMonth[monthIndex] = parseInt(snowChanceByMonthObj.meta[monthIndex], 10);
  }
  for (monthIndex in stormChanceByMonthObj.meta) {
    $.Param.stormChanceByMonth[monthIndex] = parseInt(stormChanceByMonthObj.meta[monthIndex], 10);
  }

  var str, data, min, max;

  for (monthIndex in rainStrengthByMonthObj.meta) {
    str = rainStrengthByMonthObj.meta[monthIndex];
    data = str.split(',');
    min = $.Param.minRainStrength;
    max = $.Param.maxRainStrength;

    if (data.length > 1) {
      min = parseInt(data[0], 10);
      max = parseInt(data[1], 10);
    } else if (data.length > 0) {
      max = parseInt(data[0], 10);
    }

    $.Param.rainStrengthByMonth[monthIndex] = {
      min : min,
      max : max
    };
  }

  for (monthIndex in snowStrengthByMonthObj.meta) {
    str = snowStrengthByMonthObj.meta[monthIndex];
    data = str.split(',');
    min = $.Param.minSnowStrength;
    max = $.Param.maxSnowStrength;

    if (data.length > 1) {
      min = parseInt(data[0], 10);
      max = parseInt(data[1], 10);
    } else if (data.length > 0) {
      max = parseInt(data[0], 10);
    }

    $.Param.snowStrengthByMonth[monthIndex] = {
      min : min,
      max : max
    };
  }

  for (monthIndex in stormStrengthByMonthObj.meta) {
    str = stormStrengthByMonthObj.meta[monthIndex];
    data = str.split(',');
    min = $.Param.minStormStrength;
    max = $.Param.maxStormStrength;

    if (data.length > 1) {
      min = parseInt(data[0], 10);
      max = parseInt(data[1], 10);
    } else if (data.length > 0) {
      max = parseInt(data[0], 10);
    }

    $.Param.stormStrengthByMonth[monthIndex] = {
      min : min,
      max : max
    };
  }

  MVC.accessor($, 'weather');
  MVC.accessor($, 'weatherPower');
  MVC.accessor($, 'nextDayWeather');

  MVC.reader($, 'rainChance', function(){
    return $.Param.rainChanceByMonth[OrangeTimeSystem.month];
  });
  MVC.reader($, 'maxRainStrength', function(){
    return $.Param.rainStrengthByMonth[OrangeTimeSystem.month].max;
  });
  MVC.reader($, 'minRainStrength', function(){
    return $.Param.rainStrengthByMonth[OrangeTimeSystem.month].min;
  });

  MVC.reader($, 'snowChance', function(){
    return $.Param.snowChanceByMonth[OrangeTimeSystem.month];
  });
  MVC.reader($, 'maxSnowStrength', function(){
    return $.Param.snowStrengthByMonth[OrangeTimeSystem.month].max;
  });
  MVC.reader($, 'minSnowStrength', function(){
    return $.Param.snowStrengthByMonth[OrangeTimeSystem.month].min;
  });

  MVC.reader($, 'stormChance', function(){
    return $.Param.stormChanceByMonth[OrangeTimeSystem.month];
  });
  MVC.reader($, 'maxStormStrength', function(){
    return $.Param.stormStrengthByMonth[OrangeTimeSystem.month].max;
  });
  MVC.reader($, 'minStormStrength', function(){
    return $.Param.stormStrengthByMonth[OrangeTimeSystem.month].min;
  });

  MVC.reader($, 'maxWeatherStrength', function(){
    switch (this.weather) {
      case $.WeatherTypes.RAIN :
        return $.Param.rainStrengthByMonth[OrangeTimeSystem.month].max;
      case $.WeatherTypes.SNOW :
        return $.Param.snowStrengthByMonth[OrangeTimeSystem.month].max;
      case $.WeatherTypes.STORM :
        return $.Param.stormStrengthByMonth[OrangeTimeSystem.month].max;
      default :
        return 0;
    }
  });

  MVC.reader($, 'minWeatherStrength', function(){
    switch (this.weather) {
      case $.WeatherTypes.RAIN :
        return $.Param.rainStrengthByMonth[OrangeTimeSystem.month].min;
      case $.WeatherTypes.SNOW :
        return $.Param.snowStrengthByMonth[OrangeTimeSystem.month].min;
      case $.WeatherTypes.STORM :
        return $.Param.stormStrengthByMonth[OrangeTimeSystem.month].min;
      default :
        return 0;
    }
  });

  MVC.reader($, 'tomorrowRainChance', function(){
    var dateObj = OrangeTimeSystem.getTomorrow();
    return $.Param.rainChanceByMonth[dateObj.month];
  });

  MVC.reader($, 'tomorrowSnowChance', function(){
    var dateObj = OrangeTimeSystem.getTomorrow();
    return $.Param.snowChanceByMonth[dateObj.month];
  });

  MVC.reader($, 'tomorrowStormChance', function(){
    var dateObj = OrangeTimeSystem.getTomorrow();
    return $.Param.stormChanceByMonth[dateObj.month];
  });

  $.weather = 0;
  $.weatherPower = 0;
  $.nextDayWeather = 0;

  $.canUpdateWeather = function() {
    return !OrangeTimeSystem.inside;
  };

  $.onMinuteChange = function(){
    // Randomly change the strength of the weather effect about once an hour
    if (Math.random() * 100 < Math.ceil(100 / OrangeTimeSystem.Param.hourLength)) {
      this.randomizePower();
    }
  };

  $.pickNextDayWeather = function(){
    var rainChance = this.tomorrowRainChance;

    if (Math.random() * 100 < rainChance) {
      this.nextDayWeather = this.WeatherTypes.RAIN;
      return;
    }

    var snowChance = this.tomorrowSnowChance;
    if (Math.random() * 100 < snowChance) {      
      this.nextDayWeather = this.WeatherTypes.SNOW;
      return;
    }

    var stormChance = this.tomorrowStormChance;
    if (Math.random() * 100 < stormChance) {      
      this.nextDayWeather = this.WeatherTypes.STORM;
      return;
    }

    this.nextDayWeather = this.WeatherTypes.NORMAL;
  };

  $.onDayChange = function(){
    this.weather = this.nextDayWeather;
    this.pickNextDayWeather();

    this.updateWeather($.Param.weatherSpeed);
  };

  $.randomizePower = function(){
    var maxWeatherStrength = this.maxWeatherStrength;
    var minWeatherStrength = this.minWeatherStrength;

    var diff = maxWeatherStrength - minWeatherStrength + 1;
    var strength = Math.floor(Math.random() * diff) + minWeatherStrength;

    this.weatherPower = strength;
  };

  $.startRaining = function(strength, speed) {
    if ($gameScreen === undefined || $gameScreen === null) return;

    $.runEvent('startRaining');
    if ($.Param.rainCommonEvent > 0) {
      $gameTemp.reserveCommonEvent($.Param.rainCommonEvent);
    }

    if ($.Param.playDefaultWeatherEffects) {
      $gameScreen.changeWeather('rain', strength, speed);
    }
  };

  $.startSnowing = function(strength, speed) {
    if ($gameScreen === undefined || $gameScreen === null) return;
    
    $.runEvent('startSnowing');
    if ($.Param.snowCommonEvent > 0) {
      $gameTemp.reserveCommonEvent($.Param.snowCommonEvent);
    }

    if ($.Param.playDefaultWeatherEffects) {
      $gameScreen.changeWeather('snow', strength, speed);
    }
  };

  $.startStorm = function(strength, speed) {
    if ($gameScreen === undefined || $gameScreen === null) return;
    
    $.runEvent('startStorm');
    if ($.Param.stormCommonEvent > 0) {
      $gameTemp.reserveCommonEvent($.Param.stormCommonEvent);
    }

    if ($.Param.playDefaultWeatherEffects) {
      $gameScreen.changeWeather('storm', strength, speed);
    }
  };

  $.resetWeather = function(speed) {
    if ($gameScreen === undefined || $gameScreen === null) return;

    $.runEvent('normalWeather');
    if ($.Param.normalWeatherCommonEvent > 0) {
      $gameTemp.reserveCommonEvent($.Param.normalWeatherCommonEvent);
    }

    if ($.Param.playDefaultWeatherEffects) {
      $gameScreen.changeWeather('none', 0, speed);
    }
  };

  $.updateWeather = function(speed) {
    var type = 0;
    if (this.canUpdateWeather()) {
      type = this.weather;

      if (type > 0 && this.weatherPower === 0) {
        this.randomizePower();
      }
    }

    switch(type) {
      case this.WeatherTypes.RAIN :
        this.startRaining(this.weatherPower, speed);
        break;
      case this.WeatherTypes.SNOW :
        this.startSnowing(this.weatherPower, speed);
        break;
      case this.WeatherTypes.STORM :
        this.startStorm(this.weatherPower, speed);
        break;
      default : 
        this.resetWeather(speed);
        this.weatherPower = 0;
        break;
    }
  };

  if ($.Param.changeWeatherStrengthAlongTheDay) {
    OrangeTimeSystem.on('changeMinute', function(){
      $.onMinuteChange.call($);
    });
  }

  OrangeTimeSystem.on('changeDay', function(){
   $.onDayChange.call($);
  });


  var oldGamePlayer_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function() {
    oldGamePlayer_performTransfer.call(this);
    $.updateWeather(1);
  };
})(OrangeWeather);

Imported["OrangeWeather"] = 1;