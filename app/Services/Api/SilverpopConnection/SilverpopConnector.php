<?php
namespace Stensul\Services\Api\SilverpopConnection;

use Illuminate\Support\Facades\Log;
use Stensul\Models\Upload;
use GuzzleHttp\Client as Client;

class SilverpopConnector
{

    protected $endpoint;
    protected $username;
    protected $password;
    protected $session_id;
    protected $connection;
    protected $config;
    protected $client;
    protected $library_name;

    /**
     * Constructor for SilverpopConnection class.
     *
     * @param string $endpoint the URL to connect to when calling API
     * @param string $username the username to authenticate with when logging in
     * @param string $password the password to authenticate with when logging in
     *
     * @return object a new SilverpopConnection object instance
     *
     */
    public function __construct($endpoint, $username, $password, $library_name = null)
    {
        $this->endpoint = $endpoint;
        $this->username = $username;
        $this->password = $password;
        $this->config = \Config::get('api.silverpop');
        if ($library_name && !empty($this->config['libraries'][$library_name])) {
            $this->config['folder_path'] = $this->config['libraries'][$library_name]['folder_path'];
        }
        $this->client = new Client();
        $this->login();
    }
    /**
     * Public wrapper for making an API call to the Silverpop XMLAPI endpoint.
     *
     * @param string $xml the name of the API function to execute
     *
     * @return mixed  string: XML response from the Silverpop endpoint, FALSE: failure to connect
     *
     */
    public function call($xml)
    {
        $url = ($this->session_id) ? $this->endpoint . ';jsessionid=' . $this->session_id : $this->endpoint;
        return $this->getXMLResponse($url, utf8_encode($xml));
    }
    /**
     * Send processed XML via curl to Silverpop XMLAPI.
     *
     * @param string $url the url of the API
     * @param string $xml the name of the API function to execute
     *
     * @return mixed  string: XML response from the Silverpop endpoint, FALSE: failure to connect
     *
     */
    protected function getXMLResponse($url, $xml)
    {
        $client = $this->client;

        $options = [
            'headers' => [
              'Content-Type' => 'text/xml;charset=UTF-8',
              'Content-Length' => strlen($xml),
            ],
            'body' => $xml,
            'connect_timeout' => 60
        ];

        try {
            $response = $client->request("POST", $url, $options);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $error = [
                'status' => 'error_request',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ClientErrorResponseException $e) {
            $error = [
                'status' => 'error_client',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ServerErrorResponseException $e) {
            $error = [
                'status' => 'error_server',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            $error = [
                'status' => 'error_response',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\GuzzleHttp\Exception\ConnectException $e) {
            $error = [
                'status' => 'error_connect',
                'code' => $e->getResponse()->getStatusCode(),
                'data' => json_decode($e->getResponse()->getBody()->getContents(), true)
            ];
        } catch (\Exception $e) {
            $error = [
                'status' => 'error',
                'code' => $e->getCode(),
                'data' => [
                    'reason' => $e->getMessage()
                ]
            ];
        }

        if (isset($error)) {
            $error_message = (isset($error['data']['error_description']))
                ? $error['data']['error_description'] : $error['status'];
            Activity::log('Error Eloqua ['.$error['status'].']', array('properties' => ['message' => $error_message]));
            throw new \Exception($error_message);
        } else {
            return $response->getBody()->getContents();
        }
    }
    /**
     * Create a login request and retrieve a session id.
     *
     * ID is stored in $this->session_id for use by all subsequent requests.
     */
    protected function login()
    {
        $login_response = $this->call('
          <Envelope>
            <Body>
              <Login>
                <USERNAME>' . $this->username . '</USERNAME>
                <PASSWORD>' . $this->password . '</PASSWORD>
              </Login>
            </Body>
          </Envelope>
        ');

        if (!$login_response) {
            throw new \Exception('Could not find the Silverpop XMLAPI at the address "' . $this->endpoint . '".');
        }

        $xml = new \DOMDocument();
        $xml->loadXML($login_response);
        $fault_tags = $xml->getElementsByTagName('FaultString');
        $fault_codes = $xml->getElementsByTagName('errorid');
        $id_tag = $xml->getElementsByTagName('SESSIONID');

        if ($fault_tags->length > 0) {
            $message = $fault_tags->item(0)->nodeValue;
            $code = $fault_codes->item(0)->nodeValue;
            $error_msg = 'Could not connect to the Silverpop XMLAPI. Silverpop says: "' . $message . '"';
            Log::error('Silverpop api error message: ', [$error_msg]);
            throw new \Exception($error_msg, $code);
        } elseif ($id_tag->length == 0) {
            $error_msg = 'Could not find the Silverpop XMLAPI at the address "' . $this->endpoint . '"';
            Log::error('Silverpop api error message: ', [$error_msg]);
            throw new \Exception($error_msg);
        } else {
            $this->session_id = $id_tag->item(0)->nodeValue;
        }
    }
    /**
     * Send a logout request to Silverpop API.
     */
    protected function logout()
    {
        $this->call('<Envelope><Body></Logout></Body></Envelope>');
    }
    /**
     * Send email template to Silverpop XMLAPI.
     *
     * @param object $campaign the campaign model
     * @param object $request the request object
     *
     * @return mixed  array: id and name of created email, errors
     *
     */
    public function saveMailing($campaign = null, $request = null)
    {
        $original_filename = (is_null($request) || !isset($request['filename']))
            ? $campaign->campaign_name : $request['filename'];
        $filename = Upload::versioningFilename($original_filename);
        $subject = (is_null($request) || !isset($request['subject']))? $filename : $request['subject'];
        $folder_path = $this->config['folder_path'];
        $save = $this->call(
            "<Envelope>
                    <Body>
                        <SaveMailing>
                            <Header>
                                <MailingName><![CDATA[$filename]]></MailingName>
                                <Visibility>1</Visibility>
                                <Subject>$subject</Subject>
                                <FolderPath>$folder_path</FolderPath>
                                <TrackingLevel>1</TrackingLevel>
                                <Encoding>6</Encoding>
                                <Subject><![CDATA[$subject]]></Subject>
                                <ListID>$campaign->id</ListID>
                            </Header>
                            <MessageBodies>
                                <HTMLBody><![CDATA[$campaign->body_html]]></HTMLBody>
                                <TextBody><![CDATA[$campaign->plain_text]]></TextBody>
                            </MessageBodies>
                            <ForwardToFriend>
                                <ForwardType>0</ForwardType>
                            </ForwardToFriend>
                        </SaveMailing>
                    </Body>
                </Envelope>"
        );

        if (!$save) {
            $error_msg = 'Could not find the Silverpop XMLAPI at the address "' . $this->endpoint . '"';
            Log::error('Silverpop api error message: ', [$error_msg]);
            return [ 'error' => $error_msg ];
        } else {
            $xml = new \DOMDocument();
            $xml->loadXML($save);
            $fault_tags = $xml->getElementsByTagName('FaultString');

            if ($fault_tags->length > 0) {
                $message = $fault_tags->item(0)->nodeValue;
                $error_msg = 'Could not connect to the Silverpop XMLAPI. Silverpop says: "' . $message . '"';
                Log::error('Silverpop api error message: ', [$error_msg]);
                return [ 'error' => $error_msg ];
            } else {
                return [
                    "email_id" => $xml->getElementsByTagName('MailingID')->item(0)->nodeValue,
                    "filename" => $filename
                ];
            }
        }
    }
}
