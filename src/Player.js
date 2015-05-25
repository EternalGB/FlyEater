var TongueStates = {
  IDLE : 1,
  SHOOTING: 2,
  RETURNING: 3
}

var Player = function(game, startX, startY, tongueLayer)
{
  this.speed = 100;
  this.playerY = startY;
  this.maxLeapHeight = 100;
  this.maxLeapTime = 2;
  this.leapGravity = 300;
  this.isLeaping = false;


  Phaser.Sprite.call(this,game,game.width/2,this.playerY,'frog');
  this.anchor.setTo(0.5);
  this.animations.add('sitting', ['frog.png'],1,true);
  this.animations.add('tongueHit', ['frog_tongue_hit.png'],1,true);
  this.animations.add('leaping',['frog_leap.png'],1,true);
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
  this.tongue.scale.setTo(0,this.tongueWidth);
  this.tongue.position = this.position;

  this.lily = game.add.sprite(startX,startY,'lily');
  this.lily.anchor.setTo(0.5,0);
  //this.lily.position = this.position;



  this.tongueBall = game.add.sprite(startX, startY, 'tongueBall');
  this.tongueBall.anchor.setTo(0.5);
  this.tongueBall.visible = false;
  this.tongueBall.origScale = new Phaser.Point(1,1);

  game.add.existing(this);
  tongueLayer.add(this.tongueBall);
  tongueLayer.add(this.tongue);

  game.physics.arcade.enable(this);
  game.physics.arcade.enable(this.tongueBall);


}

Player.prototype = Object.create(Phaser.Sprite.prototype);
//Player.prototype.constructor = Player;

Player.prototype.update = function()
{
  //console.log(this.body.velocity);


  if(!this.isLeaping) {
    if(this.game.input.mouse.button == Phaser.Mouse.LEFT_BUTTON) {
      this.shootTongue(this.game.input.mousePointer.positionDown);
    } else if(this.game.input.mouse.button == Phaser.Mouse.RIGHT_BUTTON
      && this.tongueState == TongueStates.IDLE
      && this.game.input.mousePointer.positionDown.y < this.playerY) {
      this.leap(this.game.input.mousePointer.positionDown);
    }
    this.lily.position.setTo(this.x,this.y);
  } else {
    this.lily.position.setTo(this.x, this.playerY);
  }


  if(this.tongueState === TongueStates.SHOOTING || this.tongueState === TongueStates.RETURNING) {
    this.tongue.rotation = this.game.math.angleBetweenPoints(this.position, this.tongueTo);
  } else if(this.tongueState === TongueStates.IDLE) {
    if(!this.isLeaping) {
      this.moveTowardsY(this.playerY, this.speed);
    }
    this.moveTowardsX(this.game.input.mousePointer.x, this.speed);
    this.scale.x = -this.game.math.sign(this.body.velocity.x);
  }

  if(this.isLeaping && this.y > this.playerY) {
    this.body.gravity.setTo(0,0);
    this.body.velocity.y = 0;
    this.y = this.playerY;
    this.isLeaping = false;
    this.animations.play('sitting');
  }

}

Player.prototype.moveTowardsX = function(x,speed)
{
	this.body.velocity.x = this.game.math.clamp(x - this.x, -speed, speed);
}

Player.prototype.moveTowardsY = function(y, speed)
{
  this.body.velocity.y = this.game.math.clamp(y - this.y, -speed, speed);
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

Player.prototype.growTongue = function(scaleFactor, duration)
{
  this.tongueBall.scale.x += this.tongueBall.origScale.x*scaleFactor;
  this.tongueBall.scale.y += this.tongueBall.origScale.y*scaleFactor;
  var _scaleFactor = scaleFactor;
  this.game.time.events.add(duration*1000, function() {
    this.tongueBall.scale.x -= this.tongueBall.origScale.x*_scaleFactor;
    this.tongueBall.scale.y -= this.tongueBall.origScale.y*_scaleFactor;
  }, this);
}

Player.prototype.disableTongue = function()
{
  this.tongueCanGrab = false;
  this.animations.play('tongueHit');
  this.tongue.alpha = 0.5;
  this.tongueBall.alpha = 0.5;
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
  this.tongue.alpha = 1;
  this.tongueBall.alpha = 1;
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

Player.prototype.onTongueBee = function(tongue, bee)
{
  bee.attach(tongue);
  this.growTongue(1,3);
}

Player.prototype.leap = function(to)
{
  this.isLeaping = true;
  var h = this.game.math.clamp(this.game.math.difference(to.y, this.playerY),0,this.maxLeapHeight);
  var t = this.game.math.clamp(h/this.maxLeapHeight,0,1)*this.maxLeapTime;
  //this.y += 10;
  var v = -(h + 0.5*Math.pow(t,2)*this.leapGravity)/t;
  console.log(h, t, v);
  this.body.velocity.y = v;
  this.body.gravity.setTo(0,this.leapGravity);
  this.animations.play('leaping');
}

Player.prototype.stopMoving = function()
{
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
}

Player.prototype.die = function(gameEndCallback, context)
{
  return function() {
    new PlayerDead(this.game, this.x, this.y, this.isLeaping, gameEndCallback, context);
    this.visible = false;
    this.body.enable = false;
  };
}

var PlayerDead = function(game, x, y, wasLeaping, gameEndCallback, context)
{
  Phaser.Sprite.call(this,game,x,y,'frog');
  game.add.existing(this);
  this.anchor.setTo(0.5);
  this.animations.add('leapDead',['frog_dead.png'],1,true);
  this.animations.add('sitDead',['frog_tongue_hit.png'],1,true);
  if(wasLeaping) {
    this.animations.play('leapDead');
  } else {
    this.animations.play('sitDead');
  }
  game.physics.arcade.enable(this);
  this.body.gravity.setTo(0,300);
  this.body.velocity.y = -200;
  this.scale.y = -this.scale.y;

  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(function() {
    gameEndCallback.apply(context);
  }, this);
}

PlayerDead.prototype = Object.create(Phaser.Sprite.prototype);
PlayerDead.prototype.constructor = PlayerDead;
