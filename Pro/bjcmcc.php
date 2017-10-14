<?php
/**
 * User: sohow.cc
 * Date: 17-9-28
 * Time: 下午3:20
 */
include_once (dirname(dirname(__FILE__)) . "/Tool/Http.php");

class Cron {
	const LOGIN_SEC = '3aa4fyj1wSk5hp0XHCtW5lLjpo2CqJCxcRZ6m3wX4h2jUNozrfoxnYNdtnJ2M3Y4QW4jxxPTFDyxAi97hg/4O1A2rNvruX12dtf5RhcTXWGMrDzK6BDJNZ4ZWzMUbiwH6++9vmKa2jo9RELHMB9Xlr3gDsYdm3PqSagbqFWc2WltGDRgwV0GojvMukpjslYd0+062rhgCrxWO324P7PHS9gZDf+VWFewXUT17td+5kko1bApthnS6glFIiPmSGPzqjWxizUx/aeGRjmZ5UorUUcv1N0ZdJNQOGNbcFaQY8Wnt0xae0ho+mf/01DOKm7XCYgsnyQ7EAORtoNSCMU8drME0A+ncKHt6+63feE9OHh5di+xNqPh1XlRAmp/JPfsQ2WcH3u8p+kxEI6+mL5muMBVSAw7ZRtJyZn8vFK2RBU=';

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


	const GAME_LL_VALID = 'https://www.17jifen.com/Website/webinterface/validate!validate?redisKey=0.3733831687564939&redisValue=0.5099451103470904';
	const GAME_MOBILE_ENCODE = 'https://www.17jifen.com/Website/webinterface/businessOrder!encbjmobileSSO?randomnum=0.5099451103470904&redisKey=0.3733831687564939&bju=';
	const GAME_MOBILE_DECODE = 'https://www.17jifen.com/Website/webinterface/businessOrder!parseBjMobileSso?randomnum=0.5099451103470904&redisKey=0.3733831687564939&bju=';
	const GAME_PRIZE = 'https://www.17jifen.com/Website/webinterface/exchangePrizes!saveGiftFlowRecord?randomnum=0.5099451103470904&redisKey=0.3733831687564939&bju=';
	const GAME_PREX_PRIZE = 'https://www.17jifen.com/Website/webinterface/businessOrder!downLoadAppSso?appDownLoad.operateSystem=ANDROID&appDownLoad.appName=%E5%92%AA%E5%92%95%E6%96%97%E5%9C%B0%E4%B8%BB&appDownLoad.channelId=C0000000000&appDownLoad.activityId=A0000000039&randomnum=0.5099451103470904&redisKey=0.3733831687564939&bju=';

	const MOBILE = '13651209691';

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

	public static function game_ll() {
		Helper_Http::get(self::GAME_LL_VALID);
		$result = Helper_Http::get(self::GAME_MOBILE_ENCODE . self::MOBILE);
		$result = json_decode($result, true);
		print_r($result);

		$bju = $result['data']['bjMobile'];

		Helper_Http::get(self::GAME_LL_VALID);
		$result = Helper_Http::get(self::GAME_PREX_PRIZE . $bju);
		$result = json_decode($result, true);
		print_r($result);

		Helper_Http::get(self::GAME_LL_VALID);
		$result = Helper_Http::get(self::GAME_PRIZE . $bju);
		$result = json_decode($result, true);
		print_r($result);
	}

	public static function tool_decode() {
		Helper_Http::get(self::GAME_LL_VALID);
		$bju = 'qASBH4Ztuz3GaeQfxroQiA==';
		$result = Helper_Http::get(self::GAME_MOBILE_DECODE . $bju);
		$result = json_decode($result, true);
		print_r($result);
	}

	public static function main($argv) {
		call_user_func(array('Cron', $argv[1]));
	}

}

Cron::main($argv);




