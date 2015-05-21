var ScrollingSprite = function(game, x, y, keyImage, speed, killDist)
{
  this.killDist = killDist;
  Phaser.Sprite.call(this,game,x,y,keyImage);
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.arcade.enable(this);
  this.body.velocity.x = speed;
  this.scale.x = -game.math.sign(speed);

  this.attached = false;

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
    this.scale.y = -1;


  }

}

ScrollingSprite.prototype = Object.create(Phaser.Sprite.prototype);

ScrollingSprite.prototype.update = function()
{

  if((this.x < -this.killDist || this.x > this.game.width+this.killDist) &&
      this.alive)
    this.destroy();
}
