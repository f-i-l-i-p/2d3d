import World from "./world";

export default class Viewer {
    private world: World;
    private context: CanvasRenderingContext2D;

    constructor(world: World, context: CanvasRenderingContext2D) {
        this.world = world;
        this.context = context;
    }

    draw(): void {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        const rays = 300;
        const fov = 0.8;

		for (let i = 0; i < rays; i++) {
			const offset = i - rays / 2;
			const angle = fov * offset / (rays / 2);

            const columnPos = (i / rays) * this.canvasWidth();

			this.drawColumn(angle, columnPos);
		}
	}

	drawColumn(angle: number, x: number): void {
		const dist = this.world.sendRay(this.world.getPlayerX(), this.world.getPlayerY(), this.world.playerRotation + angle);
		const height = this.calculateWallHeight(dist);

		const center = this.canvasHeight() / 2;

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

    canvasWidth(): number {
        return this.context.canvas.width;
    }

    canvasHeight(): number {
        return this.context.canvas.height;
    }

	calculateWallHeight(dist: number): number {
		if (dist == -1) return 0;

		const height = 1000 - dist  // Math.pow(dist / 800, 10) / 20;

		return Math.min(height, this.canvasHeight());
	}
}