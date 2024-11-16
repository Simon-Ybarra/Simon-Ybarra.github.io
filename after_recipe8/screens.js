var PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    me.levelDirector.loadLevel("level1");
    document.getElementById('game_state').innerHTML = "Collect all of the coins!";
    document.getElementById('instructions').innerHTML = "Arrows to move and Space to jump.";
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
  },
  onDestroyEvent: function() {
    me.gamestat.reset("coins");
  }
});
var TitleScreen = me.ScreenObject.extend({
  init: function() {
    this.parent(true);
    me.input.bindKey(me.input.KEY.SPACE, "jump", true);
  },
  onResetEvent: function() {
    document.getElementById('game_state').innerHTML = "";
    document.getElementById('instructions').innerHTML = "";
    if (this.title == null) {
      this.title = me.loader.getImage("titleScreen");
    }
  },
  update: function() {
    if (me.input.isKeyPressed('jump')) {
      me.state.change(me.state.PLAY);
    }
    return true;
  },
  draw: function(context){
    context.drawImage(this.title, 50, 50);
  }
});
