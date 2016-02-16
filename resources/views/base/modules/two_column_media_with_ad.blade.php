<?php
    $module_params = $app_config["modules"]["two_column_media_with_ad"];

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
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td valign="top">
        <table align="center"
               cellpadding="0"
               cellspacing="0"
               border="0"
               width="100%"
        >
            <tr>
                <td align="center" valign="top">
                <!--[if gte mso 9]>
                    </td>
                    <td valign="top" align="left">
                <![endif]-->
                    <table align="left"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           width="320"
                           class="wrapper-table"
                    >
                        <tr>
                            <td align="center" valign="top">
                                <table align="center"
                                       border="0"
                                       cellpadding="0"
                                       cellspacing="0"
                                       width="320"
                                       class="st-data-modal-parent st-box"
                                >
                                    <tr>
                                        <td align="left" valign="top">
                                            <a href="{{ isset($image0['destination_url'])? $image0['destination_url'] : '#' }}" data-master-image-editor="standard">
                                                @if ( isset($image0['path']) && !empty($image0['path']) )
                                                    {!! Html::image( url() . "/images/campaigns". $image0['path'],
                                                        ( isset($image0['alt']) )? $image0['alt']:'',
                                                        array(
                                                            'title' => ( isset($image0['alt']) )? $image0['alt']:'',
                                                            'width' => 320,
                                                            'height' => 240,
                                                            'border' => '0',
                                                            'style' => 'display:block;border:none;'
                                                        ))
                                                    !!}
                                                @else
                                                    {!! Html::image( url() . $module_params['placeholder_image']['image0'],
                                                        'content-block-more-ad-uni',
                                                        array(
                                                            'title' => 'content-block-more-ad-uni',
                                                            'width' => 320,
                                                            'height' => 240,
                                                            'border' => '0',
                                                            'style' => 'display:block;border:none;'
                                                        ))
                                                    !!}
                                                @endif
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td height="12px" valign="top" style="line-height:12px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                        <td width="320" align="left" valign="top" height="14">
                                            @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                {!! $module_params['data']['text0'] !!}
                                            @else

                                                <p style="max-width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:14px;line-height:14px;color:#FF5555;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;"
                                                   class="st-inline-block"
                                                   contenteditable="true"
                                                >LOREM IMPSUM</p>
                                            @endif
                                        </td>
                                    </tr>

                                    <tr>
                                        <td valign="top" style="line-height:5px;" height="5px">&nbsp;</td>
                                    </tr>

                                    <tr>
                                        <td width="320" align="left" valign="top" height="48">
                                            @if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
                                                {!! $module_params['data']['text1'] !!}
                                            @else
                                                <a style="max-width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:20px;line-height:24px;color:#424242;text-decoration:none;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;display:block;"
                                                   data-contenteditable-href="{{ isset($image0['destination_url']) ? $image0['destination_url'] : ' ' }}"
                                                   contenteditable="true"
                                                >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a>
                                            @endif
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                <!--[if gte mso 9]>
                    </td>
                    <td valign="top">
                <![endif]-->
                    <table align="left"
                           border="0"
                           cellpadding="0"
                           cellspacing="0"
                           width="40"
                           height="20"
                           class="wrapper-table"
                    >
                        <tr>
                            <td width="40" height="20" class="element-block-center">&nbsp;</td>
                         </tr>
                    </table>
                 <!--[if gte mso 9]>
                    </td>
                    <td valign="top">
                <![endif]-->
                    <table align="left"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           width="300"
                           class="full-width"
                    >
                        <tr>
                            <td align="center" valign="top">
                                <table align="center"
                                       border="0"
                                       cellpadding="0"
                                       cellspacing="0"
                                       width="300"
                                       class="full-width"
                                >
                                    <tr>
                                        <td valign="top" align="center" height="<?php echo $module_params['image_size']['image1']['height']; ?>">
                                            <a href="{{ isset($image1['destination_url'])? $image1['destination_url'] : '#' }}" data-master-image-editor="basic" class="st-no-tracking">
                                                @if ( isset($image1['path']) && !empty($image1['path']) )
                                                        {!! Html::image( url() . "/images/campaigns". $image1['path'],
                                                            ( isset($image1['alt']) )? $image1['alt']:'',
                                                                array(
                                                                    'title' => ( isset($image1['alt']) )? $image1['alt']:'',
                                                                    'border' => '0',
                                                                    'data-image' => '',
                                                                    'width' => '300',
                                                                    'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
                                                                )
                                                            )
                                                        !!}
                                                @else
                                                        {!! Html::image( url() . $module_params['placeholder_image']['image1'],
                                                                'content-block-more-ad-uni',
                                                                array(
                                                                    'title' => 'content-block-more-ad-uni',
                                                                    'border' => '0',
                                                                    'data-image' => '',
                                                                    'width' => '300',
                                                                    'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
                                                                )
                                                            )
                                                        !!}
                                                @endif
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="300" height="14" align="right" valign="top" style="text-align:right;">
                                            <span style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:10px;line-height:14px;color:#000000;text-decoration:none;letter-spacing:1px;text-align:right;">Advertisement</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>