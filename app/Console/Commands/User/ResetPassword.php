<?php

namespace Stensul\Console\Commands\User;

use PasswordPolicy;
use Stensul\Models\User;
use Stensul\Models\Role;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Carbon\Carbon;

class ResetPassword extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'user:reset-password';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset a user password.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $options = $this->option();

        $email = is_null($options["email"])
            ? $this->ask('What is the user email ?')
            : $options["email"];

        $email = strtolower($email);

        if ($email !== "") {
            $user = User::whereEmail($email)->first();
            if ($user) {
                if ($this->confirm("Are you sure you want to reset the password for this user? "
                    . " [<options=bold>{$user->name}: {$user->email}</>]")) {
                    $password = is_null($options['password']) ? PasswordPolicy::generate() : $options['password'];
                    $force = is_null($options['force']) ? 0 : $options['force'];
                    $user->password = bcrypt($password);
                    $user->force_password = (int) $force;
                    $user->last_password_change = Carbon::now();
                    $user->save();

                    $this->info('The password for user <options=bold>' . $email
                        . '</> was reset! New password: <options=bold>' . $password . '</>');
                } else {
                    $this->error('Exit.');
                }
            } else {
                $this->error('The email is not registered.');
                return 3;
            }
        } else {
            $this->error('The email is required.');
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
            ['email', null, InputOption::VALUE_OPTIONAL, 'User email', null],
            ['password', null, InputOption::VALUE_OPTIONAL, 'User password', null],
            ['force', null, InputOption::VALUE_OPTIONAL, 'Force password', null]
        ];
    }
}
