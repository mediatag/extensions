(function() {
  var ServiceFinder;

  ServiceFinder = (function() {
    function ServiceFinder() {}

    ServiceFinder.prototype.regexp_lists = function() {
      return {
        'vimeo': {
          '^https?://(www.)?vimeo.com/(\\d+)(\\?.*)?$': 2,
          '^https?://(www.)?vimeo.com/channels/\\w*/(\\d+)(\\?.*)?$': 2,
          '^https?://(www.)?vimeo.com/groups/\\w*/videos/(\\d+)(\\?.*)?$': 2
        },
        'youtube': {
          '^https?://(www.)?youtube.com/watch\\?v=([\\w-]+)(&.*)?': 2,
          '^https?://(www.)?youtube.com/watch\\?(.*)&v=([\\w-]+)': 3,
          '^https?://(www.)?youtube.com/user/\\w+\\?v=([\\w-]+)(&.*)?': 2,
          '^https?://(www.)?youtube.com/embed/([\\w-]+)?': 2,
          '^https?://(www.)?youtu.be/([\\w-]+)(&.*)?': 2
        }
      };
    };

    ServiceFinder.prototype.is_url_valid = function(url) {
      var h, response;
      h = this.regexp_lists();
      response = null;
      _.each(_.keys(h), (function(_this) {
        return function(service) {
          var list;
          list = h[service];
          return _.each(_.keys(list), function(regexp_str) {
            var expected_result_index, regexp, result, valid;
            expected_result_index = list[regexp_str];
            regexp = new RegExp(regexp_str);
            if ((result = regexp.exec(url)) != null) {
              if (result[expected_result_index] != null) {
                valid = true;
                return response = {
                  valid: true,
                  name: service
                };
              }
            }
          });
        };
      })(this));
      return response;
    };

    return ServiceFinder;

  })();

  namespace("MT", function(e) {
    return e.ServiceFinder = ServiceFinder;
  });

}).call(this);
