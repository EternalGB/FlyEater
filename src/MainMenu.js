var MainMenu = function(game){};

MainMenu.prototype = {
  preload: function() {
    this.game.stage.backgroundColor = '#99CCFF';
    var title = this.add.text(this.game.width/2, this.game.height/2-100,"Frog");
    title.anchor.setTo(0.5);
    var playButton = new TextButton(this.game, "Play", this.game.width/2,
    this.game.height/2+100, 'button', this.startGame, this);
  },

  create: function() {

  },

  startGame: function() {
    this.game.state.start('Game');
  }
}
