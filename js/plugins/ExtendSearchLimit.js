/*:
 * @plugindesc Extend Search Limit
 * @author aueki@4Gamer
 *
 * @param searchDistance
 * @desc search distance for a*.
 * @default 17
 * 
 * @help plugin command: searchDistance param
 * This plugin sets search distance parameter of A* at auto move path finding.
 */

/*:ja
 * @plugindesc 自動移動時の探索範囲を拡張します。
 * @author aueki@4Gamer
 *
 * @param searchDistance 
 * @desc 経路検索でa*に与える探索範囲を指定します（ノーマル版＝12）.
 * @default 17
 *
 * @help プラグインコマンド：searchDistance param
 *
 * A*アルゴリズムによる自動移動での探索範囲を指定します。
 */


(function() {
var parameters = PluginManager.parameters('ExtendSearchLimit');
var searchDistance= Number(parameters['searchDistance'] );

var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'searchDistance') {
		searchDistance=Number(args[0]);
    }
}

Game_Character.prototype.searchLimit = function() {
    return searchDistance;
};
})();
