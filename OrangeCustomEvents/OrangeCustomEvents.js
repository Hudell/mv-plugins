/*=============================================================================
 * Orange - Custom Event
 * By Hudell - www.hudell.com
 * OrangeCustomEvents.js
 * Version: 1.5.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin Will let you add or copy events to the current map
 *             
 * @author Hudell
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on http://link.hudell.com/custom-events
 * 
 *=============================================================================*/

var Imported = Imported || {};

if (Imported["MVCommons"] === undefined) {
  var MVCommons = {};

  (function($){ 
    $.ajaxLoadFileAsync = function(filePath, mimeType, onLoad, onError){ mimeType = mimeType || "application/json"; var xhr = new XMLHttpRequest(); var name = '$' + filePath.replace(/^.*(\\|\/|\:)/, '').replace(/\..*/, ''); xhr.open('GET', filePath); if (mimeType && xhr.overrideMimeType) { xhr.overrideMimeType(mimeType); } if(onLoad === undefined){ onLoad = function(xhr, filePath, name) { if (xhr.status < 400) { window[name] = JSON.parse(xhr.responseText); DataManager.onLoad(window[name]); } }; } if(onError === undefined) { onError = function() { DataManager._errorUrl = DataManager._errorUrl || filePath; }; } xhr.onload = function() { onLoad.call(this, xhr, filePath, name); }; xhr.onerror = onError; window[name] = null; xhr.send(); };
  })(MVCommons);

  if (Utils.isOptionValid('test')) {
    console.log('MVC not found, OrangeCustomEvents will be using essentials (copied from MVC 1.4.0).');
  }
}

var OrangeCustomEvents = OrangeCustomEvents || {};

function Game_Custom_Event() {
  this.initialize.apply(this, arguments);
}
Game_Custom_Event.prototype = Object.create(Game_Event.prototype);
Game_Custom_Event.prototype.constructor = Game_Custom_Event;

