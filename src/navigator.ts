import GameElement from "./element";
import Vector from "./vector";
import { GameState, Vision } from "./game";

export default class Navigator {
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

    target(state: GameState): Vector {
        this.delta += state.delta

        if (this.delta > 100) {
            this.delta = 0
            
            for (const requestor of this.requestors) {
                this.accelerationRequest(requestor(this.element, state))
            }

            this.curTarget = this.getFinalAcceleration()
        }

        return this.curTarget
    }

    private accelerationRequest(acc: Vector): void {
        this.requests.push(acc)
    }

    private getFinalAcceleration(): Vector {
        if (this.requests.length == 0) return this.curTarget

        // Need to do an average but make sure there is a priority.
        // The priority is the order of the array.
        // If the added magnitude goes over n then cut off the rest.
        const result = Vector.mean(this.requests)
        
        this.requests = []
        return result
    }
}

export interface NavigatorRequestor {
    (element: GameElement & Vision, state: GameState): Vector
}