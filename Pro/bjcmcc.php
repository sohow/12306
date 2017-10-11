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

	public static function start() {
		$try = 3;
		do {
			$result = Helper_Http::get(self::LOGIN_URL . self::LOGIN_SEC);
			$result = json_decode($result, true);
			print_r($result);
			$token = $result['token'];
		} while (!$token && $try--);

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

	public static function prize($token) {
        $result = Helper_Http::get(self::SHAR_URL . $token);
        $result = json_decode($result, true);
        print_r($result);
        $result = Helper_Http::get(self::GET_PRIZE . $token);
        $result = json_decode($result, true);
        print_r($result);
    }
}

Cron::start();
