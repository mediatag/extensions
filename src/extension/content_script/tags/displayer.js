(function() {
  var Displayer;

  Displayer = (function() {
    function Displayer() {
      var classes_to_ignore, link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class;
      link_class_with_added_tags = 'mediatag_tag_link_with_added_tags';
      link_class_with_considered_url = 'mediatag_tag_link_with_considered_url';
      tag_class = 'mediatag_tag_class';
      tag_container_class = 'mediatag_tag_container_class';
      this.display_tags_user_allowed = false;
      this.requests_controller = new MT.Manager.ContentScript.Tags.RequestsController();
      this.dom_controller = new MT.Manager.ContentScript.Tags.DomController(link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class);
      this.urls_controller = new MT.Manager.ContentScript.Tags.UrlsController();
      classes_to_ignore = [tag_container_class, tag_class];
      this.events_controller = new MT.Manager.ContentScript.Tags.EventsController(classes_to_ignore, (function(_this) {
        return function() {
          return _this.check_pending_nodes();
        };
      })(this));
      this.init();
    }

    Displayer.prototype.init = function() {
      this.tags_by_urls = {};
      this.availabilities_by_host = {};
      return this.requests_controller.query_user_preferences((function(_this) {
        return function() {
          _this.display_tags_user_allowed = true;
          return _this.perform();
        };
      })(this));
    };

    Displayer.prototype.perform = function() {
      if (this.display_tags_user_allowed === false) {
        return;
      }
      return this.query_hosts();
    };

    Displayer.prototype.query_hosts = function() {
      var unfetched_hosts, urls;
      urls = this.dom_controller.unprocessed_urls();
      this.dom_controller.set_urls_processed(urls);
      this.urls_controller.add_urls(urls);
      unfetched_hosts = this.urls_controller.unfetched_hosts();
      if (unfetched_hosts.length > 0) {
        return this.requests_controller.get_available_hosts(unfetched_hosts, (function(_this) {
          return function(available_hosts) {
            _this.process_available_hosts(unfetched_hosts, available_hosts);
            return _this.query_tags();
          };
        })(this));
      } else {
        return this.query_tags();
      }
    };

    Displayer.prototype.query_tags = function() {
      var unfetched_urls;
      unfetched_urls = this.urls_controller.unfetched_and_available_urls();
      return this.requests_controller.get_urls_tags(unfetched_urls, (function(_this) {
        return function(tags_by_url) {
          _.each(_.keys(tags_by_url), function(url) {
            var tags;
            tags = tags_by_url[url];
            return _this.urls_controller.add_tags_for_url(url, tags);
          });
          _this.dom_controller.add_tags(_this.urls_controller.get_tags_by_url());
          return _this.check_pending_nodes();
        };
      })(this));
    };

    Displayer.prototype.process_available_hosts = function(unfetched_hosts, available_hosts) {
      return _.each(unfetched_hosts, (function(_this) {
        return function(host) {
          var available;
          available = _.includes(available_hosts, host);
          return _this.urls_controller.set_hosts_availability(host, available);
        };
      })(this));
    };

    Displayer.prototype.check_pending_nodes = function() {
      var pending_nodes;
      if (this.display_tags_user_allowed === false) {
        return;
      }
      if (this.requests_controller.in_progress()) {
        return;
      }
      pending_nodes = this.events_controller.get_pending_nodes();
      if (pending_nodes.length > 0) {
        this.events_controller.clean_pending_nodes();
        _.each(pending_nodes, (function(_this) {
          return function(pending_node) {
            return _this.dom_controller.find_urls(pending_node);
          };
        })(this));
        if (this.dom_controller.unprocessed_urls().length > 0) {
          return this.query_hosts();
        }
      }
    };

    return Displayer;

  })();

  console.log("window.tags_display_allowed: " + window.tags_display_allowed);

  if (window.tags_display_allowed === true) {
    MT.DocumentReady.on(function() {
      return window.tags_displayer != null ? window.tags_displayer : window.tags_displayer = new Displayer();
    });
  }

}).call(this);
