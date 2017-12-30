(function() {
  var NewTabImporter;

  NewTabImporter = (function() {
    function NewTabImporter(data) {
      this.data = data;
      this.open_tab();
    }

    NewTabImporter.prototype.open_tab = function() {
      var import_url, tab_properties, url;
      console.log(this.data);
      import_url = this.data['data']['webpage_url'];
      url = window.server_url + "/dashboard/items/new/web?url=" + import_url;
      tab_properties = {
        'url': url
      };
      return chrome.tabs.create(tab_properties, function(tab) {});
    };

    return NewTabImporter;

  })();

  namespace("MT.Extension.BackgroundPage", function(e) {
    return e.NewTabImporter = NewTabImporter;
  });

}).call(this);
