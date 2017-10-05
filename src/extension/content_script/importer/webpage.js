(function() {
  var WebpageImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  WebpageImporter = (function(superClass) {
    extend(WebpageImporter, superClass);

    function WebpageImporter(data1) {
      this.data = data1;
      WebpageImporter.__super__.constructor.apply(this, arguments);
      this.image_handler = new MT.Extension.ContentScript.Importer.Webpage.ImageHandler(this);
      this.stylesheet_handler = new MT.Extension.ContentScript.Importer.Webpage.StylesheetHandler(this);
      this.webpage_url = this.data.tab.url;
      this.webpage_title = this.data.tab.title;
      this.favicon_url = this.data.tab.favIconUrl;
      this.url = MT.Url.wrap(MT.routes.extension_imports_webpage_path);
    }

    WebpageImporter.prototype.debug = function(message) {};

    WebpageImporter.prototype.prepare_html = function(callback) {
      return this.image_handler.get_visible_area_datauri((function(_this) {
        return function(datauri_visible_area) {
          var metatags;
          _this.datauri = datauri_visible_area;
          metatags = new MT.Extension.ContentScript.Importer.Webpage.Metatags();
          _this.meta_data = metatags.data();
          _this.clone_html();
          _this.init_iframe_message_events();
          _this.build_iframe_container_and_loader();
          return _this.image_handler.find_images_to_convert_to_datauri(function() {
            _this.convert_links();
            _this.remove_script_tags();
            return _this.stylesheet_handler.embed_css(function() {
              var html_el;
              html_el = document.createElement('html');
              html_el.appendChild(_this.head);
              html_el.appendChild(_this.body);
              _this.html_content = html_el.outerHTML;
              _this.export_data = {
                html: _this.html_content,
                meta_data: _this.meta_data
              };
              _this.image_handler.clean();
              return callback(_this.export_data);
            });
          });
        };
      })(this));
    };

    WebpageImporter.prototype.prepare_html_and_build_iframe = function() {
      return this.prepare_html((function(_this) {
        return function() {
          return _this.build_iframe();
        };
      })(this));
    };

    WebpageImporter.prototype.import_data = function() {
      var data;
      return data = {
        command: "import_webpage_data",
        webpage_url: this.webpage_url,
        title: this.webpage_title,
        favicon_url: this.favicon_url,
        html: this.html_content,
        meta_data: this.meta_data,
        thumbnail: {
          datauri: this.datauri,
          width: $(window).width(),
          height: $(window).height()
        }
      };
    };

    WebpageImporter.prototype.convert_links = function() {
      var links;
      links = $(this.body).find('a');
      return _.each(links, (function(_this) {
        return function(link) {
          var href, new_href;
          if (link != null) {
            if ((href = link.getAttribute('href')) != null) {
              if (href.length > 0 && href.slice(0, 4) !== 'http') {
                new_href = MT.Url.resolve_url(href);
                return link.setAttribute('href', new_href);
              }
            }
          }
        };
      })(this));
    };

    WebpageImporter.prototype.remove_script_tags = function() {
      var cmptr, el, list, script_tags_in_body, script_tags_in_head;
      this.debug("remove_script_tags");
      script_tags_in_head = $(this.head).find('script');
      script_tags_in_body = $(this.body).find('script');
      list = [];
      _.each(script_tags_in_head, (function(_this) {
        return function(script_tag) {
          return list.push(script_tag);
        };
      })(this));
      _.each(script_tags_in_body, (function(_this) {
        return function(script_tag) {
          return list.push(script_tag);
        };
      })(this));
      cmptr = 0;
      while ((el = list.pop())) {
        $(el).remove();
        cmptr += 1;
      }
      return this.debug("removed " + cmptr + " script tags");
    };

    WebpageImporter.prototype.clone_html = function() {
      this.image_handler.add_data_attributes();
      this.body = document.body.cloneNode(true);
      this.head = document.head.cloneNode(true);
      this.image_handler.set_body(this.body);
      return this.stylesheet_handler.set_head(this.head);
    };

    return WebpageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Webpage = WebpageImporter;
  });

}).call(this);
