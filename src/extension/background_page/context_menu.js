(function() {
  var ContextMenu;

  ContextMenu = (function() {
    function ContextMenu() {}

    ContextMenu.prototype.build = function() {
      return this.build_import_image();
    };

    ContextMenu.prototype.build_import_image = function() {
      var attr;
      attr = {};
      attr['title'] = "Import Image into MediaTag...";
      attr['contexts'] = ["image"];
      attr['onclick'] = (function(_this) {
        return function(info, tab) {
          return _this.import_image(info, tab);
        };
      })(this);
      return chrome.contextMenus.create(attr);
    };

    ContextMenu.prototype.import_image = function(info, tab) {
      var on_script_injection_error, on_script_injection_success;
      console.log("inject content script");
      on_script_injection_success = (function(_this) {
        return function() {
          var data;
          console.log("script injection success");
          data = {
            action: "import_image",
            src: info.srcUrl,
            origin: tab.url,
            title: tab.title,
            info: info,
            tab: tab
          };
          console.log(data);
          return chrome.tabs.sendMessage(tab.id, data);
        };
      })(this);
      on_script_injection_error = (function(_this) {
        return function(error) {
          console.log("script injection ERROR");
          return console.warn(error);
        };
      })(this);
      return chrome.tabs.executeScript(null, {
        file: "content_script.js"
      }, (function(_this) {
        return function() {
          if (chrome.runtime.lastError != null) {
            return on_script_injection_error(chrome.runtime.lastError);
          } else {
            return on_script_injection_success();
          }
        };
      })(this));
    };

    return ContextMenu;

  })();

  (new ContextMenu).build();

}).call(this);
