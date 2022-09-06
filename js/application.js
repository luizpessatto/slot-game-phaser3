var WIDTH = 800;
var HEIGHT = 600;
var WINNING_SEQUENCES = [
  // Banana
  [[0, 0, 0], 1],

  // Orange
  [[1, 1, 1], 5],

  // Grape
  [[2, 2, 2], 10],

  // Apple
  [[3, 3, 3], 15],

  // Watermelon
  [[4, 4, 4], 20],

  // Lemon
  [[5, 5, 5], 25],

  // Cherry
  [[6, 6, 6], 50],

  // BAR
  [[7, 7, 7], 100],
];

var LINE_MAP = [
  [[0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
  [[0, 0], [1, 0], [2, 1]],
  [[0, 2], [1, 2], [2, 1]],
  [[0, 1], [1, 2], [2, 1]],
  [[0, 1], [1, 0], [2, 1]]
];

var canvas = $('<canvas width ="' + WIDTH + '" height="' + HEIGHT + '"></canvas>');
var ctx = canvas.get(0).getContext("2d");
$(canvas).appendTo('#stage');

var bg_img_ready = false;
var bg_img = new Image();
bg_img.onload = function () {
  bg_img_ready = true;
}
bg_img.src = "img/lucky-slot-machine.png";

var tile1_img_ready = false;
var tile1_img = new Image();
tile1_img.onload = function () {
  tile1_img_ready = true;
}
tile1_img.src = "img/banana.png";

var tile2_img_ready = false;
var tile2_img = new Image();
tile2_img.onload = function () {
  tile2_img_ready = true;
}
tile2_img.src = "img/orange.png";

var tile3_img_ready = false;
var tile3_img = new Image();
tile3_img.onload = function () {
  tile3_img_ready = true;
}
tile3_img.src = "img/grape.png";

var tile4_img_ready = false;
var tile4_img = new Image();
tile4_img.onload = function () {
  tile4_img_ready = true;
}
tile4_img.src = "img/apple.png";

var tile5_img_ready = false;
var tile5_img = new Image();
tile5_img.onload = function () {
  tile5_img_ready = true;
}
tile5_img.src = "img/watermellon.png";

var tile6_img_ready = false;
var tile6_img = new Image();
tile6_img.onload = function () {
  tile6_img_ready = true;
}
tile6_img.src = "img/lemon.png";

var tile7_img_ready = false;
var tile7_img = new Image();
tile7_img.onload = function () {
  tile7_img_ready = true;
}
tile7_img.src = "img/cherry.png";

var lucky_img_ready = false;
var lucky_img = new Image();
lucky_img.onload = function () {
  lucky_img_ready = true;
}
lucky_img.src = "img/bar.png";

var line1_img_ready = false;
var line1_img = new Image();
line1_img.onload = function () {
  line1_img_ready = true;
}
line1_img.src = "img/line1.png";

var line1_img_ready = false;
var line1_img = new Image();
line1_img.onload = function () {
  line1_img_ready = true;
}
line1_img.src = "img/line1.png";

function results_sequence_match(results, winning_sequence) {
  for (var i = 0; i < winning_sequence.length; i++) {
    if (winning_sequence[i] != results[i]) {
      return false;
    }
  };
  return true;
}

function get_results_line_from_reel(line_map) {
  var results = [];
  for (var i = 0; i < line_map.length; i++) {
    var reel_number = line_map[i][0];
    var row = line_map[i][1];
    results.push(reels_top[reel_number].tiles[row]);
  };
  return results;
}

function get_all_results(lines_to_get) {
  all_results = [];
  for (var i = 0; i < lines_to_get; i++) {
    all_results.push(get_results_line_from_reel(LINE_MAP[i]));
  };
  return all_results;
}

function calculate_winnings(all_results) {
  game_state.highlight_tiles = [];
  for (var i = 0; i < all_results.length; i++) {
    for (var j = 0; j < WINNING_SEQUENCES.length; j++) {
      if (results_sequence_match(all_results[i], WINNING_SEQUENCES[j][0])) {
        game_state.win += WINNING_SEQUENCES[j][1];
        game_state.highlight_tiles.push(i);
        game_state.current_line_winnings_map.push([i, WINNING_SEQUENCES[j][1]]);
        break;
      }
    };
  };
}

function rotate_highlight_tiles() {
  game_state.show_highlight_tiles = true;
  game_state.current_highlight_tiles_counter++;
  var current_index = game_state.current_highlight_tiles_counter % game_state.highlight_tiles.length;
  game_state.current_highlight_tiles = game_state.highlight_tiles[current_index];
}

function GameState(win, paid, credits, bet, tiles, highlight_tiles, show_highlight_tiles) {
  this.win = win;
  this.paid = paid;
  this.credits = credits;
  this.bet = bet;
  this.tiles = tiles;
  this.highlight_tiles = highlight_tiles;
  this.show_highlight_tiles = show_highlight_tiles;
  this.current_highlight_tiles = 0;
  this.current_highlight_tiles_counter = 0;
  this.rotate_highlight_loop = null;
  this.spin_click_shield = false;
  this.show_lines = true;
  this.current_line_winnings_map = [];
  this.transfer_win_to_credits = function() {
    var i = this.win;
    var counter = 0;
    while (i > 0) {
      i -= 1;
      counter += 50;
      setTimeout(function(){
        game_state.paid += 1;
        game_state.credits += 1;
        if (game_state.win == game_state.paid) {
          game_state.spin_click_shield = false;
        }
      }, counter);
    }
  }
}

var game_state = new GameState(0, 0, 500, 0, [], [], true);

game_state.tiles.push(new Tile('banana', tile1_img, '1'));
game_state.tiles.push(new Tile('orange', tile2_img, '1'));
game_state.tiles.push(new Tile('grape', tile3_img, '1'));
game_state.tiles.push(new Tile('apple', tile4_img, '1'));
game_state.tiles.push(new Tile('watermellon', tile5_img, '1'));
game_state.tiles.push(new Tile('lemon', tile6_img, '1'));
game_state.tiles.push(new Tile('cherry', tile7_img, '1'));
game_state.tiles.push(new Tile('bar', lucky_img, '1'));

function Tile(name, img, value) {
  this.name = name;
  this.img = img;
  this.value = value;
}

function Reel(x, y, x_vel, y_vel, y_acc, tiles) {
  this.x = x;
  this.y = y;
  this.x_vel = x_vel;
  this.y_vel = y_vel;
  this.y_acc = y_acc;
  this.tiles = tiles;
  this.draw = function() {
    for (var i = 0; i < this.tiles.length; i++) {
      y_offset = this.y + 125 * i + 129;
      ctx.drawImage(game_state.tiles[this.tiles[i]].img, 0, 0, 138, 130, this.x, y_offset, 100, 100);
    };
  };
  this.update = function(modifier) {
    this.y += this.y_vel;
  };
}

function ButtonObject(x, y, width, height, handler) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

    this.handleClick = function(mouse) {

        if (this.x < mouse.x &&
          this.x + this.width > mouse.x &&
          this.y < mouse.y &&
          this.y + this.height > mouse.y) {

        handler();
        return true;
      }

        return false;
    }

    this.draw = function() {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function BetButton(x, y, width, height, handler, bet_amount) {
  ButtonObject.apply(this, arguments);
  this.bet_amount = bet_amount;
  this.handleClick = function(mouse) {

        if (this.x < mouse.x &&
          this.x + this.width > mouse.x &&
          this.y < mouse.y &&
          this.y + this.height > mouse.y) {

          handler(bet_amount);
        game_state.show_lines = true;
        game_state.show_highlight_tiles = false;
          return true;
      }
  }
}
var change_bet_amount = function(bet_amount) {
  game_state.bet = bet_amount;
}

var reels_top = [];

var spin_handler = function(){
  if (game_state.spin_click_shield) {
    return;
  }
  game_state.spin_click_shield = true;
  clearInterval(game_state.rotate_highlight_loop);
  game_state.current_highlight_tiles_counter = 0;
  game_state.rotate_highlight_loop = 0;
  game_state.paid = 0;
  game_state.win = 0;
  game_state.credits -= game_state.bet;
  game_state.show_highlight_tiles = false;
  game_state.show_lines = false;
  game_state.current_line_winnings_map = [];
  for (var i = 0; i < reels_bottom.length; i++) {
    reels_top = generate_reels(-1000);
    animate_reels(i);
  };
  setTimeout(function(){
    calculate_winnings(get_all_results(game_state.bet));
    game_state.transfer_win_to_credits();
    game_state.rotate_highlight_loop = setInterval(rotate_highlight_tiles, 2000);
    if (game_state.win == game_state.paid) {
      game_state.spin_click_shield = false;
    }
  }, 1500);
}

var animate_reels = function(index){
  setTimeout(function(){
    reels_top[index].y_vel = 15;
    reels_bottom[index].y_vel = 15;
  }, 100 * index);
}

var button_object_array = [
  new ButtonObject(350, 500, 86, 80, spin_handler),
  new BetButton(285, 447, 34, 24, change_bet_amount, 1),
  ];


function generate_random_tile_list (num) {
  var random_tile_list = [];
  for (var i = 0; i < num; i++) {
    var random_num = Math.floor(Math.random() * game_state.tiles.length);
    random_tile_list.push(random_num);
  };
  return random_tile_list;
}

var generate_reels = function(starting_y){
  var reels = [];
  reels.push(new Reel(215, starting_y, 0, 0, 0, generate_random_tile_list(10)));
  reels.push(new Reel(355, starting_y, 0, 0, 0, generate_random_tile_list(10)));
  reels.push(new Reel(487, starting_y, 0, 0, 0, generate_random_tile_list(10)));
  return reels;
}

var reels_bottom = generate_reels(0);

function draw_reel (reel) {
  for (var i = 0; i < reel.tiles.length; i++) {
    y_offset = 100 * i;
    ctx.drawImage(game_state.tiles[reel.tiles[i]].img, 0, 0, 100, 100, reel.x, y_offset, 100, 100);
  };
}

var canvasPosition = {
  x: canvas.offset().left,
  y: canvas.offset().top
};

canvas.on('click', function(e) {

  var mouse = {
    x: e.pageX - canvasPosition.x,
    y: e.pageY - canvasPosition.y
  }

  for (var i = 0; i < button_object_array.length; i++) {
    button_object_array[i].handleClick(mouse);
  };
});

var reset = function () {
};

var update = function (modifier) {
  for (var i = 0; i < reels_bottom.length; i++) {
    reels_bottom[i].update(modifier);
  };
  for (var i = 0; i < reels_top.length; i++) {
    if (reels_top[i].y >= 0) {
      reels_top[i].y_vel = 0;
      reels_bottom = reels_top;
      reels_bottom[i].y = 0;
    }
    reels_top[i].update(modifier);
  };
};

var render = function () {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (var i = 0; i < reels_bottom.length; i++) {
    reels_bottom[i].draw();
  };
  for (var i = 0; i < reels_top.length; i++) {
    reels_top[i].draw();
  };

  for (var i = 0; i < button_object_array.length; i++) {
    button_object_array[i].draw();
  };

  ctx.drawImage(bg_img, 0, 0, 800, 600, 0, 0, 800, 600);
  ctx.fillStyle = "#000000"
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText('Balance:', 312, 150);
  ctx.fillText(game_state.credits, 355, 150);
  ctx.fillText('Paid:', 558, 150);
  ctx.fillText(game_state.paid, 587, 150);
  ctx.fillText('Bet:', 265, 450);
  ctx.fillText('🔼', 305, 447);
  ctx.fillText(game_state.bet, 280, 450);

  if (game_state.show_highlight_tiles && game_state.highlight_tiles.length && !game_state.show_lines) {
    var winnings_x_coord = 155;
    var winnings_y_coord = 0;
    switch(game_state.current_highlight_tiles) {
      case 0:
        ctx.drawImage(line1_img, 0, 0, 561, 160, 117, 20, 561, 301);
        break;
    }
    for (var j = 0; j < 5; j++) {
      var x_coord = LINE_MAP[game_state.current_highlight_tiles][j][0] * 100 + 150;
      var y_coord = LINE_MAP[game_state.current_highlight_tiles][j][1] * 100 + 20;
      ctx.fillRect(x_coord, y_coord, 0, 0);
    };
    for (var i = 0; i < game_state.current_line_winnings_map.length; i++) {
      if (game_state.current_line_winnings_map[i][0] == game_state.current_highlight_tiles) {
        ctx.textAlign = "left";
        ctx.fillStyle = "#231F20";
        ctx.fillText(game_state.current_line_winnings_map[i][1], winnings_x_coord, winnings_y_coord);
      }
    };
  }
};

var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;
};

reset();
var then = Date.now();
var main_loop = setInterval(main, 16);