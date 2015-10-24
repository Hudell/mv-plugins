/*=============================================================================
 * Orange - Disable Mouse Movement
 * By Hudell - www.hudell.com
 * OrangeDisableMouseMovement.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin will disable the player movement with the use of the mouse
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/disable-mouse-movement
 * 
 *=============================================================================*/
Game_Temp.prototype.setDestination = function(x, y) {};

var Imported = Imported || {};

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeDisableMouseMovement", "1.0.0", "This plugin will disable the player movement with the use of the mouse", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-22");
} else {
  Imported["OrangeDisableMouseMovement"] = true;
}
