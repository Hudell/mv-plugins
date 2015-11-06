/*=============================================================================
 * Orange - HUD 
 * By HUDell - www.hudell.com
 * OrangeHud.js
 * Version: 1.4
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Creates a custom HUD based on the params
 *
 * @author Hudell
 *
 * @param DefaultFontFace
 * @desc The font face to use by default
 * @default Verdana
 *
 * @param DefaultFontSize
 * @desc The font size to use by default
 * @default 18
 *
 * @param DefaultFontColor
 * @desc The font color to use by default
 * @default #FFFFFF
 *
 * @param DefaultFontItalic
 * @desc Should use italic by default?
 * @default false
 *
 * @param HudWidth
 * @desc The width of the hud. 0 == 100%
 * @default 0
 *
 * @param HudHeight
 * @desc The height of the hud. 0 == 100%
 * @default 0
 *
 * @param HudX
 * @desc The X position of the hud
 * @default 0
 *
 * @param HudY
 * @desc The Y position of the hud
 * @default 0
 *
 * @param HudOpacity
 * @desc The Opacity of the hud
 * @default 0
 *
 * @param SwitchId
 * @desc Number of a switch to hide / show the hud
 * @default 0
 *
 * @param WindowMargin
 * @desc The number of pixels to use on the margin of the hud window
 * @default 4
 *
 * @param WindowPadding
 * @desc The number of pixels to use on the padding of the hud window
 * @default 18
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/hud
 * 
 *=============================================================================*/
var Imported = Imported || {};

var OrangeHud = OrangeHud || {};

function Window_OrangeHud() {
    this.initialize.apply(this, arguments);
}

Window_OrangeHud.prototype = Object.create(Window_Base.prototype);
Window_OrangeHud.prototype.constructor = Window_OrangeHud;

if (Imported["MVCommons"] === undefined) {
  (function($){ 
    $.getParamList = function(partialPluginName) { var list = []; for (var pluginName in PluginManager._parameters) { if (pluginName.search(partialPluginName.toLowerCase()) >= 0) { list.push(PluginManager._parameters[pluginName]); } } return list; };
  })(PluginManager);

  if (Utils.isOptionValid('test')) {
    console.log('MVC not found, OrangeHud will be using essentials (copied from MVC 1.2.1).');
  }
}

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('OrangeHud');
  $.Param = $.Param || {};

  $.Param.DefaultFontSize = Number($.Parameters.DefaultFontSize || 18);
  $.Param.DefaultFontColor = String($.Parameters.DefaultFontColor || '#FFFFFF');
  $.Param.DefaultFontItalic = $.Parameters.DefaultFontItalic === "true";

  $.Param.HudWidth = Number($.Parameters.HudWidth || SceneManager._screenWidth);
  if ($.Param.HudWidth === 0) {
    $.Param.HudWidth = SceneManager._screenWidth;
  }
  $.Param.HudHeight = Number($.Parameters.HudHeight || SceneManager._screenHeight);
  if ($.Param.HudHeight === 0) {
    $.Param.HudHeight = SceneManager._screenHeight;
  }
  $.Param.HudX = Number($.Parameters.HudX || 0);
  $.Param.HudY = Number($.Parameters.HudY || 0);
  $.Param.HudOpacity = Number($.Parameters.HudOpacity || 0);

  $.Param.SwitchId = Number($.Parameters.SwitchId || 0);
  $.Param.WindowMargin = Number($.Parameters.WindowMargin || 4);
  $.Param.WindowPadding = Number($.Parameters.WindowPadding || 18);

  $._addons = {};

  $.registerLineType = function(lineType, manager) {
    $._addons[lineType] = {
      manager : manager,
      lines : {},
      params : PluginManager.getParamList(lineType)
    };

    for (var i = 0; i < $._addons[lineType].params.length; i++) {
      manager.validateParams($._addons[lineType].params[i]);
    }
  };

  Window_OrangeHud.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
    this.refresh();
  };

  Window_OrangeHud.prototype.windowWidth = function() {
    return $.Param.HudWidth;
  };
  Window_OrangeHud.prototype.windowHeight = function() {
    return $.Param.HudHeight;
  };

  Window_OrangeHud.prototype.drawTextEx = function(text, x, y) {
    if (text) {
      var textState = {
        index: 0,
        x: x,
        y: y,
        left: x
      };

      //Adds line break support with \n
      textState.text = text.replace(/\\n/g, '\n');

      textState.text = this.convertEscapeCharacters(textState.text);
      textState.height = this.calcTextHeight(textState, false);
      // this.resetFontSettings();
      while (textState.index < textState.text.length) {
        this.processCharacter(textState);
      }
      return textState.x - x;
    } else {
      return 0;
    }
  };

  Window_OrangeHud.prototype.drawPicture = function(filename, x, y) {
    var bitmap = ImageManager.loadPicture(filename);
    this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y);
  };

  Window_OrangeHud.prototype.refresh = function() {
    if (this.contents) {
      this.contents.clear();
      this.drawHud();
    }
  };

  Window_OrangeHud.prototype.drawHud = function() {
    var self = this;
    this._lines = {};

    for (var lineType in $._addons) {
      var addOn = $._addons[lineType];

      addOn.params.forEach(function(line){
        addOn.manager.drawLine(self, line);
        addOn.lines[addOn.manager.getKey(line)] = addOn.manager.getValue(line);
      });
    }
  };

  Window_OrangeHud.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    var shouldRefresh = false;
    var self = this;
    
    for (var lineType in $._addons) {
      var addOn = $._addons[lineType];

      addOn.params.forEach(function(line){
        var key = addOn.manager.getKey(line);
        var value = addOn.manager.getValue(line);

        if (value != addOn.lines[key]) {
          shouldRefresh = true;
        }
      });
    }

    if (shouldRefresh) {
      this.refresh();
    }
  };

  var oldSceneMap_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    oldSceneMap_start.call(this);

    this.createVarHudWindow();

    if ($.Param.SwitchId !== undefined && $.Param.SwitchId > 0) {
      this._varHudWindow.visible = $gameSwitches.value($.Param.SwitchId);
    }
  };

  Scene_Map.prototype.createVarHudWindow = function() {
    this._varHudWindow = new Window_OrangeHud();
    this._varHudWindow.x = $.Param.HudX;
    this._varHudWindow.y = $.Param.HudY;
    this._varHudWindow.opacity = $.Param.HudOpacity;
    this._varHudWindow.padding = $.Param.WindowPadding;
    this._varHudWindow.margin = $.Param.WindowMargin;

    this.addChild(this._varHudWindow);
  };

  var oldSceneMap_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    oldSceneMap_update.call(this);

    if ($.Param.SwitchId !== undefined && $.Param.SwitchId > 0) {
      this._varHudWindow.visible = $gameSwitches.value($.Param.SwitchId);
    }

    this._varHudWindow.update();
  };
})(OrangeHud);

Imported.OrangeHud = 1.4;