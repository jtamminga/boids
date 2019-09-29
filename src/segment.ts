import Point from "./point";
import { closestPointLine } from "./utils";
import Vector from "./vector";

/**
 * Line segment
 */
export default class Segment {
    a: Point
    b: Point
    vector: Vector

    constructor(a: Point, b: Point) {
        this.a = a
        this.b = b
        this.vector = this.calcVector(a, b)
    }

    private calcVector(a: Point, b: Point): Vector {
        return new Vector(a.diff(b)).normal.rotate(Math.PI / 2)
    }

    public get midPoint(): Point {
        return this.a.add(this.b).div(2)
    }

    closestTo(point: Point): Point {
        return closestPointLine(point, this.a, this.b)
    }
}