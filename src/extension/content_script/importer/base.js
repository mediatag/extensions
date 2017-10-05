(function() {
  var BaseImporter;

  BaseImporter = (function() {
    function BaseImporter(data1) {
      this.data = data1;
      this.is_mounted = true;
    }

    BaseImporter.prototype.container_parent = function() {
      return $('body');
    };

    BaseImporter.prototype.iframe_css_position = function() {
      return 'fixed';
    };

    BaseImporter.prototype.iframe_css_width = function() {
      return "300px";
    };

    BaseImporter.prototype.iframe_css_height = function() {
      return "100%";
    };

    BaseImporter.prototype.build_iframe_container_and_loader = function() {
      var container_parent, image, label, progress_bar, stylesheet;
      stylesheet = $('<link>')[0];
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300';
      $('head').append($(stylesheet));
      this.iframe_container = $('<div>');
      this.iframe_container.addClass(MT.globals.IFRAME_CONTAINER_CLASS);
      this.iframe_container.css('position', this.iframe_css_position());
      this.iframe_container.css('z-index', 1999999999 + 199999);
      this.iframe_container.css('background-color', MT.style.color.bg);
      this.iframe_container.css('color', MT.style.color.font);
      this.iframe_container.css('right', 0);
      this.iframe_container.css('top', 0);
      this.iframe_container.css('width', this.iframe_css_width());
      this.iframe_container.css('max-width', "100%");
      this.iframe_container.css('height', this.iframe_css_height());
      this.iframe_container.css('border-left', "1px solid lightgray");
      this.iframe_container.css('font-family', MT.style.font);
      this.iframe_container.css('text-align', "center");
      this.iframe_container.css('margin', "auto");
      this.loader_elements_container = $('<div>');
      this.loader_elements_container.addClass("iframe_loader");
      image = $('<img>');
      image.css('padding', 10);
      image.css('margin', 'auto');
      image.css('display', "block");
      if (typeof chrome !== "undefined" && chrome !== null) {
        image[0].src = chrome.extension.getURL("logo/mediatag.32.png");
      }
      label = $('<div>');
      label.css('padding-bottom', 10);
      label.css('text-align', "center");
      label.css('font-size', "24px");
      label.css('display', "block");
      label.text("loading...");
      progress_bar = new MT.Widget.ProgressBar();
      this.loader_elements_container.append(progress_bar.element);
      this.loader_elements_container.append(image);
      this.loader_elements_container.append(label);
      this.iframe_container.append(this.loader_elements_container);
      container_parent = this.container_parent();
      if (container_parent != null) {
        return container_parent.append(this.iframe_container);
      } else {
        return console.warn("NO CONTAINER PARENT TO ATTACH THE IFRAME");
      }
    };

    BaseImporter.prototype.build_iframe = function() {
      var iframe_class, iframe_parent;
      iframe_class = "mediatag_iframe";
      iframe_parent = $('body');
      this.iframe = $('<iframe>');
      this.iframe.attr('frameBorder', 0);
      this.iframe.attr('name', "mediatag_extension");
      this.iframe.css('width', '100%');
      this.iframe.css('height', '100%');
      this.iframe.css('box-shadow', '0px 5px 25px 0px gray');
      this.iframe[0].crossOrigin = "anonymous";
      this.iframe_container.append(this.iframe);
      if (this.url != null) {
        this.iframe.attr('src', this.url);
        return this.start_timeout_count();
      } else {
        return console.warn("url needs to be overwritten");
      }
    };

    BaseImporter.prototype.start_timeout_count = function() {
      var c, timeout_duration;
      c = (function(_this) {
        return function() {
          if (_this.is_mounted && (_this.loader_elements_container != null)) {
            return _this.load_in_new_tab();
          } else {
            return console.log("it looks like the iframe has loaded fine");
          }
        };
      })(this);
      timeout_duration = (function() {
        switch (window.environment) {
          case 'test':
            return 15000;
          default:
            return 5000;
        }
      })();
      if (window.extension_os === 'android') {
        timeout_duration = 20000;
      }
      return setTimeout(c, timeout_duration);
    };

    BaseImporter.prototype.display_iframe_loading_timeout = function() {
      var close_button, timeout_message, timeout_message_container;
      timeout_message_container = $('<div>');
      timeout_message_container.css('padding', '10px');
      timeout_message = $('<div>');
      timeout_message.text('This is taking too long, it might not work well on this site');
      close_button = $('<a>');
      close_button.text('close');
      close_button.attr('href', '#');
      close_button.css('color', MT.style.color.bg);
      close_button.css('padding', '5px 8px');
      close_button.css('background-color', MT.style.color.primary);
      close_button.on('click', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      timeout_message_container.append(timeout_message);
      timeout_message_container.append(close_button);
      return this.loader_elements_container.append(timeout_message_container);
    };

    BaseImporter.prototype.send_to_iframe = function(data) {
      return MT.Manager.ContentScript.Window.post_message(this.iframe[0], data);
    };

    BaseImporter.prototype.send_to_main_window = function(data) {
      return MT.Manager.ContentScript.Window.post_message(window, data);
    };

    BaseImporter.prototype.init_iframe_message_events = function() {
      return MT.Manager.ContentScript.Window.set_event_processor((function(_this) {
        return function(data, event) {
          return _this.process_iframe_events(data, event);
        };
      })(this));
    };

    BaseImporter.prototype.load_in_new_tab = function() {
      var message;
      message = {
        type: "new_tab_importer",
        "import": {
          url: this.url,
          data: this.import_data()
        }
      };
      chrome.runtime.sendMessage(message);
      return this.close();
    };

    BaseImporter.prototype.process_iframe_events = function(data, event) {
      var command, origin_trusted, trusted_origins;
      origin_trusted = false;
      trusted_origins = [];
      trusted_origins.push('https://localhost:3000');
      trusted_origins.push('http://localhost:5000');
      trusted_origins.push('https://mediatag.io');
      origin_trusted = trusted_origins.indexOf(event.origin) > -1;
      origin_trusted = true;
      if (!origin_trusted) {

      } else {
        if (data != null) {
          if ((command = data['command']) != null) {
            switch (command) {
              case 'confirm_iframe_loaded':
                if (this.loader_elements_container != null) {
                  this.loader_elements_container.remove();
                  return this.loader_elements_container = null;
                }
                break;
              case "resize":
                return this.iframe.animate({
                  height: data['height']
                }, 200);
              case "request_import_data":
                return this.send_import_data_to_iframe();
              case "close":
                return this.close();
              case "new_tab":
                if (typeof chrome !== "undefined" && chrome !== null) {
                  return chrome.runtime.sendMessage({
                    'type': "new_tab",
                    'url': data['url']
                  });
                }
                break;
              default:
                return this.process_command(command, data);
            }
          }
        }
      }
    };

    BaseImporter.prototype.process_command = function(command, data) {
      return console.log("base importer process command needs to be overwritten in subclasses");
    };

    BaseImporter.prototype.send_import_data_to_iframe = function() {
      return this.send_to_iframe(this.import_data());
    };

    BaseImporter.prototype.close = function() {
      this.is_mounted = false;
      if (this.iframe_container != null) {
        this.iframe_container.remove();
        return this.iframe_container = null;
      }
    };

    return BaseImporter;

  })();

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Base = BaseImporter;
  });

}).call(this);
