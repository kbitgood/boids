import { Rectangle } from './Rectangle'
import { Simulation } from './Simulation'
import { Vector } from './Vector'

export class Boid {
  velocity: Vector
  position: Vector
  disabled: boolean = false

  constructor(
    private simulation: Simulation,
    x: number,
    y: number,
    speed: number,
    angle: number
  ) {
    this.position = new Vector(x, y)
    this.velocity = new Vector(Math.cos(angle) * speed, Math.sin(angle) * speed)
  }

  private align() {
    let averageVelocity = new Vector(0, 0)
    let count = 0

    for (const boid of this.visibleBoids()) {
      averageVelocity.add(boid.velocity)
      count++
    }

    return count > 0
      ? averageVelocity
          .divide(count)
          .normalize()
          .multiply(this.simulation.params.maxSpeed)
          .subtract(this.velocity)
          .multiply(this.simulation.params.alignWeight)
      : averageVelocity
  }

  private cohere() {
    let averagePosition = new Vector(0, 0)
    let count = 0

    for (const boid of this.visibleBoids()) {
      averagePosition.add(boid.position)
      count++
    }

    return count > 0
      ? averagePosition
          .divide(count)
          .subtract(this.position)
          .normalize()
          .multiply(this.simulation.params.cohereWeight)
      : averagePosition
  }

  private separate() {
    let separationForce = new Vector(0, 0)

    for (const boid of this.visibleBoids()) {
      const fleeForce = Vector.subtract(
        this.position,
        boid.position
      ).normalize()
      separationForce.add(fleeForce)
    }

    return separationForce.multiply(this.simulation.params.separateWeight)
  }

  avoid(point: Vector, distance: number, strength: number): Vector {
    const diff = Vector.subtract(point, this.position)
    const d = diff.magnitude()
    return d < distance
      ? diff.normalize().multiply(-strength * (1 - d / distance))
      : new Vector(0, 0)
  }

  visibleBoids() {
    const rect = new Rectangle(
      this.position.x - this.simulation.params.viewDistance,
      this.position.y - this.simulation.params.viewDistance,
      this.simulation.params.viewDistance * 2,
      this.simulation.params.viewDistance * 2
    )
    const boids = this.simulation.quadtree.query(rect)
    return boids.filter((b) => b !== this)
  }

  update() {
    if (this.disabled) return

    const alignmentForce = this.align()
    const cohesionForce = this.cohere()
    const separationForce = this.separate()
    const avoidForce = this.avoid(
      this.simulation.mousePosition,
      this.simulation.params.mouseDistance,
      (this.simulation.leftMouseDown ? -1 : 1) *
        this.simulation.params.mouseStrength
    )

    this.velocity = this.velocity
      .add(alignmentForce)
      .add(cohesionForce)
      .add(separationForce)
      .add(avoidForce)
      .normalize()
      .multiply(this.simulation.params.maxSpeed)

    this.position = this.position.add(this.velocity)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.disabled) return

    ctx.save()

    ctx.translate(this.position.x, this.position.y)

    ctx.rotate(this.velocity.angle())

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-10, 5)
    ctx.lineTo(-10, -5)
    ctx.closePath()

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'

    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }

  disable() {
    this.disabled = true
  }

  enable() {
    if (this.disabled) {
      this.disabled = false
      this.position = new Vector(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      )
      this.velocity = new Vector(0, 0)
    }
  }
}
