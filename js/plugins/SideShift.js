//=============================================================================
// SideShift.js
//=============================================================================

/*:
 * @plugindesc Plugin sample to set monsters left-side.
 * @author aueki@4Gamer
 *
 * @param shift
 * @desc Value to add x. 
 * @default -150
 *
 *
 * @help This plugin does not provide plugin commands.
 *
 */

/*:ja
 * @plugindesc サイドビューバトル時に敵を左にずらします。
 * @author aueki@4Gamer
 *
 * @param shift
 * @desc x軸方向の移動量
 * @default -150
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * サイドビューバトル時に敵を左にずらします。
 */
 
(function() {
  var parameters = PluginManager.parameters('SideShift');
    var shift = Number(parameters['shift'] );
    $dbgTracer ="test";
    var _Game_Enemy_prototype_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup  = function(enemyId, x, y) {
    _Game_Enemy_prototype_setup.call(this, enemyId, x+shift, y);
};

/*
    Game_Enemy.prototype.setup  = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x + shift;
    this._screenY = y;
    this.recoverAll();
    };
*/

})();