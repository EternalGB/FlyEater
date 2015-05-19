var TongueStates = {
  IDLE : 1,
  SHOOTING: 2,
  RETURNING: 3
}

var Player = function(game, startX, startY)
{
  this.speed = 100;
  this.playerY = startY;
  this.diabledTint = 0x006666;
  this.enabledTint = 0xFFFFFF;

  Phaser.Sprite.call(this,game,game.width/2,this.playerY,'frog');
  this.anchor.setTo(0.5);
  this.animations.add('sitting', ['frog.png'],1,true);
  this.animations.add('tongueHit', ['frog_tongue_hit.png'],1,true);
  this.animations.add('leaping',['frog_leaping.png'],1,true);
  this.animations.play('sitting');


  this.tongueTo;
  this.tongueState = TongueStates.IDLE;
  this.tongueCanGrab = true;
  this.tongueTween;
  this.ballTween;
  this.tongueDuration;

  this.tongueWidth = 10;
  this.canTongue = true;
  this.tongueSpeed = 0.5;


  this.tongue = game.add.sprite(startX, startY,'tongue');
  this.tongue.anchor.setTo(0,0.5);
  //this.tongue.pivot = this.tongue.anchor;
  this.tongue.scale.setTo(0,this.tongueWidth);

  this.lily = game.add.sprite(startX,startY,'lily');




  this.lily.anchor.setTo(0.5,0);
  this.lily.position = this.position;

  this.tongue.position = this.position;

  this.tongueBall = game.add.sprite(startX, startY, 'tongueBall');
  this.tongueBall.anchor.setTo(0.5);
  this.tongueBall.visible = false;

  game.add.existing(this);

  game.physics.arcade.enable(this);
  game.physics.arcade.enable(this.tongueBall);


}

Player.prototype = Object.create(Phaser.Sprite.prototype);
//Player.prototype.constructor = Player;

Player.prototype.update = function()
{


  if(this.game.input.mousePointer.withinGame) {
    if(this.game.input.mousePointer.isDown) {
      this.shootTongue(this.game.input.mousePointer.positionDown);
    }

    if(this.tongueState === TongueStates.SHOOTING || this.tongueState === TongueStates.RETURNING) {
      this.tongue.rotation = this.game.math.angleBetweenPoints(this.position, this.tongueTo);
    } else if(this.tongueState === TongueStates.IDLE) {
      this.moveTowards(
        this.game.input.mousePointer.x,
        this.playerY,
        this.speed);
      this.scale.x = -this.game.math.sign(this.body.velocity.x);
    }
  } else {
    this.stopMoving();
  }
}

Player.prototype.moveTowards = function(x,y,speed)
{
	this.body.velocity.x = this.game.math.clamp(x - this.body.x, -speed, speed);
	this.body.velocity.y = this.game.math.clamp(y - this.body.y, -speed, speed);
}

Player.prototype.shootTongue = function (to)
{
  if(this.tongueState == TongueStates.IDLE) {
    this.tongueBall.visible = true;
    this.stopMoving();
    this.tongueState = TongueStates.SHOOTING;
    this.tongueCanGrab = true;
    this.tongueTo = new Phaser.Point(to.x, to.y);
    this.canTongue = false;
    var dist = this.game.math.distance(this.x, this.y, to.x, to.y);
    var duration = dist/this.tongueSpeed;

    var stretchTo = this.game.add.tween(this.tongue.scale).to({x: dist}, duration);
    stretchTo.onComplete.add(this.onTongueReturning, this);
    stretchTo.start();
    this.tongueTween = stretchTo;

    this.tongueBall.position.x = this.x;
    this.tongueBall.position.y = this.y;
    var ballTo = this.game.add.tween(this.tongueBall.position).to({x: to.x, y: to.y}, duration);
    ballTo.start();
    this.ballTween = ballTo;


  }
}

Player.prototype.disableTongue = function()
{
  this.tongueCanGrab = false;
  this.animations.play('tongueHit');
  this.tongue.tint = this.disabledTint;
  this.tongueBall.tint = this.disabledTint;
}

Player.prototype.returnTongue = function()
{
  this.tongueTween.stop(true);
  this.ballTween.stop(true);

}

Player.prototype.onTongueReturning = function()
{
  this.tongueState = TongueStates.RETURNING;
  var duration = this.game.math.distance(this.tongueBall.x, this.tongueBall.y, this.x, this.y)/(2*this.tongueSpeed);

  var stretchBack = this.game.add.tween(this.tongue.scale).to({x: 0}, duration);
  stretchBack.onComplete.add(this.onTongueComplete, this);

  var ballBack = this.game.add.tween(this.tongueBall.position).to({x: this.x, y: this.y}, duration);
  stretchBack.start();
  ballBack.start();
}

Player.prototype.onTongueComplete = function()
{
  this.tongueState = TongueStates.IDLE;
  this.canTongue = true;
  this.tongueBall.visible = false;
  this.animations.play('sitting');
  this.tongue.tint = this.enabledTint;
  this.tongueBall.tint = this.enabledTint;
}

Player.prototype.onTongueFly = function (tongue, fly)
{
  fly.attach(tongue);
}

Player.prototype.onTongueHitEnemy = function(tongue, enemy)
{
  //this.tongueTo = new Phaser.Point(enemy.x, enemy.y);
  this.disableTongue();
  this.returnTongue();

}

Player.prototype.stopMoving = function()
{
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
}
