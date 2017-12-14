<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<?php echo "<he"; ?><?php echo "ad>"; ?>
	<!--[if IEMobile]>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<![endif]-->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="HandheldFriendly" content="true"/>
		<meta name="MobileOptimized" content="320"/>
		<meta name="viewport" content="width=device-width" />
		<title></title>
		
		@if(isset($params['library_config']['externalCssLink']))
			<link href="{{ $params['library_config']['externalCssLink'] }}" rel="stylesheet">
		@endif

		@include('layouts.partials.email_styles')

	<?php echo "</he"; ?><?php echo "ad>"; ?>

	<body class="st-email-body">
		{{-- PREVIEW PREHEADER --}}
		@if(isset($params['preheader_preview']) && strlen($params['preheader_preview']))
			<div style="font-size:0px; display:none; visibility:hidden; opacity:0; color:transparent; max-height:0px; height:0; width:0; mso-hide:all;">{{ $params['preheader_preview'] }}</div>
		@endif
		{{-- CAMPAIGN PREHEADER --}}
		@if(Config::get('view.preheader') && (!Config::has('view.libraries.' . $params['campaign_data']['library'] . '.preheader') || Config::get('view.libraries.' . $params['campaign_data']['library'] . '.preheader')))
			<div style="font-size:0px; display:none; visibility:hidden; opacity:0; color:transparent; max-height:0px; height:0; width:0; mso-hide:all;">{{ $params['campaign_data']['campaign_preheader'] or '' }}</div>
		@endif
					
		<?= $params['body_html']; ?>
				

	</body>

</html>
