{{-- File upload tabs --}}
<?php
	$uploadFileLabel = 'Maximum allowed size: 2mb. Allowed file types: png, jpg and gif.';

	if(isset($params["labels"]) && isset($params["labels"]["file_upload"])){
		$uploadFileLabel = $params["labels"]["file_upload"];
	}
?>

@if ( (isset($params["image_upload"]) && $params["image_upload"] == "enabled") || (isset($params["og_image"]) && $params["og_image"] == "enabled") )
	<div>
		<ul class="nav nav-tabs" role="tablist">
			@if ( isset($params["image_upload"]) && $params["image_upload"] == "enabled" )
				<li role="presentation" class="active"><a href="#file-upload-box" class="btn-upload" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-cloud-upload"></i>File Upload</a></li>
			@endif

			@if ( isset($params["og_image"]) && $params["og_image"] == "enabled" )
				<li role="presentation"><a href="#fetch-og-box" class="btn-fetch-og" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-cloud-download"></i>URL To Fetch The Image From</a></li>
			@endif

			@if ( isset($params["image_library"]) && $params["image_library"] == "enabled" )
				<li role="presentation"><a href="#" class="btn-image-library"><i class="glyphicon glyphicon-picture"></i>Library</a></li>
			@endif
		</ul>
	</div>
@elseif ( $params["image_library"] == "enabled" )
	<div class="modal-mpf-row">
		<a href="#" class="btn btn-default btn-image-libary"><i class="glyphicon glyphicon-picture"></i>Select image</a>
	</div>
@endif


{{-- Section Images Options --}}
@if ( (isset($params["image_upload"]) && $params["image_upload"] == "enabled") || (isset($params["og_image"]) && $params["og_image"] == "enabled") )
	<div class="tab-content">
		{{-- File Upload --}}
		@if ( isset($params["image_upload"]) && $params["image_upload"] == "enabled" )
			<div class="tab-pane active modal-mpf-row file-tab-section section-upload-file" role="tabpanel" id="file-upload-box">
				{!! Form::label('file-image-upload', $uploadFileLabel ) !!}
				{!! Form::file(
					'file-image-upload',
					array (
						'id' => 'file-image-upload',
						'class' => 'cropit-image-input',
						'accept' => 'image/*',
						'data-validation' => '{"required":"false"}'
					))
				!!}
			</div>
		@endif

		{{-- OG Image --}}
		@if ( isset($params["og_image"]) && $params["og_image"] == "enabled" )
			<div class="tab-pane modal-mpf-row file-tab-section section-url-og" role="tabpanel" id="fetch-og-box">
				<div class="input-group">
					{!! Form::text('single-image-url-og', '',array ( 'id' => 'single-image-url-og', 'class'=>'url-format exclude-from-data', 'placeholder' => 'https://www.example.com', 'data-validation' => '{"url":"true"}' )) !!}
					<button id="fetch-url-btn" class="btn btn-default btn-url-og"><i class="glyphicon glyphicon-cloud-download"></i>Fetch</button>
				</div>
			</div>
		@endif
	</div>
@endif