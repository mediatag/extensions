(function() {
  var MediumOrWebpageImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MediumOrWebpageImporter = (function(superClass) {
    extend(MediumOrWebpageImporter, superClass);

    function MediumOrWebpageImporter(data1) {
      this.data = data1;
      MediumOrWebpageImporter.__super__.constructor.apply(this, arguments);
      this.url = this.data.tab.url;
      this.is_medium_page((function(_this) {
        return function(status, service_name) {
          if (status) {
            _this.data['service_name'] = service_name;
            return new MT.Extension.ContentScript.Importer.Medium(_this.data);
          } else {
            return new MT.Extension.ContentScript.Importer.Webpage(_this.data).prepare_html_and_build_iframe();
          }
        };
      })(this));
    }

    MediumOrWebpageImporter.prototype.is_medium_page = function(callback) {
      var response, service_finder, url;
      if (window.environment === 'development' && (this.url.indexOf('tests/extension_import_medium') > 0)) {
        return callback(true);
      } else {
        service_finder = new MT.ServiceFinder();
        if (response = service_finder.is_url_valid(this.url)) {
          return callback(response['valid'], response['name']);
        } else {
          url = MT.Url.wrap("/api/media/is_url_valid?url=" + this.url);
          return $.getJSON(url).then((function(_this) {
            return function(data) {
              var service_name, status;
              status = data['valid'];
              service_name = data['service'];
              return callback(data['valid'], service_name);
            };
          })(this));
        }
      }
    };

    return MediumOrWebpageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.MediumOrWebpage = MediumOrWebpageImporter;
  });

}).call(this);
