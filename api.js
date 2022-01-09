var Display = /** @class */ (function () {
    function Display(canvas, options) {
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
    Display.prototype.InitCanvas = function () {
        this.ctx.clearRect(0, 0, this.maxWidth, this.maxHeight);
        this.canvas.width = this.maxWidth;
        this.canvas.height = this.maxHeight;
    };
    Display.prototype.setZoom = function (scaleX, scaleY) {
        this.xScale = scaleX;
        this.yScale = scaleY;
    };
    Display.prototype.resetZoom = function () {
        this.xScale = 1;
        this.yScale = 1;
    };
    Display.prototype.addChild = function (child) {
        this.children.push(child);
    };
    Display.prototype.render = function () {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.ctx = this.ctx;
            child.render();
        }
    };
    Display.prototype.tick = function () {
        var _this = this;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.maxWidth, this.maxHeight);
        this.render();
        setTimeout(function () {
            _this.tickCount++;
            _this.tick();
        }, 1000 / this.fps);
    };
    return Display;
}());
export { Display };
var DisplayObject = /** @class */ (function () {
    function DisplayObject(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bgColor = "#ff0000";
        this.borderRadius = 0;
    }
    DisplayObject.prototype.render = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.closePath();
        if (this.onObjRender) {
            this.onObjRender();
        }
    };
    DisplayObject.prototype.backgroundColor = function (color) {
        this.bgColor = color;
        return this;
    };
    DisplayObject.prototype.onRender = function (callback) {
        this.onObjRender = callback;
        return this;
    };
    DisplayObject.prototype.onMouseOver = function (callback) {
        this.onObjMouseOver = callback;
        return this;
    };
    return DisplayObject;
}());
export { DisplayObject };
