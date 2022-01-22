import { Display } from "../api/api.js";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
const display = new Display(canvas, {
  fps: "adaptive",
  backgroundColor: "#000000",
  fullScreen: true
});