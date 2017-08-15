<?php

namespace Stensul\Console\Commands\User;

use Stensul\Models\User;
use Illuminate\Console\Command;
use Activity;
use MongoDB\BSON\ObjectID as ObjectID;

class Delete extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'user:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a user.';

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $email = $this->ask('What is the user email ?');

        if ($email != "") {
            if (!User::where('email', '=', $email)->where('status', '!=', 'deleted')->exists()) {
                $this->error('This user does not exist.');
            } else {
                $user_data = User::where('email', '=', $email)->firstOrFail();
                $user_data->status = "deleted";
                $user_data->save();
                $user_data->delete();
                Activity::log('User deleted', array('properties' => ['user_id' => new ObjectId($user_data->_id)]));
                $this->info('The user '.$email.' was deleted!');
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
        return [];
    }
}
