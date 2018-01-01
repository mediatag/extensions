(function() {
  var NewTabImporter;

  NewTabImporter = (function() {
    function NewTabImporter(data) {
      this.data = data;
      this.open_tab_with_link();
    }

    NewTabImporter.prototype.open_tab_with_connections = function() {
      var tab_properties;
      tab_properties = {
        'url': this.data['url']
      };
      return chrome.tabs.create(tab_properties, function(tab) {
        var content_script_execution_details;
        content_script_execution_details = {
          file: 'content_script.js'
        };
        return chrome.tabs.executeScript(tab.id, content_script_execution_details, (function(_this) {
          return function() {
            content_script_execution_details = {
              code: "new MT.Extension.ContentScript.Importer.NewTab().send_import_data()"
            };
            return chrome.tabs.executeScript(tab.id, content_script_execution_details);
          };
        })(this));
      });
    };

    NewTabImporter.prototype.send_import_data = function(sendResponse) {
      return sendResponse(this.data['data']);
    };

    NewTabImporter.prototype.open_tab_with_link = function() {
      var import_url, tab_properties, url;
      console.log(this.data);
      import_url = this.data['data']['target_url'];
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
