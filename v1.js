const canvas = document.getElementById('tutorial');
const ctx = canvas.getContext('2d');
canvas.style.width = '100vw';
canvas.style.height = '100vh';

class Ghost {
  constructor (x, y, radius, vx, vy, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  }
  draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
  }
  move() {
    if (this === playerGhost) {
      if (leftPressed) {
        this.vx = -speed;
      } else if (rightPressed) {
        this.vx = speed;
        } else {
        this.vx = 0;
        }
        
        if (upPressed) {
        this.vy = -speed;
        } else if (downPressed) {
        this.vy = speed;
        } else {
        this.vy = 0;
        }
    }

    this.x += this.vx;
    this.y += this.vy;
  
    if (this.y + this.vy > canvas.height - this.radius  || this.y + this.vy < this.radius) {
      this.vy = -this.vy;
    }
    if (this.x + this.vx > canvas.width - this.radius || this.x + this.vx < this.radius) {
      this.vx = -this.vx;
    }
    for (let i = 0; i < ghostArray.length; i++) {
      let otherGhost = ghostArray[i];
      if (otherGhost === this) {
        continue;
      }

      let distance = Math.sqrt(Math.pow(this.x - otherGhost.x, 2) + Math.pow(this.y - otherGhost.y, 2));
      
      // check if the distance between the centers of the two ghosts is less than the sum of their radii
      if (distance < this.radius + otherGhost.radius) {
        if (this === playerGhost) {
          alert("You lose!");
          return;
        }

        // calculate the angle of collision
        let angle = Math.atan2(otherGhost.y - this.y, otherGhost.x - this.x);
        // calculate the velocity of each ghost after collision using the angle of collision and the conservation of momentum
        let m1 = 1;
        let m2 = 1;
        let u1 = this.vx * Math.cos(angle) + this.vy * Math.sin(angle);
        let u2 = otherGhost.vx * Math.cos(angle) + otherGhost.vy * Math.sin(angle);
        let v1 = (u1 * (m1 - m2) + 2 * m2 * u2) / (m1 + m2);
        let v2 = (u2 * (m2 - m1) + 2 * m1 * u1) / (m1 + m2);
        this.vx = v1 * Math.cos(angle) - this.vy * Math.sin(angle);
        this.vy = v1 * Math.sin(angle) + this.vy * Math.cos(angle);
        otherGhost.vx = v2 * Math.cos(angle) - otherGhost.vy * Math.sin(angle);
        otherGhost.vy = v2 * Math.sin(angle) + otherGhost.vy * Math.cos(angle);
        
      }
    }
  }
}

const radius = 25;
const speed = 1;

const ghostArray = [
new Ghost(100, 300, radius, speed, speed, 'yellow'),
new Ghost(300, 100, radius, speed, speed, 'red'),
new Ghost(400, 200, radius, speed, speed, 'green'),
new Ghost(200, 400, radius, speed, speed, 'blue'),
];

const playerGhost = new Ghost(250, 250, radius, 0, 0, 'purple');
ghostArray.push(playerGhost);

let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      leftPressed = true;
      break;
    case 38: // up arrow
      upPressed = true;
      break;
    case 39: // right arrow
      rightPressed = true;
      break;
    case 40: // down arrow
      downPressed = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      leftPressed = false;
      break;
    case 38: // up arrow
      upPressed = false;
      break;
    case 39: // right arrow
      rightPressed = false;
      break;
    case 40: // down arrow
      downPressed = false;
      break;
  }
});



function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ghostArray.length; i++) {
    ghostArray[i].draw();
    ghostArray[i].move();
  }

  window.requestAnimationFrame(render);
}

render();