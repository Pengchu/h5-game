
var map = {

	tile_size: 16,

	keys: [{
		id: 0,
		colour: '#333',
		solid: 0
	}, {
		id: 1,
		colour: '#888',
		solid: 0
	}, {
		id: 2,
		colour: '#555',
		solid: 1,
	}],

	data: [
		[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
		[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
	]
};

var Clarity = function() {
	
	this.tile_size = 16;

	this.viewport = {
		x: 200,
		y: 200
	};

	this.camera = {
		x: 0,
		y: 0
	};
};

Clarity.prototype.log = function(message) {
	console.log(message);
};

Clarity.prototype.load_map = function(map) {

	if (typeof map === 'undefined' || typeof map.data === 'undefined' || typeof map.keys === 'undefined') {
		this.log ('ERROR: Invalid map data!');
		return false;
	}

	this.current_map = map;

	this.current_map.background = map.background || '#333';
	this.current_map.gravity = map.gravity || {
		x: 0,
		y: 0.3
	};
	this.tile_size = map.tile_size || 16;

	var _this = this;

	this.current_map.width = 0;
	this.current_map.height = 0;

	map.keys.forEach(function(key) {

		map.data.forEach(function(row, y) {

			_this.current_map.height = Math.max(_this.current_map.height, y);

			row.forEach(function(tile, x) {

				_this.current_map.width = Math.max(_this.current_map.width, x);

				if (tile == key.id)
					_this.current_map.data[y][x] = key;
			});
		});
	});

	this.current_map.width_p = this.current_map.width * this.tile_size;
	this.current_map.height_p = this.current_map.height * this.tile_size;

	this.camera = {
		x: 0,
		y: 0
	};

	this.log('Successfully loaded map data.');

	return true;
};

Clarity.prototype.draw_tile = function(x, y, tile, context) {

	if (!tile || !tile.colour) return;

	context.fillStyle = tile.colour;
	context.fillRect(
		x,
		y,
		this.tile_size,
		this.tile_size
	);
}

Clarity.prototype.draw_map = function(context, fore) {
	
	for (var y = 0; y < this.current_map.data.length; y++) {

		for (var x = 0; x < this.current_map.data[y].length; x++) {
			
			if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {

				var t_x = (x * this.tile_size) - this.camera.x;
				var t_y = (y * this.tile_size) - this.camera.y;

				if (t_x < -this.tile_size || t_y < -this.tile_size || t_x > this.viewport.x || t_y > this.viewport.y) continue;

				this.draw_tile(
					t_x,
					t_y,
					this.current_map.data[y][x],
					context
				);
			}
		}
	}

	if (!fore) this.draw_map(context, true);
}

Clarity.prototype.draw = function(context) {

	this.draw_map(context, false);
};

window.requestAnimFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		return window.setTimeout(callback, 1000 / 60);
	};

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

var game = new Clarity();

game.load_map(map);

var Loop = function() {

	ctx.fillStyle = '#333';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	game.draw(ctx);

	window.requestAnimFrame(Loop);
};

Loop();