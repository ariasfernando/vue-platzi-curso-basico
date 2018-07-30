<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
	<?php echo "<he"; ?><?php echo "ad>"; ?>
	
		<!--if gte mso 9><xml>
			<o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
			</xml>
		<!endif-->
		
		<!--[if IEMobile]>
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<![endif]-->
		
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="HandheldFriendly" content="true"/>
		<meta name="MobileOptimized" content="320"/>
		<meta name="viewport" content="width=device-width" />
		@if (config('global_settings.enable_title') && isset($params['campaign_data']['email_title']))
		<title>{{ $params['campaign_data']['email_title'] }}</title>
        @else
        <title></title>
        @endif

		@if(isset($params['library_config']['externalCssLink']) && !empty($params['library_config']['externalCssLink']))
			<link href="{{ $params['library_config']['externalCssLink'] }}" rel="stylesheet">
		@endif

		@include('layouts.partials.email_styles')

	<?php echo "</he"; ?><?php echo "ad>"; ?>

	<body class="st-email-body">
		@if (isset($params['campaign_data']['campaign_fonts']))
			@if (isset($params['campaign_data']['campaign_fonts']['custom']))
				@if (count($params['campaign_data']['campaign_fonts']['custom']) > 0)
					<!--[if gte mso 9]>
					<style type="text/css">
					body, table, td {font-family: Arial, Sans Serif !important;}
					</style>
					<![endif]-->
				@endif
			@endif
        @endif
        @if (config('global_settings.enable_preheader') && isset($params['library_config']['preheader']) && $params['library_config']['preheader'])
            @if(isset($params['preheader_preview']))
                    {{-- PREVIEW PREHEADER --}}
                    <div style="font-size:0px; display:none; visibility:hidden; opacity:0; color:transparent; max-height:0px; height:0; width:0; mso-hide:all;">{{$params['preheader_preview'] or ''}}
                        @if ((190 - mb_strlen($params['preheader_preview']) > 0))
                            {!! str_repeat('&zwnj;&nbsp;', 190 - mb_strlen($params['preheader_preview'])) !!}
                        @endif
                    </div>
            @elseif(isset($params['campaign_data']['campaign_preheader']))
                {{-- CAMPAIGN PREHEADER --}}
                <div style="font-size:0px; display:none; visibility:hidden; opacity:0; color:transparent; max-height:0px; height:0; width:0; mso-hide:all;">{{ $params['campaign_data']['campaign_preheader'] or '' }}
                    @if ((190 - mb_strlen($params['campaign_data']['campaign_preheader']) > 0))
                        {{ str_repeat('&zwnj;&nbsp;', 190 - mb_strlen($params['campaign_data']['campaign_preheader'])) }}
                    @endif
                </div>
            @endif
        @else
            {{-- PREHEADER NOT ENABLED, USE DE FACTO FROM MODULES --}}
        @endif
<?= $params['body_html']; ?>
	</body>
</html>
