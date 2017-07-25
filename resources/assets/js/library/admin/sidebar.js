var $trigger = $('.beta-accordion-trigger');

$trigger.click(function(e){
	e.preventDefault();
	$(this).siblings('ul.beta-menu-dropdown').slideToggle();
	$(this).siblings('.glyphicon-menu-down').toggleClass('glyphicon-menu-up');

});

var $url = window.location.href;
$('.beta-menu-dropdown a[href="'+$url+'"]').parent().parent().addClass('st-menu-expanded');
$('.beta-menu-dropdown a[href="'+$url+'"]').addClass('st-active');
$('.beta-menu-dropdown a[href="'+$url+'"]').parent().parent().siblings('.glyphicon-menu-down').toggleClass('glyphicon-menu-up');
