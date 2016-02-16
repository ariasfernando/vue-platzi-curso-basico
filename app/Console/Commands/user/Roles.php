<?php

namespace Stensul\Console\Commands\User;

use Stensul\Models\User;
use Stensul\Models\Role;
use Illuminate\Console\Command;

class Roles extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'user:roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change a user roles.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $roles = Role::all();

        if (count($roles) === 0) {
            $this->error('Roles not found, use command php artisan role:create!');
        } else {
            $email = $this->ask('What is the user email ?');

            if ($email != "") {
                if (!User::where('email', '=', $email)->exists()) {
                    $this->error('The email does not exist.');
                } else {
                    $user_data = User::where('email', '=', $email)->firstOrFail();
                    $roles_data = Role::all(['name', 'description'])->toArray();
                    $roles_array = [];

                    foreach ($roles_data as $role) {
                        $roles_array[] = $role['name'];
                    }

                    $roles = $this->ask('What is the user role ? (none, '.join(", ", $roles_array).')', join(",", $user_data->roles));

                    $selected_array = [];

                    if (strpos($roles, 'none') === false) {
                        $roles = explode(",", $roles);


                        foreach ($roles as $role) {
                            $role = trim($role);
                            if (in_array($role, $roles_array)) {
                                $selected_array[] = $role;
                            }
                        }
                    }

                    $user_data->roles = $selected_array;
                    $user_data->save();
                    $this->info('The user ' . $email . ' role was updated!');

                }
            } else {
                $this->error('The email is required.');
            }
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
