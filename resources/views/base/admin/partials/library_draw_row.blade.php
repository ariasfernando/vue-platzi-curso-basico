@foreach ($libraries as $library)
	<tr data-library="{{ $library->id }}">
		<td title="{{ $library->name }}">{{ $library->name }}</td>
		<td title="{{ $library->description }}">{{ $library->description }}</td>
		<td title="Modules">
		<?php
			foreach ($library->modules as $key => $module) {
				if (is_array($module)) {
					?>
					{{join(", ", $module)}}
					<?php
				} else {
					?>
					{{$module}}
					<?php
				}
			}
			?>
		</td>
		<td>{{ date("m/d/Y",strtotime($library->created_at)) }}<br>{{ date("h:i a T",strtotime($library->created_at)) }}</td>
		<td class="text-right actions icons">
			<a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>
			<a href="#" class="delete" title="Delete"><i class="glyphicon glyphicon-ban-circle"></i></a>
		</td>
	</tr>
@endforeach