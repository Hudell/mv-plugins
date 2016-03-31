/*=============================================================================
 * Orange - Pathfinding
 * By Hudell - www.hudell.com
 * OrangePathfinding.js
 * Version: 1.0.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Faster Pathfinding for Rpg Maker MV <OrangePathfinding>
 * @author Hudell
 *
 * @param searchLimit
 * @desc The higher this number, the smarter (and slower) the pathfinding will be
 * @default 12
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
Hudell.OrangePathfinding = Hudell.OrangePathfinding || {};

if (Imported["SuperOrangeMovement"] !== undefined || Imported["SuperOrangeMovementEx"] !== undefined) {
  throw new Error("You don't need OrangePathfinding if you're using Super Orange Movement.");
}

(function($) {
  "use strict";

  var parameters = $plugins.filter(function(plugin) {
    return plugin.description.contains('<OrangePathfinding>');
  });
  if (parameters.length === 0) {
    throw new Error("Couldn't find Hudell's OrangePathfinding parameters.");
  }
  $.Parameters = parameters[0].parameters;
  $.Param = {};
  $.Param.searchLimit = Number($.Parameters.searchLimit || 12);

  Game_Character.prototype.getDirectionNode = function(start, goalX, goalY) {
    var searchLimit = this.searchLimit();
    var mapWidth = $gameMap.width();
    var nodeList = [];
    var openList = [];
    var closedList = [];
    var best = start;

    if (this.x === goalX && this.y === goalY) {
      return undefined;
    }

    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
      var bestIndex = 0;
      for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].f < nodeList[bestIndex].f) {
          bestIndex = i;
        }
      }

      var current = nodeList[bestIndex];
      var x1 = current.x;
      var y1 = current.y;
      var pos1 = y1 * mapWidth + x1;
      var g1 = current.g;

      nodeList.splice(bestIndex, 1);
      openList.splice(openList.indexOf(pos1), 1);
      closedList.push(pos1);

      if (current.x === goalX && current.y === goalY) {
        best = current;
        break;
      }

      if (g1 >= searchLimit) {
        continue;
      }

      for (var j = 0; j < 4; j++) {
        var direction = 2 + j * 2;

        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);

        var pos2 = y2 * mapWidth + x2;

        if (closedList.contains(pos2)) {
          continue;
        }
        if (!this.canPass(x1, y1, direction) && (x2 !== goalX || y2 !== goalY)) {
          continue;
        }

        var g2 = g1 + 1;
        var index2 = openList.indexOf(pos2);

        if (index2 < 0 || g2 < nodeList[index2].g) {
          var neighbor;
          if (index2 >= 0) {
            neighbor = nodeList[index2];
          } else {
            neighbor = {};
            nodeList.push(neighbor);
            openList.push(pos2);
          }
          neighbor.parent = current;
          neighbor.x = x2;
          neighbor.y = y2;
          neighbor.g = g2;
          neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);

          if (!best || neighbor.f - neighbor.g < best.f - best.g) {
            best = neighbor;
          }
        }
      }
    }

    return best;
  };

  Game_Character.prototype.clearCachedNode = function() {
    this.setCachedNode();
  };

  Game_Character.prototype.setCachedNode = function(node, goalX, goalY) {
    this._cachedNode = node;
    this._cachedGoalX = goalX;
    this._cachedGoalY = goalY;
  };

  Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    if (this.x === goalX && this.y === goalY) {
      return 0;
    }

    if (this._cachedGoalX !== goalX || this._cachedGoalY !== goalY) {
      this.clearCachedNode();
    }

    var node = this._cachedNode;

    var start = {};
    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);

    var canRetry = true;
    if (node === undefined) {
      node = this.getDirectionNode(start, goalX, goalY);
      this.setCachedNode(node, goalX, goalY);
      if (node === undefined) {
        return 0;
      }
      canRetry = false;
    }

    if (node.x !== start.x || node.y !== start.y) {
      while (node.parent && (node.parent.x !== start.x || node.parent.y !== start.y)) {
        node = node.parent;
      }

      if (!node.parent) {
        this.clearCachedNode();
        if (canRetry) {
          node = this.getDirectionNode(start, goalX, goalY);
          this.setCachedNode(node, goalX, goalY);
          if (node === undefined) {
            return 0;
          }
        }
      }
    }

    var deltaX1 = $gameMap.deltaX(node.x, start.x);
    var deltaY1 = $gameMap.deltaY(node.y, start.y);

    if (deltaY1 > 0) {
      return 2;
    } else if (deltaX1 < 0) {
      return 4;
    } else if (deltaX1 > 0) {
      return 6;
    } else if (deltaY1 < 0) {
      return 8;
    }

    var deltaX2 = this.deltaXFrom(goalX);
    var deltaY2 = this.deltaYFrom(goalY);
    var direction = 0;

    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
      direction = deltaX2 > 0 ? 4 : 6;
    } else if (deltaY2 !== 0) {
      direction = deltaY2 > 0 ? 8 : 2;
    }

    if (direction > 0) {
      if (!this.canPass(this._x, this._y, direction)) {
        this.clearCachedNode();
        direction = 0;
      }
    }

    return direction;
  };

  Game_Character.prototype.searchLimit = function() {
    return $.Param.searchLimit;
  };

})(Hudell.OrangePathfinding);

Imported["OrangePathfinding"] = 1.0;