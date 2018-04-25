/*=============================================================================
 * Orange - Simple Mouse Data
 * By Hudell - www.hudell.com
 * OrangeMouseData.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc Will give you access to mouse's X, Y, TileX, TileY and Down Status for both left and right buttons <OrangeMouseData>
 *             
 * @author Hudell
 *
 * @param variableMouseX
 * @desc The number of the variable where the Mouse X will be stored
 * @default 0
 * 
 * @param variableMouseY
 * @desc The number of the variable where the Mouse Y will be stored
 * @default 0
 * 
 * @param variableMouseTileX
 * @desc The number of the variable where the Mouse Tile X will be stored
 * @default 0
 * 
 * @param variableMouseTileY
 * @desc The number of the variable where the Mouse TIle Y will be stored
 * @default 0
 * 
 * @param switchLeftButtonDown
 * @desc The number of the switch that will be turned on when the mouse left button is clicked
 * @default 0
 * 
 * @param switchRightButtonDown
 * @desc The number of the switch that will be turned on when the mouse right button is clicked
 * @default 0
 * 
 * @param switchMiddleButtonDown
 * @desc The number of the switch that will be turned on when the mouse middle button is clicked
 * @default 0
 */
var Imported = Imported || {};

var OrangeMouseData = OrangeMouseData || {};

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin){ return plugin.description.indexOf('<OrangeMouseData>') >= 0; });
  if (parameters.length === 0) {
    throw new Error("Couldn't find OrangeMouseData parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = $.Param || {};

  $.Param.variableMouseX = Number($.Parameters['variableMouseX'] || 0);
  $.Param.variableMouseY = Number($.Parameters['variableMouseY'] || 0);
  $.Param.variableMouseTileX = Number($.Parameters['variableMouseTileX'] || 0);
  $.Param.variableMouseTileY = Number($.Parameters['variableMouseTileY'] || 0);
  $.Param.switchLeftButtonDown = Number($.Parameters['switchLeftButtonDown'] || 0);
  $.Param.switchRightButtonDown = Number($.Parameters['switchRightButtonDown'] || 0);
  $.Param.switchMiddleButtonDown = Number($.Parameters['switchMiddleButtonDown'] || 0);

  $.getSwitchId = function(mouseButton) {
    switch(mouseButton) {
      case 0 :
        return $.Param.switchLeftButtonDown;
      case 1 :
        return $.Param.switchMiddleButtonDown;
      case 2 :
        return $.Param.switchRightButtonDown;
      default :
        return 0;
    }
  };

  $._onMouseUp = function(event) {
    if ($gameSwitches === null || $gameSwitches === undefined) return;
    var switchId = $.getSwitchId(event.button);

    if (switchId > 0) {
      $gameSwitches.setValue(switchId, false);
    }
  };


  $._onMouseDown = function(event) {
    if ($gameSwitches === null || $gameSwitches === undefined) return;
    var switchId = $.getSwitchId(event.button);

    if (switchId > 0) {
      $gameSwitches.setValue(switchId, true);
    }
  };

  $._onMouseMove = function(event) {
    if ($gameVariables === null || $gameSwitches === undefined) return;

    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    var tileX = x; 
    var tileY = y;

    if ($gameMap !== undefined && $gameMap !== null && $dataMap !== undefined && $dataMap !== null) {
      tileX = $gameMap.canvasToMapX(x);
      tileY = $gameMap.canvasToMapY(y);
    }

    if ($.Param.variableMouseX > 0) $gameVariables.setValue($.Param.variableMouseX, x);
    if ($.Param.variableMouseY > 0) $gameVariables.setValue($.Param.variableMouseY, y);
    if ($.Param.variableMouseTileX > 0) $gameVariables.setValue($.Param.variableMouseTileX, tileX);
    if ($.Param.variableMouseTileY > 0) $gameVariables.setValue($.Param.variableMouseTileY, tileY);
  };


  document.addEventListener('mousedown', $._onMouseDown.bind($));
  document.addEventListener('mouseup', $._onMouseUp.bind($));
  document.addEventListener('mousemove', $._onMouseMove.bind($));  
})(OrangeMouseData);

Imported["OrangeMouseData"] = 1.0;
