<?php

namespace Stensul\Services\Api\ExactTargetConnection;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use ET_Client;
use ET_GET;
use ET_DataExtension;
use ET_DataExtension_Row;
use ET_DataExtension_Column;

class ExactTargetConnector
{

    /**
     * client id
     * @var string
     */
    protected $clientId;

    /**
     * client secret
     * @var array
     */
    protected $clientSecret;

    /**
     * base uri
     * @var array
     */
    protected $getTokenUri;

    /**
     * Guzzle Client
     * @var object
     */
    protected $client;

    /**
     * Fuel Client
     * @var object
     */
    protected $fuel;

    /**
     * Fuel DE Object
     * @var object
     */
    protected $fuelDe;

    /**
     * @param Client $client
     * @param ET_Client $fuel
     * @param ET_DataExtension_Row $fuelDe
     * @param ET_DataExtension_Column $fuelDeColumn
     * @param ET_DataExtension $fuelDext
     */
    public function __construct(
        Client $client,
        ET_DataExtension_Row $fuelDe,
        ET_DataExtension_Column $fuelDeColumn,
        ET_DataExtension $fuelDext
    ) {
        $this->config = \Config::get("api.exact_target.credentials", []);
        $this->getTokenUri = $this->config["authPath"];
        $this->client = $client;
        $this->fuelDeColumn = $fuelDeColumn;
        $this->fuelDe = $fuelDe;
        $this->fuelDext = $fuelDext;
        $this->clientId = $this->config['clientid'];
        $this->clientSecret = $this->config['clientsecret'];
        $this->fuel = new \ET_Client(false, false, $this->config);
        $this->accessToken = $this->getToken($this->clientId, $this->clientSecret, $this->getTokenUri);
    }

    /**
     * Get Token
     *
     * reaches out to Exact Target Rest API with client secret and Id
     * returns the auth token
     *
     * Client is the guzzle object and all the methods you need
     *
     * @param $clientId
     * @param $clientSecret
     * @param $getTokenUri
     * @param Client $client
     * @return array
     */
    public function getToken($clientId, $clientSecret, $getTokenUri)
    {
        $params = [
            'clientId' => $clientId,
            'clientSecret' => $clientSecret
        ];
        $params = json_encode($params);
        $headers = [
            'Content-Type' => 'application/json',
            'Accept'       => 'application/json'
        ];
        $post = $this->client->post($getTokenUri, ['body' => $params, 'headers' => $headers]);
        $response = json_decode($post->getBody());
        return compact('response');
    }

    /**
     * Delete Row
     *
     * uses the Fuel SDK to delete a row by Primary Key
     * currently the v1 of the REST api does not support retrieval of data.
     * Hopefully this will change in the near future
     *
     * @param $deName
     * @param $props
     * @return array -- the response from Exact Target
     */
    public function deleteRow($deName, $props)
    {
        $this->fuelDe->authStub = $this->fuel;
        $this->fuelDe->props = $props;
        $this->fuelDe->CustomerKey = $deName;
        $getRes = $this->fuelDe->delete();
        if ($getRes->status == true) {
            return $getRes->message;
        }
        return print 'Message: '.$getRes->message."\n";
    }

    /**
     * Get Rows
     *
     * uses the Fuel SDK to grab all the rows of a given Data Extension
     * currently the v1 of the REST api does not support retrieval of data.
     * Hopefully this will change in the near future
     *
     *
     * @param $keyName
     *  This is an optional param if set along with primaryKey the result will be filtered to a single row by PrimaryKey
     * @param $primaryKey
     *  This is an optional param if set along with keyName the result will be filtered to a single row by PrimaryKey
     * @param $deName
     *  Required -- Name of the Data Extension to query
     * @return array
     *  Response from ET
     */
    public function getRows($deName, $keyName = '', $primaryKey = '')
    {
        $deColumns = $this->getDeColumns($deName);
        $this->fuelDe->authStub = $this->fuel;
        $this->fuelDe->Name = $deName;

        foreach ($deColumns as $value) {
            $this->fuelDe->props[] = $value->Name;
        }

        if ($primaryKey !== '' && $keyName !== '') {
            $this->fuelDe->filter = array('Property' => $keyName,'SimpleOperator' => 'equals','Value' => $primaryKey);
        }

        $getRes = $this->fuelDe->get();
        if ($getRes->status == true) {
            return $getRes;
        }
        return print 'Message: '.$getRes->message."\n";
    }

