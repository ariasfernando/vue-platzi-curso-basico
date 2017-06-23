@foreach ($logs as $log)
	<tr data-log="{{ $log->id }}">
		<td title="{{ $log->id }}">{{ $log->id }}</td>
		@if (isset($log->properties["user_id"]))
			<td title="{{ $log->properties["user_id"] }}">
				@if ( isset($log->properties["user_id"]) )
					<a href="{{ url('admin/user')  . '?' . http_build_query([ 'type' => '_id', "q" => $log->properties["user_id"] ]) }}" target="_self">
						{{ ( isset($log->properties["user_id"]))? $log->properties["user_id"] : "" }}
					</a>
				@endif
			</td>
		@else
			<td title="not-found">not-found</td>
		@endif
		<td title="{{ ( isset($log->properties["campaign_id"]))? $log->properties["campaign_id"] : "" }}">{{ ( isset($log->properties["campaign_id"]))? $log->properties["campaign_id"] : "" }}</td>
		<td title="{{ $log->description  }}">{{ $log->description }}</td>
		<td title="{{ $log->ip }}">{{ $log->ip }}</td>
		<td title="{{ $log->user_agent  }}">{{ $log->user_agent }}</td>
		<td title="{{ $log->controller." / ".$log->action }}">{{ $log->controller." / ".$log->action }}</td>
		<td>{{ date("m/d/Y",strtotime($log->created_at)) }}<br>{{ date("h:i a T",strtotime($log->created_at)) }}</td>
	</tr>
@endforeach
