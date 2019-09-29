import { Renderable, GameState, DEBUG_MODE, Vision, Avoidable, BOID_SPEED } from "./game";
import Point from "./point";
import { closestPointLine, min } from "./utils";
import Segment from "./segment";
import GameElement from "./element";
import Vector from "./vector";

export default class Obsticle implements Renderable, Avoidable {
    private points: Point[]
    private segments: Segment[]

    constructor(points: Point[]) {
        this.points = points
        this.segments = this.generateSegments(points)
    }

    private generateSegments(points: Point[]): Segment[] {
        return points.map((p, i) => {
            let j = i + 1 == points.length ? 0 : i + 1
            return new Segment(points[i], points[j])
        })
    }

    /**
     * Calculate for a given point, the distance to this obsticle, the closest point
     * and the line segments the closest point is apart of
     */
    private calc(point: Point): { closest: Point, distance: number, segments: Segment[] } {
        let closestPoints = this.segments.map(segment =>
            ({ segment, closest: closestPointLine(point, segment.a, segment.b) }))

        let distance: number = Number.MAX_VALUE
        let closest: Point = null
        let segments: Segment[] = []

        for (const p of closestPoints) {
            let dist = point.distance(p.closest)
            if (dist < distance) {
                distance = dist
                closest = p.closest
                segments = [p.segment]
            } else if (dist == distance) {
                segments.push(p.segment)
            }
        }

        return { closest, distance, segments }
    }

    closestPoint(point: Point): Point {
        return this.calc(point).closest
    }

    distance(element: GameElement): number {
        return this.calc(element.pos).distance
    }

    force(element: GameElement & Vision): Vector {
        let { closest, distance, segments } = this.calc(element.pos)
        let mult = 1 - (distance / (element.fov.range * 1.3))
        return Vector.mean(segments.map(s => s.vector)).mult(BOID_SPEED * mult)
    }

    render({ context }: GameState) {
        context.strokeStyle = 'white'
        context.fillStyle = '#444'

        context.beginPath()
        for (const point of this.points) {
            context.lineTo(point.x, point.y)
        }
        context.closePath()
        context.fill()
        context.stroke()

        if (DEBUG_MODE) {
            context.strokeStyle = 'green'
            for (const seg of this.segments) {
                context.beginPath()
                let mid = seg.midPoint
                let vec = seg.vector.mult(20)
                let end = mid.apply(vec)
                context.moveTo(mid.x, mid.y)
                context.lineTo(end.x, end.y)
                context.stroke()
            }
        }
    }
}