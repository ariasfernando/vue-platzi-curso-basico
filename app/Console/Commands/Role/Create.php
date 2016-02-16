<?php

namespace Stensul\Console\Commands\Role;

use Stensul\Models\Role;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class Create extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new role.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $options = $this->option();
        $name = (is_null($options["name"]))? $this->ask('What is the role name ?') : $options["name"];
        $description =  (is_null($options["description"]))?
            $this->ask('What is the role description ?')
            : $options["description"];

        $params = [
            'name' => $name,
            'description' => $description
        ];

        if ($name != "") {
            if (!Role::where('name', '=', $name)->exists()) {
                Role::create($params);
                $this->info('The role '.$name.' was created!');
            } else {
                $this->error('The role is already registered.');
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
            ['name', null, InputOption::VALUE_OPTIONAL, 'Role name', null],
            ['description', null, InputOption::VALUE_OPTIONAL, 'Role description', null]
        ];
    }
}
