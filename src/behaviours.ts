import Vector from "./vector";
import GameElement from "./element";
import { NavigatorRequestor } from "./navigator";
import { Vision, BOID_SPEED } from "./game";

export const ObsAvoidanceBehaviour: NavigatorRequestor =
    (element: GameElement & Vision): Vector => {

    if (element.fov.obsticals.length == 0)
        return null
    
    let vectors: Vector[] = []
    for (const ob of element.fov.obsticals) {
        vectors.push(ob.force(element))
    }

    return Vector.mean(vectors)
}

/**
 * Collision Behaviour V2
 * This version simplifies the behaviour by onlying making sure
 * other elements don't go within the bubble.
 */
export const CollisionBehaviourV2: NavigatorRequestor =
    (element: GameElement & Vision): Vector => {

    if (element.fov.elements.length == 0)
        return null

    let vectors: Vector[] = []
    for (const e of element.fov.elements) {
        if (element.pos.distance(e.pos) < element.fov.bubble * 2) {
            let v = new Vector(e.pos.diff(element.pos).mult(-1), BOID_SPEED)
            vectors.push(v)
        }
    }

    if (vectors.length == 0)
        return null

    return Vector.mean(vectors)
}

/**
 * Vector Matching V1
 * Get all elements within the field of view and calculate the average velocity.
 * TODO: Still need to add in weighted averages based on the the distance.
 */
export const VectorMatchBehaviour: NavigatorRequestor =
    (element: GameElement & Vision): Vector => {

    if (element.fov.elements.length == 0)
        return null

    let vectors = element.fov.elements.map(e => {
        let str = 1 - (e.pos.distance(element.pos) / element.fov.range)
        return e.vector.mult(str)
    })

    return Vector.mean(vectors)
}

/**
 * Centering V1
 * Get all elements within the field of view and do a weighted average
 * based on the distance. Calculate a vector to head to wards each element.
 * TODO: Maybe need to head towards "center of mass" *shrug
 */
export const CenteringBehaviour: NavigatorRequestor =
    (element: GameElement & Vision): Vector => {
    
    if (element.fov.elements.length == 0) return null

    let vectors = element.fov.elements.map(e => {
        let dir = e.pos.diff(element.pos)
        let str = 1 - (dir.distance() / element.fov.range)
        return new Vector(dir, str * BOID_SPEED)
    })

    return Vector.mean(vectors)
}