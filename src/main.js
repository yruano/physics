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

// https://codepen.io/je3f0o/pen/WJaWZo?editors=0010


//  Verlet
//  R_tree
//  B_tree
//  rad_black_tree
//  spatial hash

class Circle {
  constructor(x, y, r, color = '') {
    // position
    this.p = new Vector2(x, y)

    // old_position
    this.old_p = new Vector2(x, y)

    // velocity
    this.v = new Vector2(0, 0)

    // acceleration
    this.acc = Vector2.zero

    // radius
    this.r = r
  }
  
  // acceleration(dt) {
  //   let grav_acc = Vec3d{0.0, 0.0, -9.81 }; // 9.81m/s^2 down in the Z-axis
  //   let drag_force = 0.5 * drag * (vel * abs(vel)); // D = 0.5 * (rho * C * Area * vel^2)
  //   let drag_acc = drag_force / mass; // a = F/m
  //   return grav_acc - drag_acc;
  // }

  move(dt) {
    let nextPos =
    this.p.mulS(2).sub(this.old_p).add(this.acc.mulS(dt ** 2))

    // update previous position
    this.old_p = this.p

    // update current position
    this.p = nextPos

    // reset acceleration
    this.acc.x = 0
    this.acc.y = 0
  }

  draw() {
    drawCircleStroke(this.p.x, this.p.y, this.r - 3, 6, this.color)
  }
}

let circles = [
  new Circle(center.x + 200, center.y, 40),
  new Circle(center.x - 100, center.y, 40),
  new Circle(center.x - 200, center.y, 40),
  new Circle(center.x - 300, center.y, 40),
  new Circle(center.x - 500, center.y, 40),

]

window.addEventListener('mousedown', event => {
  if (event.button == 0) {
    let mousePos = new Vector2(event.x, event.y)
    if (event.shiftKey) {
      circles[0].p = mousePos.dup()
      circles[0].old_p.p = mousePos.dup()
    } else {
      circles[0].old_p.p = circles[0].p.dup()
      Vector2.add(circles[0].old_p.p, mousePos.dir(circles[0].p).mulS(5))
    }
  }
})

function gravity(self) {
  self.old_p.y -= 0.5
}

// 충돌 감지
function collision_detection(self, other) {
  if (self != other) {
    return (self.p.x - other.p.x) ** 2 + (self.p.y - other.p.y) ** 2 <= (self.r + other.r)**2
  }
}

class collision {
  // 벽과의 충돌 반응
  static wall_and_collision_reaction(self) {
    let damping = 0.98
    if (self.p.x - self.r < 0) {
      let vx = (self.old_p.x - self.p.x) * damping

      self.p.x = self.r
      self.old_p.x = self.p.x - vx
    } 
    else if (self.p.x + self.r > canvas.width) {
      let vx = (self.old_p.x - self.p.x) * damping

      self.p.x = canvas.width - self.r
      self.old_p.x = self.p.x - vx
    } 
    else if (self.p.y - self.r < 0) {
      let vy = (self.old_p.y - self.p.y) * damping

      self.p.y = self.r
      self.old_p.y = self.p.y - vy
    } 
    else if (self.p.y + self.r > canvas.height) {
      let vy = (self.old_p.y - self.p.y) * damping

      self.p.y = canvas.height - self.r
      self.old_p.y = self.p.y - vy
    }
    
  }

  // 공과 공의 충돌 반응
  static object_collision_reaction(self) {
    let damping = 0.98
    for (let other of circles) {
      if (self != other) {
        let x = self.p.x - other.p.x
        let y = self.p.y - other.p.y
        let slength = x**2 + y**2
        let length = Math.sqrt(slength)
        let target = self.r + other.r
  
        if (collision_detection(self, other)) {
          let v1x = self.p.x - self.old_p.x
          let v1y = self.p.y - self.old_p.y
          let v2x = other.p.x - other.old_p.x
          let v2y = other.p.y - other.old_p.y
  
          let factor = (length-target)/length
  
          self.p.x -= x * factor * 0.5;
          self.p.y -= y * factor * 0.5;
          other.p.x -= x * factor * 0.5;
          other.p.y -= y * factor * 0.5;
  
          let f1 = (damping * (x * v1x + y * v1y)) / slength
          let f2 = (damping * (x * v2x + y * v2y)) / slength
  
          v1x += f2 * x - f1 * x
          v2x += f1 * x - f2 * x
          v1y += f2 * y - f1 * y
          v2y += f1 * y - f2 * y
  
          self.old_p.x = self.p.x - v1x
          self.old_p.y = self.p.y - v1y
          other.old_p.x = self.p.x - v2x
          other.old_p.y = self.p.y - v2y

        }
      }
    }
  }
}



let deltaTime = 0
let startTime = 0


function loop() {
  // calculate delta time
  deltaTime = (performance.now() - startTime) / 1000
  startTime = performance.now()
  
  // clear screen
  clearScreen()
  
  // 중력
  for (let c of circles) {
    gravity(c)
  }

  // 충돌확인
  for (let c of circles) {
    collision.wall_and_collision_reaction(c)
  }

  // 공의 충돌 반응
  for (let c of circles) {
    collision.object_collision_reaction(c)
  }


  // 공의 움직임
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
