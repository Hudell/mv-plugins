/*=============================================================================
 * Orange Lighting - Time System Lights
 * By Hudell - www.hudell.com
 * OrangeTimeSystemLighting.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Time System Lights <OrangeTimeSystemLighting>
 * @author Hudell
 *
 * @param hourColors
 * @desc A different color mask for each hour of the day. Requires OrangeTimeSystem.
 * @default #000000, #000000, #000000, #000000, #000000, #111111, #111111, #666666, #AAAAAA, #EEEEEE, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF, #EEEEEE, #AAAAAA, #776666, #441111, #000000, #000000, #000000
 *
 * @param insideBuildingsHourColor
 * @desc A different color mask to use inside buildings, for each hour of the day. Requires OrangeTimeSystem.
 * @default #FFFFFF
*
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website:
 * http://hudell.com
 * 
 *=============================================================================*/
if (!Hudell || !Hudell.OrangeLighting) {
  throw new Error("Couldn't find Hudell's OrangeLighting plugin. Please add it before this add-on.");
}
if (!OrangeTimeSystem) {
  throw new Error("Couldn't find Hudell's OrangeTimeSystem plugin. Please add it before this add-on.");
}

(function(lightSystem) {
  "use strict";

  lightSystem.addOns.TimeSystemLights = {};

  (function(timeSystemLights){
    var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeTimeSystemLighting>'); });
    if (parameters.length === 0) {
      throw new Error("Couldn't find Hudell's OrangeTimeSystemLighting parameters.");
    }
    timeSystemLights.Parameters = parameters[0].parameters;
    timeSystemLights.Param = {};
  
    timeSystemLights.Param.hourColors = (timeSystemLights.Parameters.hourColors || "").split(",");
    timeSystemLights.Param.insideBuildingsHourColor = (timeSystemLights.Parameters.insideBuildingsHourColor || "").split(",");
    (function(){
      for (var i = 0; i < timeSystemLights.Param.hourColors.length; i++) {
        timeSystemLights.Param.hourColors[i] = timeSystemLights.Param.hourColors[i].trim();
      }

      for (i = 0; i < timeSystemLights.Param.insideBuildingsHourColor.length; i++) {
        timeSystemLights.Param.insideBuildingsHourColor[i] = timeSystemLights.Param.insideBuildingsHourColor[i].trim();
      }

      if (timeSystemLights.Param.hourColors.length === 0){
        timeSystemLights.Param.hourColors.push('black');
      }

      if (timeSystemLights.Param.insideBuildingsHourColor.length === 0){
        timeSystemLights.Param.insideBuildingsHourColor.push('#FFFFFF');
      }
    })();

    (function($) {
      timeSystemLights.oldMaskColor = $.maskColor;
      $.maskColor = function() {
        var hour = OrangeTimeSystem.hour;
        if (OrangeTimeSystem.inside) {
          return timeSystemLights.Param.insideBuildingsHourColor[hour % timeSystemLights.Param.insideBuildingsHourColor.length];
        } else {
          return timeSystemLights.Param.hourColors[hour % timeSystemLights.Param.hourColors.length];
        }
      };
    })(lightSystem.Lightmask.prototype);

  })(lightSystem.addOns.TimeSystemLights);

})(Hudell.OrangeLighting);

Imported["OrangeLighting.TimeSystemLights"] = 1.0;