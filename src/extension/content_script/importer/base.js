(function() {
  var BaseImporter;

  BaseImporter = (function() {
    function BaseImporter(data1) {
      this.data = data1;
      this.resize_allowed = false;
      this.is_mounted = true;
    }

    BaseImporter.prototype.container_parent = function() {
      return document.body;
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
      stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300';
      document.head.appendChild(stylesheet);
      this.iframe_container = document.createElement('div');
      this.iframe_container.classList.add(MT.globals.IFRAME_CONTAINER_CLASS);
      this.iframe_container.style.position = this.iframe_css_position();
      this.iframe_container.style.zIndex = 1999999999 + 199999;
      this.iframe_container.style.backgroundColor = MT.style.color.bg;
      this.iframe_container.style.color = MT.style.color.font;
      this.iframe_container.style.right = 0;
      this.iframe_container.style.top = 0;
      this.iframe_container.style.width = this.iframe_css_width();
      this.iframe_container.style.maxWidth = "100%";
      this.iframe_container.style.height = this.iframe_css_height();
      this.iframe_container.style.borderLeft = "1px solid lightgray";
      this.iframe_container.style.fontFamily = MT.style.font;
      this.iframe_container.style.textAlign = "center";
      this.iframe_container.style.margin = "auto";
      this.loader_elements_container = document.createElement('div');
      this.loader_elements_container.classList.add("iframe_loader");
      image = document.createElement('img');
      image.style.padding = 10;
      image.style.margin = 'auto';
      image.style.display = "block";
      if (typeof chrome !== "undefined" && chrome !== null) {
        image.src = chrome.extension.getURL("logo/mediatag.32.png");
      }
      label = document.createElement('div');
      label.style.paddingBottom = 10;
      label.style.textAlign = "center";
      label.style.fontSize = "24px";
      label.style.display = "block";
      label.textContent = "loading...";
      progress_bar = new MT.Widget.ProgressBar();
      this.loader_elements_container.appendChild(progress_bar.element);
      this.loader_elements_container.appendChild(image);
      this.loader_elements_container.appendChild(label);
      this.iframe_container.appendChild(this.loader_elements_container);
      container_parent = this.container_parent();
      if (container_parent != null) {
        return container_parent.appendChild(this.iframe_container);
      } else {
        return console.warn("NO CONTAINER PARENT TO ATTACH THE IFRAME");
      }
    };

    BaseImporter.prototype.build_iframe = function() {
      var iframe_class, iframe_parent;
      iframe_class = "mediatag_iframe";
      iframe_parent = document.body;
      this.iframe = document.createElement('iframe');
      this.iframe.frameBorder = 0;
      this.iframe.name = "mediatag_extension";
      this.iframe.crossOrigin = "anonymous";
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.boxShadow = '0px 5px 25px 0px gray';
      this.iframe_container.appendChild(this.iframe);
      if (this.url != null) {
        this.iframe.src = this.url;
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
      timeout_message_container = document.createElement('div');
      timeout_message_container.style.padding = '10px';
      timeout_message = document.createElement('div');
      timeout_message.textContent = 'This is taking too long, it might not work well on this site';
      close_button = document.createElement('a');
      close_button.textContent = 'close';
      close_button.href = '#';
      close_button.style.color = MT.style.color.bg;
      close_button.style.padding = '5px 8px';
      close_button.style.backgroundColor = MT.style.color.primary;
      close_button.onclick = (function(_this) {
        return function() {
          return _this.close();
        };
      })(this);
      timeout_message_container.appendChild(timeout_message);
      timeout_message_container.appendChild(close_button);
      return this.loader_elements_container.appendChild(timeout_message_container);
    };

    BaseImporter.prototype.send_to_iframe = function(data) {
      return MT.Manager.ContentScript.Window.post_message(this.iframe, data);
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
              case MT.EVENTS.CONFIRM_IFRAME_LOADED:
                return this.handle_iframe_loaded_confirmation();
              case MT.EVENTS.RESIZE_IFRAME:
                if (this.resize_allowed) {
                  console.log("resize: " + data['height']);
                  return this.iframe.style.height = data['height'] + "px";
                }
                break;
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

    BaseImporter.prototype.handle_iframe_loaded_confirmation = function() {
      if (this.loader_elements_container != null) {
        this.loader_elements_container.remove();
        return this.loader_elements_container = null;
      }
    };

    return BaseImporter;

  })();

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Base = BaseImporter;
  });

}).call(this);
