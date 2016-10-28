<?php

namespace Stensul\Services;

use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Models\Campaign as ModelCampaign;
use Stensul\Models\User;
use Activity;
use Campaign;
use Helper;
use Mail;
use Auth;

class EmailSender
{

    /**
     * Send campaign email.
     *
     * @param string $campaign_id
     * @param string $email       Comma separated
     *
     * @return array Response
     */
    public static function sendPreview($campaign_id, $email)
    {
        if (!strlen($email)) {
            return ['error' => 'invalid emails'];
        }

        $response = [];

        $email_send_limit = 10;

        $email_array = Helper::parseEmails($email);

        $campaign_data = ModelCampaign::findOrFail($campaign_id);

        for ($i = 0; $i < count($email_array); ++$i) {
            if ($i <= $email_send_limit) {
                $params = array(
                    'params' => array(
                        'title' => $campaign_data->campaign_name,
                        'body_html' => $campaign_data->body_html,
                        'campaign_data' => $campaign_data
                    ),
                    'email' => trim($email_array[ $i ])
                );

                $email_layout = Helper::validateView('base.layouts.email');

                Mail::send(
                    $email_layout,
                    $params,
                    function ($message) use ($params) {
                        $message->from(
                            env('MAIL_FROM_ADDRESS', 'preview@stensul.com'),
                            env('MAIL_FROM_ADDRESS_NAME', 'Preview email')
                        )
                            ->to($params['email'])
                            ->subject(env('MAIL_PREVIEW_SUBJECT', 'Preview email!'));
                    }
                );

                Activity::log(
                    'Campaign email send try',
                    array('properties' => ['campaign_id' => new ObjectID($campaign_id),
                    'email' => $email])
                );

                $response['processed'][] = $email_array[$i];
            }
        }

        return $response;
    }

    /**
     * Send campaign email as attached files.
     *
     * @param string  $campaign_id
     * @param string  $email             Comma separated
     * @param boolean $send_text_version
     *
     * @return array Response
     */
    public static function sendPreviewAsAttachment($campaign_id, $email, $send_text_version = false)
    {
        if (!strlen($email)) {
            return ['error' => 'invalid emails'];
        }

        $response = [];

        $email_send_limit = 10;

        $email_array = Helper::parseEmails($email);

        $campaign_data = ModelCampaign::findOrFail($campaign_id);

        $html_email = Campaign::html($campaign_id);

        $plain_text_email = $send_text_version ? Campaign::text($campaign_id) : null;

        $subject = "FINISHED CAMPAIGN (" . date("m/d/y h:i") . " EST): [" . $campaign_data->campaign_name . "]";

        $published_at = date("m/d/y h:i", strtotime($campaign_data->published_at));

        $email_layout = Helper::validateView('base.emails.preview');

        for ($i = 0; $i < count($email_array); ++$i) {
            if ($i <= $email_send_limit) {
                $params = array(
                    'html_email' => $html_email,
                    'plain_text_email' => $plain_text_email,
                    'email' => trim($email_array[ $i ]),
                    'subject' => $subject,
                    'user' => Auth::user(),
                    'campaign_name' => $campaign_data->campaign_name,
                    'published_at' => $published_at
                );

                Mail::send(
                    $email_layout,
                    $params,
                    function ($message) use ($params) {
                        $message->from(
                            env('MAIL_FROM_ADDRESS', 'preview@stensul.com'),
                            env('MAIL_FROM_ADDRESS_NAME', 'Preview email')
                        )
                            ->to($params['email'])
                            ->subject(env('MAIL_PREVIEW_SUBJECT', $params['subject']));

                        $message->attachData(
                            $params['html_email'],
                            env('PREVIEW_HTML_FILE_NAME', 'preview_email') . "_" . date("m_d_y") . ".html",
                            []
                        );

                        if ($params['plain_text_email']) {
                            $message->attachData(
                                $params['plain_text_email'],
                                env('PREVIEW_TEXT_FILE_NAME', 'preview_email') . "_" . date("m_d_y") . ".txt",
                                []
                            );
                        }
                    }
                );

                Activity::log(
                    'Campaign email send try',
                    array('properties' => ['campaign_id' => new ObjectID($campaign_id),
                    'email' => $email])
                );

                $response['processed'][] = $email_array[$i];
            }
        }

        return $response;
    }
}
