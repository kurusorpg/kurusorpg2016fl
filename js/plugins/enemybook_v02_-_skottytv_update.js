//=============================================================================
// EnemyBook.js
//=============================================================================

/*:
 * @plugindesc v1.00 + SkottyTV Update 02 // Displays detailed statuses of enemys.
 * @author Yoji Ojima (Compatibility with YEP) / + SkottyTV
 *
 * @param Unknown Data
 * @desc The index name for an unknown enemy.
 * @default ??????
 *
 * @param ID before Name
 * @desc Decide if enemys will have the ID number in front of their name
 * @default true
 *
 * @param Gold Icon
 * @desc Decide if you want to use the Gold Icon from                   Yanfly Core Engine. (true or false)
 * @default true
 *
 * @param AutoFill
 * @desc Decide if enemys will automaticly show up in the book when defeated
 * @default false
 *
 * @param Enemys in Row
 * @desc Decide how many enemys you want to show in one row.             (default 1)
 * @default 1
 * 
 * @help
 *
 * ============================================================================
 * SkottyTV Update 01 ->
 *	
 * - Decide if enemys will get an entry automaticly when they appear/transform!
 * - Now you can add an Enemy by a variable value!
 * - Able to add a third info line (desc3)!
 * - Advanced Visual upgrades!
 *
 * SkottyTV Update 02 ->
 * 
 * - Decide how many items appear in one row!
 * - Decide if you want to use the Gold Icon from Yanfly Core Engine!
 *
 * ============================================================================
 *
 * Plugin Command:
 *   EnemyBook open         # Open the enemy book screen
 *   EnemyBook add 3        # Add enemy #3 to the enemy book
 *   EnemyBook addvar 10    # Add enemy (ID) that is in variable 10
 *   EnemyBook remove 4     # Remove enemy #4 from the enemy book
 *   EnemyBook complete     # Complete the enemy book
 *   EnemyBook clear        # Clear the enemy book
 *
 * Enemy Note:
 *   <desc1:The mighty Duck>   # Description text in the enemy book, line 1
 *   <desc2:This is Line 2>    # Description text in the enemy book, line 2
 *   <desc3:Some Info here?>   # Description text in the enemy book, line 2
 *   <book:no>                 # This enemy does not appear in the enemy book
 *
 * ============================================================================
 *
 * Investigate Skill Tutorial:
 * (You will need YanFly´s Battle Engine Core and ActSeqPack1 to get it work)
 *
 * - First set the "AutoFill" option of this plugin to false
 * - Now create a skill which calls a common event X and have the following
 *   in its notebox:
 *   <Target Action>
 *    Change Variable Y = target._enemyId
 *   </Target Action>
 * - Now in the common event X call a Plugin-Line and write:
 *   EnemyBook addvar Y
 * - Done!
 *
 * (X and Y is a number you choose)
 */

/*:ja
 * @plugindesc モンスター図鑑です。敵キャラの詳細なステータスを表示します。
 * @author Yoji Ojima / + SkottyTV
 *
 * @param Unknown Data
 * @desc 未確認の敵キャラの索引名です。
 * @default ？？？？？？
 *
 * @param ID before Name
 * @desc Decide if enemys will have the ID number in front of their name
 * @default true
 *
 * @param Gold Icon
 * @desc Decide if you want to use the Gold Icon from                   Yanfly Core Engine. (true or false)
 * @default true
 * 
 * @param AutoFill
 * @desc Decide if enemys will automaticly show up in the book when defeated
 * @default false
 *
 * @param Enemys in Row
 * @desc Decide how many enemys you want to show in one row.             (default 1)
 * @default 1
 * 
 * @help
 *
 * ============================================================================
 * SkottyTV Update v1.1 ->
 *	
 * - Decide if enemys will get an entry automaticly when they appear/transform!
 * - Now you can add an Enemy by a variable value!
 * - Able to add a third info line (desc3)!
 * - Advanced Visual upgrades!
 *
 * ============================================================================
 *
 * プラグインコマンド:
 *   EnemyBook open         # 図鑑画面を開く
 *   EnemyBook add 3        # 敵キャラ３番を図鑑に追加
 *   EnemyBook addvar 10    # Add enemy that is in variable 10
 *   EnemyBook remove 4     # 敵キャラ４番を図鑑から削除
 *   EnemyBook complete     # 図鑑を完成させる
 *   EnemyBook clear        # 図鑑をクリアする
 *
 * 敵キャラのメモ:
 *   <desc1:なんとか>     	# 説明１行目
 *   <desc2:かんとか>     	# 説明２行目
 *   <desc3:かんとか>    	# 説明3行目
 *   <book:no>              # 図鑑に載せない場合
 *
 * ============================================================================
 *
 * Investigate Skill Tutorial:
 * (You will need YanFly´s Battle Engine Core and ActSeqPack1 to get it work)
 *
 * - First set the "AutoFill" option of this plugin to false
 * - Now create a skill which calls a common event X and have the following
 *   in its notebox:
 *   <Target Action>
 *    Change Variable Y = target._enemyId
 *   </Target Action>
 * - Now in the common event X call a Plugin-Line and write:
 *   EnemyBook addvar Y
 * - Done!
 *
 * (X and Y is a number you choose)
 */

