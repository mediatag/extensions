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
      this.element = document.createElement('div');
      this.element.style.position = 'absolute';
      this.element.style.top = '0';
      this.element.style.left = '0';
      this.element.style.width = '100%';
      this.element.style.height = '0';
      this.element.style.zIndex = '1000';
      this.bar = document.createElement('div');
      this.bar.style.position = 'absolute';
      this.bar.style.height = '2px';
      this.bar.style.backgroundColor = this.color;
      this.element.appendChild(this.bar);
      return this.increase_progress();
    };

    ProgressBar.prototype.increase_progress = function() {
      this.bar.style.width = this.progress + "%";
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
