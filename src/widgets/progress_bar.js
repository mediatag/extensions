(function() {
  var ProgressBar,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ProgressBar = (function() {
    function ProgressBar() {
      this.increase_progress = bind(this.increase_progress, this);
      this.color = MT.style.color.alert;
      this.create_element();
    }

    ProgressBar.prototype.create_element = function() {
      this.progress = 0;
      this.element = $('<div>');
      this.element.css('position', 'absolute');
      this.element.css('top', '0');
      this.element.css('left', '0');
      this.element.css('width', '100%');
      this.element.css('height', '0');
      this.element.css('z-index', '1000');
      this.bar = $('<div>');
      this.bar.css('position', 'absolute');
      this.bar.css('height', '2px');
      this.bar.css('background-color', this.color);
      this.element.append(this.bar);
      return this.increase_progress();
    };

    ProgressBar.prototype.increase_progress = function() {
      this.bar.css('width', this.progress + "%");
      this.progress += 1;
      if (this.progress > 100) {
        this.progress = 0;
      }
      return setTimeout(this.increase_progress, 20);
    };

    return ProgressBar;

  })();

  namespace("MT.Widget", function(e) {
    return e.ProgressBar = ProgressBar;
  });

}).call(this);
