<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use Illuminate\Support\Facades\Log as Logging;

class TinymceTextOptionsDataToJson extends Migration
{
    /**
    *   This migration will convert stored data into a Json Format
    *   - textcolor_map => string: comma separated to JSON
    *   - backcolor_map => string: comma separated to JSON
    *   - fontsize_formats => string: space separated to JSON
    **/
    private $reverse = false;

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();
        $this->updateTextOptionsFormat_campaigns();
        $this->updateTextOptionsFormat_modules();
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();
        $this->reverse = true;
        $this->updateTextOptionsFormat_campaigns();
        $this->updateTextOptionsFormat_modules();
    }

    protected function adapter($data, $relation) {
        if ($data === "0" || $data === 0 || $data === "") {
            return $data;
        }

        $relations = array(
            'forecolor' => 'arrayToTextColorMapJSON',
            'backcolor' => 'arrayToTextColorMapJSON',
            'fontsize' => 'spaceSeparatedStringToSingleValueJSON'
        );

        $output = array();

        switch ($relations[$relation]) {
            case 'arrayToTextColorMapJSON':
                if (is_array($data) && !$this->is_assoc($data)) {
                    for ($i = 0; $i < count($data); $i+=2) {
                        if (!empty($data[$i]) && !empty($data[$i+1])) {
                            $obj = array(
                                "label" => $data[$i + 1],
                                "value" => $data[$i]
                            );
                            array_push($output, $obj);
                        }
                    }
                }
                break;
            case 'spaceSeparatedStringToSingleValueJSON':
                if (is_string($data)) {
                    $arr = explode(' ',$data);
                    for ($i = 0; $i < count($arr); $i++) {
                        $obj = array(
                            "value" => $arr[$i]
                        );
                        array_push($output, $obj);
                    }
                }
                break;
        }

        return $output;
    }
    protected function adapterReverse($data, $relation) {
        if ($data === "0" || $data === 0 || $data === "") {
            return $data;
        }

        $relations = array(
            'forecolor' => 'textColorMapArray',
            'backcolor' => 'textColorMapArray',
            'fontsize' => 'valuesToSpaceSeparatedString'
        );

        $output = "";

        switch ($relations[$relation]) {
            case 'textColorMapArray':
                $output = array();
                foreach ($data as $item) {
                    array_push($output, $item['value']);
                    array_push($output, $item['label']);
                }
                break;
            case 'valuesToSpaceSeparatedString':
                if (is_string($data)) {
                    $arr = array();
                    foreach ($data as $item) {
                        array_push($array, $item['value']);
                    }
                    $output = implode(" ", $arr);
                }
                break;
        }
        return $output;
    }

    protected function is_assoc($var) {
        return is_array($var) && array_diff_key($var,array_keys(array_keys($var)));
    }

    protected function updateTextOptionsFormat_campaigns() {
        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            var_dump($this->reverse);
            Logging::info('-------------------------');
            Logging::info('CAMPAIGNS');
            Logging::info('-------------------------');
            foreach ($campaigns as $campaign) {
                $modules_data = $campaign["modules_data"];
                foreach ($modules_data as $key => $module) {
                    if (isset($module['structure']) && isset($module['structure']['columns'])) {
                        foreach ($module['structure']['columns'] as $column_key => $column) {
                            if (isset($column['components'])) {
                                foreach ($column['components'] as $component_key => $component) {
                                    if (isset($component['type']) && ($component['type'] === 'button-element' || $component['type'] === 'text-element')) {
                                        // forecolor
                                        if(isset($component['plugins']['textOptions']['config']['options']['forecolor'])
                                            && isset($component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'])) {
                                            $textcolor_map = $component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'];
                                            $component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'] = $this->reverse ? $this->adapterReverse($textcolor_map, 'forecolor') : $this->adapter($textcolor_map, 'forecolor');
                                        }

                                        // backcolor
                                        if(isset($component['plugins']['textOptions']['config']['options']['backcolor'])
                                            && isset($component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'])) {
                                            $backcolor_map = $component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'];
                                            $component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'] = $this->reverse ? $this->adapterReverse($backcolor_map, 'backcolor') : $this->adapter($backcolor_map, 'backcolor');
                                        }

                                        // fontsize
                                        if(isset($component['plugins']['textOptions']['config']['settings']['fontsize_formats'])
                                            && isset($component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'])) {
                                            $content = $component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'];
                                            $component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'] = $this->reverse ? $this->adapterReverse($content, 'fontsize') : $this->adapter($content, 'fontsize');
                                        }

                                    }
                                    $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key] = $component;
                                }
                            }
                        }
                    }
                }

                $campaign->modules_data = $modules_data;
                /*
                * Test and compare modules_data before and after and then
                * uncomment the following line to save the campaign.
                */
                $campaign->timestamps = false;
                $campaign->save();
            }
        });
    }

    protected function updateTextOptionsFormat_modules() {
        Module::withTrashed()->chunk(100, function ($modules) {
            Logging::info('-------------------------');
            Logging::info('STUDIO');
            Logging::info('-------------------------');
            foreach ($modules as $key => $module) {
                $module_structure = $module['structure'];
                if (isset($module_structure) && isset($module_structure['columns'])) {
                    foreach ($module_structure['columns'] as $column_key => $column) {
                        if (isset($column['components'])) {
                            foreach ($column['components'] as $component_key => $component) {
                                if (isset($component['type']) && ($component['type'] === 'button-element' || $component['type'] === 'text-element')) {
                                    // forecolor
                                    if(isset($component['plugins']['textOptions']['config']['options']['forecolor'])
                                        && isset($component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'])) {
                                        $textcolor_map = $component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'];
                                        $component['plugins']['textOptions']['config']['options']['forecolor']['textcolor_map'] = $this->reverse ? $this->adapterReverse($textcolor_map, 'forecolor') : $this->adapter($textcolor_map, 'forecolor');
                                    }

                                    // backcolor
                                    if(isset($component['plugins']['textOptions']['config']['options']['backcolor'])
                                        && isset($component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'])) {
                                        $backcolor_map = $component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'];
                                        $component['plugins']['textOptions']['config']['options']['backcolor']['backcolor_map'] = $this->reverse ? $this->adapterReverse($backcolor_map, 'backcolor') : $this->adapter($backcolor_map, 'backcolor');
                                    }

                                    // fontsize
                                    if(isset($component['plugins']['textOptions']['config']['settings']['fontsize_formats'])
                                        && isset($component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'])) {
                                        $content = $component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'];
                                        $component['plugins']['textOptions']['config']['settings']['fontsize_formats']['content'] = $this->reverse ? $this->adapterReverse($content, 'fontsize') : $this->adapter($content, 'fontsize');
                                    }

                                }

                                $module_structure['columns'][$column_key]['components'][$component_key] = $component;
                            }
                        }
                    }
                }

                $module->structure = $module_structure;
                $module->timestamps = false;
                $module->save();
            }
        });
    }
}
