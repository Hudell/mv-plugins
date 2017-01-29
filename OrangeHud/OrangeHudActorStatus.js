/*=============================================================================
 * Orange - Actor Status HUD
 * By HUDell - www.hudell.com
 * OrangeHudActorStatus.js
 * Version: 1.5.2
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Adds a new line to Orange Hud to display an actor's status
 * @author Hudell
 *
 * @param GroupName
 * @desc The name of the HUD group where this line should be displayed
 * @default main
 *
 * @param Pattern
 * @desc The pattern of the line that will be drawn. Click the help button for more info.
 * @default <hp> / <mhp>
 *
 * @param ActorIndex
 * @desc The index of the actor in the party. If the index is invalid, nothing will be shown
 * @default 0
 *
 * @param SwitchId
 * @desc Set this to a switch number to use it to control the visibility of this line
 * @default 0
 *
 * @param X
 * @desc The X position of the variable line inside the HUD
 * @default 
 *
 * @param Y
 * @desc The Y position of the variable line inside the HUD
 * @default 
 *
 * @param FontFace
 * @desc The font face to use. Leave empty to use the HUD default
 * @default 
 *
 * @param FontSize
 * @desc The font size to use. Leave empty to use the HUD default
 * @default
 *
 * @param FontColor
 * @desc The font color to use. Leave empty to use the HUD default
 * @default
 *
 * @param FontItalic
 * @desc Should use italic? Leave empty to use the HUD default
 * @default
 *
 * @param ScriptPattern
 * @desc A script call to be used instead of the Pattern
 * @default 
 *
 * @help
 * ============================================================================
 * My Blog:
 * ============================================================================
 * http://hudell.com
 * ============================================================================
 * Valid variables:
 * ============================================================================
 * <hp>
 * <mp>
 * <tp>
 * <mhp>
 * <mmp>
 * <atk>
 * <def>
 * <mat>
 * <mdf>
 * <agi>
 * <luk>
 * <hit>
 * <eva>
 * <cri>
 * <cev>
 * <mev>
 * <mrf>
 * <cnt>
 * <hrg>
 * <mrg>
 * <trg>
 * <tgr>
 * <grd>
 * <rec>
 * <pha>
 * <mcr>
 * <tcr>
 * <pdr>
 * <mdr>
 * <fdr>
 * <exr>
 * <level>
 * <maxlevel>
 * */

var Imported = Imported || {};

if (Imported["OrangeHud"] === undefined) {
  throw new Error("Please add OrangeHud before OrangeHudActorStatus!");
}

var OrangeHudActorStatusLine = OrangeHudActorStatusLine || {};

