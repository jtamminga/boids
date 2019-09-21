import Vector from "./vector";
import GameElement from "./element";
import Point from "./point";
import { NavigatorRequestor } from "./navigator";
import { GameState, Vision, BOID_SPEED } from "./game";
import Wall from "./wall";
import { angleDiff } from "./utils";

/**
 * Collision Behaviour V1
 * This strategy is looking directly ahead within vision range
 * and checking that the path is clear.
 * It also checks to make sure no one else is within its bubble
 */
export const CollisionBehaviour: NavigatorRequestor =
    (element: GameElement & Vision, state: GameState): Vector => {

    if (element.fov.elements.length == 0) return element.vector

    const heading = preventHeadingCollision(element)

    let vectors: Vector[] = [heading]
    for (const e of element.fov.elements) {
        if (element.pos.distance(e.pos) < element.fov.bubble * 2) {
            let v = new Vector(e.pos.diff(element.pos).mult(-1), BOID_SPEED)
            vectors.push(v)
        }
    }

    return Vector.mean(vectors)
}

/**
 * Collision Behaviour V2
 * This version simplifies the behaviour by onlying making sure
 * other elements don't go within the bubble.
 */
export const CollisionBehaviourV2: NavigatorRequestor =
    (element: GameElement & Vision, state: GameState): Vector => {

    if (element.fov.elements.length == 0 && element.fov.obsticals.length == 0)
        return element.vector.clone()

    let vectors: Vector[] = []
    for (const e of element.fov.elements) {
        if (element.pos.distance(e.pos) < element.fov.bubble * 2) {
            let v = new Vector(e.pos.diff(element.pos).mult(-1), BOID_SPEED)
            vectors.push(v)
        }
    }

    for (const ob of element.fov.obsticals) {
        let reflected = element.vector.reflect(ob)
        let v = new Vector(reflected.delta.add(element.vector.delta), BOID_SPEED)
        vectors.push(v)
    }

    if (vectors.length == 0) return element.vector.clone()
    return Vector.mean(vectors)
}

/**
 * Vector Matching V1
 * Get all elements within the field of view and calculate the average velocity.
 * TODO: Still need to add in weighted averages based on the the distance.
 */
export const VectorMatchBehaviour: NavigatorRequestor =
    (element: GameElement & Vision, state: GameState): Vector => {

    if (element.fov.elements.length == 0) return element.vector

    let vectors = element.fov.elements.map(e => e.vector)
    let vectorMatch = Vector.mean(vectors)

    return vectorMatch
}

/**
 * Centering V1
 * Get all elements within the field of view and do a weighted average
 * based on the distance. Calculate a vector to head to wards each element.
 * TODO: Maybe need to head towards "center of mass" *shrug
 */
export const CenteringBehaviour: NavigatorRequestor =
    (element: GameElement & Vision, state: GameState): Vector => {
    
    if (element.fov.elements.length == 0) return element.vector

    let vectors = element.fov.elements.map(e => {
        let dir = e.pos.diff(element.pos)
        // str based on inverse of distance
        let str = 1 - (dir.distance() / element.fov.range)
        return new Vector(e.pos.diff(element.pos), str * BOID_SPEED)
    })

    return Vector.mean(vectors)
}

//
// Helpers
//

export function preventHeadingCollision(element: GameElement & Vision): Vector {
    const angleStep = 0.0873 // ~5 degrees

    // random values causing sparatic/twitching motion
    // boid will need some 'momentum' so if moving in a direction
    // will make the boid tend in the direction more often
    // const startSign = Math.random() > 0.5 ? 1 : -1
    const startSign = 1
    let curAngle = element.vector.angle
    let curVec = element.vector.clone()


    for (let i = 1; i < 20; i++) {
        let willHit = element.fov.elements.some(other =>
            collision(element.pos, curVec, other.pos, 20))

        if (willHit) {
            let newAngle = curAngle + (Math.ceil(i / 2) * angleStep * (i % 2 == 0 ? startSign : -startSign))
            curVec.angle = newAngle
        } else {
            break
        }
    }

    return curVec
}

export function collision(aPos: Point, aVec: Vector, b: Point, padding: number = 0.01): boolean {
    let t = (aVec.unit.x * (b.x - aPos.x)) +
        (aVec.unit.y * (b.y - aPos.y))

    let e = new Point(
        t * aVec.unit.x + aPos.x,
        t * aVec.unit.y + aPos.y
    )    

    return e.distance(b) <= padding
}

function preventWallCollision(element: GameElement, wall: Wall): Vector {
    

    return null
}