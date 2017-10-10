(function() {
  var ElementsWithBgImageHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ElementsWithBgImageHandler = (function() {
    function ElementsWithBgImageHandler(parent1) {
      this.parent = parent1;
      this.finalize_src = bind(this.finalize_src, this);
      this.elements_without_datauri_by_src = {};
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    ElementsWithBgImageHandler.prototype.set_body = function(body) {
      return this.body = body;
    };

    ElementsWithBgImageHandler.prototype.find_elements_to_convert_to_datauri = function(callback) {
      var all_elements, elements_found;
      this.debug("==== ELEMENTS WITH BG IMAGES");
      this.elements_dimensions_by_data_attr = {};
      all_elements = this.tagged_elements();
      _.each(all_elements, (function(_this) {
        return function(element) {
          return _this.prepare_element(element);
        };
      })(this));
      elements_found = _.flatten(_.values(this.elements_without_datauri_by_src));
      this.debug("found " + elements_found.length + " elements with bg image", elements_found);
      this.elements_datauri_size = 0;
      this.elements_src_by_size = {};
      return this.convert_next_element_to_datauri(callback);
    };

    ElementsWithBgImageHandler.prototype.prepare_element = function(element) {
      var bg_src, height, min_dim, original_element, style, width;
      console.log("prepare_element", element);
      original_element = this.original_element(element);
      width = Math.floor(original_element.offsetWidth);
      height = Math.floor(original_element.offsetHeight);
      min_dim = 0;
      if (width > 0 && height > 0) {
        element.dataset['mediatagWidth'] = width;
        element.dataset['mediatagHeight'] = height;
        style = element.style;
        element.style.width = width + "px";
        element.style.height = height + "px";
        bg_src = style.backgroundImage;
        if (bg_src.slice(0, 3) === "url") {
          bg_src = bg_src.replace(/url\(|\)|'|"/g, "");
          return this.add_element(bg_src, element, width, height);
        } else {

        }
      } else {
        return this.debug("element not visible or less than " + min_dim + ", skipped");
      }
    };

    ElementsWithBgImageHandler.prototype.add_element = function(src, element, width, height) {
      var base, data_id;
      if ((base = this.elements_without_datauri_by_src)[src] == null) {
        base[src] = [];
      }
      this.elements_without_datauri_by_src[src].push(element);
      element.dataset['mediatagOriginalBgUrl'] = MT.Url.resolve_url(src);
      data_id = this.element_data_id(element);
      return this.elements_dimensions_by_data_attr[data_id] = [width, height];
    };

    ElementsWithBgImageHandler.prototype.convert_next_element_to_datauri = function(callback) {
      var current_element_size, elements, image_sizes, resolved_src, src, src_list;
      src_list = _.keys(this.elements_without_datauri_by_src);
      src = src_list[0];
      if (src != null) {
        elements = this.elements_without_datauri_by_src[src];
        resolved_src = MT.Url.resolve_url(src);
        this.debug(resolved_src);
        current_element_size = 0;
        return this.capturer.get_image_datauri_from_url(resolved_src, (function(_this) {
          return function(datauri) {
            if (datauri != null) {
              datauri = datauri.replace(/[\n\r]+/g, '');
              datauri = datauri.replace(/\s{2,10}/g, ' ');
              _this.debug("adding " + datauri.length + " to " + elements.length + " images (total: " + (elements.length * datauri.length) + ")");
              _.each(elements, function(element) {
                var wrapped_datauri;
                wrapped_datauri = "url('" + datauri + "')";
                element.style.backgroundImage = wrapped_datauri;
                _this.elements_datauri_size += datauri.length;
                current_element_size += datauri.length;
                return _this.debug(_this.elements_datauri_size);
              });
              return _this.finalize_src(src, resolved_src, current_element_size, callback);
            } else {
              _.each(elements, function(element) {
                return element.dataset['mediatagBgUrlToFetch'] = resolved_src;
              });
              return _this.finalize_src(src, resolved_src, current_element_size, callback);
            }
          };
        })(this));
      } else {
        image_sizes = _.sortBy(_.keys(this.elements_src_by_size), function(k) {
          return -parseInt(k);
        });
        _.each(image_sizes, (function(_this) {
          return function(size) {
            _this.debug(size);
            return _this.debug(size + " - " + _this.elements_src_by_size[size]);
          };
        })(this));
        this.debug("=== DONE IMAGES");
        return callback();
      }
    };

    ElementsWithBgImageHandler.prototype.finalize_src = function(src, resolved_src, current_element_size, callback) {
      var base;
      if ((base = this.elements_src_by_size)[current_element_size] == null) {
        base[current_element_size] = [];
      }
      this.elements_src_by_size[current_element_size].push(resolved_src);
      delete this.elements_without_datauri_by_src[src];
      return this.convert_next_element_to_datauri(callback);
    };

    ElementsWithBgImageHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    ElementsWithBgImageHandler.prototype.clean = function() {
      return this.capturer.clean();
    };

    ElementsWithBgImageHandler.prototype.elements_with_background_element = function(parent) {
      var elements;
      elements = parent.querySelectorAll("*:not(img)");
      return _.filter(elements, function(e) {
        var bg, bg_val;
        bg_val = window.getComputedStyle ? bg = document.defaultView.getComputedStyle(e, null).getPropertyValue('background-image') : this.currentStyle.backgroundImage;
        return bg_val !== "none";
      });
    };

    ElementsWithBgImageHandler.prototype.add_data_attributes = function() {
      var elements;
      elements = this.elements_with_background_element(document.body);
      return _.each(elements, function(element, i) {
        return element.dataset['mediatagCopyElementWithBgImageId'] = i;
      });
    };

    ElementsWithBgImageHandler.prototype.element_data_id = function(element) {
      var data_id;
      return data_id = element.dataset['mediatagCopyElementWithBgImageId'];
    };

    ElementsWithBgImageHandler.prototype.tagged_elements = function() {
      return this.body.querySelectorAll("[data-mediatag-copy-element-with-bg-image-id]");
    };

    ElementsWithBgImageHandler.prototype.original_element = function(element) {
      var copy_id, original_element, selector;
      copy_id = this.element_data_id(element);
      selector = "[data-mediatag-copy-element-with-bg-image-id='" + copy_id + "']";
      return original_element = document.body.querySelectorAll(selector)[0];
    };

    return ElementsWithBgImageHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.ElementsWithBgImageHandler = ElementsWithBgImageHandler;
  });

}).call(this);
