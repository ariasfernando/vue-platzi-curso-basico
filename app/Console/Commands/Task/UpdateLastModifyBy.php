<?php

namespace Stensul\Console\Commands\Task;

use Stensul\Models\User;
use Stensul\Models\Campaign;
use Illuminate\Console\Command;

class UpdateLastModifyBy extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:update-user-emails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update last modify by (email).';


    /**
     * Execute the console command.
     */
    public function fire()
    {
        $this->info('Running...');
        $campaigns = Campaign::where('user_email', '=', null, 'AND')
                ->where('status', '!=', 2)
                ->get();

        foreach ($campaigns as $campaign) {
            $campaign->user_email = User::findOrFail($campaign->user_id)->email;
            $this->info('Updating user email for campaign id: ' . $campaign->id . ' with ' . $campaign->user_email);
            $campaign->save();
        }
        $this->info('Finished.');
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
