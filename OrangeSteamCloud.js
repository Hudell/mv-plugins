/*=============================================================================
 * Orange - SteamCloud
 * By Hudell - www.hudell.com
 * OrangeSteamCloud.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Steam Cloud Integration <OrangeSteamCloud>
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
Hudell.OrangeSteamCloud = Hudell.OrangeSteamCloud || {};


(function($) {
  "use strict";
  if (!Utils.isNwjs()) return;

  if (Imported.OrangeGreenworks === undefined || isNaN(Imported.OrangeGreenworks) || Imported.OrangeGreenworks < 1.1) {
    console.error('OrangeGreenworks not found.');
    return;
  }

  if (!OrangeGreenworks.initialized) {
    console.error('OrangeGreenworks not initialized');
    return;
  }

  var g = OrangeGreenworks.greenworks;
  if (!g) {
    console.error('Unable to find OrangeGreenworks internal component.');
    return;
  }

  $.syncAllSaves = function() {
    if (!g.isSteamRunning()) return;
    if (!g.isCloudEnabled()) return;
    if (!g.isCloudEnabledForUser()) return;

    g.readTextFromFile('globalInfo', function(json){
      var localJson;
      try {
        localJson = StorageManager.load(0);
      } catch (e) {
        console.error(e);
        localJson = '';
      }

      if (json == localJson) return;

      var globalInfo;
      var localGlobalInfo;

      try {
        globalInfo = JSON.parse(json);
      }
      catch(e) {
        globalInfo = {};
      }

      try {
        localGlobalInfo = JSON.parse(localJson);
      }
      catch(e) {
        localGlobalInfo = {};
      }

      for (var i = 1; i <= DataManager.maxSavefiles(); i++) {
        var remoteData = globalInfo[i];
        var localData = localGlobalInfo[i];

        if (!remoteData) continue;
        if (!!localData) {
          if (localData.timestamp >= remoteData.timestamp) continue;
        }

        $.downloadFile(i, remoteData);
      }
    }, function(msg){
      console.log('Global Info download failed. Error message:', msg);
    });
  };

  $.saveFile = function(fileName, fileContent) {
    if (!g.isSteamRunning()) return;
    if (!g.isCloudEnabled()) return;
    if (!g.isCloudEnabledForUser()) return;

    g.saveTextToFile(fileName, fileContent, function(){
      console.log('Save file uploaded successfully', arguments);
    }, function(){
      console.error('Failed to upload save file:', arguments);
    });
  };

  $.updateLocalGlobalInfo = function(savefileId, header) {
    var globalInfo = DataManager.loadGlobalInfo() || [];
    globalInfo[savefileId] = header;
    
    $.saveLocally(0, JSON.stringify(globalInfo));
  };

  $.saveLocally = function(savefileId, json) {
    if (StorageManager.isLocalMode()) {
      StorageManager.saveToLocalFile(savefileId, json);
    } else {
      StorageManager.saveToWebStorage(savefileId, json);
    }
  };

  $.downloadFile = function(savefileId, header) {
    if (!g.isSteamRunning()) return;
    if (!g.isCloudEnabled()) return;
    if (!g.isCloudEnabledForUser()) return;

    if (savefileId > 0) {
      g.readTextFromFile('save_' + savefileId, function(fileContent){
        try {
          //Make sure the data is parse-able before saving it.
          var data = JSON.parse(fileContent);
          $.saveLocally(savefileId, fileContent);

          $.updateLocalGlobalInfo(savefileId, header);
        }
        catch(e) {
          console.error('Failed to save downloaded file ' + savefileId, e);
        }
      }, function(msg){
        console.error('Failed to download save file ' + savefileId, msg);
      });
    } else {
      if (savefileId == -1) { //jshint ignore:line
        g.readTextFromFile('config', function(fileContent){
          $.saveLocally(-1, fileContent);
          ConfigManager.load();
        }, function(msg){
          console.error('Failed to download config from cloud.', msg);
        });
      }
    }
  };

  $._oldDataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function() {
    var info = $._oldDataManager_makeSavefileInfo.call(this);
    info.timestamp = new Date().getTime();
    return info;
  };

  $._oldStorageManager_save = StorageManager.save;
  StorageManager.save = function(savefileId, json) {
    $._oldStorageManager_save.call(this, savefileId, json);

    if (savefileId == 0) { //jshint ignore:line
      $.saveFile('globalInfo', json);
    } else if (savefileId == -1) {
      $.saveFile('config', json);
    } else {
      $.saveFile('save_' + savefileId, json);
    }
  };

  $._oldDataManager_saveGlobalInfo = DataManager.saveGlobalInfo;
  DataManager.saveGlobalInfo = function(info) {
    info.timestamp = new Date().getTime();
    $._oldDataManager_saveGlobalInfo.call(this, info);
  };

  $.downloadFile(-1);
  $.syncAllSaves();
})(Hudell.OrangeSteamCloud);

OrangeSteamCloud = Hudell.OrangeSteamCloud;
Imported.OrangeSteamCloud = 1.0;