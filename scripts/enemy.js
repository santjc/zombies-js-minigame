function Enemy(x){
    this.pos = createVector(x,height-50);
    this.r = 10;
    this.hp = 0;
    this.dead = false;
    this.hit = false;
    this.inCount = 0;
    this.movement = random(0.5,1.2);
    this.spriteV = random(0.01,0.1);
    this.scorePoints = random(0,100);
    this.index = 0;

    this.show = function(animation){
        push();
        var animLength = animation.length;
        translate(this.pos.x, this.pos.y);
        imageMode(CENTER);
        let index = floor(this.index) % animLength;
        image(animation[index], 0, 0, 32, 32);
        pop();

        if(this.scorePoints == 50){
            fill(150);
            circle(this.pos.x, this.pos.y, 2,2);
        }
        if(this.hp == 2){
            this.dead = true;
        }
        if(this.pos.x < 0){
            this.dead = true;
        }
    }

    this.move = function(){
        
        if(this.pos.x > 0){
            this.pos.x -= this.movement;
        }

        if(this.pos.x <= 10){
            this.pos.x = random(width,width+200);
        }
        


    }
    
    this.animateSprite = function (speed) {
        this.index += speed + this.spriteV;
      }
}