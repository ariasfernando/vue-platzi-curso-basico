<?php
	// Default Text
	$campaign_header_text = "Campaign Editor";

	// Set library name
	$library_title = $params['campaign_data']->getLibraryConfig('title');
	if( isset($library_title) && !empty($library_title) ){
		$campaign_header_text = $library_title;
	}

	// Set language name
	if( $app_config['view']['campaign_format'] == "languages" 
			&& isset($app_config['locale']['langs'][$params['campaign_data']['locale']]['name'])){
		$campaign_header_text .= " (" 
			. $app_config['locale']['langs'][$params['campaign_data']['locale']]['name'] . ")";
	}
?>

<!-- header canvas email -->
<div class="section-box-header section-canvas-title">
	<div class="row">
		<div class="col-xs-4 col-md-4"><h2><?php echo $campaign_header_text; ?></h2></div>
        <div class="col-xs-2 col-md-2 col-lg-3">
            @if ( $params['campaign_data']->getLibraryConfig('building_mode_select') )
                <div class="switch">
                    <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
                    <label for="desktop" class="switch-label switch-label-off campaign-switch-view">
                        <i class="fa fa-desktop"></i>
                    </label>
                    <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
                    <label for="mobile" class="switch-label switch-label-on campaign-switch-view">
                        <i class="glyphicon glyphicon-phone"></i>
                    </label>
                    <span class="switch-selection"></span>
                </div>
            @endif
        </div>
		<div class="col-xs-6 col-md-6 col-lg-5 text-right">
			<button class="btn btn-default campaign-preview"><i class="glyphicon glyphicon-phone"></i>Preview</button>
			<button class="btn btn-default save-as-draft">Save as Draft</button>
			<a class="btn btn-continue campaign-continue" href="#">Continue<i class="glyphicon glyphicon-triangle-right"></i></a>
		</div>
	</div>
</div>

<!-- content canvas email -->
<div class="section-box-content section-canvas-container">
	<table cellpadding="0" cellspacing="0" width="100%">
		<tr>
			<td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
				<table id="emailCanvas" class="email-canvas wrapper-table" width="{{ $params['campaign_data']->getLibraryConfig('template_width') }}" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                        @include('base.modules.module_constructor')
                    </tbody>
				</table>
			</td>
		</tr>
	</table>
</div>

<div class="section-box-header-bottom section-canvas-title hidden">
	<div class="row">
		<div class="col-xs-12 text-right">
			<a class="btn btn-default save-as-draft" href="#">Save as Draft</a>
			<a class="btn btn-default campaign-continue" href="#">Continue</a>
		</div>
	</div>
</div>