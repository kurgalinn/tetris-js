export class Tetromino {
    static SCHEMAS = [
        {color: '#FAC458', map: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]},
        {color: '#925BFD', map: [[2, 0, 0], [2, 2, 2], [0, 0, 0]]},
        {color: '#ff4444', map: [[0, 0, 3], [3, 3, 3], [0, 0, 0]]},
        {color: '#ABE667', map: [[4, 4], [4, 4]]},
        {color: '#52FFE9', map: [[0, 5, 5], [5, 5, 0], [0, 0, 0]]},
        {color: '#E649DD', map: [[0, 6, 0], [6, 6, 6], [0, 0, 0]]},
        {color: '#575EFA', map: [[7, 7, 0], [0, 7, 7], [0, 0, 0]]},
    ];

    #color;
    #map;

    constructor(color, map) {
        this.#color = color;
        this.#map = map;
    }

    getMap() {
        return this.#map;
    }

    getColor() {
        return this.#color;
    }

    static create() {
        let schema = Tetromino.SCHEMAS[Math.floor(Math.random() * Tetromino.SCHEMAS.length)];
        return new this(...Object.values(schema));
    }

    rotate() {
        for (let y = 0; y < this.getMap().length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.getMap()[x][y], this.getMap()[y][x]] = [this.getMap()[y][x], this.getMap()[x][y]];
            }
        }
        this.getMap().forEach(row => row.reverse());
    }

    clone() {
        return (new this.constructor(this.getColor(), JSON.parse(JSON.stringify(this.getMap()))));
    }
}