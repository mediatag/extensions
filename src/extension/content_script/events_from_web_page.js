(function() {
  MT.DomHelper.on_document_ready(function() {
    var c;
    console.log("adding events");
    if (window.window_listener_added == null) {
      window.window_listener_added = true;
      c = (function(_this) {
        return function(event) {
          var data, err;
          if (event.source !== window) {
            return;
          }
          if ((data = event.data) != null) {
            try {
              if (data['type'] === MT.EVENTS.TEST_IMPORT_IMAGE) {
                new MT.Extension.ContentScript.Importer.Image(data);
              }
              if (data['type'] === MT.EVENTS.TEST_IMPORT_WEBPAGE) {
                return new MT.Extension.ContentScript.Importer.Webpage(data).prepare_html_and_build_iframe();
              }
            } catch (error) {
              err = error;
            }
          }
        };
      })(this);
      return window.addEventListener("message", c, false);
    }
  });

}).call(this);
