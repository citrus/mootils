// COPYRIGHT 2009 - CitrusMediaGroup - All Rights Reserved

Mootils.PhotoController = new Class({
  Implements: [Events],
  lastIndex: 0,
  index: 0,
  initController: function() {
    this.srcs = this.srcs || [];
    if (!this.options) this.options = {};
    if (this.options.index) this.setIndex(this.options.index);
    if (this.options.useKeyboard) $(window).addEvent('keyup', this.handleKeys.bindWithEvent(this));
    this.evtLoad = this.handleLoad.bindWithEvent(this);
  	this.fireEvent('change', this.index);
    return this;
  },
  clear: function() {
  	this.imgA = this.imgA ? this.imgA.destroy() : null;
  	this.imgA = this.imgB.removeEvents();
  	return this;
  },
  play: function() {
    if (this.slideInt) this.slideInt = $clear(this.slideInt);
    this.slideInt = this.next.periodical(this.options.slideDelay, this);
    return this;
  },
  stop: function() {
    this.slideInt = $clear(this.slideInt);
    return this;
  },
  next: function() {
    this.lastIndex = this.index;
    this.index++;
    if (this.srcs.length <= this.index) this.index = 0;
    return this.transition();
  },
  previous: function() {
    this.lastIndex = this.index;
    this.index--;
    if (this.index < 0) this.index = this.srcs.length - 1;
    return this.transition();
  },
  transition: function() {
  	this.imgB = this.imgA.clone().fade(0);
  	this.imgB.setStyle('opacity', 0).addEvent('load', this.evtLoad).set('src', this.srcs[this.index]).inject(this.imgA.getParent()).fade(1);
  	$clear(this.clearInt);
  	this.clearInt = this.clear.delay(500, this);
  	this.fireEvent('change', this.index);
    return this;
  },
  handleLoad: function(evt) {
    if (this.imgA) this.imgA.removeEvents();
    if (this.imgB) this.imgB.removeEvents();
    this.fireEvent('load', this.index);    
  },
  handleKeys: function(evt) {
    evt = new Event(evt).stop();
    switch(evt.key) {
      case 'up':
      case 'right':
        this.stop().next();
        break;
      case 'down':
      case 'left':
        this.stop().previous();
        break;
      case 'space':
        if (this.slideInt) this.stop();
        else this.play();
        break;
    }
  },
  setIndex: function(idx) {
    if (0 <= idx && idx < this.srcs.length) this.index = idx;
  	this.fireEvent('change', this.index);
    return this;
  }
});

