<?php

    // Array to build html table
    $tableDataConstructor = [];

    // Get table data from DDBB
    if( isset( $module_params['data']['table0'] ) ){
        $tableDataConstructor = $module_params['data']['table0'];
    // Get default table data from modules.php
    }else if( isset($module_params['default_table_data']) ){
        $tableDataConstructor = $module_params['default_table_data'];
    // Set default table data.
    }else{
        $tableDataConstructor = [
            [
                ["value"=>""],
                ["value"=>""]
            ],
            [
                ["value"=>""],
                ["value"=>""]
            ]
        ];
    }


    if( !isset($module_params['th_style_attr']) ){
        $module_params['th_style_attr'] = '';
    }
    if( !isset($module_params['td_style_attr']) ){
        $module_params['td_style_attr'] = '';
    }

    $module_params['th_style_attr'] = $module_params['th_style_attr'] . 'font-family:' . $params['campaign_data']->getLibraryConfig('font_family') . ';';
    $module_params['td_style_attr'] = $module_params['td_style_attr'] . 'font-family:' . $params['campaign_data']->getLibraryConfig('font_family') . ';';
?>

<tr data-params='{{json_encode($module_params)}}'>
    <td align="center" valign="top" class="st-add-icon-config">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            @if (isset($module_params['gutter_space']))
                                <td width="{{ $module_params['gutter_space'] }}" height="10" class="hidden-device"></td>
                            @endif
                            <td
                                @if (isset($module_params['gutter_space']))
                                    class="mobile-margin"
                                @endif
                                >
                                <table width="100%" cellpadding="0" cellspacing="0" border="1" style="border-color:#808080;border-collapse:separate;border-spacing:0;" class="st-custom-table">
                                    @foreach ($tableDataConstructor as $rowIndex => $row )
                                        <tr
                                            @if($rowIndex == 0 && isset( $module_params['header_background'] ))
                                                bgcolor="{{ $module_params['header_background'] }}"
                                                style="background-color:{{ $module_params['header_background'] }};"
                                            @endif
                                            >
                                            @foreach ($row as $colIndex => $cells )
                                                <td
                                                    valign="middle" align="left"

                                                    @if ( isset($cells["width"]) )
                                                        width="{{ $cells['width'] }}"
                                                    @endif

                                                    @if($rowIndex == 0)
                                                        @if (isset($module_params['th_css_class']))
                                                            class="{{ $module_params['th_css_class'] }}"
                                                        @endif
                                                        style="{{ (isset($module_params['th_style_attr']))? $module_params['th_style_attr'] : '' }}"
                                                    @else
                                                        style="{{ (isset($module_params['td_style_attr']))? $module_params['td_style_attr'] : '' }}"
                                                    @endif
                                                    >
                                                        {!! $cells['value'] !!}
                                                </td>
                                            @endforeach
                                        </tr>
                                    @endforeach
                                </table>
                            </td>
                            @if (isset($module_params['gutter_space']))
                                <td width="{{ $module_params['gutter_space'] }}" height="10" class="hidden-device"></td>
                            @endif
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>