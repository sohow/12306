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

        //$header=array('Content-type: text/plain', 'Content-length: 100')
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

	public static function get_with_header($url, $header = array(), &$needheader = array())
	{
		$ch = curl_init();
		$opt = array(
			CURLOPT_URL => $url,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_SSL_VERIFYHOST => false,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_FOLLOWLOCATION => 0,
			CURLOPT_HEADER=> empty($needheader) ? 0 : 1
		);

		//$header=array('Content-type: text/plain', 'Content-length: 100')
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt_array($ch, $opt);
		$result = curl_exec($ch);

		if (!empty($needheader)) {
			$tmp = array();
			list($header, $body) = explode("\r\n\r\n", $result, 2);
			foreach ($needheader as $h) {
				$tmp[$h] = '';
				preg_match_all('/'.$h.':(.*)/i', $header, $str);
				if (!empty($str[1])) {
					if ($h == 'Set-Cookie') {
						foreach ($str[1] as $cookie) {
							$c = explode('; ', $cookie);
							!empty($c[0]) && $tmp[$h] .= $c[0] . '; ';
						}
					} else {
						$tmp[$h] = $str[1][0];
					}
				}
			}
			$needheader = $tmp;
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

        //$header=array('Content-type: text/plain', 'Content-length: 100')
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