import Boid from './boid'
import Fov from './fov';
import Point from './point';
import { toRadians } from './utils';
import GameElement from './element';
import Editor from './editor';
import Obsticle from './obsticle';

export const DEBUG_MODE = false
export const BOID_SPEED = 0.08 // 0.08 pree good
const NUM_BOIDS = 50 // 50 nice

const canvas = <HTMLCanvasElement> document.getElementById('game-canvas')
const context = canvas.getContext('2d')

let boids: Boid[] = []
let obsticles: Obsticle[] = []

const editor = new Editor(obs => obsticles.push(obs))

for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(generateBoid())
}

// specific senerio
// boids.push(new Boid(new Point(100, 150), BOID_SPEED, toRadians(0)))

let preTime = 0
let running = true

function step(time: number) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let state: GameState = {
        delta: time - preTime,
        context,
        boids,
        obsticles
    }

    for (let i = 0; i < boids.length; i++) {
        boids[i].update(state)
        boids[i].render(state)
    }

    for (let i = 0; i < obsticles.length; i++) {
        obsticles[i].render(state)
    }

    editor.render(state)

    if (running) window.requestAnimationFrame(step)
    
    preTime = time
}

window.requestAnimationFrame(step)

//
// Events
//

window.addEventListener("keydown", e => {
    // preTime = 0
    // step(50)
    // window.requestAnimationFrame(step)
    if (e.keyCode == 32) running = false
})

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
    readonly obsticles: Obsticle[]
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

export interface Avoidable {
    distance(element: GameElement): number
}