(function() {
  var WindowManager,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  WindowManager = (function(superClass) {
    extend(WindowManager, superClass);

    function WindowManager() {
      this.process_default_events = bind(this.process_default_events, this);
      WindowManager.__super__.constructor.apply(this, arguments);
      this.set_extension_presence_element_attributes();
      this.set_event_processor((function(_this) {
        return function(data, event) {
          return _this.process_default_events(data, event);
        };
      })(this));
    }

    WindowManager.prototype.set_extension_presence_element_attributes = function() {
      var child_element, element_class, expected_environment;
      element_class = MT.globals.EXTENSION_PRESENCE_CONTAINER_CLASS;
      if (element_class != null) {
        if ((this.presence_element = document.getElementsByClassName(element_class)[0]) != null) {
          expected_environment = this.presence_element.dataset['environment'];
          if (expected_environment === window.environment) {
            child_element = document.createElement('div');
            child_element.dataset['environment'] = window.environment;
            child_element.dataset['browser'] = window.extension_browser;
            child_element.dataset['os'] = window.extension_os;
            return this.presence_element.appendChild(child_element);
          }
        }
      }
    };

    WindowManager.prototype.process_default_events = function(data) {
      var command;
      if (data != null) {
        if ((command = data['command']) != null) {
          switch (command) {
            case MT.EVENTS.SCREENSHOT_REQUESTED:
              return this.process_screenshot(data);
          }
        }
      }
    };

    WindowManager.prototype.process_screenshot = function(data) {
      var screenshot_element;
      screenshot_element = document.getElementsByClassName(MT.globals.SCREENSHOT_ELEMENT_DATA_CONTAINER_CLASS)[0];
      if (screenshot_element != null) {
        if (this.capturer == null) {
          this.capturer = new MT.Extension.ContentScript.Capturer();
        }
        return this.capturer.screenshot_visible_area((function(_this) {
          return function(datauri) {
            var crop_options, handler;
            if (datauri != null) {
              handler = new MT.ImageHandler(datauri);
              crop_options = data;
              return handler.get_cropped_data(crop_options, function(cropped_datauri) {
                return screenshot_element.dataset['datauri'] = cropped_datauri;
              });
            } else {
              return screenshot_element.dataset['error'] = "no datauri";
            }
          };
        })(this));
      }
    };

    return WindowManager;

  })(MT.Manager.WindowAbstractClass);

  namespace("MT.Manager.ContentScript", function(e) {
    return e.Window != null ? e.Window : e.Window = new WindowManager();
  });

}).call(this);
