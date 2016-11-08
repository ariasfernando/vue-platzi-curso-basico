
var campaignMenu = function(customOptions){

	var customOptions = customOptions || {}; 
	var options = $.extend({
		menuSelector: ".menu-campaign",
		headGroupSelector: ".expand > h2",
		addModuleSelector: ".add",
		openSectionClass: "open-section-campaign",
		iconExpandClass: "icon-open-expan",
		beforeInit: function(){},
		afterInit: function(){}
	}, customOptions );

	this.onHeadingClick = function( element ){
		var sectionMenuShow = $(element).next();
		var changeIcon = $(element).find('i');
		var booleanShow = sectionMenuShow.hasClass( options.openSectionClass );

		if (booleanShow){
			sectionMenuShow.removeClass( options.openSectionClass );
			changeIcon.removeClass( options.iconExpandClass );
		}else{
			sectionMenuShow.addClass( options.openSectionClass );
			changeIcon.addClass( options.iconExpandClass );
		}
	};

	this.onModuleClick = function( element ){
		var moduleId = $(element).attr("id");
		var moduleAppName = $(element).attr("data-app-name");
		var moduleClass = $(element).attr("data-class");
		if( moduleId ){
			moduleManager.addModule( moduleId, moduleAppName, moduleClass );
		}
	};

	this.init = function(){
		// Before Init
		options.beforeInit();
		
		var _this = this;

		// -- Menu events [Expand/Collapse] --
		$( options.menuSelector ).on("click", options.headGroupSelector, function(){
			_this.onHeadingClick( this );
			return false;
		});

		// -- Menu events [Add module] --
		$( options.menuSelector ).on("click", options.addModuleSelector, function(){
			_this.onModuleClick( this );
			return false;
		});

		$( options.menuSelector ).find('input,select').on('change', function(){
			var $self = $(this);
			if($self.val() !== ''){
				$(this).removeClass('error');
				$(this).parent().find('label.error').remove();
			}
		});

		// After Init
		options.afterInit();
	};

	/*
	 | Init Menu
	 */
	this.init();
};