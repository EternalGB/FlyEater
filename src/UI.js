var TextButton = function(game, label, x, y, imageKey, callback, callbackContext,
  overFrame, outFrame, downFrame, upFrame)
{
  Phaser.Button.call(this, game, x, y, imageKey, callback, callbackContext,
  overFrame, outFrame, downFrame, upFrame);
  this.anchor.setTo(0.5);
  game.add.existing(this);
  this.text = game.add.text(x,y, label);
  this.text.anchor.setTo(0.5);
}

TextButton.prototype = Object.create(Phaser.Button.prototype);
