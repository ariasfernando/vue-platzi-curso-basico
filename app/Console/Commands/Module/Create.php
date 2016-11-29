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
        {--module_id= : Must be all lowercase, replace spaces with underscores}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new module';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $options = $this->options();
        $app_name = app('config')->get('app.name');
        $menu = \Config::get('menu');

        $name = is_null($options["name"]) ?
            $this->ask('What is the module name? (This is how it will show on the menu)')
            : $options["name"];

        $description = is_null($options["description"]) ?
            $this->ask('What is the module description? (Brief explanation of what this module does)')
            : $options["description"];

        $module_id = is_null($options["module_id"]) ?
            $this->anticipate(
                'What is the module id? (Must be all lowercase, replace spaces with underscores)',
                // Autocomplete with the normalized module name.
                [preg_replace(['/\s+/', '/[^a-z0-9\-\_]/i'], ['_', ''], strtolower($name))]
            )
            : $options["module_id"];

        $module_dir = app()->resourcePath() . DS . 'views' . DS . $app_name . DS . 'modules' . DS . $module_id;

        try {
            mkdir($module_dir, 0755, true);
        } catch (\Exception $exception) {
            return $this->error('Error creating module dir: ' . $exception->getMessage());
        }

        $config = [
            'type' => $module_id,
            'title' => $name,
            'app_name' => $app_name,
            'action' => 'add',
            'level' => 'single',
            'file_parent' => 'base',
            'module_class' => 'pkg'
        ];

        if (!$this->saveConfig($module_dir, $config)) {
            return $this->error("Couldn't create config file.");
        }
        if (!$this->saveTemplate($module_dir, $module_id)) {
            return $this->error("Couldn't create template file.");
        }

        $this->info('Module created!');
    }

    private function saveConfig($module_dir, $config)
    {
        return file_put_contents($module_dir . DS . 'config.json', json_encode($config, JSON_PRETTY_PRINT));
    }

    private function saveTemplate($module_dir, $module_id)
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
        return file_put_contents($module_dir . DS . 'template.blade.php', $template);
    }
}
