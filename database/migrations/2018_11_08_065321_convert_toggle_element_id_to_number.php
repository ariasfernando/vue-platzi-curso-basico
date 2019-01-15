<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Module;
use Stensul\Models\Library;
use Stensul\Models\Campaign;
use Illuminate\Support\Facades\Log as Logging;


class ConvertToggleElementIdToNumber extends Migration
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
        $this->setCampaignConvertToggleElementIdToNumber();
        $this->setModuleConvertToggleElementIdToNumber();
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

    protected function setCampaignConvertToggleElementIdToNumber() {
        Campaign::withTrashed()->chunk(100, function ($campaigns) {
            Logging::info('-------------------------');
            Logging::info('CAMPAIGNS');
            Logging::info('-------------------------');
            foreach ($campaigns as $campaign) {
                $modules_data = $campaign["modules_data"];
                foreach ($modules_data as $key => $module) {
                    if (isset($module['plugins'])
                        && isset($module['plugins']['toggleElement'])
                        && isset($module['plugins']['toggleElement']['data'])
                        && isset($module['plugins']['toggleElement']['data']['elements'])
                    ) {
                        foreach ($module['plugins']['toggleElement']['data']['elements'] as $elements_key => $element) {
                            if (isset($element['id'])) {
                                $modules_data[$key]['plugins']['toggleElement']['data']['elements'][$elements_key]['id'] = intval($element['id']);
                                $modules_data[$key]['plugins']['toggleElement']['data']['preventEmpty'] = intval($element['id']);
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

    protected function setModuleConvertToggleElementIdToNumber() {
        Module::withTrashed()->chunk(100, function ($modules) {
            Logging::info('-------------------------');
            Logging::info('STUDIO');
            Logging::info('-------------------------');
            foreach ($modules as $key => $module) {
                $module_plugins = $module['plugins'];
                if (isset($module_plugins)
                    && isset($module_plugins['toggleElement'])
                    && isset($module_plugins['toggleElement']['data'])
                    && isset($module_plugins['toggleElement']['data']['elements'])
                ) {
                    foreach ($module_plugins['toggleElement']['data']['elements'] as $elements_key => $element) {
                        if (isset($element['id'])) {
                            $module_plugins['toggleElement']['data']['elements'][$elements_key]['id'] = intval($element['id']);
                        }
                    }
                }
                $module->plugins = $module_plugins;
                $module->timestamps = false;
                $module->save();
            }
        });
    }
}
