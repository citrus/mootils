//- COPYRIGHT 2009 CITRUS MEDIA GROUP -//

if (typeof(Mootils) === 'undefined') throw 'Mootils.QuickSort requires the Mootils base.';

Mootils.QuickSort = new Class({
  Implements: Options,
  options: {
    sortBy: null,
    sortTypes: null,
    cookies: true
  },
  initialize: function(list, options) {
    this.id = 'qs_' + list;
    this.list = $(list);
    this.setOptions(options);
    if (this.options.cookies && Cookie.read(this.id + '_sortby')) {
      this.sortBy = Cookie.read(this.id + '_sortby');
      this.order = Cookie.read(this.id + '_order');
    } else {
      this.setSort(this.options.sortBy);
    }
    this.sort();
  },
  setSort: function() {
    var re1 = /(\s|asc|desc)?/gi;
    var re2 = /asc|desc/i;
    var str = arguments[0] || 'alpha asc';
    this.sortBy = String(str.test(re1) ? str.replace(re1, '') : this.sortBy ? this.sortBy : 'alpha').trim();
    this.order = String(str.test(re2) ? str.match(re2) : this.order ? this.order : 'asc').trim();
    return this;
  },
  sort: function() {
    var a, func;
    var els = this.getChildren();
    if (arguments[0]) this.setSort(arguments[0]);
    if (this.sortBy && this.options.sortTypes && $chk(this.options.sortTypes.indexOf(this.sortBy))) func = this.options.sortFunctions[this.options.sortTypes.indexOf(this.sortBy)];
    if ($type(func) !== 'function') func = this.getTextArray;    
    a = func(els);
    if ($type(a[0][0]) === 'number') {
      if (this.order === 'asc') a.sort(this.numbersAsc);
      else a.sort(this.numbersDesc);
    } else {
      if (this.order === 'asc') a.sort();
      else a.sort().reverse();
    }
    a.each(function(el, idx) {
      $(els[el[1]]).dispose().inject(this.list, 'bottom');
    }.bind(this));
    if (this.options.cookies) {
      Cookie.write(this.id + '_sortby', this.sortBy);
      Cookie.write(this.id + '_order', this.order);
    }
    this.order = this.order === 'asc' ? 'desc' : 'asc';
  },
  getChildren: function() {
    return this.list.getChildren();
  },
  getTextArray: function(arr) {
    var a = [];
    arr.each(function(el, idx) {
      a.push([ el.get('text'), idx ])
    }.bind(this));
    return a;
  },
  numbersAsc: function(a, b) {
    return $type(a) === 'array' ? a[0] - b[0] : a - b;
  },
  numbersDesc: function(a, b) {
    return $type(a) === 'array' ? b[0] - a[0] : b - a;
  }
});