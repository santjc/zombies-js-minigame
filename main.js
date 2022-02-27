var heli;
var flyenemy = [];
var enemys = [];
var bomb = [];
var index = 0;
var gravity;
var roll, torque = 0;
var steering;
var isSteering = false;
var joy, shoot = null;
var soundIndex = 0;
var audio_state = true;

var heliSprite = [];
var flags = [];
var expSprite = [];
var bombSprite;
var zombieSprite = [];
var buildSprite = [];
var bombDeadCount = 0;
var scoreCount = 0;
var generateZombies = false;
var timerValue = 65;
var timer_game_max = 60;
var screen_blink = 255;
var blink_add = -3;

//Keyboard cyles 
var mod_x = 0;
var mod_y = 0;
var mod_x_cycles = 0;
var mod_y_cycles = 0;
var max_cyles = 20;
var mid_cyles = 10;

//Audio
var audios = [];
var _playing = false;
var _play_stat = [];

//Screen
const SCR_PRE_TITLE = -1;
const SCR_TITLE = 0;
const SCR_INSTRUCTIONS = 1;
const SCR_GAMEPLAY = 2;
const SCR_GAME_END = 3;

var screen = SCR_PRE_TITLE;

var mobile = isMobileDevice();
var start_range = mobile ? -1500 : -1000;
var end_range = mobile ? -200 : 0;


function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function preload() {


    heliSprite[0] = loadImage("./assets/helicopter-frames/heli1.png");
    heliSprite[1] = loadImage("./assets/helicopter-frames/heli2.png");
    heliSprite[2] = loadImage("./assets/helicopter-frames/heli3.png");
    heliSprite[3] = loadImage("./assets/helicopter-frames/heli4.png");


    flags[0] = loadImage("./assets/env/crm-flag.png");
    flags[1] = loadImage("./assets/env/crm-sign.png");
    flags[3] = loadImage("./assets/env/build-2.png");
    flags[4] = loadImage("./assets/env/build-1.png");
    flags[2] = loadImage("./assets/env/floor.png");



    

    expSprite[0] = loadImage("./assets/explosion/exp1.png");
    expSprite[1] = loadImage("./assets/explosion/exp2.png");
    expSprite[2] = loadImage("./assets/explosion/exp3.png");
    expSprite[3] = loadImage("./assets/explosion/exp4.png");
    expSprite[4] = loadImage("./assets/explosion/exp5.png");
    expSprite[5] = loadImage("./assets/explosion/exp6.png");

    bombSprite = loadImage("./assets/explosion/bomb.png");


    zombieSprite[0] = loadImage("./assets/zombie-frames/zom1.png");
    zombieSprite[1] = loadImage("./assets/zombie-frames/zom2.png");
    zombieSprite[2] = loadImage("./assets/zombie-frames/zom3.png");
    zombieSprite[3] = loadImage("./assets/zombie-frames/zom4.png");

    flags[5] = loadImage("./assets/extra/amc-logo-pixel.png");
    flags[6] = loadImage("./assets/extra/amc-logo-nobg.png");
    flags[7] = loadImage("./assets/extra/key_directional2.png");
    flags[8] = loadImage("./assets/extra/key_fire2.png");
    flags[9] = loadImage("./assets/extra/bomb-2.png");
    
    console.log('loading audio');
    audios['intro'] = loadSound('./assets/audio/zombie-growl.mp3', function () {
        console.log('loaded intro');
    });
    audios['hi-zombie'] = loadSound('./assets/audio/zombie-gargles.mp3', function () {
        console.log('loaded hi-zombie');
    });
    audios['canon'] = loadSound('./assets/audio/canon2.mp3', function () {
        console.log('loaded canon');
    });
    audios['heli-hit'] = loadSound('./assets/audio/heli-hit.flac', function () {
        console.log('loaded heli-hit');
    });
    audios['heli-rotor'] = loadSound('./assets/audio/heli-rotor.flac', function () {
        console.log('loaded heli-rotor');
    });
    audios['siren'] = loadSound('./assets/audio/siren.ogg', function () {
        console.log('loaded siren');
    });
    audios['music'] = loadSound('./assets/audio/music.wav', function () {
        console.log('loaded music');
    });
    audios['explode'] = loadSound('./assets/audio/explode.wav', function () {
        console.log('loaded explode');
    });
    audios['drop-bomb'] = loadSound('./assets/audio/drop-bomb.wav', function () {
        console.log('loaded drop-bomb');
    });
    audios['cannon'] = loadSound('./assets/audio/cannon-1.mp3', function () {
        console.log('loaded cannon');
    });
    audios['win'] = loadSound('./assets/audio/win.mp3', function () {
        console.log('loaded win');
    });
    audios['lose'] = loadSound('./assets/audio/lose.wav', function () {
        console.log('loaded lose');
    });
    console.log('audio loaded');

    _play_stat['intro'] = false;
    _play_stat['hi-zombie'] = false;
    _play_stat['heli-hit'] = false;
    _play_stat['heli-rotor'] = false;
    _play_stat['siren'] = false;
    _play_stat['music'] = false;
    _play_stat['explode'] = false;
    _play_stat['drop-bomb'] = false;
    _play_stat['cannon'] = false;
    _play_stat['win'] = false;
    _play_stat['lose'] = false;
}

