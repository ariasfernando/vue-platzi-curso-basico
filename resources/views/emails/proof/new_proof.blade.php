@extends('emails.proof.layout')

@section('content')
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Hi,
        </td>
    </tr>
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Please, click here to review in your browser: {{ $params['proof_url'] }}. Login required.
        </td>
    </tr>
    @if (strlen($params['notification_message']))
        <tr>
            <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
                <p>Message from {{ $params['requestor'] }}:</p>
                <p>{{ $params['notification_message'] }}</p>
            </td>
        </tr>
    @endif
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Thanks,<br>
            the stensul team
        </td>
    </tr>
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            <br>
            <p>To ensure that you continue receiving our emails, please add <a href="mailto:{{ $from_email }}">{{ $from_email }}</a> to your address book or safe list.</p>
            <p>If you received this email in error, please contact stensul at <a href="mailto:{{ $app_config["app_mail_address"] }}">{{ $app_config["app_mail_address"] }}</a> immediately.</p>
        </td>
    </tr>
    <tr>
        <td height="24" align="left" valign="top"></td>
    </tr>
@endsection
