var MainMenu = function(game){};

MainMenu.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#99CCFF';
    var title = this.add.text(this.game.width/2, this.game.height/2-100,"Frog");
    title.anchor.setTo(0.5);
    var playButton = new StandardButton(this.game, "Play", 0x33CCFF,
    this.game.width/2, this.game.height/2+100, this.startGame, this);
  },

  create: function() {

  },

  startGame: function() {
    this.game.state.start('Game');
  }
}
