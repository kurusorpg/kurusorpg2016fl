//=============================================================================
// NYA_MillSecTimer.js
//=============================================================================
 
/*:
 * @plugindesc v1.0.0 ミリ秒に変更するタイマー関係のプラグイン
 * @author にゃたま
 *
 * @help
 * 概要:
 * ツクール標準のカウントダウンタイマーの表示をミリ秒表示に変えるプラグインです。
 *
 * プラグインコマンド:
 *   ありません
 * 
 * 
 * ライセンス:
 * このプラグインは以下のライセンスのもと、使用することができます。 
 *   Copyright (c) 2016 nyatama
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 */
 
(function() {

    var parameters = PluginManager.parameters('NYA_MillSecTimer');

    var _Sprite_Timer_updateBitmap = Sprite_Timer.prototype.updateBitmap;
    Sprite_Timer.prototype.updateBitmap = function() {
        if (this._millseconds !== $gameTimer.millseconds()) {
            this._seconds = $gameTimer.seconds();
            this._millseconds = $gameTimer.millseconds();
            this.redraw();
        }
    }
    
    // Game_Timer に millseconds を追加
    Game_Timer.prototype.millseconds = function() {
        return Math.floor(this._frames);
    };
    
    // Sprite_timer の timerText をオーバーライド
    var _Sprite_Timer_timerText = Sprite_Timer.prototype.timerText;
    Sprite_Timer.prototype.timerText = function() {
        var min = Math.floor(this._seconds / 60) % 60;
        var sec = this._seconds % 60;
        var millsec = this._millseconds % 60; 
        return min.padZero(2) + ':' + sec.padZero(2) + ':' + millsec.padZero(2);
    }
    
    // Sprite_timer の updatePosition をオーバーライド
    var _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition;
    Sprite_Timer.prototype.updatePosition = function() {
        //スーパークラスを呼び出す
        _Sprite_Timer_updatePosition.call(this);
        //タイマー表示を標準の位置より１０ピクセル左に移動する
        //this.x -= 10;
    };
    
    // Conditional Branch
    // Game_Interpreter の command111をオーバーライド
    var _Game_Interpreter_command111 = Game_Interpreter.prototype.command111;
    Game_Interpreter.prototype.command111 = function() {
        //スーパークラスを呼び出す
        var result = _Game_Interpreter_command111.call(this);
        switch (this._params[0]) {
        case 3:  // Timer
            if ($gameTimer.isWorking()) {
                if (this._params[2] === 0) {
                    // >=が選択されている場合
                    result = ($gameTimer.seconds() >= this._params[1]) && ($gameTimer.millseconds() % 60 === 0);
                } else {
                    // <=が選択されている場合
                    result = ($gameTimer.seconds() <= this._params[1]) && ($gameTimer.millseconds() % 60 === 0);
                }
            }
            break;
        }
        this._branch[this._indent] = result;
        if (this._branch[this._indent] === false) {
            this.skipBranch();
        }
        return true;
    };


})();