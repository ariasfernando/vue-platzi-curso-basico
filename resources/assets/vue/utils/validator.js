import _ from "lodash";

module.exports = {
  imagesErrors(selector){
    let errorFound = false;

    // Check if all images are uploaded.
    const nonEditedImages = $(selector).find("img[src*='/default/']:visible, img[src*='base64,']");

    if (nonEditedImages.length) {
      $.each(nonEditedImages, function (index, img) {
        $(img).parent().addClass('default-image-error');
      });

      errorFound = true;
    }

    return errorFound;
  },
  modulesErrors(selector) {
    if ($(selector).find('div.default-module-error').length > 0) {
      $(selector).find('div.default-module-error').show();   
    }
  },
  tinyErrors(selector) {
    if ($(selector).find('div.tinymce-error').length > 0) {
      return true;
    }
    return false;
  },
};
