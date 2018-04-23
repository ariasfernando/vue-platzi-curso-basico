<?php

namespace Stensul\Console\Commands\Role;

use Stensul\Models\Role;
use Illuminate\Console\Command;

class LibraryDeny extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:library:deny';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deny library access';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $name = $this->ask('What is the role name ?');

        if (!Role::where('name', '=', $name)->exists()) {
            $this->error('Role not found.');
            return false;
        }

        $role_data = Role::where('name', '=', $name)->firstOrFail();
        $role_permissions = $role_data->permissions;

        $libraries_array = [];
        foreach ($role_data->permissions as $permission) {
            if (substr($permission, 0, 15) === "access_library_") {
                $libraries_array[] = substr($permission, 15, strlen($permission));
            }
        }

        if (count($libraries_array) === 0) {
            $this->info("The role " . $name . " haven't libraries to deny !");
        } else {
            if (count($libraries_array) > 1) {
                array_unshift($libraries_array, "all");
            }

            $library_choice = $this->ask('Select a library: ('.join(", ", $libraries_array).')');

            if (strtolower($library_choice) == "all") {
                foreach ($role_permissions as $key => $permission) {
                    if (substr($permission, 0, 15) === "access_library_") {
                        unset($role_permissions[$key]);
                    }
                }
            } elseif (in_array($library_choice, $libraries_array)) {
                if (($key = array_search("access_library_" . $library_choice, $role_permissions)) !== false) {
                    unset($role_permissions[$key]);
                }
            } else {
                $this->error("The library " . $library_choice . " doesn't exist!");
                return false;
            }
            $role_data->permissions = $role_permissions;
            $role_data->save();
            $this->info('The role ' . $name . ' was updated!');
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
