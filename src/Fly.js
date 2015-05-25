Fly = function(game, x, y, moveSpeed, killDist)
{
  ScrollingSprite.call(this, game, x, y, 'fly', moveSpeed, killDist);
  this.animations.add('moving',['fly.png','fly_fly.png'],48,true);
  this.animations.add('dead',['fly_dead'],1,true);
  this.animations.play('moving');


}

Fly.prototype = Object.create(ScrollingSprite.prototype);
Fly.prototype.constructor = Fly;
