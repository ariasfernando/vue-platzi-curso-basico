<?php

namespace Stensul\Console\Commands\User;

use UserModel as User;
use Illuminate\Console\Command;

class Show extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'user:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show the list of users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::withTrashed()->orderBy('deleted_at')->get(['name', 'email', 'roles', 'deleted_at']);
        $user_array = [];

        foreach ($users as $user) {
            $user_array[] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => join(",", $user->roles),
                'deleted' => $user->trashed() ? $user->deleted_at : ''
            ];
        }

        if (count($users) === 0) {
            $this->error('Roles not found, use command php artisan role:create!');
        } else {
            $users_headers = ['Id', 'Name', 'Email', 'Roles', 'Deleted'];
            $this->table($users_headers, $user_array);
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
