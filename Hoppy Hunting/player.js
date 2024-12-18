import * as me from 'melonjs';
import game from './game.js';

class BunnyEntity extends me.Entity {
    constructor(x, y, settings) {
        // call the constructor
        super(x, y , settings);

        // set a "player object" type
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setMaxVelocity(20, 20);
        this.body.setFriction(0.4, 0);

        this.dying = false;

//        this.multipleJump = 1;// jump counter property
        this.jumpX = 2;
        this.jumpY = 2;
        this.getReady = false;

        // set the viewport to follow this renderable on both axis, and enable damping
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.1);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left", true);
        me.input.bindKey(me.input.KEY.RIGHT, "right", true);
        me.input.bindKey(me.input.KEY.X,     "down", true);
        me.input.bindKey(me.input.KEY.UP,    "up", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,  "down", true);
        me.input.bindKey(me.input.KEY.Q, "ready", true);
        me.input.bindKey(me.input.KEY.A,     "left", true);
        me.input.bindKey(me.input.KEY.D,     "right", true);
        me.input.bindKey(me.input.KEY.W,     "up", true);
        me.input.bindKey(me.input.KEY.S,     "down", true);

        //me.input.registerPointerEvent("pointerdown", this, this.onCollision.bind(this));
        //me.input.bindPointer(me.input.pointer.RIGHT, me.input.KEY.LEFT);

        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT}, me.input.KEY.RIGHT);

        // map axes
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "Bunny0001.png", "Bunny0002.png", "Bunny0003.png",
            "Bunny0004.png"
        ]);

        // define basic stationary and jumping animations
        this.renderable.addAnimation("stand", [{ name: "Bunny0001.png", delay: 100 }]);
        this.renderable.addAnimation("jump",  [{ name: "Bunny0001.png", delay: 150 }, { name: "Bunny0002.png", delay: 200 }, { name: "Bunny0003.png", delay: 200 }, { name: "Bunny0004.png", delay: 200 }, { name: "Bunny0001.png", delay: 150 }]);
        this.renderable.addAnimation("ready", [{ name: "Bunny0004.png", delay: 100 }]);

        // set as default
        this.renderable.setCurrentAnimation("stand");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);
        
    }

    /**
     ** update the force applied
     Considerations:
     1. Ready should activate the ready animation and repurpose left/right/up/down key presses
     2. Jump bases itself on current jumpX/Y
     3. Ready and jump do not do anything while jumping/falling
     */
    update(dt) {
        if (me.input.isKeyPressed("jump")) {
            if (!this.body.falling && !this.body.jumping) {
                this.renderable.setCurrentAnimation("jump");
                this.body.jumping = true;
                this.body.force.y = -this.body.maxVel.y * this.jumpY / 5;
                if (this.renderable.isFlippedX) {
                    this.body.force.x = -this.body.maxVel.x * this.jumpX / 5;
                } else this.body.force.x = this.body.maxVel.x * this.jumpX / 5;
                this.getReady = false;
                this.jumpY = 2;
                game.data.jumpHeight = 2;
                this.jumpX = 2;
                game.data.jumpDistance = 2;
            }
        }
        if (me.input.isKeyPressed("left")){
            if (!this.getReady) {
                this.renderable.flipX(true);
            } else if (this.renderable.isFlippedX) {
                this.jumpX += 1;
                game.data.jumpDistance += 1;
            } else {
                this.jumpX -= 1;
                game.data.jumpDistance -= 1;
            }
        }
        if (me.input.isKeyPressed("right")){
            if (!this.getReady) {
                this.renderable.flipX(false);
            } else if (this.renderable.isFlippedX) {
                this.jumpX -= 1;
                game.data.jumpDistance -= 1;
            } else {
                this.jumpX += 1;
                game.data.jumpDistance += 1;
            }
        }
        if (me.input.isKeyPressed("ready")) {
            if (!this.body.jumping && !this.body.falling) {
                this.renderable.setCurrentAnimation("ready");
                this.getReady = true;
            }
        }
        if (this.getReady) {
            if (me.input.isKeyPressed("up")) {
                this.jumpY += 1;
                game.data.jumpHeight += 1;
            }
            if (me.input.isKeyPressed("down")) {
                this.jumpY -= 1;
                game.data.jumpHeight -= 1;
            }
        }
            //this.renderable.setCurrentAnimation("jump");
            //this.body.jumping = true;
            /*if (this.multipleJump < 2) {
                // easy "math" for double jump
                this.body.jumping = true;//Moved jumping declaration into if statement to allow reset on the ground
                this.body.force.y = -this.body.maxVel.y * this.multipleJump++;
                me.audio.stop("jump");
                me.audio.play("jump", false);
            }
        } else {
            if (!this.body.falling && !this.body.jumping) {
                // reset the multipleJump flag if on the ground
                this.multipleJump = 1;
            }
            else if (this.body.falling && this.multipleJump < 2) {
                // reset the multipleJump flag if falling
                this.multipleJump = 2;
            }
        }*/
        //Modified multipleJump check to turn off infinite jumps.


        /*if (this.body.force.x === 0 && this.body.force.y === 0) {
            this.renderable.setCurrentAnimation("stand");
        }*/

        // check if we fell into a hole
        if (!this.inViewport && (this.getBounds().top > me.video.renderer.height)) {
            // if yes reset the game
            //reset score first
            game.data.carrots = 0;
            me.game.world.removeChild(this);
            me.game.viewport.fadeIn("#fff", 150, function(){
                //me.audio.play("die", false);
                me.level.reload();
                me.game.viewport.fadeOut("#fff", 150);
            });
            return true;
        }

        // check if we moved (an "idle" animation would definitely be cleaner)
        /*if (this.body.vel.x !== 0 || this.body.vel.y !== 0 ||
            (this.renderable && this.renderable.isFlickering())
        ) {
            super.update(dt);
            return true;
        }
        return false;*/
        return true;
    }


    /**
     * collision handler
     */
    onCollision(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                // Custom collision response for slopes
                else if (other.type === "slope") {
                    // Always adjust the collision response upward
                    response.overlapV.y = Math.abs(response.overlap);
                    response.overlapV.x = 0;

                    // Respond to the slope (it is solid)
                    return true;
                }
                return true;
                break;

            /*case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;*/

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }

    /**
     * ouch
     */
    /*hurt() {
        var sprite = this.renderable;

        if (!sprite.isFlickering()) {
            // lose some score
            game.data.score -= 100;

            // tint to red and flicker
            sprite.tint.setColor(255, 192, 192);
            sprite.flicker(750, function () {
                // clear the tint once the flickering effect is over
                sprite.tint.setColor(255, 255, 255);
            });

            // flash the screen
            me.game.viewport.fadeIn("#FFFFFF", 75);
            me.audio.play("die", false);
        }
    }*/
};

export default BunnyEntity;
