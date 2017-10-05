(function() {
  var NewTabImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewTabImporter = (function(superClass) {
    extend(NewTabImporter, superClass);

    function NewTabImporter() {
      NewTabImporter.__super__.constructor.apply(this, arguments);
    }

    NewTabImporter.prototype.send_import_data = function() {
      var message_options;
      message_options = {
        type: "request_import_data"
      };
      return chrome.runtime.sendMessage(message_options, (function(_this) {
        return function(data) {
          return _this.send_to_main_window(data);
        };
      })(this));
    };

    return NewTabImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.NewTab = NewTabImporter;
  });

}).call(this);
