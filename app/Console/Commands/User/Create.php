<?php

namespace Stensul\Console\Commands\User;

use PasswordPolicy;
use Stensul\Models\User;
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
    protected $name = 'user:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $options = $this->option();
        $roles_data = Role::all(['name', 'description'])->toArray();
        $roles_array = [];

        foreach ($roles_data as $role) {
            $roles_array[] = $role['name'];
        }

        $name = (is_null($options["name"]))?
            $this->ask('What is the user name ?')
            : $options["name"];

        $last_name = (is_null($options["lastname"]))? "" : $options["lastname"];

        $email = (is_null($options["email"]))?
            $this->ask('What is the user email ?')
            : $options["email"];

        $password = PasswordPolicy::generate();

        if (is_null($options["roles"])) {
            if (count($roles_array) == 0) {
                $this->info('No roles created, use php artisan role:create!');
            } else {
                $roles = $this->ask('What is the user roles ? (' . join(", ", $roles_array) . ')');
            }
        } else {
            $roles = $options["roles"];
        }
        $roles = explode(",", $roles);
        $selected_array = [];

        foreach ($roles as $role) {
            $role = trim($role);
            if (in_array($role, $roles_array)) {
                $selected_array[] = $role;
            }
        }

        $params = [
            'name' => $name,
            'last_name' => $last_name,
            'email' => strtolower($email),
            'password' => bcrypt($password),
            'roles' => $selected_array
        ];

        if ($email != "") {
            if (!User::where('email', '=', strtolower($email))->exists()) {
                User::create($params);

                $this->info(
                    'The user <options=bold>' . $name . '</> was created! Password: <options=bold>' . $password . '</>'
                );
            } else {
                $this->error('The email is already registered.');
                if (User::where('email', '=', strtolower($email))->first()->status === 'deleted') {
                    return 5;
                }
                return 3;
            }
        } else {
            $this->error('The email and the password are required.');
            return 4;
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
            ['name', null, InputOption::VALUE_OPTIONAL, 'User name', null],
            ['lastname', null, InputOption::VALUE_OPTIONAL, 'User last name', null],
            ['email', null, InputOption::VALUE_OPTIONAL, 'User email', null],
            ['roles', null, InputOption::VALUE_OPTIONAL, 'User roles', null]
        ];
    }
}
