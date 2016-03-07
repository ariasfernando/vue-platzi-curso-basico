@foreach ($campaigns as $campaign)
    <tr data-campaign="{{ $campaign->id }}" >

        <?php $published_date = (isset($campaign->published_at)) ? strtotime($campaign->published_at) : strtotime($campaign->updated_at); ?>

        <td>{{ date("m/d/Y", $published_date) }}<br>{{date("h:i a T", $published_date) }}</td>
        <td title="{{ $campaign->user_email }}">{{ $campaign->user_email }}</td>
        <td title="{{ $campaign->campaign_name }}">{{ $campaign->campaign_name }}</td>
        <td class="actions links" width="150">
            <a href="#" class="html-code">Normal HTML</a><br>
            @if (isset($app_config["campaign"]["process_plaintext"]) && $app_config["campaign"]["process_plaintext"])
                <a href="#" class="plaintext">Normal Plaintext</a>
            @endif
        </td>
        <td class="actions icons text-right" width="170">
            <a href="{{ action('CampaignController@getPublicPath', $campaign->id  ) }}" title="View hosted version" target="_blank"><i class="glyphicon glyphicon-eye-open"></i></a>
            <a href="#" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
            <a href="{{ action('CampaignController@getEdit', array( 'id' => $campaign->id )) }}" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
            @foreach ( Helper::getApiDrivers( $campaign->library ) as $api)
				<a href="#" title="Upload to {{ $app_config['api'][ $api ]['title'] }}" class="btn-upload-api" data-campaign-id="{{ $campaign->id }}" data-api-driver="{{ $api }}"><i class="glyphicon glyphicon-cloud-upload"></i></a>
            @endforeach
            <a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-ban-circle"></i></a>
        </td>
    </tr>
@endforeach