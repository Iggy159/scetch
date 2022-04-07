
function setup() {
    createCanvas(400, 400, WEBGL);
    colorMode(HSB, 255);
  }
  
  function draw() {
    let a = 100
    background(0);
    noFill()
    //strokeWeight(2)
    sphere(8)
    
    for(let i = 0; i < 2; i++) {
      stroke(255, 100, 100)
      rotateX(PI / 4)
      rotateZ(PI / 2)
      rotateX(millis() / 2000)
      box(200)
      for(let i = 0; i < 2; i++){
        stroke(255, 130, 120)
        rotateY(millis() / 1500)
        box(140)
        for(let i = 0; i < 2; i++) {
          stroke(255, 160, 160)
          rotateZ(millis() / 1000)
          box(100)
        }
      }
    }
  }