(function($) {
  "use strict";

  //----------------------------------------------.
  //----------------------------------------------|
  // PROTECTED METHODS                            |
  //----------------------------------------------|
  //----------------------------------------------|

  $.getAnotherMapData = function(mapId, callback) {
    var variableName = '$Map%1'.format(mapId.padZero(3));
    var filename = 'data/Map%1.json'.format(mapId.padZero(3));

    var onLoad = function(xhr, filePath, name) {
      if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        DataManager.onLoad(window[name]);

        callback();
      }
    };

    if (window[variableName] === undefined || window[variableName] === null) {
      MVCommons.ajaxLoadFileAsync(filename, undefined, onLoad);
    } else {
      callback();
    }
  };


  //----------------------------------------------.
  //----------------------------------------------|
  // PUBLIC METHODS                               |
  //----------------------------------------------|
  //----------------------------------------------|

  //----------------------------------------------
  // Game_Custom_Event
  //----------------------------------------------
  Game_Custom_Event.prototype.initialize = function(mapId, eventId, eventData) {
    this._eventData = eventData;
    Game_Event.prototype.initialize.call(this, mapId, eventId);
  };

  Game_Custom_Event.prototype.event = function() {
    return this._eventData;
  };

  Game_Custom_Event.prototype.revive = function(data) {
    return new Game_Custom_Event(data.mapId, data.id, data.eventData);
  };

  //----------------------------------------------
  // Game_System
  //----------------------------------------------
  Game_System.prototype.clearSelfSwitches = function(mapId, eventId) {
    var switches = ["A", "B", "C", "D"];

    switches.forEach(function(switchId) {
      var key = [mapId, eventId, switchId];
      $gameSelfSwitches.setValue(key, false);
    });
  };

  Game_System.prototype.initCustomEvents = function(mapId) {
    if (this._customEvents === undefined) {
      this._customEvents = {};
    }

    if (this._customEvents[mapId] === undefined) {
      this._customEvents[mapId] = {};
    }
  };

  Game_System.prototype.addCustomEvent = function(mapId, event) {
    this.initCustomEvents(mapId);
    this.clearSelfSwitches(mapId, event.id);
    this._customEvents[mapId][event.id] = event;

    return event;
  };

  Game_System.prototype.removeCustomEvent = function(mapId, eventId) {
    this.initCustomEvents(mapId);
    this.clearSelfSwitches(mapId, eventId);
    delete this._customEvents[mapId][eventId];
  };

  Game_System.prototype.clearCustomEvents = function(mapId) {
    this.initCustomEvents();
    this._customEvents[mapId] = {};
  };

  Game_System.prototype.getCustomEvents = function(mapId) {
    this.initCustomEvents();
    return this._customEvents[mapId];
  };

  //----------------------------------------------
  // Game_Map
  //----------------------------------------------
  Game_Map.prototype.getIndexForNewEvent = function() {
    var index = 1;
    while (index < this._events.length && !!this._events[index]) {
      index++;
    }

    return index;
  };

  Game_Map.prototype.addEvent = function(eventData, temporary) {
    if (temporary === undefined) {
      temporary = false;
    }

    var index = this.getIndexForNewEvent();

    eventData.id = index;
    var gameEvent = new Game_Custom_Event(this._mapId, index, eventData);
    $gameSystem.clearSelfSwitches(this._mapId, index);

    this._events[index] = gameEvent;

    if (SceneManager._scene instanceof Scene_Map) {
      var sprite = new Sprite_Character(gameEvent);
      SceneManager._scene._spriteset._characterSprites.push(sprite);
      SceneManager._scene._spriteset._tilemap.addChild(sprite);
    }

    if (temporary === false) {
      $gameSystem.addCustomEvent(this._mapId, eventData);
    }

    return gameEvent;
  };

  var oldGameMap_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    oldGameMap_setupEvents.call(this);

    var customEvents = $gameSystem.getCustomEvents(this._mapId);
    for (var eventId in customEvents) {
      if (customEvents[eventId] === undefined) continue;
      var newEventId = this.getIndexForNewEvent();

      customEvents[eventId].eventId = newEventId;
      this._events[newEventId] = new Game_Custom_Event(this._mapId, newEventId, customEvents[eventId]);
    }
  };

  Game_Map.prototype.addEventAt = function(eventData, x, y, temporary) {
    eventData.x = x;
    eventData.y = y;
    return this.addEvent(eventData, temporary);
  };

  Game_Map.prototype.spawnEvent = function(eventData, tileList, temporary) {
    for (var i = 0; i < tileList.length; i++) {
      eventData.x = tileList[i].x;
      eventData.y = tileList[i].y;
      this.addEvent(eventData, temporary);      
    }
  };

  Game_Map.prototype.getEventData = function(eventIdOrigin) {
    var event = $dataMap.events[eventIdOrigin];
    if (event === undefined) return undefined;

    return JsonEx.makeDeepCopy(event);
  };

  Game_Map.prototype.getEventDataFrom = function(mapIdOrigin, eventIdOrigin, callback) {
    $.getAnotherMapData(mapIdOrigin, function() {
      var variableName = '$Map%1'.format(mapIdOrigin.padZero(3));

      if (window[variableName] === undefined || window[variableName] === null) return;

      var event = window[variableName].events[eventIdOrigin];
      if (event === undefined) return;

      var eventData = JsonEx.makeDeepCopy(event);
      callback.call(this, eventData);
    });    
  };

  Game_Map.prototype.copyEvent = function(eventIdOrigin, x, y, temporary) {
    var eventData = this.getEventData(eventIdOrigin);
    if (eventData) {
      $gameMap.addEventAt(eventData, x, y, temporary);
    }
  };

  Game_Map.prototype.getRegionTileList = function(regionId) {
    var tileList = [];

    for (var x = 0; x < $gameMap.width(); x++) {
      for (var y = 0; y < $gameMap.height(); y++) {
        if ($gameMap.eventsXy(x, y).length === 0) {
          if ($gameMap.regionId(x, y) == regionId) {
            tileList.push({x : x, y : y});
          }
        }
      }
    }

    return tileList;
  };

  Game_Map.prototype.getRandomRegionTile = function(regionId) {
    var tileList = this.getRegionTileList(regionId);

    if (tileList.length > 0) {
      var index = Math.randomInt(tileList.length);
      return tileList[index];
    }

    return undefined;
  };

  Game_Map.prototype.copyEventToRegion = function(eventIdOrigin, regionId, temporary) {
    var tile = this.getRandomRegionTile(regionId);
    if (tile !== undefined) {
      this.copyEvent(eventIdOrigin, tile.x, tile.y, temporary);
    }
  };

  Game_Map.prototype.copyEventFrom = function(mapIdOrigin, eventIdOrigin, x, y, temporary) {
    this.getEventDataFrom(mapIdOrigin, eventIdOrigin, function(eventData) {
      $gameMap.addEventAt(eventData, x, y, temporary);
    });
  };

  Game_Map.prototype.copyEventFromMapToRegion = function(mapIdOrigin, eventIdOrigin, regionId, temporary) {
    var tile = this.getRandomRegionTile(regionId);
    if (tile !== undefined) {
      this.copyEventFrom(mapIdOrigin, eventIdOrigin, tile.x, tile.y, temporary);
    }    
  };

  Game_Map.prototype.spawnMapEvent = function(eventIdOrigin, regionId, temporary) {
    var eventData = this.getEventData(eventIdOrigin);
    var tileList = this.getRegionTileList(regionId);

    if (eventData && tileList) {
      this.spawnEvent(eventData, tileList, temporary);
    }
  };

  Game_Map.prototype.spawnMapEventFrom = function(mapIdOrigin, eventIdOrigin, regionId, temporary) {
    var tileList = this.getRegionTileList(regionId);

    if (tileList.length > 0) {
      this.getEventDataFrom(mapIdOrigin, eventIdOrigin, function(eventData) {
        $gameMap.spawnEvent(eventData, tileList, temporary);
      });
    }
  };

  Game_Interpreter.prototype.checkCopyCommands = function(command, args) {
    if (args.length < 2) return;

    if (command.toUpperCase() !== 'COPY' && command.toUpperCase() !== 'SPAWN') return;
    if (args[0].toUpperCase() !== "EVENT") return;

    var eventIdOrigin = parseInt(args[1], 10);
    var mapIdOrigin = $gameMap.mapId();
    var isPosition = true;
    var x = 0;
    var y = 0;
    var regionId = 0;
    var temporary = true;
    var hasPosition = false;

    if (eventIdOrigin <= 0) return;

    var nextIndex = 2;

    if (args.length >= nextIndex + 3) {
      if (args[nextIndex].toUpperCase() == 'FROM' && args[nextIndex + 1].toUpperCase() == 'MAP') {
        mapIdOrigin = parseInt(args[nextIndex + 2], 10);
        nextIndex += 3;
      }
    }

    if (args.length > nextIndex && args[nextIndex].toUpperCase() == 'HERE') {
      isPosition = true;
      hasPosition = true;
      x = this.character(0).x;
      y = this.character(0).y;
      nextIndex++;

    } else if (args.length > nextIndex) {
      if (args[nextIndex].toUpperCase() !== 'TO' && args[nextIndex].toUpperCase() !== 'ON') {
        console.error('OrangeCustomEvents', 'Invalid destination', command, args);
        return;
      }

      nextIndex++;

      if (args.length > nextIndex && args[nextIndex].toUpperCase() == 'REGION') {
        isPosition = false;
        nextIndex++;
      } else if (args.length > nextIndex && args[nextIndex].toUpperCase() == 'POSITION') {
        isPosition = true;
        nextIndex++;
      }
    }
    else {
      console.error('OrangeCustomEvents', 'Incomplete command', command, args);
      return;
    }

    if (isPosition) {
      if (!hasPosition) {
        if (args.length > nextIndex && args[nextIndex].toUpperCase() == 'PLAYER') {
          x = $gamePlayer.x;
          y = $gamePlayer.y;
          nextIndex++;
        } else if (args.length >= nextIndex + 2) {
          x = parseInt(args[nextIndex], 10);
          y = parseInt(args[nextIndex + 1], 10);

          nextIndex += 2;
        }
        else {
          console.error('OrangeCustomEvents', 'What position?', command, args);
        }
      }
    }
    else {
      if (args.length > nextIndex) {
        regionId = parseInt(args[nextIndex], 10);
        nextIndex++;
      }
      else {
        console.error('OrangeCustomEvents', 'What region?', command, args);
      }
    }

    if (args.length > nextIndex) {
      if (args[nextIndex].toUpperCase().startsWith('TEMP')) {
        temporary = true;
        nextIndex++;
      } else if (args[nextIndex].toUpperCase() == 'SAVE') {
        temporary = false;
        nextIndex++;
      }
    }

    if (isPosition) {
      if (mapIdOrigin == $gameMap.mapId()) {
        $gameMap.copyEvent(eventIdOrigin, x, y, temporary);
      } else {
        $gameMap.copyEventFrom(mapIdOrigin, eventIdOrigin, x, y, temporary);
      }
    }
    else {
      if (command.toUpperCase() === 'COPY') {
        if (mapIdOrigin == $gameMap.mapId()) {
          $gameMap.copyEventToRegion(eventIdOrigin, regionId, temporary);
        } else {
          $gameMap.copyEventFromMapToRegion(mapIdOrigin, eventIdOrigin, regionId, temporary);
        }
      } else if (command.toUpperCase() === 'SPAWN') {
        if (mapIdOrigin == $gameMap.mapId()) {
          $gameMap.spawnMapEvent(eventIdOrigin, regionId, temporary);
        } else {
          $gameMap.spawnMapEventFrom(mapIdOrigin, eventIdOrigin, regionId, temporary);
        }
      }
    }
  };

  Game_Interpreter.prototype.checkDeleteCommand = function(command, args) {
    if (args.length != 2) return;

    if (command.toUpperCase() !== 'DELETE') return;
    if (args[0].toUpperCase() !== "THIS") return;
    if (args[1].toUpperCase() !== "EVENT") return;

    $gameSystem.removeCustomEvent(this._mapId, this._eventId);
    this.command214();
  };

  var oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    oldGameInterpreter_pluginCommand.call(this, command, args);

    this.checkCopyCommands(command, args);
    this.checkDeleteCommand(command, args);
  };
})(OrangeCustomEvents);

Imported["OrangeCustomEvents"] = 1.5;