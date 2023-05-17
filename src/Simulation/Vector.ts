export class Vector {
  static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
  }

  static subtract(v1: Vector, v2: Vector) {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
  }

  static multiply(v: Vector, scalar: number) {
    return new Vector(v.x * scalar, v.y * scalar)
  }

  static divide(v: Vector, scalar: number) {
    return new Vector(v.x / scalar, v.y / scalar)
  }

  constructor(public x: number, public y: number) {}

  add(v: Vector) {
    this.x += v.x
    this.y += v.y
    return this
  }

  subtract(v: Vector) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  multiply(scalar: number) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  divide(scalar: number) {
    this.x /= scalar
    this.y /= scalar
    return this
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    return this.divide(this.magnitude())
  }

  distance(v: Vector) {
    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2))
  }

  angle() {
    return Math.atan2(this.y, this.x)
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  limit(max: number) {
    const magnitude = this.magnitude()
    if (magnitude > max) {
      return this.normalize().multiply(max)
    }
    return this
  }
}
