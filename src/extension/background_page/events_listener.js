(function() {
  var background_page_listener, process_content_script_event;

  background_page_listener = function(request, sender, sendResponse) {
    return process_content_script_event(request, sender, sendResponse);
  };

  process_content_script_event = function(request, sender, sendResponse) {
    var capturer, ref, request_type, screenshot;
    request_type = request['type'];
    console.log(request_type);
    switch (request_type) {
      case MT.EVENTS.SCREENSHOT_REQUESTED:
        screenshot = new MT.Extension.BackgroundPage.Screenshot();
        screenshot.perform(request['options'], (function(_this) {
          return function(data) {
            var response;
            response = {
              'data': data
            };
            return sendResponse(response);
          };
        })(this));
        break;
      case "capture_image_from_url":
        capturer = new MT.Capturer();
        capturer.get_image_datauri_from_url(request['url'], (function(_this) {
          return function(data) {
            var response;
            response = {
              'data': data
            };
            return sendResponse(response);
          };
        })(this));
        break;
      case "capture_stylesheet_from_url":
        capturer = new MT.Capturer();
        capturer.get_stylesheet_content_from_url(request['url'], (function(_this) {
          return function(data) {
            var response;
            response = {
              'data': data
            };
            return sendResponse(response);
          };
        })(this));
        break;
      case "request":
        $.ajax({
          'url': request['url'],
          'headers': request['headers'],
          'method': "POST",
          'dataType': "json",
          'success': (function(_this) {
            return function(response) {
              return sendResponse(response);
            };
          })(this)
        });
        break;
      case MT.EVENTS.NEW_TAB_IMPORTER:
        this.current_new_tab_importer = new MT.Extension.BackgroundPage.NewTabImporter(request['import']);
        break;
      case MT.EVENTS.REQUEST_IMPORT_DATA:
        console.log("receive main data");
        if ((ref = this.current_new_tab_importer) != null) {
          ref.send_import_data(sendResponse);
        }
        this.current_new_tab_importer = null;
        break;
      case MT.EVENTS.EXTENSION_PAGE_ACTION:
        MT.Extension.BackgroundPage.AndroidPageAction.display_page_action(sender);
        sendResponse({});
        break;
      case request_type === "new_tab":
        chrome.tabs.create({
          'url': request['url']
        });
    }
    return true;
  };

  chrome.runtime.onMessage.addListener(background_page_listener);

}).call(this);