    /**
     * Create Row
     *
     * Create a Data extension by passing an array of DE Name keys => Column props values.
     *
     * @param $deStructures
     * @return array (response)
     */
    public function createRow($deName, $props)
    {
        $this->fuelDe->authStub = $this->fuel;
        $this->fuelDe->Name = $deName;
        $this->fuelDe->props = $props;
        $getRes = $this->fuelDe->post();
        if ($getRes->status == true) {
            return compact('getRes');
        }
        return print 'Message: '.$getRes->message."\n";
    }

    /**
     * Get Folders
     *
     * List folders
     *
     * @return array (response)
     */
    public function getFolders()
    {
        $objectType = "DataFolder";
        $sendProps = array(
            'ID',
            'Name',
        );
        $sendFilter = null;
        $getResponse = new ET_Get($this->fuel, $objectType, $sendProps, $sendFilter);
        $view_data = $getResponse->results;
        return $view_data;
    }

    /**
     * Create Email
     *
     * create a new email
     *
     * @param $campaign ($campaign data model)
     * @param $request ($request params)
     *
     * @return array (response)
     */
    public function createEmail($campaign, $request)
    {
        $email = new \ET_Email();
        $email->authStub = $this->fuel;
        $email->props = array(
            'CustomerKey'=> $campaign->id,
            'Name'=>(isset($request['campaign_name']))? $request['campaign_name'] : $campaign->campaign_name,
            'HTMLBody' => $campaign->body_html,
            'TextBody' => $campaign->plain_text,
            'CharacterSet' => 'UTF-8',
            'IsHTMLPaste' => true,
            'Status' => 'new',
            'EmailType' => 'HTML',
            'PreHeader' => (isset($request['preheader']))? $request['preheader'] : '',
            'Subject' => (isset($request['subject']))? $request['subject'] : 'Stensul - '.$campaign->campaign_name,
        );

        $folder_id = \Config::get("api.exact_target.folder_id", '');

        if (is_int($folder_id)) {
            $email->props = array_merge($email->props, array("CategoryID" => $folder_id));
        }

        $getRes = $email->post();

        if ($getRes->status == true) {
            return $getRes;
        } else {
            Log::error('Error creating ET email(createEmail). Message: ', [$getRes]);
            return $getRes;
        }
    }

    /**
     * Retrieve Emails
     *
     * retrieve the emails all or by name
     *
     * @param $name (CustomerKey)
     * @param $request ($request params)
     *
     * @return array (response)
     */
    public function retrieveEmails($name = null)
    {
        $email = new \ET_Email();
        $email->authStub = $this->fuel;
        if ($name) {
            $email->filter = array(
                'Property' => 'CustomerKey',
                'SimpleOperator' => 'equals',
                'Value' => $name
            );
        }
        $getRes = $email->get();
        if ($getRes->status == true) {
            return $getRes;
        } else {
            Log::error('Error retrieving ET email(retrieveEmails). Message: ' . $getRes->message);
            return $getRes;
        }
    }

    /**
     * Update Email
     *
     * update an email
     *
     * @param $id (ID)
     * @param $campaign ($campaign data model)
     * @param $request ($request params)
     *
     * @return array (response)
     */
    public function updateEmail($id, $campaign, $request)
    {
        $email = new \ET_Email();
        $email->authStub = $this->fuel;
        $email->props = array(
            'ID'=> $id,
            'Name'=>(isset($request['campaign_name']))? $request['campaign_name'] : $campaign->campaign_name,
            'HTMLBody' => $campaign->body_html,
            'TextBody' => $campaign->plain_text,
            'PreHeader' => (isset($request['preheader']))? $request['preheader'] : '',
            'Subject' => (isset($request['subject']))? $request['subject'] : '',
        );

        if (isset($request['preheader']) && $request['preheader'] != '') {
            array_merge($email->props, ['PreHeader' => $request['preheader']]);
        }

        if (isset($request['subject']) && $request['subject'] != '') {
            array_merge($email->props, ['Subject' => $request['subject']]);
        }

        $getRes = $email->patch();
        if ($getRes->status == true) {
            return $getRes;
        } else {
            Log::error('Error updating ET email(retrieveEmails). Message: ' . $getRes->message);
            return false;
        }
    }

    /**
     * Delete Emails
     *
     * update an email
     *
     * @return array (response)
     */
    public function deleteEmails($id)
    {
        $email = new \ET_Email();
        $email->authStub = $this->fuel;
        $email->props = array(
            'ID'=> $id
        );
        $getRes = $email->delete();
        if ($getRes->status == true) {
            return $getRes;
        } else {
            Log::error('Error retrieving ET email(retrieveEmails). Message: ' . $getRes->message);
            return false;
        }
    }
}
