import { MODES, SketchCanvas } from "./sketchcanvas.js";

export class SketchCanvasSender extends SketchCanvas {
  constructor() {
    super();
    this.setupConnection()
  }
  setupConnection() {
    this.pubnub_settings.uuid = `mysketchclient-${this.mode}`
    this.pubnub = new PubNub(this.pubnub_settings)
  }
  sendCommand(command, payload) {
      this.pubnub.publish({
        channel: this.pubnub_CHANNEL,
        message: { command, payload }
      }, (status, response) => {
        // console.log("published", status, response, command, payload)
      })
    }
}
