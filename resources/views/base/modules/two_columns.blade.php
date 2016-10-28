<?php
    $module_params = $app_config["modules"]["two_columns"];

    // Module Params
    if( !isset($module_params['data']) ){
        $module_params['data'] = (isset($module['data']))? $module['data']:'';
    }

    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image0 = $module_params['data']['image0'];
    }

    if( isset($module_params['data']['image1']) && !empty($module_params['data']['image1']) ){
        $image1 = $module_params['data']['image1'];
    }

    // Set image Button
    $imageData0 = [
        'source' => isset($module_params['placeholder_image_button'])? url('/') . str_replace('{locale}', $params["campaign_data"]["locale"], $module_params['placeholder_image_button']): '',
        'alt' => 'image-button-1'
    ];

    if( isset($module_params['data']['button0']['path']) && !empty($module_params['data']['button0']['path']) ){
        $imageData0['source'] = url('/') . "/images/campaigns". $module_params['data']['button0']['path'];
    }

    if( isset($module_params['data']['button0']['label']) && !empty($module_params['data']['button0']['label']) ){
        $imageData0['alt'] = $module_params['data']['button0']['label'];
    }

    $imageData0['attr'] = [
        'title' => $imageData0['alt'],
        'border' => '0',
        'height' => '40',
        'data-image' => '',
        'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
    ];

    $imageData1 = [
        'source' => isset($module_params['placeholder_image_button'])? url('/') . str_replace('{locale}', $params["campaign_data"]["locale"], $module_params['placeholder_image_button']): '',
        'alt' => 'image-button-2'
    ];

    if( isset($module_params['data']['button1']['path']) && !empty($module_params['data']['button1']['path']) ){
        $imageData1['source'] = url('/') . "/images/campaigns". $module_params['data']['button1']['path'];
    }

    if( isset($module_params['data']['button1']['label']) && !empty($module_params['data']['button1']['label']) ){
        $imageData1['alt'] = $module_params['data']['button1']['label'];
    }

    $imageData1['attr'] = [
        'title' => $imageData1['alt'],
        'border' => '0',
        'height' => '40',
        'data-image' => '',
        'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
    ];

