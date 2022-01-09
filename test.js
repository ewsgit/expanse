import { Display, DisplayObject } from "./api.js";

const display = new Display(document.getElementById("canvas1"), {
  fullScreen: true,
  fps: 60,
});

display.addChild(new DisplayObject(0, 0, 50, 50));
display.addChild(new DisplayObject(60, 0, 50, 50));
display.addChild(
  new DisplayObject(120, 0, 50, 50)
  .backgroundColor("#ffffff")
  .onRender(() => {
    console.log("render");
  })
);
