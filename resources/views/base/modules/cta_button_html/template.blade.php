
{{-- CTA Button HTML : Start --}}
<tr data-params='{{json_encode($module_params)}}'>
    <td bgcolor="#FFFFFF" align="center" height="100%" valign="top" width="100%">
		<table cellspacing="0" cellpadding="0" border="0" class="center-on-narrow" style="margin-top: 10px !important;">
			<tbody><tr>
				<td class="st-btn button-td" style="border-radius: 3px; background: #222222; text-align: center;">
					<a  href="{{ $module_params['data']['destination_url'] or '#' }}" class="button-a st-without-event st-cta-button"
						style="background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;">
						<span contenteditable="true" truncate="50" class="st-save-only-text st-content-editable-single-line" style="color: #FFFFFF">{{ $module_params['data']['text0'] or 'CTA Button HTML' }}</span>
					</a>
				</td>
			</tr>
		</tbody></table>
	</td>
</tr>
{{-- CTA Button : End --}}
