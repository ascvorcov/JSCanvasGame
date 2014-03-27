function InitHero(hero) {
  hero.speed = 100;
  hero.width = 70;
  hero.height = 70;
  hero.offsetx = 15;
  hero.offsety = 70;
  hero.lives = 3;
  hero.score = 0;
  hero.heading = "r";
  hero.knockback = 0;
  hero.recoil = 0;

  /*ctx.beginPath();
  ctx.strokeStyle="red";
  ctx.rect(hero.x,hero.y,hero.width,hero.height);
  ctx.stroke();*/

  hero.getAlpha = function() {
    if (hero.knockback <= 0) return 1;

    return Math.ceil(hero.knockback / 10) % 2 == 0 ? 0.5 : 1;
  }

  hero.fire = function() {
    if (hero.recoil <= 0) {
      hero.recoil = 100;
      InitStar(hero, scene);
      return true;
    }

    return false;
  }

  hero.event = function(name, modifier) {
    if (name == "") {
      if (hero.recoil    > 0) hero.recoil--; //process stats on idle event
      if (hero.knockback > 0) hero.knockback--;
      return false;
    }
  
    var px = this.x;
    var py = this.y;
    
    if ("udlr".indexOf(name) >= 0) 
      hero.heading = name;

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