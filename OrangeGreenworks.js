/*=============================================================================
 * Orange - Greenworks
 * By Hudell - www.hudell.com
 * OrangeGreenworks.js
 * Version: 1.1
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

  $.isSteamRunning = function() {
    return false;
  };

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

      $.isSteamRunning = function() {
        return $.greenworks.isSteamRunning();
      };

      $._achievementSuccess = function(){
        console.log('Achievement activated', arguments);
      };

      $._achievementError = function(){
        console.log('Achievement activation error', arguments);
      };

      $.activateAchievement = function(achievementName) {
        if (!achievementName) {
          console.log('Achievement name not provided.');
          return;
        }

        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return;
        }
        
        $.greenworks.activateAchievement(achievementName, $._achievementSuccess, $._achievementError);
      };

      $.getFriendCount = function() {
        return $.greenworks.getFriendCount($.greenworks.FriendFlags.Immediate);
      };

      $.isCloudEnabled = function() {
        return $.greenworks.isCloudEnabled();
      };

      $.isCloudEnabledForUser = function() {
        return $.greenworks.isCloudEnabledForUser();
      };
    }
  }
})(Hudell.OrangeGreenworks);

OrangeGreenworks = Hudell.OrangeGreenworks;
Imported.OrangeGreenworks = 1.1;