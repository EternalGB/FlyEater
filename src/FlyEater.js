var FlyEater = function(game){
  this.player;
  this.lily;
  this.playerSpeed = 100;
  this.playerY;

  this.tongueTo;

  this.tongue;
  this.tongueWidth = 10;
  this.canTongue = true;
  this.tongueSpeed = 0.5;

  this.tongueTween;
  this.ballTween;
  this.tweenDuration;

  this.tongueBall;

  this.killDist = 100;
  this.flySpeed = 100;
  this.flySpawnInterval = 1;
  this.flies;
  this.enemies;

  this.waterEffects;

  this.fishSpeed = 500;
  this.fishSpawnInterval = 5;

  this.score = 0;
  this.scoreText;

};

FlyEater.prototype = {

  init: function() {

    this.score = 0;
  },

  create: function() {
    this.playerY = this.game.height - 100;
    //this.game.stage.backgroundColor = '#99CCFF';
    var bg = this.game.add.tileSprite(0,0,800,600,'bg');
    this.enemies = this.game.add.group();
    var mg = this.game.add.tileSprite(0,0,800,600,'mg');
    var fg = this.game.add.tileSprite(0,0,800,600,'fg');

    this.waterEffects = this.game.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

  	var startX = this.game.width/2;
  	var startY = this.playerY;

  	this.tongue = this.game.add.sprite(startX, startY,'tongue');
  	this.tongue.anchor = new Phaser.Point(0,0.5);
  	//this.tongue.pivot = this.tongue.anchor;
  	this.tongue.scale = new Phaser.Point(0,this.tongueWidth);


    this.lily = this.game.add.sprite(startX,startY,'lily');

  	this.player = this.game.add.sprite(this.game.width/2,this.playerY,'frog');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('sitting', ['frog.png'],1,true);
    this.player.animations.add('tongueHit', ['frog_tongue_hit.png'],1,true);
    this.player.animations.add('leaping',['frog_leaping.png'],1,true);
    this.player.animations.play('sitting');



    this.lily.anchor.setTo(0.5,0);
    this.lily.position = this.player.position;

  	this.tongue.position = this.player.position;

  	this.tongueBall = this.game.add.sprite(startX, startY, 'tongueBall');
  	this.tongueBall.anchor = new Phaser.Point(0.5, 0.5);
    this.tongueBall.visible = false;
  	//this.tongueBall.pivot = this.tongue.pivot;
  	//this.tongueBall.rotation = this.tongue.rotation;
  	//this.tongueBall.position = this.tongue.position + new Phaser.Point(this.tongue.scale.x, this.playerY);

  	this.flies = this.game.add.group();
  	this.flies.enableBody = true;

    this.enemies.enableBody = true;

  	this.scoreText = this.game.add.text(10,10,String(this.score),null);

    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.tongueBall);


  	this.time.events.loop(this.flySpawnInterval*1000, this.spawnFly, this);
    this.time.events.loop(this.fishSpawnInterval*1000, this.spawnFish, this);
  },

  update: function() {
    //this.lily.bringToTop();
    //this.player.bringToTop();
    this.game.physics.arcade.overlap(this.tongueBall, this.flies, this.onTongueFly);
    this.game.physics.arcade.overlap(this.tongueBall, this.enemies, this.onTongueHitEnemy, null, this);
    this.game.physics.arcade.overlap(this.player, this.flies, this.onCollectFly, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.onPlayerHitEnemy, null, this);

  	if(this.game.input.mousePointer.withinGame) {
  		if(this.game.input.mousePointer.isDown) {
  			this.shootTongue(this.game.input.mousePointer.positionDown);
  		}

  		if(!this.canTongue) {
  			this.tongueBall.visible = true;
  			this.tongue.rotation = this.game.math.angleBetweenPoints(this.player.position, this.tongueTo);
  			//this.tongueBall.position.x = this.tongue.right;
  			this.player.body.velocity.x = 0;
  			this.player.body.velocity.y = 0;
  		} else {

  			this.moveTowards(this.player.body,
          this.game.input.mousePointer.x,
  				this.playerY,
  				this.playerSpeed);
  			this.player.scale.x = -this.game.math.sign(this.player.body.velocity.x);
  		}
  	} else {
  		this.player.body.velocity.x = 0;
  		this.player.body.velocity.y = 0;
  	}

  },

  moveTowards: function(body, x, y, speed) {
  	body.velocity.x = this.game.math.clamp(x - body.x, -speed, speed);
  	body.velocity.y = this.game.math.clamp(y - body.y, -speed, speed);
  },

  shootTongue: function (to)
  {
  	if(this.canTongue) {
  		this.tongueTo = new Phaser.Point(to.x, to.y);
  		this.canTongue = false;
  		var duration = this.game.math.distance(this.player.position.x, this.player.position.y, to.x, to.y)/this.tongueSpeed;

  		var stretchTo = this.game.add.tween(this.tongue.scale).to(
  			{x: this.game.math.distance(this.player.position.x, this.player.position.y, this.tongueTo.x, this.tongueTo.y)},
  			duration);
  		var stretchBack = this.game.add.tween(this.tongue.scale).to({x: 0}, duration/2);
  		stretchTo.chain(stretchBack);
  		stretchBack.onComplete.add(this.onTongueComplete, this);
  		stretchTo.start();
      this.tongueTween = stretchTo;

  		this.tongueBall.position.x = this.player.x;
  		this.tongueBall.position.y = this.player.y;
  		var ballTo = this.game.add.tween(this.tongueBall.position).to({x: this.tongueTo.x, y: this.tongueTo.y}, duration);
  		var ballBack = this.game.add.tween(this.tongueBall.position).to({x: this.player.position.x, y: this.player.position.y}, duration/2);
  		ballTo.chain(ballBack);
  		ballTo.start();
      this.ballTween = ballTo;
  	}
  },

  spawnFly: function ()
  {
  	var x = -this.killDist + 10;
  	if(this.rnd.normal() < 0)
  		x += this.game.width + this.killDist;
  	var y = this.game.rnd.realInRange(0,this.playerY-30);
  	var speed = this.flySpeed + this.game.rnd.realInRange(-0.5,0.5)*this.flySpeed;
  	this.flies.add(new Fly(this.game, x, y, -this.flySpeed*this.game.math.sign(x), this.killDist));
  },

  spawnFish: function()
  {
    var x = this.game.rnd.realInRange(0, this.game.width);
    var y = this.playerY+25;
    var speed = this.fishSpeed + this.fishSpeed*this.game.rnd.realInRange(-0.25,0.15);
    var ripple = this.game.add.sprite(x,y,'ripple');
    ripple.anchor.setTo(0.5);
    ripple.animations.add('doRipple',[0,1,2],3,true);
    ripple.animations.play('doRipple');
    this.waterEffects.add(ripple);
    this.game.time.events.add(3*1000,function(ripple,x,y,speed) {
      this.enemies.add(new Fish(this.game, x, y, speed));
      ripple.destroy();
    }, this,ripple, x, y+20, speed);

  },

  onPlayerHitEnemy: function(player, enemy)
  {
    this.game.state.start('End', true, false, this.score);
  },

  onTongueComplete: function ()
  {
  	this.canTongue = true;
    this.tongueBall.visible = false;
  },

  onTongueFly: function (tongue, fly)
  {
  	fly.attach(tongue);
  },

  onTongueHitEnemy: function(tongue, enemy)
  {
    //this.tongueTo = new Phaser.Point(enemy.x, enemy.y);
    this.tongueTween.stop(true);
    this.ballTween.stop(true);
  },

  onCollectFly: function (player, fly)
  {
  	fly.destroy();
  	this.score += 1;
  	this.scoreText.setText(String(this.score));
  }


};
