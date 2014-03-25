function InitHero(hero) {
  hero.speed = 100;
  hero.width = 70;
  hero.height = 70;
  hero.offsetx = 15;
  hero.offsety = 70;
  hero.lives = 3;
  hero.score = 0;
  hero.knockback = 0;

  var tileRender = hero.render;
  hero.render = function(ctx) {
    if (hero.knockback > 0)
    {
      hero.knockback--;
    }

    ctx.globalAlpha = hero.getAlpha();
    tileRender(ctx);
    ctx.globalAlpha = 1;

    /*ctx.beginPath();
    ctx.strokeStyle="red";
    ctx.rect(hero.x,hero.y,hero.width,hero.height);
    ctx.stroke();*/
  }

  hero.getAlpha = function() {
    if (hero.knockback <= 0) return 1;

    return Math.ceil(hero.knockback / 10) % 2 == 0 ? 0.5 : 1;
  }

  hero.fire = function() {
    InitStar(hero, scene);
    return true;
  }

  hero.event = function(name, modifier) {
    if (name == "") return false;
  
    var px = this.x;
    var py = this.y;
    
    var d = Math.ceil(this.speed * modifier);
    if /**/ (name == "u") py -= d;
    else if (name == "d") py += d;
    else if (name == "l") px -= d;
    else if (name == "r") px += d;
    else if (name == "a") px += 0; // nop
    else if (name == "f") return hero.fire();
    else return false;
  
    if (this.canMove(px, py)) {
      this.x = px;
      this.y = py;
      return true;
    }
    
    return false;
  }
}
