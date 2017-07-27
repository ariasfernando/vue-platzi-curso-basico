<?php

namespace Stensul\Console\Commands\Task;

use Illuminate\Console\Command;
use Stensul\Models\User;
use Stensul\Models\Log;
use Stensul\Models\Campaign;

class CreatedBy extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:add-created-by';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add created by in campaigns.';

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
    public function fire()
    {
        $campaigns = Campaign::where('created_by', 'exists', false)->get();
        $logs = Log::where('description', 'Campaign created')->get();

        foreach ($campaigns as $campaign) {
            $campaign_id = $campaign->_id;
            foreach ($logs as $log) {
                $properties = $log->properties;
                if ($properties['campaign_id'] == $campaign_id) {
                    $campaign->created_by = $properties['user_id'];
                    $user = User::find((string)$properties['user_id']);
                    if ($user) {
                        $campaign->created_email = $user->email;
                    }
                    $campaign->timestamps = false;
                    $campaign->save();
                }
            };
        };

        $this->info('Created By and Created Email was updated in all campaings!');
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
