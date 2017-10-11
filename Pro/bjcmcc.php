<?php
/**
 * User: sohow.cc
 * Date: 17-9-28
 * Time: 下午3:20
 */
include_once (dirname(dirname(__FILE__)) . "/Tool/Http.php");

class Cron {
	const LOGIN_SEC = '3aa4fyj1wSk5hp0XHCtW5hT3rww38F1ZGorjbER6f4ZWKI7I9JcZtrTeqhRQvW5HhWsTpqVOqOOIzkPL7KKwRxNyl/2XJ7EYIr67VMUjfldh1mbq23R6EBYTIfy5zuyUDcywFflzZ719pinEImmw5KLsVomxlr6r/BPyCIAplSopZfTSx0Fe2xlp6p0BYrZjAzcCVjsZcoQBwxc9P7OoV8GzUU6boIs/U8mG/QCJOsaKsVf5Se7pG8WcVbOqmvI0b1iLX4CjwgmDo4jg9QvGR57eeCoptC8X2FF3YAJc6sdH2PcvFi4/4ph1hICAPO2jGKq0Is+mrRyLM3myMmOfLSeJuFNjw1VSqcXOZemPuOCca2I0mH4tNk0DnTvX5XFakcPtYWLb0QgzoYeF4pGsSg==';

	const LOGIN_URL = 'https://mobilebj.cn/app/websitepwdLogin?ver=bjservice_and_5.4.0&ef=';
	const QUERY_SIGN_URL = 'http://mobilebj.cn:12065/app/querySignInfo?token=';
	const SIGN_URL = 'http://mobilebj.cn:12065/app/signIn?token=';
	const COUPONS_URL = 'http://mobilebj.cn:12065/app/queryEffCoupon?token=';
	const EXCHANGE_URL = 'http://mobilebj.cn:12065/app/exchangeCoupon?token=';

    const SHAR_URL = 'http://sc.bj.chinamobile.com/rwtx/task!insertShared.do?channel=0&token=';
    const QUERY_TIME = 'http://sc.bj.chinamobile.com/rwtx/task!queryPrizeTimes.do?token=';
    const GET_PRIZE = 'http://sc.bj.chinamobile.com/rwtx/task!doPrize.do?token=';

	const MS_COOKIE_URL = 'http://221.179.131.140/bjcss-route/forward.do?id=31&token=';
	const MS_LL_G1 = 'http://service.bj.10086.cn/sk2/app/ll/sk.action?aid=1001145';
	const MS_LL_M100 = 'http://service.bj.10086.cn/sk2/app/ll/sk.action?aid=1001266';
	const MS_LL_QUERY = 'http://service.bj.10086.cn/sk2/app/ll/querySkList.action';
	const MS_PAY_URL = 'http://service.bj.10086.cn/m/orderWap/choosePayChannelSign.action?';
	const MS_PAY_BJ = 'http://service.bj.10086.cn/paybj/business/com.asiainfo.aipay.web.DoPayAction?action=unifiedSingle';

	static $_ms_cookie = '';
	static $_token = '';

	// http://service.bj.10086.cn/sk2/app/ll/querySkList.action
	// http://221.179.131.140/bjcss-route/forward.do?id=31&token=6248a0a7dbb16fd4e07571c5317dd66e


	public static function prize($token) {
        $result = Helper_Http::get(self::SHAR_URL . $token);
        $result = json_decode($result, true);
        print_r($result);
        $result = Helper_Http::get(self::GET_PRIZE . $token);
        $result = json_decode($result, true);
        print_r($result);
    }

    public static function get_token() {
		if (empty(self::$_token)) {
			$try = 3;
			do {
				$result = Helper_Http::get(self::LOGIN_URL . self::LOGIN_SEC);
				$result = json_decode($result, true);
				print_r($result);
				$token = $result['token'];
			} while (!$token && $try--);
			self::$_token = $token;
		}
		return self::$_token;
	}

    public static function get_ms_cookie() {
    	if (empty(self::$_ms_cookie)) {
			$token = self::get_token();
			$need_header = array('Location');
			Helper_Http::get_with_header(self::MS_COOKIE_URL . $token, array(), $need_header);
			if (!empty($need_header['Location'])) {
				$need_header2 = array('Set-Cookie');
				Helper_Http::get_with_header(trim($need_header['Location']), array(), $need_header2);
				print_r($need_header2);
				$t = time() . '101';
				$need_header2['Set-Cookie'] .= "WT_FPC=id=205b248d3dc44c83968{$t}:lv={$t}:ss={$t}; ";
				self::$_ms_cookie = array('Cookie: ' . $need_header2['Set-Cookie']);
			}
		}
		return self::$_ms_cookie;
	}

