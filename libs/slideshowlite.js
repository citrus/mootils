//- COPYRIGHT 2009 CITRUS MEDIA GROUP -//

if (typeof(Mootils) === 'undefined') throw 'Mootils.SlideShow requires the Mootils base.';

Mootils.SlideShow = new Class({
  Implements: [Options, Events],
  options: {
  	delay: 4350,
  	fadeDelay: 1000,
    randomStart: true
  },
  initialize: function(container, slides, options) {
    this.index = 0;
    this.div = $(container);
    this.slides = $splat(slides);
    this.setOptions(options);
    this.setup();
    if (this.options.randomStart) this.randomize();
    this.play();
  },
  setup: function() {
    var i = this.slides.length;
    var s = this.div.getSize();
    while (i--) {
      if ($type(this.slides[i]) === 'string') {
        this.slides[i] = new Element('div', {
          'styles': {
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': s.x,
            'height': s.y,
            'opacity': 0,
            'background': 'transparent url(' + this.slides[i] + ') 0 0 no-repeat'
          }
        });
      }
    }
  },
  play: function() {
    this.tInt = this.transition.periodical(this.options.delay, this);  
  },
  stop: function() {
    this.index = 0;
    this.tInt = $clear(this.tInt);
  },
  transition: function() {
    var last = this.slides[this.lastIndex];
    if ($chk(this.lastIndex)) this.slides[this.lastIndex].get('tween', { property: 'opacity', duration: this.options.fadeDelay, onComplete: function(){
      last.setStyle('z-index', 0).dispose();
    }}).start(0);
    this.slides[this.index].setStyles({ 'z-index': 4000, 'opacity': 0 }).inject(this.div).get('tween', { property: 'opacity', duration: this.options.fadeDelay }).start(1);
    this.lastIndex = this.index;
    this.advance();
    this.prepSlide();
  },
  randomize: function() {
  	this.index = Mootils.randomRange(0, this.slides.length - 1);
  	this.transition();
  },
  prepSlide: function() {
    console.log(this.index);
    this.slides[this.index].setStyles({ 'z-index': 0, 'opacity': 0 }).inject(this.div);
  },
  advance: function() {
    this.index++;
    if (this.slides.length <= this.index) this.index = 0;
  }
});