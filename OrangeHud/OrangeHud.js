/*=============================================================================
 * Orange - HUD 
 * By HUDell - www.hudell.com
 * OrangeHud.js
 * Version: 2.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc <OrangeHud> 2.1 - Creates a custom HUD based on the params
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
 * @param ShowOnMap
 * @desc Display this HUD on the map
 * @default true
 *
 * @param ShowOnBattle
 * @desc Display this HUD on battles?
 * @default false
 *
 * @param ShowOnMenu
 * @desc Display this HUD on the menu?
 * @default false
 *
 * @param ShowOnTitle
 * @desc Display this HUD on the title screen?
 * @default false
 *
 * @param ShowUnderTintLayer
 * @desc Set this to true to hide the HUD under tint and fade effects
 * @default false
 *
 * @param AutoRefresh
 * @desc Set this to false to disable automatic refresh of the HUD
 * @default true
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

  var plugin = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeHud>'); })[0];
  $.Parameters = plugin.parameters;
  $.Param = $.Param || {};

  $.Param.GroupName = "main";
  $.Param.DefaultFontFace = String($.Parameters.DefaultFontFace || "GameFont");
  $.Param.DefaultFontSize = Number($.Parameters.DefaultFontSize || 18);
  $.Param.DefaultFontColor = String($.Parameters.DefaultFontColor || '#FFFFFF');
  $.Param.DefaultFontItalic = $.Parameters.DefaultFontItalic === "true";
  $.Param.ShowUnderTintLayer = ($.Parameters.ShowUnderTintLayer || "false").toLowerCase() === "true";

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
  $.Param.WindowMargin = Number($.Parameters.WindowMargin);
  if (isNaN($.Param.WindowMargin)) {
    $.Param.WindowMargin = 4;
  }
  $.Param.WindowPadding = Number($.Parameters.WindowPadding);
  if (isNaN($.Param.WindowPadding)) {
    $.Param.WindowPadding = 18;
  }

  $.Param.ShowOnTitle = $.Parameters.ShowOnTitle === "true";
  $.Param.ShowOnMenu = $.Parameters.ShowOnMenu === "true";
  $.Param.ShowOnBattle = $.Parameters.ShowOnBattle === "true";
  $.Param.ShowOnMap = $.Parameters.ShowOnMap !== "false";
  $.Param.AutoRefresh = $.Parameters.AutoRefresh !== "false";

  $._addons = {};
  $._groups = {};
  $._isDirty = false;

  $.setDirty = function() {
    $._isDirty = true;
  };

  $.refresh = function() {
    $.setDirty();
  };

  $.validateGroupParams = function(params) {
    params.GroupName = params.GroupName || "group";
    params.AutoRefresh = params.AutoRefresh !== "false";
    params.DefaultFontFace = String(params.DefaultFontFace || "GameFont");
    params.DefaultFontSize = Number(params.DefaultFontSize || 18);
    params.DefaultFontColor = String(params.DefaultFontColor || '#FFFFFF');
    params.DefaultFontItalic = params.DefaultFontItalic === "true";
    params.ShowUnderTintLayer = (params.ShowUnderTintLayer || "false").toLowerCase() === "true";

    params.HudWidth = Number(params.HudWidth || SceneManager._screenWidth);
    if (params.HudWidth === 0) {
      params.HudWidth = SceneManager._screenWidth;
    }
    params.HudHeight = Number(params.HudHeight || SceneManager._screenHeight);
    if (params.HudHeight === 0) {
      params.HudHeight = SceneManager._screenHeight;
    }
    params.HudX = Number(params.HudX || 0);
    params.HudY = Number(params.HudY || 0);
    params.HudOpacity = Number(params.HudOpacity || 0);

    params.SwitchId = Number(params.SwitchId || 0);
    params.WindowMargin = Number(params.WindowMargin || 4);
    params.WindowPadding = Number(params.WindowPadding || 18);

    params.ShowOnTitle = params.ShowOnTitle === "true";
    params.ShowOnMenu = params.ShowOnMenu === "true";
    params.ShowOnBattle = params.ShowOnBattle === "true";
    params.ShowOnMap = params.ShowOnMap !== "false";
  };

  $.configureGroups = function() {
    this._groups = {
      main : [this.Param]
    };

    var groups = PluginManager.getParamList('OrangeHudGroup');
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      this.validateGroupParams(group);

      if (!!group.GroupName) {
        if (this._groups[group.GroupName] === undefined) {
          this._groups[group.GroupName] = [];
        }

        this._groups[group.GroupName].push(group);
      }
    }
  };

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

  Window_OrangeHud.prototype.initialize = function(group) {
    this.group = group;
    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
    this.refresh();
  };

  Window_OrangeHud.prototype.windowWidth = function() {
    return this.group.HudWidth;
  };
  Window_OrangeHud.prototype.windowHeight = function() {
    return this.group.HudHeight;
  };

  Window_OrangeHud.prototype.standardPadding = function() {
    return this.group.WindowPadding;
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
        if (line.GroupName == self.group.GroupName || (!line.GroupName && self.group.GroupName == "main")) {
          addOn.manager.drawLine(self, line);
          addOn.lines[addOn.manager.getKey(line)] = addOn.manager.getValue(line);
        }
      });
    }
  };

  Window_OrangeHud.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    var shouldRefresh = $._isDirty;
    var self = this;

    if (self.group.AutoRefresh) {
      for (var lineType in $._addons) {
        var addOn = $._addons[lineType];

        addOn.params.forEach(function(line){
          if (line.GroupName == self.group.GroupName || (!line.GroupName && self.group.GroupName == "main")) {
            var key = addOn.manager.getKey(line);
            var value = addOn.manager.getValue(line);

            if (value != addOn.lines[key]) {
              shouldRefresh = true;
            }
          }
        });
      }
    }
    

    if (shouldRefresh) {
      this.refresh();
    }
  };

  $.canShowOnThisScene = function(scene) {
    if (scene instanceof Scene_Map) {
      return $.Param.ShowOnMap;
    } else if (scene instanceof Scene_Menu) {
      return $.Param.ShowOnMenu;
    } else if (scene instanceof Scene_Battle) {
      return $.Param.ShowOnBattle;
    } else if (scene instanceof Scene_Title) {
      return $.Param.ShowOnTitle;
    } else {
      return false;
    }
  };

  var oldSceneBase_start = Scene_Base.prototype.start;
  Scene_Base.prototype.start = function() {
    oldSceneBase_start.call(this);

    if (!$.canShowOnThisScene(this)) {
      return;
    }

    this.createVarHudWindow();
  };

  Scene_Base.prototype.createVarHudWindow = function() {
    this._hudWindows = {};
    for (var key in OrangeHud._groups) {
      var groups = OrangeHud._groups[key];

      this._hudWindows[key] = [];

      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        var newWindow = new Window_OrangeHud(group);
        newWindow.x = group.HudX;
        newWindow.y = group.HudY;
        newWindow.opacity = group.HudOpacity;
        newWindow.padding = group.WindowPadding;
        newWindow.margin = group.WindowMargin;

        this._hudWindows[key].push(newWindow);

        if (this instanceof Scene_Map && group.ShowUnderTintLayer) {
          this._spriteset._baseSprite.addChild(newWindow);
        } else {
          this.addChild(newWindow);
        }

        if (group.SwitchId !== undefined && group.SwitchId > 0) {
          newWindow.visible = $gameSwitches.value(group.SwitchId);
        }
      }
    }
  };

  var oldSceneBase_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    oldSceneBase_update.call(this);

    if (this._hudWindows === undefined) {
      return;
    }

    for (var key in this._hudWindows) {
      var groupWindows = this._hudWindows[key];

      for (var i = 0; i < groupWindows.length; i++) {
        var hudWindow = groupWindows[i];

        if (SceneManager.isSceneChanging()) {
          hudWindow.visible = false;
        } else {
          if (hudWindow.group.SwitchId !== undefined && hudWindow.group.SwitchId > 0) {
            hudWindow.visible = $gameSwitches.value(hudWindow.group.SwitchId);
          } else {
            hudWindow.visible = true;
          }
        }

        hudWindow.update();
      }
    }

    $._isDirty = false;
  };

  var oldSceneMap_updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function() {  
    oldSceneMap_updateScene.call(this);
    if (SceneManager.isSceneChanging()) {
      if (this._hudWindows === undefined) {
        return;
      }

      for (var key in this._hudWindows) {
        var groupWindows = this._hudWindows[key];

        for (var i = 0; i < groupWindows.length; i++) {
          var hudWindow = groupWindows[i];

          hudWindow.visible = false;
        }
      }
    }
  };
  
  var oldGameMap_requestRefresh = Game_Map.prototype.requestRefresh;
  Game_Map.prototype.requestRefresh = function(mapId) {
    oldGameMap_requestRefresh.call(this, mapId);
    $._isDirty = true;
  };

  $.configureGroups();
})(OrangeHud);

Imported.OrangeHud = 2.1;