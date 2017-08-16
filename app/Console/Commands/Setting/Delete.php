<?php

namespace Stensul\Console\Commands\Setting;

use Stensul\Models\Setting;
use Illuminate\Console\Command;

class Delete extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'setting:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a global setting.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $key = $this->ask('What is the setting key ?');

        if ($key != "") {
            if (!Setting::where('key', '=', $key)->exists()) {
                $this->error('The setting does not exist.');
            } else {
                $setting_data = Setting::where('key', '=', $key)->firstOrFail();
                $setting_data->delete();
                $this->info('The setting '.$key.' was deleted!');
            }
        } else {
            $this->error('The key is required.');
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
