<div class="modal-mpf-content-data custom-table-editor" id="custom-table-editor">
	<h1>Custom Table Config</h1>
	{!! Form::open ( array ( 'method' => 'post', 'files' => true ,'id' => 'master-image-editor-form'  )) !!}

		<!-- Input pretext -->
		<div class="clearfix">
			<div class="control-form-fields">
				{!! Form::label('rows', 'Rows') !!}
				{!! Form::text('rows','', array (
					'class' => 'table-command',
					'placeholder' => '',
					'data-validation' => '{"required":"true"}'))
				!!}
			</div>
			<div class="control-form-fields">
				{!! Form::label('cols', 'Columns') !!}
				{!! Form::text('cols','',array (
					'class' => 'table-command',
					'placeholder' => '',
					'data-validation' => '{"required":"true"}'))
				!!}
			</div>
			<div class="control-form-fields">
				{!! Html::image( url('/') . "/images/ajax-loader.gif", 'spinner', array('class'=>'spinner', 'title' => 'spinner', 'alt' => 'spinner')) !!}
			</div>
		</div>

		<div class="table-container">
			<div class="custom-table"></div>
		</div>

		<div>
			<table width="100%" cellpadding="0" cellspacing="0" border="1" style="border: 1px solid #808080;" class="custom-table-editor"></table>
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>
	{!! Form::close() !!}
</div>
