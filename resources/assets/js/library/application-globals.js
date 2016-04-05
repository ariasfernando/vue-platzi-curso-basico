var Application = Application || {};
Application.globals = Application.globals || {};

// CSRF Token
Application.globals.csrfToken = $('meta[name="csrf-token"]').attr('content');
// Errors
Application.globals.errorPlaceholder = ".global-messages-placeholder";
Application.globals.campaignValidationError = "To continue, please make sure you have completed the Campaign Name, upload any missing images and complete any missing Destination URLs, or remove the incomplete module(s). Missing areas are now highlighted in red below.";
// Images
Application.globals.imageUploadSizeLimit = 2097152;
Application.globals.imageAllowedExtensions = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'];
Application.globals.enableAmpscript = false;
