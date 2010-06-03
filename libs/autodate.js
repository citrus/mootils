// COPYRIGHT 2008 - CitrusMediaGroup - All Rights Reserved

Mootils.AutoDate = new Class({
  Implements: Options,
  options: {
    field: null,
    helper: null,
    dateFormat: 'dddd, MMMM dd, yyyy h:mm:ss tt',
    msgInit: 'Enter <b>any</b> date and/or time',
    msgError: 'Invalid Date.'
  },
  initialize: function(options) {
    this.setOptions(options);
    this.fld = $(this.options.field);
    this.div = $(this.options.helper);
    this.evtKeyDown = this.handleKeyDown.bindWithEvent(this);
    this.evtKeyUp = this.handleKeyUp.bindWithEvent(this);
    this.evtFocus = this.handleFocus.bindWithEvent(this);
    this.evtBlur = this.handleBlur.bindWithEvent(this);
    this.div.set('html', this.options.msgInit);
    this.slide = new Fx.Slide(this.div, { duration: 140 }).hide();
    this.enable();
  },
  enable: function() {
    this.fld.addEvent('keydown', this.evtKeyDown);
  	this.fld.addEvent('keyup', this.evtKeyUp);
    this.fld.addEvent('focus', this.evtFocus);
    this.fld.addEvent('blur', this.evtBlur);
    this.disabled = false;
   	this.slide.slideIn();
    return this;
  },
  disable: function() {
  	this.fld.removeEvent('keydown', this.evtKeyDown);
  	this.fld.removeEvent('keyup', this.evtKeyUp);
    this.fld.removeEvent('blur', this.evtBlur);
    if ($chk(this.date)) this.fld.set('value', this.date.toString(this.options.dateFormat));
    this.removeClasses();
    this.div.set('html', '');
    this.slide.slideOut();
    this.disabled = true;
    return this;
  },
  set: function(str) {
  	this.date = Date.parse(str) ? Date.parse(str) : null;
  	if (this.date !== null) this.fld.set('value', this.date.toString(this.options.dateFormat));
    return this.updateHelper();
  },
  getODBCFormat: function() {
  	if (this.date == null) return false;
  	return this.date.toString('yyyy-MM-dd HH:mm:ss');
  },
  updateHelper: function() {
 		if ($chk(this.date)) {
	    if (this.div.hasClass('invalid')) this.div.removeClass('invalid');
	  	this.div.addClass('valid').set('html', this.date.toString(this.options.dateFormat));
	  } else if (this.fld.get('value').length > 0) {
	    if (this.div.hasClass('valid')) this.div.removeClass('valid');
	    this.div.addClass('invalid').set('html', this.options.msgError);
	  }
    return this;
  },
  removeClasses: function() {
    if (this.div.hasClass('valid')) this.div.removeClass('valid');
    if (this.div.hasClass('invalid')) this.div.removeClass('invalid');
    if (!this.div.hasClass('idle')) this.div.addClass('idle');
    return this;
  },
  handleKeyDown: function(evt) {
  	if (evt.key === 'enter' && $chk(this.date)) {
  	  new Event(evt).stop();
      this.disable(); 
    }
  },
  handleKeyUp: function(evt) {
  	if (this.fld.get('value').length > 0) {
	    this.date = Date.parse(this.fld.get('value'));
	    this.updateHelper();
	  } else {
	    this.div.set('html', this.options.msgInit);
	    this.removeClasses();
	  }
  },
  handleFocus: function(evt) {
    if (this.disabled) this.enable();
    return this.updateHelper();  	
  },
  handleBlur: function(evt) {
    if (this.fld.get('value').length == 0) {
      this.div.set('html', this.options.msgInit);
      this.removeClasses();
    } else if (!Date.parse(this.fld.get('value'))) {
      this.fld.erase('value');    
    } else if (this.date !== null) this.disable();
  }
});