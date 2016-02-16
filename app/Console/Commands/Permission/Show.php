<?php

namespace Stensul\Console\Commands\Permission;

use Stensul\Models\Permission;
use Illuminate\Console\Command;

class Show extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'permission:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show the list of permissions';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $permissions = Permission::all(['name', 'description'])->toArray();
        if (count($permissions) === 0) {
            $this->error('Permissions not found, use command php artisan permission:create!');
        } else {
            $permissions_headers = ['Id', 'Name', 'Description'];
            $this->table($permissions_headers, $permissions);
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
