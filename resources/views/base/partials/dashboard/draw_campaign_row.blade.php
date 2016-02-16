@foreach ($campaigns as $campaign)
    <tr data-campaign="{{ $campaign->id }}">
        <td>{{ date("m/d/Y",strtotime($campaign->created_at)) }}<br>{{ date("h:i a T",strtotime($campaign->created_at)) }}</td>
        <td class="last-modified">
            {{-- ToDo: Display user thumbnail --}}
            {{-- <img class="user-thumbnail pull-right" title="Andres Lopez" src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg" alt="photo"> --}}
            <span>{{date("m/d/Y",strtotime($campaign->updated_at)) }}<br>{{date("h:i a T",strtotime($campaign->updated_at)) }}</span>
        </td>
        <td title="{{ $campaign->user_email }}">{{ $campaign->user_email }}</td>
        <td title="{{ $campaign->campaign_name }}">{{ $campaign->campaign_name }}</td>
        <td class="text-right actions icons">
            <a href="#" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
            <a href="{{ action('CampaignController@getEdit', array( 'id' => $campaign->id )) }}" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
            <a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-ban-circle"></i></a>
        </td>
    </tr>
@endforeach