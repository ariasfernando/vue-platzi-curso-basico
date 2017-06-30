@foreach ($permissions as $permission)
	<tr data-permission="{{ $permission->id }}">
		<td title="{{ $permission->name }}">{{ $permission->name }}</td>
		<td title="{{ $permission->description }}">{{ $permission->description }}</td>
		<td title="{{ join(", ",$permission->inRoles()) }}">{{ join(",",$permission->inRoles()) }}</td>
		<td>{{ date("m/d/Y",strtotime($permission->created_at)) }}<br>{{ date("h:i a T",strtotime($permission->created_at)) }}</td>
		<td class="text-right actions icons">
			<a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
			<a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-trash"></i></a>
		</td>
	</tr>
@endforeach