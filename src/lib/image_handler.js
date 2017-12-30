(function() {
  var ImageHandler;

  ImageHandler = (function() {
    function ImageHandler(data1) {
      this.data = data1;
    }

    ImageHandler.prototype.clean = function() {
      var ref, ref1;
      console.log("ImageHandler clean");
      console.log((ref = this.data) != null ? ref.length : void 0);
      delete this.data;
      return console.log((ref1 = this.data) != null ? ref1.length : void 0);
    };

    ImageHandler.prototype.get_cropped_data = function(crop_options, callback) {
      var data;
      if (this.image != null) {
        data = this.image_to_data(crop_options);
        return callback(data);
      } else {
        this.image = new Image();
        this.image.onload = (function(_this) {
          return function() {
            data = _this.image_to_data(crop_options);
            return callback(data);
          };
        })(this);
        return this.image.src = this.data;
      }
    };

    ImageHandler.prototype.resize = function(width, height, callback) {
      var image;
      image = new Image();
      image.onload = function() {
        var canvas;
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        return callback(canvas.toDataURL());
      };
      return image.src = this.data;
    };

    ImageHandler.prototype.image_to_data = function(crop_options) {
      var canvas, context, data, err, height, scale, width, x, y;
      scale = 1;
      data = null;
      try {
        x = Math.round(crop_options['x']);
        y = Math.round(crop_options['y']);
        width = crop_options['width'];
        height = crop_options['height'];
        canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        context = canvas.getContext("2d");
        context.drawImage(this.image, x, y, width, height, 0, 0, width * scale, height * scale);
        data = canvas.toDataURL("image/png");
      } catch (error) {
        err = error;
        console.error(err, "error while capturing image");
        console.log(data.length);
        console.log(crop_options);
      }
      return data;
    };

    return ImageHandler;

  })();

  namespace("MT", function(e) {
    return e.ImageHandler = ImageHandler;
  });

}).call(this);
