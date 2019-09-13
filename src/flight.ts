import GameElement from "./element";
import { GameState, Renderable, BOID_SPEED } from "./game";
import Vector from "./vector";
import { angleDiff, clamp } from "./utils";

export default class FlightController implements Renderable {
    private element: GameElement
    private start: Vector
    private target: Vector
    private targeting: boolean = false

    private delta: number = 0
    private duration: number = 400

    constructor(element: GameElement) {
        this.element = element
        this.target = this.element.vector
    }

    update(newTarget: Vector, state: GameState): void {
        // if target is not similar
        if (!newTarget.similar(this.target)) {
            this.start = this.element.vector
            this.target = newTarget
            this.targeting = true
            this.delta = 0
        }

        if (this.targeting) {
            let t = this.delta / this.duration
            this.delta += state.delta

            this.element.vector = Vector.interp(this.start, this.target, t)

            // trying a clamp
            this.element.vector.speed = clamp(
                this.element.vector.speed,
                BOID_SPEED - (BOID_SPEED * 0.1),
                BOID_SPEED
            )

            if (this.delta > this.duration) {
                this.element.vector = this.target.clone()
                this.targeting = false
                this.delta = 0
            }
        }
    }

    render({ context }: GameState): void {
        const { x, y } = this.element.pos
        const { unit } = this.target

        context.strokeStyle = 'white'
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x + unit.x * 30, y + unit.y * 30)
        context.stroke()
    }
}