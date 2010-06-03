// COPYRIGHT 2008 - CitrusMediaGroup - All Rights Reserved

if (typeof(Mootils) === 'undefined') throw 'Mootils.Preview requires the Mootils base.';

Mootils.Preview = new Class({
  Implements: Options,
	options: {
		thumb: null,
		border: 0,
		showTransition: {
			time: 300,
			func: Fx.Transitions.Quad.easeOut
		},
		hideTransition: {
			time: 300,
			func: Fx.Transitions.Sine.easeOut
		},
		overlayOptions: {
			autoShow: true,
			zIndex: 7770
		},
		useOverlay: false,
		btnOptions: null
	},
  initialize: function(src, options){
    this.src = src;
    if (typeof(Mootils.Preview.$prototype) !== 'undefined') this.setOptions(Mootils.Preview.$prototype);
    this.setOptions(options);
    if (typeof(Mootils.NetStatus) !== 'undefined') this.ldr = new Mootils.NetStatus({ alignWith: 'mouse' }).start();
    this.setupEvents().create().load(this.src);
		window.addEvent('keyup', this.evtKeys);
  },
  setupEvents: function() {
    this.evtLoad = this.handleLoad.bindWithEvent(this);
		this.evtClick = this.handleClick.bindWithEvent(this);
		this.evtKeys = this.handleKeyUp.bindWithEvent(this);
		this.evtScroll = this.handleScroll.bindWithEvent(this);
		this.evtResize = this.handleResize.bindWithEvent(this);
		return this;
  },
  create: function() {
    if (this.options.useOverlay) this.overlay = this.overlay || new Mootils.Overlay(this.options.overlayOptions);
  	this.img = new Element('img', {
      'styles': {
	  		'display': 'block',
      	'position': 'absolute',
				'border': this.options.border,
 	    	'opacity': 0,
 	    	'z-index': 7775
      },
      'events': {
      	'load': this.evtLoad
   	  }
   	});   	
   	if (this.options.btnOptions) {
      this.btn = new Element('div', {
        'text': this.options.btnOptions.text || '',
        'styles': {
          'display': 'block',
        	'position': 'absolute',
 	      	'cursor': 'pointer',
 	      	'z-index': 7780
        },
        'events': {
          'click': this.evtClick
        }
      });
      if (this.options.btnOptions.styles) this.btn.setStyles(this.options.btnOptions.styles);
    }
    return this;
 	},
 	dispose: function() {
   	window.removeEvent('scroll', this.evtScroll);
   	window.removeEvent('resize', this.evtResize);
 		this.img = this.img.dispose();
 	},
 	load: function(src) {
 	  this.active = true;
 	  this.src = src;
 	  this.img.setProperty('src', this.src + '?cc=' + Math.round(Math.random() * 100));
 	  return this;
 	},
 	show: function() {
 	  if (!this.img) this.create();
 	  if (this.btn) this.btn.fade('hide');
 	  this.img.setStyles({ 'width': 'auto', 'height': 'auto' });
 	  this.size = this.img.inject(document.body).getSize();
 		this.winSize = window.getSize();
 		this.winScroll = window.getScroll();
 		if (this.options.thumb && $(this.options.thumb)) {
 			var zoom = new Fx.Morph(this.img, { duration: this.options.showTransition.time, transition: this.options.showTransition.func });
 			this.img.setStyles( $(this.options.thumb).getCoordinates() );
 			zoom.start({ 'left': this.winScroll.x + (this.winSize.x * 0.5) - (this.size.x * 0.5) + 'px', 'top': this.winScroll.y + (this.winSize.y * 0.5) - (this.size.y * 0.5) + 'px',	'width': this.size.x, 'height': this.size.y, 'opacity': 1 });	
 			zoom.addEvent('complete', this.alignButton.bind(this))
 		} else {
 	    this.img.setStyles({ 'left': this.winScroll.x + (this.winSize.x * 0.5) - (this.size.x * 0.5) + 'px', 'top': this.winScroll.y + (this.winSize.y * 0.5) - (this.size.y * 0.5) + 'px' }).get('tween', { property: 'opacity', duration: this.options.showTransition.time }).start(1);
 	    this.alignButton();
   	} 
   	this.img.addEvent('click', this.evtClick);
   	if (this.overlay) this.overlay.show();
 	},
 	hide: function() {
 	  this.active = false;
 	  if (this.ldr) this.ldr.hide();
 		if (this.btn) this.btn.dispose();
 		if (this.options.thumb) {
 			var zoom = new Fx.Morph(this.img, { duration: this.options.hideTransition.time, transition: this.options.hideTransition.func });
 			var coords = $(this.options.thumb).getCoordinates();
 			zoom.start({
				'left': coords.left,
 				'top': coords.top,
 				'width': coords.width,
 				'height': coords.height,
				'opacity': 0
			});
 		} else {
 			this.img.get('tween', { property: 'opacity', duration: this.options.hideTransition.time }).start(0);
 		}
 	  if (this.overlay) this.overlay.hide();
 		this.dispose.delay(this.options.hideTransition.time, this);
 		return this;
 	},
 	align: function() {
 	  this.winSize = window.getSize();
 	  this.winScroll = window.getScroll();
 		this.img.setStyles({ 'left': this.winScroll.x + (this.winSize.x * 0.5) - (this.size.x * 0.5) + 'px', 'top': this.winScroll.y + (this.winSize.y * 0.5) - (this.size.y * 0.5) + 'px' });
 		this.alignButton();
 	},
 	alignButton: function() {
   	if (!this.btn) return this;
   	var pos = this.img.getPosition();
    this.btn.setStyles({ 'left': pos.x, 'top': pos.y }).inject(document.body).fade('in'); 
    return this;
 	},
 	removeEvents: function() {
		if (this.img) {
		  this.img.removeEvent(this.evtKeys);
   		this.img.removeEvent(this.evtClick);
   	}
 		if (this.btn) this.btn.removeEvent(this.evtClick);
 	},
 	handleLoad: function() {
 		if (this.ldr) this.ldr.hide();
 		this.show();
   	window.addEvent('scroll', this.evtScroll);
   	window.addEvent('resize', this.evtResize);
 	},
 	handleClick: function() {
 	  this.removeEvents();
 	  this.hide();
 	},
	handleKeyUp: function(evt) {
 	  switch (evt.key) {
		case 'esc':
	 	  this.removeEvents();
	 	  this.hide();	
			break;
	  }
 	},
 	handleScroll: function() {
 	  this.align();
  },
 	handleResize: function() {
 	  this.align();
  }
});


Mootils.previews = [];
Mootils.clearPreview = function() {
  if (Mootils.previews[0]) {
    Mootils.previews[0].hide();
    delete Mootils.previews[0];
    Mootils.previews.splice(0, 1);
  }
}
Mootils.preview = function() {
  var src = arguments[0];
  var options = arguments[1] || {};
  if (0 < Mootils.previews.length) {
    if (src === Mootils.previews[0].src) {
      if (!Mootils.previews[0].active) Mootils.previews[0].show();
      else return false;
    } else {
      Mootils.clearPreview();
     	Mootils.previews.push( new Mootils.Preview(src, options) );
    }
  } else Mootils.previews.push( new Mootils.Preview(src, options) );
}