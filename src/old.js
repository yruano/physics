//https://www.haroldserrano.com/blog/how-a-physics-engine-works-an-overview
//box2D
//https://mathnotepad.com/
//https://www.wolframalpha.com/0
//miro
//https://overthewire.org/wargames/


// var x = canvas.width / 2
// var y = canvas.height / 2

// function drawCircle() {
//   gl.fillStyle = "#ffffff"
//   gl.beginPath()
//   gl.arc(x - 100, y, 20, 0, Math.PI * 180)
//   gl.fill()
// }

// function drawRectangle(x, y, width, height, color = null) {
//   gl.fillStyle = color
//   gl.fillRect(x, y, width, height)
// }

// var dx = 1
// var dy = 0

// function circlemove() {
//   gl.clearRect(0, 0, canvas.width, canvas.height)
//   x += dx
//   y += dy
// }

// function crash() {
//   const dis = distance(x, y, center.x + 200, center.y - 50)
//   if(dis <= 53) {
//     dx = -dx
//   }
// }

// // function rungeKutta(deltatime, deltatimedis) {
// //   const del = deltatime
// //   const deldis = deltatimedis
// //   const inc = deldis / del
// //   const incs = []
// //   let vel = 0

// //   for (let i = 0; i < 4; i++){
// //     if (i == 0){
// //       incs[i] = (deldis/2) * inc
// //     }else{
// //       incs[i] = ((deldis/2)*incs[i-1]) / del + (1/2)*deldis
// //     }
// //     vel += incs[i]
// //   }
// //   return vel
// // }
// let deltatime = performance.now() / 1
// let deltatimedis

// function loop() {
//   deltatime = performance.now() / 1 - deltatime
//   deltatimedis = deltatime + deltatime
//   //circlemove()
  
//   //drawCircle()
  
//   drawRectangle(center.x + 100, center.y - 50, 50, 100,"#ffff55")
//   //rungeKutta(deltatime, deltatimedis)
//   //crash()
//   deltatime = performance.now() / 1

//   requestAnimationFrame(loop)
// }

// requestAnimationFrame(loop)