var ncmbController = {
    APPLICATION_KEY: "kurusorpg",
    CLIENT_KEY: "kurusopc",

    ncmb: null,

    // 初期化
    init: function(screenSize) {
        var self = this;
        // mobile backendの初期化
        self.ncmb = new NCMB(self.APPLICATION_KEY, self.CLIENT_KEY);
    },
}