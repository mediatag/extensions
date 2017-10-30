(function() {
  var StylesheetHandler;

  StylesheetHandler = (function() {
    function StylesheetHandler(parent) {
      this.parent = parent;
      this.stylesheet_urls = [];
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    StylesheetHandler.prototype.set_head = function(head) {
      return this.head = head;
    };

    StylesheetHandler.prototype.embed_css = function(callback) {
      var body_stylesheets, head_stylesheets, stylesheets, stylesheets_selector;
      this.debug("embed_css START");
      stylesheets_selector = 'link[rel=stylesheet]';
      head_stylesheets = document.head.querySelectorAll(stylesheets_selector);
      body_stylesheets = document.body.querySelectorAll(stylesheets_selector);
      stylesheets = [];
      _.each(head_stylesheets, (function(_this) {
        return function(head_stylesheet) {
          if (head_stylesheet != null) {
            return stylesheets.push(head_stylesheet);
          }
        };
      })(this));
      _.each(body_stylesheets, (function(_this) {
        return function(body_stylesheet) {
          if (body_stylesheet != null) {
            return stylesheets.push(body_stylesheet);
          }
        };
      })(this));
      this.embedded_stylesheet_size_by_urls = {};
      _.each(stylesheets, (function(_this) {
        return function(stylesheet) {
          var url;
          if (stylesheet != null) {
            url = stylesheet.href;
            if (_this.is_stylesheet_url_valid(url, true)) {
              console.log("stylesheet: " + url);
              if (url != null) {
                if (!_.includes(_this.stylesheet_urls, url)) {
                  return _this.stylesheet_urls.push(url);
                }
              }
            }
          }
        };
      })(this));
      this.debug("found " + this.stylesheet_urls.length + " main stylesheets");
      this.debug(this.stylesheet_urls);
      return this.embed_next_stylesheet(callback);
    };

    StylesheetHandler.prototype.is_stylesheet_url_valid = function(stylesheet_url, require_css_ext) {
      if (require_css_ext == null) {
        require_css_ext = false;
      }
      return (stylesheet_url != null) && stylesheet_url.length > 1 && (!require_css_ext || stylesheet_url.split('.').pop() === 'css');
    };

    StylesheetHandler.prototype.embed_next_stylesheet = function(callback) {
      var request, stylesheet_url, urls_sorted_by_size;
      stylesheet_url = this.stylesheet_urls.shift();
      if (stylesheet_url != null) {
        if (this.is_stylesheet_url_valid(stylesheet_url)) {
          stylesheet_url = MT.Url.resolve_url(stylesheet_url);
          console.log(stylesheet_url);
          request = new XMLHttpRequest();
          request.open('GET', stylesheet_url, true);
          request.onload = (function(_this) {
            return function(event) {
              var response;
              if ((response = request.response) != null) {
                _this.embedded_stylesheet_size_by_urls[stylesheet_url] = response.length;
                _this.process_stylesheet_content(response, stylesheet_url);
              }
              return _this.embed_next_stylesheet(callback);
            };
          })(this);
          request.onerror = (function(_this) {
            return function(error) {
              return _this.capturer.get_stylesheet_content_from_url(stylesheet_url, function(response) {
                var style;
                if (response != null) {
                  _this.embedded_stylesheet_size_by_urls[stylesheet_url] = response.length;
                  _this.process_stylesheet_content(response, stylesheet_url);
                } else {
                  style = document.createElement('style');
                  style.dataset['mediatagUrlToFetch'] = stylesheet_url;
                  _this.head.appendChild(style);
                }
                return _this.embed_next_stylesheet(callback);
              });
            };
          })(this);
          return request.send();
        } else {
          console.log("'" + stylesheet_url + "' NOT VALID");
          return this.embed_next_stylesheet(callback);
        }
      } else {
        this.debug("stylesheet embed DONE");
        urls_sorted_by_size = _.sortBy(_.keys(this.embedded_stylesheet_size_by_urls), (function(_this) {
          return function(url) {
            return _this.embedded_stylesheet_size_by_urls[url];
          };
        })(this));
        _.each(urls_sorted_by_size, (function(_this) {
          return function(url) {
            var size;
            size = _this.embedded_stylesheet_size_by_urls[url];
            return _this.debug(url + " (" + size + ")");
          };
        })(this));
        return callback();
      }
    };

    StylesheetHandler.prototype.process_stylesheet_content = function(stylesheet_content, stylesheet_url) {
      var elements, style;
      elements = stylesheet_content.split(';');
      _.each(elements, (function(_this) {
        return function(element) {
          if (element.indexOf('@import') >= 0) {
            return _this.process_css_import(element);
          }
        };
      })(this));
      style = document.createElement('style');
      style.dataset['mediatagStylesheetContent'] = stylesheet_content;
      return this.head.appendChild(style);
    };

    StylesheetHandler.prototype.process_css_import = function(css_import) {
      var regexp, result, url;
      regexp = new RegExp('.*"(.*)".*');
      result = regexp.exec(css_import);
      if (result != null) {
        url = result[1];
        if (url != null) {
          if (!_.includes(this.stylesheet_urls, url)) {
            return this.stylesheet_urls.push(url);
          }
        }
      }
    };

    StylesheetHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    return StylesheetHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.StylesheetHandler = StylesheetHandler;
  });

}).call(this);
