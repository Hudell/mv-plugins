/*=============================================================================
 * Orange - Greenworks
 * By Hudell - www.hudell.com
 * OrangeGreenworks.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Steamworks Integration <OrangeGreenworks>
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website to learn how to use this plugin:
 * http://hudell.com
 * 
 *=============================================================================*/
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangeGreenworks = Hudell.OrangeGreenworks || {};

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeGreenworks>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangeGreenworks parameters.");
  }

  if (Utils.isNwjs()) {
    $.initialized = false;

    try {
      $.greenworks = require('./greenworks');
    }
    catch(e) {
      $.greenworks = false;
    }

    if (!!$.greenworks) {
      $.initialized = $.greenworks.initAPI();

      if (!$.initialized) {
        console.log('Greenworks failed to initialize.');
        return;
      }

      $.steamId = $.greenworks.getSteamId();
      console.log('Steam User: ', $.steamId.screenName);

      $.getScreenName = function() {
        return $.steamId.screenName;
      };

      $.getUILanguage = function() {
        return $.greenworks.getCurrentUILanguage();
      };

      $.getGameLanguage = function() {
        return $.greenworks.getCurrentGameLanguage();
      };

      $.activateAchievement = function(achievementName) {
        if (!!achievementName) {
          $.greenworks.activateAchievement(achievementName, function(){
          }, function(){
          });
        }
      };
    }
  }

  if (!$.initialized) {
    $.getScreenName = function() {
      return 'Play Test';
    };

    $.getUILanguage = function() {
      return 'english';
    };

    $.getGameLanguage = function() {
      return 'english';
    };
    
    $.activateAchievement = function(achievementName) {
      console.log('Activate achievement ', achievementName);
    };
  }  
})(Hudell.OrangeGreenworks);

OrangeGreenworks = Hudell.OrangeGreenworks;
Imported.OrangeGreenworks = 1.0;