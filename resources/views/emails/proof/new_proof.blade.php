@extends('emails.proof.layout')

@section('content')
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Hi {{ $reviewer_name }},
        </td>
    </tr>
    <tr>
        <td align="left" valign="top" height="22" style="height: 22px;"><!-- &nbsp; !--></td>
    </tr>
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Please, click here to review in your browser (Login required): <br><a href="{{ $params['proof_url'] }}">{{ $params['proof_url'] }}</a>.
        </td>
    </tr>
    @if (strlen($params['notification_message']) || strlen($params['notification_message_to_all']))
        <tr>
            <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
              @if (strlen($params['notification_message_to_all']))
                <p style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">Message from {{ $params['requestor'] }} to all reviewers: </p>
                <p style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">{{ $params['notification_message_to_all'] }}</p>
              @endif
              @if (strlen($params['notification_message']) && !isset($params['reviewer']['notified']))
                <p style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">Message directly to you:</p>
                <p style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">{{ $params['notification_message'] }}</p>
              @endif
            </td>
        </tr>
    @else
        <tr>
            <td align="left" valign="top" height="22" style="height: 22px;"><!-- &nbsp; !--></td>
        </tr>
    @endif
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Thanks,<br>
            The stensul team
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
