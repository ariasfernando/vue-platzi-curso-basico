Hi {{ $name }},<br /><br/> 

We just created your new stensul account (<a href="{{ url('/') }}" target="_blank">{{ url('/') }}</a>). <br/><br/>

Please click the following link to login for the first time, you will be asked to create a new password:<br />
<a href="{{ url('password/reset/'.$token) }}" target="_blank">{{ url('password/reset/'.$token) }}</a><br/><br/>

This link expires in one hour. If the link is expired you can ask for a password recovery
<a href="{{ url('/password/email') }}" target="_blank">here</a><br/><br/>

If you did not request an account, please email us immediately at <a href="mailto:{{ $app_config['app_mail_address'] }}">{{ $app_config['app_mail_address'] }}</a> <br/><br/>

How do I know an email is from stensul? <br/>
The link in this email will start with "https://” and contain "stensul.com"<br/><br/>

stensul, Inc. | 150 West 25th Street, 3rd Floor, New York, NY 10001<br/>