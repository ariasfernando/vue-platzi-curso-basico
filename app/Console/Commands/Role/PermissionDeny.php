<?php

namespace Stensul\Console\Commands\Role;

use RoleModel as Role;
use PermissionModel as Permission;
use Illuminate\Console\Command;

class PermissionDeny extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:permission:deny';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deny role activity.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $name = $this->ask('What is the role name ?');

        if ($name != "") {
            if (Role::where('name', '=', $name)->exists()) {
                $role_data = Role::where('name', '=', $name)->firstOrFail();

                $permissions_data = Permission::all(['name', 'description'])->toArray();
                $permissions_array = [];

                foreach ($permissions_data as $permission) {
                    if (in_array($permission['name'], $role_data['permissions'])) {
                        $permissions_array[] = $permission['name'];
                    }
                }

                if (count($permissions_array) === 0) {
                    $this->info("The role " . $name . " haven't permissions to deny !");
                } else {
                    if (count($permissions_array) > 1) {
                        array_unshift($permissions_array, "all");
                    }

                    $permission_choice = $this->ask('Select a permission: ('.join(", ", $permissions_array).')');

                    if (strtolower($permission_choice) == "all") {
                        $role_data->permissions = [];
                    } elseif (in_array($permission_choice, $permissions_array)) {
                        $role_data->permissions = array_values(
                            array_diff($role_data->permissions, [$permission_choice])
                        );
                    } else {
                        $this->error("The permission " . $permission_choice . " doesn't exist!");
                        return false;
                    }

                    $role_data->save();
                    $this->info('The role ' . $name . ' was updated!');
                }
            } else {
                $this->error('Role not found.');
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
