import Point from "./point";
import { Clonable } from "./game";
import { angleWithin, InterpFunc, easeInOutCubic } from "./utils";

export default class Vector implements Clonable<Vector> {
    public delta: Point

    /**
     * Create a new instance of a vector
     * @param v A point vector (from (0,0)) or angle (in radians)
     * @param speed The speed/magnitude of the vector
     */
    constructor(v: Point | number, speed?: number) {
        if (typeof v === "number") {
            // v is an angle
            this.delta = Point.ZERO.clone()
            this.set(v, speed == null ? 1 : speed)
        } else {
            // v is a point vector (point from (0,0))
            this.delta = v
            if (speed != null) {
                // could just do this: this.speed = speed
                // but the following is more efficient
                let curSpeed = this.speed
                this.delta.x = this.delta.x / curSpeed * speed
                this.delta.y = this.delta.y / curSpeed * speed
            }
        }
    }

    private set(angle: number, speed: number): void {
        this.delta.x = Math.cos(angle) * speed
        this.delta.y = Math.sin(angle) * speed
    }
    
    public get unit(): Point {
        return this.delta.div(this.speed)
    }
    
    public set unit(v : Point) {
        this.delta = v.mult(v.distance())
    }

    public get angle(): number {
        return this.delta.angle
    }
    
    public set angle(v : number) {
        this.set(v, this.speed)
    }

    public get speed(): number {
        return this.delta.distance()
    }

    public set speed(v : number) {
        this.delta = this.unit.mult(v)
    }

    mult(n: number): Vector {
        return new Vector(this.delta.mult(n))
    }

    opposite(): Vector {
        return new Vector(this.delta.mult(-1))
    }

    similar(b: Vector, angleDiff: number = 0.01, speedDiff: number = 0.01): boolean {
        if (b == null) return false
        return angleWithin(this.unit.angle, b.unit.angle, angleDiff) &&
            Math.abs(this.speed - b.speed) < speedDiff
    }

    clone(): Vector {
        return new Vector(this.delta.clone())
    }

    lerp(target: Vector, alpha: number): void {
        this.delta.x = this.delta.x + (target.delta.x - this.delta.x) * alpha
        this.delta.y = this.delta.y + (target.delta.y - this.delta.y) * alpha
    }

    static interp(start: Vector, end: Vector, t: number, interpFunc: InterpFunc = easeInOutCubic): Vector {
        let delta = new Point(
            interpFunc(t, start.delta.x, end.delta.x),
            interpFunc(t, start.delta.y, end.delta.y)
        )

        return new Vector(delta)
    }

    static mean(vectors: Vector[]): Vector {
        let n = vectors.length
        let avg = new Point(0, 0)

        for (const vector of vectors) {
            avg.x += vector.delta.x
            avg.y += vector.delta.y
        }

        avg.x /= n
        avg.y /= n

        return new Vector(avg)
    }
}