<?php
namespace Stensul\Http\Controllers;

use Activity;
use Auth;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Illuminate\Http\Request;

class MetricController extends Controller
{
    /**
     * Update the time spent in the campaign edition.
     *
     * @param \Illuminate\Http\Request $request
     * @throws Symfony\Component\HttpKernel\Exception\BadRequestHttpException
     */
    public function postSpentTime(Request $request)
    {
        $campaign_id = $request->input('campaign_id');
        if (!$campaign_id) {
            throw new BadRequestHttpException('Missing Param "campaign_id"');
        }
        $time = $request->input('time');
        if (!$time) {
            throw new BadRequestHttpException('Missing Param "time"');
        }
        $user_id = Auth::id();
        return Activity::logCampaignSpentTime($campaign_id, $user_id, $time);
    }
}
