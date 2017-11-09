<?php

namespace Stensul\Services;

use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Models\Campaign as ModelCampaign;
use Stensul\Models\Library;
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
     * @param array  $params
     *
     * @return array Response
     */
    public static function sendPreview($campaign_id, $email, $params = [])
    {
        if (!strlen($email)) {
            return ['error' => 'invalid emails'];
        }

        $response = [];

        $email_send_limit = 10;

        $email_array = Helper::parseEmails($email);

        if (!count($email_array)) {
            return ['error' => 'invalid emails'];
        }

        $campaign_data = ModelCampaign::findOrFail($campaign_id);

        $subject = !empty($params['subject']) ? $params['subject'] : env('MAIL_PREVIEW_SUBJECT', 'Preview email!');

        $preheader = $params['preheader'] ?? false;

        $library = Library::find($campaign_data->library);

        for ($i = 0; $i < count($email_array); ++$i) {
            if ($i <= $email_send_limit) {
                $params = array(
                    'params' => array(
                        'title' => $campaign_data->campaign_name,
                        'body_html' => $campaign_data->body_html,
                        'campaign_data' => $campaign_data,
                        'preheader_preview' => $preheader,
                        'library_config' => $library->config,
                    ),
                    'email' => trim($email_array[ $i ]),
                    'subject' => $subject
                );

                $email_layout = Helper::validateView('layouts.email');

                Mail::send(
                    $email_layout,
                    $params,
                    function ($message) use ($params) {
                        $message->from(
                            env('MAIL_FROM_ADDRESS', 'preview@stensul.com'),
                            env('MAIL_FROM_ADDRESS_NAME', 'Preview email')
                        )
                            ->to($params['email'])
                            ->subject($params['subject']);
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

        $email_layout = Helper::validateView('emails.preview');

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

    /**
     * Send a proof notification email to one reviewer.
     *
     * @param  array $reviewer
     * @param  array $data
     * @return array Response
     */
    public static function sendReviewerEmail($reviewer, $data)
    {
        if (!isset($reviewer['email'])) {
            return ['error' => 'invalid email'];
        }

        switch ($data['type']) {
            case 'new_proof':
                $email_layout = Helper::validateView('emails.proof.new_proof');
                $subject = sprintf('Review Request: %s, from %s', $data['campaign_name'], $data['requestor']);
                $data['notification_message'] =
                    isset($reviewer['notification_message']) ? $reviewer['notification_message'] : '';
                break;
            case 'deleted_proof':
                $email_layout = Helper::validateView('emails.proof.deleted_proof');
                $subject = sprintf(
                    'The email "%s" has been deleted, and your feedback is no longer needed.',
                    $data['campaign_name']
                );
                break;
        }

        $params = [
            'params' => $data,
            'email' => $reviewer['email'],
            'reviewer_name' => User::find($reviewer['user_id'])->name,
            'from_name' => \Config::get('proof.email.from_name'),
            'from_email' => \Config::get('proof.email.from_email'),
            'subject' => $subject
        ];

        Mail::send(
            $email_layout,
            $params,
            function ($message) use ($params) {
                $message->from(
                    $params['from_email'],
                    $params['from_name']
                )
                    ->to($params['email'])
                    ->subject($params['subject']);
            }
        );

        if (count(Mail::failures()) > 0) {
            \Log::error(sprintf(
                "Failed to send email (%s) to a reviewer %s. [proof %s]",
                $data['type'],
                $reviewer['email'],
                $data['proof_id']
            ));
            return false;
        }

        Activity::log('Email sent to reviewer', [
            'properties' => [
                'proof_id' => new ObjectId($data['proof_id']),
                'email' => $reviewer['email'],
                'type' => $data['type']
            ]
        ]);

        return true;
    }
}
