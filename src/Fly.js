Fly = function(game, x, y, moveSpeed, killDist)
{
  Phaser.Sprite.call(this, game, x, y, 'fly');
  this.anchor = new Phaser.Point(0.5,0.5);

  //this.checkWorldBounds = true;
  //this.outOfBoundsKill = true;
  game.add.existing(this);

  //this.moveSpeed = moveSpeed;
  this.animations.add('flying',['fly.png','fly_fly.png'],48,true);
  this.animations.add('dead',['fly_dead'],1,true);
  this.animations.play('flying');
  game.physics.arcade.enable(this);
  this.body.velocity.x = moveSpeed;
  this.scale.x = -game.math.sign(moveSpeed);
  this.attached = false;
  this.killDist = killDist;

  this.attach = function(obj) {
    this.attached = true;
    this.body.velocity.x = 0;
    this.position = obj.position;
  }

  this.drop = function() {
    if(this.attached == true) {
      this.attached = false;
      this.body.gravity.setTo(0,300);
      this.animations.play('dead');
      this.scale.y = -1;
      this.position = new Phaser.Point(this.x,this.y);
    }
  }

}

Fly.prototype = Object.create(Phaser.Sprite.prototype);

Fly.prototype.update = function()
{

  if((this.x < -this.killDist || this.x > this.game.width+this.killDist) &&
      this.alive)
    this.destroy();
}
