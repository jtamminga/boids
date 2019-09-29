import GameElement from "./element";
import Vector from "./vector";
import { GameState, Vision, BOID_SPEED } from "./game";

export default class Navigator {
    // how often the target gets updated in ms
    private readonly updateFreq: number = 100

    private readonly maxBudget: number = BOID_SPEED

    private element: GameElement & Vision
    private requestors: NavigatorRequestor[]
    private requests: Vector[]

    // testing
    private curTarget: Vector
    private delta: number = 0

    constructor(element: GameElement & Vision, requestors: NavigatorRequestor[]) {
        this.requests = []
        this.element = element
        this.requestors = requestors

        //
        this.curTarget = this.element.vector
    }

    public target(state: GameState): Vector {
        this.delta += state.delta

        if (this.delta > this.updateFreq) {
            this.delta = 0
            this.updateTarget(state)
        }

        return this.curTarget
    }

    private updateTarget(state: GameState): void {
        for (const requestor of this.requestors) {
            this.addRequest(requestor(this.element, state))
        }

        this.curTarget = this.getFinalAcceleration()
    }

    private addRequest(request: Vector): void {
        if (request != null) {
            this.requests.push(request)
        }
    }

    private getFinalAcceleration(): Vector {
        if (this.requests.length == 0) return this.curTarget

        let total = 0
        let finalRequests: Vector[] = [this.element.vector]
        for (const request of this.requests) {
            if (total > this.maxBudget) break

            if (request.speed + total <= this.maxBudget) {
                finalRequests.push(request)
                total += request.speed
            } else {
                let remainder = (request.speed + total) - this.maxBudget
                finalRequests.push(new Vector(request.delta, remainder))
            }
        }

        // Need to do an average but make sure there is a priority.
        // The priority is the order of the array.
        // If the added magnitude goes over n then cut off the rest.
        const result = Vector.mean(finalRequests)
        
        this.requests = []
        return result
    }
}

export interface NavigatorRequestor {
    (element: GameElement & Vision, state: GameState): Vector
}