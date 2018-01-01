(function() {
  var ImageImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ImageImporter = (function(superClass) {
    extend(ImageImporter, superClass);

    function ImageImporter(data1) {
      this.data = data1;
      ImageImporter.__super__.constructor.apply(this, arguments);
      this.target_url = this.data.src;
      this.origin = this.data.origin;
      this.title = this.data.title;
      this.url = MT.Url.wrap(MT.routes.extension_imports_image_path);
      this.find_image_attributes();
      this.get_datauri((function(_this) {
        return function(datauri) {
          _this.datauri = datauri;
          _this.init_iframe_message_events();
          _this.build_iframe_container_and_loader();
          return _this.build_iframe();
        };
      })(this));
    }

    ImageImporter.prototype.find_image_attributes = function() {
      var elements, truncated_src;
      this.image = this.find_image(this.target_url);
      if (this.image == null) {
        this.image = this.find_image(this.target_url.replace(window.location.href, ''));
      }
      if (this.image == null) {
        this.image = this.find_image(this.target_url.replace(window.location.origin, ''));
      }
      if (this.image == null) {
        elements = this.target_url.split('/');
        truncated_src = elements[elements.length - 1];
        this.image = this.find_image(truncated_src);
      }
      if (this.image != null) {
        this.image_title = this.image.getAttribute('title');
        return this.image_alt = this.image.getAttribute('alt');
      }
    };

    ImageImporter.prototype.find_image = function(truncated_src) {
      var expr, image;
      expr = "[src$='" + truncated_src + "']";
      return image = document.querySelectorAll(expr)[0];
    };

    ImageImporter.prototype.process_command = function(command, data) {
      switch (command) {
        case MT.EVENTS.REQUEST_IMPORT_DATA:
          return this.send_import_data_to_iframe();
      }
    };

    ImageImporter.prototype.import_data = function() {
      var data;
      return data = {
        'command': MT.EVENTS.IMPORT_DATA,
        'target_url': this.target_url,
        'origin': this.origin,
        'title': this.title,
        'datauri': this.datauri,
        'image_title': this.image_title,
        'image_alt': this.image_alt
      };
    };

    ImageImporter.prototype.get_datauri = function(callback) {
      var capturer;
      capturer = new MT.Extension.ContentScript.Capturer();
      return capturer.get_image_datauri_from_url(this.target_url, (function(_this) {
        return function(datauri_from_src) {
          if (_this.image == null) {
            return callback(datauri_from_src);
          } else {
            return capturer.screenshot_element(_this.image, function(datauri_from_screenshot) {
              var longest_datauri;
              if (datauri_from_src == null) {
                return callback(datauri_from_screenshot);
              } else if (datauri_from_screenshot == null) {
                return callback(null);
              } else {
                longest_datauri = datauri_from_src.length > datauri_from_screenshot.length ? datauri_from_src : datauri_from_screenshot;
                return callback(longest_datauri);
              }
            });
          }
        };
      })(this));
    };

    return ImageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Image = ImageImporter;
  });

}).call(this);
