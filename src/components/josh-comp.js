//https://localhost:8080/hub.html?hub_id=6wWogFt&vr_entry_type=2d_now&disable_telemetry=true
AFRAME.registerComponent("josh-comp", {
  schema: {
    active: { type: "boolean" },
  },
  log(str) {
    console.log("===========",str)
  },
  game_state: {
    rows:[
      [0,0,0],
      [0,1,0],
      [0,0,2],
    ]
  },
  init() {
    let canvas = document.createElement('canvas')
    canvas.width  = 256
    canvas.height = 256
    this.canvas = canvas

    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(4,4),
      new THREE.MeshBasicMaterial({
        color: 'pink',
        map: new THREE.CanvasTexture(canvas),
        side: THREE.DoubleSide,
      })
    );
    mesh.matrixNeedsUpdate = true;
    this.el.setObject3D("mesh", mesh);
    this.mesh = mesh;

    this.el.classList.add("interactable");
    this.log("init-ing josh comp")
    this.josh_redraw()

    this.el.object3D.addEventListener("interact", (e) => {
      console.log(e, this.el.sceneEl.systems.interaction.getActiveIntersection())
      let inter = this.el.sceneEl.systems.interaction.getActiveIntersection()
      //distance is absolute distance to the click surface
      //face & faceIndex
      //point is 3d point
      //uv is position on the face/plane in UV space
      let cell = this.uv2cell(inter.uv)
      console.log("uv is", inter.uv,cell)
      this.game_state.rows[cell.y][cell.x] = 1
      this.josh_redraw()

      // console.log(`Click detected on ${this.el}. The thing doing the clicking is ${e.detail.object3D}`);
    });

  },
  uv2cell:function (uv) {
    return {
      x:Math.floor(uv.x*3.0),
      y:Math.floor((1.0-uv.y)*3.0),
    }
  },
  updateCursorIntersection: function(intersection, left) {
    console.log("============== update cursor intersection")
  },
  play() {
    this.log("starting josh-comp state")
    this.el.object3D.addEventListener("hovered", this.onHover);
    this.el.object3D.addEventListener("unhovered", this.onHoverOut);
  },
  pause() {
    this.el.object3D.removeEventListener("hovered", this.onHover);
    this.el.object3D.removeEventListener("unhovered", this.onHoverOut);
  },
  josh_redraw(){
    let c = this.canvas.getContext('2d')
    c.fillStyle = 'red'
    c.fillRect(0,0,this.canvas.width,this.canvas.height)

    let w = this.canvas.width;
    let h = this.canvas.height

    c.fillStyle = 'black'
    c.fillRect(0,0,w,h)

    for(let i=0; i<3; i++) {
      for(let j=0; j<3; j++) {
        let cw = w/3
        let ch = h/3
        let inset = 5
        c.fillStyle = 'white'
        c.save()
        c.translate(i*w/3,j*h/3)
        c.fillRect(inset, inset, cw-inset*2, ch-inset*2)
        let val = this.game_state.rows[j][i]
        if(val === 0) {

        }
        if(val === 1) {
          c.fillStyle = "red"
          c.fillRect(20,20,cw-40,ch-40)
        }
        if(val === 2) {
          c.fillStyle = "blue"
          c.fillRect(20,20,cw-40,ch-40)
        }
        c.restore()
      }
    }

    this.mesh.material.map.needsUpdate = true
  },
  tick2() {
    const intersection = this.el.sceneEl.systems.interaction.getActiveIntersection();
    this.log(intersection)
  }
});

AFRAME.registerComponent('josh-wand',{
  schema: {
    color: { type: "string" },
  },
  log(str) {
    console.log("===========",str)
  },
  init() {
    const mesh = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.1,0.1,1),
      new THREE.MeshBasicMaterial({
        color: this.data.color
    })
    );
    mesh.rotation.x = Math.PI/2;
    mesh.matrixNeedsUpdate = true;
    this.el.setObject3D("mesh", mesh);
    this.mesh = mesh;

    this.el.classList.add("interactable");
    this.el.setAttribute("is-remote-hover-target", "");
    this.el.setAttribute("tags", {
      isHandCollisionTarget: true,
      isHoldable: true,
      offersHandConstraint: true,
      offersRemoteConstraint: true,
      togglesHoveredActionSet: true,
      singleActionButton: true
    });
    this.el.object3D.addEventListener("interact", console.log);
    this.el.setAttribute("body-helper", { type: "dynamic", mass: 1, collisionFilterGroup: 1, collisionFilterMask: 15 });
    this.el.setAttribute("matrix-auto-update", "");
    this.el.setAttribute("floaty-object", { modifyGravityOnRelease: true, autoLockOnLoad: true });
    this.log("made wand")
  }
})
