@extends('emails.proof.layout')

@section('content')
    <tr>
        <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
            The campaign <strong>{{ $proof->campaign->campaign_name }}</strong> was deleted, your feedback is no longer required.
        </td>
    </tr>
@endsection
