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
  fps: number;
  tickCount: number;
  backgroundColor: string;
  children: DisplayObject[];
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
    this.children = []
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
        } else {
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
    this.render()
    setTimeout(() => {
      this.tickCount++;
      this.tick();
    }, 1000 / this.fps);
  }
}

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

  onObjRender: Function;
  onObjMouseOver: Function;
  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.bgColor = "#ff0000";
    this.borderRadius = 0;
  }
  render() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.closePath();
    if (this.onObjRender) {
      this.onObjRender()
    }

  }
  backgroundColor(color:string) {
    this.bgColor = color;
    return this;
  }
  onRender(callback:Function) {
    this.onObjRender = callback;
    return this;
  }
  onMouseOver(callback:Function) {
    this.onObjMouseOver = callback;
    return this;
  }
}