<?php
require "bootstrap.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    header("Allow: OPTIONS, GET, HEAD, POST");
    die();
}
// Validate Token
use \Firebase\JWT\JWT;

// Functions to get public keys
function loadKeysFromAzure($string_microsoftPublicKeyURL)
{
    $array_keys = array();

    $jsonString_microsoftPublicKeys = file_get_contents($string_microsoftPublicKeyURL);
    $array_microsoftPublicKeys = json_decode($jsonString_microsoftPublicKeys, true);

    foreach ($array_microsoftPublicKeys['keys'] as $array_publicKey) {
        $string_certText = "-----BEGIN CERTIFICATE-----\r\n" . chunk_split($array_publicKey['x5c'][0], 64) . "-----END CERTIFICATE-----\r\n";
        $array_keys[$array_publicKey['kid']] = getPublicKeyFromX5C($string_certText);
    }
    return $array_keys;
}

function getPublicKeyFromX5C($string_certText)
{
    $object_cert = openssl_x509_read($string_certText);
    $object_pubkey = openssl_pkey_get_public($object_cert);
    $array_publicKey = openssl_pkey_get_details($object_pubkey);
    return $array_publicKey['key'];
}

// JWT Validation
function validateAccessToken()
{
    $clientid = '11a0e8b8-5acd-4734-af0f-bc2fbf564f48';
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authorization = explode(' ', $headers['Authorization']);
        $accessToken = $authorization[1];
    } else {
        $accessToken = "";
    }


    if ($accessToken == "") {
        $response['status_code_header'] = 'HTTP/1.1 401 Unauthorized';
        header($response['status_code_header']);
    } else {
        $string_microsoftPublicKeyURL = 'https://login.microsoftonline.com/organizations/discovery/v2.0/keys';
        $array_publicKeysWithKIDasArrayKey = loadKeysFromAzure($string_microsoftPublicKeyURL);
        $token = JWT::decode($accessToken, $array_publicKeysWithKIDasArrayKey, array('RS256'));
        if ($token->aud == $clientid) {
            return $token;
        }
    }
}

$token = validateAccessToken();

if ($token <> "") {
    // Init Core Library

    $init = new Core;
} else {
    die();
}