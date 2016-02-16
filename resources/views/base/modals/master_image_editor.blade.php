<div class="modal-mpf-content-data" id="master-image-editor">
	<h1>{{ $params["title"] }}</h1>
	{!! Form::open ( array ( 'method' => 'post', 'files' => true ,'id' => 'master-image-editor-form'  )) !!}
		{{-- Input Hidden --}}
		{!! Form::hidden(
			'campaign_id',
			isset($params["campaign_id"])? $params["campaign_id"]:'',
			array ( 'id' => 'campaign-id' ))
		!!}

		{{-- File Upload Files --}}
		@include('base.modals.partials.image_editor_upload_fields')

		{{-- Destination URL --}}
		@include('base.modals.partials.image_editor_default_fields')
		
		@if ( $params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled" )
			{{-- Multiple tabs --}}
			@include('base.modals.partials.image_editor_multiple_crop_tab')
			
		@endif
	
		<!-- Tab panes start  -->
		<div class="tab-content">

			{{-- Crop Default --}}
			@include('base.modals.partials.image_editor_default')
	
			@if ( $params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled" )
				{{-- crop mobile --}}
				@include('base.modals.partials.image_editor_crop_mobile')			
			@endif

		</div>

		{{-- Input submit --}}
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right', 'id'=>'master-image-editor-upload' )) !!}
		</div>

	{!! Form::close() !!}
</div>