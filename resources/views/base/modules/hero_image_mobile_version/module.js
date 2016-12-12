/*
 * Hero Image Mobile - (aka Full Width Image)
 */

var $canvas = ( $("#emailCanvas > tbody").length )? $("#emailCanvas > tbody") : false;

// Save content editable on element blur.
$canvas.on("click",".st-hm-trigger", function(){
    var $image = $(this).parents("[data-params]").find('[data-master-image-editor=heroMobile]');
    $image.click();
});