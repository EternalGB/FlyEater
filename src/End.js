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
    var gameOver = this.add.text(this.game.width/2, this.game.height/2-100,"Game Over");
    gameOver.anchor.setTo(0.5);
    var scoreDisplay = this.add.text(this.game.width/2, this.game.height/2, String(this.score));
    scoreDisplay.anchor.setTo(0.5);
    var retryButton = this.add.button(this.game.width/2,this.game.height/2 + 100,'retryButton',this.onRetry)
    retryButton.anchor.setTo(0.5);
  },

  onRetry: function()
  {
    this.game.state.start('Game');
  }
}
