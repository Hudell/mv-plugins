/*=============================================================================
 * Orange - EnableConsole
 * By Hudell - www.hudell.com
 * OrangeEnableConsole.js
 * Version: 1.0
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Plugin Description <OrangeEnableConsole>
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

Utils.isOptionValid = function(name) {
  if (name == 'test') {
    return true;
  }
  return location.search.slice(1).split('&').contains(name);
};
