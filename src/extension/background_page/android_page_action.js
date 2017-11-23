(function() {
  var AndroidPageAction;

  AndroidPageAction = (function() {
    function AndroidPageAction() {
      this.active = (typeof browser !== "undefined" && browser !== null) && (browser.pageAction != null);
      if (this.active) {
        browser.pageAction.onClicked.addListener((function(_this) {
          return function(tab) {
            return _this.on_clicked(tab);
          };
        })(this));
      }
    }

    AndroidPageAction.prototype.display_page_action = function() {
      return this.get_current_tab((function(_this) {
        return function(tab) {
          if (_this.active) {
            return browser.pageAction.show(tab.id);
          }
        };
      })(this));
    };

    AndroidPageAction.prototype.get_current_tab = function(callback) {
      var on_error, on_success, promise;
      on_success = (function(_this) {
        return function(tabs) {
          var tab;
          if ((tab = tabs[0]) != null) {
            return callback(tab);
          }
        };
      })(this);
      on_error = (function(_this) {
        return function(error) {
          console.log("error");
          return console.log(error);
        };
      })(this);
      if (this.active) {
        promise = browser.tabs.query({
          active: true,
          currentWindow: true
        });
        return promise.then(on_success, on_error);
      }
    };

    AndroidPageAction.prototype.on_clicked = function(tab) {
      var data;
      data = {
        action: MT.EVENTS.IMPORT_MEDIUM_OR_WEBPAGE,
        tab: tab
      };
      return chrome.tabs.sendMessage(tab.id, data);
    };

    return AndroidPageAction;

  })();

  namespace("MT.Extension.BackgroundPage", function(e) {
    return e.AndroidPageAction != null ? e.AndroidPageAction : e.AndroidPageAction = new AndroidPageAction();
  });

}).call(this);
