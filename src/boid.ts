import GameElement from "./element";
import { GameState, Vision } from "./game";
import Fov from "./fov";
import { VectorMatchBehaviour, CenteringBehaviour, CollisionBehaviourV2 } from "./behaviours";
import Navigator from "./navigator";
import FlightController from "./flight";
import Point from "./point";

export default class Boid extends GameElement implements Vision {
    private navigator: Navigator
    private flight: FlightController
    private debugRendering: boolean = false

    readonly length: number = 15
    readonly width: number = 10
    readonly fov: Fov

    constructor(pos: Point, speed: number = 0, direction: number = 0) {
        super(pos, speed, direction)
        this.fov = new Fov(this, Math.PI * (3/4), 60)

        const behaviours = [
            CollisionBehaviourV2,
            VectorMatchBehaviour,
            CenteringBehaviour
        ]

        this.navigator = new Navigator(this, behaviours)
        this.flight = new FlightController(this)
    }

    update(state: GameState): void {
        super.update(state)
        this.environmentLoop(state)
        this.fov.update(state)

        this.flight.update(this.navigator.target(state), state)
    }

    /**
     * If a boid gets to the edge of the environment,
     * then loop to the opposite side (with padding)
     */
    environmentLoop(state: GameState) {
        const { width, height } = state.context.canvas

        if (this.pos.x > width + this.length) this.pos.x = -this.length
        if (this.pos.x < 0 - this.length) this.pos.x = width + this.length
        if (this.pos.y > height + this.length) this.pos.y = -this.length
        if (this.pos.y < 0 - this.length) this.pos.y = height + this.length
    }

    render(state: GameState) {
        const { context } = state

        if (this.debugRendering) {
            this.fov.render(state)
            this.flight.render(state)
        }

        context.fillStyle = 'orange'

        context.translate(this.pos.x, this.pos.y)
        context.rotate(this.vector.angle)

        // triangle path
        context.beginPath()
        context.moveTo(0 - 5, -this.width / 2)
        context.lineTo(this.length - 5, 0)
        context.lineTo(0 - 5, this.width / 2)
        context.closePath()
        context.fill()

        context.rotate(-this.vector.angle)
        context.translate(-this.pos.x, -this.pos.y)
    }
}