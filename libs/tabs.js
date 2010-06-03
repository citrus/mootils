// COPYRIGHT 2008 - CitrusMediaGroup - All Rights Reserved

Mootils.TabNav = new Class({
  Implements: [Options, Events],
  options: {
    parent: null,
    selector: null
  },
  initialize: function(tabs, options) {
    this.tabs = tabs;
    this.setOptions(options);
    this.setup();
    this.tabs.addEvent('change', this.select.bind(this));
  },
  setup: function() {
  	this.btns = $$('#' + this.options.parent + ' ' + this.options.selector);
    this.btns.each(function(el, idx){
    	 el.addEvent('click', this.handleClick.bindWithEvent(this, idx));
    }.bind(this));
  },  
  select: function() {
    if (this.btns[this.tabs.index]) this.btns[this.tabs.index].getParent('li').addClass('active');
    return this;
  },
  deselect: function() {
    var i = this.btns.length;
    while (i--) {
      if (i !== this.tabs.index) this.btns[i].getParent('li').removeClass('active');
    }
    return this;
  },
  handleClick: function(evt, idx) {
		if (!this.tabs.tabs[idx].enabled) {
      evt = new Event(evt).stop();
      return false;
    }
    if (evt.shift) {
      evt = new Event(evt).stop();
      this.tabs.refresh();    
    }
    if (!this.tabs.options.useSWFAddress || typeof(SWFAddress) === 'undefined') {
      evt = new Event(evt).stop();
      this.tabs.select(idx);
    }
  }
});

Mootils.Tab = new Class({
  Implements: [Options, Events],
  options: {
  	cache: false,
    className: 'section',
    parent: null,
    tabElement: null,
    btnElement: null,
    index: 0,
    url: null,
    enabled: true
  },
  initialize: function(tabs, options) {
    this.tabs = tabs;
    this.setOptions(options);
    if (this.options.btnElement && $(this.options.btnElement)) {
      this.options.path = $(this.options.btnElement).get('href') ?  Mootils.getAnchor($(this.options.btnElement).get('href')) : null;      
      this.options.url = $(this.options.btnElement).get('rel') ? $(this.options.btnElement).get('rel') : null;
      this.options.title = $(this.options.btnElement).get('title') ? $(this.options.btnElement).get('title') : null; 
    }
    if (!this.isAJAX()) this.loaded = true;
    if (!this.options.tabElement) this.create();
    if (this.options.enabled) this.enable();
    else this.disable();
  },
  create: function() {
    if (!this.tabs.options.scroller) return this;
    this.options.tabElement = new Element('div', { 'class': this.options.className }).inject(this.tabs.options.scroller);
    return this;
  },
  enable: function() {
	  this.enabled = true;
	  if (this.options.btnElement) {
		  this.options.btnElement.removeClass('disabled');
  	  this.options.btnElement.getParent().removeClass('disabled');
  	}
    return this;
  },
  disable: function() {
    this.enabled = false;
    if (this.options.btnElement) {
		  this.options.btnElement.addClass('disabled');
  	  this.options.btnElement.getParent().addClass('disabled');
  	}
    return this;
  },
  isAJAX: function() {
    if (!this.options.url) return false;
    var _url = Mootils.stripAnchor(this.options.url);
    var _wurl = Mootils.stripAnchor(window.location.href);
    return !_wurl.contains(_url);
  },
  load: function() {
    if (!arguments[0] && this.options.cache && this.loaded) {
    	this.fireEvent('complete', this);
    	return this;
    } else {
	    if (this.ajax) this.ajax.cancel();
	    this.loaded = false;
	    this.ajax = this.ajax || new Request.HTML();
	    this.ajax.setOptions({
			  url: arguments[0] ? arguments[0] : this.tabs.options.urlParams ? this.options.url + this.tabs.options.urlParams : this.options.url,
			  method: 'get',
			  update: this.options.tabElement,
			  onFailure: this.fireEvent.pass(['failure', this], this),
			  onComplete: function(resp) {
			    this.loaded = true;
			    this.tabs.loader.hide();
			  	this.fireEvent('complete', this);
			  }.bind(this)
			});
			this.tabs.loader.start();
			this.ajax.send();
	  	this.fireEvent('request', this);
	  }
    return this;
  }
});