if (Imported["OrangeHudActorStatus"] === undefined) {
  OrangeHudActorStatusLine.validateParams = function(line) {
    line.GroupName = line.GroupName || "main";
    
    if (line.ScriptPattern !== undefined && line.ScriptPattern.trim() === "") {
      line.ScriptPattern = undefined;
    }

    if (line.Pattern === undefined) {
      line.Pattern = "<hp> / <mhp>";
    } else if (line.Pattern.trim() === "") {
      line.Pattern = "";
    }

    line.ActorIndex = Number(line.ActorIndex || 0);
    if (line.FontFace === undefined || line.FontFace.trim() === "") {
      line.FontFace = OrangeHud.Param.DefaultFontFace;
    }

    if (line.FontColor === undefined || line.FontColor.trim() === "") {
      line.FontColor = OrangeHud.Param.DefaultFontColor;
    }

    line.FontSize = Number(line.FontSize || OrangeHud.Param.DefaultFontSize);
    line.X = Number(line.X || 0);
    line.Y = Number(line.Y || 0);

    if (line.FontItalic === undefined || line.FontItalic.trim() === "") {
      line.FontItalic = OrangeHud.Param.DefaultFontItalic;
    } else {
      line.FontItalic = line.FontItalic == "true";
    }

    line.SwitchId = Number(line.SwitchId || 0);
  };

  OrangeHudActorStatusLine.drawLine = function(window, variableData) {
    if (variableData.SwitchId > 0) {
      if (!$gameSwitches.value(variableData.SwitchId)) {
        return;
      }
    }

    var line = this.getLine(variableData);

    window.contents.fontFace = variableData.FontFace;
    window.contents.fontSize = variableData.FontSize;
    window.contents.fontItalic = variableData.FontItalic;
    window.changeTextColor(variableData.FontColor);

    window.drawTextEx(line, variableData.X, variableData.Y);

    window.resetFontSettings();
  };

  OrangeHudActorStatusLine.getLine = function(variableData) {
    var pattern = variableData.Pattern;
    if (variableData.ScriptPattern !== undefined) {
      pattern = Function("return " + variableData.ScriptPattern)();
    }

    var members = $gameParty.members();
    if (members.length > variableData.ActorIndex) {
      var line = pattern;
      var actorData = members[variableData.ActorIndex];

      line = line.replace(/\<hp\>/gi, actorData.hp);
      line = line.replace(/\<mp\>/gi, actorData.mp);
      line = line.replace(/\<tp\>/gi, actorData.tp);
      line = line.replace(/\<mhp\>/gi, actorData.mhp);
      line = line.replace(/\<mmp\>/gi, actorData.mmp);
      line = line.replace(/\<atk\>/gi, actorData.atk);
      line = line.replace(/\<def\>/gi, actorData.def);
      line = line.replace(/\<mat\>/gi, actorData.mat);
      line = line.replace(/\<mdf\>/gi, actorData.mdf);
      line = line.replace(/\<agi\>/gi, actorData.agi);
      line = line.replace(/\<luk\>/gi, actorData.luk);
      line = line.replace(/\<hit\>/gi, actorData.hit);
      line = line.replace(/\<eva\>/gi, actorData.eva);
      line = line.replace(/\<cri\>/gi, actorData.cri);
      line = line.replace(/\<cev\>/gi, actorData.cev);
      line = line.replace(/\<mev\>/gi, actorData.mev);
      line = line.replace(/\<mrf\>/gi, actorData.mrf);
      line = line.replace(/\<cnt\>/gi, actorData.cnt);
      line = line.replace(/\<hrg\>/gi, actorData.hrg);
      line = line.replace(/\<mrg\>/gi, actorData.mrg);
      line = line.replace(/\<trg\>/gi, actorData.trg);
      line = line.replace(/\<tgr\>/gi, actorData.tgr);
      line = line.replace(/\<grd\>/gi, actorData.grd);
      line = line.replace(/\<rec\>/gi, actorData.rec);
      line = line.replace(/\<pha\>/gi, actorData.pha);
      line = line.replace(/\<mcr\>/gi, actorData.mcr);
      line = line.replace(/\<tcr\>/gi, actorData.tcr);
      line = line.replace(/\<pdr\>/gi, actorData.pdr);
      line = line.replace(/\<mdr\>/gi, actorData.mdr);
      line = line.replace(/\<fdr\>/gi, actorData.fdr);
      line = line.replace(/\<exr\>/gi, actorData.exr);
      line = line.replace(/\<level\>/gi, actorData.level);
      line = line.replace(/\<maxlevel\>/gi, actorData.maxLevel());
      line = line.replace(/\<exp\>/gi, actorData.currentExp());

      return line;
    } else {
      return '';
    }
  };

  OrangeHudActorStatusLine.getValue = function(variableData) {
    return this.getLine(variableData);
  };

  OrangeHudActorStatusLine.getKey = function(variableData) {
    return 'actor' + variableData.ActorIndex;
  };

  OrangeHud.registerLineType('OrangeHudActorStatus', OrangeHudActorStatusLine);
  Imported.OrangeHudActorStatus = 1.5;
}