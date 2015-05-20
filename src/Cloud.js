var Cloud = function(game, x, y, speed, killDist)
{
  this.killDist = killDist;
  Phaser.Sprite.call(this, game, x, y, 'clouds', game.rnd.integerInRange(0,8));
  this.anchor.setTo(0.5);
  this.scale.setTo(game.rnd.realInRange(0.25,0.5));
  this.scale.x = game.math.sign(game.rnd.normal())*this.scale.x;
  game.add.existing(this);

  game.physics.arcade.enable(this);
  this.body.velocity.x = speed;
}

Cloud.prototype = Object.create(Phaser.Sprite.prototype);

Cloud.prototype.update = function()
{

  if((this.x < -this.killDist || this.x > this.game.width+this.killDist) &&
      this.alive)
    this.destroy();
}
