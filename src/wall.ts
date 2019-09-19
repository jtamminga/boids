import { Renderable, GameState, Avoidable } from "./game";
import Point from "./point";
import GameElement from "./element";
import { closestPointLine } from "./utils";

/**
 * Line segment used to block elements
 */
export default class Wall implements Renderable {
    a: Point
    b: Point

    constructor(a: Point, b: Point) {
        this.a = a
        this.b = b
    }

    render({ context }: GameState): void {
        context.strokeStyle = 'white'

        context.beginPath()
        context.moveTo(this.a.x, this.a.y)
        context.lineTo(this.b.x, this.b.y)
        context.stroke()
    }

    closestTo(element: GameElement): Point {
        return closestPointLine(element.pos, this.a, this.b)
    }
}