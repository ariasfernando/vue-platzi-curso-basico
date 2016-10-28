<?php //dd($logs) ?>
@foreach ($logs as $log)
	<tr data-log="{{ $log->id }}">
		<td title="{{ $log->id }}">{{ $log->id }}</td>
		<td title="{{ ( !empty($log->properties["user_id"]))? $log->properties["user_id"] : "" }}">
			@if ( !empty($log->properties["user_id"]) )
				<a href="{{ action('Admin\UserController@getIndex', array("type" => "_id", "q" => $log->properties["user_id"])) }}" target="_self">
					{{ ( !empty($log->properties["user_id"]))? $log->properties["user_id"] : "" }}
				</a>
			@endif
		</td>
		<td title="{{ ( !empty($log->properties["campaign_id"]))? $log->properties["campaign_id"] : "" }}">{{ ( !empty($log->properties["campaign_id"]))? $log->properties["campaign_id"] : "" }}</td>
		<td title="{{ $log->description  }}">{{ $log->description }}</td>
		<td title="{{ $log->ip }}">{{ $log->ip }}</td>
		<td title="{{ $log->user_agent  }}">{{ $log->user_agent }}</td>
		<td title="{{ $log->controller." / ".$log->action }}">{{ $log->controller." / ".$log->action }}</td>
		<td>{{ date("m/d/Y",strtotime($log->created_at)) }}<br>{{ date("h:i a T",strtotime($log->created_at)) }}</td>
	</tr>
@endforeach
