export default class World {
    private walls: boolean[][];
    private tileSize: number = 100;

    forward: boolean = false;
    backwards: boolean = false;
    left: boolean = false;
    right: boolean = false;

    private rotation_speed = 0.002;
    private walk_speed = 0.15;

    private playerX = 350;
    private playerY = 650;
    playerRotation: number = Math.PI / 2;

    constructor() {
        this.setUpInputs();
        this.createWalls();
    }

    getPlayerX(): number {
        return this.playerX;
    }

    getPlayerY(): number {
        return this.playerY;
    }

    createWalls(): void {
        this.walls = [
            [true, true, false, true, false, false, true],
            [false, false, false, false, false, false, false],
            [false, false, false, false, true, false, false],
            [true, true, false, false, false, false, false],
            [true, false, false, false, false, true, false],
            [true, false, false, false, false, false, false],
            [true, true, false, false, true, false, false],
        ];
    }

    tileCountX(): number {
        if (!this.walls) return 0;

        return this.walls[0].length;
    }

    tileCountY(): number {
        return this.walls.length;
    }

    /**
     * Checks if a given position is covered by a wall.
     * @param x x coordinate to check.
     * @param y y coordinate to check.
     * @returns true if wall at position.
     */
    isWallAt(x: number, y: number): boolean {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        if (tileX < 0 || tileY < 0 || tileX >= this.tileCountX() || tileY >= this.tileCountY()) {
            return false;
        }

        return this.walls[tileY][tileX];
    }

    /**
     * Sends out a ray from a given position.
     * @param startX X position to send ray from.
     * @param startY Y position to send ray from.
     * @param angle Direction to send the ray.
     * @returns The distance traveled by the ray until it hit a wall. -1 if it did not hit anything.
     */
    sendRay(startX: number, startY: number, angle: number): number {
        const maxRayDist = 1000;
        const rayStep = 1;

        let x = startX;
        let y = startY;
        let dist = 0;

        while (dist < maxRayDist) {
            x -= Math.cos(angle) * rayStep;
            y -= Math.sin(angle) * rayStep;

            dist += rayStep;

            if (this.isWallAt(x, y)) {
                return dist;
            }
        }

        return -1;
    }

    update(deltaTime: number): void {
        if (this.right) this.playerRotation += this.rotation_speed * deltaTime;
        if (this.left) this.playerRotation -= this.rotation_speed * deltaTime;

        if (this.forward) {
            this.playerY -= Math.sin(this.playerRotation) * this.walk_speed * deltaTime;
            this.playerX -= Math.cos(this.playerRotation) * this.walk_speed * deltaTime;
        }
        if (this.backwards) {
            this.playerY += Math.sin(this.playerRotation) * this.walk_speed * deltaTime;
            this.playerX += Math.cos(this.playerRotation) * this.walk_speed * deltaTime;
        }

        console.log("X: " + this.playerX + " Y: " + this.playerY + " R: " + this.playerRotation);
    }

    private setUpInputs() {
        const world = this;
        document.addEventListener('keydown', function (event) {
            switch (event.key) {
                case 'ArrowUp':
                    world.forward = true;
                    break;
                case 'ArrowDown':
                    world.backwards = true;
                    break;
                case 'ArrowLeft':
                    world.left = true;
                    break;
                case 'ArrowRight':
                    world.right = true;
                    break;
            }
        });
        document.addEventListener('keyup', function (event) {
            switch (event.key) {
                case 'ArrowUp':
                    world.forward = false;
                    break;
                case 'ArrowDown':
                    world.backwards = false;
                    break;
                case 'ArrowLeft':
                    world.left = false;
                    break;
                case 'ArrowRight':
                    world.right = false;
                    break;
            }
        });
    }
}
