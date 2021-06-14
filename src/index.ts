import GameBase from "./game_base"
import Viewer from "./viewer";
import World from "./world";

class Game extends GameBase {
	private world: World;
	private viewer: Viewer;
	
	constructor(width: number, height: number) {
		super(width, height);

		this.world = new World();
		this.viewer = new Viewer(this.world, this.context);
	}

	update(deltaTime: number): void {
		this.world.update(deltaTime);
	}

	draw(): void {
		this.viewer.draw()
	}
}

function startGame() {
	let game = new Game(500, 500);
}
window.onload = startGame;

