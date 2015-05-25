var ScrollingSprite = function(game, x, y, keyImage, speed, killDist)
{
  this.killDist = killDist;
  Phaser.Sprite.call(this,game,x,y,keyImage);
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.setSpeed(speed);

  this.attached = false;
  this.dropped = false;

  this.events.onKilled.add(this.onKill, this);

  this.attach = function(obj) {
    this.attached = true;
    this.body.velocity.x = 0;
    this.position = obj.position;
  }

  this.detach = function()
  {
    this.position = new Phaser.Point(this.x,this.y);
    this.attached = false;
  }

  this.drop = function() {
    if(this.attached) {
      this.detach();
    }
    this.body.velocity.setTo(0);
    this.body.gravity.setTo(0,300);
    this.animations.play('dead');
    this.scale.y = -this.scale.y;
    this.dropped = true;
  }

}

ScrollingSprite.prototype = Object.create(Phaser.Sprite.prototype);

ScrollingSprite.prototype.update = function()
{

  if((this.x < -this.killDist || this.x > this.game.width+this.killDist
    || this.y > this.game.height || this.y < 0)
  && this.alive) {
    //console.log("Killing at " + this.x + " " + this.x);
    this.kill();
  }
}

ScrollingSprite.prototype.onKill = function()
{
  this.body.gravity.setTo(0);
  this.body.velocity.setTo(0);
  this.scale.x = Math.abs(this.scale.x);
  this.scale.y = Math.abs(this.scale.y);
  this.dropped = false;
  this.animations.play('moving');
}

ScrollingSprite.prototype.setSpeed = function(speed)
{
  //console.log("setting speed to " + speed);
  this.body.velocity.x = speed;
  this.scale.x = -this.game.math.sign(speed)*Math.abs(this.scale.x);
}
