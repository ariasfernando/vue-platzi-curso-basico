<?php
namespace Stensul\Services\Api\StrongviewConnection;

use Log;
use Stensul\Models\Upload;

class StrongviewConnector
{

    protected $endpoint;
    protected $organization;
    protected $sub_organization;
    protected $username;
    protected $password;
    protected $session_id;
    protected $connection;
    protected $client;

    /**
     * defines if the peer can use a self signed certificate
     * or not.
     * @var boolean
     */
    protected $self_signed_cert;


    /**
     * Constructor for StrongviewConnection class.
     *
     * @param string $endpoint the URL to connect to when calling API
     * @param string $organization the organization to authenticate with when logging in
     * @param string $username the username to authenticate with when logging in
     * @param string $password the password to authenticate with when logging in
     *
     * @return object a new StrongviewConnection object instance
     *
     */
    public function __construct(
        $endpoint,
        $organization,
        $username,
        $password,
        $sub_organization = 1,
        $self_signed_cert = false
    ) {
    
        $this->endpoint = $endpoint;
        $this->organization = $organization;
        $this->sub_organization = $sub_organization;
        $this->username = $username;
        $this->password = $password;
        $this->self_signed_cert = $self_signed_cert;

        $params = [
            'encoding' => 'UTF-8',
            'trace' => true,
            'exceptions' => true,
            'connection_timeout' => 180
        ];

        // set some SSL/TLS specific options
        if ($this->self_signed_cert == true) {
            $stream_context = stream_context_create([
              'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
              ]
            ]);

            $params += ['stream_context' => $stream_context];
        }
        

        $this->client =  new \SoapClient($this->endpoint, $params);

        $this->login();
    }

    /**
     * Create a login request and retrieve a session id.
     *
     */
    protected function login()
    {

        $passwordTextType = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText";
        $securityNamespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd";
        $securityHeaderElementName = "Security";
        $securityHeaderMustUnderstand = true;
        $schema_v2 = "http://www.strongmail.com/services/v2/schema";
        $template = '<wsse:Security xmlns:wsse="%s" SOAP-ENV:mustUnderstand="1">
                        <wsse:UsernameToken xmlns:wsse="%s">
                          <wsse:Username xmlns:wsse="%s">%s</wsse:Username>
                          <wsse:Password xmlns:wsse="%s" Type="%s">%s</wsse:Password>
                        </wsse:UsernameToken>
                        <OrganizationToken xmlns="%s">
                          <organizationName>%s</organizationName>
                          <subOrganizationId>>
                            <id>%d</id>
                          </subOrganizationId>>
                        </OrganizationToken>
                      </wsse:Security>';


        $securityHeaderText = sprintf(
            $template,
            $securityNamespace,
            $securityNamespace,
            $securityNamespace,
            $this->username,
            $securityNamespace,
            $passwordTextType,
            $this->password,
            $schema_v2,
            $this->organization,
            $this->sub_organization
        );

        $securityHeaderSoapVar = new \SoapVar($securityHeaderText, \XSD_ANYXML, null, null, null);
        $securityHeader = new \SoapHeader(
            $securityNamespace,
            $securityHeaderElementName,
            $securityHeaderSoapVar,
            $securityHeaderMustUnderstand
        );

        $this->client->__setSoapHeaders($securityHeader);
    }

    /**
     * Send email template to Strongview.
     *
     * @param object $campaign the campaign model
     * @param object $request the request object
     *
     * @return mixed  array: id and name of created email, errors
     *
     */
    public function saveMailing($campaign = null, $request = null)
    {
        if (!is_null($campaign)) {
            $original_filename = (is_null($request) || !isset($request['filename']))
                ? $campaign->campaign_name : $request['filename'];
            $filename = Upload::versioningFilename($original_filename);
            $subject = (is_null($request) || !isset($request['subject'])) ? $filename : $request['subject'];
            $header = (is_null($request) || !isset($request['header'])) ? $filename : $request['header'];
            $content = "<![CDATA[$campaign->body_html]]>";
            $template = '<create xmlns="http://www.strongmail.com/services/v2/schema">
                        <baseObject xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Template">
                            <description>Stensul</description>
                            <bodyEncoding>BASE_64</bodyEncoding>
                            <headerEncoding>EIGHT_BIT</headerEncoding>
                            <isApproved>true</isApproved>
                            <messagePart>
                                <content>'. $content .'</content>
                                <format>HTML</format>
                                <isXsl>false</isXsl>
                            </messagePart>
                            <outputBodyCharSet>ASCII</outputBodyCharSet>
                            <outputHeaderCharSet>UTF-8</outputHeaderCharSet>
                            <name>'. $filename .'</name>
                            <fromName></fromName>
                            <header>'. $header .'</header>
                            <subject>'. $subject .'</subject>
                            <openTracking>false</openTracking>
                        </baseObject>
                    </create>';


            try {
                $test_vars = new \SoapVar($template, \XSD_ANYXML, null, null, null);

                $response = $this->client->__call('create', [$test_vars]);
                Log::info('Strongview api function _create_ response message: ', [$response]);

                if ($response->success != true) {
                    throw new \SoapFault($response->fault->faultCode, $response->fault->faultMessage);
                }
            } catch (\SoapFault $e) {
                Log::error('Strongview api error message: ', [$e]);
                throw $e;
            }

            return true;
        }
        return false;
    }
}
