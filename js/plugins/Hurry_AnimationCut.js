/*:

 * @plugindesc オプションで戦闘アニメーションをオフにすることができます
 * @author ハーリー

 * @param 戦闘アニメ非表示
 * @desc オプションに追加される項目名です
 * @default 戦闘アニメ非表示

 * @help
 * オプションで戦闘アニメーションの表示を任意で切り替えることができます。
 * 戦闘の高速化や、低スペック環境でのプレイに適しています

 *Author ハーリー
 *Version 1.00:2016/7/10
 *Version 1.10:2016/7/12 オプションで初期状態からアニメが非表示になる不具合の修正
 */



(function(){
//プラグインパラメータ
 var pluginName = 'Hurry_AnimationCut';

 var getParamString = function(paramNames) {
 	var value = getParamOther(paramNames);
 	return value == null ? '' : value;
};

var getParamOther = function(paramNames) {
	if (!Array.isArray(paramNames)) paramNames = [paramNames];
	for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
var paramAnimationCut = getParamString(['戦闘アニメ非表示']);
//プラグイン

Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    if(ConfigManager.animationCut){
    }else{
    var data = { animationId: animationId, mirror: mirror, delay: delay };
    this._animations.push(data);
    }
};

ConfigManager.animationCut = false;

var _ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	_ConfigManager_applyData.apply(this, arguments);
        this.animationCut = this.readFlag(config, 'animationCut');
};

var _ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
	var config = _ConfigManager_makeData.apply(this, arguments);
        config.animationCut = this.animationCut;
        return config;
};

var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
	_Window_Options_addGeneralOptions.apply(this, arguments);
	this.addCommand(paramAnimationCut, 'animationCut');
};

})();