(function() {
  var DocumentReady, completed;

  DocumentReady = (function() {
    function DocumentReady() {
      this.callbacks = [];
      this.callbacks_executed = false;
    }

    DocumentReady.prototype.on = function(callback) {
      if (this.callbacks_executed) {
        return callback();
      } else {
        return this.callbacks.push(callback);
      }
    };

    DocumentReady.prototype.execute_callbacks = function() {
      var callback, i, len, ref;
      if (this.callbacks_executed) {
        return;
      }
      this.callbacks_executed = true;
      ref = this.callbacks;
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        callback();
      }
      return this.callbacks = [];
    };

    return DocumentReady;

  })();

  namespace("MT", function(e) {
    return e.DocumentReady != null ? e.DocumentReady : e.DocumentReady = new DocumentReady();
  });

  completed = function() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    return MT.DocumentReady.execute_callbacks();
  };

  if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    window.setTimeout(MT.DocumentReady.execute_callbacks());
  } else {
    document.addEventListener("DOMContentLoaded", completed);
    window.addEventListener("load", completed);
  }

}).call(this);
