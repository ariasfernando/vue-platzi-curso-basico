<?php

namespace Stensul\Console\Commands\Module;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Illuminate\Support\Facades\Storage;

class Create extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'module:create
        {--name= : Module name (This is how it will show on the menu)}
        {--description= : Module description (Brief explanation of what this module does)}
        {--module_id= : Must be all lowercase, replace spaces with underscores}
        {--parent_module= : Id of the module we want as a template (Use "none" to use default template and config")}
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

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->app_name = app('config')->get('app.name');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $options = $this->options();
        $modules = \StensulModule::getModuleList();

        $name = is_null($options['name']) ?
            $this->ask('What is the module name? (This is how it will show on the menu)')
            : $options['name'];

        $description = is_null($options['description']) ?
            $this->ask('What is the module description? (Brief explanation of what this module does)')
            : $options['description'];

        $module_id = is_null($options['module_id']) ?
            $this->anticipate(
                'What is the module id? (Must be all lowercase, replace spaces with underscores)',
                // Autocomplete with the normalized module name.
                [preg_replace(['/\s+/', '/[^a-z0-9\-\_]/i'], ['_', ''], strtolower($name))]
            )
            : $options['module_id'];

        // Reserved module IDs.
        if (in_array($module_id, ['default', 'none'])) {
            return $this->error("Invalid module ID.");
        }

        $parent_module = is_null($options['parent_module']) ?
            $this->anticipate(
                'What is the module parent id? (Use "none" to use default template and config")',
                // Autocomplete with module IDs.
                array_keys($modules)
            )
            : $options['parent_module'];


        if ($options['config'] === 'default') {
            if ($parent_module !== 'none' && isset($modules[$parent_module])) {

                $config = $modules[$parent_module];
                $config['module_id'] = $module_id;
                $config['title'] = $name;
                $config['class'] = 'pkg';

            } else {

                $config = [
                    'module_id' => $module_id,
                    'title' => $name,
                    'app_name' => $this->app_name,
                    'action' => 'add',
                    'level' => 'single',
                    'file_parent' => 'base',
                    'class' => 'pkg'
                ];
            }
        } else {
            $config = json_decode($options['config']);
        }

        $module_dir = app()->resourcePath() . DS . 'views' . DS . $this->app_name . DS . 'modules' . DS . $module_id;

        try {
            mkdir($module_dir, 0755, true);
        } catch (\Exception $exception) {
            return $this->error('Error creating module dir: ' . $exception->getMessage());
        }

        if (!$this->saveConfig($module_dir, $config)) {
            return $this->error("Couldn't create config file.");
        }
        if (!$this->saveTemplate($module_dir, $module_id, $parent_module)) {
            return $this->error("Couldn't create template file.");
        }

        $this->info('Module created!');
    }

    private function saveConfig($module_dir, $config)
    {
        return file_put_contents($module_dir . DS . 'config.json', json_encode($config, JSON_PRETTY_PRINT));
    }

    /**
    * Save template for the module on disk.
    *
    * @param string $module_dir
    * @param string $module_id
    * @param string $parent_module
    * @return bolean
    */
    private function saveTemplate($module_dir, $module_id, $parent_module = null)
    {
        $template = <<<EOF
{{-- $module_id : Start --}}
<tr data-params='{{json_encode(\$module_params)}}'>
    <td bgcolor="#ffffff">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody><tr>
                <td style="padding: 40px; font-family: {{ \$params['campaign_data']->getLibraryConfig('font_family') }};
                    font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: {{ \$module_params['data']['color'] or "#555555" }};">
                    <div class="text-overlay">
                        <div class="prevent-overflow">
                            <p id="text-editable" class="st-edit-text">
                                {!! \$module_params['data']['text0'] or "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Vestibulum tempus, lacus et vehicula congue, felis diam rhoncus enim, a scelerisque sapien
                                nulla non tortor. Mauris aliquet accumsan lorem, eget blandit diam pretium at." !!}
                            </p>
                        </div>
                        <div class="text-overlay-toolbox"></div>
                    </div>
                </td>
            </tr></tbody>
        </table>
    </td>
</tr>
{{-- $module_id : End --}}
EOF;

        // Override default template if a parent module is specified.
        if (!empty($parent_module) && $parent_module !== 'none') {
            // @todo check if it's an old module.
            $parent_dir = app()->resourcePath() . DS . 'views' . DS . $this->app_name . DS . 'modules' . DS . $parent_module;

            $template = false;

            try {
                $template = file_get_contents($parent_dir . DS . 'template.blade.php');
            } catch (\Exception $exception) {

                try {
                    // Try old module
                    $template_file = app()->resourcePath() . DS . 'views' . DS . $this->app_name . DS . 'modules'
                        . DS . $parent_module . '.blade.php';

                    $template = file_get_contents($template_file);
                } catch (\Exception $exception) {

                }
            }

            if (!$template) {
                return $this->error("Couldn't fetch parent template file.");
            }
        }

        return file_put_contents($module_dir . DS . 'template.blade.php', $template);
    }
}
