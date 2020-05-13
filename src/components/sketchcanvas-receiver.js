import PubNub from "pubnub"

import { COMMANDS, MODES, SketchCanvas } from "./sketchcanvas.js";

export class SketchCanvasReceiver extends SketchCanvas {
  constructor(canvas,mesh) {
    super();
    this.canvas = canvas
    this.mesh = mesh
    this.redraw(this.canvas)
    this.setupConnection()
  }

  handleMessage(m) {
    // console.log("got remote message",m)
    if(m.command === COMMANDS.MOUSE_DOWN) this.startStroke(m.payload)
    if(m.command === COMMANDS.MOUSE_DRAG) this.dragStroke(m.payload)
    if(m.command === COMMANDS.MOUSE_UP)   this.endStroke(m.payload)
    if(m.command === COMMANDS.STROKE_COLOR) this.setStrokeColor(m.payload)
    if(m.command === COMMANDS.STROKE_WIDTH) this.setStrokeWidth(m.payload)
    if(m.command === COMMANDS.CLEAR) this.clear()
    this.redraw(this.canvas)
    this.mesh.material.map.needsUpdate = true
  }
  sendCommand(command, payload) {
    // console.log("don't send it back. we are receive only")
  }
    setupConnection() {
    this.pubnub_settings.uuid = `mysketchclient-${this.mode}`
    this.pubnub = new PubNub(this.pubnub_settings)
    this.pubnub.addListener({
      status: (e) => console.log(e),
      message: (m)=>this.handleMessage(m.message)
    })
    this.pubnub.subscribe({
      channels:[this.pubnub_CHANNEL]
    })
  }

}
