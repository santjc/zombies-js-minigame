function Flyenemy(x, y) {

    this.x = x;
    this.y = y;
    this.movement = random(2, 4);
    this.length = 15;
    this.r = 5;
    this.index = 0;
    this.delete = false;
    this.start_range = mobile ? -2000 : -1000;
    this.end_range = mobile ? -200 : 0;


    this.moveEnemy = function () {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, this.length, 5);
        this.x += this.movement;

        if (this.x > width) {
            this.x = 0 + random(this.start_range, this.end_range);
            this.y = random(36, height / 1.5);
        }
    }

    this.hit = function (enemy) {
        var distance = dist(this.x, this.y, enemy.pos.x - 20, enemy.pos.y);
        if (distance < this.r + enemy.size && this.delete == false) {
            return enemy.hp--;
        }
    }

    this.destroy = function () {
        this.delete = true;
        this.movement = 0;
    }

    this.showSprite = function (animation) {
        push();
        var animLength = animation.length;
        translate(this.x, this.y);
        imageMode(CENTER);
        let index = floor(this.index) % animLength;
        image(animation[index], 0, 0);
        pop();

    }
    this.animateSprite = function (speed) {
        this.index += speed;

    }
}