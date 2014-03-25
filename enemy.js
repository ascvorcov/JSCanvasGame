Enter file contents herefunction InitEnemy(enemy) {

  enemy.x += 10;
  enemy.y += 10;
  enemy.width = 70;
  enemy.height = 70;
  enemy.offsetx = 15;
  enemy.offsety = 70;
  enemy.speed = 90;
  
  enemy.getOffset = function(dir, modifier) {
    
    var d = Math.ceil(this.speed * modifier);
    
    if /**/ (dir <= 1.0) return { x:0,y:-d };
    else if (dir <= 2.0) return { x:0,y:+d };
    else if (dir <= 3.0) return { x:-d,y:0 };
    else if (dir <= 4.0) return { x:+d,y:0 };

    throw "NotSupported:" + dir;
  }
  
  enemy.strategyLine = function(modifier) {
  
    if (enemy.remainingMoves == undefined || enemy.remainingMoves <= 0)
    {
      enemy.remainingMoves = Math.random() * 200;
      enemy.dir = Math.ceil(Math.random() * 4);
    }

    enemy.remainingMoves--;
    var d = enemy.getOffset(enemy.dir, modifier);
    if (!this.canMove(this.x + d.x, this.y + d.y))
      enemy.remainingMoves = 0;

    return d;
  }

  enemy.event = function(name, modifier) {

    if (name != "") return false; // skip non-idle cycles

    var px = this.x;
    var py = this.y;
    
    /*var d = this.getOffset(Math.random() * 4, modifier);*/
    var d = this.strategyLine(modifier);
    
    if (this.canMove(px + d.x, py + d.y)) {
      this.x += d.x;
      this.y += d.y;
      return true;
    }
    
    return false;
  }
}
