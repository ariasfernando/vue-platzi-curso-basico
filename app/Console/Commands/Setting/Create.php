<?php

namespace Stensul\Console\Commands\Setting;

use Stensul\Models\Setting;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class Create extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'setting:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new global setting.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $options = $this->option();

        $name = (is_null($options["name"]))? $this->ask('What is the setting name ?') : $options["name"];
        $key = (is_null($options["key"]))? $this->ask('What is the setting key ? ?') : $options["key"];
        $value = (is_null($options["value"]))? $this->ask('What is the setting value ?') : $options["value"];

        $params = [
            'name' => $name,
            'key' => $key,
            'value' => $value,
        ];

        if ($key != "") {
            if (!Setting::where('key', '=', $key)->exists()) {
                Setting::create($params);
                $this->info('The setting '.$key.' was created!');
            } else {
                $this->error('The setting is already registered.');
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
        return [
            ['name', null, InputOption::VALUE_OPTIONAL, 'Setting name', null],
            ['key', null, InputOption::VALUE_OPTIONAL, 'Setting key', null],
            ['value', null, InputOption::VALUE_OPTIONAL, 'Setting value', null],
        ];
    }
}
