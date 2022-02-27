function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.acc = 0.2;
    this.velocity = 0;
    this.delete = false;
    this.index = 0;
    this.explode = false;

    this.show = function (img) {
        if (this.explode == false) {
            imageMode(CENTER);
            image(img, this.x, this.y, 16, 16);
        }
    }

    this.move = function (ship) {
        if (this.y < height - 35) {
            this.velocity += this.acc;
            this.y += this.velocity;
        }
    }

    this.destroy = function () {
        this.delete = true;
        this.explode = true;


    }

    

    this.hit = function (enemy) {
        var distance = dist(this.x, this.y, enemy.pos.x, enemy.pos.y);
        if (distance < this.r + enemy.r) {
            return this.explode = true;
            
        } else {
            return this.explode = false;
        }
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