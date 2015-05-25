Fish = function(game, x, y, jumpSpeed) {
  Phaser.Sprite.call(this, game,x ,y,'fish');

  this.anchor.setTo(0.5);
  this.animations.add('jumping',['piranha.png'],1,true);
  this.animations.add('falling',['piranha_down.png'],1,true);
  this.animations.play('jumping');

  game.add.existing(this);

  game.physics.arcade.enable(this);
  this.body.gravity.setTo(0,300);
  this.body.velocity.y = -jumpSpeed;
}

Fish.prototype = Object.create(Phaser.Sprite.prototype);
Fish.prototype.constructor = Fish;

Fish.prototype.update = function() {
  if(this.body.velocity.y <= 0) {
    this.animations.play('jumping');
  } else {
    this.animations.play('falling');
  }

  if(this.y >= this.game.height)
    this.destroy();
}

Ladybug = function(game, x, y, speed, killDist)
{
  var amplitude = speed/2;
  var startY = y - amplitude/2;
  ScrollingSprite.call(this, game, x, startY, 'enemies', speed, killDist);
  this.scale.setTo(0.75*this.scale.x,0.75);
  this.anchor.setTo(0.5);
  this.animations.add('moving',['ladyBug_fly.png'],1,true);
  this.animations.play('moving');
  game.add.tween(this.position).to({y: startY+amplitude}, 1000,
    Phaser.Easing.Linear.None, true, 0, -1, true);
}

Ladybug.prototype = Object.create(ScrollingSprite.prototype);
Ladybug.prototype.constructor = Ladybug;

Bird = function(game, x, y, target, speed)
{
  Phaser.Sprite.call(this, game, x, y, 'enemies');
  this.animations.add('swoop', ['bat.png'], 1, true);
  this.animations.play('swoop');
  this.anchor.setTo(0.5);
  game.add.existing(this);
  game.physics.arcade.enable(this);
  //move in a parabolic trajectory towards the target
  var xDiff = target.x - x;
  this.scale.x *= -game.math.sign(xDiff);
  var yDiff = game.math.difference(target.y, y);
  var duration = 1000*2*Math.abs(xDiff)/speed;
  var targetX = target.x;
  var targetY = target.y;
  var startY = y;
  var xTween = game.add.tween(this).to({x: x + 2*xDiff}, duration);
  var yTo = game.add.tween(this).to({y: targetY}, duration/2,
    Phaser.Easing.Quintic.Out);
  var yFrom = game.add.tween(this).to({y: -1}, duration/2,Phaser.Easing.Quintic.In);
  yTo.chain(yFrom);
  xTween.start();
  yTo.start();

  //kill after tween
  yFrom.onComplete.add(function() {
    this.destroy();
  }, this);
}

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;
