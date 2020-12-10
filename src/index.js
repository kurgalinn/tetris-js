import {Tetris} from "./tetris.js";
import {CanvasRenderer} from "./renderers.js";

const canvas = document.getElementById("tetris-canvas");
const title = document.getElementById("tetris-title");
new Tetris(new CanvasRenderer(canvas, title));

window.startConsoleTetris = () => {
    document.body.innerHTML = '';
    new Tetris();
}