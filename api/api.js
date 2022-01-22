import { Error } from "./Console.js";
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
    deviceType;
    scenes;
    currentScene;
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
        this.scenes = [];
        this.currentScene = -1;
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
                else if (options.fps === "adaptive") {
                    this.fps = options.fps;
                }
                else {
                    console.warn("fps must be a number or 'adaptive', defaulting to 10");
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
        this.deviceType =
            "ontouchstart" in document.documentElement &&
                navigator.userAgent.match(/Mobi/)
                ? "mobile"
                : "desktop";
    }
    setZoom(scaleX, scaleY) {
        this.xScale = scaleX;
        this.yScale = scaleY;
    }
    setXOffset(x) {
        this.xOffset = x;
        return this;
    }
    setYOffset(y) {
        this.yOffset = y;
        return this;
    }
    resetZoom() {
        this.xScale = 1;
        this.yScale = 1;
    }
    addChild(child, layer) {
        this.children.push({
            obj: child,
            layer: layer ? layer : 1,
        });
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
        if (this.currentScene === -1) {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "2em Arial";
            this.ctx.fillText("No Scene Loaded", this.maxWidth / 2 - this.ctx.measureText("No Scene Loaded").width / 2, this.maxHeight / 2);
        }
        this.render();
        if (this.fps === "adaptive") {
            requestAnimationFrame(() => {
                this.tickCount++;
                this.tick();
            });
        }
        else {
            setTimeout(() => {
                this.tickCount++;
                this.tick();
            }, 1000 / this.fps);
        }
    }
    newScene(name) { }
}
class DisplayScene {
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
    onObjClick;
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
        this.onObjRender = [];
    }
    #clickEvent(e) {
        for (let i = 0; i < this.onObjMouseOver.length; i++) {
            this.onObjMouseOver[i](e);
        }
    }
    //null function to be overwritten by child classes
    doRender() {
        return Error("The doRender function must be overwritten by child classes, This is a template class.");
    }
    render() {
        this.doRender();
        if (this.onObjRender) {
            for (let i = 0; i < this.onObjRender.length; i++) {
                this.onObjRender[i](this);
            }
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
        this.onObjRender.push(callback);
        return this;
    }
    onMouseOver(callback) {
        this.onObjMouseOver.push(callback);
        return this;
    }
    onEvent(event, callback) {
        this.onObjClick.push(callback);
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
    }
    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
        return this;
    }
}