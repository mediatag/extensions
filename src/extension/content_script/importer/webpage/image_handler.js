(function() {
  var ImageHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ImageHandler = (function() {
    function ImageHandler(parent) {
      this.parent = parent;
      this.finalize_src = bind(this.finalize_src, this);
      this.images_without_datauri_by_src = {};
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    ImageHandler.prototype.get_visible_area_datauri = function(callback) {
      return this.capturer.screenshot_visible_area((function(_this) {
        return function(datauri_visible_area) {
          return callback(datauri_visible_area);
        };
      })(this));
    };

    ImageHandler.prototype.set_body = function(body) {
      return this.body = body;
    };

    ImageHandler.prototype.find_images_to_convert_to_datauri = function(callback) {
      var all_images, images_found;
      this.debug("==== IMAGES");
      this.images_dimensions_by_data_attr = {};
      all_images = $(this.body).find('img');
      this.remove_picture_source_tags();
      _.each(all_images, (function(_this) {
        return function(img) {
          var background_image, bg_src, height, is_visible, min_dim, original_image, src, style, width;
          original_image = _this.original_image(img);
          width = Math.floor(original_image.width());
          height = Math.floor(original_image.height());
          is_visible = original_image.is(":visible");
          min_dim = 0;
          if (width > min_dim && height > min_dim && is_visible) {
            img = $(img);
            src = img.attr('src');
            img[0].dataset['mediatagWidth'] = width;
            img[0].dataset['mediatagHeight'] = height;
            if (src != null) {
              if (src.slice(0, 5) !== 'data:') {
                return _this.add_image(src, img[0], width, height);
              } else {

              }
            } else {
              style = img[0].style;
              img[0].style.width = width + "px";
              img[0].style.height = height + "px";
              bg_src = style.backgroundImage;
              if (bg_src.slice(0, 3) === "url") {
                bg_src = bg_src.replace(/url\(|\)|'|"/g, "");
                return _this.add_image(bg_src, img[0], width, height);
              } else {
                if (background_image = img.css('background-image')) {
                  img[0].style.backgroundImage = background_image;
                  return _this.debug(img[0].style.backgroundImage);
                }
              }
            }
          } else {

          }
        };
      })(this));
      images_found = _.flatten(_.values(this.images_without_datauri_by_src));
      this.debug("found " + images_found.length + " images", images_found);
      this.images_datauri_size = 0;
      this.images_src_by_size = {};
      return this.convert_next_image_to_datauri(callback);
    };

    ImageHandler.prototype.add_image = function(src, img, width, height) {
      var base, data_id;
      if ((base = this.images_without_datauri_by_src)[src] == null) {
        base[src] = [];
      }
      this.images_without_datauri_by_src[src].push(img);
      img.dataset['mediatagOriginalUrl'] = MT.Url.resolve_url(src);
      data_id = this.image_data_id(img);
      return this.images_dimensions_by_data_attr[data_id] = [width, height];
    };

    ImageHandler.prototype.convert_next_image_to_datauri = function(callback) {
      var current_image_size, image_sizes, images, resolved_src, src, src_list;
      src_list = _.keys(this.images_without_datauri_by_src);
      src = src_list[0];
      if (src != null) {
        images = this.images_without_datauri_by_src[src];
        _.each(images, (function(_this) {
          return function(image) {
            return image.removeAttribute("srcset");
          };
        })(this));
        resolved_src = MT.Url.resolve_url(src);
        this.debug(resolved_src);
        current_image_size = 0;
        return this.capturer.get_image_datauri_from_url(resolved_src, (function(_this) {
          return function(datauri) {
            if (datauri != null) {
              _this.debug("adding " + datauri.length + " to " + images.length + " images (total: " + (images.length * datauri.length) + ")");
              _.each(images, function(image) {
                $(image).attr('src', datauri);
                _this.images_datauri_size += datauri.length;
                current_image_size += datauri.length;
                return _this.debug(_this.images_datauri_size);
              });
              return _this.finalize_src(src, resolved_src, current_image_size, callback);
            } else {
              _.each(images, function(image) {
                return image.dataset['mediatagUrlToFetch'] = resolved_src;
              });
              return _this.finalize_src(src, resolved_src, current_image_size, callback);
            }
          };
        })(this));
      } else {
        image_sizes = _.sortBy(_.keys(this.images_src_by_size), function(k) {
          return -parseInt(k);
        });
        _.each(image_sizes, (function(_this) {
          return function(size) {
            _this.debug(size);
            return _this.debug(size + " - " + _this.images_src_by_size[size]);
          };
        })(this));
        this.debug("=== DONE IMAGES");
        return callback();
      }
    };

    ImageHandler.prototype.finalize_src = function(src, resolved_src, current_image_size, callback) {
      var base;
      if ((base = this.images_src_by_size)[current_image_size] == null) {
        base[current_image_size] = [];
      }
      this.images_src_by_size[current_image_size].push(resolved_src);
      delete this.images_without_datauri_by_src[src];
      return this.convert_next_image_to_datauri(callback);
    };

    ImageHandler.prototype.remove_picture_source_tags = function() {
      var picture_tags;
      picture_tags = $(this.body).find('picture');
      return _.each(picture_tags, (function(_this) {
        return function(picture_tag) {
          var source_tags;
          source_tags = $(picture_tag).find('source');
          return _.each(source_tags, function(source_tag) {
            var current_srcset;
            current_srcset = $(source_tag).attr('srcset');
            source_tag.dataset['mediatagSrcset'] = current_srcset;
            return $(source_tag).attr('srcset', null);
          });
        };
      })(this));
    };

    ImageHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    ImageHandler.prototype.clean = function() {
      return this.capturer.clean();
    };

    ImageHandler.prototype.add_data_attributes = function() {
      var images;
      images = $('img');
      return _.each(images, function(img, i) {
        return img.dataset['mediatagCopyImageId'] = i;
      });
    };

    ImageHandler.prototype.image_data_id = function(img) {
      var data_id;
      return data_id = img.dataset['mediatagCopyImageId'];
    };

    ImageHandler.prototype.original_image = function(img) {
      var copy_id, original_img;
      copy_id = this.image_data_id(img);
      return original_img = $("img[data-mediatag-copy-image-id=" + copy_id + "]");
    };

    return ImageHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.ImageHandler = ImageHandler;
  });

}).call(this);
