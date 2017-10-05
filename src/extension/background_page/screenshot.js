(function() {
  var Screenshot;

  Screenshot = (function() {
    function Screenshot() {}

    Screenshot.prototype.perform = function(crop_options, callback) {
      var format_options, on_error, on_success;
      format_options = {
        format: 'png'
      };
      on_success = (function(_this) {
        return function(data) {
          console.log("capture callback");
          console.log(data != null);
          if (data != null) {
            return callback.apply(_this, [data]);
          } else {
            console.log("no data was captured by tabs.captureVisibleTab");
            return callback.apply(_this, [data]);
          }
        };
      })(this);
      on_error = (function(_this) {
        return function(error) {
          console.log("screenshot error");
          console.log(error);
          return callback();
        };
      })(this);
      return chrome.tabs.captureVisibleTab(null, format_options, on_success);
    };

    return Screenshot;

  })();

  namespace("MT.Extension.BackgroundPage", function(e) {
    return e.Screenshot = Screenshot;
  });

}).call(this);
