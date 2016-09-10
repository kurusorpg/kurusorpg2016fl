var ncmbController = {
    APPLICATION_KEY: "kurusorpg",
    CLIENT_KEY: "kurusopc",

    ncmb: null,

    // ‰Šú‰»
    init: function(screenSize) {
        var self = this;
        // mobile backend‚Ì‰Šú‰»
        self.ncmb = new NCMB(self.APPLICATION_KEY, self.CLIENT_KEY);
    },
}