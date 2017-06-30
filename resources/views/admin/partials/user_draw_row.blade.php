@foreach ($users as $user)
	<tr data-user="{{ $user->id }}">
		<td title="{{ $user->id }}">{{ $user->id }}</td>
		<td title="{{ $user->name }} {{ $user->lastName }}">{{ $user->name }} {{ $user->lastName }}</td>
		<td title="{{ $user->email }}">{{ $user->email }}</td>
		<td title="{{ join(", ",$user->roles) }}">{{ join(",",$user->roles) }}</td>
		<td>{{ date("m/d/Y",strtotime($user->created_at)) }}<br>{{ date("h:i a T",strtotime($user->created_at)) }}</td>
		<td class="text-right actions icons">
			<a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
			<a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-trash"></i></a>
		</td>
	</tr>
@endforeach