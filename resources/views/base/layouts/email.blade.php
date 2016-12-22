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

		@include('base.layouts.partials.email_styles')

	<?php echo "</he"; ?><?php echo "ad>"; ?>

	<body class="email-body">
		@if(Config::get('view.preheader') && (!Config::has('view.libraries.' . $params['campaign_data']['library'] . '.preheader') || Config::get('view.libraries.' . $params['campaign_data']['library'] . '.preheader')))
			<div style="font-size:0px; display:none; visibility:hidden; opacity:0; color:transparent; max-height:0px; height:0; width:0; mso-hide:all;">{{ $params['campaign_data']['campaign_preheader'] or '' }}</div>
		@endif
		<table cellpadding="0" cellspacing="0" width="100%">
			<tr>
				<td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
					<table cellpadding="0"
						   cellspacing="0"
						   border="0"
						   class="wrapper-table"
						   width="{{ $params['campaign_data']->getLibraryConfig('template_width') }}"
					   >
						<?= $params['body_html']; ?>
					</table>
				</td>
			</tr>
		</table>

	</body>

</html>
