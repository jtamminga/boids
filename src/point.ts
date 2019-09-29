import Vector from "./vector";
import { Clonable } from "./game";

export default class Point implements Clonable<Point> {
    x: number
    y: number

    static readonly ZERO: Point = new Point(0, 0)

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * Angle of line from origin (0,0)
     * Returns angle between [0, 2π]
     */
    public get angle(): number {
        let a = Math.atan2(this.y, this.x)
        return (a >= 0 ? a : (2 * Math.PI + a))
    }

    distance({ x, y }: Point = Point.ZERO): number {
        return Math.sqrt(
            Math.pow(x - this.x, 2) +
            Math.pow(y - this.y, 2)
        )
    }

    //#region Operators

    add({ x, y }: Point): Point {
        return new Point(this.x + x, this.y + y)
    }

    diff({ x, y }: Point): Point {
        return new Point(this.x - x, this.y - y)
    }

    mult(n: number): Point {
        return new Point(this.x * n, this.y * n)
    }

    div(n: number): Point {
        return new Point(this.x / n, this.y / n)
    }

    //#endregion

    /**
     * Update a position based on the specified vector
     * @param vector The vector to apply to the position
     * @param delta The time in milliseconds between frames
     */
    update(vector: Vector, delta: number = 1): void {
        this.x += vector.delta.x * delta
        this.y += vector.delta.y * delta
    }

    apply({ delta}: Vector): Point {
        return new Point(this.x + delta.x, this.y + delta.y)
    }

    toVector(): Vector {
        return new Vector(this)
    }

    clone(): Point {
        return new Point(this.x, this.y)
    }

    static random(maxX: number, maxY: number): Point {
        return new Point(
            Math.random() * maxX,
            Math.random() * maxY
        )
    }
}