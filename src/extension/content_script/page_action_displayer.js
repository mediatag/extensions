(function() {
  var message_options;

  if (window.extension_browser === 'firefox' && window.extension_os === 'android') {
    message_options = {
      type: MT.EVENTS.EXTENSION_PAGE_ACTION
    };
    if (typeof chrome !== "undefined" && chrome !== null) {
      console.log("displaying page action");
      chrome.runtime.sendMessage(message_options);
    }
  }

}).call(this);
