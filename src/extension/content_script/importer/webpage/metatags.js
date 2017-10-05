(function() {
  var Metatags;

  Metatags = (function() {
    function Metatags() {}

    Metatags.prototype.data = function() {
      return {
        keywords: this.metatag_value(this.keywords_metatag()),
        author: this.metatag_value(this.author_metatag()),
        image: this.metatag_content(this.image_metatag())
      };
    };

    Metatags.prototype.metatag_attribute_value = function(metatag, attr) {
      var ref;
      return metatag != null ? (ref = metatag.attributes[attr]) != null ? ref.value : void 0 : void 0;
    };

    Metatags.prototype.metatag_content = function(metatag) {
      return this.metatag_attribute_value(metatag, 'content');
    };

    Metatags.prototype.metatag_property = function(metatag) {
      return this.metatag_attribute_value(metatag, 'property');
    };

    Metatags.prototype.metatag_name = function(metatag) {
      return this.metatag_attribute_value(metatag, 'name');
    };

    Metatags.prototype.metatags = function() {
      return this._metatags != null ? this._metatags : this._metatags = document.getElementsByTagName('meta');
    };

    Metatags.prototype.metatag_value = function(metatag) {
      var content, elements;
      if ((content = this.metatag_content(metatag)) != null) {
        elements = content.split(',');
        return _.flatten(_.map(elements, function(element) {
          return element.split(' and ');
        }));
      }
    };

    Metatags.prototype.author_metatag = function() {
      return _.find(this.metatags(), (function(_this) {
        return function(metatag) {
          return _this.metatag_name(metatag) === "author";
        };
      })(this));
    };

    Metatags.prototype.keywords_metatag = function() {
      var metatag, names;
      names = ["news_keywords", "keywords"];
      metatag = null;
      _.each(names, (function(_this) {
        return function(name) {
          return metatag != null ? metatag : metatag = _.find(_this.metatags(), function(metatag) {
            return _this.metatag_name(metatag) === name;
          });
        };
      })(this));
      return metatag;
    };

    Metatags.prototype.image_metatag = function() {
      var metatag, properties;
      properties = ["og:image", "twitter:image"];
      metatag = null;
      _.each(properties, (function(_this) {
        return function(property) {
          return metatag != null ? metatag : metatag = _.find(_this.metatags(), function(metatag) {
            return _this.metatag_property(metatag) === property;
          });
        };
      })(this));
      return metatag;
    };

    return Metatags;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.Metatags = Metatags;
  });

}).call(this);
