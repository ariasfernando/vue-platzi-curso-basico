<?php

namespace Stensul\Console\Commands\User;

use Stensul\Models\User;
use Illuminate\Console\Command;
use Activity;
use MongoDB\BSON\ObjectID as ObjectID;
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
    public function fire()
    {
        $options = $this->option();
        $email = is_null($options["email"])
            ? $this->ask('What is the user email that you want restore?')
            : $options["email"];

        if ($email != "") {
            if (!User::where('email', '=', $email)->exists()) {
                $this->error('The email does not exist.');
            } else {
                $user_data = User::where('email', '=', $email)->firstOrFail();
                $user_data->restore();
                $user_data->status = "enabled";
                $user_data->unset('deleted_at');
                $user_data->save();
                Activity::log('User restored', array('properties' => ['user_id' => new ObjectId($user_data->_id)]));
                $this->info('The user '.$email.' was restored!');
            }
        } else {
            $this->error('The email is required.');
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
        ];
    }
}
