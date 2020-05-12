import { findRemoteHoverTarget } from "./interactions.js";

AFRAME.registerSystem("josh-sys", {
  init() {
    console.log("========== init-ing josh sys")
  },
  updateCursorIntersection: function(intersection, left) {
    console.log("============== update cursor intersection")
  },
  tick: function() {
  }

})
