(function() {
  var EventsController;

  EventsController = (function() {
    function EventsController(classes_to_ignore, callback) {
      this.classes_to_ignore = classes_to_ignore;
      this.callback = callback;
      this.pending_nodes = [];
      this.dirty = false;
      this.set_mutation_events();
    }

    EventsController.prototype.is_dirty = function() {
      return this.dirty;
    };

    EventsController.prototype.get_pending_nodes = function() {
      return this.pending_nodes;
    };

    EventsController.prototype.set_clean = function() {
      this.pending_nodes = [];
      return this.dirty = false;
    };

    EventsController.prototype.set_mutation_events = function() {
      var observer;
      observer = new MutationObserver((function(_this) {
        return function(mutations) {
          var added_nodes;
          added_nodes = _.uniq(_.flatten(_.map(mutations, function(mutation) {
            return mutation.addedNodes;
          })));
          if (added_nodes.length > 0) {
            added_nodes = _.filter(added_nodes, function(added_node) {
              var is_a_tag_added_by_content_script;
              is_a_tag_added_by_content_script = false;
              _.each(_this.classes_to_ignore, function(class_to_ignore) {
                if ($(added_node).hasClass(class_to_ignore)) {
                  return is_a_tag_added_by_content_script = true;
                }
              });
              return !is_a_tag_added_by_content_script;
            });
            if (added_nodes.length > 0) {
              _.each(added_nodes, function(added_node) {
                return _this.pending_nodes.push(added_node);
              });
              _this.dirty = true;
              return _this.callback();
            }
          }
        };
      })(this));
      return observer.observe(document.body, {
        subtree: true,
        childList: true
      });
    };

    return EventsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.EventsController = EventsController;
  });

}).call(this);