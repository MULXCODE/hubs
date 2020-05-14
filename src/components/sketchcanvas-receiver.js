import PubNub from "pubnub"

import { COMMANDS, MODES, SketchCanvas } from "./sketchcanvas.js";

export class SketchCanvasReceiver extends SketchCanvas {
  constructor(canvas,mesh) {
    super();
    this.canvas = canvas
    this.mesh = mesh
    this.redraw(this.canvas)
    this.setupConnection()
    this.listeners = {}
  }

  addEventListener(type,cb) {
    this._getListeners(type).push(cb)
  }

  _getListeners(type) {
    if(!this.listeners[type]) this.listeners[type] = []
    return this.listeners[type]
  }

  handleMessage(m) {
    console.log("got remote message",m)
    if(m.command === COMMANDS.MOUSE_DOWN) return this.startStroke(m.payload)
    if(m.command === COMMANDS.MOUSE_DRAG) return this.dragStroke(m.payload)
    if(m.command === COMMANDS.MOUSE_UP)   return this.endStroke(m.payload)
    if(m.command === COMMANDS.STROKE_COLOR) return this.setStrokeColor(m.payload)
    if(m.command === COMMANDS.STROKE_WIDTH) return this.setStrokeWidth(m.payload)
    if(m.command === COMMANDS.CLEAR) return this.clear()
    this._getListeners(m.command).forEach(cb => cb(m))
  }
  processMessage(m) {
    this.handleMessage(m)
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
      message: (m)=>this.processMessage(m.message)
    })
    this.pubnub.subscribe({
      channels:[this.pubnub_CHANNEL]
    })
  }

}
