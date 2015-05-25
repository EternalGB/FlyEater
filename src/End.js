var End = function(game){
  this.score;
};

End.prototype = {
  init: function(finalScore)
  {
    this.score = finalScore;
  },

  create: function()
  {
    this.add.text(this.game.width/2, this.game.height/2-100,"Game Over")
    .anchor.setTo(0.5);
    this.add.text(this.game.width/2, this.game.height/2-50,
    "You scored").anchor.setTo(0.5);
    this.add.text(this.game.width/2, this.game.height/2, String(this.score))
    .anchor.setTo(0.5);
    this.add.text(this.game.width/2, this.game.height/2+50,
    "points").anchor.setTo(0.5);
    var retryButton = new StandardButton(this.game, "Retry", 0x33CCFF,
    this.game.width/2, this.game.height/2+100, this.onRetry, this);
  },

  onRetry: function()
  {
    this.game.state.start('Game');
  }
}
