import * as me from 'melonjs';
import resources from './resources.js';
import {PlayerEntity, EnemyEntity, CoinEntity, BoxEntity, BootsEntity} from './entities.js';
import PlayScreen from './screens.js';
import { DebugPanelPlugin } from "debugPlugin";
export default function onload() {

    // init the video
    if (!me.video.init(800, 600, {parent : "screen", scaleMethod : "flex-width",  renderer : me.video.WEBGL, preferWebGL1 : false, depthTest: "z-buffer", subPixel : false})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // register the debug plugin
    me.plugin.register(DebugPanelPlugin,  "debugPanel");

    // allow cross-origin for image/texture loading
	me.loader.setOptions({ crossOrigin : "anonymous" });

    // set all ressources to be loaded
    me.loader.preload(resources, () => {

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

        // set the fade transition effect
        me.state.transition("fade", "#FFFFFF", 250);

        // register our objects entity in the object pool
        me.pool.register("player", PlayerEntity);
        me.pool.register("EnemyEntity", EnemyEntity);
        me.pool.register("box", BoxEntity);
        me.pool.register("coin", CoinEntity, true);
        me.pool.register("boots",BootsEntity);

      // commenting out texture; do we not have in this game, but I don't know that this setup can work without one. We'll see!
        // load the texture atlas file
        // this will be used by renderable object later
//        game.texture = new me.TextureAtlas(
//            me.loader.getJSON("texture"),
//            me.loader.getImage("texture")
//        );

        // switch to PLAY state
        me.state.change(me.state.PLAY);
    });
}
/* Commenting out original main function
export default function onload() {
    if (!me.video.init('jsapp', 320, 240, true, 2.0)) {
      alert("html 5 canvas is not supported by this browser.");
      return;
    }
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(resources);
    me.state.change(me.state.LOADING);
  },
  loaded: function() {
    me.state.set(me.state.PLAY, new PlayScreen());
    me.entityPool.add("player",PlayerEntity);
    me.entityPool.add("coin", CoinEntity);
    me.entityPool.add("box", boxEntity);
    me.entityPool.add("EnemyEntity",EnemyEntity);
    me.entityPool.add("boots",BootsEntity);
    me.gamestat.add("coins", 0);
    me.gamestat.add("totalCoins", 7);
    me.state.change(me.state.PLAY);
    me.state.set(me.state.MENU, new TitleScreen());
    me.state.transition("fade", "#2FA2C2", 250);
    me.state.change(me.state.MENU);
  }
};
window.onReady(function() {
  jsApp.onload();
});
*/
