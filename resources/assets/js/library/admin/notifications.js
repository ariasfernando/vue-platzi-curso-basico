var $notificationclose = $('.global-messages-placeholder button');

$notificationclose.click(function(){
	$(this).parent().fadeOut();
});