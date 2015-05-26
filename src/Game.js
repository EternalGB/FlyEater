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
  this.frontEnemies;

  this.birds;

  this.bees;
  this.beeSpeed = 200;
  this.beeSpawnInterval = 3;

  this.waterEffects;

  this.fishSpeed = 500;
  this.fishSpawnInterval = 5;

  this.ladybugSpeed = 250;
  this.ladybugSpawnInterval = 2.5;

  this.birdSpeed = 250;
  this.birdSpawnInterval = 8;

  this.score = 0;
  this.scoreText;

};

Game.prototype = {

  init: function() {

    this.score = 0;
  },

  create: function() {
    this.playerY = this.game.height - 100;
    var startX = this.game.width/2;
  	var startY = this.playerY;

    this.game.stage.backgroundColor = '#99CCFF';
    var trees = this.game.add.tileSprite(0,0,800,800,'trees');
    this.clouds = this.game.add.group();
    var bg = this.game.add.tileSprite(0,0,800,600,'bg');
    this.tongueLayer = this.game.add.group();
    this.enemies = this.game.add.group();
    this.flies = this.game.add.group();
    this.bees = this.game.add.group();
    var mg = this.game.add.tileSprite(0,0,800,600,'mg');
    this.waterEffects = this.game.add.group();
    this.player = new Player(this.game, startX, startY, this.tongueLayer);
    this.frontEnemies = this.game.add.group();
    var fg = this.game.add.tileSprite(0,0,800,600,'fg');


    this.game.physics.startSystem(Phaser.Physics.ARCADE);



  	this.flies.enableBody = true;
    this.enemies.enableBody = true;

  	this.scoreText = this.game.add.text(10,10,String(this.score),null);


    this.time.events.loop(this.cloudSpawnInterval*1000, this.spawnCloud, this);
  	this.time.events.loop(this.flySpawnInterval*1000, this.spawnFly, this);
    this.time.events.loop(this.fishSpawnInterval*1000, this.spawnFish, this);
    this.time.events.loop(this.ladybugSpawnInterval*1000, this.spawnLadybug, this);

    this.time.events.loop(this.beeSpawnInterval*1000, this.spawnBee, this);
    this.time.events.loop(this.birdSpawnInterval*1000, this.spawnBird, this);

  },

  update: function() {
    if(this.player.tongueCanGrab) {
      this.game.physics.arcade.overlap(this.player.tongueBall, this.flies,
        this.player.onTongueFly, this.checkAlive, this.player);
      this.game.physics.arcade.overlap(this.player.tongueBall, this.bees,
        this.player.onTongueBee, function(tongueBall, bee) {
          return !bee.attached;
        }, this.player);
    }
    if(this.player.tongueState != TongueStates.IDLE) {
      this.game.physics.arcade.overlap(this.player.tongueBall, this.enemies,
        this.onTongueHitEnemy, null, this);
    }
    this.game.physics.arcade.overlap(this.player, this.flies,
      this.onCollect(1), this.checkAlive, this);
    this.game.physics.arcade.overlap(this.player, this.bees,
      this.onCollect(2), this.checkAlive, this);
    this.game.physics.arcade.overlap(this.player, this.enemies,
      this.player.die(this.onGameEnd,this), null, this.player);
    this.game.physics.arcade.overlap(this.player, this.frontEnemies,
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
    var x = this.game.math.clamp(
      this.player.x + this.game.rnd.realInRange(-50, 50), 0, this.game.width);
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

  spawnBee: function()
  {
    this.spawnScrollingSprite(Bee, this.bees, 0, this.playerY-200,
      this.beeSpeed, this.killDist);
  },

  spawnBird: function()
  {
    var x = this.game.rnd.pick([0,this.game.width]);
    var y = this.game.rnd.realInRange(this.playerY-300, 0);
    var speed = this.birdSpeed + this.birdSpeed*this.game.rnd.realInRange(-0.10,0.10);
    var birdGhost = this.game.add.sprite(x,y, 'enemies');
    birdGhost.animations.add('idle', ['bat.png']).play(1,true);
    birdGhost.anchor.setTo(0.5);
    birdGhost.alpha = 0.5;
    birdGhost.scale.x *= x > 0 ? 1 : -1;

    this.game.time.events.add(3*1000, function(ghost, _speed) {
      this.frontEnemies.add(new Bird(this.game, ghost.x, ghost.y, this.player, _speed));
      birdGhost.destroy();
    }, this, birdGhost, speed);
  },

  onGameEnd: function()
  {
    this.game.state.start('End', true, false, this.score);
  },

  onCollect: function (scoreValue)
  {
    var _scoreValue = scoreValue;
    return function(player, collected) {
      collected.detach();
      collected.kill();
    	this.score += _scoreValue;
    	this.scoreText.setText(String(this.score));
    }
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
