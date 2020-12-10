export class ConsoleRenderer {
    static EMPTY_STYLE = `background: black;
                          padding: 5px 8px;
                          margin-top: -15px;
                          border: 1px solid black;`
    static FILL_STYLE = `background: #COLOR#;
                         padding: 5px 8px;
                         margin-top: -15px;
                         border-radius: 2px;
                         border: 1px solid;`

    static render(field, schemas, title) {
        console.clear();
        console.group(title);
        field.getMap().forEach((row, i) => {
            let line = "";
            let styles = []
            row.forEach((value, j) => {
                if (value > 0) {
                    styles[j] = this.FILL_STYLE.replace('#COLOR#', schemas[value - 1].color);
                } else {
                    styles[j] = this.EMPTY_STYLE;
                }
                line += "%c "
            });
            line += "%c" + (i % 2 ? "" : " ");
            styles.push("display: none;");
            console.log(line, ...styles);
        });
        console.groupEnd();
    }
}

export class CanvasRenderer {

    static BACKGROUND = 'black';
    static BLOCK = {
        SIZE: 30,
        BORDER: 1
    };

    #ctx;
    #title;

    constructor(canvas, title) {
        this.#title = title;
        this.#ctx = canvas.getContext("2d");
        this.#ctx.canvas.style.background = CanvasRenderer.BACKGROUND;
        this.#ctx.scale(CanvasRenderer.BLOCK.SIZE, CanvasRenderer.BLOCK.SIZE);
    }

    render(field, schemas, title) {
        const blockSize = CanvasRenderer.BLOCK.SIZE;
        this.#title.innerText = title;
        this.#ctx.canvas.width = field.getCols() * blockSize;
        this.#ctx.canvas.height = field.getRows() * blockSize;
        field.getMap().forEach((row, i) => {
            row.forEach((value, j) => {
                if (value > 0) {
                    const x = j * blockSize;
                    const y = i * blockSize;
                    this.#fillRectBorder(x, y, blockSize, blockSize);
                    this.#fillRect(x, y, blockSize, blockSize, schemas[value - 1].color);
                }
            });
        });
    }

    #fillRectBorder(x, y, w, h) {
        const border = CanvasRenderer.BLOCK.BORDER;
        const size = CanvasRenderer.BLOCK.SIZE + border;
        this.#ctx.fillStyle = 'white';
        this.#ctx.fillRect(x, y, size, size);
    }

    #fillRect(x, y, w, h, color) {
        const border = CanvasRenderer.BLOCK.BORDER;
        const size = CanvasRenderer.BLOCK.SIZE - border;
        this.#ctx.fillStyle = color;
        this.#ctx.fillRect(
            x + border,
            y + border,
            size,
            size
        );
    }
}