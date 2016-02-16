<?php
	$module_params = $app_config["modules"]["thin_gray_line_separator"];
?>
<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td align="center" height="1" style="vertical-align:middle;margin:0;padding:0">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%!important;height:1px;line-height:1px;font-size:1px">
            <tr>
                <th style="vertical-align:top; margin:0;padding:0"
                    width="100%"
                    height="1"
                    valign="top"
                    align="center"
                    bgcolor="#ffffff">{!! Html::image( '_common/images/en_us/line-separator.png',
                    'line-separation',
                    array(
                    'title' => 'line-separation',
                    'width' =>'100%',
                    'height'=> '1',
                    'border' => '0',
                    'style' => 'display:block;line-height: 1px!important;max-width:100%;'
                    )
                    )
                    !!}</th>
            </tr>
        </table>
    </td>
</tr>