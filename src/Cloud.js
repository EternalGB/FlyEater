var Cloud = function(game, x, y, speed, killDist)
{
  this.killDist = killDist;
  ScrollingSprite.call(this, game, x, y, 'clouds', speed, killDist);
  this.frame = game.rnd.integerInRange(0,8);
  this.scale.setTo(game.rnd.realInRange(0.25,0.5));
}

Cloud.prototype = Object.create(ScrollingSprite.prototype);
