/*=============================================================================
 * Orange - DisableRefresh
 * By Hudell - www.hudell.com
 * OrangeDisableRefresh.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Disables F5 Refresh <OrangeDisableRefresh>
 * @author Hudell
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
Hudell.OrangeDisableRefresh = Hudell.OrangeDisableRefresh || {};

(function($) {
  $.oldSceneManager_onKeyDown = SceneManager.onKeyDown;
  SceneManager.onKeyDown = function(event) {
    if (event.keyCode == 116) return;
    $.oldSceneManager_onKeyDown.call(this, event);
  };
})(Hudell.OrangeDisableRefresh);

OrangeDisableRefresh = Hudell.OrangeDisableRefresh;
Imported.OrangeDisableRefresh = 1.0;