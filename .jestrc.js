import $ from 'jquery';
import _ from 'lodash';
global.$ = global.jQuery = $;
global._ = _;

const Application = {};
Application.globals = Application.globals || {};
Application.globals.baseUrl = "http://localhost:4000";
Application.globals.cdnHost = "http://localhost:4000";
Application.globals.imageUrl = "http://localhost:4000/images/";
Application.globals.campaignImageUrl = "http://localhost:4000/images/campaigns";
Application.globals.library_name = "5ae9d5729db2d5000d0fd6e2";
Application.globals.logged_user = "dummy@stensul.com";
Application.globals.proofConfig = {"status":true,"required_reviews":true,"email":{"from_name":"Review Request from stensul","from_email":"preview@fanbridge.com"}};
Application.globals.csrfToken = "8qbiRyXisyaCYe8rM7EE1149Tl45tUiAd6URaiU7";
Application.globals.permissions = ["access_admin","access_admin_libraries","access_admin_modules","access_admin_permissions","access_admin_roles","access_admin_users","access_dashboard","access_campaigns","edit_campaign","access_proof","edit_proof","access_favorites","access_admin_logs","access_admin_settings","create_campaign","clone_campaign","create_template","access_library_test","fix_layout"];
Application.globals.preheaderConfig = {"enabled":true,"max_length":50};
Application.globals.validateUrlExists = true;
Application.globals.validateUrlSettings = {"selector_class":["image-destination-url","url-format"]};
Application.globals.showPopularTags = true;
Application.globals.cleanEmptyLinks = true;

global.Application = Application;
