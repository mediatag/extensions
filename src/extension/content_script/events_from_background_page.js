(function() {
  if (window.background_listener_added == null) {
    window.background_listener_added = true;
    if (typeof chrome !== "undefined" && chrome !== null) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.action) {
          case "import_image":
            return new MT.Extension.ContentScript.Importer.Image(request);
          case MT.EVENTS.IMPORT_MEDIUM_OR_WEBPAGE:
            return new MT.Extension.ContentScript.Importer.MediumOrWebpage(request);
        }
      });
    }
  }

}).call(this);
