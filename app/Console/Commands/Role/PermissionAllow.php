<?php

namespace Stensul\Console\Commands\Role;

use RoleModel as Role;
use PermissionModel as Permission;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class PermissionAllow extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:permission:allow';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Allow role activity.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $options = $this->option();
        $name = (is_null($options["role"]))? $this->ask('What is the role name ?') : $options["role"];

        if ($name != "") {
            if (Role::where('name', '=', $name)->exists()) {
                $role_data = Role::where('name', '=', $name)->firstOrFail();
                $all_permissions = Permission::all(['name', 'description'])->toArray();
                $available_permissions = [];

                foreach ($all_permissions as $permission) {
                    if (!isset($role_data['permissions']) || !in_array($permission['name'], $role_data['permissions'])) {
                        $available_permissions[] = $permission['name'];
                    }
                }

                if (count($available_permissions) === 0) {
                    $this->info('The role ' . $name . ' has all the permissions!');
                } else {
                    if (count($available_permissions) > 1) {
                        array_unshift($available_permissions, "all");
                    }

                    $permission_choice = (is_null($options["permission"]))
                        ? $this->ask('Select a permission: ('.join(", ", $available_permissions).')')
                        : $options["permission"];

                    if (strtolower($permission_choice) == "all") {
                        array_shift($available_permissions);
                        $role_data->permissions = array_merge($role_data->permissions, $available_permissions);
                    } elseif (in_array($permission_choice, $available_permissions)) {
                        $role_data->permissions = array_merge($role_data->permissions, [ $permission_choice ]);
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
        return [
            ['role', null, InputOption::VALUE_OPTIONAL, 'Role name', null],
            ['permission', null, InputOption::VALUE_OPTIONAL, 'Permission', null]
        ];
    }
}
