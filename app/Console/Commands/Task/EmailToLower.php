<?php

namespace Stensul\Console\Commands\Task;

use UserModel as User;
use Illuminate\Console\Command;

class EmailToLower extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:emails-to-lowercase';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change users email to lowercase.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();

        foreach ($users as $user) {
                $user->email = strtolower($user->email);
                $user->save();
        }
        $this->info('The emails were converted to lowercase!');
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
