@foreach ($roles as $role)
	<tr data-role="{{ $role->id }}">
		<td title="{{ $role->name }}">{{ $role->name }}</td>
		<td title="{{ $role->description }}">{{ $role->description }}</td>
		<td title="{{ join(", ", $role->permissions) }}">{{ (count($role->permissions) == 0)? "none" : join(",", $role->permissions) }}</td>
		<td class="text-right actions icons">
			<a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
			<a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-ban-circle"></i></a>
		</td>
	</tr>
@endforeach