/*=============================================================================
* Orange - Change Save File Name
* By Hudell - www.hudell.com
* OrangeChangeSaveFileName.js
* Version: 1.0
* Free for commercial and non commercial use.
*=============================================================================
* @plugindesc This plugin will help you change the base name of the save files
* @author Hudell
*
* @param localFilePattern
* @desc The pattern for the local file name.
*       Include '%1' on the position
*       where you want the number of the save file to be
* Default: file%1.rpgsave
* @default file%1.rpgsave
*
* @param webStorageKeyPattern
* @desc The pattern for web storage key name.
*       Include '%1' on the position
*       where you want the number of the save file to be
* Default: RPG File%1
* @default RPG File%1
*=============================================================================*/
var Imported = Imported || {};
var OrangeChangeSaveFileName = OrangeChangeSaveFileName || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeChangeSaveFileName');
  
  // If a new localFilePattern was defined, alias the localFilePath method
  // from the StorageManager and use the new pattern
  if ($.Parameters["localFilePattern"] !== undefined) {
    var saveFilePattern = $.Parameters["localFilePattern"];

    var oldStorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function(savefileId) {
      if (savefileId <= 0) {
        return oldStorageManager_localFilePath.call(this, savefileId);
      }

      var name = saveFilePattern.format(savefileId);
      return this.localFileDirectoryPath() + name;
    };
  }

  // If a new webStorageKeyPattern was defined, alias the webStorageKey method
  // from the StorageManager and use the new pattern
  if ($.Parameters["webStorageKeyPattern"] !== undefined) {
    var webStorageKeyPattern = $.Parameters["webStorageKeyPattern"];

    var oldStorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey = function(savefileId) {
      if (savefileId <= 0) {
        return oldStorageManager_webStorageKey.call(this, savefileId);
      }

      return webStorageKeyPattern.format(savefileId);
    };
  }
})(OrangeChangeSaveFileName);

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeChangeSaveFileName", "1.0.0", "This plugin will let you change the base name of the save files", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-20");
}
else {
  Imported["OrangeChangeSaveFileName"] = true;
}
