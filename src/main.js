// TODO:
// - [x] 모든 방향에서 충돌 할 수 있도록 만들기
// - [x] 충돌 했을 때 반응하기
// - [ ] 움직이는 원 2개가 서로 충돌 + 반응하기
// - [ ] 움직이는 원 n개가 서로 충돌 + 반응하기
// - [ ] 터널링이 불가능 하게 만들기(CCD)
// - [ ] 선분도 원과 똑같이 작동하게 만들기
// - [ ] 원과 선분이 서로 충돌 + 반응하기
// - [ ] 충돌시 해결시 가속도 반영하기
// - [ ] 물체 회전 구현하기
// - [ ] 충돌시 해결시 회전 반영하기
//
// LINKS:
// - https://www.falstad.com
// - https://tip1234.tistory.com/143
// - https://ericleong.me/research/circle-circle/
// - https://www.youtube.com/watch?v=eED4bSkYCB8


class Circle {
  constructor(x, y, r, color = '') {
    // 위치
    this.pos = new Vector2(x, y)
    // 반지름
    this.r = r
    // 이동 방향 (단위 벡터)
    this.dir = new Vector2(0, 0)
    // 속력 펙셀/s
    this.speed = 60
    // 색
    this.color = color ? color : '#88e0ff'
    // 충돌 오브젝트
    this.hits = []
  }
  draw() {
    drawCircle(this.pos.x, this.pos.y, this.r, this.color)
  }
  move(dt) {
    let moveVec = this.dir.mulByScalar(this.speed * dt)
    Vector2.add(this.pos, moveVec)
  }
}

let circlesDyn = [
  // new Circle(300, 500, 5),
  // new Circle(400, 500, 5),
  new Circle(center.x + 300, center.y, 40),
  new Circle(center.x - 300, center.y - 100, 40),
  new Circle(center.x + 40, center.y + 300, 40)
]
// circlesDyn[0].dir = new Vector2(1, -1).normalize()
// circlesDyn[1].dir = new Vector2(-1, -1).normalize()
circlesDyn[0].speed = 100
circlesDyn[0].dir = new Vector2(1, -1).normalize()
circlesDyn[1].dir.x = -1
circlesDyn[2].dir = new Vector2(-1, -1).normalize()
// circlesDyn[3].dir.x = -1

let circlesSty = [
  new Circle(center.x - 100, center.y, 60, '#aaff33'),
  new Circle(center.x + 300, center.y + 200, 120, '#aaff33'),
  new Circle(center.x - 400, center.y - 500, 300, '#aaff33'),
  new Circle(center.x + 200, center.y - 100, 200, '#aaff33'),
]

window.addEventListener('mousedown', event => {
  if (event.button == 0) {
    circlesDyn[0].dir = Vector2.normalize(
      new Vector2(event.x, event.y).sub(circlesDyn[0].pos))

    if (event.shiftKey) {
      circlesDyn[0].dir.x = 0
      circlesDyn[0].dir.y = 0
      circlesDyn[0].pos.x = event.x
      circlesDyn[0].pos.y = event.y
    }
  }
})

function colResolveStySty(self, other) {
  let dirToSelf = Vector2.normalize(other.pos.sub(self.pos))
  // when not moving
  if (dirToSelf.x == 0 && dirToSelf.y == 0)
    return
  // when overlaping
  self.pos = other.pos.sub(
    Vector2.mulByScalar(dirToSelf, self.r + other.r))
}

function colResolveDynSty(self, other) {
  // angle between the direction vector and the x axis
  let d = -Math.atan(self.dir.y / self.dir.x)

  // rotate the positions to make calculation easier
  let o1 = self.pos.rotate(d)
  let o2 = other.pos.rotate(d)

  // x distance from o2
  let r = self.r + other.r
  let b = Math.asin(Math.abs(o2.y - o1.y) / r)
  let l = r * Math.cos(b)

  // resolved position
  let lSign = sign01(self.dir.x) * 2 - 1
  let res = new Vector2(o2.x - l * lSign, o1.y)
  Vector2.rotate(res, -d) // rotate back

  // apply resolved position
  self.pos = res
}

let theZ = 0

function colResolveDynDyn(self, other) {
  let p1 = self.pos
  let p2 = other.pos
  let r1 = self.r
  let r2 = other.r
  let v1 = self.dir.mulByScalar(self.speed * deltaTime)
  let v2 = other.dir.mulByScalar(other.speed * deltaTime)

  let vpDot = (
    - v1.dot(p1)
    + v1.dot(p2)
    + v2.dot(p1)
    - v2.dot(p2)
  )

  if (vpDot < 0)
    return

  let z = (2*vpDot)**2
    - 4*(
      - ((v1.x - v2.x)**2)
      - ((v1.y - v2.y)**2)
    )*(
      - ((p1.x - p2.x)**2)
      - ((p1.y - p2.y)**2)
      + ((r1 + r2)**2)
    )

  let t = (-0.5*Math.sqrt(z) + vpDot)/(
        ((v1.x-v2.x)**2) 
      + ((v1.y-v2.y)**2)
    )


  let o1 = Vector2.add(self.pos, v1.mulByScalar(t))
  let o2 = Vector2.add(other.pos, v2.mulByScalar(t))
  // let o1 = self.pos.add(v1.mulByScalar(t))
  // let o2 = other.pos.add(v2.mulByScalar(t))

  drawCircle(o1.x, o1.y, self.r, '#ffaa22')
  drawCircle(o2.x, o2.y, other.r, '#ffaa22')
}

function colResponse(self, other) {
  // 작용 반작용에 의한 힘 + other이 self를 치는 힘 = 반대로 나가는힘이 나옴 
  // 벡터의 합을 함 그리고 벡터의 합의 길이를 구함 그러면 
  let normal = Vector2.normalize(self.pos.sub(other.pos))
  self.dir = self.dir.reflect(normal)

  gl.lineWidth = 2
  drawVec(self.pos, self.dir.mulByScalar(20), '#aaaa22')
}

function colCheckDiscrete(self) {
  // dynamic vs stationary
  for (let other of circlesSty) {
    if (self.pos.distSqr(other.pos) > (self.r+other.r)**2)
      continue
    if (self.dir.x == 0 && self.dir.y == 0) {
      colResolveStySty(self, other)
    } else {
      colResolveDynSty(self, other)
    }
    self.hits.push(other)
  }

  // dynamic vs dynamic
  for (let other of circlesDyn) {
    if (other == self || self.pos.distSqr(other.pos) > (self.r+other.r)**2)
      continue
    if (self.dir.x == 0 && self.dir.y == 0
    && other.dir.x == 0 && other.dir.y == 0) {
      colResolveStySty(self, other)
    } else {
      colResolveDynDyn(self, other)
    }
    self.hits.push(other)
    other.hits.push(self)
  }

  // response
  for (let hit of self.hits) {
    // colResponse(self, hit)
  }
  self.hits = []
}

let deltaTime = 0 // 한 프레임 연산하는데 걸린 시간(초)
let startTime = performance.now()

function loop() {
  // calculate delta time
  deltaTime = (performance.now() - startTime) / 1000
  startTime = performance.now()

  // clear screen
  clearScreen()

  // move
  for (c of circlesDyn) c.move(deltaTime)

  // draw
  for (c of circlesDyn) c.draw(deltaTime)
  for (c of circlesSty) c.draw(deltaTime)

  // handle collision
  for (c of circlesDyn) colCheckDiscrete(c)

  // loop
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
