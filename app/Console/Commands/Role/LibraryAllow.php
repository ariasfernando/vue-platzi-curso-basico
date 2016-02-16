<?php

namespace Stensul\Console\Commands\Role;

use Stensul\Models\Role;
use Illuminate\Console\Command;

class LibraryAllow extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:library:allow';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Allow access to a library';

    /**
     * Execute the console command.
     */
    public function fire()
    {

        $name = $this->ask('What is the role name ?');

        if (!Role::where('name', '=', $name)->exists()) {
            $this->error('Role not found.');
            return false;
        }

        $role_data = Role::where('name', '=', $name)->firstOrFail();
        $libraries = \Config::get("view.libraries", []);

        $libraries_array = [];
        $value = null;
        
        foreach ($libraries as $key => $value) {
            if (!in_array($key, $role_data['libraries']) && $key != "default") {
                $libraries_array[] = $key;
            }
        }

        if (count($libraries_array) === 0) {
            $this->info('The role ' . $name . ' has access to all the libraries!');
        } else {
            if (count($libraries_array) > 1) {
                array_unshift($libraries_array, "all");
            }

            $library_choice = $this->ask('Select a library: ('.join(", ", $libraries_array).')');

            if (strtolower($library_choice) == "all") {
                array_shift($libraries_array);
                $role_data->libraries = array_merge($role_data->libraries, $libraries_array);
            } elseif (in_array($library_choice, $libraries_array)) {
                $role_data->libraries = array_merge($role_data->libraries, [$library_choice]);
            } else {
                $this->error("The library " . $library_choice . " doesn't exist!");
                return false;
            }

            $role_data->save();
            $this->info('The role ' . $name . ' was updated!');
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
