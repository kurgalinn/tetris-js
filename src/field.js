export class Field {
    #rows;
    #cols;
    #map;

    constructor(rows = 20, cols = 10) {
        this.#rows = rows;
        this.#cols = cols;
        this.reset();
    }

    getRows() {
        return this.#rows;
    }

    getCols() {
        return this.#cols;
    }

    getMap() {
        return this.#map;
    }

    add(tetromino, coords) {
        tetromino.getMap().forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.#map[coords.y + y][coords.x + x] = value;
                }
            });
        });
        return this;
    }

    reset() {
        this.#map = Array.from(
            {length: this.#rows}, () => Array(this.#cols).fill(0)
        );
        return this;
    }

    merge(field) {
        if (field.getRows() !== this.getRows() || field.getCols() !== this.getCols()) {
            throw new Error("Can't merge fields of different size.");
        }

        this.#map = this.#map.map((row, x) => {
            return row.map((value, y) => {
                return value ? value : field.getMap()[x][y];
            });
        });
    }

    clone() {
        return (new this.constructor(this.getRows(), this.getCols())).#setMap(this.getMap());
    }

    #setMap(map) {
        this.#map = map;
        return this;
    }
}