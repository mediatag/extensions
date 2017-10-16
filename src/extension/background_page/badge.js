(function() {
  var on_badge_clicked;

  on_badge_clicked = function(tab) {
    var data;
    data = {
      action: MT.EVENTS.IMPORT_MEDIUM_OR_WEBPAGE,
      tab: tab
    };
    return chrome.tabs.executeScript(null, {
      file: "content_script.js"
    }, (function(_this) {
      return function() {
        return chrome.tabs.sendMessage(tab.id, data);
      };
    })(this));
  };

  if (window.extension_browser === 'firefox' && window.extension_os === 'android') {

  } else {
    chrome.browserAction.onClicked.addListener(on_badge_clicked);
  }

}).call(this);
