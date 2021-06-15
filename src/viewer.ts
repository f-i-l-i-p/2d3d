import World from "./world";

export default class Viewer {
	private world: World;
	private context: CanvasRenderingContext2D;

	private static readonly WALL_HEIGHT: number = 100;
	private static readonly FOV: number = 0.7;
	private static readonly RAYS: number = 100;

	constructor(world: World, context: CanvasRenderingContext2D) {
		this.world = world;
		this.context = context;
	}

	draw(): void {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

		for (let i = 0; i < Viewer.RAYS; i++) {
			const offset = i - Viewer.RAYS / 2;
			const angle = Viewer.FOV * offset / (Viewer.RAYS / 2);

			const columnPos = (i / Viewer.RAYS) * this.canvasWidth();

			this.drawColumn(angle, columnPos);
		}
	}

	drawColumn(angle: number, x: number): void {
		const dist = this.world.sendRay(this.world.getPlayerX(), this.world.getPlayerY(), this.world.playerRotation + angle);
		const height = this.calculateWallHeight(dist);

		const width = Math.ceil(this.canvasWidth() / Viewer.RAYS) + 1;

		const center = this.canvasHeight() / 2;

		const y0 = center - height / 2;
		const y1 = center + height / 2;

		this.context.strokeStyle = "#555555";
		this.context.lineWidth = width;
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

	canvasWidth(): number {
		return this.context.canvas.width;
	}

	canvasHeight(): number {
		return this.context.canvas.height;
	}

	calculateWallHeight(dist: number): number {
		if (dist == -1) return 0;

		const angle = Math.atan(Viewer.WALL_HEIGHT / dist);
		const fovPercent = angle / Viewer.FOV;
		var height = fovPercent * this.canvasHeight();

		// Lower resolution
		height /= this.canvasHeight() / Viewer.RAYS;
		height = Math.round(height);
		height *= this.canvasHeight() / Viewer.RAYS;

		return Math.min(height, this.canvasHeight());
	}
}