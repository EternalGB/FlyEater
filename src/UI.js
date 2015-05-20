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

var ColouredTextButton = function(game, label, colour, x, y, imageKey, callback,
  callbackContext, overFrame, outFrame, downFrame, upFrame)
{
    TextButton.call(this, game, label, x, y, imageKey, callback,
    callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.tint = colour;
}

ColouredTextButton.prototype = Object.create(TextButton.prototype);

var StandardButton = function(game, label, colour, x, y, callback, callbackContext)
{
  ColouredTextButton.call(this, game, label, colour, x, y, 'button', callback,
  callbackContext, 0, 1, 2, 1);

}

StandardButton.prototype = Object.create(ColouredTextButton.prototype);
