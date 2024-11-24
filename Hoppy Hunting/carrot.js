import * as me from 'melonjs';
import game from './game.js';

class CarrotEntity extends me.Collectable {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: game.texture,
                region : "Carrot.png",
                shapes :[new me.Rect(x, y, 16, 9)] // carrots are 16x9.
            })
        );
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
        //this.shift(x, y);
        // only check for collision against player
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

    /**
     * collision handling
     */
    onCollision(/*response*/) {

        // do something when collide
        //me.audio.play("cling", false);
        // give some score
        game.data.carrots += 1;

        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        me.game.world.removeChild(this);

        return false;
    }
};

export default CarrotEntity;
