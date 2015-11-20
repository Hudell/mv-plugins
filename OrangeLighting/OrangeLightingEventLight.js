/*=============================================================================
 * Orange Lighting - Event Light
 * By Hudell - www.hudell.com
 * OrangeLightingEventLight.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Event Lights <OrangeLightingEventLight>
 * @author Hudell
 *
 * @param eventRadius
 * @desc The size of the light globe around the event by default
 * @default 40
 *
 * @param eventColor
 * @desc The color of the light around the event by default
 * @default #FFFFFF
 *
 * @param eventFlicker
 * @desc Should the plugin flick the light around the event by default?
 * @default false
 *
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website:
 * http://hudell.com
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * 
 *   <light>
 * This notetag will enable a light globe around the event
 * 
 *   <light_radius:40>
 * This notetag will let you configure the radius of the light globe
 * 
 *   <light_color:#FFFFFF>
 * This notetag will let you configure the color of the light globe
 * 
 *   <light_flickle:true>
 * This notetag will let you configure if the light globle should flickle
 * 
 *   <flashlight>
 * This notetag will activate a flashlight on the event
 * 
 * ============================================================================
 * Script Calls
 * ============================================================================
 * 
 *   this.enableLight();
 * This script call will enable a light globe around the event
 * 
 *   this.disableLight();
 * This script call will disable all light effects on the event
 * 
 *   this.enableFlashlight();
 * This script call will activate a flashlight on the event
 * 
 *   this.disableFlashlight();
 * This script call will deactivate the flashlight on the event, but keep other effects active.
 * 
 *   this.enableEventLight(eventId);
 * This script call will enable a light globe around the event
 * 
 *   this.disableEventLight(eventId);
 * This script call will disable all light effects on the event
 * 
 *   this.enableEventFlashlight(eventId);
 * This script call will activate a flashlight on the event
 * 
 *   this.disableEventFlashlight(eventId);
 * This script call will deactivate the flashlight on the event, but keep other effects active.
 * 
 *=============================================================================*/
if (!Hudell || !Hudell.OrangeLighting) {
  throw new Error("Couldn't find Hudell's OrangeLighting plugin. Please add it before this add-on.");
}

(function(lightSystem) {
  "use strict";

  lightSystem.addOns.EventLight = {};

  (function(eventLight){
    var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeLightingEventLight>'); });
    if (parameters.length === 0) {
      throw new Error("Couldn't find Hudell's OrangeLightingEventLight parameters.");
    }
    eventLight.Parameters = parameters[0].parameters;
    eventLight.Param = {};
  
    eventLight.Param.eventRadius = Number(eventLight.Parameters.eventRadius || 40);
    eventLight.Param.eventColor = eventLight.Parameters.eventColor || '#FFFFFF';
    eventLight.Param.eventFlicker = (eventLight.Parameters.eventFlicker || "false").toUpperCase() === "TRUE";

    eventLight.getEventPosition = function(event) {
      return lightSystem.getCharacterPosition(event);
    };

    //Refreshes the event's light
    eventLight.refresh = function() {
      var events = $gameMap._events.filter(function(event){
        return !!event && !!event.orangeLight;
      });

      if (events.length === 0) return;

      var canvas = this._maskBitmap.canvas;
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = 'lighter';

      for (var i = 0; i < events.length; i++) {
        var eventData = events[i];
        var positions = lightSystem.getCharacterPosition(eventData);

        var radius = eventData.orangeLight.radius || eventLight.Param.eventRadius;
        var color = eventData.orangeLight.color || eventLight.Param.eventColor;
        var flicker = eventData.orangeLight.flicker || eventLight.Param.eventFlicker;
        var flashlight = eventData.orangeLight.flashlight || false;

        if (flashlight) {
          this._maskBitmap.makeFlashlightEffect(positions[0], positions[1], 0, radius, color, 'black', positions[2]);
        } else {
          if (radius < 100) {
            this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 0, radius, '#999999', 'black', flicker);
          } else {
            this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 20, radius, color, 'black', flicker);
          }
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    eventLight.update = function(){      
    };

    lightSystem.on('afterRefreshMask', eventLight.refresh);
    lightSystem.on('updateMask', eventLight.update);

    (function($){
      $.enableEventLight = function(eventId, flashlight, radius, color, flicker) {
        if (eventId > 0) {
          var eventData = $gameMap.event(eventId);

          if (eventData) {
            eventData.orangeLight = {
              flashlight : flashlight,
              radius : radius,
              color : color,
              flicker : flicker
            };
            
            lightSystem.dirty = true;
          }
        }
      };

      $.disableEventLight = function(eventId) {
        if (eventId > 0) {
          var eventData = $gameMap.event(eventId);

          if (eventData) {
            eventData.orangeLight = undefined;
            lightSystem.dirty = true;
          }
        }        
      };

      $.enableEventFlashlight = function(eventId) {
        this.enableEventLight(eventId, true);
      };

      $.disableEventFlashlight = function(eventId) {
        this.enableEventLight(eventId, false);
      };

      $.enableLight = function(flashlight, radius, color, flicker) {
        this.enableEventLight(this._eventId, flashlight, radius, color, flicker);
      };

      $.disableLight = function() {
        this.disableEventLight(this._eventId);
      };

      $.enableFlashlight = function() {
        this.enableEventLight(this._eventId, true);
      };

      $.disableFlashlight = function() {
        this.enableEventLight(this._eventId, false);
      };
    })(Game_Interpreter.prototype);

    (function($) {
      eventLight.Game_Event_prototype_update = $.update;
      $.update = function(sceneActive) {
        var oldD = this._direction;
        var oldX = this._x;
        var oldY = this._y;
        eventLight.Game_Event_prototype_update.call(this, sceneActive);

        if (!this.orangeLight) return;

        if (this.isMoving() || oldD !== this._direction || oldX !== this._x || oldY !== this._y) {
          lightSystem.dirty = true;
        }
      };

      $.checkNoteTags = function(){
        if (!this.event().meta) return;

        var orangeLight = {
          flashlight : false,
          flicker : eventLight.Param.eventFlicker,
          radius : eventLight.Param.eventRadius,
          color : eventLight.Param.eventColor
        };

        var add = false;

        if (this.event().meta.light_radius !== undefined) {
          add = true;
          orangeLight.radius = this.event().meta.light_radius;
        }

        if (this.event().meta.light_color !== undefined) {
          add = true;
          orangeLight.color = this.event().meta.light_color;
        }

        if (this.event().meta.light_flickle !== undefined) {
          add = true;
          orangeLight.flickler = this.event().meta.light_flickle;
        }

        if (this.event().meta.light) {
          add = true;
        }

        if (this.event().meta.flashlight) {
          add = true;
          orangeLight.flashlight = true;
        }

        if (add) {
          this.orangeLight = orangeLight;
        } else {
          this.orangeLight = undefined;
        }
      };

      eventLight.Game_Event_prototype_initialize = $.initialize;
      $.initialize = function(mapId, eventId) {
        eventLight.Game_Event_prototype_initialize.call(this, mapId, eventId);
        this.checkNoteTags();
      };
    })(Game_Event.prototype);  


  })(lightSystem.addOns.EventLight);

})(Hudell.OrangeLighting);

Imported["OrangeLighting.EventLight"] = 1.0;