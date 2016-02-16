<?php
	$label = ( isset($label) && !empty($label) )? $label : "Color picker";
	$field_name = ( isset($field_name) && !empty($field_name) )? $field_name : "color-picker";
	$data_color = ( isset($data_color) && !empty($data_color) )? $data_color : "#FFF555";
	$field_validation = ( isset($validation) && !empty($validation) )? json_encode($validation):"";
?>

<div class="modal-mpf-row">
	{!! Form::label( $field_name, $label) !!}
	<div class="input-group section-font-color-picker">
		{!! Form::text( $field_name, "$data_color", array (
			"id" => $field_name,
			"class" => "stensul-color-picker form-control",
			"data-color" => "$data_color"
		)) !!}
		<span class="input-group-addon"><i></i></span>
	</div> 
</div>