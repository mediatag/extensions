(function() {
  var style;

  style = {
    font: "Source Sans Pro, Arial, sans-serif",
    color: {
      alert: '#cc4b37',
      primary: '#1779ba',
      bg: '#fafcff',
      font: '#111111'
    }
  };

  namespace("MT", function(e) {
    return e.style = style;
  });

}).call(this);
