var Application = Application || {};
Application.globals = Application.globals || {};

// CSRF Token
Application.globals.csrfToken = $('meta[name="csrf-token"]').attr('content');
// Errors
Application.globals.errorPlaceholder = ".global-messages-placeholder";
// Images
Application.globals.imageUploadSizeLimit = 2097152;
Application.globals.imageAllowedExtensions = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'];
