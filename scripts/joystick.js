function Joystick(xPosition, yPosition, diameter) {
    this.psn = createVector(xPosition, yPosition);
    this.stickPsn = this.psn.copy(); //set default stick position in the center
    this.d = diameter;
    this.ctrl = false;
    this.fingerPsn;
    this.shoot_mode = false;
    this.value = createVector(0, 0);

    this.sprite = loadImage('./assets/bomb.png');

    //use joystick only when touch starts on it
    this.activateJoystick = function (command) {
        this.fingerPsn = createVector(mouseX, mouseY);
        var distance = p5.Vector.dist(this.fingerPsn, this.psn);
        //if the touch started within the joystick
        if (distance < this.d / 2 && command) {
            //raise the flag to update the joystick
            this.ctrl = true;
        } else {
            //set the joystick position in the center
            this.stickPsn = this.psn.copy();
            this.value = this.value.setMag(0);
            //lower the flag to avoid updating the joystick
            this.ctrl = false;
        }
    }

    this.update = function () {
        //check for a risen update flag
        if (this.ctrl) {
            this.fingerPsn = createVector(mouseX, mouseY);
            this.stickPsn = p5.Vector.sub(this.fingerPsn, this.psn);
            //limit the stick position to the radius of the joystick
            this.stickPsn.limit(this.d / 2);
            this.value = this.stickPsn.copy();
            //translate the stick position relative to the joystick center
            this.stickPsn = p5.Vector.add(this.psn, this.stickPsn);
        }
    }

    this.getValue = function () {
        //edit the speed vector magnitude as needed here  
        this.value = this.value.mult(0.1);
        return this.value;
    }

    this.render = function () {
        //draw the base

        push();

        if (this.shoot_mode) {
            // rectMode(CENTER);
            // fill(150,0,0,50);
            // //rect(this.psn.x, this.stickPsn.y, this.d*1.4, this.d);
            // fill(150,100);
            // rectMode(CENTER)
            // strokeWeight(2);
            // stroke(255);    
            // // rect(this.psn.x, this.stickPsn.y, this.d, this.d/2);
            // rect(this.psn.x, this.stickPsn.y, this.d*1.1, this.d/1.5);
            // fill(150,0,0,50);
            // rect(this.psn.x, this.stickPsn.y, this.d*1.1, this.d/1.5);
            // fill(255, 0, 0, 255);
            // textSize(28);
            // strokeWeight(0);
            // textAlign(CENTER,CENTER);
            // text(txt_bomb, this.psn.x, this.stickPsn.y);
            //flags[9]
            strokeWeight(2);
            stroke(255);    
            fill(255, 0, 0, 128);
            ellipse(this.psn.x, this.psn.y, this.d, this.d);
            imageMode(CENTER, CENTER);
            image(flags[9], width * 0.2, height - height / 3);

        } else {
            stroke(230, 80);
            strokeWeight(this.d / 20);
            fill(150, 30);
            ellipse(this.psn.x, this.psn.y, this.d, this.d);

            //draw the stick
            stroke(150);
            strokeWeight(this.d / 3);
            line(this.psn.x, this.psn.y, this.stickPsn.x, this.stickPsn.y);

            stroke(60);
            strokeWeight(this.d / 20);
            fill(50);
            ellipse(this.stickPsn.x, this.stickPsn.y, 2 * this.d / 3, 2 * this.d / 3);
        }
        pop();

    }


}