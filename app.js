// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;
document.body.appendChild(canvas);

var pool = new ResourcePool();
pool.add("hero", "images/Character Boy.png");
pool.add("enemy", "images/Enemy Bug.png", 0.7);
pool.add("block", "images/Stone Block Tall.png");
pool.add("grass", "images/Dirt Block.png");
pool.add("prize1", "images/Gem Blue.png", 0.4);
pool.add("prize2", "images/Gem Green.png", 0.4);
pool.add("prize3", "images/Gem Orange.png", 0.4);
pool.add("heart", "images/Heart.png", 0.5);
pool.add("star", "images/Star.png", 0.5);

var scene = new Scene(mw, mh, 101, 81);
InitEnemy(scene.add(8,1,TileType.NPC,pool.enemy));
InitEnemy(scene.add(1,1,TileType.NPC,pool.enemy));
InitEnemy(scene.add(1,2,TileType.NPC,pool.enemy));

InitHero(scene.add(2,4,TileType.Player,pool.hero));
InitMap(scene, pool);

scene.initHud(pool);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


// Update game objects
var update = function (modifier) {
  scene.event("", modifier);

  if (38 in keysDown) { // Player holding up
    scene.event("u", modifier);
  }
  if (40 in keysDown) { // Player holding down
    scene.event("d", modifier);
  }
  if (37 in keysDown) { // Player holding left
    scene.event("l", modifier);
  }
  if (39 in keysDown) { // Player holding right
    scene.event("r", modifier);
  }
  if (32 in keysDown) { // Player holding fire
    scene.event("f", modifier);
  }

};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  scene.render(ctx);

  then = now;
};

var then = Date.now();
setInterval(main, 10);
