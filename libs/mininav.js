//- COPYRIGHT 2009 CITRUS MEDIA GROUP -//

if (typeof(Mootils) === 'undefined') throw 'Mootils.MiniNav requires the Mootils base.';

Mootils.MiniNav = new Class({
  Implements: [ Options, Events ],
  options: {
    parent: null,
    offset: { x: 5, y: 0 },
    delay: 100,
    hideOnClick: true
  },
  initialize: function(btn, nav, options) {
    this.btn = $(btn);
    this.nav = $(nav);
    this.setOptions(options);
    this.setup().hide();
  },
  setup: function() {
    this.btn.addEvent('mouseover', this.handleOver.bind(this));
    this.nav.addEvent('mouseover', this.handleOver.bind(this));
    this.btn.addEvent('mouseout', this.handleOut.bind(this));
    this.nav.addEvent('mouseout', this.handleOut.bind(this));
    this.nav.addEvent('click', this.handleClick.bind(this));
    if (this.options.parent) this.nav.inject(this.options.parent);
    return this;
  },
  show: function() {
    var coords = this.btn.getCoordinates(this.options.parent || this.btn.getParent());
    this.nav.setStyles({
      'display': 'block',
      'position': 'absolute',
      'left': coords.left + coords.width + this.options.offset.x,
      'top': coords.top + this.options.offset.y,
      'z-index': 4500
    });
    return this;
  },
  hide: function() {
    this.nav.setStyle('display', 'none');
    return this;
  },
  handleOver: function(evt) {
    if (this.hideInt) this.hideInt = $clear(this.hideInt);
    this.show();
  },
  handleOut: function(evt) {
    if (this.hideInt) this.hideInt = $clear(this.hideInt);
    this.hideInt = this.hide.delay(this.options.delay, this);
  },
  handleClick: function(evt) {
    this.fireEvent('click', evt);
    if (this.options.hideOnClick) this.hide();
  }
});