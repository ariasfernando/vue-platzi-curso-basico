<?php

namespace Stensul\Console\Commands\Role;

use Stensul\Models\Role;
use Illuminate\Console\Command;

class Show extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List roles.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $roles = Role::all(['name', 'description', 'permissions'])->toArray();
        if (count($roles) === 0) {
            $this->error('Roles not found, use command php artisan role:create!');
        } else {
            $roles_headers = ['Id', 'Name', 'Description', 'Permissions'];

            for ($i=0; $i<count($roles); $i++) {
                $roles[$i]['permissions'] =
                    (!empty($roles[$i]['permissions'])) ? implode(",", $roles[$i]['permissions']) : "None";
            }

            $this->table($roles_headers, $roles);
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
