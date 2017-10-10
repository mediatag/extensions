(function() {
  var MediumImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MediumImporter = (function(superClass) {
    extend(MediumImporter, superClass);

    function MediumImporter(data1) {
      this.data = data1;
      MediumImporter.__super__.constructor.apply(this, arguments);
      this.resize_allowed = true;
      this.service_name = this.data['service_name'];
      this.medium_url = this.data.tab.url;
      this.url = MT.Url.wrap(MT.routes.extension_imports_medium_path);
      this.init_iframe_message_events();
      this.build_iframe_container_and_loader();
      this.build_iframe();
    }

    MediumImporter.prototype.video_element = function() {
      return document.getElementsByTagName('video')[0];
    };

    MediumImporter.prototype.container_parent = function() {
      return this.container_parent_element != null ? this.container_parent_element : this.container_parent_element = this.create_container_parent_element();
    };

    MediumImporter.prototype.iframe_css_position = function() {
      return 'relative';
    };

    MediumImporter.prototype.iframe_css_width = function() {
      return this.video_element().offsetWidth;
    };

    MediumImporter.prototype.iframe_css_height = function() {
      return "100px";
    };

    MediumImporter.prototype.create_container_parent_element = function() {
      if (this.service_name === 'vimeo') {
        return this.create_vimeo_container_parent();
      } else if (this.service_name === 'youtube') {
        return this.create_youtube_container_parent();
      }
    };

    MediumImporter.prototype.create_vimeo_container_parent = function() {
      var el, sibbling;
      el = document.createElement('div');
      el.style.width = '100%';
      sibbling = document.getElementsByClassName('player_area-wrapper')[0];
      MT.DomHelper.insertAfter(el, sibbling);
      return el;
    };

    MediumImporter.prototype.create_youtube_container_parent = function() {
      var el, sibbling;
      el = document.createElement('div');
      el.style.width = '100%';
      sibbling = document.getElementById('player-container');
      MT.DomHelper.insertAfter(el, sibbling);
      return el;
    };

    MediumImporter.prototype.set_time = function(time) {
      if (time != null) {
        return this.video_element().currentTime = time;
      }
    };

    MediumImporter.prototype.get_time = function() {
      return this.video_element().currentTime;
    };

    MediumImporter.prototype.take_screenshot = function() {
      if (this.capturer == null) {
        this.capturer = new MT.Extension.ContentScript.Capturer();
      }
      return this.capturer.screenshot_element(this.video_element(), (function(_this) {
        return function(cropped_datauri) {
          return _this.send_to_iframe({
            'command': MT.EVENTS.SCREENSHOT_COMPLETED,
            'datauri': cropped_datauri
          });
        };
      })(this));
    };

    MediumImporter.prototype.process_command = function(command, data) {
      if (command === 'request_medium_import_data') {
        return this.send_import_data_to_iframe();
      } else if (command === 'confirm_medium_loaded') {
        return this.monitor_time_update();
      } else if (command === 'set_time') {
        return this.set_time(data['time']);
      } else if (command === MT.EVENTS.SCREENSHOT_REQUESTED) {
        return this.take_screenshot();
      }
    };

    MediumImporter.prototype.send_import_data_to_iframe = function() {
      return this.send_to_iframe({
        'command': "import_image_data",
        'url': this.medium_url
      });
    };

    MediumImporter.prototype.monitor_time_update = function() {
      var delta, time;
      if (this.is_mounted) {
        delta = 0.1;
        time = this.get_time();
        if ((this.time == null) || (Math.abs(this.time - time) >= delta)) {
          this.time = time;
          this.send_to_iframe({
            command: 'time_updated',
            time: this.time
          });
        }
        return setTimeout(((function(_this) {
          return function() {
            return _this.monitor_time_update();
          };
        })(this)), 50);
      }
    };

    return MediumImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Medium = MediumImporter;
  });

}).call(this);