?>
<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td align="left" valign="top">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <th width="302" align="center" valign="top" class="element-block-center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td align="left" valign="top">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <a
                                                            href="#"
                                                            target="_blank"
                                                            data-master-image-editor="two_columns"
                                                          >
                                                            @if ( isset($image0['path']) && !empty($image0['path']) )
                                                                {!! Html::image( url('/') . "/images/campaigns". $image0['path'],
                                                                    ( isset($image0['alt']) )? $image0['alt']:'',
                                                                    array(
                                                                        'title' => ( isset($image0['alt']) )? $image0['alt']:'',
                                                                        'border' => '0',
                                                                        'class' => 'image-mobile',
                                                                        'style' => 'display:block;border:none;max-width:242px;width:100%;'
                                                                    ))
                                                                !!}
                                                            @else
                                                                {!! Html::image( url('/') . $module_params['placeholder_image'],
                                                                    'content-module-2',
                                                                    array(
                                                                        'title' => 'content-module-2',
                                                                        'border' => '0',
                                                                        'class' => 'image-mobile',
                                                                        'width' => 242,
                                                                        'height' => 90,
                                                                        'style' => 'display:block;border:none;max-width:242px;'
                                                                    ))
                                                                !!}
                                                            @endif
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="10" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:10px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td valign="middle"
                                                        align="left"
                                                        >
                                                            <span style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size: 12px;color:#000000;font-weight:bold;line-height:18px;" >Title: </span>
                                                            <span class="st-save-only-text"
                                                                  contenteditable="true"
                                                                  style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size: 12px;color:#000000;font-weight:normal;line-height:18px;"
                                                                  >
                                                                    @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                                        {!! $module_params['data']['text0'] !!}
                                                                    @else
                                                                        Lorem ipsum dolor sit amet.
                                                                    @endif
                                                            </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="20" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:20px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top">
                                                        <div class="text-overlay">
                                                            <div class="prevent-overflow">
                                                                <div id="text-editable" class="st-edit-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:12px; color:#000000; line-height:18px; text-align:justify; font-weight:normal;margin:0px;padding:0px;">
                                                                    @if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
                                                                        {!! $module_params['data']['text1'] !!}
                                                                    @else
                                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim consequat congue. Duis suscipit, lorem eget ornare vulputate, sem purus hendrerit eros, eu scelerisque arcu libero auctor nulla.
                                                                    @endif
                                                                </div>
                                                            </div>
                                                            <div class="text-overlay-toolbox st-change-position-tooltip"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                 <tr>
                                                    <td height="20" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:20x;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top">
                                                        <table height="40" cellpadding="0" cellspacing="0" border="0" align="center">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        valign="middle"
                                                                        height="40"><a
                                                                            href="{{ isset($module_params['data']['button0']['link'])? $module_params['data']['button0']['link']:'#' }}"
                                                                            target="_blank"
                                                                            class="st-without-event st-cta-button st-validate-href"
                                                                            data-master-button-editor="default_button"
                                                                        >{!! Html::image( $imageData0['source'], $imageData0['alt'], $imageData0['attr'] ) !!}</a></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                    <th width="20" align="center" valign="top" class="hidden-device" bgcolor="#ffffff" style="background-color: #ffffff;"><!--[if gte mso 15]>&nbsp;<![endif]--></th>
                    <th width="1" align="center" valign="top" class="hidden-device" bgcolor="#cccccc" style="background-color: #cccccc;"><!--[if gte mso 15]>&nbsp;<![endif]--></th>
                    <th width="20" align="center" valign="top" class="hidden-device" bgcolor="#ffffff" style="background-color: #ffffff;"><!--[if gte mso 15]>&nbsp;<![endif]--></th>
                    <th width="302" align="left" valign="top" class="element-block-center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td align="left" valign="top">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <a
                                                            href="#"
                                                            target="_blank"
                                                            data-master-image-editor="two_columns"
                                                        >
                                                            @if ( isset($image1['path']) && !empty($image1['path']) )
                                                                {!! Html::image( url('/') . "/images/campaigns". $image1['path'],
                                                                    ( isset($image1['alt']) )? $image1['alt']:'',
                                                                    array(
                                                                        'title' => ( isset($image1['alt']) )? $image1['alt']:'',
                                                                        'border' => '0',
                                                                        'class' => 'image-mobile',
                                                                        'style' => 'display:block;border:none;max-width:242px;width:100%;'
                                                                    ))
                                                                !!}
                                                            @else
                                                                {!! Html::image( url('/') . $module_params['placeholder_image'],
                                                                    'content-module-2',
                                                                    array(
                                                                        'title' => 'content-module-2',
                                                                        'border' => '0',
                                                                        'class' => 'image-mobile',
                                                                        'width' => 242,
                                                                        'height' => 90,
                                                                        'style' => 'display:block;border:none;max-width:242px;'
                                                                    ))
                                                                !!}
                                                            @endif
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="10" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:10px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td valign="middle"
                                                        align="left"
                                                        >
                                                            <span style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size: 12px;color:#000000;font-weight:bold;line-height:18px;" >Title: </span>
                                                            <span class="st-save-only-text"
                                                                  contenteditable="true"
                                                                  style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size: 12px;color:#000000;font-weight:normal;line-height:18px;"
                                                                  >
                                                                    @if ( isset($module_params['data']['text2']) && !empty($module_params['data']['text2']) )
                                                                        {!! $module_params['data']['text2'] !!}
                                                                    @else
                                                                        Lorem ipsum dolor sit amet.
                                                                    @endif
                                                            </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="20" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:20px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top">
                                                        <div class="text-overlay">
                                                            <div class="prevent-overflow">
                                                                <div id="text-editable" class="st-edit-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:12px; color:#000000; line-height:18px; text-align:justify; font-weight:normal;margin:0px;padding:0px;">
                                                                    @if ( isset($module_params['data']['text3']) && !empty($module_params['data']['text3']) )
                                                                        {!! $module_params['data']['text3'] !!}
                                                                    @else
                                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim consequat congue. Duis suscipit, lorem eget ornare vulputate, sem purus hendrerit eros, eu scelerisque arcu libero auctor nulla.
                                                                    @endif
                                                                </div>
                                                            </div>
                                                            <div class="text-overlay-toolbox st-change-position-tooltip"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                 <tr>
                                                    <td height="20" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:20x;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top">
                                                        <table height="40" cellpadding="0" cellspacing="0" border="0" align="center">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        valign="middle"
                                                                        height="40"><a
                                                                            href="{{ isset($module_params['data']['button0']['link'])? $module_params['data']['button0']['link']:'#' }}"
                                                                            target="_blank"
                                                                            class="st-without-event st-cta-button st-validate-href"
                                                                            data-master-button-editor="default_button"
                                                                        >{!! Html::image( $imageData1['source'], $imageData1['alt'], $imageData1['attr'] ) !!}</a></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
            </tbody>
        </table>
    </td>
</tr>
