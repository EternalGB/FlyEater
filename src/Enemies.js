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
  this.animations.add('fly',['ladyBug_fly.png'],1,true);
  this.animations.play('fly');
  game.add.tween(this.position).to({y: startY+amplitude}, 1000,
    Phaser.Easing.Linear.None, true, 0, -1, true);
}

Ladybug.prototype = Object.create(ScrollingSprite.prototype);
Ladybug.prototype.constructor = Ladybug;
