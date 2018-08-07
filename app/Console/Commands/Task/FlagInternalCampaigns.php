<?php
namespace Stensul\Console\Commands\Task;

use Illuminate\Console\Command;
use Stensul\Models\Campaign;
use Stensul\Models\User;

class FlagInternalCampaigns extends Command
{
    protected $signature = 'task:flag-internal-campaigns';

    protected $description = 'Flag all campaigns created by a user with the role stensul-internal as "internal" '
        . 'this way they can be filtered on the dashboard.';

    public function handle()
    {
        $users = User::where('roles', env('INTERNAL_ROLE', 'stensul-internal'))->get()->toArray();
        $user_emails = array_column($users, 'email');

        // Make it faster by disabling query log.
        \DB::connection()->disableQueryLog();
        Campaign::withTrashed()->chunk(100, function ($campaigns) use ($user_emails) {

            foreach ($campaigns as $campaign) {
                $campaign->timestamps = false;
                $campaign->internal = false;
                if (in_array($campaign->created_by['email'], $user_emails)) {
                    $campaign->internal = true;
                }
                $this->info(sprintf(
                    'Updating campaign, id: %s, flag as internal: %s',
                    $campaign->id,
                    ($campaign->internal ? 'true' : 'false')
                ));
                $campaign->save();
            }
        });

        $this->info('Campaigns Updated');
    }
}
