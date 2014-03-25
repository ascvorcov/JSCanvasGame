var mw = 10;
var mh = 7;

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
      
      if (map[c] == '.') scene.add(x, y, TileType.Loot, pool.prize).worth = 100;
      if (map[c] == '#') scene.add(x, y, TileType.Wall, pool.block);
      else               scene.add(x, y, TileType.Ground, pool.grass);
    }
  }
}
