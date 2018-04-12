<?php

namespace Stensul\Console\Commands\Task;

use Stensul\Models\User;
use Illuminate\Console\Command;

class GroupToRoles extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:group-to-roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change users group string to an array roles.';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        $processCount = 0;

        foreach ($users as $user) {
            if (!isset($user->roles) || count($user->roles) == 0) {
                $user->roles = [ $user->group ];
                $user->save();
                $processCount++;
            }
        }
        $this->info($processCount. ' user were updated!');
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
