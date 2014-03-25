var TileType = {
  Wall : 1,
  Ground : 2,
  Loot : 3,
  NPC: 4,
  Player : 5,
  Projectile : 6
}

function ResourcePool() {
  var ret = {}
  ret.add = function(name, url, scale) {
    ret[name] = new Resource(url, scale == undefined ? 1 : scale);
  }
  return ret;
}

function Resource(url, scale) {
  var ret = {}
  ret.ready = false;
  ret.image = new Image();
  ret.scale = scale;
  ret.cached = undefined;
  ret.image.onload = function () {
    ret.ready = true;
  };

  ret.render = function(ctx, x, y) {
    if (ret.scale == 1)
      ctx.drawImage(ret.image, x, y);
    else {
      var r = ret.getOffset();
      ctx.drawImage(ret.image, x + r.offsetX, y + r.offsetY, r.width, r.height);
    }
  }
  
  ret.getOffset = function() {
    if (!ret.ready) return { offsetX : 0, offsetY : 0, width : 0, height : 0 };
    if (ret.cached != undefined) return ret.cached;

    var nw = ret.image.width * ret.scale;
    var nh = ret.image.height * ret.scale;
    var ox = (ret.image.width - nw) / 2;
    var oy = (ret.image.height - nh) / 2;
    ret.cached = { offsetX : ox, offsetY : oy, width : nw, height : nh };
    return ret.cached;
  }

  ret.image.src = url;
  return ret;
}

function Tile(res, speed, x, y, w, h, type) {
   var tile = {}
   tile.res = res;
   tile.x = x;
   tile.y = y;
   tile.width = w;
   tile.height = h;
   tile.offsetx = 0;
   tile.offsety = 50;
   tile.speed = speed;
   tile.type = type;
   tile.render = function (ctx) {                                                                         
     if (tile.res.ready) {
       tile.res.render(ctx, tile.x - tile.offsetx, tile.y - tile.offsety);
     }
   }

   tile.order = function () {
     if (tile.type == TileType.NPC || tile.type == TileType.Player || tile.type == TileType.Projectile)
       return (tile.y + tile.height)*1000;
     return (tile.y*1000) + tile.type;
   }

   tile.event = function(name, modifier) {
     return false;
   }

   tile.rect = function() {
     return new Rectangle(tile.x, tile.y, tile.width, tile.height);
   }
   
  tile.canMove = function(px, py) {
    var rect = tile.rect();
    rect.left = px;
    rect.top = py;
    return scene.canMove(tile, rect);
  }

  return tile;   
}

function HeadUpDisplay(pool, hero) {
  var h = {};
  h.heart = pool.heart;
  h.hero = hero;
  h.render = function(ctx) {
    for (var i = 0; i < h.hero.lives; ++i) {
      h.heart.render(ctx, i * 101, -50);
    }
    ctx.font="30px Verdana";
    var gradient=ctx.createLinearGradient(350,40, 500,60);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    ctx.fillStyle=gradient;
    ctx.fillText(h.hero.score + "",350,40);
  }
  
  return h;
}

function Scene(sizex, sizey, tilew, tileh) {
  var s = {};
  s.sizex = sizex;
  s.sizey = sizey;
  s.tilew = tilew;
  s.tileh = tileh;
  s.actors = [];
  
  s.add = function(x, y, type, res) {
    if (x < 0 || x >= this.sizex) throw "OutOfRangeX";
    if (y < 0 || y >= this.sizey) throw "OutOfRangeY";
    var px = x * this.tilew;
    var py = y * this.tileh;
    var tile = new Tile(res, 0, px, py, this.tilew, this.tileh, type);
    s.actors.push(tile);
    s.event("a", 0);
    return tile;
  }
  
  s.initHud = function(pool) {
    s.hud = new HeadUpDisplay(pool, s.hero());
  }

  s.hero = function() {
    for (var k in s.actors) {
      if (s.actors[k].type == TileType.Player)
        return s.actors[k];
    }
    return null;
  }

  s.event = function(name, modifier) {
    var changed = false;
    for (var x in s.actors) {
      var actor = s.actors[x];
      changed |= actor.event(name, modifier);
    }

    if (changed) {
      s.actors.sort(function(a,b) { return a.order() - b.order() });
    }
  }

  s.render = function(ctx) {
    for (var x in s.actors) {
      var actor = s.actors[x];
      actor.render(ctx);
    }

    s.hud.render(ctx);
  }
  
  s.isOneOf = function(left, right, t) {
    if (left.type == t) return [left, right];
    if (right.type == t)return [right, left];
    return null;
  }

  s.collide = function(left, right) {
    var lt = left.type;
    var rt = right.type;

    var res = s.isOneOf(left, right, TileType.Projectile);
    if (res != null) {
      /* projectile hit */
      var star = res[0];
      var obj = res[1];
      if (obj.type != TileType.Player && obj.type != TileType.Loot) {
        scene.actors.splice(scene.actors.indexOf(star), 1);
        return false; // projectile hit and removed - no reason to check further.
      }
    }
  
    res = s.isOneOf(left, right, TileType.Player);
    if (res != null) {
      /* player hit something */
      var player = res[0];
      var obj = res[1];
      
      if/* */(obj.type == TileType.Loot) {
        player.score += obj.worth;
        scene.actors.splice(scene.actors.indexOf(obj), 1);
        return false; //loot is removed - no reason to check further, cannot move.
      }
      else if (obj.type == TileType.NPC) {
        if (player.knockback == 0) {
          player.lives--;
          player.knockback = 100;
        }
      }
    }

    /* cannot move with following collisions: player-npc, npc-npc, player-wall, npc-wall */
    var unpassable =
         s.check(lt, rt, TileType.NPC,    TileType.Wall)
      || s.check(lt, rt, TileType.NPC,    TileType.NPC)
      || s.check(lt, rt, TileType.Player, TileType.Wall)
      || s.check(lt, rt, TileType.Player, TileType.NPC);

    return !unpassable;
  }

  s.check = function(lt,rt, t1, t2)
  {
    return (lt == t1 && rt == t2) || (lt == t2 && rt == t1);
  }
  
  s.canMove = function(a, rect) {
    for (var x in s.actors) {
      var actor = s.actors[x];
      if (actor === a)
        continue;
      if (actor.type == TileType.Ground) 
        continue;
      if (intersect(rect, actor.rect()))
      {
        if (!s.collide(a, actor)) return false;
      }
    }

    return true;
  }
  return s;               
}

function Rectangle (l, t, w, h) {
  var r = {};
  r.left = l;
  r.top = t;
  r.width = w;
  r.height = h;
  r.right = function() { return r.left + r.width; }
  r.bottom = function() { return r.top + r.height; }
  return r;
}

function intersect(a, b) {
  return (a.left < b.right() &&
          b.left < a.right() &&
          a.top < b.bottom() &&
          b.top < a.bottom());
}
