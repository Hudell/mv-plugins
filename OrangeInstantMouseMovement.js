/*=============================================================================
 * Orange - Instant Mouse Movement
 * By Hudell - www.hudell.com
 * OrangeInstantMouseMovement.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
 /*:
 * @plugindesc This plugin will instantly teleport the player to the clicked position
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Latest Version
 * ============================================================================
 * 
 * Get the latest version of this script on
 * http://link.hudell.com/instant-mouse-movement
 * 
 *=============================================================================*/
 /*:pt-br
 * @plugindesc Este plugin vai teletransportar o jogador instantaneamente para a posição clicada
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Última Versão
 * ============================================================================
 * 
 * Baixe a última versão deste script em
 * http://link.hudell.com/instant-mouse-movement
 * 
 *=============================================================================*/

Game_Temp.prototype.setDestination = function(x, y) {
	$gamePlayer.setPosition(x, y);
};

var Imported = Imported || {};

// If MVCommons is imported, register the plugin with it's PluginManager.
if (Imported['MVCommons'] !== undefined) {
  PluginManager.register("OrangeInstantMouseMovement", "1.0.0", "This plugin will instantly teleport the player to the clicked position", {
    email: "plugins@hudell.com",
    name: "Hudell",
    website: "http://www.hudell.com"
  }, "2015-10-24");
} else {
  Imported["OrangeInstantMouseMovement"] = true;
}
