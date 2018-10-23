<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use Illuminate\Support\Facades\Log as Logging;

class UpdateButtonsAutoWidth extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make it faster by disabling query log.
        DB::connection()->disableQueryLog();
        $this->setCampaignButtonsAutoWidth();
        $this->setModuleButtonsAutoWidth();
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }

    protected function setCampaignButtonsAutoWidth() {
        Campaign::withTrashed()->chunk(100, function ($campaigns) {
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
                                    if (isset($component['type']) && ($component['type'] === 'button-element')) {
                                        if (!empty($component['button']['style']['minWidth'])) {
                                            Logging::info('Found button with minWidth defined');
                                            $minWidth = $component['button']['style']['minWidth'];
                                            if ($minWidth !== "0px" ) {
                                                if ($component['button']['styleOption']) {
                                                    Logging::info('Setting styleOption autoWidth to true');
                                                    $component['button']['styleOption']['autoWidth'] = true;
                                                    $modules_data[$key]['structure']['columns'][$column_key]['components'][$component_key] = $component;
                                                }
                                            }
                                        }
                                    }
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

    protected function setModuleButtonsAutoWidth() {
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
                                if (isset($component['type']) && ($component['type'] === 'button-element')) {
                                    if (!empty($component['button']['style']['minWidth'])) {
                                        Logging::info('Found button with minWidth defined');
                                        $minWidth = $component['button']['style']['minWidth'];
                                        if ($minWidth !== "0px" ) {
                                            if ($component['button']['styleOption']) {
                                                Logging::info('Setting styleOption autoWidth to true');
                                                $component['button']['styleOption']['autoWidth'] = true;
                                                $module_structure['columns'][$column_key]['components'][$component_key] = $component;
                                            }
                                        }
                                    }
                                }
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
