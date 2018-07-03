<?php

namespace Stensul\Console\Commands\Module;

use Stensul\Models\Module;
use Illuminate\Console\Command;
use Stensul\Services\ModelKeyManager;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Input\InputOption;

class Create extends Command
{

    /**
     * The name and signature of the console command.
     * Adding optional arguments to allowed this to be called programatically (bug in Laravel?).
     *
     * @var string
     */
    protected $signature = 'module:create {name?} {config?}
        {--name= : Module name (This is how it will show on the menu)}
        {--config=default : Module config JSON, not really intended to use from command line}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new module';

    /**
    * Stensul App Name
    */
    private $app_name;
    private static $module_dir;

    const ERROR_INVALID_MODULE_KEY = 1;
    const ERROR_CREATING_MODULE_DIR = 2;
    const ERROR_CONFIG_FILE = 3;
    const ERROR_VIEW_FILE = 4;
    const ERROR_DUPLICATE_MODULE_KEY = 5;
    const ERROR_INVALID_JSON = 6;
    const ERROR_INDEX_FILE = 7;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->app_name = app('config')->get('app.name');
        self::$module_dir = base_path() . DS . 'stensul' . DS . 'customer' . DS . 'resources' . DS . 'assets' . DS . 'vue' . DS . 'modules';
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $options = $this->options();
        
        // Calling programatically in L5.3 seems to work only with arguments.
        foreach ($options as $option => $value) {
            if (empty($value) || ($option == 'config')) {
                try {
                    $options[$option] = $this->argument($option);
                } catch (\Exception $exception) {
                }
            }
        }
        
        $modules = \StensulModule::getModuleList();

        $name = is_null($options['name']) ?
            $this->ask('What is the module name? (This is how it will show on the menu)')
            : $options['name'];

        $module_key = ModelKeyManager::getStandardKey(new Module, $name);

        // Reserved module IDs.
        if (empty($module_key) || in_array($module_key, ['default', 'none'])) {
            $this->error("Invalid module KEY.");
            return self::ERROR_INVALID_MODULE_KEY;
        } elseif (isset($modules[$module_key])) {
            $this->error("Duplicated module KEY.");

            return self::ERROR_DUPLICATE_MODULE_KEY;
        }

        if ($options['config'] === 'default') {
            $config = [
                    "key" => $module_key,
                    "name" => $name,
                    "version" => "0.0.1",
                    "author" => "",
                    "type" => "custom",
                    "data" => [],
                    "params" => [],
                    "enabled" => true,
                    "settings" => true
            ];
        } else {
            $config = json_decode($options['config']);

            if (json_last_error()) {
                $this->error('Invalid config JSON');
                return self::ERROR_INVALID_JSON;
            }
        }

        $module_dir = self::$module_dir . DS . $module_key;

        try {
            mkdir($module_dir, 0755, true);
        } catch (\Exception $exception) {
            $this->error('Error creating module dir: ' . $exception->getMessage());
            return self::ERROR_CREATING_MODULE_DIR;
        }

        if (!$this->saveConfig($module_dir, $config)) {
            $this->error("Couldn't create config file.");
            return self::ERROR_CONFIG_FILE;
        }

        if (!$this->saveIndexFile($module_dir)) {
            $this->error("Couldn't create config file.");
            return self::ERROR_INDEX_FILE;
        }

        if (!$this->saveViewFile($module_dir)) {
            $this->error("Couldn't create template file.");
            return self::ERROR_VIEW_FILE;
        }

        if (!$this->saveSettingsFile($module_dir)) {
            $this->error("Couldn't create template file.");
            return self::ERROR_VIEW_FILE;
        }

        $this->info('Module created!');
    }

    /**
    * Save config file for the module on disk.
    *
    * @param string $module_dir
    * @param array $module_dir
    * @return bolean
    */
    private function saveConfig($module_dir, $config)
    {
        return file_put_contents($module_dir . DS . 'config.json', json_encode($config, JSON_PRETTY_PRINT));
    }

    /**
    * Save view.vue file for the module on disk.
    *
    * @param string $module_dir
    * @return bolean
    */
    private function saveViewFile($module_dir)
    {
        $template = <<<EOF
<template>
  <table width="660" align="center" class="st-wrapper" cellspacing="0" cellpadding="0" border="0" style="width: 600px;">
    <tr>
      <td width="100%" style="vertical-align: top; width: 100%;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <!-- ELEMENT -->
          <tr>
            <td width="100%" style="width: 100%;">
                Lorem ipsum!
            </td>
          </tr>
          <!-- ELEMENT ENDS -->
        </table>                
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    props: [],
    computed: {},
    data () {
      return {},
      }
    },
    methods: {},
    },
  }
</script>

<style>
</style>
EOF;


        return file_put_contents($module_dir . DS . 'view.vue', $template);
    }

    /**
    * Save settings.vue file for the module on disk.
    *
    * @param string $module_dir
    * @return bolean
    */
    private function saveSettingsFile($module_dir)
    {
        $template = <<<EOF
<template>
  <div class="settings-wrapper plugin-wrapper">
    <!-- Module settings here -->
  </div>
</template>

<script>]
  export default {
    props: ['module', 'moduleId'],
    components: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="less">
</style>
EOF;


        return file_put_contents($module_dir . DS . 'settings.vue', $template);
    }

    /**
    * Save index.js file for the module on disk.
    *
    * @param string $module_dir
    * @return boolean
    */
    private function saveIndexFile($module_dir)
    {
        $file_content = <<<EOF
import view from './view.vue';
import config from './config.json';
import settings from './settings.vue';

module.exports = {
  ...config,
  view,
  settings
};
EOF;
        return file_put_contents($module_dir . DS . 'index.js', $file_content);
    }
}
