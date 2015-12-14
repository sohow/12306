<?php
/**
 * Created by 不辞远.
 * User: Administrator
 * Date: 2015/4/11
 * Time: 16:42
 */
class Helper_Http
{
    public static function get($url, $header = array(),&$setcookie = "")
    {
        $ch = curl_init();
        $needheader = empty($setcookie) ? 0 : 1;
        $opt = array(
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FOLLOWLOCATION => 0,
            CURLOPT_HEADER=>$needheader
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt_array($ch, $opt);
        $result = curl_exec($ch);

        if ($needheader == 1) {
            list($header, $body) = explode("\r\n\r\n", $result, 2);
            preg_match_all('/Set-Cookie:(.*);/iU', $header, $str);
            if (!empty($str[1])) {
                $setcookie = implode('; ', $str[1]) . ";";
            }
            return $body;
        }
        return $result;
    }

    public static function post($url, $data, $header = array(),&$setcookie = "")
    {
        $ch = curl_init();
        $needheader = empty($setcookie) ? 0 : 1;
        $opt = array(
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_URL => $url,
            CURLOPT_FOLLOWLOCATION=>0,
            CURLOPT_HEADER=>$needheader
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt_array($ch, $opt);
        $result = curl_exec($ch);

        if ($needheader == 1) {
            list($header, $body) = explode("\r\n\r\n", $result, 2);
            preg_match_all('/Set-Cookie: (.*;)/iU', $header, $str);
            if (!empty($str[1])) {
                $setcookie = implode('; ', $str[1]) . ";";
            }
            return $body;
        }

        return $result;
    }
}