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
  this.killDist = killDist;

  Phaser.Sprite.call(this, game, x, y, 'enemies');
  this.anchor.setTo(0.5);
  this.animations.add('fly',['ladyBug_fly.png'],1,true);
  this.animations.play('fly');

  game.add.existing(this);
  game.physics.arcade.enable(this);

  this.body.velocity.x = speed;
  this.scale.x = -game.math.sign(speed);
  game.time.events.loop(500, function() {
    this.body.velocity.y = Math.sin(this.game.time.now)*200;
  }, this);
}

Ladybug.prototype = Object.create(Phaser.Sprite.prototype);
Ladybug.prototype.constructor = Ladybug;

Ladybug.prototype.update = function()
{
  if((this.x < -this.killDist || this.x > this.game.width+this.killDist)
    && this.alive)
    this.destroy();
}