	public static function ms($url) {
		$cookie = self::get_ms_cookie();
		$count = 200;
		do {
			$i = 10;
			do {
				Helper_Http::get($url, $cookie);
			} while ($i--);
			sleep(1);
		} while ($count--);

		sleep(10);
		self::ll_pay();
	}

	public static function ll_pay() {
		$cookie = self::get_ms_cookie();
		$result = Helper_Http::get(self::MS_LL_QUERY, $cookie);
		preg_match('/sign=(.*)&orderId=(.*)\'/i', $result, $rt);
		$param = array(
			'sign'		=>	$rt[1],
			'orderId' 	=>	$rt[2]
		);
		$need_header = array('Location', 'Set-Cookie');
		$result = Helper_Http::get_with_header(self::MS_PAY_URL . http_build_query($param), $cookie, $need_header);
		print_r($need_header);
		$cookie[0] .= '; ' . trim($need_header['Set-Cookie']);

		$need_header2 = array('Location', 'Set-Cookie');
		$result = Helper_Http::get_with_header(trim($need_header['Location']), $cookie, $need_header2);
		print_r($need_header2);
		$cookie[0] .= '; ' . trim($need_header2['Set-Cookie']);

		$need_header3 = array('Location', 'Set-Cookie');
		$result = Helper_Http::get_with_header(trim($need_header2['Location']), $cookie, $need_header3);
		print_r($need_header3);
		$cookie[0] .= '; ' . trim($need_header3['Set-Cookie']);


		$rt = parse_url(trim($need_header3['Location']));
		parse_str($rt['query'], $arr);
		$arr['busi'] = urldecode($arr['busi']);
		$arr['busi'] = urldecode($arr['busi']);
		$busi = json_decode($arr['busi'], true);

		$arr['pub'] = urldecode($arr['pub']);
		$arr['pub'] = urldecode($arr['pub']);
		$pub = json_decode($arr['pub'], true);

		$param = array(
			'BankId'			=>	'undefined',
			'PlatId'			=>	$pub['OriginId'],
			'AccountType'		=>	$busi['AccountType'],
			'AccountCode'		=>	$busi['AccountCode'],
			'AccountName'		=>	$busi['AccountName'],
			'Upg_OrderId'		=>	$busi['upgOrderId'],
			'PayItemType'		=>	$busi['PayItemType'],
			'PayAmount'			=>	$busi['PayAmount'],
			'ProviderId'		=>	'undefined',
			'ProviderName'		=>	urlencode($busi['ProviderName']),
			'TransactionId'		=>	$pub['TransactionId'],
			'RegionId'			=>	$pub['RegionId'],
			'OriginId'			=>	$pub['OriginId'],
			'OpenId'			=>	'undefined',
			'PayNotifyPageURL'	=>	$busi['PayNotifyPageURL'],
			'PayNotifyIntURL'	=>	$busi['PayNotifyIntURL'],
		);
		//var_dump((http_build_query($param)));
		//var_dump($cookie);
		//var_dump(self::MS_PAY_BJ);exit;
		//print_r($param);
		$result = Helper_Http::post(self::MS_PAY_BJ, http_build_query($param), array(), $cookie);
		$result = json_decode($result, true);

		$header = array('Referer: http://service.bj.10086.cn/');
		$str = Helper_Http::get($result['url'], $header);
		preg_match('/deeplink : "(.*)"/i', $str, $arr);
		$content = "https://sohow.cc/href.html?r=" . urlencode($arr[1]);
		$to = "";
		$subject = "bmcc";
		$from = "someonelse@example.com";
		$headers = "From: $from";
		mail($to,$subject, $content, $headers);
	}

	public static function sign() {
		$token = self::get_token();

		$result = Helper_Http::get(self::SIGN_URL . $token);
		$result = json_decode($result, true);
		print_r($result);

		$result = Helper_Http::get(self::COUPONS_URL . $token);
		$result = json_decode($result, true);
		print_r($result);
		if (is_array($result['coupon'])) {
			foreach ($result['coupon'] as $coupon) {
				if (isset($coupon['id'])) {
					$result = Helper_Http::get(self::EXCHANGE_URL . $token . "&couponId=" . $coupon['id']);
					$result = json_decode($result, true);
					print_r($result);
				}
			}
		}

		self::prize($token);
	}

	public static function ms_g1() {
		self::ms(self::MS_LL_G1);
	}

	public static function ms_m100() {
		self::ms(self::MS_LL_M100);
	}

	public static function main($argv) {
		call_user_func(array('Cron', $argv[1]));
	}

}

Cron::main($argv);




