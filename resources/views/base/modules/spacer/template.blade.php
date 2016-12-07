<?php

    $background_color = ( isset($module_params['background_colors']['default']) ) ? $module_params['background_colors']['default'] : '#fff';
    $background_color = ( isset($module_params['data']['background_color']) ) ? $module_params['data']['background_color'] : $background_color;
    $module_params['data']['background_color'] = ( isset($module_params['data']['background_color']) ) ? $module_params['data']['background_color'] : $background_color;

    $size = ( isset($module_params['sizes']['default']) ) ? $module_params['sizes']['default'] : '18';
    $size = ( isset($module_params['data']['size']) ) ? $module_params['data']['size'] : $size;
    $module_params['data']['size'] = ( isset($module_params['data']['size']) ) ? $module_params['data']['size'] : $size;

?>
{{-- Spacer: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
	<td align="center" bgcolor="{{ $background_color }}" style="vertical-align:middle;background-color: {{ $background_color }};" class="st-add-icon-config">
		<table style="width:100%!important;" width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td width="100%" height="{{ $size }}" class="st-custom-spacer" style="vertical-align:middle;"></td>
			</tr>
		</table>
	</td>
</tr>
{{-- Spacer: End --}}
