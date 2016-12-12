<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<?php echo "<he"; ?><?php echo "ad>"; ?>

        <meta charset="utf-8"> {{-- utf-8 works for most cases --}}
        <meta name="viewport" content="width=device-width"> {{-- Forcing initial-scale shouldn't be necessary --}}
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> {{-- Use the latest (edge) version of IE rendering engine -}}
        <title></title> {{-- The title tag shows in email notifications, like Android 4.4. --}}

		@include('base.layouts.partials.stensul_email_styles')

	<?php echo "</he"; ?><?php echo "ad>"; ?>

	<body class="email-body" width="100%" style="margin:0 auto">
		<center style="width: 100%; margin: 0 auto; background: {{ $params['campaign_data']->getLibraryConfig('template_bg_color') }}">

			<div style="max-width: {{ $params['campaign_data']->getLibraryConfig('template_width') }}px; margin: auto;">

                <!--[if (mso)|(IE)]>
                <table cellspacing="0" cellpadding="0" border="0" width="{{ $params['campaign_data']->getLibraryConfig('template_width') }}" align="center">
                    <tr>
                        <td>
                <![endif]-->

				<table  cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
						style="max-width: {{ $params['campaign_data']->getLibraryConfig('template_width') }}px" class="email-container" role="presentation">
					<?= $params['body_html']; ?>
				</table>

                <!--[if (mso)|(IE)]>
                        </td>
                    </tr>
                </table>
                <![endif]-->

			</div>

		</center>
	</body>

</html>
