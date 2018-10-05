<?php

namespace Stensul\Console\Commands\Role;

use RoleModel as Role;
use Illuminate\Console\Command;

class Delete extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a role.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->ask('What is the role name ?');

        if ($name != "") {
            if (!Role::where('name', '=', $name)->exists()) {
                $this->error('The role does not exist.');
            } else {
                $role_data = Role::where('name', '=', $name)->firstOrFail();
                $role_data->delete();
                $this->info('The role '.$name.' was deleted!');
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
        return [];
    }
}
