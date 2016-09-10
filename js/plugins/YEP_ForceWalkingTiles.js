//=============================================================================
// Yanfly Engine Plugins - Force walking Tiles
// YEP_ForceWalkingTiles.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_ForceWalkingTiles = true;

var Yanfly = Yanfly || {};
Yanfly.Walk = Yanfly.Walk || {};

//=============================================================================
 /*:
 * @plugindesc v1.01a You can create walking tiles by marking them with
 * either a terrain tag or a region number.
 * @author Yanfly Engine Plugins & Nyatama
 *
 * @param Walking Frame
 * @desc This is the frame used while characters are sliding.
 * @default 2
 *
 * @param Walking Up Region
 * @desc Any tile marked with this region is a walking tile
 * regardless of terrain tag. Use 0 to ignore.
 * @default 0
 *
 * @param Walking Right Region
 * @desc Any tile marked with this region is a walking tile
 * regardless of terrain tag. Use 0 to ignore.
 * @default 0
 *
 * @param Walking Down Region
 * @desc Any tile marked with this region is a walking tile
 * regardless of terrain tag. Use 0 to ignore.
 * @default 0
 *
 * @param Walking Left Region
 * @desc Any tile marked with this region is a walking tile
 * regardless of terrain tag. Use 0 to ignore.
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin enables you to set which tiles are walking tiles through either
 * regions or notetags. To use regions, change the parameter setting to which
 * region ID you would like to associate with a walking tile.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * You can use these notetags to add walking tiles to your tilesets.
 *
 * Tileset Notetag:
 *   <Waking Up Tile: x>
 *   <Waking Up Tile: x, x, x>
 *   <Waking Right Tile: x>
 *   <Waking Right Tile: x, x, x>
 *   <Waking Down Tile: x>
 *   <Waking Down Tile: x, x, x>
 *   <Waking Left Tile: x>
 *   <Waking Left Tile: x, x, x>
 *   Tiles with terrain ID x will be designated as walking tiles.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Added failsafe for people who aren't using tilesets 
 *
 * Version 1.00:
 * - Finished Plugin!
 */