var mySynth = new p5.MonoSynth();


function setup() {
    if (windowWidth > 768) {
        createCanvas(800, 600);
    } else {
        createCanvas(windowWidth, windowHeight);
    }
    joy = new Joystick(width * 0.8, height - height / 3, height / 8);
    shoot = new Joystick(width * 0.2, height - height / 3, height / 10);
    shoot.shoot_mode = true;
    //shoot = new Joystick(width * 0.8, height - height / 3, height / 10);

    for (i = 0; i < 8; i++) {
        flyenemy[i] = new Flyenemy(random(start_range, end_range), random(36, height / 1.5));
    }

    for (var i = 0; i < 11; i++) {
        enemys[i] = new Enemy(random(width, width * 2));
    }
    setInterval(timeIt, 1000);
    angleMode(DEGREES);
    heli = new Helicopter();

}

function draw() {

    background(0);    
    masterVolume(0.7);
    if ((timerValue == timer_game_max) && ((screen == SCR_TITLE) || (screen == SCR_GAME_END))) {
        screen = SCR_INSTRUCTIONS;
    }

    if (screen == SCR_PRE_TITLE) {
        if (getAudioContext().state !== 'running') {
            //console.log('DISPLAY PRE TITLE');
            textFont("VT323");
            textAlign(CENTER);
            if (mobile) {
                textSize(30);
            } else {
                textSize(36);
            }
            fill(255);
            text(txt_no_audio_1, width / 2, (height / 2));
            text(txt_no_audio_2, width / 2, (height / 2) + 40);
        } else {
            //console.log('Jump directly to Title');
            screen = SCR_TITLE;
            timerValue = 65;
        }
    }
 
    if (screen == SCR_TITLE) {
        imageMode(CENTER);
        image(flags[5], width / 2, height / 2);
        fill(255);
        textFont("VT323");
        textAlign(CENTER);
        textSize(36);
        text(txt_game_title, width / 2, (height / 2) + 70);
        if (!_playing) {
            if ((audios['intro'].isLoaded) && (_play_stat['intro'] == false)) {
                _playing = true;
                _play_stat['intro'] = true;
                console.log('intro audio');                
                audios['intro'].play();
            } else {
                console.log('intro audio undefined');                
            }
        }
    }

    if (screen == SCR_INSTRUCTIONS) {
        fill(255);
        textFont("VT323");
        textAlign(CENTER);
        fill(255);
        textSize(32);
        text(txt_game_title, width / 2, height * 0.15);
        textSize(25);
        text(txt_instructions, width / 2, height * 0.35);
        imageMode(CENTER);
        image(flags[7], width / 2, height / 2);
        textSize(20);
        text(txt_instruction_move, width / 2, (height / 2) + 60);
        image(flags[8], width / 2 + 5, (height / 2) + 95);
        text(txt_instruction_drop, width / 2, (height / 2) + 140);
        fill(255, 0, 0);
        text(txt_press_key, width / 2, (height / 2) + 190);

        heli.hp = 10;
        heli.pos.x = width / 2;
        heli.pos.y = 50;
        scoreCount = 0;
        for (i = 0; i < 8; i++) {
            flyenemy[i] = new Flyenemy(random(start_range, end_range), random(36, height / 1.3));
        }
        for (var i = 0; i < 15; i++) {
            enemys[i] = new Enemy(random(width, width * 2));
        }


    }

    if (screen == SCR_GAMEPLAY) {
        fill(255);
        textFont("VT323");
        textAlign(CENTER);
        fill(255);
        if (mobile) {
            textSize(28);
        } else {
            textSize(32);
        }
        text(txt_kill_10, width / 2, height * 0.05);
        //Line
        strokeWeight(3);
        stroke('white');
        line(0, 45, width, 45);
        strokeWeight(0);
        // Stats
        textSize(20);
        textAlign(LEFT);
        text(txt_score + scoreCount, 15, height * 0.15);
        //Blink HP if Healt is low
        if (heli.hp <= 3) {

            fill(color(255, 0, 0, screen_blink));
            screen_blink = screen_blink + blink_add;
            if (screen_blink < 50) {
                blink_add = 3;
                screen_blink = screen_blink + (blink_add * 2);
                audios['siren'].play();
                audios['siren'].setVolume(0.5);

            }
            if (screen_blink > 255) {
                blink_add = -3;
                screen_blink = screen_blink + (blink_add * 2);
                audios['siren'].play();
                audios['siren'].setVolume(0.5);
            }
            // console.log(blink_add);
            // console.log(screen_blink);
        }
        text(txt_health + heli.hp, 15, 115);
        //Timer
        fill(255);
        textSize(32);
        textAlign(RIGHT);
        if (timerValue >= 10) {
            fill(255);
            text("0:" + timerValue, width - 15, height * 0.15);
        }
        if (timerValue < 10) {
            strokeWeight(3);
            stroke('red');
            text('0:0' + timerValue, width - 15, height * 0.15);
        }
        strokeWeight(0);
        if (timerValue > 50) {
            textAlign(CENTER);
            strokeWeight(0);
            fill(255, 0, 0);
            text(txt_move, width * 0.8, height * 0.55);
        }

        //Draw Background
        imageMode(CENTER);
        image(flags[2], width / 2, height - 20);
        image(flags[3], 350, height - 160);
        image(flags[3], 25, height - 160);
        image(flags[4], 160, height - 110);
        image(flags[0], width / 3, height - 48);
        image(flags[1], width / 2, height - 48);

        //Joystick update
        joy.update();
        joy.render();
        if (windowWidth < 768) {
            shoot.render();
        }

        if (windowWidth < 768) {
            joy.update();
            joy.render();
            shoot.render();
        }

        //Experimental keyboard handilng
        if (mod_x != 0) {
            heli.pos.x = heli.pos.x + mod_x;
            mod_x_cycles++;
        } else {
            mod_x_cycles = 0;
        }
        if (mod_y != 0) {
            heli.pos.y = heli.pos.y + mod_y;
            mod_y_cycles++;
        } else {
            mod_y_cycles = 0;
        }
        if (mod_x_cycles == mid_cyles) {
            mod_x = mod_x - 1;
        }
        if (mod_y_cycles == mid_cyles) {
            mod_y = mod_y - 1;
        }
        if (mod_x_cycles == max_cyles) {
            mod_x = 0;
        }
        if (mod_y_cycles == max_cyles) {
            mod_y = 0;
        }

        //Display Helicopter
        heli.show(heliSprite);
        heli.animateSprite(0.4);
        heli.update();
        steering = createVector(roll, -torque);
        heli.addForce(steering);

        torque = -joy.getValue().y;
        roll = joy.getValue().x;


        heli.rotorAngle += steering.x * 3.5;

        //Enemy fire handling
        for (i = 0; i < flyenemy.length; i++) {
            flyenemy[i].moveEnemy();
            if (flyenemy[i].hit(heli)) {
                audios['heli-hit'].play();
                flyenemy[i].destroy();
                heli.pos.x += random(10, 15);
            }
            if (flyenemy[i] != undefined) {
                if ((flyenemy[i].x >= 0) && (flyenemy[i].x <= 5)) {
                    if (audios['canon'].isPlaying() == false) {
                        console.log('shot cannon?');
                        // audios['canon'].play();  
                        audios['canon'].setVolume(1);                  
                    }
                }
            }

            if (flyenemy[i].delete) {
                flyenemy[i].showSprite(expSprite);
                flyenemy[i].animateSprite(0.1);
                index += 0.2;
                if (index >= expSprite.length) {
                    flyenemy.splice(i, 1);
                    index = 0;
                } 
                flyenemy[i] = new Flyenemy(random(start_range, end_range), random(36, height / 1.3));
            }
        }
        //Zombies handling
        if (timerValue % 5 == 0) {
            generateZombies = true;
        }
        if (generateZombies == true && enemys.length != 0) {
            for (var i = 0; i < enemys.length / 2; i++) {
                enemys[i].show(zombieSprite);
                enemys[i].animateSprite(0.07);
                enemys[i].move();
                if (audios['hi-zombie'].isPlaying() == false) {
                    console.log('new zombie?')
                    //audios['hi-zombie'].play();     
                    audios['hi-zombie'].setVolume(1);                                   
                }
            }
        }

        //Bomb handling
        for (var i = 0; i < bomb.length; i++) {
            bomb[i].show(bombSprite);
            bomb[i].move(heli);
            if (bomb[i].y > height / 2) {
                for (var j = 0; j < enemys.length; j++) {
                    if (bomb[i].hit(enemys[j])) {

                        enemys[j].hp++;
                    }

                    if (enemys[j].dead) {

                        scoreCount++;
                        enemys.splice(j, 1);

                    }
                }
                if (bomb[i].y > height - 35) {
                    bomb[i].destroy();
                }


                if (bomb[i].delete) {
                    bombDeadCount++;
                    bomb[i].showSprite(expSprite);
                    bomb[i].animateSprite(0.2);
                    index += 0.2;

                    soundIndex += 0.2;
                    if (soundIndex >= expSprite.length - 1) {
                        audios['explode'].play();
                        audios['explode'].setVolume(1);
                        soundIndex = 0;
                    }
                    if (index >= expSprite.length) {
                        bomb.splice(i, 1);
                        index = 0;
                    }


                }
            }
        }

        //End Page redirect
        if (timerValue == 0 || heli.hp == 0) {
            screen = SCR_GAME_END;
            _playing = true;
        }


    }
    if (keyIsPressed === true) {
        if (keyCode == RIGHT_ARROW) {
            heli.rotorAngle += 0.5;

        } else if (keyCode == LEFT_ARROW) {
            heli.rotorAngle -= 0.5;
        }

    }

    if (screen == SCR_GAME_END) {
        fill(255);
        textFont("VT323");
        textAlign(CENTER);
        fill(255);
        textSize(32);
        text(txt_game_title, width / 2, height * 0.05);

        //Draw Background
        imageMode(CENTER);
        image(flags[2], width / 2, height - 20);
        image(flags[3], 350, height - 160);
        image(flags[3], 25, height - 160);
        image(flags[4], 160, height - 110);
        image(flags[0], width / 3, height - 48);
        image(flags[1], width / 2, height - 48);

        audios['music'].stop();
        audios['heli-rotor'].stop();

        if (timerValue == 0 || heli.hp == 0) {

            imageMode(CENTER);
            image(flags[6], width / 2, height / 3);
            enemys.splice(0, enemys.length);
            flyenemy.splice(0, flyenemy.length);
        }

        if (timerValue == 0 && scoreCount < 10) {
            text(txt_gameover, width / 2, height / 2 + 64);
            fill(255, 0, 0);
            if (mobile) {
                textSize(28);
            } else {
                textSize(30);
            }
            text(txt_timeisup, width / 2, height / 2 + 128);
            textSize(32);
            fill(255);
            if (_playing) {
                _playing = false;
                audios['lose'].play();
            }
        }

        if (heli.hp <= 0) {
            text(txt_gameover, width / 2, height / 2 + 64);
            fill(255, 0, 0);
            if (mobile) {
                textSize(28);
            } else {
                textSize(30);
            }
            text(txt_youdied, width / 2, height / 2 + 128);
            textSize(32);
            fill(255);
            enemys.splice(0, enemys.length);
            flyenemy.splice(0, flyenemy.length);
            if (_playing) {
                _playing = false;
                audios['lose'].play();
            }
        }

        if (timerValue == 0 && scoreCount >= 10) {
            textSize(46);
            text(txt_you_win, width / 2, height / 2 + 34);
            if (_playing) {
                _playing = false;
                audios['win'].play();
            }
        }
        textSize(28);
        fill(255, 0, 0);
        if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
            strokeWeight(2);
            stroke(255,200);    
            text(txt_press_key_again, width / 2, (height / 2) + 190);
            strokeWeight(0);
            stroke('white');    
        }

    }

}

