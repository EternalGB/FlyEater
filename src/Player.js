var TongueStates = {
  IDLE : 1,
  SHOOTING: 2,
  RETURNING: 3
}

var Player = function(game, startX, startY)
{

  this.speed = 100;
  this.playerY = startY;

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

  this.lily = this.game.add.sprite(startX,startY,'lily');

  Sprite.call(this,game.width/2,this.playerY,'frog');
  this.anchor.setTo(0.5);
  this.animations.add('sitting', ['frog.png'],1,true);
  this.animations.add('tongueHit', ['frog_tongue_hit.png'],1,true);
  this.animations.add('leaping',['frog_leaping.png'],1,true);
  this.animations.play('sitting');

  this.lily.anchor.setTo(0.5,0);
  this.lily.position = this.position;

  this.tongue.position = this.position;

  this.tongueBall = game.add.sprite(startX, startY, 'tongueBall');
  this.tongueBall.anchor.setTo(0.5);
  this.tongueBall.visible = false;

  game.physics.arcade.enable(this);
  game.physics.arcade.enable(this.tongueBall);


}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
  if(this.tongueCanGrab) {
    this.game.physics.overlap(this.game.physics.arcade.overlap(this.tongueBall, this.flies, this.onTongueFly);
  }

  this.game.physics.arcade.overlap(this.tongueBall, this.enemies, this.onTongueHitEnemy, null, this);

  if(this.game.input.mousePointer.withinGame) {
    if(this.game.input.mousePointer.isDown) {
      this.shootTongue(this.game.input.mousePointer.positionDown);
    }

    if(this.tongueState == TongueStates.SHOOTING || this.tongueState == TongueStates.RETURNING) {
      this.tongue.rotation = this.game.math.angleBetweenPoints(this.player.position, this.tongueTo);
    } else if(this.tongueState == TongueStates.IDLE) {
      this.moveTowards(
        this.game.input.mousePointer.x,
        this.playerY,
        this.playerSpeed);
      this.player.scale.x = -this.game.math.sign(this.player.body.velocity.x);
    }
  } else {
    this.stopMoving();
  }
}

Player.prototype.moveTowards = function(x,y,speed)
{
	this.body.velocity.x = this.game.math.clamp(x - body.x, -speed, speed);
	this.body.velocity.y = this.game.math.clamp(y - body.y, -speed, speed);
}

Player.prototype.shootTongue = function (to)
{
  if(this.tongueState == TongueStates.IDLE) {
    this.tongueBall.visible = true;
    this.stopMoving();
    tongueState = TongueStates.SHOOTING;
    this.tongueCanGrab = true;
    this.tongueTo = new Phaser.Point(to.x, to.y);
    this.canTongue = false;
    var dist = this.game.math.distance(this.position.x, this.position.y, to.x, to.y);
    var duration = dist/this.tongueSpeed;

    var stretchTo = this.game.add.tween(this.tongue.scale).to({x: dist}, duration);
    //var stretchBack = this.game.add.tween(this.tongue.scale).to({x: 0}, duration/2);
    //stretchTo.chain(stretchBack);
    //stretchBack.onComplete.add(this.onTongueComplete, this);
    stretchTo.onComplete.add(this.onTongueReturning, this);
    stretchTo.start();
    this.tongueTween = stretchTo;

    this.tongueBall.position.x = this.player.x;
    this.tongueBall.position.y = this.player.y;
    var ballTo = this.game.add.tween(this.tongueBall.position).to({x: this.tongueTo.x, y: this.tongueTo.y}, duration);
    //var ballBack = this.game.add.tween(this.tongueBall.position).to({x: this.player.position.x, y: this.player.position.y}, duration/2);
    //ballTo.chain(ballBack);
    ballTo.start();
    this.ballTween = ballTo;


  }
}

Player.prototype.disableTongue = function()
{
  this.tongueCanGrab = false;
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
}

Player.prototype.onTongueComplete = function()
{
  this.tongueState = TongueStates.IDLE;
  this.canTongue = true;
  this.tongueBall.visible = false;
}

Player.prototype.onTongueFly = function (tongue, fly)
{
  fly.attach(tongue);
}

Player.prototype.stopMoving = function()
{
  this.body.velocity.setTo(0);
}
