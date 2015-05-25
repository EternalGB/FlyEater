var Bee = function(game, x, y, speed, killDist)
{
  ScrollingSprite.call(this, game, x, y, 'enemies', speed, killDist);
  this.scale.setTo(0.75*this.scale.x, 0.75*this.scale.y);
  this.animations.add('moving',['bee.png','bee_fly.png'],48,true);
  this.animations.add('dead',['bee_dead.png'],1,true);
  this.animations.play('moving');

}

Bee.prototype = Object.create(ScrollingSprite.prototype);
