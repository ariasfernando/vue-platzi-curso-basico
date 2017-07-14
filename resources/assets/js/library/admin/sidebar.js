var $trigger = $('.beta-accordion-trigger');

$trigger.click(function(e){
	e.preventDefault();
	$(this).siblings('ul.beta-menu-dropdown').slideToggle();
	$(this).siblings('.glyphicon-menu-down').toggleClass('glyphicon-menu-up');
});
