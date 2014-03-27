var mw = 10;
var mh = 7;

function InitPrize(x, y, scene, pool) {
  var z = Math.ceil(Math.random() * 3);
  var c = 0;
  var img;
  if/* */(z <= 1) { c = 100; img = pool.prize1; }
  else if(z <= 2) { c = 200; img = pool.prize2; }
  else if(z <= 3) { c = 300; img = pool.prize3; }
  else throw  "OutOfRange";

  scene.add(x, y, TileType.Loot, img).worth = c;
}

function InitMap(scene, pool) {
  var map = 
  "##########"+
  "#.#.# ## #"+
  "# # #. # #"+
  "#     ##.#"+
  "#   # ## #"+
  "#   . .  #"+
  "##########";

  for (var y = 0; y < mh; ++y) {
    for (var x = 0; x < mw; ++x) {
      var c = x + y*mw;

      if (map[c] == '.') InitPrize(x, y, scene, pool);
      if (map[c] == '#') scene.add(x, y, TileType.Wall, pool.block);
      else               scene.add(x, y, TileType.Ground, pool.grass);
    }
  }
}
