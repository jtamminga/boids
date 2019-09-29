import Point from "./point";
import Vector from "./vector";

export const Pi2 = Math.PI * 2
export const SingleDegree = 180 / Math.PI

/**
 * Calculate a point along an arc
 */
export function arcPoint(direction: number, x: number, y: number, radius: number): Point {
    return new Point(
        x + (radius * Math.cos(direction)),
        y + (radius * Math.sin(direction))
    )
}

/**
 * Shortest distance (radians) between two angles.
 * It will be in range [0, Pi].
 */
export function angleDiff(alpha: number, beta: number): number {
    let phi = Math.abs(beta - alpha) % (2 * Math.PI)
    let distance = phi > Math.PI ? (2 * Math.PI) - phi : phi
    return distance
}

/**
 * Calculate the angle between two points
 * It will be in range [0, 2Pi]
 */
export function angle(a: Point, b: Point): number {
    let pOrigin = a.diff(b)
    let x = Math.atan2(pOrigin.y, pOrigin.x)
    return (x > 0 ? x : (2 * Math.PI + x))
}

export function angleWithin(a: number, b: number, epsilon: number): boolean {
    return angleDiff(a, b) < epsilon
}

export interface InterpFunc {
    (t: number, s: number, e: number): number
}

/**
 * Ease in out cubic function
 * @param t percentage finished (value from 0 to 1)
 * @param s start value
 * @param e end value
 */
export function easeInOutCubic(t: number, s: number, e: number): number {
    if (t / 2 < 0.5) return e + (s - e) * Math.pow(1 - t, 2)
    return s + (e - s) * t * t
}

export function clamp(cur: number, min: number, max: number): number {
    return Math.min(Math.max(cur, min), max)
}

export function toDegrees(radians: number): number {
    return radians * (180 / Math.PI)
}

export function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180) 
}

// Vector GetClosetPoint(Vector A, Vector B, Vector P, bool segmentClamp)
// {
//     Vector AP = P - A:
//     Vector AB = B - A;
//     float ab2 = AB.x * AB.x + AB.y * AB.y;
//     float ap_ab = AP.x * AB.x + AP.y * AB.y;
//     float t = ap_ab / ab2;
//     if (segmentClamp) {
//         if (t < 0.0f) t = 0.0f;
//          else if (t > 1.0f) t = 1.0f;
//     }
//     Vector Closest = A + AB * t;
//     return Closest;
// }

/**
 * Find the closest point on a line going through A & B to point P
 * @param p Point p, find closes point on line to this point
 * @param a Start of line
 * @param b End of line
 * @param segmentClamp Clamp to the line to A & B
 */
export function closestPointLine(p: Point, a: Point, b: Point, segmentClamp: boolean = true): Point {
    let ap = p.diff(a)
    let ab = b.diff(a)
    let ab2 = ab.x * ab.x + ab.y * ab.y
    let apab = ap.x * ab.x + ap.y * ab.y
    let t = apab / ab2
    if (segmentClamp) {
        if (t < 0) t = 0
        else if (t > 1) t = 1
    }
    return ab.mult(t).add(a)
}

export function min(arr: number[]): number {
    return arr.reduce((min, i) => i < min ? i : min)
}