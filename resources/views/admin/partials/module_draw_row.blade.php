@foreach ($modules as $module_id => $config)
	<tr data-module="{{ $module_id }}">
		<td title="{{ $module_id }}">{{ $config['title'] }}</td>
		<td title="{{ $module_id }}">{{ $module_id }}</td>
		<td class="text-right actions icons">
			<a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
		</td>
	</tr>
@endforeach