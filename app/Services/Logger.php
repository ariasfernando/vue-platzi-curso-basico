<?php

namespace Stensul\Services;

use Auth;
use App;
use Log as FileLog;
use MongoDB\BSON\ObjectID as ObjectID;
use MongoDB\BSON\UTCDateTime;

use LogModel as DBLog;

class Logger
{
    /**
     * Log on the db and on the filesystem.
     *
     * @param string $text
     * @param array  $data
     *
     * @return int db inserted id
     */
    public static function log($text = '', $params = array())
    {
        $response = false;

        try {
            $route = explode('@', last(explode('\\', \Route::currentRouteAction())));
            $user_agent = (isset($_SERVER['HTTP_USER_AGENT'])) ? $_SERVER['HTTP_USER_AGENT'] : 'not-found';
            $user_ip = (isset($_SERVER['REMOTE_ADDR'])) ? \Request::getClientIp(true) : 'not-found';
            $user_data = (Auth::check()) ? ['user_id' => new ObjectID(Auth::id())] : ['user_id' => 'not-found'];
            $properties = (isset($params['properties']) && is_array($params) && is_array($params['properties']))
                ? array_merge($user_data, $params['properties'])
                : $user_data;

            $log_params = [
                'description' => $text,
                'ip' => (isset($params['ip'])) ? $params['ip'] : $user_ip,
                'user_agent' => (isset($params['user_agent'])) ? $params['user_agent'] : $user_agent,
                'controller' => (isset($params['controller'])) ? $params['controller'] : head($route),
                'action' => (isset($params['action'])) ? $params['action'] : last($route),
                'properties' => $properties,
            ];

            $response = DBLog::create($log_params);
        } catch (\Exception $exception) {
            FileLog::error('Error Activity log '.$exception);
        }

        return $response;
    }

    public static function logCampaignSpentTime($campaign_id, $user_id, $time = 0)
    {
        $log = DBLog::where('description', 'Campaign Edit Spent Time')
            ->where('properties.campaign_id', new ObjectID($campaign_id))
            ->where('properties.user_id', new ObjectID($user_id))
            ->first();

        $ip = request()->ip() ? request()->ip() : 'NA';
        $user_agent =  request()->header('User-Agent') ? request()->header('User-Agent') :'NA';
        $params = [
            'description' => 'Campaign Edit Spent Time',
            'ip' => $ip,
            'user_agent' => $user_agent,
            'controller' => 'CampaignController',
            'action' => 'getEdit',
            'properties' => [
                'campaign_id' => new ObjectID($campaign_id),
                'user_id' => new ObjectID($user_id),
                'time' => ($log) ? $log->properties['time'] + $time : (int) $time,
            ]
        ];
        if (!$log) {
            return DbLog::create($params);
        }
        $log->update($params);
        return $log;
    }

    /**
     * Log campaign process time.
     *
     * @param string $campaign_id
     * @param string $user_id
     * @param string $stage start|finish
     * @param boolean $start Force start, used when editing a finished campaign.
     * @return void
     */
    public static function logCampaignProcessTime($campaign_id, $user_id = null, $start = false)
    {
        $log = DBLog::where('description', 'Campaign Process Spent Time')
            ->where('properties.campaign_id', new ObjectID($campaign_id))
            ->first();

        $date = new UTCDateTime();

        $params = [
            'description' => 'Campaign Process Spent Time',
            'ip' => 'NA',
            'user_agent' => 'NA',
            'controller' => '',
            'action' => '',
            'properties' => [
                'campaign_id' => new ObjectID($campaign_id),
                'user_id' => new ObjectID($user_id),
                'start' => $date,
                'finish' => null,
                'elapsed' => null
            ]
        ];

        if (!$log) {
            return DbLog::create($params);
        }

        $properties = $log->properties;

        if ($start) {
            $properties['start'] = $date;
            $properties['finish'] = null;
        } else {
            $properties['finish'] = $date;
            $properties['elapsed'] = ((int) $date->__toString() - (int) $log->properties['start']->__toString()) / 1000;
        }

        $log->properties = $properties;
        $log->save();

        return $log;
    }
}
