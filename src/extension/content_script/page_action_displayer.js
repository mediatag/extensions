(function() {
  $(document).ready(function() {
    var message_options;
    if (window.extension_browser === 'firefox' && window.extension_os === 'android') {
      message_options = {
        type: "show_page_action"
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        console.log("sent message", message_options);
        return chrome.runtime.sendMessage(message_options);
      }
    }
  });

}).call(this);
