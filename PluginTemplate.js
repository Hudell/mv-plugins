/*=============================================================================
 * Orange - PluginName
 * By Hudell - www.hudell.com
 * OrangePluginName.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Plugin Description <OrangePluginName>
 * @author Hudell
 *
 * @param paramName
 * @desc Description
 * @default 0
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
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangePluginName = Hudell.OrangePluginName || {};

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangePluginName>'); });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangePluginName parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = {};

  // Param validation

  //$.Param.paramName = Number($.Parameters.paramName || 0);

  // Code goes here
  
})(Hudell.OrangePluginName);

OrangePluginName = Hudell.OrangePluginName;
Imported.OrangePluginName = 1.0;