export class Display {
    canvas;
    ctx;
    options;
    maxWidth;
    maxHeight;
    xOffset;
    yOffset;
    xScale;
    yScale;
    fps;
    tickCount;
    backgroundColor;
    children;
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.options = options;
        this.maxWidth = canvas.width;
        this.maxHeight = canvas.height;
        this.xOffset = 0;
        this.yOffset = 0;
        this.xScale = 1;
        this.yScale = 1;
        this.fps = 10;
        this.tickCount = 0;
        this.backgroundColor = "#000000";
        this.children = [];
        if (options) {
            if (options.fullScreen === true) {
                document.body.style.margin = "0";
                document.body.style.padding = "0";
                this.canvas.style.position = "absolute";
                this.canvas.style.top = "0";
                this.canvas.style.left = "0";
                this.maxWidth = window.innerWidth;
                this.maxHeight = window.innerHeight;
            }
            if (options.backgroundColor) {
                if (typeof options.backgroundColor === "string") {
                    this.backgroundColor = options.backgroundColor;
                }
            }
            if (options.fps) {
                if (typeof options.fps === "number") {
                    this.fps = options.fps;
                }
                else {
                    console.warn("The fps option must be a number, defaulting to 10fps");
                }
            }
        }
        this.InitCanvas();
        this.tick();
    }
    InitCanvas() {
        this.ctx.clearRect(0, 0, this.maxWidth, this.maxHeight);
        this.canvas.width = this.maxWidth;
        this.canvas.height = this.maxHeight;
    }
    setZoom(scaleX, scaleY) {
        this.xScale = scaleX;
        this.yScale = scaleY;
    }
    resetZoom() {
        this.xScale = 1;
        this.yScale = 1;
    }
    addChild(child) {
        this.children.push(child);
    }
    render() {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.ctx = this.ctx;
            child.render();
        }
    }
    tick() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.maxWidth, this.maxHeight);
        this.render();
        setTimeout(() => {
            this.tickCount++;
            this.tick();
        }, 1000 / this.fps);
    }
}
export class DisplayObject {
    x;
    y;
    width;
    height;
    bgColor;
    borderRadius;
    ctx;
    mouseX;
    mouseY;
    mouseDown;
    mouseOver;
    onObjRender;
    onObjMouseOver;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bgColor = "#ff0000";
        this.borderRadius = 0;
        document.body.onclick = this.#clickEvent;
    }
    #clickEvent(e) {
        this.onObjMouseOver(e);
    }
    doRender() {
        return;
    }
    render() {
        this.doRender();
        if (this.onObjRender) {
            this.onObjRender(this);
        }
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    backgroundColor(color) {
        this.bgColor = color;
        return this;
    }
    onRender(callback) {
        this.onObjRender = callback;
        return this;
    }
    onMouseOver(callback) {
        this.onObjMouseOver = callback;
        return this;
    }
}
export class Rect extends DisplayObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    doRender() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
export class Line extends DisplayObject {
    lineWidth;
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.lineWidth = 1;
    }
    doRender() {
        this.ctx.strokeStyle = this.bgColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.width, this.y + this.height);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
        return this;
    }
}
