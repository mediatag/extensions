(function() {
  var DomHelper;

  DomHelper = (function() {
    function DomHelper() {}

    DomHelper.prototype.insertAfter = function(newNode, referenceNode) {
      return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    DomHelper.prototype.offset = function(el) {
      var obj, rect;
      rect = el.getBoundingClientRect();
      return obj = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    };

    DomHelper.prototype.hasClass = function(el, class_name) {
      var ref;
      return (ref = el.classList) != null ? ref.contains(class_name) : void 0;
    };

    DomHelper.prototype.on_document_ready = function(callback) {
      if (document.readyState === 'complete') {
        return callback();
      } else {
        return document.addEventListener("DOMContentLoaded", callback);
      }
    };

    return DomHelper;

  })();

  namespace("MT", function(e) {
    return e.DomHelper != null ? e.DomHelper : e.DomHelper = new DomHelper();
  });

}).call(this);
