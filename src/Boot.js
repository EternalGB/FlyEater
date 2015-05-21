var Boot = function(game){};

Boot.prototype = {
  init: function(assetPrefix) {
    console.log("asset prefix:" + assetPrefix);
    this.game.load.baseURL = typeof assetPrefix === undefined ? this.game.load.baseURL : assetPrefix;
  },

  preload: function() {
    this.game.load.image('loading_bar', 'assets/loading_bar.png');
  },

  create: function() {
    this.game.canvas.oncontextmenu = function(e) {e.preventDefault();};
    this.game.state.start('Preloader');
  }

}
