<?php
    $image_path = url($module_params['placeholder_image']);
    if ( isset($image['path']) && !empty($image['path']) ) {
        $image_path = url("/images/campaigns". $image['path']);
    }
?>

<table cellspacing="0" cellpadding="0" border="0" width="100%" class="st-data-modal-parent" style="font-size: 14px;text-align: left; max-width: 310px"><tbody>

    {{-- Image : Start --}}
    <tr>
        <td>
            <a href="{{ $image['destination_url'] or '#' }}" data-open-element-config="single" data-key="{{ $image_key }}">

                {!! Html::image( $image_path, isset($image['alt']) ? $image['alt'] : '', array(
                    'title' => ( isset($image['alt']) ) ? $image['alt']:'',
                    'width' => 310,
                    'height' => 240,
                    'class' => 'center-on-narrow',
                    'style' => 'border: 0; width: 100%; max-width: 310px'
                )) !!}

            </a>
        </td>
    </tr>
    {{-- Image : End --}}

    {{-- Text : Start --}}
    <tr>
        <td contenteditable="true" class="st-save-only-text" style="font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555; padding-top: 10px;" class="stack-column-center">
            {{ $text }}
        </td>
    </tr>
    {{-- Text : End --}}

    {{-- CTA Button : Start --}}
    <tr>
        <td align="center" style="padding-top: 10px">
            <table cellspacing="0" cellpadding="0" border="0" class="center-on-narrow" style="margin-top: 10px !important;">
                <tbody><tr>
                    <td class="st-btn button-td" style="border-radius: 3px; background: #222222; text-align: center;">
                        <a  href="{{ $buttonData['destination_url'] or '#' }}" class="button-a st-without-event st-cta-button"
                            style="background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;">
                            <span contenteditable="true" truncate="50" class="st-save-only-text st-content-editable-single-line" style="color: #FFFFFF">{{ $buttonData['text'] }}</span>
                        </a>
                    </td>
                </tr>
            </tbody></table>
        </td>
    </tr>
    {{-- CTA Button : End --}}

</tbody></table>