(function() {
  var RequestsController;

  RequestsController = (function() {
    function RequestsController() {}

    RequestsController.prototype.contructor = function() {
      return this.request_in_progress = false;
    };

    RequestsController.prototype.in_progress = function() {
      return this.request_in_progress === true;
    };

    RequestsController.prototype.get_available_hosts = function(unfetched_hosts, callback) {
      var url;
      unfetched_hosts = unfetched_hosts.sort();
      if (unfetched_hosts.length > 0) {
        url = MT.Url.wrap('/api/webpages/tags/hosts');
        this.request_in_progress = true;
        return $.ajax({
          method: 'POST',
          url: url,
          data: {
            hosts: unfetched_hosts,
            origin: window.location.href
          },
          success: (function(_this) {
            return function(data) {
              var available_hosts;
              _this.request_in_progress = false;
              available_hosts = data;
              return callback(available_hosts);
            };
          })(this),
          error: (function(_this) {
            return function(error) {
              _this.request_in_progress = false;
              console.log("error while querying hosts");
              return console.log(error);
            };
          })(this)
        });
      } else {
        return callback([]);
      }
    };

    RequestsController.prototype.get_urls_tags = function(urls, callback) {
      var url;
      url = MT.Url.wrap('/api/webpages/tags/tags');
      if (urls.length > 0) {
        this.request_in_progress = true;
        return $.ajax({
          method: 'POST',
          url: url,
          data: {
            origin: window.location.href,
            urls: urls
          },
          success: (function(_this) {
            return function(data) {
              var tags_by_url;
              tags_by_url = data;
              _this.request_in_progress = false;
              return callback(tags_by_url);
            };
          })(this),
          error: (function(_this) {
            return function(error) {
              _this.request_in_progress = false;
              console.log("error while querying tags");
              return console.log(error);
            };
          })(this)
        });
      } else {
        return callback();
      }
    };

    RequestsController.prototype.query_user_preferences = function(callback) {
      var url;
      url = MT.Url.wrap('/api/preferences');
      console.log(url);
      return $.ajax({
        url: url,
        data: {
          origin: window.location.href
        },
        success: function(data) {
          if (data.display === true) {
            return callback();
          }
        },
        error: function(error) {
          console.log("error while querying preferences");
          return console.log(error);
        }
      });
    };

    return RequestsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.RequestsController = RequestsController;
  });

}).call(this);
