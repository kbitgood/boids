import { Quadtree } from './Quadtree'
import { Rectangle } from './Rectangle'
import { Boid } from './Boid'
import { Vector } from './Vector'

export class Simulation {
  params = {
    viewDistance: 90,
    alignWeight: 0.2,
    cohereWeight: 0.2,
    separateWeight: 0.1,
    maxSpeed: 4,
    numBoids: 100,
    mouseDistance: 150,
    mouseStrength: 1,
  }

  mousePosition = new Vector(0, 0)
  leftMouseDown = false
  boids: Boid[] = []
  quadtree: Quadtree = new Quadtree(
    new Rectangle(0, 0, window.innerWidth, window.innerHeight),
    4
  )

  constructor() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseMove = (event: MouseEvent) => {
    this.mousePosition.x = event.clientX
    this.mousePosition.y = event.clientY
  }

  onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      this.leftMouseDown = true
    }
  }

  onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) {
      this.leftMouseDown = false
    }
  }

  update = () => {
    for (let i = 0; i < this.params.numBoids; i++) {
      if (this.boids.length < this.params.numBoids) {
        const boid = new Boid(
          this,
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          Math.random() * this.params.maxSpeed,
          Math.random() * Math.PI * 2
        )
        this.boids.push(boid)
        this.quadtree.insert(boid)
      }
      const boid = this.boids[i]
      if (boid.disabled) boid.enable()
      boid.update()

      if (boid.position.x < 0) {
        boid.position.x = window.innerWidth
      } else if (boid.position.x > window.innerWidth) {
        boid.position.x = 0
      }
      if (boid.position.y < 0) {
        boid.position.y = window.innerHeight
      } else if (boid.position.y > window.innerHeight) {
        boid.position.y = 0
      }
    }
    for (let i = this.params.numBoids; i < this.boids.length; i++) {
      if (this.boids[i].disabled) continue
      this.boids[i].disable()
      this.quadtree.remove(this.boids[i])
    }
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    for (const boid of this.boids) {
      boid.draw(ctx)
    }
  }
}