function timeIt() {
    if (timerValue > 0) {
        timerValue--;
    }
}

function startAudioBG(params) {
    audios['music'].loop();
    audios['music'].setVolume(0.7);
    audios['cannon'].play();
    audios['heli-rotor'].loop();
    audios['heli-rotor'].setVolume(0.2);
}

function keyPressed() {
    if (screen == SCR_PRE_TITLE) {
        if (audio_state == false) {
            if (getAudioContext().state !== 'running') {
                getAudioContext().resume();
            }
        }
        console.log('Jump to Title [key]');
        timerValue = 65;
        screen = SCR_TITLE;
    }    
    if (screen == SCR_INSTRUCTIONS) {
        screen = SCR_GAMEPLAY;
        timerValue = timer_game_max;
        startAudioBG()
    }
    if (screen == SCR_GAME_END) {
        if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
            screen = SCR_INSTRUCTIONS;
        }
    }
    if ((key === "S") || (key === "s") || (key === " ")) {
        var bullet = new Bullet(heli.pos.x, heli.pos.y);
        if (bomb.length == 0) {
            bomb.push(bullet);
            audios['drop-bomb'].play();
            audios['drop-bomb'].setVolume(0.2);
        }

    }

    if (keyCode === LEFT_ARROW) {
        mod_x = -2;
    } else {
        if (mod_x_cycles > max_cyles) {
            mod_x = 0
        }
    }
    if (keyCode === RIGHT_ARROW) {
        mod_x = 2;
    } else {
        if (mod_x_cycles > max_cyles) {
            mod_x = 0
        }
    }
    if (keyCode === UP_ARROW) {
        mod_y = -2;
    } else {
        if (mod_y_cycles > max_cyles) {
            mod_y = 0
        }
    }
    if (keyCode === DOWN_ARROW) {
        mod_y = 2;
    } else {
        if (mod_y_cycles > max_cyles) {
            mod_y = 0
        }
    }
    if (key === "q") {
        timerValue = 5;
    }

    return false;
}

