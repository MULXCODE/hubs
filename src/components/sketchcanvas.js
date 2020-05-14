
class Stroke {
  constructor(start, width, color) {
    this.start = start
    this.points = []
    this.width = width
    this.color = color
    this.ended = false
  }
  drag(pt) {
    this.points.push(pt)
  }
  end(pt) {
    this.points.push(pt)
    this.ended = true
  }
  redraw(c) {
    // console.log('drawing stroke',this)
    c.strokeStyle = this.color
    c.lineWidth = this.width
    c.beginPath()
    c.moveTo(this.start.x,this.start.y)
    this.points.forEach(pt=>c.lineTo(pt.x,pt.y))
    c.stroke()
  }
}

export const MODES = {
  SENDER:'SENDER',
  RECEIVER:'RECEIVER',
  NONE:'NONE',
}
export const COMMANDS = {
  MOUSE_DOWN:'MOUSE_DOWN',
  MOUSE_DRAG:'MOUSE_DRAG',
  MOUSE_UP:'MOUSE_UP',
  STROKE_WIDTH:'STROKE_WIDTH',
  STROKE_COLOR:'STROKE_COLOR',
  CLEAR: 'CLEAR',
  TEAR:'TEAR',
}

export class SketchCanvas {
  constructor() {
    this.strokes = []
    this.currentStroke = null
    this.currentWidth = 1
    this.currentColor = 'black'
    this.pubnub_settings = {
      publishKey: 'pub-c-1cba58da-c59a-4b8b-b756-09e9b33b1edd',
      subscribeKey: 'sub-c-39263f3a-f6fb-11e7-847e-5ef6eb1f4733',
    }
    this.pubnub_CHANNEL = 'draw-demo-754'
  }
  startStroke(pt) {
    this.currentStroke = new Stroke(pt,this.currentWidth, this.currentColor)
    this.strokes.push(this.currentStroke)
    this.sendCommand(COMMANDS.MOUSE_DOWN,pt)
  }
  dragStroke(pt) {
    if(!this.currentStroke) return
    this.currentStroke.drag(pt)
    this.sendCommand(COMMANDS.MOUSE_DRAG,pt)
  }
  endStroke(pt) {
    this.currentStroke.end(pt)
    this.currentStroke = null
    this.sendCommand(COMMANDS.MOUSE_UP,pt)
  }
  clear() {
    this.strokes = []
    this.currentStroke = null
    this.sendCommand(COMMANDS.CLEAR,{})
  }
  redraw(canvas) {
    let c = canvas.getContext('2d')
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width,canvas.height)
    c.strokeStyle = 'black'
    c.lineWidth = 8
    c.strokeRect(0,0,canvas.width,canvas.height)
    this.strokes.forEach(stroke => stroke.redraw(c))
  }
  setStrokeWidth(w) {
    this.currentWidth = w
    this.sendCommand(COMMANDS.STROKE_WIDTH,this.currentWidth)
  }
  setStrokeColor(c) {
    this.currentColor = c
    this.sendCommand(COMMANDS.STROKE_COLOR,this.currentColor)
  }
  tear() {
    this.strokes = []
    this.currentStroke = null
    this.sendCommand(COMMANDS.TEAR,{})
  }

}
