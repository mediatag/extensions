(function() {
  var UserPreferencesController;

  UserPreferencesController = (function() {
    function UserPreferencesController() {}

    UserPreferencesController.prototype.send_request = function(callback) {
      var request, url;
      if (environment === 'production' && (this.hostname() === 'localhost' || this.hostname().includes('127.'))) {
        console.log("hostname is localhost, not querying user preferences");
      } else if (this.hostname() === 'mediatag') {
        console.log("hostname is mediatag, not querying user preferences");
      } else {
        console.log("loading user preferences...");
        url = MT.Url.wrap('/api/preference');
        url += "?origin=" + (this.origin());
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = (function(_this) {
          return function(event) {
            var data, response;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              return callback(data);
            } else {
              return console.log("query_user_preferences returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            console.log("error while querying preferences");
            return console.log(error);
          };
        })(this);
        return request.send();
      }
    };

    UserPreferencesController.prototype.origin = function() {
      return window.location.href;
    };

    UserPreferencesController.prototype.hostname = function() {
      return window.location.hostname;
    };

    return UserPreferencesController;

  })();

  namespace("MT.ContentScript", function(e) {
    return e.UserPreferencesController != null ? e.UserPreferencesController : e.UserPreferencesController = new UserPreferencesController();
  });

}).call(this);
