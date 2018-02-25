Hi {{ $name }},<br /><br/>

We received a request to reset the password for your stensul account (<a href="{{ url('/') }}" target="_blank">{{ url('/') }}</a>). <br/><br/>

To reset your password, please go to:<br />
<a href="{{ url('password/reset/'.$token) }}" target="_blank">{{ url('password/reset/'.$token) }}</a><br/><br/>

This link expires in one hour. <br/><br/>

If you did not request a password reset, please email us immediately at <a href="mailto:{{ $app_config['app_mail_address'] }}">{{ $app_config['app_mail_address'] \}}</a> <br/><br/>

How do I know an email is from stensul? <br/>
The link in this email will start with "https://” and contain “stensul.com” <br/><br/>

stensul, Inc. | 150 West 25th Street, 3rd Floor, New York, NY 10001<br/>