<?php

namespace Stensul\Console\Commands\Permission;

use PermissionModel as Permission;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class Create extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'permission:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new permission.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $options = $this->option();

        $name = is_null($options["name"]) ? $this->ask('What is the permission name ?') : $options["name"];
        $description = is_null($options["description"])
            ? $this->ask('What is the permission description ?') : $options["description"];

        $params = [
            'name' => $name,
            'description' => $description
        ];

        if ($name != "") {
            if (!Permission::where('name', '=', $name)->exists()) {
                Permission::create($params);
                $this->info('The permission '.$name.' was created!');
            } else {
                $this->error('The permission is already registered.');
            }
        } else {
            $this->error('The name is required.');
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
            ['name', null, InputOption::VALUE_OPTIONAL, 'Permission name', null],
            ['description', null, InputOption::VALUE_OPTIONAL, 'Permission description', null]
        ];
    }
}
