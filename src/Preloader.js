var Preloader = function(game){};

Preloader.prototype = {

  preload: function() {
    this.game.stage.backgroundColor = '#99CCFF';
    //this.game.load.image('preloadBar', 'assets/loading_bar.png');
    var loadingBar = this.game.add.sprite(this.game.width/2, this.game.height/2, 'loading_bar');
    loadingBar.anchor.setTo(0.5);
    this.game.load.setPreloadSprite(loadingBar);

    this.game.load.atlasJSONArray('frog', 'assets/frog_sheet.png', 'assets/frog_sheet.json');
    this.game.load.image('tongue', 'assets/tongue.png');
    this.game.load.image('tongueBall', 'assets/tongue_ball.png');
    this.game.load.atlasJSONArray('fly', 'assets/fly_sheet.png', 'assets/fly_sheet.json');
    this.game.load.atlasJSONArray('fish', 'assets/fish.png', 'assets/fish.json');
    this.game.load.atlasJSONArray('ripple', 'assets/ripple.png', 'assets/ripple.json');
    this.game.load.atlasXML('enemies', 'assets/enemies.png', 'assets/enemies.xml');
    this.game.load.image('lily', 'assets/lily.png');
    this.game.load.image('trees', 'assets/trees.png');
    this.game.load.image('bg', 'assets/bg.png');
    this.game.load.image('fg', 'assets/fg.png');
    this.game.load.image('mg', 'assets/mg.png');
    this.game.load.image('retryButton','assets/button_retry.png');
  },

  create: function() {
    this.game.state.start('Game');
  }
}
