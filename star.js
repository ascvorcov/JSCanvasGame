function InitStar(hero, scene) {
  var star = scene.add(0, 0, TileType.Projectile, pool.star);
  star.x = hero.x;
  star.y = hero.y;
  star.speed = 300;
  star.width = 40;
  star.height = 40;
  star.offsetx = 30;
  star.offsety = 75;
  
  /*var tileRender = hero.render;
  hero.render = function(ctx) {
    tileRender(ctx);
    ctx.beginPath();
    ctx.strokeStyle="red";
    ctx.rect(star.x,star.y,star.width,star.height);
    ctx.stroke();
  }*/

  star.event = function(name, modifier) {
    if (name != "") return false;
  
    var px = this.x;
    var py = this.y;
    
    var d = Math.ceil(this.speed * modifier);
    px += d;

    if (this.canMove(px, py)) {
      this.x = px;
      this.y = py;
      return true;
    }

    return false;
  }
}
