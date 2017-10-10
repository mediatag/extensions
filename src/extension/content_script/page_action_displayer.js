(function() {
  MT.DomHelper.on_document_ready(function() {
    var message_options;
    if (window.extension_browser === 'firefox' && window.extension_os === 'android') {
      message_options = {
        type: "show_page_action"
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        return chrome.runtime.sendMessage(message_options);
      }
    }
  });

}).call(this);
