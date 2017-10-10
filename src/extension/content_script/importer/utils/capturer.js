(function() {
  var Capturer;

  Capturer = (function() {
    function Capturer() {
      this.capture_success_count = 0;
      this.capture_error_count = 0;
    }

    Capturer.prototype.clean = function() {
      console.log("capture success: " + this.capture_success_count);
      return console.log("capture error: " + this.capture_error_count);
    };

    Capturer.prototype.screenshot_visible_area = function(callback) {
      var message_options;
      message_options = {
        type: MT.EVENTS.SCREENSHOT_REQUESTED
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        return chrome.runtime.sendMessage(message_options, (function(_this) {
          return function(data) {
            var datauri;
            if (data != null) {
              datauri = data['data'];
              return callback(datauri);
            } else {
              return callback();
            }
          };
        })(this));
      } else {
        return callback();
      }
    };

    Capturer.prototype.screenshot_element = function(element, callback) {
      return this.screenshot_visible_area((function(_this) {
        return function(datauri) {
          var crop_options, handler, offset;
          if (datauri != null) {
            offset = MT.DomHelper.offset(element);
            crop_options = {
              x: offset['left'],
              y: Math.ceil(offset['top']) - document.body.scrollTop,
              width: element.offsetWidth,
              height: element.offsetHeight
            };
            handler = new MT.ImageHandler(datauri);
            return handler.get_cropped_data(crop_options, function(cropped_datauri) {
              return callback(cropped_datauri);
            });
          } else {
            return callback();
          }
        };
      })(this));
    };

    Capturer.prototype.get_image_datauri_from_url = function(url, callback) {
      var base_capturer;
      base_capturer = new MT.Capturer();
      return base_capturer.get_image_datauri_from_url(url, (function(_this) {
        return function(datauri, image) {
          var message_options;
          if (datauri != null) {
            return callback(datauri, image);
          } else {
            if (typeof chrome === "undefined" || chrome === null) {
              return callback();
            } else {
              message_options = {
                type: "capture_image_from_url",
                url: url
              };
              return chrome.runtime.sendMessage(message_options, function(data) {
                datauri = data['data'];
                if (datauri != null) {
                  _this.capture_success_count += 1;
                } else {
                  _this.capture_error_count += 1;
                }
                return callback(datauri);
              });
            }
          }
        };
      })(this));
    };

    Capturer.prototype.get_stylesheet_content_from_url = function(url, callback) {
      var message_options;
      message_options = {
        type: "capture_stylesheet_from_url",
        url: url
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        return chrome.runtime.sendMessage(message_options, (function(_this) {
          return function(data) {
            var stylesheet_content;
            stylesheet_content = data['data'];
            return callback(stylesheet_content);
          };
        })(this));
      } else {
        return callback();
      }
    };

    return Capturer;

  })();

  namespace("MT.Extension.ContentScript", function(e) {
    return e.Capturer = Capturer;
  });

}).call(this);
