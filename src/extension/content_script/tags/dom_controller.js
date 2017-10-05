(function() {
  var DomController;

  DomController = (function() {
    function DomController(link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class) {
      this.link_class_with_added_tags = link_class_with_added_tags;
      this.link_class_with_considered_url = link_class_with_considered_url;
      this.tag_class = tag_class;
      this.tag_container_class = tag_container_class;
      this.links_by_url = {};
      this.tags_by_urls = {};
      this.processed_state_by_url = {};
      this.find_urls(document.body);
    }

    DomController.prototype.found_urls = function() {
      return _.keys(this.links_by_url);
    };

    DomController.prototype.find_urls = function(parent) {
      var links;
      links = $(parent).find('a[href]');
      return _.each(links, (function(_this) {
        return function(link) {
          return _this.add_link_url($(link));
        };
      })(this));
    };

    DomController.prototype.set_urls_processed = function(urls) {
      return _.each(urls, (function(_this) {
        return function(url) {
          return _this.processed_state_by_url[url] = true;
        };
      })(this));
    };

    DomController.prototype.unprocessed_urls = function() {
      var urls;
      urls = [];
      return _.select(_.keys(this.processed_state_by_url), (function(_this) {
        return function(url) {
          return _this.processed_state_by_url[url] !== true;
        };
      })(this));
    };

    DomController.prototype.add_link_url = function(link) {
      var base, url;
      if (link.attr('href') == null) {
        return;
      }
      if (link.attr('href').length === 0) {
        return;
      }
      if (link.hasClass(this.link_class_with_considered_url)) {
        return;
      }
      if (link.find('img').length > 0) {
        return;
      }
      link.addClass(this.link_class_with_considered_url);
      url = link.attr('href');
      url = MT.Url.resolve_url(url);
      if (this.processed_state_by_url[url] == null) {
        this.processed_state_by_url[url] = false;
        if ((base = this.links_by_url)[url] == null) {
          base[url] = [];
        }
        return this.links_by_url[url].push(link);
      }
    };

    DomController.prototype.add_tags = function(tags_by_url) {
      return _.each(_.keys(tags_by_url), (function(_this) {
        return function(url) {
          var tags;
          tags = tags_by_url[url];
          return _this.add_tags_for_url(url, tags);
        };
      })(this));
    };

    DomController.prototype.add_tags_for_url = function(url, tags) {
      var first_link, links, tag_container, tag_names;
      if (tags == null) {
        return;
      }
      if (tags.length === 0) {
        return;
      }
      tag_names = _.map(tags, function(tag) {
        return tag.name;
      });
      if (tag_names.length === 0) {
        return;
      }
      links = this.links_by_url[url];
      if (links == null) {
        return;
      }
      first_link = null;
      _.each(links, (function(_this) {
        return function(link) {
          if (!link.hasClass(_this.link_class_with_added_tags)) {
            link.addClass(_this.link_class_with_added_tags);
            return first_link != null ? first_link : first_link = link;
          }
        };
      })(this));
      if (first_link != null) {
        tag_container = this.create_tag_container();
        $(first_link).append(tag_container);
        return _.each(tag_names, (function(_this) {
          return function(tag_name) {
            return tag_container.append(_this.create_tag(tag_name));
          };
        })(this));
      }
    };

    DomController.prototype.create_tag_container = function() {
      var tag_container;
      tag_container = $('<span>');
      tag_container.addClass(this.tag_container_class);
      return tag_container;
    };

    DomController.prototype.create_tag = function(name) {
      var tag;
      tag = $('<span>');
      tag.addClass(this.tag_class);
      tag.css('display', 'inline-block inline-flex');
      tag.css('padding', '2px 5px');
      tag.css('margin-left', '3px');
      tag.css('border-radius', '3px');
      tag.css('background-color', Color.hsl_from_name(name));
      tag.css('color', '#111');
      tag.text(name);
      return tag;
    };

    return DomController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.DomController = DomController;
  });

}).call(this);
