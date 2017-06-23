Click here to reset your password: <a href="{{ url('password/reset/'.$token) }}" target="_blank">{{ url('password/reset/'.$token) }}</a><br/><br/>

If you did not request a password reset, please email us immediately at <a href="mailto:{{$app_config['app_mail_address']}}">{{$app_config['app_mail_address']}}</a> <br/>
This link expires in one hour.