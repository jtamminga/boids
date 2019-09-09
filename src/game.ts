import Boid from './boid'
import Fov from './fov';
import Point from './point';
import { toRadians } from './utils';

let canvas = <HTMLCanvasElement> document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export const BOID_SPEED = 0.03 // 0.01
const NUM_BOIDS = 50
let boids: Boid[] = []

for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(generateBoid())
}

// specific senerio
// boids.push(new Boid(new Point(200, 400), BOID_SPEED, Math.PI * 7/4))
// boids.push(new Boid(new Point(300, 400), BOID_SPEED, Math.PI * 5/4))
// boids.push(new Boid(new Point(100, 100), 0.01, toRadians(45)))

let preTime = 0
let frameCount = 0
function step(time: number) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let state: GameState = {
        delta: time - preTime,
        context,
        boids
    }

    for (let i = 0; i < boids.length; i++) {
        boids[i].update(state)
        boids[i].render(state)
    }

    /*if (frameCount < 300)*/ window.requestAnimationFrame(step)
    
    preTime = time
    frameCount++
}

window.requestAnimationFrame(step)

//
// Events
//

// window.addEventListener("keydown", e => {
//     preTime = 0
//     step(50)
// })

//
// functions
// 

function generateBoid(): Boid {
    return new Boid(
        Point.random(canvas.width, canvas.height),
        BOID_SPEED,
        Math.random() * (Math.PI * 2)
    )
}

//
// interfaces
//

export interface GameState {
    readonly delta: number
    readonly context: CanvasRenderingContext2D
    readonly boids: Boid[]
}

export interface Renderable {
    render: (state: GameState) => void
}

export interface Vision {
    readonly fov: Fov
}

export interface Clonable<T> {
    clone: () => T
}