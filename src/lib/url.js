(function() {
  var Url;

  Url = (function() {
    function Url() {}

    Url.prototype.wrap = function(url, params) {
      if (params == null) {
        params = {};
      }
      if ((url != null) && (url[0] != null) && url[0] !== '/') {
        url = "/" + url;
      }
      url = "" + window.server_url + url;
      return url;
    };

    Url.prototype.resolve_url = function(url) {
      if ((url == null) || url.length === 0) {
        return url;
      }
      if (url.slice(0, 4) === 'data') {
        return url;
      }
      if (url.slice(0, 4) === 'http') {
        return url;
      }
      if (url.slice(0, 4) === 'chro') {
        return url;
      }
      if (url.slice(0, 2) === '//') {
        return "" + window.location.protocol + url;
      } else {
        if (url[0] === '/') {
          return "" + location.origin + url;
        } else {
          return location.origin + "/" + url;
        }
      }
    };

    Url.prototype.get_host = function(url) {
      var host, parser;
      parser = document.createElement('a');
      parser.href = url;
      return host = parser.hostname;
    };

    return Url;

  })();

  namespace("MT", function(e) {
    return e.Url != null ? e.Url : e.Url = new Url();
  });

}).call(this);
