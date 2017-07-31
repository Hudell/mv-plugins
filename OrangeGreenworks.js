/*=============================================================================
 * Orange - Greenworks
 * By Hudell - www.hudell.com
 * OrangeGreenworks.js
 * Version: 1.2
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
 * http://hudell.com/blog/orangegreenworks/
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

  $.getAchievement = function(achievementName) {
    return false;
  };

  $.clearAchievement = function(achievementName) {
    console.log('Clear achievement ', achievementName);
  };

  $.getNumberOfAchievements = function() {
    return 0;
  };

  $.isSteamRunning = function() {
    return false;
  };

  $.activateGameOverlay = function(option) {
  };

  $.isGameOverlayEnabled = function() {
    return false;
  };

  $.activateGameOverlayToWebPage = function(url) {
    console.log('Open URL');
  };

  $.getDLCCount = function() {
    return 0;
  };

  $.isDLCInstalled = function(dlcAppId) {
    return false;
  };

  $.installDLC = function(dlcAppId) {
  };

  $.uninstallDLC = function(dlcAppId) {
  };

  $.getStatInt = function(name) {
    return 0;
  };

  $.getStatFloat = function(name) {
    return 0;
  };

  $.setStat = function(name, value) {
    console.log('Change Stat', name, value);
    return false;
  };

  $.storeStats = function() {
    console.log('Store Stats');
    return false;
  };

  $.isSubscribedApp = function(appId) {
    return false;
  };

  if (Utils.isNwjs()) {
    $.initialized = false;

    try {
      $.greenworks = require('./greenworks');
    }
    catch(e) {
      $.greenworks = false;
      console.log('Greenworks failed to load. Make sure you copied all files from the Steamworks SDK to the right folders;');
      console.log('http://hudell.com/blog/orange-greenworks');
      console.error(e);
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

      $._storeStatsSuccess = function(){
        console.log('Stored Stats Successfully', arguments);
      };

      $._storeStatsError = function(){
        console.log('Failed to Store Stats', arguments);
      };

      $._achievementSuccess = function(){
        console.log('Achievement activated', arguments);
      };

      $._achievementError = function(){
        console.log('Achievement activation error', arguments);
      };

      $._clearAchievementSuccess = function(){
        console.log('Successfully Cleared Achievement', arguments);
      };

      $._clearAchievementError = function(){
        console.log('Failed to Clear Achievement', arguments);
      };

      $._getAchievementSuccess = function(){
      };

      $._getAchievementError = function(){
        console.log('Failed to check Achievement', arguments);
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

      $.getAchievement = function(achievementName) {
        if (!achievementName) {
          console.log('Achievement name not provided.');
          return false;
        }

        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.getAchievement(achievementName, $._getAchievementSuccess, $._getAchievementError);        
      };

      $.clearAchievement = function(achievementName) {
        if (!achievementName) {
          console.log('Achievement name not provided.');
          return false;
        }

        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        $.greenworks.clearAchievement(achievementName, $._clearAchievementSuccess, $._clearAchievementError);                
      };

      $.getNumberOfAchievements = function() {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.getNumberOfAchievements();
      };

      $.activateGameOverlay = function(option) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        $.greenworks.activateGameOverlay(option);
      };

      $.isGameOverlayEnabled = function() {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.isGameOverlayEnabled();
      };

      $.activateGameOverlayToWebPage = function(url) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        $.greenworks.activateGameOverlayToWebPage(url);
      };

      $.isSubscribedApp = function(appId) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.isSubscribedApp(appId);
      };

      $.getDLCCount = function() {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return 0;
        }
        
        return $.greenworks.getDLCCount();
      };

      $.isDLCInstalled = function(dlcAppId) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.isDLCInstalled(dlcAppId);
      };

      $.installDLC = function(dlcAppId) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        $.greenworks.installDLC(dlcAppId);
      };

      $.uninstallDLC = function(dlcAppId) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        $.greenworks.uninstallDLC(dlcAppId);
      };

      $.getStatInt = function(name) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return 0;
        }
        
        return $.greenworks.getStatInt(name);
      };

      $.getStatFloat = function(name) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return 0;
        }
        
        return $.greenworks.getStatFloat(name);
      };

      $.setStat = function(name, value) {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.setStat(name, value);
      };

      $.storeStats = function() {
        if (!$.isSteamRunning()) {
          console.log('Steam isn\'t running');
          return false;
        }
        
        return $.greenworks.setStat($._storeStatsSuccess, $._storeStatsError);
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
Imported.OrangeGreenworks = 1.2;