import Phaser from 'phaser';
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

var posX = 100;
var posY = 200;
var characterView = "front";
const characterWidth = 42;
const characterHeight = 70;
const characterVelocity = 2;

class Game extends Phaser.Scene {

    constructor() {
        super({
            key: 'game'
        })
    }

    preload() {
        this.load.image("character-front", "./public/assets/character/front/1.png");
        this.load.image("character-back", "./public/assets/character/back/1.png");
        this.load.image("character-left", "./public/assets/character/left/1.png");
        this.load.image("character-right", "./public/assets/character/right/1.png");
        this.load.image("map", "./public/assets/background.jpg");
    }

    create() {
        this.cameras.main.setBounds(0, 0, 3927, 1904);
        this.add.image(0, 0, 'map').setOrigin(0);
        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(posX, posY);

        this.character = this.physics.add.image(posX, posY, "character-front");
        this.character.setCollideWorldBounds(true);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.fullscreenEvent(this);

        
        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {
            x: this.cameras.main.displayWidth/2,
            y: this.cameras.main.displayHeight - 120,
            radius: 60,
            base: this.add.circle(0, 0, 80, 0x888888),
            thumb: this.add.circle(0, 0, 40, 0xcccccc),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        })
            .on('update', this.dumpJoyStickState, this);
        this.text = this.add.text(0, 0, '', { fontSize: '20pt', color: 'red' });
        //this.dumpJoyStickState();
    }

    update(time, delta) {
        this.keyEvents(this);
        this.joyStickEvents(this.joyStick, name, this);
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                this.joyStickEvents(this.joyStick, name, this);
                s += name + ' ';
            }
        }
        s += '\n';
        s += ('Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n');
        s += ('Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n');
        this.text.setText(s);
    }

    joyStickEvents(joyStick, key, game) {
        game.character.setVelocityX(Math.floor(joyStick.forceX * 100) / 100);
        game.character.setVelocityY(Math.floor(joyStick.forceY * 100) / 100);
        /*
        if (key === 'right') {
            if (this.verifyMove('x', game, 1)) {
                game.character.setVelocityX(Math.floor(joyStick.forceX * 100) / 100);
                game.cameras.main.centerOnX(game.character.x);
            }
            this.updateCharacterView(game, "right");
        }
        if (key === 'left') {
            if (this.verifyMove('x', game, -1)) {
                game.character.setVelocityX(Math.floor(joyStick.forceX * 100) / 100);
                game.cameras.main.centerOnX(game.character.x);
            }
            this.updateCharacterView(game, "left");
        }
        if (key === 'up') {
            if (this.verifyMove('y', game, -1)) {
                game.character.setVelocityY(Math.floor(joyStick.forceY * 100) / 100);
                game.cameras.main.centerOnY(game.character.y);
            }
            this.updateCharacterView(game, "back");
        }
        if (key === 'down') {
            if (this.verifyMove('y', game, 1)) {
                game.character.setVelocityY(Math.floor(joyStick.forceY * 100) / 100);
                game.cameras.main.centerOnY(game.character.y);
            }
            this.updateCharacterView(game, "front");
        }*/
    }

    fullscreenEvent(game) {
        var FKey = game.input.keyboard.addKey('F');
        FKey.on('down', function () {
    
            if (game.scale.isFullscreen) {
                game.scale.stopFullscreen();
            }
            else {
                game.scale.startFullscreen();
            }
    
        }, game);
    }

    keyEvents(game) {
        if (game.cursor.right.isDown) {
            if (this.verifyMove('x', game, 1)) {
                game.character.x += characterVelocity;
                game.cameras.main.centerOnX(game.character.x);
            }
            this.updateCharacterView(game, "right");
        }
        if (game.cursor.left.isDown) {
            if (this.verifyMove('x', game, -1)) {
                game.character.x -= characterVelocity;
                game.cameras.main.centerOnX(game.character.x);
            }
            this.updateCharacterView(game, "left");
        }
        if (game.cursor.up.isDown) {
            if (this.verifyMove('y', game, -1)) {
                game.character.y -= characterVelocity;
                game.cameras.main.centerOnY(game.character.y);
            }
            this.updateCharacterView(game, "back");
        }
        if (game.cursor.down.isDown) {
            if (this.verifyMove('y', game, 1)) {
                game.character.y += characterVelocity;
                game.cameras.main.centerOnY(game.character.y);
            }
            this.updateCharacterView(game, "front");
        }
    }

    updateCharacterView(game, orientation) {
        if (characterView !== orientation) {
            game.character.setTexture("character-" + orientation);
            characterView = orientation;
        }
    }

    verifyMove(axis, game, dir) {
        var move = true;
        if (axis === 'x') {
            for (var i = game.character.y - (characterHeight / 2); i < game.character.y + (characterHeight / 2); i++) {
                const color = game.textures.getPixel(game.character.x + (((characterWidth / 2) + characterVelocity) * dir), i, 'map');
                if (color.r === 0 && color.g === 0 && color.b === 0) {
                    move = false;
                    break;
                }
            }
        } else if (axis == 'y') {
            for (var i = game.character.x - (characterWidth / 2); i < game.character.x + (characterWidth / 2); i++) {
                const color = game.textures.getPixel(i, game.character.y + (((characterHeight / 2) + characterVelocity) * dir), 'map');
                if (color.r === 0 && color.g === 0 && color.b === 0) {
                    move = false;
                    break;
                }
            }
        }
        return move;
    }
}

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.F,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Game,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                //y: 500
            }
        }
    },
    plugins: {
        global: [{
            key: 'rexVirtualJoyStick',
            plugin: VirtualJoyStickPlugin,
            start: true
        }]
    }
};

new Phaser.Game(config);