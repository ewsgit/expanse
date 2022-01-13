import { Display, DisplayObject, Line, Rect } from "./api.js";

const display = new Display(document.getElementById("canvas1"), {
  fullScreen: true,
  fps: "adaptive",
});

var i = 0;
// display.addChild(
//   new Rect(0, 0, 0, 0).backgroundColor("#ffffff").onRender(obj => {
//     obj.setX(i);
//     obj.setY(i);
//     obj.setWidth(i);
//     obj.setHeight(i);
//     if (i > 250) {
//       i = 0;
//     } else {
//       i += 0.5;
//     }
//     i++
//   })
// );
var mouse = {};
document.addEventListener("mousemove", e => {
  mouse = {
    x: e.clientX,
    y: e.clientY,
  };
});
display.addChild(
  new Line(display.maxWidth / 2, display.maxHeight / 2, 0, 0)
    .setLineWidth(100)
    .setLineCurve(50)
    .backgroundColor("#00ff00")
    .onRender(obj => {
      if (mouse !== {}) {
        obj.setWidth(mouse.x - (display.maxWidth / 2));
        obj.setHeight(mouse.y - (display.maxHeight / 2));
      }
    })
);