Mootils.Tabs = new Class({
  Implements: [Options, Events],
  options: {
    parent: null,
    scroller: null,
    selector: null,
    tabOptions: null,
    navOptions: null,
    loaderOptions: null,
    initIndex: 0,
    keyEnabled: true,
    autoSelect: false,
    useSWFAddress: true,
    fade: false
  },
  initialize: function(options) {
    this.setOptions(options);
    this.index = this.options.initIndex;
    this.setup();

    if (this.options.navOptions) this.nav = new Mootils.TabNav(this, this.options.navOptions);
    if (this.options.keyEnabled) window.addEvent('keydown', this.handleKeyDown.bind(this));
    
    if (this.options.useSWFAddress && typeof(SWFAddress) !== 'undefined') SWFAddress.addEventListener(SWFAddressEvent.CHANGE, this.handleChange.bind(this));
    //else if (this.options.autoSelect) this.select();
    
    this.fireEvent('change', this.index);
   	this.isInit = true;
  },
  setup: function() {
    this.tabs = new Array();
    var els = $$('#' + this.options.scroller + ' ' + this.options.selector);
    if (this.options.navOptions) {
      $$('#' + this.options.navOptions.parent + ' ' + this.options.navOptions.selector).each(function(el, idx){
        var opts = this.options.tabOptions || {};
        opts.index = idx;
        opts.btnElement = el;
        opts.tabElement = els[idx];
        this.tabs.push(new Mootils.Tab(this, opts));
      }.bind(this));
    } else {
      els.each(function(el, idx){
        this.tabs.push(new Mootils.Tab(this, {
          tabElement: el
        }));
      }.bind(this));
    }
    this.tabWidth = $(this.options.parent).getStyle('width').toInt();
    $(this.options.scroller).setStyle('width', this.tabWidth * this.tabs.length);
  },
  select: function() {
    var idx = this.isValidIndex(arguments[0]) ? arguments[0] : -1;
    if (0 <= idx && (idx === this.index)) {
      //Debug.trace('> RETURN: invalid or same index');
      return this;
    }
		if (0 <= idx && (!this.tabs[idx] || !this.tabs[idx].enabled)) {
      //Debug.trace('> RETURN: no tab at index or tab disabled');
  		return this;
    }
		if (0 <= idx) this.index = idx;
		
		this.deselect();
   	this.fireEvent('change', this.index);
		this.load();
		return this;
  },
  refresh: function() {
    this.load();
  },
  selectPath: function() {
    var idx = 0;
    var path = arguments[0] || '/';
    if (path === '/') idx = 0;
    else {	
			var i = this.tabs.length;
			while (i--) {
		    if (path === this.tabs[i].options.path) idx = i;
			}
		}
		//if (idx === this.index) this.load();
    this.select(idx);		
  },
  load: function() {
    var tab = this.tabs[this.index] || new Mootils.Tab(this, this.options.tabOptions);
		if (!tab.options.tabElement) tab.create();
		if (arguments[0] || tab.isAJAX()) {
    	this.loader = this.loader || new Mootils.NetStatus(this.options.loaderOptions || { alignWith: null, parent: $(this.options.parent).getParent(), coords: { x: 50, y: 27 }});
    	tab.load(arguments[0]);
    	tab.addEvent('complete', function(evt) {
    		this.showSelected(tab);
    		this.isInit = true;
  		}.bind(this))
    	return this;
    } else {
    	this.showSelected(tab);
    }
  },
  showSelected: function(tab) {
    $(this.options.scroller).get('tween', { property: 'left', onComplete: function() {
	   	if (this.options.fade) $(this.options.parent).fade('in');
    	this.fireEvent('select', tab);
    	this.isInit = true;
    }.bind(this)}).start(-this.index * this.tabWidth);
 	},
  deselect: function() {
    if (this.nav) this.nav.deselect();
    if (this.options.fade) $(this.options.parent).fade(0.3);
    this.fireEvent('deselect', this.getCurrent());
    return this;
  },
  isValidIndex: function(idx) {
    return (idx !== undefined && $type(idx) === 'number' && 0 <= idx && idx < this.tabs.length);
  },  
  first: function() {
    return this.select(0);
  },
  next: function() {
    this.index++;
    if (this.index >= this.tabs.length) return this.first();
    else return this.select();
  },
  previous: function() {
    this.index--;
    if (this.index < 0) return this.last();
    else return this.select();
  },
  last: function() {
    return this.select(this.tabs.length - 1);
  },
  enable: function() {
    this.setEnabled(arguments, true);
    return this;
  },
  disable: function() {
    this.setEnabled(arguments, false);
    return this;
  },
  getCurrent: function() {
    return this.tabs[this.index];
  },
  setEnabled: function(args, enabled) {
    this.disabled = $A(args);
    var i = this.disabled.length;
    while (i--) {
      var idx = this.disabled[i];
      if (this.tabs[idx]) {
	      if (enabled) this.tabs[idx].enable();
        else this.tabs[idx].disable();
      }
    }
    return this;
  },
  handleKeyDown: function(evt) {
  	switch (evt.key) {
  		case 'left':
  			this.previous();
  			break
  		case 'right':
  			this.next();
  			break;
  	}
  },
  handleChange: function(evt) {
    if (!this.isInit) return false;
    this.selectPath(evt.value);
	}
});