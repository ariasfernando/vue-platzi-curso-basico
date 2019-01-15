@extends('emails.proof.layout')

@section('content')
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            @if (strlen($params['comment']) > 0)
                <strong>{{ $proof->campaign->campaign_name }}</strong> has been approved by {{ $params['reviewer_data']->fullname }}, with the following comment: {{ $params['comment'] }}.
            @else
                <strong>{{ $proof->campaign->campaign_name }}</strong> has been approved by {{ $params['reviewer_data']->fullname }}.
            @endif
        </td>
    </tr>
    <tr>
        <td align="left" valign="top" height="22" style="height: 22px;"><!-- &nbsp; !--></td>
    </tr>
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            Click here to access the proof in your browser (Login required):<br>{{ $params['proof_url'] }}.
        </td>
    </tr>
@endsection
