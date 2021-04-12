
export default abstract class GameBase {
    public width: number
    public height: number
    protected context: CanvasRenderingContext2D
    private lastUpdate = 0

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        this.start();
    }

    public start() {
        let canvas: HTMLCanvasElement = document.createElement("canvas")
        canvas.width = this.width
        canvas.height = this.height
        document.body.insertBefore(canvas, document.body.childNodes[0])

        let context = canvas.getContext("2d")
        if (!context) {
            throw new Error
        }

        this.context = context
        this.lastUpdate = Date.now()
        //requestAnimationFrame(() => this.loop())
        setInterval(() => this.loop(), 0)
    }

    public loop() {
        let currentTime = Date.now()
        let deltaTime = currentTime - this.lastUpdate
        this.lastUpdate = currentTime

        this.update(deltaTime)
        this.draw()

        //requestAnimationFrame(() => this.loop())
    }

    public abstract update(deltaTime: number): void;

    public abstract draw(): void;
}

