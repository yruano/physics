// TODO:
// - [x] 모든 방향에서 충돌 할 수 있도록 만들기
// - [x] 충돌 했을 때 반응하기
// - [ ] 움직이는 원 2개가 서로 충돌 + 반응하기
// - [ ] 움직이는 원 n개가 서로 충돌 + 반응하기


//
// LINKS:
// - https://www.falstad.com
// - https://tip1234.tistory.com/143
// - https://ericleong.me/research/circle-circle/
// - https://www.youtube.com/watch?v=eED4bSkYCB8


// R_tree
// B_tree
// rad_black_tree


class Circle {
  constructor(x, y, r, color = '') {
    // position
    this.p = new Vector2(x, y)

    // radius
    this.r = r

    // current velocity
    this.v = new Vector2(0, 0)

    // next frame velocity
    this.nv = null

    // draw color
    this.color = color ? color : '#45dfdf'
  }

  move(dt) {
    Vector2.add(this.p, this.v.mulS(dt))
  }

  draw() {
    drawCircleStroke(this.p.x, this.p.y, this.r - 3, 6, this.color)
  }
}

let circles = [
  new Circle(center.x, center.y - 100, 40),
  new Circle(center.x - 300, center.y - 100, 40),
]

window.addEventListener('mousedown', event => {
  if (event.button != 0) return
  if (event.shiftKey) {
    circles[0].v = Vector2.zero
    circles[0].nv = null
    circles[0].p.x = event.x
    circles[0].p.y = event.y
  } else {
    circles[0].v = circles[0].p.dir(new Vector2(event.x, event.y)).mulS(100)
  }
})

//  충돌 확인
function colResolveStySty(self, other) {
  if (self != other) {
    return self.p.distSqr(other.p) <= (self.r + other.r)**2
  }
  return false
}

class Collision {
  
  //  충돌한 오브젝트 확인하고 모음
  static Collision_detection_set(self) {
    let obj = []
    
    for (let other of circles) {

    }
  }

  static give_directions(self, other) {
    if (self.v.isZero()) {
      return Vector2.zero
    }
  
    let hitDir = self.p.dir(other.p)
    let hitForce = self.v.magnitude * self.v.normalize().dot(hitDir)

    return hitDir.mulS(hitForce)
  }
  
  //  충돌 반응
  static collision_reaction (self, other) {
    if (self != other) {
  
      // 이걸 이용해 만들수 있다고 생각하는데 뭔가 부족하다
      // let v1 = self.v.sub((((self.v.sub(other.v).dot(self.pos.sub(other.pos))) / ((self.pos.sub(other.pos)).magnitude**2))) * self.pos.sub(other.pos))
      // let v2 = other.v.sub(((other.v.sub(self.v).dot(other.pos.sub(self.pos))) / (other.pos.sub(self.pos)).magnitude**2) * other.pos.sub(self.pos))
  
      // self.v = v1
      // other.v = v2
  
      let give_self = this.give_directions(self, other)
      let give_other = this.give_directions(other, self)
  
      self.v = self.v.sub(give_self).add(give_other)
      other.v = other.v.sub(give_other).add(give_self)
  
    }
  }
}

function forAllPairs(array, cb) {
  if (!array || array.length < 2) return
  for (let a = 0; a < array.length - 1; ++a)
    for (let b = a + 1; b < array.length; ++b)
      cb(array[a], array[b])
}


let deltaTime = 0 // 한 프레임을 연산하는데 걸린 시간(초)
let startTime = 0

function loop() {
  // calculate delta time
  deltaTime = (performance.now() - startTime) / 1000
  startTime = performance.now()
  
  // clear screen
  clearScreen()
  
  // 충돌 감지
  

  // move
  for (let c of circles) {
    c.move(deltaTime)
  }

  // draw
  for (let c of circles) {
    c.draw()
  }
}

// loop
; (function LOOP() {
  loop()
  requestAnimationFrame(LOOP)
})()

// window.addEventListener('keydown', (input) => {
//   if (input.key == ' ') {
//     loop()
//   }
// })