/*:ja
 * @plugindesc v1.01a タイルに地形タグをマークしたりリージョンナンバーを振ることで、指定した方向に滑るタイルを作成できます。
 * @author Yanfly Engine Plugins ＆ にゃたま
 *
 * @param Walking Frame
 * @desc キャラクターが滑る際に使われるフレームです。
 * @default 2
 *
 * @param Walking Up Region
 * @desc このリージョンを振られたタイルは、地形タグに関わらず、上に滑るタイルとなります。0を入れることで無効になります。
 * @default 0
 *
 * @param Walking Right Region
 * @desc このリージョンを振られたタイルは、地形タグに関わらず、右に滑るタイルとなります。0を入れることで無効になります。
 * @default 0
 *
 * @param Walking Down Region
 * @desc このリージョンを振られたタイルは、地形タグに関わらず、下に滑るタイルとなります。0を入れることで無効になります。
 * @default 0
 *
 * @param Walking Left Region
 * @desc このリージョンを振られたタイルは、地形タグに関わらず、左に滑るタイルとなります。0を入れることで無効になります。
 * @default 0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * このプラグインを使えば、リージョンやノートタグによって、滑るタイルを設定する
 * ことができるようになります。リージョンを使う場合は、パラメーターセッティング
 * から、どのリージョンIDを紐づけたいか指定してください。
 *
 * 注)尚このプラグインはにゃたまがYEP_SlipperyTiles.js v1.01を改変したもので
 * Yanfly Engine Plugins様の公式プラグインではありません。
 * Yanfly Engine Plugins様に問い合わせたりしないようご注意下さい。
 * ツクマテ掲示板にバグ報告はかまいませんが必ずしも対応できるとは限りません。
 * ご了承願います。
 *
 * 最後に…ソースコードに書いたコメントはJavaScriptの経験の浅い者が書きました。
 * 正しいかもわからないので参考にしないようご注意願います。
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * 下記のノートタグを使って、タイルセットに滑るタイルを加えてください。
 *
 * タイルセットのノートタグ:
 * ○上に滑るタイル
 *   <Waking Up Tile: x>
 *   <Waking Up Tile: x, x, x>
 * ○右に滑るタイル
 *   <Waking Right Tile: x>
 *   <Waking Right Tile: x, x, x>
 * ○下に滑るタイル
 *   <Waking Down Tile: x>
 *   <Waking Down Tile: x, x, x>
 * ○左に滑るタイル
 *   <Waking Left Tile: x>
 *   <Waking Left Tile: x, x, x>
 *   これで地形ID x を持ったタイルが、指定した方向に滑るタイルとして指定されます。
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_ForceWalkingTiles');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.WalkUpRegion = Number(Yanfly.Parameters['Walking Up Region']);
Yanfly.Param.WalkRightRegion = Number(Yanfly.Parameters['Walking Right Region']);
Yanfly.Param.WalkDownRegion = Number(Yanfly.Parameters['Walking Down Region']);
Yanfly.Param.WalkLeftRegion = Number(Yanfly.Parameters['Walking Left Region']);
Yanfly.Param.WalkFrame = Number(Yanfly.Parameters['Walking Frame']);

//=============================================================================
// DataManager
//=============================================================================

Yanfly.Walk.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Yanfly.Walk.DataManager_isDatabaseLoaded.call(this)) return false;
		this.processWalkNotetags($dataTilesets);
		return true;
};

DataManager.processWalkNotetags = function(group) {
  var regexp1 = /<(?:WALKING UP tile):[ ]*(\d+(?:\s*,\s*\d+)*)>/i;
  var regexp2 = /<(?:WALKING RIGHT tile):[ ]*(\d+(?:\s*,\s*\d+)*)>/i;
  var regexp3 = /<(?:WALKING DOWN tile):[ ]*(\d+(?:\s*,\s*\d+)*)>/i;
  var regexp4 = /<(?:WALKING LEFT tile):[ ]*(\d+(?:\s*,\s*\d+)*)>/i;
    for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

        obj.walking_up = [];
        obj.walking_right = [];
        obj.walking_down = [];
        obj.walking_left = [];

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(regexp1)) {
                var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
                obj.walking_up = obj.walking_up.concat(array);
            }
            if (line.match(regexp2)) {
                var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
                obj.walking_right = obj.walking_right.concat(array);
            }
            if (line.match(regexp3)) {
                var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
                obj.walking_down = obj.walking_down.concat(array);
            }
            if (line.match(regexp4)) {
                var array = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
                obj.walking_left = obj.walking_left.concat(array);
            }
		}
	}
};

//=============================================================================
// Game_Map
//=============================================================================

// 強制上進行タイルを判定
Game_Map.prototype.isWalkingUp = function(mx, my) {
    if (this.isValid(mx, my) && this.tileset()) {
        // プレイヤーの現在位置のリージョンIDを取得しプラグインオプションのWalkUpRegionに合致したらtrueフラグを返す
        if (Yanfly.Param.WalkUpRegion !== 0 && this.regionId(mx, my) === Yanfly.Param.WalkUpRegion) {
            return true;
        }
        // プレイヤーの現在位置のタイルのタグIDを取得
        var tagId = this.terrainTag(mx, my);
        // 滑る床のタグIDリストslipTiles[x y z]を取得　<Slippery Tile: x, y, z>
        var walkTiles = this.tileset().walking_up;
        // 滑る床のタグIDリストと現在いる位置のタグIDを比較した結果を返す
        return walkTiles.contains(tagId);
    }
    return false;
};

// 強制右進行タイルを判定
Game_Map.prototype.isWalkingRight = function(mx, my) {
    if (this.isValid(mx, my) && this.tileset()) {
        // プレイヤーの現在位置のリージョンIDを取得しプラグインオプションのWalkRightRegionに合致したらtrueフラグを返す
        if (Yanfly.Param.WalkRightRegion !== 0 && this.regionId(mx, my) === Yanfly.Param.WalkRightRegion) {
            return true;
        }
        // プレイヤーの現在位置のタイルのタグIDを取得
        var tagId = this.terrainTag(mx, my);
        // 滑る床のタグIDリストslipTiles[x y z]を取得　<Slippery Tile: x, y, z>
        var walkTiles = this.tileset().walking_right;
        // 滑る床のタグIDリストと現在いる位置のタグIDを比較した結果を返す
        return walkTiles.contains(tagId);
    }
    return false;
};

// 強制下進行タイルを判定
Game_Map.prototype.isWalkingDown = function(mx, my) {
    if (this.isValid(mx, my) && this.tileset()) {
        // プレイヤーの現在位置のリージョンIDを取得しプラグインオプションのWolkDownRegionに合致したらtrueフラグを返す
        if (Yanfly.Param.WalkDownRegion !== 0 && this.regionId(mx, my) === Yanfly.Param.WalkDownRegion) {
            return true;
        }
        // プレイヤーの現在位置のタイルのタグIDを取得
        var tagId = this.terrainTag(mx, my);
        // 滑る床のタグIDリストslipTiles[x y z]を取得　<Slippery Tile: x, y, z>
        var walkTiles = this.tileset().walking_down;
        // 滑る床のタグIDリストと現在いる位置のタグIDを比較した結果を返す
        return walkTiles.contains(tagId);
    }
    return false;
};

// 強制左進行タイルを判定
Game_Map.prototype.isWalkingLeft = function(mx, my) {
    if (this.isValid(mx, my) && this.tileset()) {
        // プレイヤーの現在位置のリージョンIDを取得しプラグインオプションのWalkLeftRegionに合致したらtrueフラグを返す
        if (Yanfly.Param.WalkLeftRegion !== 0 && this.regionId(mx, my) === Yanfly.Param.WalkLeftRegion) {
            return true;
        }
        // プレイヤーの現在位置のタイルのタグIDを取得
        var tagId = this.terrainTag(mx, my);
        // 滑る床のタグIDリストslipTiles[x y z]を取得　<Slippery Tile: x, y, z>
        var walkTiles = this.tileset().walking_left;
        // 滑る床のタグIDリストと現在いる位置のタグIDを比較した結果を返す
        return walkTiles.contains(tagId);
    }
    return false;
};

//=============================================================================
// Game_CharacterBase
//=============================================================================

Game_CharacterBase.prototype.onWalkingFloor = function() {
    return $gameMap.isWalkingUp(this._x, this._y) || $gameMap.isWalkingRight(this._x, this._y) ||
       $gameMap.isWalkingDown(this._x, this._y) || $gameMap.isWalkingLeft(this._x, this._y);
};

Game_CharacterBase.prototype.walkingPose = function() {
    if (!this.onWalkingFloor()) return false;
    if (this._stepAnime) return false;
    return true;
};

Yanfly.Walk.Game_CharacterBase_pattern = Game_CharacterBase.prototype.pattern;
Game_CharacterBase.prototype.pattern = function() {
    if (this.walkingPose()) return Yanfly.Param.WalkFrame;
    return Yanfly.Walk.Game_CharacterBase_pattern.call(this);
};

//=============================================================================
// Game_Player
//=============================================================================

Yanfly.Walk.Game_Player_isDashing = Game_Player.prototype.isDashing;
Game_Player.prototype.isDashing = function() {
    if (this.onWalkingFloor()) return true;//※滑る時に強制ダッシュしない場合はここをfalseにしてください。
    return Yanfly.Walk.Game_Player_isDashing.call(this);
};

Yanfly.Walk.Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    Yanfly.Walk.Game_Player_update.call(this, sceneActive);
    this.updateWalking();
};

Game_Player.prototype.updateWalking = function() {
    if ($gameMap.isEventRunning()) return;
    if (this.onWalkingFloor() && !this.isMoving()) {   
        //_destinationXとYをnullにする
        $gameTemp.clearDestination();
        //床の種類に応じて滑る方向指定
        if ($gameMap.isWalkingUp(this._x, this._y)) {
            this.setDirection(8);
        }else if ($gameMap.isWalkingRight(this._x, this._y)) {
            this.setDirection(6);
        }else if ($gameMap.isWalkingDown(this._x, this._y)) {
            this.setDirection(2);
        }else if ($gameMap.isWalkingLeft(this._x, this._y)) {
            this.setDirection(4);
        }
        //プレイヤーが_directionで指定した方向に動く
        this.moveStraight(this._direction);
        //メンバー集合
        $gamePlayer.gatherFollowers();
    }
};

//=============================================================================
// End of File
//=============================================================================
