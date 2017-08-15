<?php

namespace Stensul\Console\Commands\Setting;

use Stensul\Models\Setting;
use Illuminate\Console\Command;

class Show extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'setting:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List global settings.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $settings = Setting::all(['name', 'key', 'value'])->toArray();
        if (count($settings) === 0) {
            $this->error('Settings not found, use command php artisan setting:create!');
        } else {
            $settings_headers = ['Id', 'Name', 'Key', 'Value'];
            $this->table($settings_headers, $settings);
        }
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }
}
