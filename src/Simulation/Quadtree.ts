import { Boid } from './Boid'
import { Rectangle } from './Rectangle'

export class Quadtree {
  capacity: number
  boundary: Rectangle
  boids: Boid[]
  divided: boolean
  nw: Quadtree | null
  ne: Quadtree | null
  sw: Quadtree | null
  se: Quadtree | null

  constructor(boundary: Rectangle, capacity: number) {
    this.capacity = capacity
    this.boundary = boundary
    this.boids = []
    this.divided = false
    this.nw = null
    this.ne = null
    this.sw = null
    this.se = null
  }

  insert(boid: Boid): boolean {
    if (!this.boundary.contains(boid.position)) {
      return false
    }

    if (this.boids.length < this.capacity) {
      this.boids.push(boid)
      return true
    }

    if (!this.divided) {
      this.subdivide()
    }

    return (
      this.nw!.insert(boid) ||
      this.ne!.insert(boid) ||
      this.sw!.insert(boid) ||
      this.se!.insert(boid)
    )
  }

  remove(boid: Boid): boolean {
    if (!this.boundary.contains(boid.position)) {
      return false
    }

    const index = this.boids.indexOf(boid)
    if (index !== -1) {
      this.boids.splice(index, 1)
      return true
    }

    if (this.divided) {
      return (
        this.nw!.remove(boid) ||
        this.ne!.remove(boid) ||
        this.sw!.remove(boid) ||
        this.se!.remove(boid)
      )
    }

    return false
  }

  subdivide() {
    const x = this.boundary.x
    const y = this.boundary.y
    const w = this.boundary.width / 2
    const h = this.boundary.height / 2

    const nwBoundary = new Rectangle(x, y, w, h)
    this.nw = new Quadtree(nwBoundary, this.capacity)

    const neBoundary = new Rectangle(x + w, y, w, h)
    this.ne = new Quadtree(neBoundary, this.capacity)

    const swBoundary = new Rectangle(x, y + h, w, h)
    this.sw = new Quadtree(swBoundary, this.capacity)

    const seBoundary = new Rectangle(x + w, y + h, w, h)
    this.se = new Quadtree(seBoundary, this.capacity)

    this.divided = true

    for (const boid of this.boids) {
      this.nw.insert(boid)
      this.ne.insert(boid)
      this.sw.insert(boid)
      this.se.insert(boid)
    }

    this.boids = []
  }

  query(range: Rectangle): Boid[] {
    const found: Boid[] = []

    if (!this.boundary.intersects(range)) {
      return found
    }

    for (const boid of this.boids) {
      if (range.contains(boid.position)) {
        found.push(boid)
      }
    }

    if (this.divided) {
      found.push(...this.nw!.query(range))
      found.push(...this.ne!.query(range))
      found.push(...this.sw!.query(range))
      found.push(...this.se!.query(range))
    }

    return found
  }
}
