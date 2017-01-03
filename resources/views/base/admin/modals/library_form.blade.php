<div class="modal-mpf-content-data simple-text-config admin-library-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-library-form' )) !!}

		{!! Form::hidden('libraryId', (isset($params['library']['_id']))? $params['library']['_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			{!! Form::label('name', 'Name') !!}
			{!! Form::text('name', isset($params['library']['name']) ? $params['library']['name'] : '', array (
				'class' => 'library_name',
				'id' => 'library_name',
				'placeholder' => 'Enter name here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<!-- Input Description -->
		<div class="modal-mpf-row">
			{!! Form::label('description', 'Description') !!}
			{!! Form::text('description', isset($params['library']['description'])? $params['library']['description'] : '', array (
				'class' => 'library_description',
				'id' => 'library_description',
				'placeholder' => 'Enter description here.'
			)) !!}
		</div>

		<!-- Select modules -->
		<div class="modal-mpf-row selector">
			<div id="modules-container">
				<?php
				if (!empty($params['library']['modules'])) {
					foreach ($params['library']['modules'] as $group => $modules) {

						?>
						<div id="modules-{{$group}}">
						<?php

						if ($group === 'default') {
							?>
							{!! Form::label('modules-' . $group, 'Ungrouped Modules') !!}
							<?php
						} else {
							?>
							{!! Form::label('modules-' . $group, 'Module Group: ' . $group) !!}
							<?php
						}
						?>
						<div id="group-container-$group">
							{!! Form::select('modules-' . $group, $params['modules'], $modules, array (
								'class' => 'form-control selectpicker',
								'id' => 'modules-' . $group,
								'name' => 'modules-' . $group . '[]',
								'multiple' => 'true',
								'title' => 'Choose one or more modules ...',
								'data-validation' => '{"required":"true"}'
							)); !!}
							<?php
							if ($group === 'default') {
								?>
								<br /><br />
								<?php
							} else {
								?>
								<span class="glyphicon glyphicon-remove group-remove" data-module-container="modules-{{$group}}"></span><hr />
								<?php
							}
							?>
						</div>
					</div>
					<?php
					}
				} else {
					?>
						{!! Form::label('modules-default', 'Ungrouped Modules') !!}
						{!! Form::select('modules-default', $params['modules'], [], array (
							'class' => 'form-control selectpicker',
							'id' => 'modules-default',
							'name' => 'modules-default[]',
							'multiple' => 'true',
							'title' => 'Choose one or more modules ...',
							'data-validation' => '{"required":"true"}'
						)); !!}<br /><hr />
						<?php
				}
				?>
			</div>
			{!! Form::button('Add Group', array ( 'class' => 'btn btn-success pull-right btn-add-group')) !!}			
		</div>
		<!-- Input config -->
		<div class="modal-mpf-row">
			{!! Form::label('config', 'Config') !!}
			{!! Form::textarea('config', isset($params['library']['config'])
				? json_encode($params['library']['config'], JSON_PRETTY_PRINT) : '', array (
				'class' => 'library_config',
				'id' => 'library_config',
				'placeholder' => 'Enter config here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>