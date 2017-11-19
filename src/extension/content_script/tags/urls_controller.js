(function() {
  var UrlsController;

  UrlsController = (function() {
    function UrlsController() {
      this.availabilities_by_host = {};
      this.tags_by_urls = {};
      this.urls_by_host = {};
      this.hosts_by_url = {};
    }

    UrlsController.prototype.add_urls = function(urls) {
      return _.each(urls, (function(_this) {
        return function(url) {
          var base, host;
          if (_this.hosts_by_url[url] == null) {
            host = MT.Url.get_host(url);
            _this.hosts_by_url[url] = host;
            if ((base = _this.urls_by_host)[host] == null) {
              base[host] = [];
            }
            return _this.urls_by_host[host].push(url);
          }
        };
      })(this));
    };

    UrlsController.prototype.add_tags_for_url = function(url, tags) {
      return this.tags_by_urls[url] = tags;
    };

    UrlsController.prototype.get_tags_by_url = function() {
      return this.tags_by_urls;
    };

    UrlsController.prototype.unfetched_urls = function(urls) {
      if ((urls == null) || urls.length === 0) {
        return;
      }
      urls = _.filter(urls, (function(_this) {
        return function(url) {
          return _this.tags_by_urls[url] == null;
        };
      })(this));
      if (urls.length === 0) {
        return;
      }
      return urls = _.uniq(urls.sort());
    };

    UrlsController.prototype.unfetched_and_available_urls = function() {
      var hosts, list;
      list = [];
      hosts = _.keys(this.urls_by_host);
      _.each(hosts, (function(_this) {
        return function(host) {
          var host_urls;
          host_urls = _this.urls_by_host[host];
          if (_this.is_host_unfetched(host)) {
            return list.push(host_urls);
          } else {
            if (_this.is_host_available(host)) {
              return _.each(host_urls, function(url) {
                if (_this.is_url_unfetched(url)) {
                  return list.push(url);
                }
              });
            }
          }
        };
      })(this));
      return list;
    };

    UrlsController.prototype.unfetched_hosts = function() {
      var hosts;
      hosts = _.keys(this.urls_by_host);
      return _.filter(hosts, (function(_this) {
        return function(host) {
          return _this.is_host_unfetched(host);
        };
      })(this));
    };

    UrlsController.prototype.set_hosts_availability = function(host, available) {
      return this.availabilities_by_host[host] = available;
    };

    UrlsController.prototype.is_host_unfetched = function(host) {
      return this.availabilities_by_host[host] == null;
    };

    UrlsController.prototype.is_host_available = function(host) {
      return this.availabilities_by_host[host] === true;
    };

    UrlsController.prototype.is_url_unfetched = function(url) {
      return this.tags_by_urls[url] == null;
    };

    UrlsController.prototype.is_url_host_available = function(url) {
      var host;
      host = this.hosts_by_url[url] || MT.Url.get_host(url);
      return this.is_host_available(host);
    };

    return UrlsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.UrlsController = UrlsController;
  });

}).call(this);
