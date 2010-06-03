// COPYRIGHT 2009 - CitrusMediaGroup - All Rights Reserved

var Mootils = {
  REQUIRED_MOOTOOLS: '1.2.3',
  version: '0.9.5',
  release: '8/13/2009',
  host: 'http://mootils.com/',
  load: function(inc) {
    document.write('<script type="text/javascript" src="' + inc + '"><\/script>');
  },
  init: function() {
    if (typeof(MooTools) === 'undefined' || MooTools.version !== Mootils.REQUIRED_MOOTOOLS) {
      throw 'Mootils requires MooTools v' + Mootils.REQUIRED_MOOTOOLS;
      return false;
    }
    $A(document.getElementsByTagName('script')).filter(function(s) {
      return (s.src && s.src.match(/mootils\.js(\?.*)?$/))
    }).each( function(s) {
      var path = s.src.replace(/mootils\.js(\?.*)?$/, 'libs/');
      var includes = s.src.match(/\?.*load=([a-z,]*)/);
      if (includes) {
        includes[1].split(',').each(function(inc) {
          Mootils.load(path + inc + '.js');
        });
      }
    });
  },
  random: function(i) {
    return Math.floor(i * (Math.random() % 1));
  },
  randomRange: function(i, j) {
    return i + Mootils.random(j - i + 1);
  },
  stripAnchor: function(url) {
	  return url.replace(/\#[0-9,a-z]*/, '');  
  },
  getAnchor: function(url) {
    var a = String(url.match(/#\/.*$/));
    if (a) a = a.replace(/#/, '');
    else a = '/';
    return a;
  },
  autoPreview: function() {
	  var sel = arguments[0] || 'a.preview, img.preview';
	  $$(sel).each(function(el, idx) {
	    var link = el.nodeName === 'A' ? el.get('href') : el.get('rel');
	    if (link) el.addEvent('click', function(evt) {
	    	evt = new Event(evt).stop();
	    	Mootils.preview(link, { thumb: evt.target.nodeName === 'IMG' ? evt.target : evt.target.getFirst('img') ? evt.target.getFirst('img') : evt.target });
	    }.bind(this));
	  });
	},
  preload: function() {
	  var d = document;
	  if(d.images) { 
	  	if(!d.pre) d.pre = new Array();
	   	var i, j = d.pre.length, a = arguments;
	   	for (i = 0; i < a.length; i++) {
			  if ( a[i].indexOf("#") != 0 ) {
			    d.pre[j] = new Image;
			    d.pre[j++].src = a[i];
			  }
			}
		}
	},
	pngImage: function() {
    var id = $type(arguments[0]) === 'string' ? arguments[0] : null;
    var styles = new Hash(id ? arguments[1] : arguments[0]);
    styles.extend({
      'filter': Browser.Engine.trident ? 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + arguments[0] + ', sizingMethod=\'scale\');' : 'none',
      'background-image': Browser.Engine.trident ? '/images/pixel.gif' : arguments[0]
    });
    return new Element('div', {
      'id': id,
      'styles': styles
    });
	}
}

Mootils.Overlay = new Class({
  Implements: Options,
  options: {
  	autoShow: true,
    color: '#000',
    opacity: 0.6,
    parent: null,
    zIndex: 7950
  },
  initialize: function(options){
  	if (Mootils.overlay) return false;
  	if (typeof(Mootils.Overlay.$prototype) !== 'undefined') this.setOptions(Mootils.Overlay.$prototype);
    this.setOptions(options);
  	this.create();
  	if (this.options.autoShow) this.show();
  	return this;
  },
  create: function() {
    this.div = new Element('div', {
  		'id': 'overlay' + $time(),
  		'styles': {
  			'position': 'fixed',
 	    	'width': '100%',
 	    	'height': '100%',
 	    	'left': 0,
 	    	'top': 0,
 	    	'background-color': this.options.color,
  			'opacity': 0,
 	    	'z-index': this.options.zIndex
  		}
  	}).inject(this.options.parent || document.body);
  	return this;
  },
  show: function() {
    this.div.fade(this.options.opacity);
    this.evtKeys = this.handleKeyUp.bindWithEvent(this);
  	window.addEvent('keyup', this.evtKeys);
  	return this;
  },
  hide: function() {
    window.removeEvent(this.evtKeys);
    if (this.div) {
      this.div.fade(0);
      this.destroy.delay(this.div.get('tween').options.duration, this);
    }
    return this;
  },
  destroy: function() {
 		if (!this.div) return null;
 	  this.div = this.div.destroy();
   	return null;
 	},
  handleKeyUp: function(evt) {
 	  switch (evt.key) {
  	case 'esc':
  		this.hide();
  		break;
    }
 	}
});


Mootils.Console = new Class({
  Implements: Options,
	options: {
  	width: 420,
    height: 470
  },
  initialize: function(options){
    this.setOptions(options);
    this.div = $('debugConsole') || this.create();
  },
  create: function () {
    return new Element('div', {
      'id': 'debugConsole',
      'events': {
      	'click': this.handleClick.bindWithEvent(this)
      },
      'styles': {
        'display': 'block',
        'position': 'fixed',
        'right': 0,
        'top': 0,
        'width': this.options.width,
        'height': this.options.height,
        'margin': '4px',
        'padding': '4px',
        'overflow': 'auto',
        'border': '1px solid #999',
        'background-color': '#fff',
        'font': '13px Courier',
        'color': '#444',
        'z-index': 7500
      }
    }).inject(document.body);
  },
  trace: function () {
  	if (!arguments || arguments.length == 0) return false;
  	else if ($type(arguments[0]) == 'arguments') arguments = arguments[0];
  	var str = '';
  	for (var i = 0, l = arguments.length; i < l; i++){
      str += (arguments[i] + ' ');
    }
    this.div.appendText(str);
   	new Element('br').inject(this.div);
    return str;
  },
  clear: function () {
    this.div.innerHTML = '';
    return this;
  },
  destroy: function() {
  	this.div = this.div.removeEvents().destroy();
  	return null;
  },
  handleClick: function(evt) {
  	if (evt.shift && evt.alt) Debug.console = this.destroy();
    else if (evt.shift) this.clear();
  }
});
var Debug = {
	trace: function() {
		this.console = this.console || new Mootils.Console();
		this.console.trace(arguments);
	},
	clear: function() {
    if (this.console) this.console.clear();	
	}
};
Mootils.init();