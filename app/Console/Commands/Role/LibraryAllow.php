<?php

namespace Stensul\Console\Commands\Role;

use Stensul\Models\Role;
use Stensul\Models\Library;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

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
    public function handle()
    {

        $options = $this->option();
        $name = (is_null($options["role"]))? $this->ask('What is the role name ?') : $options["role"];

        if (!Role::where('name', '=', $name)->exists()) {
            $this->error('Role not found.');
            return false;
        }

        $role_data = Role::where('name', '=', $name)->firstOrFail();
        $libraries = Library::all(['name','key'])->toArray();

        $libraries_array = [];
        $value = null;
        
        foreach ($libraries as $library) {
            $libraries_array[] = $library['key'];
        }

        if (count($libraries_array) === 0) {
            $this->info('There are no libraries created.');
        } else {
            if (count($libraries_array) > 1) {
                array_unshift($libraries_array, "all");
            }

            $library_choice = (is_null($options["library"]))
                    ? $this->ask('Select a library: ('.join(", ", $libraries_array).')')
                    : $options["library"];

            if (strtolower($library_choice) == "all") {
                array_shift($libraries_array);
                array_walk($libraries_array, function (&$value) {
                    $value = 'access_library_' . $value;
                });
                $role_data->permissions = array_merge($role_data->permissions, $libraries_array);
            } elseif (in_array($library_choice, $libraries_array)) {
                $role_data->permissions = array_merge($role_data->permissions, ['access_library_' . $library_choice]);
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
        return [
            ['role', null, InputOption::VALUE_OPTIONAL, 'Role name', null],
            ['library', null, InputOption::VALUE_OPTIONAL, 'Library', null]
        ];
    }
}
