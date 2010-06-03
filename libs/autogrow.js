//- COPYRIGHT 2009 CITRUS MEDIA GROUP -//

Mootils.AutoGrow = new Class({
  Implements: [Options, Events],
  options: {
    minHeight: 0,
  	maxCharacters: 8000
  },
  initialize: function(els, options) {
    this.textareas = $$(els);
    this.setOptions(options);
    this.setup();
  },
  setup: function() {
    this.textareas.each(function(el,idx) {
      el.setStyle('overflow', 'hidden');
      el.addEvent('focus', function(evt) {
        this.start(el);
      }.bind(this));
      el.addEvent('blur', function(evt) {
        this.stop();
      }.bind(this));
    }.bind(this));
  },
  start: function(focus) {
    if (this.checkInt) return false;
    this.cH = 0;
    this.mH = 0;
    this.focus = $(focus);
    if (!this.focus.retrieve('minHeight')) {
      this.mH = $type(this.focus.getStyle('height').toInt() === 'number') ? this.focus.getStyle('height').toInt() : this.focus.getSize().x;
      this.focus.store('minHeight', this.mH);
    } else this.mH = this.focus.retrieve('minHeight');
    this.div = this.div ? this.div.empty() : new Element('div', { 'styles': { 'position': 'absolute', 'left': -9999, 'top': 0 }});
    this.div.setStyles(this.focus.getStyles('width', 'font-size', 'line-height', 'padding')).inject(document.body);
    this.checkInt = this.check.periodical(400, this);
    return this;
  },
  stop: function() {
    if (this.focus && this.checkInt) {
      this.checkInt = $clear(this.checkInt);
    }
    return this;
  },
  check: function() {
    var val = this.focus.get('value');
    if (this.options.maxCharacters < val.length) {
      val = val.substring(0, this.options.maxCharacters);
      this.focus.set('value', val);
    }
    this.div.set('html', val.length ? val.replace(/(<|>)/g, '').replace(/\n/g, '<br/>>') : '>');
    var h = this.div.getSize().y + this.focus.getStyle('font-size').toInt();
    h = h < this.mH ? this.mH : h;
    if (h !== this.cH) {
      this.fx = this.focus.get('tween', { duration: 200, onComplete: function(evt) { this.fx = null; }.bind(this)}).start('height', h);    
      this.cH = h;
    }
  }  
});