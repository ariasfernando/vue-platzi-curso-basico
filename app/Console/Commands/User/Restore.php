<?php

namespace Stensul\Console\Commands\User;

use Activity;
use UserModel as User;
use MongoDB\BSON\ObjectID;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class Restore extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'user:restore';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restore a deleted user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $options = $this->option();
        $email = is_null($options["email"])
            ? $this->ask('What is the user email that you want to restore?')
            : $options["email"];

        if ($email == "") {
            return $this->error('The email is required.');
        }

        if (User::where('email', '=', $email)->first()) {
            return $this->error('There\'s already an active user with this email.');
        }

        $user_data = User::onlyTrashed()->where('email', '=', $email)->first();

        if (!$user_data) {
            return $this->error('The email does not exist or is not deleted.');
        }

        $user_data->restore();
        $user_data->status = "enabled";
        $user_data->unset('deleted_at');
        $user_data->save();
        Activity::log('User restored', array('properties' => ['user_id' => new ObjectID($user_data->_id)]));
        $this->info('The user ' . $email . ' was restored!');
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
        ];
    }
}