(function() {

    var parameters = PluginManager.parameters('EnemyBook');
    var unknownData = String(parameters['Unknown Data'] || '??????')
    var AutoFill = String(parameters['AutoFill'] || 'false');
    var IDatName = String(parameters['ID before Name'] || 'true');
    var listEnemysRow = Number(parameters['Enemys in Row']);
    var goldIcon = String(parameters['Gold Icon'] || 'true');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'EnemyBook') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_EnemyBook);
                break;
            case 'add':
                $gameSystem.addToEnemyBook(Number(args[1]));
                break;
            case 'addvar':
                $gameSystem.addToEnemyBook(Number($gameVariables.value(args[1])));
                break;
            case 'remove':
                $gameSystem.removeFromEnemyBook(Number(args[1]));
                break;
            case 'complete':
                $gameSystem.completeEnemyBook();
                break;
            case 'clear':
                $gameSystem.clearEnemyBook();
                break;
            }
        }
    };

    Game_System.prototype.addToEnemyBook = function(enemyId) {
        if (!this._enemyBookFlags) {
            this.clearEnemyBook();
        }
        this._enemyBookFlags[enemyId] = true;
    };

    Game_System.prototype.removeFromEnemyBook = function(enemyId) {
        if (this._enemyBookFlags) {
            this._enemyBookFlags[enemyId] = false;
        }
    };

    Game_System.prototype.completeEnemyBook = function() {
        this.clearEnemyBook();
        for (var i = 1; i < $dataEnemies.length; i++) {
            this._enemyBookFlags[i] = true;
        }
    };

    Game_System.prototype.clearEnemyBook = function() {
        this._enemyBookFlags = [];
    };

    Game_System.prototype.isInEnemyBook = function(enemy) {
        if (this._enemyBookFlags && enemy) {
            return !!this._enemyBookFlags[enemy.id];
        } else {
            return false;
        }
    };

    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        this.members().forEach(function(enemy) {
            if (enemy.isAppeared()) {

        if (AutoFill === 'true') {
        	$gameSystem.addToEnemyBook(enemy.enemyId());
				}
            }
        }, this);
    };

    var _Game_Enemy_appear = Game_Enemy.prototype.appear;
    Game_Enemy.prototype.appear = function() {
        _Game_Enemy_appear.call(this);
	if (AutoFill === 'true') {
        	$gameSystem.addToEnemyBook(this._enemyId);
				}
    };

    var _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function(enemyId) {
        _Game_Enemy_transform.call(this, enemyId);
	if (AutoFill === 'true') {
        	$gameSystem.addToEnemyBook(enemyId);
				}
    };

    function Scene_EnemyBook() {
        this.initialize.apply(this, arguments);
    }

    Scene_EnemyBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_EnemyBook.prototype.constructor = Scene_EnemyBook;

    Scene_EnemyBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_EnemyBook.prototype.create = function() {

        var w3 = Graphics.boxWidth / 3;
        var ww = (Graphics.boxWidth / 3)*2 + 2;
        var wh = Graphics.boxHeight;

        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_EnemyBookIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        
        this._statusWindow = new Window_EnemyBookStatus(w3, 0, ww, wh);
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow);
    };

    function Window_EnemyBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_EnemyBookIndex.prototype.constructor = Window_EnemyBookIndex;

    Window_EnemyBookIndex.lastTopRow = 0;
    Window_EnemyBookIndex.lastIndex  = 0;

    Window_EnemyBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth / 3;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(Window_EnemyBookIndex.lastTopRow);
        this.select(Window_EnemyBookIndex.lastIndex);
        this.activate();
    };

    Window_EnemyBookIndex.prototype.maxCols = function() {
        return listEnemysRow;
    };

    Window_EnemyBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };

    Window_EnemyBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var enemy = this._list[this.index()];
            this._statusWindow.setEnemy(enemy);
        }
    };

    Window_EnemyBookIndex.prototype.refresh = function() {
        this._list = [];
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy.name && enemy.meta.book !== 'no') {
                this._list.push(enemy);
            }
        }
        this.createContents();
        this.drawAllItems();
    };

    Window_EnemyBookIndex.prototype.drawItem = function(index) {
        var enemy = this._list[index];
        var rect = this.itemRectForText(index);
        var name;
        if ($gameSystem.isInEnemyBook(enemy)) {
		if (IDatName === 'true') {	
            		name = enemy.id + " - " + enemy.name;
		} else {
	    		name = enemy.name;
		     }
        } else {
            name = unknownData;
        }
        this.drawText(name, rect.x, rect.y, rect.width);
    };

    Window_EnemyBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_EnemyBookIndex.lastTopRow = this.topRow();
        Window_EnemyBookIndex.lastIndex = this.index();
    };

    function Window_EnemyBookStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookStatus.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus.prototype.constructor = Window_EnemyBookStatus;

    Window_EnemyBookStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._enemy = null;
        this._enemySprite = new Sprite();
        this._enemySprite.anchor.x = 0.5;
        this._enemySprite.anchor.y = 0.5;
        this._enemySprite.x = (Graphics.boxWidth)/3;
        this._enemySprite.y = 180;
        this.addChildToBack(this._enemySprite);
        this.refresh();
    };

    Window_EnemyBookStatus.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };

    Window_EnemyBookStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._enemySprite.bitmap) {
            var bitmapHeight = this._enemySprite.bitmap.height;
            var contentsHeight = this.contents.height;
            var scale = 0.8;
            if (bitmapHeight > contentsHeight) {
                scale = contentsHeight / bitmapHeight;
            }
            this._enemySprite.scale.x = scale;
            this._enemySprite.scale.y = scale;
        }
    };

    Window_EnemyBookStatus.prototype.refresh = function() {
        var enemy = this._enemy;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        this.contents.clear();

        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            this._enemySprite.bitmap = null;
            return;
        }

        var name = enemy.battlerName;
        var hue = enemy.battlerHue;
        var bitmap;
        if ($gameSystem.isSideView()) {
            bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            bitmap = ImageManager.loadEnemy(name, hue);
        }
        this._enemySprite.bitmap = bitmap;

        this.resetTextColor();

        x = ((Graphics.boxWidth/3)*2) - 170;
        y = 1;

        for (var i = 0; i < 8; i++) {
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(i), x, y, 160);
            this.resetTextColor();
            this.drawText(enemy.params[i], x - 70, y, 60, 'right');
            y += lineHeight;
        }

        var rewardsWidth = 280;
	x = 1
	y = 1

        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.expA, 1, 1);
        x = this.textWidth(TextManager.expA + '  ');
        this.resetTextColor();
        this.drawText(enemy.exp, x, y);

        this.changeTextColor(this.systemColor());
        
        if (goldIcon === 'true') {	
            this.drawIcon(Yanfly.Icon.Gold, 1, lineHeight)
		} else {
            this.drawText(TextManager.currencyUnit, 1, lineHeight);
        }

        this.resetTextColor();
        this.drawText(enemy.gold, x, lineHeight);

        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.item + ':', 1, lineHeight*3);
        this.resetTextColor();


        x = 1;
        y += lineHeight*4;

        for (var j = 0; j < enemy.dropItems.length; j++) {
            var di = enemy.dropItems[j];
            if (di.kind > 0) {
                var item = Game_Enemy.prototype.itemObject(di.kind, di.dataId);
                this.drawItemName(item, x, y, rewardsWidth);
                y += lineHeight;
            }
        }

        var descWidth = 1;
        x = 1;
        y = lineHeight*9;
        this.drawTextEx(enemy.meta.desc1, x, y + lineHeight * 0, descWidth);
        this.drawTextEx(enemy.meta.desc2, x, y + lineHeight * 1, descWidth);
        this.drawTextEx(enemy.meta.desc3, x, y + lineHeight * 2, descWidth);
    };

})();