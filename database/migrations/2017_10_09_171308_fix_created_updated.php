<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Log;
use Stensul\Models\User;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log as Logging;

class FixCreatedUpdated extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::connection()->disableQueryLog();

        Campaign::withTrashed()->chunk(100, function ($campaigns) {

            foreach ($campaigns as $campaign) {
                if (!is_array($campaign->created_by)) {
                    $log = Log::where('properties.campaign_id', new ObjectID($campaign->id))
                        ->where('description', 'Campaign created')
                        ->take(1)
                        ->first();

                    if ($log) {
                        Logging::info('Updating created_by, campaign id ' . $campaign->id);
                        $campaign->created_by = [
                            'id' => $log->properties['user_id'],
                            'email' => $this->getEmail($log->properties['user_id'])
                        ];
                    }
                }

                if (!is_array($campaign->updated_by)) {
                    $log = Log::where('properties.campaign_id', new ObjectID($campaign->id))
                        ->where('description', 'Campaign updated')
                        ->orderBy('created_at', 'DESC')
                        ->take(1)
                        ->first();

                    if ($log) {
                        Logging::info('Updating updated_by, campaign id ' . $campaign->id);
                        $campaign->updated_by = [
                            'id' => $log->properties['user_id'],
                            'email' => $this->getEmail($log->properties['user_id'])
                        ];
                    }
                }

                if (!empty($campaign->user_id) && !empty($campaign->user_email) && empty($campaign->created_by)) {
                    Logging::info('Updating created_by, campaign id ' . $campaign->id);
                    $campaign->created_by = [
                        'id' => $campaign->user_id,
                        'email' => $campaign->user_email
                    ];
                }

                if (!empty($campaign->deleted_at) && empty($campaign->deleted_by)) {
                    $log = Log::where('properties.campaign_id', new ObjectID($campaign->id))
                    ->where('description', 'Campaign deleted')
                    ->orderBy('created_at', 'DESC')
                    ->take(1)
                    ->first();

                    if ($log) {
                        Logging::info('Updating delete_by, campaign id ' . $campaign->id);
                        $campaign->deleted_by = [
                            'id' => $log->properties['user_id'],
                            'email' => $this->getEmail($log->properties['user_id'])
                        ];
                    }
                }

                $campaign->drop(['user_id', 'user_email', 'created_email']);
                $campaign->save();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }

    /***
     * Get email by user id, cache resuls for 5 minutes.
     *
     * @param string $user_id
     * @return string Email
     */
    private function getEmail($user_id)
    {

        $key = 'mail_cache_' . $user_id;

        return Cache::get($key, function () use ($user_id, $key) {

            if ($user = User::find($user_id)) {
                Cache::put($key, $user->email, 5);
                return $user->email;
            }
            return false;
        });
    }
}
