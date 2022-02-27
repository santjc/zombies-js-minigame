function Helicopter() {
  this.acc = createVector(0, 0);
  this.vel = createVector(0, 0);
  this.pos = createVector(width / 2, 50);
  this.rotor = 0;
  this.size = 20;
  this.rotorAngle = 0;
  this.index = 0;
  this.hp = 5;
  this.isBreaking = false;

  this.show = function (animation) {
    push();
    var animLength = animation.length;
    translate(this.pos.x, this.pos.y);
    rotate(this.rotorAngle);

    imageMode(CENTER);
    let index = floor(this.index) % animLength;
    image(animation[index], 0, 0);
    pop();
  }

  this.update = function () {
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);


    if (displayWidth < 768) {
      this.vel.y = constrain(this.vel.y, -5, 5);
    } else {
      this.vel.y = constrain(this.vel.y, -2, 2);
    }
    this.rotorAngle = lerp(this.rotorAngle, 0, 0.02);
  
    if (this.pos.y >= height/1.6) {
      this.pos.y = height/1.6;
    } else if (this.pos.y <= 0) {
      this.pos.y = this.pos.y + 30;
    }

    if (this.pos.x + this.size > width) {
      this.pos.x = width - this.size;
    } else if (this.pos.x - this.size < 0) {
      this.pos.x = 0 + this.size;
    }
    if (this.pos.y + this.size * 3 > height) {
      this.pos.y = height - this.size * 3;
    } else if (this.pos.y - this.size < 0) {
      this.pos.y = 0 + this.size;
    }
  }


  this.animateSprite = function (speed) {
    this.index += speed;
  }

  this.addForce = function (force) {
    this.acc.add(force);
  }

}