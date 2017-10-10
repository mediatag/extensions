(function() {
  var Capturer;

  Capturer = (function() {
    function Capturer() {}

    Capturer.prototype.get_image_datauri_from_url = function(url, callback) {
      var c, image, self, timeout_delay;
      image = new Image();
      timeout_delay = 1000;
      this.image_loaded = false;
      this.delay_ellapsed = false;
      c = (function(_this) {
        return function() {
          if (!_this.image_loaded) {
            console.log("timeout ellapsed to load " + url);
            _this.delay_ellapsed = true;
            return callback();
          }
        };
      })(this);
      setTimeout(c, timeout_delay);
      self = this;
      image.onload = function() {
        var canvas, datauri, e;
        self.image_loaded = true;
        datauri = null;
        try {
          canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;
          canvas.getContext('2d').drawImage(this, 0, 0);
          datauri = canvas.toDataURL("image/png");
        } catch (error1) {
          e = error1;
          console.log(url + " read datauri failed", e);
          console.log(url);
        }
        if (!self.delay_ellapsed) {
          return callback(datauri, this);
        }
      };
      image.onerror = function() {
        self.image_loaded = true;
        if (!self.delay_ellapsed) {
          console.log(url + " load error");
          console.log(url);
          return callback();
        }
      };
      image.crossOrigin = "anonymous";
      return image.src = url;
    };

    Capturer.prototype.get_stylesheet_content_from_url = function(url, callback) {
      var request;
      request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = (function(_this) {
        return function(event) {
          var response;
          if ((response = request.response) != null) {
            return callback(response);
          } else {
            return console.log("stylesheet " + url + " returned no content");
          }
        };
      })(this);
      request.onerror = (function(_this) {
        return function(error) {
          console.log("error");
          console.log(error);
          return callback();
        };
      })(this);
      return request.send();
    };

    return Capturer;

  })();

  namespace("MT", function(e) {
    return e.Capturer = Capturer;
  });

}).call(this);
