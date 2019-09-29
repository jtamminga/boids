import { Renderable, GameState } from "./game";
import Point from "./point";
import Obsticle from "./obsticle";

type OnCreateCallback = (obs: Obsticle) => void

export default class Editor implements Renderable {
    onCreate: OnCreateCallback
    pointBuffer: Point[] = []

    constructor(onCreate: OnCreateCallback) {
        this.onCreate = onCreate
        window.addEventListener("mousedown", this.onClick)
        window.addEventListener("keyup", this.onKeyUp)
    }

    onClick = (e: MouseEvent) => {
        if (e.ctrlKey) {
            this.pointBuffer.push(new Point(e.offsetX - 5, e.offsetY - 5))
        }
    }

    onKeyUp = (e: KeyboardEvent) => {       
        if (e.keyCode == 17 && this.pointBuffer.length > 2) {
            let obs = new Obsticle(this.pointBuffer)
            this.pointBuffer = []
            this.onCreate(obs)
        }
    }

    render({ context }: GameState): void {
        context.fillStyle = 'white'
        for (const { x, y } of this.pointBuffer) {
            context.fillRect(x, y, 3, 3)
        }
    }
}