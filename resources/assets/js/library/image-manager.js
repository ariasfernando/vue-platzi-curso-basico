/*
 | Image Manager
 | The code below contains functions to upload images and generate canvas.
 | Note: html2canvas plugin is required.
 */
var imageManager = {

	/*
	 * Do image upload
	 */
	uploadImage: function( ajaxData, fnDone, fnFail ){
		if (!ajaxData){
			return false
		}

		// Do ajax to get process status.
		var ajaxRequest = Application.utils.doAjax("/campaign/upload-image",{ data: ajaxData });

		// On ajax Done
		ajaxRequest.done(function( response ){
			if( fnDone ){
				fnDone( response );
			}
		});

		ajaxRequest.fail(function(){
			if( fnFail ){
				fnFail();
			}
		});
	},

	/*
	 * image resize upload
	 */
	uploadResizeImage: function( ajaxData, fnDone, fnFail ){
		if (!ajaxData){
			return false
		}

		// Do ajax to get process status.
		var ajaxRequest = Application.utils.doAjax("/campaign/resize-image",{ data: ajaxData });

		// On ajax Done
		ajaxRequest.done(function( response ){
			if( fnDone ){
				fnDone( response );
			}
		});

		ajaxRequest.fail(function(){
			if( fnFail ){
				fnFail();
			}
		});
	},

	/*
	 * Generate Canvas
	 */
	generateCanvas: function( element, onrendered, scaleRatio ){
		var ratio = typeof(scaleRatio) === "undefined" ? 1 : scaleRatio;

		// Init html2canvas.
		var generator = html2canvas( element, {
			scaleRatio: ratio
		});

		generator.then(function( canvas ){
			if( onrendered ){
				onrendered( canvas );
			}
		});
	},

	/*
	 * Fetch og image
	 */
	fecthOgImage: function( ajaxData, fnDone, fnFail ){
		if( !ajaxData ){
			return false
		}

		// Do ajax to get process status.
		var ajaxRequest = Application.utils.doAjax("/campaign/og-image",{ data: ajaxData });

		// On ajax Done
		ajaxRequest.done(function( response ){
			if (fnDone){
				fnDone( response );
			}
		});

		ajaxRequest.fail(function(){
			if( fnFail ){
				fnFail();
			}
		});
	},

	/*
	 * == Custom image merge ==
	 * Used to merge layers to an animated gif.
	 * Params:
		-	campaign_id: current campaign id by default | campaignManager.getCampaignId()
		-	background_path: saved background path | Example: /574c9a227f8b9a661360742e/en_us/574da65d41141-1464706653.2666.gif
		-	layers: [{
				top: pixels position number,  | Example: 27
				left: pixels position number, | Example: 10
				path: local path or base64	  | Example: /_common/images/en_us/logo.png
			},{
				top: pixels position number,
				left: pixels position number,
				path: local path or base64
			}]
	 */
	customImageMerge: function( ajaxData, fnDone, fnFail ){
		if( !ajaxData ){
			return false
		}

		var dataParams = $.extend({
			campaign_id: campaignManager.getCampaignId()
		},ajaxData);

		// Do ajax to get process status.
		var ajaxRequest = Application.utils.doAjax("/campaign/custom-image-merge",{ data: dataParams });

		// On ajax Done
		ajaxRequest.done(function( response ){
			if( fnDone ){
				fnDone( response );
			}
		});

		ajaxRequest.fail(function(){
			if( fnFail ){
				fnFail();
			}
		});
	},

	/*
	 * Get file name from a complete file path
	 */
	getNameFromPath: function( path ){
		if( typeof path == undefined){
			return false;
		}
		var fileName = path.split("/").pop();
		fileName = fileName.split(".");
		fileName.pop();
		fileName = fileName.toString().replace(".","-");

		return fileName;
	},

	/*
	 * Get image type from a file path
	 */
	getImageType: function( path ){
		if(!path){
			return false;
		}

		if( path.indexOf(";base64,") >= 0 ){
			var tempPath = path.replace("data:","[#split]").replace(";base64,","[#split]");
			tempPath = tempPath.split("[#split]");
			return tempPath[1];
		}else{
			var sourceArr = path.split(".");
			return "image/" + sourceArr[sourceArr.length-1];
		}
	},

	getNaturalDimensions: function(src){
		var image = new Image();
		image.src = src;
		return {
			width: image.width,
			height: image.height
		}
	}
};