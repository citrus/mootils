// COPYRIGHT 2008 - CitrusMediaGroup - All Rights Reserved

Mootils.QuickSearch = new Class({
  Implements: Options,
  options: {
    url: null,
    resultDiv: 'products',
    msgInit: 'search...',
    params: {}
  },
  initialize: function(options) {
    this.setOptions(options);
    if (typeof(Mootils.NetStatus) === 'undefined') {
      Debug.trace('Required extension \'Mootils.NetStatus\' not found..');
      return false;
    }
    this.field = $(this.options.field);
    this.div = $(this.options.resultDiv);
    this.evtKeyDown = this.handleKeyDown.bindWithEvent(this);
    this.evtKeyUp = this.handleKeyUp.bindWithEvent(this);
    this.evtFocus = this.handleFocus.bindWithEvent(this);
    this.evtBlur = this.handleBlur.bindWithEvent(this);
    
    if (this.options.form) {
      $(this.options.form).addEvent('submit', function(evt) {
        evt = new Event(evt).stop();
      });
    }
      
    this.reset().enable();
  },
  enable: function() {
    this.disabled = false;
    if (this.field) {
      this.field.addEvent('keydown', this.evtKeyDown);
    	this.field.addEvent('keyup', this.evtKeyUp);
      this.field.addEvent('focus', this.evtFocus);
      this.field.addEvent('blur', this.evtBlur);
    }
    return this;
  },
  disable: function() {
  	if (this.field) {
    	this.field.removeEvent('keydown', this.evtKeyDown);
    	this.field.removeEvent('keyup', this.evtKeyUp);
      this.field.removeEvent('blur', this.evtBlur);
    }
    this.disabled = true;
    return this;
  },
  clear: function() {
    if (this.div) this.div.empty();
    return this;
  },
  reset: function() {
    if (this.field) this.field.set('value', this.options.msgInit);
    return this;
  },
  sendRequest: function() {
    if (this.req) this.req.cancel();
  	if (this.ldr) this.ldr.hide();
    else this.ldr = new Mootils.NetStatus({ alignWith: this.options.field });
    
  	this.req = this.req || new Request.HTML();
  	this.req.setOptions({
      url: this.options.url,
      update: this.options.resultDiv,
      onComplete: this.handleComplete.bind(this)
    }).send( this.options.params ? 'param_str=' + JSON.encode(this.options.params) : '');
  },
  handleKeyDown: function(evt) {
  	if (evt.key === 'enter') {
  	  new Event(evt).stop();
      this.disable();
    }
  },
  handleKeyUp: function(evt) {
    var val = this.field.get('value');
  	if (val.length === 0 || val.replace(/[\s{1,}]/g, '').length === 0) this.options.params = null;
    else this.options.params = { query: val.replace(/[\s{2,}]/g, ' ') };
    this.sendRequest();
  },
  handleFocus: function(evt) {
    if (this.field.get('value') === this.options.msgInit) this.field.set('value', '');
    if (this.disabled) this.enable(); 	
  },
  handleBlur: function(evt) {
    this.reset().disable();
  },
  handleComplete: function(evt) {
    if (this.ldr) this.ldr.hide();
  }
});