var Game = function(game){
  this.player;

  this.clouds;
  this.cloudSpeed = 20;
  this.cloudSpawnInterval = 10;

  this.killDist = 100;
  this.flySpeed = 100;
  this.flySpawnInterval = 1;
  this.flies;
  this.enemies;

  this.bees;
  this.beeSpeed = 200;
  this.beeSpawnInterval = 3;

  this.waterEffects;

  this.fishSpeed = 500;
  this.fishSpawnInterval = 5;

  this.ladybugSpeed = 250;
  this.ladybugSpawnInterval = 2.5;

  this.score = 0;
  this.scoreText;

};

Game.prototype = {

  init: function() {

    this.score = 0;
  },

  create: function() {
    this.playerY = this.game.height - 100;
    this.game.stage.backgroundColor = '#99CCFF';
    var trees = this.game.add.tileSprite(0,0,800,800,'trees');
    this.clouds = this.game.add.group();
    var bg = this.game.add.tileSprite(0,0,800,600,'bg');
    this.enemies = this.game.add.group();
    this.flies = this.game.add.group();
    this.bees = this.game.add.group();
    var mg = this.game.add.tileSprite(0,0,800,600,'mg');
    this.waterEffects = this.game.add.group();
    var fg = this.game.add.tileSprite(0,0,800,600,'fg');



    this.game.physics.startSystem(Phaser.Physics.ARCADE);

  	var startX = this.game.width/2;
  	var startY = this.playerY;

    this.player = new Player(this.game, startX, startY);


  	this.flies.enableBody = true;
    this.enemies.enableBody = true;

  	this.scoreText = this.game.add.text(10,10,String(this.score),null);


    this.time.events.loop(this.cloudSpawnInterval*1000, this.spawnCloud, this);
  	this.time.events.loop(this.flySpawnInterval*1000, this.spawnFly, this);
    this.time.events.loop(this.fishSpawnInterval*1000, this.spawnFish, this);
    this.time.events.loop(this.ladybugSpawnInterval*1000, this.spawnLadybug, this);

  },

  update: function() {
    if(this.player.tongueCanGrab) {
      this.game.physics.arcade.overlap(this.player.tongueBall, this.flies,
        this.player.onTongueFly, this.checkAlive, this.player);
    }
    if(this.player.tongueState != TongueStates.IDLE) {
      this.game.physics.arcade.overlap(this.player.tongueBall, this.enemies,
        this.onTongueHitEnemy, null, this);
    }
    this.game.physics.arcade.overlap(this.player, this.flies,
      this.onCollectFly, this.checkAlive, this);
    this.game.physics.arcade.overlap(this.player, this.enemies,
      this.player.die(this.onGameEnd,this), null, this.player);

  },

  moveTowards: function(body, x, y, speed) {
  	body.velocity.x = this.game.math.clamp(x - body.x, -speed, speed);
  	body.velocity.y = this.game.math.clamp(y - body.y, -speed, speed);
  },

  spawnScrollingSprite: function(objType, group, yMin, yMax, speed, killDist)
  {

    var x = -killDist + 10;
    if(this.game.rnd.normal() < 0) {
      x += this.game.width + killDist;
    }
    var y = this.game.rnd.realInRange(yMin,yMax);
    var rndSpeed = speed + this.game.rnd.realInRange(-0.5,0.5)*speed;
    var scrollingObj = group.getFirstDead();
    if(scrollingObj) {
      scrollingObj.reset(x,y);
      scrollingObj.setSpeed(-rndSpeed*this.game.math.sign(x));
    } else {
      scrollingObj = new objType(this.game, x, y,
        -rndSpeed*this.game.math.sign(x), killDist);
      group.add(scrollingObj);
    }
  },

  spawnCloud: function ()
  {
    this.spawnScrollingSprite(Cloud, this.clouds, 0, 200, this.cloudSpeed, 200);
  },

  spawnFly: function ()
  {
    this.spawnScrollingSprite(Fly, this.flies, 0, this.playerY-30,
       this.flySpeed, this.killDist);
  },

  spawnLadybug: function()
  {
    this.spawnScrollingSprite(Ladybug, this.enemies, 0, this.playerY-100,
      this.ladybugSpeed, this.killDist);
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
    var fishGhost = this.game.add.sprite(x,y+50, 'fish');
    fishGhost.anchor.setTo(0.5);
    fishGhost.alpha = 0.5;
    this.waterEffects.add(ripple);
    this.waterEffects.add(fishGhost);
    this.game.time.events.add(3*1000,function(ripple,x,y,speed) {
      this.enemies.add(new Fish(this.game, x, y, speed));
      ripple.destroy();
      fishGhost.destroy();
    }, this,ripple, x, y+20, speed);

  },

  onGameEnd: function()
  {
    this.game.state.start('End', true, false, this.score);
  },

  onCollectFly: function (player, fly)
  {
    fly.detach();
  	fly.kill();
  	this.score += 1;
  	this.scoreText.setText(String(this.score));
  },

  onTongueHitEnemy: function(tongueBall, enemy)
  {
    this.flies.forEach(function(fly) {
      if(fly.attached)
        fly.drop();
    },this);
    this.player.onTongueHitEnemy(tongueBall,enemy);
  },

  revive: function(sprite)
  {
    sprite.alive = true;
    sprite.exists = true;
    sprite.visible = true;
  },

  checkAlive: function(obj1, obj2)
  {
    return obj1.alive == true && obj2.alive == true;
  }


};
