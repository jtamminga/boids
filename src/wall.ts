import { Renderable, GameState, Avoidable } from "./game";
import Point from "./point";
import GameElement from "./element";

/**
 * Line segment used to block elements
 */
export default class Wall implements Renderable, Avoidable {
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

    distance(element: GameElement): number {
        throw new Error("Method not implemented.");
    }
}