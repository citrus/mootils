Mootils.IFS = new Class({
  Implements: [Options, Events],
  options: {
    url: null,
    form: null,
    debug: false
  },
  initialize: function(options) {
    this.setOptions(options);
    this.evtKey = this.handleUp.bindWithEvent(this);
    if (this.options.form) this.attach(this.options.form);
  },
  attach: function(form) {
    this.form = $(form);
    return this;
  },
  submit: function() {
    this.create();
    this.form.set('target', this.frame.get('id'));
    return this;
  },	     
  create: function() {
    this.frame = new IFrame({
      'id': 'ifs_' + $time(),
      'styles': {
        'position': 'fixed',
        'left': 0,
        'top': 0,
        'opacity': 0,
        'border': 0,
        'background-color': '#333',
        'font': 'bold 33px Verdana'
      },          
      'events': {
        'load': this.handleLoad.bind(this)
      }
    }).inject(document.body);
    this.frame.setStyles({'width': '100%', 'height': '100%'}).fade(0.7);
  },
  hide: function() {
    this.frame.fade('out');
    this.destroy.delay(400, this);
  },
  destroy: function() {
    if (this.frame) this.frame = this.frame.removeEvents().destroy();
    return this;
  },
  handleUp: function(evt) {
    if (evt.key === 'esc') {
      window.removeEvent('keyup', this.evtKey);
      this.hide();
    }
  },
  handleLoad: function() {
   if (this.frame && this.frame.get('src') === 'about:blank') return false;
   this.fireEvent('complete', this);
   if (this.frame && !this.options.debug) this.hide();
   else window.addEvent('keyup', this.evtKey);
  }
});