function touchStarted() {
    if (screen == SCR_PRE_TITLE) {
        if (audio_state == false) {
            if (getAudioContext().state !== 'running') {
                getAudioContext().resume();
            }
        }
        console.log('Jump to Title [touch]');
        timerValue = 65;        
        screen = SCR_TITLE;
    }
    if (screen == SCR_INSTRUCTIONS) {
        screen = SCR_GAMEPLAY;
        timerValue = timer_game_max;
        startAudioBG();
    }
    if (screen == SCR_GAME_END) {
        if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
            screen = SCR_INSTRUCTIONS;
        }
    }
    joy.activateJoystick(true);
    shoot.activateJoystick(true);

    if (shoot.ctrl == true) {
        var bullet = new Bullet(heli.pos.x, heli.pos.y);
        if (bomb.length == 0) {
            audios['drop-bomb'].play();
            audios['drop-bomb'].setVolume(0.2);
            bomb.push(bullet);
        }
    }
    return false;
}

function mousePressed() {
    if (screen == SCR_PRE_TITLE) {
        if (audio_state == false) {
            if (getAudioContext().state !== 'running') {
                getAudioContext().resume();
            }
        }
        console.log('Jump to Title [mouse]');
        timerValue = 65;
        screen = SCR_TITLE;
    }
    if (screen == SCR_INSTRUCTIONS) {
        screen = SCR_GAMEPLAY;
        timerValue = timer_game_max;
        startAudioBG()
    }

    if (screen == SCR_GAME_END) {
        if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
            screen = SCR_INSTRUCTIONS;
        }
    }
    if (joy != null) {
        joy.activateJoystick(true);
        shoot.activateJoystick(true);
    
        if (shoot.ctrl == true) {
            var bullet = new Bullet(heli.pos.x, heli.pos.y);
            if (bomb.length == 0) {
                audios['drop-bomb'].play();
                audios['drop-bomb'].setVolume(0.2);
                bomb.push(bullet);
            }
        }
    }
}

function mouseReleased() {
    if (joy != null) {    
        joy.activateJoystick(false);
        shoot.activateJoystick(false);
        if (screen == SCR_GAME_END) {
            if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
                screen = SCR_INSTRUCTIONS;
            }
        }
    }
}


function touchEnded() {
    joy.activateJoystick(false);
    shoot.activateJoystick(false);
    if (screen == SCR_GAME_END) {
        if ((!audios['win'].isPlaying()) && (!audios['lose'].isPlaying())) {
            screen = SCR_INSTRUCTIONS;
        }
   }
    return false;
}