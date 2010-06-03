Mootils.SlideShow = new Class({
  Implements: Options,
  options: {
    parent: null,
    selector: null,
  	type: 'fade',
    delay: 4000,
    autoStart: true,
    randomStart: true,
    randomPlay: false,
    slideDelay: 500,
    fadeInDelay: 1000,
    fadeOutDelay: 1000
  },
  initialize: function(options) {
    this.setOptions(options);
    this.slides = $$('#' + this.options.parent + ' ' + this.options.selector);
    if (this.slides.length > 1) { 
    	this.setup();
    	if (this.options.autoStart) this.start();
    }
    this.observeChange = this.handleChange.bind(this);
    this.addEvent('change', this.observeChange);
  },
  setup: function() {   	      
    this.tInt = 0;
    this.totalSlides = this.slides.length;
    this.curSlideNum = this.lastSlideNum = this.options.randomStart ? Mootils.randomRange(1, this.totalSlides) : 1;
    this.curSlide = this.slides[this.curSlideNum - 1];
		this.showSize = $(this.options.parent).getCoordinates();
		this.showSize.height = this.curSlide.getSize().y;
		$(this.options.parent).setStyles({ 'overflow': 'hidden', 'width': this.showSize.width, 'height': this.showSize.height });
    var pos = $(this.options.parent).getStyle('position');
    if (!pos || pos === 'static') $(this.options.parent).setStyle('position', 'relative');
    switch (this.options.type) {
    	case 'slide':
    		this.slideHolder = new Element('div', {'styles': { 'position': 'absolute', 'left': 0, 'top': 0, 'width': 'auto', 'height': this.showSize.height, 'white-space': 'nowrap' }}).inject(this.options.parent);
	  	  for (var i = 0, l = this.totalSlides; i < l; i++) this.slideHolder.adopt(this.slides[i].setStyles({ 'position': 'relative', 'width': this.showSize.width, 'float': 'left' }));
    		break;
    	case 'verticalSlide':
    		this.slideHolder = new Element('div', {'styles': { 'position': 'absolute', 'top': 0, 'width': this.showSize.width, 'height': 'auto' }}).inject(this.options.parent);
	  	  for (var i = 0, l = this.totalSlides; i < l; i++) this.slideHolder.adopt(this.slides[i].setStyles({ 'position': 'relative' }));
    		break;
    	default:
    		var i = this.totalSlides;
    		while (i--) {
    		  if (i !== (this.curSlideNum - 1)) this.slides[i].setStyles({ 'z-index': 0, 'opacity': 0 });
          else this.slides[i].setStyle('z-index', 5000);
    		}
    		break;
    }
  },
  start: function() {
    this.lastSlideNum = this.curSlideNum;
    this.totalSlides = this.slides.length;
  	this.setDelay();
   	this.setStatus('playing');
   	this.fireEvent('change');
  	return this;
  },
  stop: function() {
   	this.lastSlideNum = this.curSlideNum;
   	this.setStatus('stopped');
   	this.tInt = $clear(this.tInt);
   	this.sInt = $clear(this.sInt);
   	this.fireEvent('change');
  	return this;
  },
  next: function() {
  	this.lastSlideNum = this.curSlideNum;
  	this.curSlideNum++;
    if (this.curSlideNum > this.totalSlides) this.curSlideNum = 1;
    this.fireEvent('change');
    return this;
  },
  previous: function() {
  	this.lastSlideNum = this.curSlideNum;
  	this.curSlideNum--;
    if (this.curSlideNum < 1) this.curSlideNum = this.totalSlides;
    this.fireEvent('change');
    return this;
  },
  handleChange: function(evt) {
    if (this.lastSlideNum === this.curSlideNum) return false;
    switch (this.options.type) {
    	case 'slide':
    		this.slideTransition();
    		break;
    	case 'verticalSlide':
    		this.verticalSlideTransition();
    		break;
    	default:
    		this.fadeTransition();
    }
  },
  slideTransition: function() {
  	var toX = -(this.showSize.width * (this.curSlideNum - 1));
  	this.slideHolder.get('tween', { property: 'left', duration: this.options.slideDelay }).start(toX);
  },
  verticalSlideTransition: function() {
  	var toY = -(this.showSize.height * (this.curSlideNum - 1));
  	this.slideHolder.get('tween', { property: 'top', duration: this.options.slideDelay }).start(toY);
  },
  fadeTransition: function() {
    if ($chk(this.curSlide)) this.lastSlide = this.curSlide;
    this.curSlide = this.slides[this.curSlideNum - 1];
    if ($chk(this.lastSlide)) {
      this.lastSlide.get('tween', { property: 'opacity', duration: this.options.fadeOutDelay, onComplete: function() {
        this.lastSlide.setStyle('z-index', 0);
      }.bind(this)}).start(0);
    }
    this.curSlide.setStyle('z-index', 5000).get('tween', { property: 'opacity', duration: this.options.fadeInDelay }).start(1);
  },
  setSlide: function(slide) {
  	this.stop();
  	this.curSlideNum = slide > 0 && slide <= this.totalSlides ? slide : this.curSlideNum;
  	this.fireEvent('change');
    return this;
  },
  setStatus: function(status) {
    this.status = status;
  	return this;
  },
  setDelay: function() {
  	if (arguments.length > 0) {
  		this.options.delay = arguments[0];
  		if (this.options.type === 'fade') {
	  		if ($chk(arguments[1])) this.options.fadeInDelay = arguments[1];
  			if ($chk(arguments[2])) this.options.fadeOutDelay = arguments[2];
  		} else {
  			if ($chk(arguments[1])) this.options.slideDelay = arguments[1];
  		}
  	}
  	this.tInt = $clear(this.tInt);
  	this.tInt = this.next.periodical(this.options.delay, this);
  },
  addEvent: function() {
    $(this.options.parent).addEvent.run(arguments, $(this.options.parent));
  },
  fireEvent: function() {
    $(this.options.parent).fireEvent.run(arguments, $(this.options.parent));
  }
});
