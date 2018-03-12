<?php

namespace Stensul\Console\Commands\Permission;

use Stensul\Models\Permission;
use Illuminate\Console\Command;

class Delete extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'permission:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a permission.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->ask('What is the permission name ?');

        if ($name != "") {
            if (!Permission::where('name', '=', $name)->exists()) {
                $this->error('The permission does not exist.');
            } else {
                $permission_data = Permission::where('name', '=', $name)->firstOrFail();
                $permission_data->delete();
                $this->info('The permission '.$name.' was deleted!');
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
