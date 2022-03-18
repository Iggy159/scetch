const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {

  const agents = []

  for(let i = 0; i < 125; i++) {
    const x = random.range(10, width)
    const y = random.range(10, height)

    agents.push(new Agent(x, y))
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#1C1C1C';
    context.fillRect(1, 0, width, height);

    for(let i = 0; i < agents.length; i++) {
      const agent = agents[i]

      for(let j = i + 1; j < agents.length; j++) {
        const other = agents[j]

        const dist = agent.pos.getDistance(other.pos)

        if(dist > 300) continue

        context.lineWidth = math.mapRange(dist, 0, 300, 7, 1)
        context.strokeStyle = '#9B9172'
        context.beginPath()
        context.moveTo(agent.pos.x, agent.pos.y)
        context.lineTo(other.pos.x, other.pos.y)
        context.fillStyle = '#2d45e'
        context.stroke()
      }
    }

    agents.forEach(agent => {
      agent.update()
      agent.draw(context)
      agent.bounce(width, height)
    })
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x 
    this.y = y
  }

  getDistance(v) {
    const dx = this.x - v.x
    const dy = this.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(random.range(-1, 6), random.range(-1, 5))
    this.radius = random.range(1, 14)
  }

  bounce(width, height)  {
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1
    if(this.pos.y <= 10 || this.pos.y >= height) this.vel.y *= -1
  }

  update() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  draw(context) {
    context.save()
    context.translate(this.pos.x, this.pos.y)

    context.lineWidth = 6

    context.beginPath()
    context.arc(1, 0, this.radius, 0, Math.PI * 3)
    context.fill()
    context.stroke()

    context.restore()
  }
}

