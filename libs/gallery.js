// COPYRIGHT 2009 - CitrusMediaGroup - All Rights Reserved

if (typeof(Mootils) === 'undefined') throw 'Mootils.Gallery requires the Mootils base.';

Mootils.Gallery = new Class({
  Implements: [Options, Events, Mootils.PhotoController],
	options: {
		photo: null,
		thumbs: null,
		fullsize: null,
		useKeyboard: true,
		slideshow: true,
		slideDelay: 4000
	},
  initialize: function(options) {
    this.setOptions(options);
    this.initController();
    this.addEvent('change', this.handleChange.bindWithEvent(this));
    this.setup();
    if (this.options.slideshow) this.play();
  },
  setup: function() {
    this.srcs = [];
    this.thumbs = $$(this.options.thumbs);
  	this.imgA = $(this.options.photo);
  	this.thumbs.each(function(el, idx) {
  	  if (idx === this.options.start) el.addClass('selected');
  	  this.srcs.push(this.thumbs[idx].get('rel'));
    	el.addEvent('click', this.handleClick.bindWithEvent(this, idx));
  	}.bind(this));
  	this.fireEvent('change', this.index); 
  	return this;
  },
  handleChange: function(evt) {
    this.thumbs[this.lastIndex].removeClass('selected');
    this.thumbs[this.index].addClass('selected');
  },
  handleClick: function(evt, idx) {
    evt = new Event(evt).stop();
    this.stop();
    if (idx === this.index) return false;
    this.lastIndex = this.index;
    this.index = idx;
    this.transition();
    return true;
  }
});


