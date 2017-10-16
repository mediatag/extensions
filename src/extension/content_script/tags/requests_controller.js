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
      var data, request, url;
      unfetched_hosts = unfetched_hosts.sort();
      if (unfetched_hosts.length > 0) {
        url = MT.Url.wrap('/api/webpages/tags/hosts');
        this.request_in_progress = true;
        request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = (function(_this) {
          return function(event) {
            var available_hosts, data, response;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              console.log(data);
              _this.request_in_progress = false;
              available_hosts = data;
              return callback(available_hosts);
            } else {
              return console.log("get_available_hosts returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            _this.request_in_progress = false;
            console.log("error while querying hosts");
            return console.log(error);
          };
        })(this);
        data = {
          origin: this.origin(),
          hosts: unfetched_hosts
        };
        console.log("get_available_hosts");
        return request.send(JSON.stringify(data));
      } else {
        return callback([]);
      }
    };

    RequestsController.prototype.get_urls_tags = function(urls, callback) {
      var data, request, url;
      url = MT.Url.wrap('/api/webpages/tags/tags');
      if (urls.length > 0) {
        this.request_in_progress = true;
        request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = (function(_this) {
          return function(event) {
            var data, response, tags_by_url;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              console.log(data);
              tags_by_url = data;
              _this.request_in_progress = false;
              return callback(tags_by_url);
            } else {
              return console.log("get_urls_tags returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            _this.request_in_progress = false;
            console.log("error while querying tags");
            return console.log(error);
          };
        })(this);
        data = {
          origin: this.origin(),
          urls: urls
        };
        console.log("get_urls_tags");
        return request.send(JSON.stringify(data));
      } else {
        return callback();
      }
    };

    RequestsController.prototype.query_user_preferences = function(callback) {
      return MT.ContentScript.UserPreferencesController.send_request((function(_this) {
        return function(data) {
          if (data['tags_display'] === true) {
            return callback();
          } else {
            console.log("tags display not allowed");
            return console.log(data);
          }
        };
      })(this));
    };

    RequestsController.prototype.origin = function() {
      return window.location.href;
    };

    return RequestsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.RequestsController = RequestsController;
  });

}).call(this);
