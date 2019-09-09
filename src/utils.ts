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