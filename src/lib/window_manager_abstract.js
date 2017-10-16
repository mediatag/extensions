(function() {
  var WindowManager;

  WindowManager = (function() {
    function WindowManager() {
      this.callbacks = {};
      window.onmessage = (function(_this) {
        return function(e) {
          var callback, data;
          data = e.data;
          if ((callback = _this.callbacks[data['response_command']]) != null) {
            return callback.apply(_this, [data]);
          } else {
            return _this.process_message(e.data, e);
          }
        };
      })(this);
      this.onbeforeunload_callbacks = [];
      window.onbeforeunload = (function(_this) {
        return function() {
          var message;
          message = null;
          if (_this.onbeforeunload_callbacks.length > 0) {
            _.each(_this.onbeforeunload_callbacks, function(callback) {
              return message != null ? message : message = callback.call();
            });
          }
          return message;
        };
      })(this);
    }

    WindowManager.prototype.onbeforeunload_message = function() {
      var message;
      message = null;
      if (this.onbeforeunload_callbacks / length > 0) {
        _.each(this.onbeforeunload_callbacks, function(callback) {
          return message != null ? message : message = callback.call();
        });
      }
      return message;
    };

    WindowManager.prototype.post_message = function(iframeobj, message, origin) {
      var target;
      if (origin == null) {
        origin = "*";
      }
      target = iframeobj.contentWindow || iframeobj;
      if ((target != null) && (target.postMessage != null)) {
        return target.postMessage(message, origin);
      } else {
        return console.log("no target to post message to");
      }
    };

    WindowManager.prototype.post_message_to_parent = function(data, callback) {
      var target;
      this.callbacks[data['command']] = callback;
      target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : null);
      if (target != null) {
        return target.postMessage(data, "*");
      } else {
        return console.log("post_message_to_parent: message not posted");
      }
    };

    WindowManager.prototype.set_event_processor = function(callback) {
      return this.event_processor = callback;
    };

    WindowManager.prototype.process_message = function(data, event) {
      if (this.event_processor != null) {
        return this.event_processor(data, event);
      }
    };

    WindowManager.prototype.resize_iframe = function(options) {
      if (options == null) {
        options = {};
      }
      options['command'] = MT.EVENTS.RESIZE_IFRAME;
      options['height'] = document.body.clientHeight;
      return this.post_message_to_parent(options);
    };

    WindowManager.prototype.add_onbeforeunload_callback = function(callback) {
      return this.onbeforeunload_callbacks.push(callback);
    };

    return WindowManager;

  })();

  namespace("MT.Manager", function(e) {
    return e.WindowAbstractClass = WindowManager;
  });

  namespace("MT.Manager", function(e) {
    return e.WindowAbstract != null ? e.WindowAbstract : e.WindowAbstract = new WindowManager();
  });

}).call(this);
