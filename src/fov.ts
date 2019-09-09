import GameElement from "./element";
import { Renderable, GameState } from "./game";
import { arcPoint, angleDiff, angle } from "./utils";

export default class Fov implements Renderable {
    private angle: number
    readonly range: number
    readonly bubble: number = 20
    private element: GameElement
    private elementsFov: GameElement[]

    constructor(element: GameElement, angle: number, range: number) {
        this.element = element
        this.angle = angle
        this.range = range
        this.elementsFov = []
    }

    /**
     * Get elements within field of view
     */
    public get elements() : GameElement[] {
        return this.elementsFov
    }
    
    update(state: GameState) {
        this.elementsFov = this.inLineOfSight(state.boids)
    }

    render(state: GameState) {
        const { x, y } = this.element.pos
        const { context } = state

        context.strokeStyle = 'grey'

        context.beginPath()
        context.arc(x, y, this.range,
            this.element.vector.angle - this.angle, this.element.vector.angle + this.angle)
        context.moveTo(x, y)

        let p1 = arcPoint(this.element.vector.angle + this.angle, x, y, this.range)
        let p2 = arcPoint(this.element.vector.angle - this.angle, x, y, this.range)

        context.lineTo(p1.x, p1.y)
        context.moveTo(x, y)
        context.lineTo(p2.x, p2.y)
        context.stroke()

        this.renderLos(state)
        this.renderBubble(state)
    }

    /**
     * Render the line of sights
     */
    renderLos({ context }: GameState): void {
        context.strokeStyle = 'red'
        for (let i = 0; i < this.elementsFov.length; i++) {
            context.beginPath()
            context.moveTo(this.element.pos.x, this.element.pos.y)
            context.lineTo(this.elementsFov[i].pos.x, this.elementsFov[i].pos.y)
            context.stroke()
        }
    }

    renderBubble({ context}: GameState): void {
        context.strokeStyle = 'rgba(255,255,255,0.2)'
        context.beginPath()
        context.arc(this.element.pos.x, this.element.pos.y,
            this.bubble, 0, Math.PI * 2, true)
        context.stroke()
    }

    /**
     * Determine which elements are in line of sight
     */
    private inLineOfSight(elements: GameElement[]): GameElement[] {
        return elements.filter(element => element != this.element &&
            this.element.pos.distance(element.pos) <= this.range &&
            angleDiff(this.element.vector.angle, angle(element.pos, this.element.pos)) < this.angle)
    }
}