import { GameState, Renderable } from "./game";
import Point from "./point";
import Vector from "./vector";

/**
 * Basic game element with position and velocity
 */
export default abstract class GameElement implements Renderable {
    public pos: Point
    public vector: Vector

    constructor(pos: Point, speed: number = 0, direction: number = 0) {
        this.pos = pos
        this.vector = new Vector(direction, speed)
    }

    update(state: GameState) {
        this.pos.update(this.vector, state.delta)
    }

    abstract render(state: GameState): void
}