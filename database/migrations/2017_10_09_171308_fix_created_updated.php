<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Campaign;
use Stensul\Models\Log;
use Stensul\Models\User;
use MongoDB\BSON\ObjectID as ObjectID;
use Illuminate\Support\Facades\Cache;

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
                $created_found = false;

                $logs = Log::where('properties.campaign_id', new ObjectID($campaign->id))
                    ->where('description', 'Campaign created')
                    ->take(1)
                    ->get();

                foreach ($logs as $log) {

                    $campaign->created_by = [
                        'id' => $log->properties['user_id'],
                        'email' => $this->getEmail($log->properties['user_id'])
                    ];
                    $created_found = true;
                }

                $logs = Log::where('properties.campaign_id', new ObjectID($campaign->id))
                    ->where('description', 'Campaign updated')
                    ->orderBy('created_at', 'DESC')
                    ->take(1)
                    ->get();

                foreach ($logs as $log) {

                    $campaign->updated_by = [
                        'id' => $log->properties['user_id'],
                        'email' => $this->getEmail($log->properties['user_id'])
                    ];
                }

                if (!empty($campaign->user_id) && !empty($campaign->user_email)) {
                    if (!$created_found) {
                        $campaign->created_by = [
                            'id' => $campaign->user_id,
                            'email' => $campaign->user_email
                        ];
                    }
                }

                if (!empty($campaign->deleted_at)) {

                    $campaign->drop('deleted_by');
                    $campaign->deleted_by = [
                        'id' => $this->getUserId($campaign->deleted_by),
                        'email' => $campaign->deleted_by
                    ];

                }

                $campaign->drop(['user_id', 'user_email']);

                $campaign->save();
            }
        });

        // @todo temporary, prevent migration from succeeding.
        throw new Exception;
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

    /***
     * Get email by user id, cache resuls for 5 minutes.
     *
     * @param string $email
     * @return string user_id
     */
    private function getUserId($email)
    {
        
        $key = 'user_cache_' . $email;

        return Cache::get($key, function () use ($email, $key) {

            if ($user = User::where('email', $email)->first()) {
                Cache::put($key, $user->id, 5);
                return $user->id;
            }
            return false;
        });
    }
}
