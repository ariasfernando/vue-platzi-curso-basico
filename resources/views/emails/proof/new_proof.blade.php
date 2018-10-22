@extends('emails.proof.layout')

@section('content')
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Please, click here to review in your browser (Login required): <br>{{ $params['proof_url'] }}.
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
    @endif
    <tr>
        <td height="24" align="left" valign="top"></td>
    </tr>
@endsection
