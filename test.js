import { Display, DisplayObject, Line, Rect } from "./api.js";

const display = new Display(document.getElementById("canvas1"), {
  fullScreen: true,
  fps: 60,
});

var i = 0;
display.addChild(
  new Rect(0, 0, 0, 0).backgroundColor("#ffffff").onRender(obj => {
    console.log("render");
    obj.setX(i);
    obj.setY(i);
    obj.setWidth(i);
    obj.setHeight(i);
    if (i > 250) {
      i = 0;
    } else {
      i += 0.5;
    }
  })
);
display.addChild(new Line(0, 0, i, i).onRender((obj) => {
  obj.setWidth(i)
  obj.setHeight(i)
}));
display.addChild(
  new Line(0, 0, i, i).onRender(obj => {
    obj.setY(i)
    obj.setWidth(i);
    obj.setHeight(i);
  })
);
display.addChild(
  new Line(0, 0, i, i).onRender(obj => {
    obj.setX(i);
    obj.setWidth(i);
    obj.setHeight(i);
  })
);