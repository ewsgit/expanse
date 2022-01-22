import { Error } from "./Console.js";

export class Display {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  options: object;
  maxWidth: number;
  maxHeight: number;
  xOffset: number;
  yOffset: number;
  xScale: number;
  yScale: number;
  fps: number | string;
  tickCount: number;
  backgroundColor: string;
  deviceType: string;
  scenes: DisplayScene[];
  currentScene: number;
  constructor(
    canvas: HTMLCanvasElement,
    options: {
      fps?: number | "adaptive";
      backgroundColor?: string;
      fullScreen?: boolean;
    }
  ) {
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
        } else if (options.fps === "adaptive") {
          this.fps = options.fps;
        } else {
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
  setZoom(scaleX: number, scaleY: number) {
    this.xScale = scaleX;
    this.yScale = scaleY;
  }
  setXOffset(x: number) {
    this.xOffset = x;
    return this;
  }
  setYOffset(y: number) {
    this.yOffset = y;
    return this;
  }
  resetZoom() {
    this.xScale = 1;
    this.yScale = 1;
  }
  addChild(child: DisplayObject, layer: number) {
    this.children.push(<any>{
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
      this.ctx.fillText(
        "No Scene Loaded",
        this.maxWidth / 2 - this.ctx.measureText("No Scene Loaded").width / 2,
        this.maxHeight / 2
      );
    }
    this.render();
    if (this.fps === "adaptive") {
      requestAnimationFrame(() => {
        this.tickCount++;
        this.tick();
      });
    } else {
      setTimeout(() => {
        this.tickCount++;
        this.tick();
      }, 1000 / <number>this.fps);
    }
  }
  newScene(name: string) {}
}

class DisplayScene {}

export class DisplayObject {
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  borderRadius: number;
  ctx: CanvasRenderingContext2D;

  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  mouseOver: boolean;

  onObjClick: Function[];
  onObjRender: Function[];
  onObjMouseOver: Function[];
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.bgColor = "#ff0000";
    this.borderRadius = 0;
    document.body.onclick = this.#clickEvent;
    this.onObjRender = [];
  }
  #clickEvent(e: MouseEvent) {
    for (let i = 0; i < this.onObjMouseOver.length; i++) {
      this.onObjMouseOver[i](e);
    }
  }
  //null function to be overwritten by child classes
  doRender() {
    return Error(
      "The doRender function must be overwritten by child classes, This is a template class."
    );
  }
  render() {
    this.doRender();
    if (this.onObjRender) {
      for (let i = 0; i < this.onObjRender.length; i++) {
        this.onObjRender[i](this);
      }
    }
  }
  setX(x: number) {
    this.x = x;
    return this;
  }
  setY(y: number) {
    this.y = y;
    return this;
  }
  setWidth(width: number) {
    this.width = width;
    return this;
  }
  setHeight(height: number) {
    this.height = height;
    return this;
  }
  backgroundColor(color: string) {
    this.bgColor = color;
    return this;
  }
  onRender(callback: Function) {
    this.onObjRender.push(callback);
    return this;
  }
  onMouseOver(callback: Function) {
    this.onObjMouseOver.push(callback);
    return this;
  }
  onEvent(event: "click", callback: Function) {
    this.onObjClick.push(callback);
    return this;
  }
}

export class Rect extends DisplayObject {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  doRender() {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Line extends DisplayObject {
  lineWidth: number;
  constructor(x: number, y: number, width: number, height: number) {
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
  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
    return this;
  }
}