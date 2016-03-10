<?php
namespace Stensul\Services\Api\SilverpopConnection;

use Illuminate\Support\Facades\Log;
use Stensul\Models\Upload;

class SilverpopConnector
{

    protected $endpoint;
    protected $username;
    protected $password;
    protected $sessionID;
    public $sessionLog = array();
    public $faultLog = array();
    public $logTransactions = false;
    public $logFaults = false;
    protected $callStack;
    protected $connection;
    protected $config;

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
    public function __construct($endpoint, $username, $password)
    {
        $this->endpoint = $endpoint;
        $this->username = $username;
        $this->password = $password;
        $this->login();
        $this->config = \Config::get("api.silverpop");
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
        $url = ($this->sessionID) ? $this->endpoint . ';jsessionid=' . $this->sessionID : $this->endpoint;
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
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLINFO_HEADER_OUT, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($ch, CURLOPT_TIMEOUT, 180);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: text/xml;charset=UTF-8',
            'Content-Length: ' . strlen($xml),
        ));

        $call_time = microtime(true);
        $response = curl_exec($ch);
        $response_time = microtime(true);

        if ($this->logTransactions) {
            $this->sessionLog[] = array(
                'call_time' => date('Y/m/d [g:i:sa]', $call_time),
                'executed_in' => ($response_time - $call_time) . ' seconds',
                'call_xml' => $xml,
                'response_xml' => $response,
            );
        }

        if ($this->logFaults) {
            $xml = new \DOMDocument();
            $xml->loadXML($response);
            $fault_tags = $xml->getElementsByTagName('FaultString');
            for ($i = 0; $i < $fault_tags->length; $i++) {
                $this->faultLog[] = $fault_tags->item($i)->nodeValue;
            }
        }
        if ($response) {
            curl_close($ch);
        }
        return $response;
    }
    /**
     * Create a login request and retrieve a session id.
     *
     * ID is stored in $this->sessionID for use by all subsequent requests.
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
        // Received a fault response from Silverpop.
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
            $this->sessionID = $id_tag->item(0)->nodeValue;
        }
    }
    /**
     * Send a logout request to Silverpop API.
     */
    protected function logout()
    {
        $logout_response = $this->call('<Envelope><Body></Logout></Body></Envelope>');
    }

    /**
     * Disables logging of API calls.
     */
    public function enableLogging()
    {
        $this->logTransactions = true;
        $this->logFaults = true;
    }
    /**
     * Return the session log from the connection.
     */
    public function getSessionLog()
    {
        return $this->sessionLog;
    }
    /**
     * Return the fault log from the connection.
     */
    public function getFaultLog()
    {
        return $this->faultLog;
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
        $original_filename = (is_null($request) || !isset($request['filename']))? $campaign->campaign_name : $request['filename'];
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
            $fault_codes = $xml->getElementsByTagName('errorid');

            if ($fault_tags->length > 0) {
                $message = $fault_tags->item(0)->nodeValue;
                $code = $fault_codes->item(0)->nodeValue;
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
