<?php

    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image0 = $module_params['data']['image0'];
    }

    if( isset($module_params['data']['image1']) && !empty($module_params['data']['image1']) ){
        $image1 = $module_params['data']['image1'];
    }
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td valign="top">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%!important;">
            <tr>
                 <td valign="top">
                <!--[if gte mso 9]>
                    </td>
                    <td valign="top">
                <![endif]-->
                    <table class="st-box wrapper-table"
                           align="left"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           width="320"
                    >
                        <tr>
                            <td>
                                <table align="center"
                                       border="0"
                                       cellpadding="0"
                                       cellspacing="0"
                                       width="320"
                                       class="st-data-modal-parent"
                                >
                                    <tr>
                                        <td>
                                            <a href="{{ isset($image0['destination_url']) ? $image0['destination_url'] : '#' }}" data-open-element-config="single_shared_height" data-key="image0">
                                                @if ( !empty($image0['path']) )
                                                        {!! Html::image( url("/images/campaigns". $image0['path']),
                                                            ( isset($image0['alt']) )? $image0['alt']:'',
                                                                array(
                                                                    'title' => ( isset($image0['alt']) )? $image0['alt']:'',
                                                                    'width' => 320,
                                                                    'border' => '0',
                                                                    'style' => 'display:block;border:none;'
                                                                )
                                                            )
                                                        !!}
                                                @else
                                                    {!! Html::image( url($module_params['placeholder_image']),
                                                                 'side-by-side-content-blocks',
                                                                    array(
                                                                        'title' => 'side-by-side-content-blocks',
                                                                        'width' => 320,
                                                                        'border' => '0',
                                                                        'style' => 'display:block;border:none;'
                                                                    )
                                                                ) 
                                                    !!}
                                                @endif
                                            </a>
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
                           width="20"
                           height="20"
                           class="wrapper-table"
                    >
                        <tr>
                            <td width="20" height="20" class="element-block-center">&nbsp;</td>
                         </tr>
                    </table>
                <!--[if gte mso 9]>
                    </td>
                    <td valign="top">
                <![endif]-->
                    <table class="st-box wrapper-table"
                           align="left"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           width="320"
                    >
                        <tr>
                            <td>
                                <table align="center"
                                       border="0"
                                       cellpadding="0"
                                       cellspacing="0"
                                       width="320"
                                       class="st-data-modal-parent"
                                >
                                    <tr>
                                        <td valign="top">
                                            <a href='{{ isset($image1['destination_url']) ? $image1['destination_url'] : '#' }}' data-open-element-config="single_shared_height" data-key="image1">
                                                @if ( !empty($image1['path']) )
                                                    {!! Html::image(  url("/images/campaigns". $image1['path']),
                                                        ( isset($image1['alt']) )? $image1['alt']:'',
                                                            array(
                                                                'title' => ( isset($image1['alt']) )? $image1['alt']:'',
                                                                'width' => 320,
                                                                'border' => '0',
                                                                'style' => 'display:block;border:none;'
                                                            )
                                                        )
                                                    !!}
                                                @else
                                                    {!! Html::image( url('/') . $module_params['placeholder_image'],
                                                        'content-block-more-ad-uni',
                                                            array(
                                                                'title' => 'content-block-more-ad-uni',
                                                                'width' => 320,
                                                                'border' => '0',
                                                                'style' => 'display:block;border:none;'
                                                            )
                                                        )
                                                    !!}
                                                @endif
                                            </a>
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