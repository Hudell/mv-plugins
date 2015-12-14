/*=============================================================================
 * Orange Lighting - Player Light
 * By Hudell - www.hudell.com
 * OrangeLightingPlayerLight.js
 * Version: 1.0.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Player Lights <OrangeLightingPlayerLight>
 * @author Hudell
 *
 * @param playerRadius
 * @desc The size of the light globe around the player
 * @default 40
 *
 * @param playerColor
 * @desc The color of the light around the player
 * @default #FFFFFF
 *
 * @param playerFlicker
 * @desc Should the plugin flick the light around the player?
 * @default false
 *
 * @param flashlightSwitch
 * @desc When this switch is on, a flashlight will be added to the player.
 * @default 0
 *
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
if (!Hudell || !Hudell.OrangeLighting) {
  throw new Error("Couldn't find Hudell's OrangeLighting plugin. Please add it before this add-on.");
}

(function(lightSystem) {
  "use strict";

  lightSystem.addOns.PlayerLight = {};

  (function(playerLight){
    var parameters = $plugins.filter(function(plugin) { return plugin.description.contains('<OrangeLightingPlayerLight>'); });
    if (parameters.length === 0) {
      throw new Error("Couldn't find Hudell's OrangeLightingPlayerLight parameters.");
    }
    playerLight.Parameters = parameters[0].parameters;
    playerLight.Param = {};
  
    playerLight.Param.playerRadius = Number(playerLight.Parameters.playerRadius || 40);
    playerLight.Param.playerColor = playerLight.Parameters.playerColor || '#FFFFFF';
    playerLight.Param.playerFlicker = (playerLight.Parameters.playerFlicker || "false").toUpperCase() === "TRUE";
    playerLight.Param.flashlightSwitch = Number(playerLight.Parameters.flashlightSwitch || 0);
    playerLight.enabled = true;

    playerLight.shouldShowFlashlight = function(){
      return playerLight.Param.flashlightSwitch > 0 && $gameSwitches.value(playerLight.Param.flashlightSwitch);
    };

    playerLight.getPlayerPosition = function() {
      return lightSystem.getCharacterPosition($gamePlayer);
    };

    //Refreshes the player's light
    playerLight.refresh = function() {
      if (!playerLight.enabled) return;

      lightSystem._showingFlashlight = playerLight.shouldShowFlashlight();

      var canvas = this._maskBitmap.canvas;
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = 'lighter';

      var positions = playerLight.getPlayerPosition();

      if (playerLight.shouldShowFlashlight()) {
        this._maskBitmap.makeFlashlightEffect(positions[0], positions[1], 0, playerLight.Param.playerRadius, playerLight.Param.playerColor, 'black', positions[2]);
      } else {
        if (playerLight.Param.playerRadius < 100) {
          this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 0, playerLight.Param.playerRadius, '#999999', 'black', playerLight.Param.playerFlicker);
        } else {
          this._maskBitmap.radialgradientFillRect(positions[0], positions[1], 20, playerLight.Param.playerRadius, playerLight.Param.playerColor, 'black', playerLight.Param.playerFlicker);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    playerLight.update = function(){
      if (!playerLight.enabled) return;

      if (playerLight.shouldShowFlashlight() !== lightSystem._showingFlashlight) {
        lightSystem.dirty = true;
      }

      if (playerLight.Param.playerFlicker && !playerLight.shouldShowFlashlight()) {
        lightSystem.dirty = true;
      }
    };

    lightSystem.on('afterRefreshMask', playerLight.refresh);
    lightSystem.on('updateMask', playerLight.update);


    (function($) {
      playerLight.Game_Player_prototype_update = $.update;
      $.update = function(sceneActive) {
        var oldD = this._direction;
        var oldX = this._x;
        var oldY = this._y;
        playerLight.Game_Player_prototype_update.call(this, sceneActive);

        if (this.isMoving() || oldD !== this._direction || oldX !== this._x || oldY !== this._y) {
          lightSystem.dirty = true;
        }
      };
    })(Game_Player.prototype);  


  })(lightSystem.addOns.PlayerLight);

})(Hudell.OrangeLighting);

Imported["OrangeLighting.PlayerLight"] = 1.0;