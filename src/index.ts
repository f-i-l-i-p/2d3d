import GameBase from "./game_base"

class Game extends GameBase {
	private world: boolean[][];
	private tileSize: number = 100;
	private tiles: number = 7;
	private rays: number = 300;
	private fov: number = 0.8;
	private max_view_dist: number = 1000;
	private rayStep: number = 1;
	private rotation: number = Math.PI / 2 - 0.5;

	private forward: boolean = false;
	private backwards: boolean = false;
	private left: boolean = false;
	private right: boolean = false;
	private rotation_speed = 0.002;
	private walk_speed = 0.15;

	private x_pos = 350;
	private y_pos = 650;

	constructor(width: number, height: number) {
		super(width, height);

		this.setUpInputs();
		this.createWorld();
	}

	createWorld(): void {
		this.world = [
			[true, true, false, true, false, false, true],
			[false, false, false, false, false, false, false],
			[false, false, false, false, true, false, false],
			[true, true, false, false, false, false, false],
			[true, false, false, false, false, true, false],
			[true, false, false, false, false, false, false],
			[true, true, false, false, true, false, false],
		];
	}

	getTile(x: number, y: number): boolean {
		const tile_x = Math.floor(x / this.tileSize);
		const tile_y = Math.floor(y / this.tileSize);

		if (tile_x < 0 || tile_y < 0 || tile_x >= this.tiles || tile_y >= this.tiles) {
			return false;
		}

		return this.world[tile_y][tile_x];
	}

	sendRay(angle: number): number {
		angle -= this.rotation;

		let x = this.x_pos;
		let y = this.y_pos;

		let dist = 0;

		while (dist < this.max_view_dist) {
			x += Math.cos(angle) * this.rayStep;
			y += Math.sin(angle) * this.rayStep;

			dist = Math.sqrt(Math.pow(x - this.x_pos, 2) + Math.pow(y - this.y_pos, 2))

			if (this.getTile(x, y)) {
				return dist;
			}
		}

		return this.max_view_dist;
	}

	update(deltaTime: number): void {
		if (this.right) this.rotation -= this.rotation_speed * deltaTime;
		if (this.left) this.rotation += this.rotation_speed * deltaTime;
		if (this.forward) {
			this.x_pos += Math.cos(this.rotation) * this.walk_speed * deltaTime;
			this.y_pos -= Math.sin(this.rotation) * this.walk_speed * deltaTime;
		}
		if (this.backwards) {
			this.x_pos -= Math.cos(this.rotation) * this.walk_speed * deltaTime;
			this.y_pos += Math.sin(this.rotation) * this.walk_speed * deltaTime;
		}
	}

	private setUpInputs() {
		const game = this;
		document.addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'ArrowUp':
					game.forward = true;
					break;
				case 'ArrowDown':
					game.backwards = true;
					break;
				case 'ArrowLeft':
					game.left = true;
					break;
				case 'ArrowRight':
					game.right = true;
					break;
			}
		});
		document.addEventListener('keyup', function (event) {
			switch (event.key) {
				case 'ArrowUp':
					game.forward = false;
					break;
				case 'ArrowDown':
					game.backwards = false;
					break;
				case 'ArrowLeft':
					game.left = false;
					break;
				case 'ArrowRight':
					game.right = false;
					break;
			}
		});
	}

	draw(): void {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

		for (let i = 0; i < this.rays; i++) {
			const offset = i - this.rays / 2;
			const angle = this.fov * offset / (this.rays / 2)
			this.drawColumn(angle);
		}
	}

	drawColumn(angle: number): void {
		const x = this.width / 2 + angle * this.width / (2 * this.fov);

		const dist = this.sendRay(angle);
		const height = this.getHeight(dist);

		const center = this.height / 2;

		const y0 = center - height / 2;
		const y1 = center + height / 2;

		this.context.strokeStyle = "#555555";
		this.context.beginPath();
		this.context.moveTo(x, y0);
		this.context.lineTo(x, y1);
		this.context.stroke();

		this.context.strokeStyle = "#999999";
		this.context.beginPath();
		this.context.moveTo(x, y1);
		this.context.lineTo(x, this.context.canvas.height);
		this.context.stroke();
	}

	getHeight(dist: number): number {
		if (dist == this.max_view_dist) return 0;

		const height = Math.pow((this.max_view_dist - dist + 1000) / 800, 10) / 20;

		return Math.min(height, this.context.canvas.height);
	}
}

function startGame() {
	let game = new Game(500, 500);
}
window.onload = startGame;

