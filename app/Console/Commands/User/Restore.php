<?php

namespace Stensul\Console\Commands\User;

use Stensul\Models\User;
use Illuminate\Console\Command;

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
        $email = $this->ask('What is the user email that you want restore?');

        if ($email != "") {
            if (!User::where('email', '=', $email)->exists()) {
                $this->error('The email does not exist.');
            } else {
                $user_data = User::where('email', '=', $email)->firstOrFail();
                $user_data->restore();
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
        return [];
    }
}
