import {Field} from "./field.js";
import {Tetromino} from "./tetromino.js";
import {Coords} from "./coords.js";
import {ConsoleRenderer, CanvasRenderer} from "./renderers.js";

export class Tetris {
    static GAME = {
        NAME: "Tetris!",
        SPEED: 800,
        STATUS: {
            STOP: 0,
            ACTIVE: 1,
            PAUSE: 2,
            END: 3,
        }
    }

    static TEXT = {
        START: "Press 'Enter' for start.",
        SCORE: "Your score: #SCORE#",
        RESUME: "Pause! Press 'Enter' for resume.",
        END: "Game Over! Your score: #SCORE#. Press 'Enter' for restart.",
    }

    #renderer;

    #game = {
        status: Tetris.GAME.STATUS.STOP,
        score: 0,
        field: new Field(),
        timerId: 0,
    }

    #round = {
        field: new Field(),
        tetromino: 0,
        coords: 0,
    }

    #controls = {
        game: 0,
        round: 0,
    }

    constructor(renderer = ConsoleRenderer) {
        this.#renderer = renderer;
        this.#startRound();
        this.#setControl("game");
    }

    #startLoop() {
        let self = this;
        this.#game.timerId = setInterval(() => {
            self.#roundActionArrowDown();
            self.#render();
        }, Tetris.GAME.SPEED);
    }

    #stopLoop() {
        clearInterval(this.#game.timerId);
    }

    #startRound() {
        this.#round.tetromino = Tetromino.create();
        this.#round.coords = this.#getStartCoords();
        this.#round.field
            .reset()
            .add(this.#round.tetromino, this.#round.coords);
        this.#render();
    }

    #endRound() {
        this.#game.field.merge(this.#round.field);
        this.#checkLines();
        this.#startRound();
    }

    #gameOver() {
        this.#game.status = Tetris.GAME.STATUS.END;
        this.#stopLoop();
        this.#unsetControl('round');
    }

    #setControl(name) {
        if (typeof this.#controls[name] === "undefined") {
            throw new Error(`Undefined control name ${name}.`);
        }

        this.#controls[name] = event => {
            const action = `#${name}Action${event.code}`;
            if (this.#existMethod(action)) {
                event.preventDefault();
                eval(`this.${action}()`);
                this.#render();
            }
        }
        document.addEventListener('keydown', this.#controls[name]);
    }

    #unsetControl(name) {
        document.removeEventListener('keydown', this.#controls[name]);
    }

    #checkLines() {
        this.#game.field.getMap().forEach((row, y) => {
            if (row.every(value => value > 0)) {
                this.#game.field.getMap().splice(y, 1);
                this.#game.field.getMap().unshift(
                    Array(this.#game.field.getCols()).fill(0)
                );
                this.#game.score += 100;
            }
        });
    }

    #gameActionEnter() {
        switch (this.#game.status) {
            case Tetris.GAME.STATUS.STOP:
            case Tetris.GAME.STATUS.PAUSE:
                this.#game.status = Tetris.GAME.STATUS.ACTIVE;
                this.#setControl("round");
                this.#startLoop();
                break;
            case Tetris.GAME.STATUS.ACTIVE:
                this.#game.status = Tetris.GAME.STATUS.PAUSE;
                this.#unsetControl("round");
                this.#stopLoop();
                break;
            case Tetris.GAME.STATUS.END:
                this.#game.status = Tetris.GAME.STATUS.STOP;
                this.#game.field.reset();
                this.#startRound();
                break;
        }
    }

    #roundActionArrowDown() {
        let coords = {...this.#round.coords};
        ++coords.y;
        if (this.#validAction(coords, this.#round.tetromino)) {
            this.#round.coords = coords;
        } else if (this.#round.coords.y > 0) {
            this.#endRound();
        } else {
            this.#gameOver();
        }
    }

    #roundActionSpace() {
        let coords = {...this.#round.coords};
        while (this.#validAction(coords, this.#round.tetromino)) {
            this.#round.coords.y = coords.y++;
        }
    }

    #roundActionArrowUp() {
        let tetromino = this.#round.tetromino.clone();
        tetromino.rotate();
        if (this.#validAction(this.#round.coords, tetromino)) {
            this.#round.tetromino = tetromino;
        }
    }

    #roundActionArrowRight() {
        let coords = {...this.#round.coords};
        ++coords.x;
        if (this.#validAction(coords, this.#round.tetromino)) {
            this.#round.coords.x = coords.x;
        }
    }

    #roundActionArrowLeft() {
        let coords = {...this.#round.coords};
        --coords.x;
        if (this.#validAction(coords, this.#round.tetromino)) {
            this.#round.coords.x = coords.x;
        }
    }

    #validAction(coords, tetromino) {
        return tetromino.getMap().every((row, tY) => {
            return row.every((value, tX) => {
                let x = coords.x + tX;
                let y = coords.y + tY;
                return (
                    value === 0 ||
                    (this.#isNotBeyondBorders(x) && this.#isAboveFloor(y) && this.#isNotOccupied(y, x))
                );
            });
        });
    }

    #isNotBeyondBorders(x) {
        return x >= 0 && x < this.#game.field.getCols();
    }

    #isAboveFloor(y) {
        return y < this.#game.field.getRows();
    }

    #isNotOccupied(y, x) {
        return this.#game.field.getMap()[y][x] === 0;
    }

    #getStartCoords() {
        let startX = Math.floor(this.#round.field.getCols() / 2) -
            Math.ceil(this.#round.tetromino.getMap().length / 2);
        return new Coords(startX, 0);
    }

    #render() {
        this.#round.field
            .reset()
            .add(this.#round.tetromino, this.#round.coords);
        let field = this.#game.field.clone();
        field.merge(this.#round.field);
        this.#renderer.render(
            field, Tetromino.SCHEMAS, this.#getTitle()
        );
    }

    #getTitle() {
        switch (this.#game.status) {
            case Tetris.GAME.STATUS.ACTIVE:
                return Tetris.TEXT.SCORE.replace("#SCORE#", this.#game.score);
            case Tetris.GAME.STATUS.PAUSE:
                return Tetris.TEXT.RESUME;
            case Tetris.GAME.STATUS.END:
                return Tetris.TEXT.END.replace("#SCORE#", this.#game.score);
            default:
                return Tetris.TEXT.START;
        }

    }

    #existMethod(name) {
        try {
            eval(`this.${name}`);
            return true;
        } catch (e) {
            return false;
        }
    }
}